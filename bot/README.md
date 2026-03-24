# Telegram-бот для грудничкового и раннего плавания

## Что умеет бот
- Отвечает на частые вопросы (FAQ).
- Собирает заявки на запись.
- Даёт выбор слота кнопками или свободным текстом.
- Отправляет заявку администратору в Telegram.
- Отправляет клиенту напоминания и чек-лист подготовки.
- Опционально сохраняет заявки в Google Sheets.

## Быстрый запуск
1. Создайте и активируйте виртуальное окружение.
2. Установите зависимости:
   - `pip install -r requirements.txt`
3. Скопируйте шаблон переменных:
   - `copy .env.example .env`
4. Заполните `.env`:
   - `BOT_TOKEN` - токен из BotFather.
   - `ADMIN_CHAT_ID` - ваш числовой chat ID в Telegram.
   - `BUSINESS_NAME`, `ADDRESS`, `PHONE` - контакты для клиентов.
   - `BOOKING_SLOTS` - слоты для кнопок записи через `;`
     (пример: `Пн 10:00;Пн 12:00;Ср 10:00;Сб 11:00`).
5. Запустите:
   - `python main.py`

## Настройка Google Sheets (опционально)
1. Создайте Google Service Account в Google Cloud.
2. Скачайте JSON-ключ и положите его в папку `bot` (например, `service_account.json`).
3. Дайте email этого service account доступ на редактирование вашей таблицы.
4. В `.env` укажите:
   - `GOOGLE_SHEETS_ENABLED=true`
   - `GOOGLE_SHEETS_ID=<id таблицы из URL>`
   - `GOOGLE_SHEETS_WORKSHEET=Заявки` (или имя вашего листа)
   - `GOOGLE_SERVICE_ACCOUNT_FILE=service_account.json`
5. Добавьте в Google Sheet строку заголовков (рекомендуется):
   - `booking_id, created_at_utc, parent_name, child_age, preferred_time, phone, username, user_id`

## Примечания
- База `bot.db` создается автоматически.
- Напоминания планируются на:
  - 2 часа после заявки
  - 24 часа после заявки
- Номер телефона валидируется (допустимо `+79991234567` или `89991234567`).
- Для продакшена запустите бота на постоянном хостинге.
