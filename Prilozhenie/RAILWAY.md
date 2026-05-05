# Деплой «Мама-Супер!» (Expo) на Railway

## Что получится на Railway

Публикуется **веб-версия** приложения (React Native Web): статические файлы из папки `dist` после `expo export`. Это **не** замена **Expo Go** для нативных модулей на телефоне, но позволяет открыть тот же интерфейс в браузере по публичному URL.

Локальная разработка для телефона по-прежнему: `npx expo start` и **Expo Go**.

## Настройка в Railway

1. **New Project** → **Deploy from GitHub** → ваш репозиторий (например `oseverina/pril1`).
2. **Settings → Root Directory** укажите подпапку с приложением, например: `Prilozhenie`  
   (если в репозитории папка называется `PRILOZHENIE` — укажите её имя **точно**).
3. **Variables** — переменную `PORT` **не** задавайте: её выставляет Railway.
4. Нажмите **Deploy**. Nixpacks выполнит `npm ci`, затем `npm run build` (статический экспорт в `dist`), старт: отдача `dist` через `serve`.

## Локальная проверка как на сервере

```bash
npm ci
npm run build
npx serve dist -s -l tcp://0.0.0.0:8080
```

Откройте http://localhost:8080

## Если билд на Railway падает

- Убедитесь, что **Root Directory** указывает на папку, где лежат `package.json` и `railway.toml`.
- В логах сборки проверьте ошибки Metro/web; проект проверен командой `npm run build` локально.

## Репозиторий `pril1`

Если этот код в монорепозитории, в отдельный репозиторий `pril1` можно выгрузить только папку приложения, например:

```bash
git subtree split -P Prilozhenie -b prilozhenie-only
git remote add pril1 https://github.com/oseverina/pril1.git
git push pril1 prilozhenie-only:main
```

(Ветка `prilozhenie-only` локальная; репозиторий на GitHub должен существовать и быть пустым или совместимым по истории.)
