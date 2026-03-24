import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadDotEnv() {
  // Мини-реализация .env без зависимостей
  // (нужна только для локального запуска)
  try {
    const envPath = path.join(__dirname, ".env");
    return readFile(envPath, "utf8")
      .then((txt) => {
        for (const line of txt.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const idx = trimmed.indexOf("=");
          if (idx === -1) continue;
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      })
      .catch(() => {});
  } catch {
    return Promise.resolve();
  }
}

await loadDotEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = Number(process.env.PORT || 5173);

if (!BOT_TOKEN || !CHAT_ID) {
  console.log("Не хватает переменных окружения.");
  console.log("Создайте файл .env рядом с server.js и добавьте:");
  console.log("TELEGRAM_BOT_TOKEN=...");
  console.log("TELEGRAM_CHAT_ID=...");
  console.log("PORT=5173 (необязательно)");
}

const PUBLIC_DIR = path.join(__dirname, "Vozmozhnosti");

const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"]
]);

function send(res, status, body, headers = {}) {
  const buf = typeof body === "string" ? Buffer.from(body, "utf8") : body;
  res.writeHead(status, {
    "Content-Length": buf.length,
    ...headers
  });
  res.end(buf);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}

async function readBodyJson(req, limitBytes = 50_000) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > limitBytes) throw new Error("BODY_TOO_LARGE");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(raw || "{}");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function sendToTelegram({ name, phone, page, submittedAt }) {
  if (!BOT_TOKEN || !CHAT_ID) throw new Error("TELEGRAM_NOT_CONFIGURED");

  const text =
    "<b>Новая заявка с сайта</b>\n" +
    `Имя: <b>${escapeHtml(name)}</b>\n` +
    `Телефон: <b>${escapeHtml(phone)}</b>\n` +
    (page ? `Страница: ${escapeHtml(page)}\n` : "") +
    (submittedAt ? `Время: ${escapeHtml(submittedAt)}` : "");

  const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  const tgData = await tgRes.json().catch(() => ({}));
  if (!tgRes.ok || tgData?.ok !== true) {
    const msg = tgData?.description || `Telegram error ${tgRes.status}`;
    throw new Error(msg);
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let relPath = decodeURIComponent(url.pathname);

  if (relPath === "/") relPath = "/main.html";
  if (relPath.includes("\0")) return send(res, 400, "Bad Request", { "Content-Type": "text/plain; charset=utf-8" });

  // защита от выхода из папки
  const fsPath = path.normalize(path.join(PUBLIC_DIR, relPath));
  if (!fsPath.startsWith(PUBLIC_DIR)) {
    return send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
  }

  try {
    const st = await stat(fsPath);
    if (st.isDirectory()) {
      const indexPath = path.join(fsPath, "index.html");
      const indexSt = await stat(indexPath);
      if (!indexSt.isFile()) throw new Error("NOT_FILE");
      const data = await readFile(indexPath);
      return send(res, 200, data, { "Content-Type": "text/html; charset=utf-8" });
    }

    const ext = path.extname(fsPath).toLowerCase();
    const mime = MIME.get(ext) || "application/octet-stream";
    const data = await readFile(fsPath);
    return send(res, 200, data, { "Content-Type": mime });
  } catch {
    return send(res, 404, "Not Found", { "Content-Type": "text/plain; charset=utf-8" });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/booking") {
      let body;
      try {
        body = await readBodyJson(req);
      } catch (e) {
        if (String(e?.message) === "BODY_TOO_LARGE") {
          return sendJson(res, 413, { error: "Слишком большой запрос" });
        }
        return sendJson(res, 400, { error: "Некорректный JSON" });
      }

      const name = String(body?.name || "").trim();
      const phone = String(body?.phone || "").trim();
      const page = String(body?.page || "").trim();
      const submittedAt = String(body?.submittedAt || "").trim();

      if (!name || !phone) return sendJson(res, 400, { error: "name и phone обязательны" });

      await sendToTelegram({ name, phone, page, submittedAt });
      return sendJson(res, 200, { ok: true });
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      return send(res, 405, "Method Not Allowed", { "Content-Type": "text/plain; charset=utf-8" });
    }

    return serveStatic(req, res);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Сервер запущен: http://127.0.0.1:${PORT}/`);
  console.log("Откройте /main.html или просто корень.");
});

