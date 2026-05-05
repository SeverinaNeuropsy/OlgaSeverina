# Деплой на [Railway](https://railway.app/)

В репозитории **два независимых сервиса**: сайт на Node и Telegram-бот на Python. В одном проекте Railway добавьте **два сервиса** из одного GitHub-репозитория с разными **Root Directory**.

## 1. Сайт + API заявок (`server.js`)

1. **New Project** → **Deploy from GitHub** → репозиторий `OlgaSeverina`.
2. У сервиса: **Settings → Root Directory** оставьте пустым или `.` (корень).
3. **Variables** (переменные окружения):

   | Переменная            | Описание                          |
   |-----------------------|-----------------------------------|
   | `TELEGRAM_BOT_TOKEN`  | Токен бота (как на сайте заявок)  |
   | `TELEGRAM_CHAT_ID`    | Куда слать заявки с формы         |
   | `PORT`                | Не задавайте вручную — задаёт Railway |

4. **Deploy**. После сборки откройте выданный **Public URL** — откроется `Vozmozhnosti` (корень → `main.html`).

Локально порт по умолчанию `5173`; на Railway используется переменная **`PORT`** из окружения (уже читается в `server.js`).

## 2. Telegram-бот (`bot/main.py`)

1. В том же проекте Railway: **New** → **GitHub Repo** → тот же репозиторий.
2. **Settings → Root Directory** = `bot`.
3. **Variables** — скопируйте из локального `bot/.env.example` (реальные значения только в Railway, не в Git):

   - `BOT_TOKEN`
   - `ADMIN_CHAT_ID`
   - `BUSINESS_NAME`, `ADDRESS`, `PHONE`
   - `BOOKING_SLOTS` (через `;`)
   - при необходимости блок `GOOGLE_SHEETS_*`

4. **Deploy**. Сервис без HTTP — это нормально: процесс должен работать постоянно (`python main.py`).

## 3. Expo-приложение «Мама-Супер!» (`Prilozhenie`)

1. **New** → тот же или отдельный проект → репозиторий с папкой приложения.
2. **Settings → Root Directory** = `Prilozhenie` (имя папки как в Git).
3. **Deploy**. Сборка: `npm run build` (статический веб-экспорт в `dist`), запуск: отдача `dist` через `serve`. Подробности: **`Prilozhenie/RAILWAY.md`**. Нативный **Expo Go** по-прежнему с ПК: `npx expo start`.

## Заметки

- Файлы `.env` в Git не попадают — всё секретное только в **Variables** на Railway.
- База `bot.db` на диске сервиса **не постоянная**: при пересборке может обнулиться. Для продакшена позже имеет смысл подключить том или внешнюю БД.
- Если бот и сайт используют один и тот же Telegram-бот для разных задач, убедитесь, что нигде не запущено **два** long polling к одному токену одновременно (конфликт `getUpdates`).
