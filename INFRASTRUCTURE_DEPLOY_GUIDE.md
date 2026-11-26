# JustSchool Server & Product Infrastructure Deployment Guide (`lp.justschool.me`)

> **Назначение файла:** Техническая спецификация инфраструктуры репозитория `justschool-funnel` для развертывания **новых веб-продуктов, внутренних сервисов и инструментов** (по архитектуре **Traffic Splitter** `/splitter` и **Batch Creator / JustResize Studio** `/resizer`) на сервере `https://lp.justschool.me/`.  
> Продуктовую/бизнес-логику нового инструмента подключайте отдельным файлом/промптом поверх этой инфраструктуры.

---

## 1. Общая архитектура хостинга, GitHub и Vercel

| Параметр | Значение |
| :--- | :--- |
| **Продакшн-домен** | `https://lp.justschool.me/` |
| **GitHub-репозиторий** | `advanncer/jt_land` (`git@github.com:advanncer/jt_land.git` / `https://github.com/advanncer/jt_land`) |
| **Рабочая ветка (Production)** | `main` |
| **Платформа деплоя** | Vercel (связано с GitHub: каждый `push` в `main` запускает автодеплой) |
| **Vercel Project Name** | `justschool-funnel` (из `.vercel/project.json`) |
| **Vercel Project ID** | `prj_PKUQRN4PMZRdWBxCs0J0try2UgxV` |
| **Vercel Org / Team ID** | `team_n6s8s1TcZ53u6XYm037Pxoy6` |
| **Стек фронтенда** | React 19 (`^19.2.0`), TypeScript (`~5.9.3`), Vite (`^7.2.4`), Tailwind CSS v4 (`^4.1.18`, `@tailwindcss/postcss`) |
| **Стек бэкенда** | Vercel Serverless Functions (Node.js ESM в папке `/api/*.js`, `"type": "module"` в `package.json`) |
| **Команда сборки** | `npm run build` (`tsc -b && vite build` → результат в `dist/`) |
| **Локальный запуск** | `npm run dev` (`vite`) |

### Ключевой принцип устройства `lp.justschool.me`
Репозиторий работает как **Multi-Page Application (MPA)** на базе единого Vite + набора независимых Vercel Serverless Functions:
1. Каждый отдельный продукт или лендинг лежит в **собственной папке** в корне (например: `splitter/`, `resizer/`, `b2b_calc/`, `job_justtech/`) или внутри категории (`eng-adult/`, `eng-child/`, `blogger/`).
2. Все точки входа (HTML-страницы) собираются одним билдом через `vite.config.ts` (`build.rollupOptions.input`), а общие JS/CSS-бандлы складываются в корневой `dist/assets/`.
3. Красивые публичные URL на домене `https://lp.justschool.me/<slug>` настраиваются через `rewrites` в `vercel.json`.
4. Любой `.js`-файл в корневой папке `/api/` автоматически становится serverless API-эндпоинтом по адресу `https://lp.justschool.me/api/<filename>`.

---

## 2. Пошаговое развертывание нового продукта (Checklist)

Предположим, вы разворачиваете новый продукт по адресу `https://lp.justschool.me/my-product`.

### Шаг 1. Создайте директорию фронтенда `/<product_slug>/`
Минимальная структура нового продукта (аналогично `splitter/` и `resizer/`):

```text
<product_slug>/
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    └── index.css
```

**Требования к файлам:**
1. **`<product_slug>/index.html`:**
   * Обязательно подключайте точку входа через относительный путь `./src/main.tsx`:
     ```html
     <!doctype html>
     <html lang="uk">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Product Name | JustSchool</title>
       </head>
       <body>
         <div id="root"></div>
         <script type="module" src="./src/main.tsx"></script>
       </body>
     </html>
     ```
2. **`<product_slug>/src/main.tsx`:**
   ```tsx
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App";
   import "./index.css";

   ReactDOM.createRoot(document.getElementById("root")!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```
3. **`<product_slug>/src/index.css`:**
   * В проекте используется Tailwind CSS v4 (через `@tailwindcss/postcss`), поэтому достаточно:
     ```css
     @import "tailwindcss";
     ```
4. **Статические файлы и ассеты:**
   * Если нужны общие картинки/иконки/скрипты по фиксированному URL, кладите их в `public/` (например `public/assets/...` будет доступен на `https://lp.justschool.me/assets/...`).
   * Изображения, импортируемые через `import img from "./assets/..."`, Vite автоматически упакует в `dist/assets/` с хешем и отдаст с immutable cache.

### Шаг 2. Зарегистрируйте продукт в `vite.config.ts`
Откройте `vite.config.ts` в корне и добавьте новую запись в `build.rollupOptions.input`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // ... существующие входы ...
        myProduct: resolve(__dirname, "<product_slug>/index.html"),
      },
    },
  },
});
```

> **Важно про TypeScript (`tsconfig.app.json`):**  
> При `npm run build` сначала выполняется `tsc -b`, а затем `vite build`. Сейчас в `tsconfig.app.json` в массиве `"include"` явно указан ограниченный список старых папок (`eng-adult/lp1/src` и т.д.), поэтому `tsc -b` проверяет только их, а `vite build` собирает все входы из `vite.config.ts`. Тем не менее, пишите строго типизированный TypeScript без ошибок, на случай если `include` будет расширен. Если добавляете новый пакет в `package.json`, он должен попадать в `dependencies` (а не только `devDependencies`, если используется в runtime).

### Шаг 3. Настройте маршрутизацию в `vercel.json`
Добавьте правила в начало массива `"rewrites"` в `vercel.json` (до общих перехватов):

```json
{
  "source": "/<product_slug>",
  "destination": "/<product_slug>/index.html"
},
{
  "source": "/<product_slug>/",
  "destination": "/<product_slug>/index.html"
},
{
  "source": "/<product_slug>/:path*",
  "destination": "/<product_slug>/index.html"
}
```

**Зачем нужны все три правила:**
* `/<product_slug>` и `/<product_slug>/` — чтобы работали ссылки как без слеша, так и со слешем в конце (иначе на `/<product_slug>/` без правила может вылететь 404).
* `/<product_slug>/:path*` → `/<product_slug>/index.html` — если у продукта есть клиентский роутинг/вложенные URL, они будут открывать SPA, тогда как скомпилированные Vite-скрипты и стили лежат в корневом `/assets/*.js` и `/assets/*.css` и грузятся напрямую.
* **Исключение:** если внутри `/<product_slug>/:path*` лежат реальные статические файлы (не SPA-роуты), тогда вместо `index.html` используйте `"destination": "/<product_slug>/:path*"` (как это сделано для лендингов `eng-adult/lp1/:path*`).

### Шаг 4. Создайте Serverless API в `/api/` (если нужен бэкенд)
Создайте файл `/api/<product_slug>.js` (или несколько эндпоинтов).  
Отдельный rewrite в `vercel.json` для `/api/<name>` **не требуется** — Vercel автоматически маппит `https://lp.justschool.me/api/<name>`.

Если нужны красивые короткие или динамические маршруты без префикса `/api/` (как `/s/:slug` в Traffic Splitter), добавьте rewrite в `vercel.json`:
```json
{
  "source": "/p/:id",
  "destination": "/api/my_router?id=:id"
}
```

---

## 3. Стандарты создания Backend API (`/api/*.js`)

Поскольку в корневом `package.json` стоит `"type": "module"`, все серверные функции **обязаны** использовать синтаксис ES Modules (`import` / `export default`).

### 3.1. Базовый шаблон Serverless Function
```javascript
// api/<product_slug>.js
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://wwkjigmyqihpobsuaroj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(req, res) {
  // 1. Обязательные CORS-заголовки
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query } = req;
  const action = query.action || "info";

  // 2. Безопасный парсинг body (Vercel может передать string или object)
  let body = {};
  try {
    if (req.body) {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  try {
    // Пример роутинга по ?action=...
    if (action === "health") {
      return res.status(200).json({ ok: true, service: "<product_slug>" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[API Error]:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
```

### 3.2. Важные технические ограничения Vercel Serverless в этом проекте
1. **Нет постоянного локального диска / общей памяти между инстансами:**
   * Serverless-инстансы «холодные» и эфемерны. Любое состояние, которое должно сохраняться между пользователями и деплоями, **нужно писать в Supabase** (через REST API `fetch` к `${SUPABASE_URL}/rest/v1/...`), а не хранить только в переменной в памяти.
   * *Примечание:* в `api/split.js` используется 10-секундный memory-cache поверх Supabase (`CACHE_TTL_MS = 10000`) для ускорения, а в `api/resizer.js` базовые пресеты и счётчики частично держатся в памяти, но для продакшн-данных нового продукта всегда опирайтесь на Supabase.
2. **Минимум серверных npm-пакетов:**
   * В `api/` сейчас не используются тяжёлые Node-пакеты вроде `@supabase/supabase-js` или `googleapis` — всё работает через нативный `fetch` и встроенный модуль `crypto` (так холодный старт быстрый, а сборка не падает). Придерживайтесь прямых REST-вызовов к Supabase PostgREST (`/rest/v1/...`).
3. **Размер payload на Vercel Functions:**
   * Лимит тела запроса Vercel Serverless Function — **4.5 MB**. Если продукт работает с изображениями, видео или ZIP-архивами (как Batch Creator / `resizer`), вся тяжёлая обработка файлов (`Canvas`, ресайз, `ZIP`) должна выполняться **на клиенте в браузере**, а на сервер передаются только метаданные/настройки/статистика.

---

## 4. Референс-архитектуры наших продуктовых сервисов

### 4.1. Архитектура №1: Traffic Splitter (`splitter/` + `api/split.js` + `api/s_router.js`)
**Что это:** внутренний маркетинговый дашборд для A/B-тестирования URL + серверный редиректор коротких ссылок `/s/:slug` + клиентский трекер конверсий `public/js-tracker.js`.

**Как устроено инфраструктурно:**
1. **Фронтенд (`/splitter`):**
   * Закрыт паролем команды (`localStorage` ключ `js_splitter_auth`).
   * Ходит по REST API на `/api/split` (`GET` список экспериментов, `POST` создание/обновление, `DELETE` сброс/удаление).
   * На лету считает статистическую значимость (Two-proportion Z-test, p-value, confidence) и генерирует UTM-ссылки.
2. **Хранение данных в Supabase:**
   * Таблица `smart_split_experiments`: `id`, `name`, `slug`, `status`, `created_at`, `updated_at`, `variants` (JSONB-массив `{ id, name, url, weight, visits, leads, paid }`).
   * Запись и обновление через PostgREST upsert:
     `POST ${SUPABASE_URL}/rest/v1/smart_split_experiments` с заголовком `"Prefer": "resolution=merge-duplicates"`.
3. **Серверный роутер (`vercel.json`: `/s/:slug` → `/api/s_router?slug=:slug`):**
   * Фильтрует ботов и превью-краулеры (`facebookexternalhit`, `Facebot`, `TelegramBot`, `Googlebot`, `headlesschrome` и т.д.), чтобы превью в рекламе не накручивали визиты.
   * Поддерживает принудительный просмотр варианта (`?variant=var_a` / `?preview=var_b` / `?reset=1`).
   * Ставит **Sticky Session Cookie** `js_split_<slug>` на 30 дней (`Path=/; Max-Age=2592000; SameSite=Lax`), чтобы повторный заход пользователя вёл на тот же вариант.
   * Выбирает вариант по накопительному весу (`weight`), инкрементит `visits`, пробрасывает все исходные query-параметры (UTM, `fbclid`) + добавляет `split_id` и `split_variant`, и делает `307` редирект.
4. **Отслеживание конверсий (`api/track-conversion.js` + `public/js-tracker.js`):**
   * `public/js-tracker.js` перехватывает `fetch` и `XHR` на `/api/submit`, `/webhook/` и `n8n.justschool.me`, автоматически подклеивает `split_id` / `split_variant` из URL, `sessionStorage` или cookie и отправляет beacon на `/api/track-conversion`.

---

### 4.2. Архитектура №2: Batch Creator / JustResize Studio (`resizer/` + `api/resizer.js`)
**Что это:** веб-приложение пакетной генерации и ресайза рекламных креативов с экспортом в ZIP.

**Как устроено инфраструктурно:**
1. **Разделение нагрузки Client vs Server:**
   * Вся генерация изображений, умный кроп (saliency), GDN 2x Retina, unsharp mask, наложение водяных знаков и сборка ZIP-архива выполняются **в браузере** (`resizer/src/engine.ts`), чтобы не упираться в лимиты памяти/времени Vercel Serverless (10s / 4.5MB).
   * Сервер (`api/resizer.js`) лёгкий и обслуживает только:
     * `?action=login` (POST) — проверка пароля (`process.env.RESIZER_PASSWORD`) и выдача токена сессии (`js_resizer_token`).
     * `?action=verify` — проверка сессии.
     * `?action=presets` (GET/POST) — общие пресеты форматов и бейджей команды.
     * `?action=stats` (GET/POST) — трекинг продуктивности (`totalBatches`, `totalCreatives`, `totalAssetsRendered`, `totalHoursSaved`).
2. **Локальное хранилище настроек браузера:**
   * Текущие настройки (`justresize_settings_v2`), пользовательские форматы (`justresize_custom_formats_v2`) и флаг авторизации (`js_resizer_auth`, `js_resizer_token`) хранятся в `localStorage`.
3. **Загрузка бренд-ассетов:**
   * Логотипы и вотермарки лежат в `public/assets/` и подгружаются по относительным путям `/assets/logo-horizontal-white.svg`, `/assets/logo-horizontal-black.svg`, `/assets/logo-sticker.svg`.

---

### 4.3. Архитектура №3: Keep-Alive для Supabase (Cron + GitHub Actions)
Бесплатные/базовые инстансы Supabase уходят в паузу через 7 дней неактивности. Чтобы база никогда не засыпала, в проекте настроены два независимых механизма:
1. **Vercel Cron (`vercel.json`):**
   ```json
   "crons": [
     {
       "path": "/api/keep-alive",
       "schedule": "0 7 * * *"
     }
   ]
   ```
   Вызывает `api/keep-alive.js`, который пингует таблицы `smart_split_experiments` и `landing_leads`.
2. **GitHub Actions (`.github/workflows/supabase-keepalive.yml`):**
   Запускается каждые 2 дня в 06:00 UTC (`cron: '0 6 */2 * *'`), напрямую пингует Supabase REST API и `https://lp.justschool.me/api/keep-alive`.

---

## 5. Переменные окружения, базы данных и внешние интеграции

### 5.1. Supabase (Основная БД проекта)
* **Project URL:** `https://wwkjigmyqihpobsuaroj.supabase.co`
* **Env-переменные на Vercel:**
  * `SUPABASE_URL`
  * `SUPABASE_SERVICE_ROLE_KEY` (в ряде существующих `/api/*.js` есть base64-fallback в коде, но для новых эндпоинтов предпочтительно использовать `process.env.SUPABASE_SERVICE_ROLE_KEY`)
* **Существующие таблицы:**
  * `landing_leads` — заявки со всех воронок и трекера
  * `smart_split_experiments` — A/B-эксперименты Traffic Splitter
* Для нового продукта создайте новую таблицу в том же проекте Supabase (или отдельную схему/таблицу через SQL Editor в Supabase) и работайте с ней через `fetch(`${SUPABASE_URL}/rest/v1/<table_name>`, ...)` с заголовками `apikey` и `Authorization: Bearer ${SUPABASE_KEY}`.

### 5.2. Google Sheets API v4 (если продукту нужна выгрузка в таблицы)
* Реализовано в `api/googleSheets.js` без внешних библиотек — чистый Node.js `crypto.createSign("RSA-SHA256")` для получения OAuth2 JWT-токена (`https://oauth2.googleapis.com/token`).
* **Системный Service Account:** `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com` (для записи в любую Google Таблицу достаточно расшарить её на этот email с правами «Редактор»).
* **Env-переменные:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, ID таблиц (`B2B_UKRSIB_SPREADSHEET_ID` и др.).

### 5.3. Защитный пароль внутренних инструментов команды
* Внутренние инструменты (`/splitter`, `/resizer`) используют простую командную авторизацию с проверкой на бэкенде/клиенте (`process.env.RESIZER_PASSWORD`, текущий командный пароль по умолчанию задан в `api/resizer.js` и `splitter/src/App.tsx`). Для нового внутреннего инструмента используйте аналогичную проверку через `/api/<product>?action=login` с чтением пароля из `process.env.<PRODUCT>_PASSWORD` (и fallback при необходимости).

### 5.4. Лид-интеграции (если новый продукт собирает лиды)
* Не шлите лиды из браузера напрямую в `n8n` / CRM / `eSputnik` (из-за CORS и AdBlock). Шлите в `/api/submit` (`api/submit.js`), который сам направит данные в Supabase, NocoDB (`NOCODB_TOKEN`, `NOCODB_TABLE_ID`), n8n/Creatio, eSputnik (`ESPUTNIK_API_KEY`) и Google Sheets.
* Если новый продукт **НЕ должен** создавать розничные сделки в Creatio и контакты в eSputnik — передавайте `skipCreatio: true` и `skipEsputnik: true` (или обрабатывайте заявки в отдельном `/api/<product>.js`).

---

## 6. Проверка перед деплоем и релиз

После добавления кода нового продукта выполните перед коммитом:

```bash
# 1. Проверить сборку TypeScript + Vite (обязательно!)
npm run build

# 2. Убедиться, что dist/<product_slug>/index.html создан
ls -la dist/<product_slug>/index.html

# 3. Закоммитить и запушить в main -> Vercel автоматически задеплоит на lp.justschool.me
git add <product_slug>/ api/ vite.config.ts vercel.json
git commit -m "feat(<product_slug>): deploy new product infrastructure"
git push origin main
```

Через 30–60 секунд после `git push origin main` проверьте доступность:
* `https://lp.justschool.me/<product_slug>` → HTTP 200 (HTML-оболочка продукта)
* `https://lp.justschool.me/<product_slug>/` → HTTP 200
* `https://lp.justschool.me/api/<product_slug>` → HTTP 200 (JSON от serverless API)
