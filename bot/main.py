import asyncio
import contextlib
import logging
import os
import re
import sqlite3
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

import gspread
from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters.state import StateFilter
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, Message
from google.oauth2.service_account import Credentials


def load_dotenv(path: str | None = None) -> None:
    if path is None:
        path = str(Path(__file__).resolve().parent / ".env")
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8-sig") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip()


@dataclass
class Settings:
    bot_token: str
    admin_chat_id: int
    business_name: str
    address: str
    phone: str
    google_sheets_enabled: bool
    google_sheets_id: str
    google_sheets_worksheet: str
    google_service_account_file: str
    slots: list[str]

    @staticmethod
    def from_env() -> "Settings":
        load_dotenv()
        token = os.getenv("BOT_TOKEN", "").strip()
        admin_chat_id_raw = os.getenv("ADMIN_CHAT_ID", "").strip()
        business_name = os.getenv("BUSINESS_NAME", "NeuroKursy Swim").strip()
        address = os.getenv("ADDRESS", "Адрес не задан").strip()
        phone = os.getenv("PHONE", "Телефон не задан").strip()
        google_sheets_enabled = os.getenv("GOOGLE_SHEETS_ENABLED", "false").strip().lower() == "true"
        google_sheets_id = os.getenv("GOOGLE_SHEETS_ID", "").strip()
        google_sheets_worksheet = os.getenv("GOOGLE_SHEETS_WORKSHEET", "Заявки").strip()
        google_service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json").strip()
        slots_raw = os.getenv("BOOKING_SLOTS", "Пн 10:00;Пн 12:00;Ср 10:00;Сб 11:00").strip()
        slots = [item.strip() for item in slots_raw.split(";") if item.strip()]
        if not slots:
            slots = ["Пн 10:00", "Пн 12:00", "Ср 10:00", "Сб 11:00"]

        if not token:
            raise ValueError("BOT_TOKEN is required. Put it in .env file.")
        if not admin_chat_id_raw:
            raise ValueError("ADMIN_CHAT_ID is required. Put it in .env file.")

        try:
            admin_chat_id = int(admin_chat_id_raw)
        except ValueError as exc:
            raise ValueError("ADMIN_CHAT_ID must be a numeric chat ID.") from exc

        return Settings(
            bot_token=token,
            admin_chat_id=admin_chat_id,
            business_name=business_name,
            address=address,
            phone=phone,
            google_sheets_enabled=google_sheets_enabled,
            google_sheets_id=google_sheets_id,
            google_sheets_worksheet=google_sheets_worksheet,
            google_service_account_file=google_service_account_file,
            slots=slots,
        )


class BookingForm(StatesGroup):
    parent_name = State()
    child_age = State()
    preferred_time = State()
    phone = State()


class GoogleSheetsClient:
    def __init__(self, settings: Settings):
        self.enabled = settings.google_sheets_enabled
        self.settings = settings
        self.worksheet = None
        if self.enabled:
            self._init_client()

    def _init_client(self) -> None:
        if not self.settings.google_sheets_id:
            raise ValueError("GOOGLE_SHEETS_ID is required when GOOGLE_SHEETS_ENABLED=true.")
        if not os.path.exists(self.settings.google_service_account_file):
            raise ValueError(
                "Google service account file not found: "
                f"{self.settings.google_service_account_file}"
            )
        scopes = ["https://www.googleapis.com/auth/spreadsheets"]
        creds = Credentials.from_service_account_file(
            self.settings.google_service_account_file,
            scopes=scopes,
        )
        client = gspread.authorize(creds)
        sheet = client.open_by_key(self.settings.google_sheets_id)
        self.worksheet = sheet.worksheet(self.settings.google_sheets_worksheet)

    def append_booking(
        self,
        booking_id: int,
        created_at: str,
        parent_name: str,
        child_age: str,
        preferred_time: str,
        phone: str,
        username: Optional[str],
        user_id: int,
    ) -> None:
        if not self.enabled or self.worksheet is None:
            return
        username_display = f"@{username}" if username else "-"
        self.worksheet.append_row(
            [
                booking_id,
                created_at,
                parent_name,
                child_age,
                preferred_time,
                phone,
                username_display,
                user_id,
            ],
            value_input_option="USER_ENTERED",
        )


class Database:
    def __init__(self, db_path: str = "bot.db"):
        self.connection = sqlite3.connect(db_path)
        self.connection.row_factory = sqlite3.Row
        self.create_tables()

    def create_tables(self) -> None:
        cursor = self.connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                username TEXT,
                parent_name TEXT NOT NULL,
                child_age TEXT NOT NULL,
                preferred_time TEXT NOT NULL,
                phone TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                send_at TEXT NOT NULL,
                reminder_type TEXT NOT NULL,
                is_sent INTEGER NOT NULL DEFAULT 0,
                UNIQUE (booking_id, reminder_type),
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
            )
            """
        )
        self.connection.commit()

    def save_booking(
        self,
        user_id: int,
        username: Optional[str],
        parent_name: str,
        child_age: str,
        preferred_time: str,
        phone: str,
    ) -> int:
        now_utc = datetime.now(timezone.utc).isoformat()
        cursor = self.connection.cursor()
        cursor.execute(
            """
            INSERT INTO bookings (user_id, username, parent_name, child_age, preferred_time, phone, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, username, parent_name, child_age, preferred_time, phone, now_utc),
        )
        self.connection.commit()
        return int(cursor.lastrowid)

    def schedule_default_reminders(self, booking_id: int, user_id: int) -> None:
        now = datetime.now(timezone.utc)
        plans = [
            ("prep_2h", now + timedelta(hours=2)),
            ("prep_24h", now + timedelta(hours=24)),
        ]
        cursor = self.connection.cursor()
        for reminder_type, send_at in plans:
            cursor.execute(
                """
                INSERT OR IGNORE INTO reminders (booking_id, user_id, send_at, reminder_type, is_sent)
                VALUES (?, ?, ?, ?, 0)
                """,
                (booking_id, user_id, send_at.isoformat(), reminder_type),
            )
        self.connection.commit()

    def due_reminders(self) -> list[sqlite3.Row]:
        now_utc = datetime.now(timezone.utc).isoformat()
        cursor = self.connection.cursor()
        cursor.execute(
            """
            SELECT id, user_id, reminder_type
            FROM reminders
            WHERE is_sent = 0 AND send_at <= ?
            ORDER BY send_at ASC
            """,
            (now_utc,),
        )
        return cursor.fetchall()

    def mark_reminder_sent(self, reminder_id: int) -> None:
        cursor = self.connection.cursor()
        cursor.execute("UPDATE reminders SET is_sent = 1 WHERE id = ?", (reminder_id,))
        self.connection.commit()


def main_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Записаться", callback_data="book")],
            [InlineKeyboardButton(text="Цены", callback_data="prices")],
            [InlineKeyboardButton(text="Возраст и противопоказания", callback_data="age_rules")],
            [InlineKeyboardButton(text="Как проходит занятие", callback_data="session_info")],
            [InlineKeyboardButton(text="Адрес и контакты", callback_data="contacts")],
            [InlineKeyboardButton(text="Частые вопросы", callback_data="faq")],
        ]
    )


def faq_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Со скольки месяцев можно?", callback_data="faq_age")],
            [InlineKeyboardButton(text="Что взять с собой?", callback_data="faq_checklist")],
            [InlineKeyboardButton(text="Сколько длится занятие?", callback_data="faq_duration")],
            [InlineKeyboardButton(text="Назад в меню", callback_data="menu")],
        ]
    )


def slots_menu(slots: list[str]) -> InlineKeyboardMarkup:
    rows = []
    for i, slot in enumerate(slots):
        rows.append([InlineKeyboardButton(text=slot, callback_data=f"slot_{i}")])
    rows.extend(
        [
            [InlineKeyboardButton(text="Свой вариант", callback_data="slot_custom")],
            [InlineKeyboardButton(text="Назад в меню", callback_data="menu")],
        ]
    )
    return InlineKeyboardMarkup(inline_keyboard=rows)


def is_valid_phone(phone: str) -> bool:
    normalized = re.sub(r"[()\-\s]", "", phone)
    return bool(re.fullmatch(r"\+?\d{10,15}", normalized))


def text_for_reminder(reminder_type: str) -> str:
    if reminder_type == "prep_2h":
        return (
            "Напоминание о подготовке к плаванию.\n\n"
            "- Возьмите подгузник для бассейна, полотенце, сменную одежду.\n"
            "- Покормите ребенка за 60-90 минут до занятия.\n"
            "- Если есть признаки болезни, напишите администратору."
        )
    return (
        "Напоминание за сутки до занятия.\n\n"
        "Подготовьте набор для бассейна и проверьте самочувствие ребенка.\n"
        "Если нужно перенести время, просто ответьте на это сообщение."
    )


async def send_menu(message: Message) -> None:
    await message.answer("Выберите, чем я могу помочь:", reply_markup=main_menu())


async def myid_handler(message: Message) -> None:
    if not message.from_user or not message.chat:
        return
    uid = message.from_user.id
    cid = message.chat.id
    await message.answer(
        f"Ваш user id: <code>{uid}</code>\n"
        f"chat id этого чата: <code>{cid}</code>\n\n"
        "Для заявок в личные сообщения подставьте в .env:\n"
        f"<code>ADMIN_CHAT_ID={cid}</code>"
    )


async def start_handler(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        "Добро пожаловать в мир безопасного и бережного плавания для малышей.\n"
        "Я помогу быстро записаться, выбрать удобное время и подготовиться к занятию без стресса."
    )
    await send_menu(message)


async def callback_router(
    callback: CallbackQuery,
    state: FSMContext,
    settings: Settings,
) -> None:
    data = callback.data or ""
    await callback.answer()

    if data == "menu":
        await state.clear()
        if callback.message:
            await callback.message.answer("Главное меню:", reply_markup=main_menu())
        return

    if data == "book":
        await state.set_state(BookingForm.parent_name)
        if callback.message:
            await callback.message.answer("Как вас зовут? (имя родителя)")
        return

    if data == "prices" and callback.message:
        await callback.message.answer(
            "Цены:\n"
            "- Разовое занятие: 2200 руб.\n"
            "- Абонемент 4 занятия: 8000 руб.\n"
            "- Абонемент 8 занятий: 15000 руб."
        )
        return

    if data == "age_rules" and callback.message:
        await callback.message.answer(
            "Рекомендуемый возраст: с 2 месяцев.\n"
            "Противопоказания: острое заболевание, температура, кожные инфекции.\n"
            "При сомнениях лучше уточнить у педиатра."
        )
        return

    if data == "session_info" and callback.message:
        await callback.message.answer(
            "Занятие длится 30 минут.\n"
            "Инструктор работает индивидуально с ребенком и родителями.\n"
            "Мы подбираем нагрузку по возрасту и состоянию малыша."
        )
        return

    if data == "contacts" and callback.message:
        await callback.message.answer(
            f"{settings.business_name}\n"
            f"Адрес: {settings.address}\n"
            f"Телефон: {settings.phone}"
        )
        return

    if data == "faq" and callback.message:
        await callback.message.answer("Выберите вопрос:", reply_markup=faq_menu())
        return

    faq_answers = {
        "faq_age": (
            "Обычно стартуем с 2 месяцев после консультации с педиатром. "
            "Подбираем мягкий формат адаптации под возраст и темперамент малыша."
        ),
        "faq_checklist": (
            "Возьмите подгузник для бассейна, полотенце, пеленку, сменную одежду и воду. "
            "Перед занятием отправим удобный чек-лист."
        ),
        "faq_duration": (
            "Индивидуальное занятие длится 30 минут - этого достаточно для пользы и без переутомления."
        ),
    }
    if data in faq_answers and callback.message:
        await callback.message.answer(faq_answers[data], reply_markup=faq_menu())


async def booking_parent_name(message: Message, state: FSMContext) -> None:
    await state.update_data(parent_name=message.text.strip())
    await state.set_state(BookingForm.child_age)
    await message.answer("Сколько ребенку месяцев/лет?")


async def booking_child_age(message: Message, state: FSMContext, settings: Settings) -> None:
    await state.update_data(child_age=message.text.strip())
    await state.set_state(BookingForm.preferred_time)
    await message.answer(
        "Выберите удобный слот:",
        reply_markup=slots_menu(settings.slots),
    )


async def booking_preferred_time(message: Message, state: FSMContext) -> None:
    await state.update_data(preferred_time=message.text.strip())
    await state.set_state(BookingForm.phone)
    await message.answer("Оставьте контактный телефон для связи.")


async def booking_slot(callback: CallbackQuery, state: FSMContext, settings: Settings) -> None:
    data = callback.data or ""
    await callback.answer()
    if not callback.message:
        return
    if data == "slot_custom":
        await callback.message.answer("Напишите удобный день и время текстом.")
        return
    slot_index_raw = data.removeprefix("slot_")
    if not slot_index_raw.isdigit():
        await callback.message.answer("Не удалось распознать слот. Выберите вариант еще раз.")
        await callback.message.answer("Доступные слоты:", reply_markup=slots_menu(settings.slots))
        return
    slot_index = int(slot_index_raw)
    if slot_index < 0 or slot_index >= len(settings.slots):
        await callback.message.answer("Слот устарел. Выберите, пожалуйста, заново.")
        await callback.message.answer("Доступные слоты:", reply_markup=slots_menu(settings.slots))
        return
    selected_slot = settings.slots[slot_index]
    await state.update_data(preferred_time=selected_slot)
    await state.set_state(BookingForm.phone)
    await callback.message.answer(f"Вы выбрали: {selected_slot}\nТеперь отправьте ваш телефон.")


async def booking_phone(
    message: Message,
    state: FSMContext,
    db: Database,
    bot: Bot,
    settings: Settings,
    sheets_client: GoogleSheetsClient,
) -> None:
    user_data = await state.get_data()
    parent_name = user_data.get("parent_name", "")
    child_age = user_data.get("child_age", "")
    preferred_time = user_data.get("preferred_time", "")
    phone = message.text.strip()
    if not is_valid_phone(phone):
        await message.answer(
            "Похоже, номер введен в неверном формате.\n"
            "Отправьте телефон в формате +79991234567 или 89991234567."
        )
        return
    username = message.from_user.username if message.from_user else None
    user_id = message.from_user.id if message.from_user else 0

    booking_id = db.save_booking(
        user_id=user_id,
        username=username,
        parent_name=parent_name,
        child_age=child_age,
        preferred_time=preferred_time,
        phone=phone,
    )
    db.schedule_default_reminders(booking_id=booking_id, user_id=user_id)
    created_at = datetime.now(timezone.utc).isoformat()

    try:
        sheets_client.append_booking(
            booking_id=booking_id,
            created_at=created_at,
            parent_name=parent_name,
            child_age=child_age,
            preferred_time=preferred_time,
            phone=phone,
            username=username,
            user_id=user_id,
        )
    except Exception as exc:  # noqa: BLE001
        logging.warning("Failed to append booking to Google Sheets: %s", exc)

    telegram_line = f"Telegram: @{username}" if username else "Telegram username нет"
    admin_message = (
        "Новая заявка на плавание\n\n"
        f"ID: {booking_id}\n"
        f"Родитель: {parent_name}\n"
        f"Возраст ребенка: {child_age}\n"
        f"Удобное время: {preferred_time}\n"
        f"Телефон: {phone}\n"
        f"{telegram_line}"
    )
    await bot.send_message(settings.admin_chat_id, admin_message)

    await message.answer(
        "Спасибо! Заявку приняла.\n"
        "Скоро свяжемся с вами для подбора времени.\n"
        "А пока я пришлю напоминания по подготовке."
    )
    await state.clear()
    await send_menu(message)


async def reminders_worker(bot: Bot, db: Database) -> None:
    while True:
        due = db.due_reminders()
        for row in due:
            reminder_id = int(row["id"])
            user_id = int(row["user_id"])
            reminder_type = str(row["reminder_type"])
            text = text_for_reminder(reminder_type)

            try:
                await bot.send_message(user_id, text)
                db.mark_reminder_sent(reminder_id)
            except Exception as exc:  # noqa: BLE001
                logging.warning("Failed to send reminder %s: %s", reminder_id, exc)
        await asyncio.sleep(30)


async def main() -> None:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    logging.basicConfig(level=logging.INFO)
    settings = Settings.from_env()

    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)
    db = Database()
    sheets_client = GoogleSheetsClient(settings)

    async def callback_router_with_settings(callback: CallbackQuery, state: FSMContext) -> None:
        await callback_router(callback, state, settings)

    async def booking_child_age_with_settings(message: Message, state: FSMContext) -> None:
        await booking_child_age(message, state, settings)

    async def booking_slot_with_settings(callback: CallbackQuery, state: FSMContext) -> None:
        await booking_slot(callback, state, settings)

    async def booking_phone_with_deps(message: Message, state: FSMContext) -> None:
        await booking_phone(message, state, db, bot, settings, sheets_client)

    dp.message.register(start_handler, CommandStart())
    dp.message.register(myid_handler, Command("myid"))
    dp.callback_query.register(
        callback_router_with_settings,
        F.data.in_(
            {
                "menu",
                "book",
                "prices",
                "age_rules",
                "session_info",
                "contacts",
                "faq",
                "faq_age",
                "faq_checklist",
                "faq_duration",
            }
        ),
    )
    dp.callback_query.register(
        booking_slot_with_settings,
        StateFilter(BookingForm.preferred_time),
        F.data.startswith("slot_"),
    )
    dp.message.register(booking_parent_name, BookingForm.parent_name)
    dp.message.register(booking_child_age_with_settings, BookingForm.child_age)
    dp.message.register(booking_preferred_time, BookingForm.preferred_time)
    dp.message.register(booking_phone_with_deps, BookingForm.phone)

    reminder_task = asyncio.create_task(reminders_worker(bot, db))
    try:
        await dp.start_polling(bot)
    finally:
        reminder_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await reminder_task


if __name__ == "__main__":
    asyncio.run(main())
