(() => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const statusEl = document.getElementById("booking-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(text, kind) {
    if (!statusEl) return;
    statusEl.style.display = "block";
    statusEl.textContent = text;
    statusEl.style.color =
      kind === "error"
        ? "rgba(255, 210, 210, .95)"
        : kind === "success"
          ? "rgba(210, 255, 220, .95)"
          : "rgba(255,255,255,.9)";
  }

  function normalizePhone(v) {
    return String(v || "").trim().replace(/\s+/g, " ");
  }

  async function sendTelegramMessage({ name, phone, page, submittedAt }) {
    const token = window.TG_BOT_TOKEN;
    const chatId = window.TG_CHAT_ID;

    if (!token || !chatId) {
      throw new Error("TELEGRAM_NOT_CONFIGURED");
    }

    const text =
      `Новая заявка с сайта\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      (page ? `Страница: ${page}\n` : "") +
      (submittedAt ? `Время: ${submittedAt}` : "");

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok !== true) {
      throw new Error(data?.description || `Telegram error HTTP ${res.status}`);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = String(form.elements.name?.value || "").trim();
    const phone = normalizePhone(form.elements.phone?.value || "");

    if (!name || !phone) {
      setStatus("Пожалуйста, заполните имя и телефон.", "error");
      return;
    }

    const payload = {
      name,
      phone,
      page: location.href,
      submittedAt: new Date().toISOString(),
    };

    const prevText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";
    }
    setStatus("Отправляем заявку…");

    try {
      await sendTelegramMessage(payload);

      form.reset();
      setStatus("Заявка отправлена. Мы скоро свяжемся с вами.", "success");
    } catch (err) {
      if (String(err?.message) === "TELEGRAM_NOT_CONFIGURED") {
        setStatus(
          "Не настроен Telegram. Заполните TG_BOT_TOKEN и TG_CHAT_ID в telegram-config.js",
          "error",
        );
        return;
      }
      setStatus(
        "Не удалось отправить заявку. Попробуйте позже или позвоните нам.",
        "error",
      );
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevText;
      }
    }
  });
})();
