# 🚀 Глобальна база знань, методологія та технічна специфікація воронок JustSchool (`justschool-funnel`)

> **Призначення документа:**  
> Цей документ є єдиним джерелом істини (Single Source of Truth) для:
> 1. **Передачі проєкту новому спеціалісту / AI-інженеру** для роботи у **Claude Code, OpenAI Codex, Cursor або Antigravity**.
> 2. **Швидкого запуску нових лендингів, квізів та B2B-воронок** за стандартами JustSchool (включно з готовими системними інструкціями та шаблонами промптів).
> 3. **Розробки власного Конструктора лендингів та квізів (JustSchool Funnel Builder)** — містить повну архітектуру, JSON-схеми даних, логіку генерації, дизайн-токени та контракти інтеграцій із CRM.

---

## ЗМІСТ

1. [Філософія та продуктова логіка воронок JustSchool](#1-філософія-та-продуктова-логіка-воронок-justschool)
2. [Технічна архітектура репозиторію (`justschool-funnel`)](#2-технічна-архітектура-репозиторію-justschool-funnel)
3. [Повний каталог існуючих лендингів та маршрутів](#3-повний-каталог-існуючих-лендингів-та-маршрутів)
4. [Дизайн-система JustSchool (`ds/`) та правила адаптивності](#4-дизайн-система-justschool-ds-та-правила-адаптивності)
5. [Інтеграція з CRM, базами даних та онбордингом (`/api/submit`)](#5-інтеграція-з-crm-базами-даних-та-онбордингом-apisubmit)
6. [Стандарт компонента телефону (`PhoneInput`) та захист форм](#6-стандарт-компонента-телефону-phoneinput-та-захист-форм)
7. [Налаштування аналітики: Facebook Pixel, GTM, GA4 та Smart Splitter](#7-налаштування-аналітики-facebook-pixel-gtm-ga4-та-smart-splitter)
8. [Архітектура B2B-лендингів та інтерактивних калькуляторів](#8-архітектура-b2b-лендингів-та-інтерактивних-калькуляторів)
9. [Покрокова інструкція: Як підняти свій перший лендинг з нуля](#9-покрокова-інструкція-як-підняти-свій-перший-лендинг-з-нуля)
10. [Методика промптингу та бібліотека готових промптів (Claude / Codex)](#10-методика-промптингу-та-бібліотека-готових-промптів-claude--codex)
11. [Готовий системний файл `CLAUDE.md` / `AGENTS.md` для розгортання в AI-агентах](#11-готовий-системний-файл-claudemd--agentsmd-для-розгортання-в-ai-агентах)
12. [Технічне завдання та архітектура для розробки Конструктора Лендингів](#12-технічне-завдання-та-архітектура-для-розробки-конструктора-лендингів)

---

## 1. Філософія та продуктова логіка воронок JustSchool

### 1.1. Чому ми будуємо Quiz-Funnel замість класичних статичних лендингів
Уся лідогенерація JustSchool (таргетована реклама Meta/FB/Instagram, email-розсилки eSputnik, інфлюенс-маркетинг, B2B-партнерства) будується навколо **інтерактивних квіз-воронок** та **гібридних лендингів-квізів**.

**Основні принципи підходу:**
1. **Принцип мікро-зобов'язань (Micro-commitments):** Користувачу набагато легше натиснути на кнопку вибору віку або мети вивчення мови, ніж одразу заповнювати форму з 3 полів на першому екрані. Пройшовши 5–6 простих кроків, користувач інвестує час і психологічно готовий залишити контакти, щоб отримати результат.
2. **Персоналізація та ілюзія праці (Labor Illusion):** Після питань ми показуємо проміжні екрани цінності (Interstitials) та анімований екран розрахунку програми (`Loader 0% -> 100%`), який демонструє, що система підбирає викладача, розклад та фіксує персональну знижку саме під відповіді користувача.
3. **Мобільний пріоритет (Mobile-First 90%+ трафіку):** Усі воронки проєктуються насамперед під вертикальний екран смартфона (`max-w-lg mx-auto`, `min-h-[100dvh]`), з великими тап-зонами (мінімум `48px–56px` висоти кнопок), миттєвим автопереходом при виборі одного варіанта та відсутністю зайвого горизонтального скролу.
4. **Дві ключові варіації першого екрана (BF0 vs BF1 / V2 vs V1):**
   * **Варіація V1 (Коротка / «В один екран» / BF1):** Максимально сфокусований перший екран без скролу. Містить: компактний бейдж акції, чистий візуальний банер (без фейкових намальованих кнопок!), велику контрастну інтерактивну кнопку дії прямо під банером (`Розпочати зараз →`), компактний перемикач аудиторії (`Для дорослих` / `Для дитини`) та 3 короткі буліти довіри. Дає максимальний CTR переходу в квіз.
   * **Варіація V2 (Повна детальна / Standard / BF0):** Повноцінний лендинг на кроці `step === 0`. Містить: Hero-картку з оффером і ціною, банер, перемикач аудиторії, блок «Що входить у програму», картки переваг/бонусів (наприклад, розмовні клуби), блок живих відгуків студентів та фіксовану/повторну кнопку старту квізу. Підходить для холоднішої аудиторії або email-трафіку, якому потрібно більше деталей перед стартом.
5. **Чистота маршрутів (Route-based Variants):** Замість складних GET-параметрів перемикання версій (`?v=1`, `?v=standard`), кожна бойова варіація повинна мати власний чистий URL-маршрут (наприклад, `/black-friday` для повної версії та `/bf-v1` для короткої версії в 1 екран), щоб медіабайєри могли лити трафік без ризику поломки параметрів.
6. **Динамічний `leadType`:** Якщо воронка підтримує декілька напрямів (наприклад, дорослі та діти), перемикач аудиторії на сторінці автоматично оновлює GET-параметр `?leadType=english-for-adults` або `?leadType=english-for-children` через `window.history.replaceState` і підставляє відповідний набір питань квізу.

### 1.2. Типова анатомія кроків квіз-воронки (State Machine)
Кожен лендинг реалізується як скінченний автомат станів (`const [step, setStep] = useState<number>(0)`):
* **Крок 0 (`Hero`):** Перший екран (повний або в 1 екран) + вибір аудиторії (`adult` / `child`).
* **Крок 1 (`Audience`, опційно):** Окремий екран вибору «Для кого навчання?», якщо не обрано на Hero.
* **Кроки 2–4 (`Single-Choice Questions`):** Питання з одним варіантом відповіді (Вік, Поточний рівень, Головна мета). При кліку на картку варіанта відповідь записується у `answers` і відбувається **миттєвий автоперехід** на наступний крок (`advance()`).
* **Крок 5 (`Multi-Choice Question`):** Питання з множинним вибором (наприклад, «Які аспекти хочете прокачати насамперед?»: Розмовна мова, Граматика, На слух, Словниковий запас) + кнопка `Далі →`.
* **Кроки 6–7 (`Logistics Questions`):** Комфортна інтенсивність (`2 рази`, `3 рази`, `Інтенсив`) та зручний час занять (`Ранок`, `День`, `Вечір`, `Вихідні`).
* **Крок 8 (`Value Interstitial`):** Проміжний мотиваційний екран перед розрахунком (наприклад, презентація подарунка, розмовних клубів або методики JustSchool з реальними цифрами вигоди) + кнопка `Розрахувати мою програму →`.
* **Крок 9 (`Animated Loader`):** Екран автоматичного формування плану (триває ~2–2.5 секунди, прогрес-бар `0% -> 100%`, поетапна поява галочок: *Аналізуємо цілі → Підбираємо програму → Активуємо спецціну*). По завершенню автоматично переводить на Крок 10.
* **Крок 10 (`Lead Capture Form + Plan Summary`):** Фінальний екран. Зверху показує резюме сформованого плану (обрана програма, рівень, інтенсивність, зафіксована знижка/бонус), знизу — форма з 3 полями (`Ім'я`, `Email`, `PhoneInput` з прапорцем країни) та кнопкою відправки.
* **Після відправки (`Post-Submit`):**
  * **Стандартна B2C воронка:** Миттєвий редірект в особистий кабінет / онбординг (`result.redirectUri` від n8n або fallback на `https://id.justschool.me/login?email=...` / `https://student.justschool.me/onboarding`).
  * **Telegram-воронка / HR-рекрутинг:** Перехід на фінальний екран подяки (`Step 11`) з кнопкою переходу у Telegram-канал/бот (наприклад, `https://t.me/+L_g5QbqbbqsxYzU6`) або автоматичний редірект.
  * **B2B-воронка / Калькулятор:** Відкриття повного дашборду аудиту або екрана підтвердження корпоративної заявки.

---

## 2. Технічна архітектура репозиторію (`justschool-funnel`)

### 2.1. Технологічний стек
* **GitHub Репозиторій:** `git@github.com:advanncer/jt_land.git` (гілка `main`)
* **Продакшн-домен (Vercel):** `https://lp.justschool.me`
* **Frontend:** React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/postcss`) + Lucide React (іконки) + Framer Motion (анімації).
* **Збірка (Bundler):** Vite v7 у режимі **Multi-Page Application (MPA)** через `rollupOptions.input` у файлі `vite.config.ts`.
* **Backend:** Vercel Serverless Functions (Node.js ESM у директорії `/api/*.js`).
* **Бази даних та сховища:**
  * **Supabase (`landing_leads`, `smart_split_experiments`):** Основна реляційна база даних для всіх лідів та статистики A/B-спліттера.
  * **NocoDB (`mwyhw2a79xopbef`):** Резервна таблиця лідів.
  * **Google Sheets API v4 (через Service Account JWT):** Прямий запис корпоративних B2B-лідів та HR-анкет у Google Таблиці.

### 2.2. Структура директорій проєкту
```text
justschool-funnel/
├── GEMINI.md                     # Обов'язкові інженерні правила репозиторію (CRM + PhoneInput)
├── CLAUDE.md                     # Системні інструкції для Claude Code / Codex / Cursor
├── PLAYBOOK_AND_CONSTRUCTOR_SPEC.md # Ця глобальна документація та специфікація конструктора
├── package.json                  # Залежності та скрипти (dev, build, lint)
├── vite.config.ts                # Реєстрація всіх HTML-точок входу (rollupOptions.input)
├── vercel.json                   # Маршрутизація (rewrites), редіректи (307) та кеш-заголовки
├── public/
│   ├── js-tracker.js             # Універсальний клієнтський трекер атрибуції та A/B спліттера
│   └── favicon.svg               # Фавікон JustSchool
├── api/                          # Vercel Serverless Functions (Бекенд)
│   ├── submit.js                 # ЄДИНИЙ хаб прийому та маршрутизації лідів (Supabase, NocoDB, n8n/Creatio, eSputnik, Google Sheets)
│   ├── googleSheets.js           # Пряма інтеграція з Google Sheets API v4 через Service Account JWT
│   ├── split.js                  # CRUD API для A/B тестів та запису конверсій у Supabase
│   ├── s_router.js               # Серверний роутер коротких посилань /s/:slug (Sticky cookies + Bot filter)
│   ├── track-conversion.js       # Ендпоінт для зовнішніх конверсій від js-tracker.js
│   └── tg-lead.js                # Додатковий обробник для Telegram-воронок
├── eng-adult/                    # Воронки англійської для дорослих (та універсальні акції)
│   ├── black-friday/             # Акційна воронка Black Friday (підтримує /black-friday та /bf-v1)
│   │   ├── index.html            # HTML-точка входу з GTM, FB Pixel та js-tracker.js
│   │   └── src/
│   │       ├── main.tsx          # React mount
│   │       ├── App.tsx           # Повна логіка воронки (BF0 + BF1)
│   │       ├── data.ts           # Питання квізу (ADULT_QUESTIONS, CHILD_QUESTIONS) та відгуки
│   │       ├── PhoneInput.tsx    # Стандартний мультикраїнний компонент телефону
│   │       ├── index.css         # Підключення ds/styles.css та Tailwind v4
│   │       ├── assets/           # Банери (десктоп/мобайл) та логотипи
│   │       └── ds/               # Еталонна Дизайн-Система JustSchool (токени + UI-компоненти)
│   ├── quiz-plan-v2/             # Еталонний квіз персонального плану на базі Дизайн-Системи (ds/)
│   ├── quiz-plan/                # Перша версія квізу персонального плану
│   ├── 120-days/                 # Воронка «Англійська за 120 днів»
│   ├── lp1/                      # Класичний лендинг-квіз «16 тижнів і ти англомовний»
│   ├── lp1-tg/                   # Варіація з переходом у Telegram
│   ├── lp_pains/                 # Pain-орієнтований лендинг (болі у вивченні англійської)
│   ├── lp-check-up/              # Тест на визначення рівня англійської (світла тема)
│   ├── lp-check-up-dark/         # Тест на визначення рівня англійської (темна тема)
│   ├── lp-reviews/               # Сторінка соціальних доказів / відгуків + тест рівня
│   ├── lp-js-adult/              # Чистий квіз-опитувальник для дорослих
│   ├── main/                     # Копія головної сторінки курсу
│   ├── b2b_ukrsib/               # Корпоративний B2B-портал для UKRSIBBANK BNP Paribas
│   ├── b2b_metinvest/            # Корпоративний B2B-портал для Метінвест («Сталевий Бонус»)
│   └── b2b_brsm/                 # Корпоративний B2B-портал для БРСМ-Нафта
├── eng-child/                    # Воронки англійської для дітей та підлітків
│   ├── quiz-plan/                # Персональний план навчання для дитини
│   ├── quiz-bo-v1/               # Квіз підбору ідеального репетитора (темний/яскравий)
│   ├── quiz-bo-v1-white/         # Квіз підбору репетитора (світла тема)
│   ├── quiz-bo-v2/               # Оновлений квіз підбору репетитора v2
│   └── lp-js-child/              # Базовий дитячий квіз
├── prog/                         # Воронки програмування для дітей
│   └── quiz-plan/                # Квіз підбору курсу IT/програмування для дітей
├── free-products/                # Безкоштовні лід-магніти та ігрові механіки
│   ├── combo-lead-magnit/        # Кореневий лід-магніт сайту (відкривається на /)
│   └── astro-english/            # Гейміфікований астро-квіз «Хто твоє Мовне Альтер-Его?»
├── blogger/                      # Мультипредметні воронки під блогерів та сезонні розпродажі
│   ├── halloween/                # Мультипредметна акція Halloween Sale до -50%
│   └── lp1/                      # Базовий блогерський лендинг
├── b2b_calc/                     # Інтерактивний B2B HR-калькулятор втрат часу та грошей
├── job_justtech/                 # Рекрутингова воронка набору в команду JustTech (з записом у Sheets + Telegram)
└── splitter/                     # Адмін-панель керування A/B-тестами та короткими посиланнями (/splitter)
```

---

## 3. Повний каталог існуючих лендингів та маршрутів

Кожен лендинг має:
1. Власну папку з `index.html`, `src/main.tsx`, `src/App.tsx`.
2. Запис у `vite.config.ts` (`rollupOptions.input`).
3. Правило `rewrites` у `vercel.json`, яке прив'язує короткий або повний URL до `/path/to/index.html`.

| Категорія | Публічні маршрути на `lp.justschool.me` | Шлях у репозиторії | Назва в `vite.config.ts` | Призначення та особливості |
| :--- | :--- | :--- | :--- | :--- |
| **Акції (Black Friday)** | `/black-friday`, `/bf` | `eng-adult/black-friday` | `engAdultBlackFriday` | **BF0 (Повна версія):** детальний лендинг + квіз (дорослі/діти) |
| **Акції (Black Friday 1-Screen)** | `/bf-v1`, `/black-friday-v1` | `eng-adult/black-friday` | `engAdultBlackFriday` | **BF1 (Коротка версія в 1 екран):** чистий банер + жовта кнопка + квіз |
| **Англійська (Дорослі)** | `/eng-adult/quiz-plan-v2`, `/quiz-plan-v2` | `eng-adult/quiz-plan-v2` | `engAdultQuizPlanV2` | **Еталон дизайн-системи (`ds/`):** персональний план навчання v2 |
| **Англійська (Дорослі)** | `/eng-adult/quiz-plan`, `/quiz-plan` | `eng-adult/quiz-plan` | `engAdultQuizPlan` | Персональний план навчання v1 |
| **Англійська (Дорослі)** | `/eng-adult/120-days`, `/120-days` | `eng-adult/120-days` | `engAdultLp120Days` | Промо-воронка «Англійська за 120 днів» |
| **Англійська (Дорослі)** | `/eng-adult/lp1`, `/eng_adult` | `eng-adult/lp1` | `engAdultLp1` | Базовий хіт «16 тижнів і ти англомовний» |
| **Англійська (Дорослі -> TG)** | `/eng-adult/lp1-tg`, `/eng_adult_tg` | `eng-adult/lp1-tg` | `engAdultLp1Tg` | Воронка з переведенням ліда в Telegram |
| **Англійська (Дорослі Pains)** | `/eng-adult/lp_pains`, `/eng_adult_nql_pains` | `eng-adult/lp_pains` | `engAdultLpPains` | Воронка через болі вивчення мови (NQL) |
| **Англійська (Check-Up)** | `/eng-adult/lp-check-up`, `/check-up` | `eng-adult/lp-check-up` | `engAdultLpCheckUp` | Інтерактивний тест рівня англійської (Light) |
| **Англійська (Check-Up Dark)** | `/eng-adult/lp-check-up-dark`, `/check-up-dark` | `eng-adult/lp-check-up-dark` | `engAdultLpCheckUpDark` | Інтерактивний тест рівня англійської (Dark) |
| **Англійська (Відгуки)** | `/eng-adult/lp-reviews`, `/reviews` | `eng-adult/lp-reviews` | `engAdultLpReviews` | Відгуки студентів + інтерактивний тест рівня |
| **Англійська (Квіз)** | `/eng-adult/lp-js-adult`, `/js-adult` | `eng-adult/lp-js-adult` | `engAdultLpJsAdult` | Чистий квіз для дорослих |
| **Англійська (Діти)** | `/eng-child/quiz-plan`, `/child-quiz-plan` | `eng-child/quiz-plan` | `engChildQuizPlan` | Персональний план англійської для дітей |
| **Англійська (Діти)** | `/eng-child/quiz-bo-v1`, `/child-bo-v1` | `eng-child/quiz-bo-v1` | `engChildQuizBoV1` | Підбір репетитора для дитини v1 |
| **Англійська (Діти)** | `/eng-child/quiz-bo-v1-white` | `eng-child/quiz-bo-v1-white` | `engChildQuizBoV1White` | Підбір репетитора для дитини (світла тема) |
| **Англійська (Діти)** | `/eng-child/quiz-bo-v2`, `/child-bo-v2` | `eng-child/quiz-bo-v2` | `engChildQuizBoV2` | Підбір репетитора для дитини v2 |
| **Англійська (Діти)** | `/eng-child/lp-js-child`, `/js-child` | `eng-child/lp-js-child` | `engChildLpJsChild` | Чистий квіз для дітей |
| **Програмування (Діти)** | `/prog/quiz-plan`, `/prog-quiz-plan` | `prog/quiz-plan` | `progQuizPlan` | Квіз підбору курсу програмування для дітей |
| **B2B Корпоративні** | `/b2b_ukrsib`, `/ukrsib`, `/eng-adult/b2b_ukrsib` | `eng-adult/b2b_ukrsib` | `engAdultB2bUkrsib` | Корпоративний портал для співробітників UKRSIBBANK |
| **B2B Корпоративні** | `/b2b_metinvest`, `/metinvest`, `/eng-adult/b2b_metinvest` | `eng-adult/b2b_metinvest` | `engAdultB2bMetinvest` | Корпоративний портал для співробітників Метінвест |
| **B2B Корпоративні** | `/b2b_brsm`, `/brsm`, `/eng-adult/b2b_brsm` | `eng-adult/b2b_brsm` | `engAdultB2bBrsm` | Корпоративний портал для співробітників БРСМ-Нафта |
| **B2B Калькулятор** | `/b2b_calc`, `/b2b-calc`, `/b2b-hr-calc` | `b2b_calc` | `b2bCalc` | Інтерактивний калькулятор втрат HR-рутини + запис на Демо |
| **Рекрутинг (HR)** | `/job_justtech`, `/job-justtech` | `job_justtech` | `jobJusttech` | Воронка найму з записом у Google Sheets та переходом у Telegram |
| **Блогери / Сезонні** | `/blogger`, `/blogger/halloween`, `/halloween` | `blogger/halloween` | `bloggerHalloween` | Мультипредметна воронка під інфлюенсерів |
| **Лід-магніти** | `/` або `/free-products/combo-lead-magnit` | `free-products/combo-lead-magnit` | `comboLeadMagnit` | Комбо лід-магніт на кореневому домені |
| **Лід-магніти (Ігрові)** | `/free-products/astro-english`, `/freeproduct` | `free-products/astro-english` | `astroEnglish` | Астро-тест «Хто твоє Мовне Альтер-Его?» |
| **Інфраструктура** | `/splitter`, `/s/:slug` | `splitter` + `api/s_router.js` | `splitter` | Дашборд та роутер A/B-тестування лендингів |

---

## 4. Дизайн-система JustSchool (`ds/`) та правила адаптивності

Еталонна дизайн-система розташована у `eng-adult/quiz-plan-v2/src/ds/` та `eng-adult/black-friday/src/ds/`. При створенні будь-якого нового лендингу необхідно копіювати папку `src/ds/` до нового проєкту та імпортувати `@import "./ds/styles.css";` у `src/index.css`.

### 4.1. Кольорові та семантичні токени (`tokens/colors.css` & `tokens/semantic.css`)
* **Фірмовий помаранчевий (Brand Orange):**
  * `--orange-25: #FFF5EB` (теплий фон сторінки `--surface-page-warm`)
  * `--orange-50: #FFE0CA`
  * `--orange-100: #FBC59F` (м'які рамки бейджів та карток)
  * `--orange-500: #F56600` (основний колір бренду `--brand`)
  * `--orange-600: #D95B00` (hover-стан `--brand-hover`)
  * `--hot-orange-500: #F54500` (акцентний гарячий помаранчевий `--brand-accent`)
* **Додаткові палітри:**
  * **Green (Успіх / Підтвердження):** `--green-50: #EAF5E0`, `--green-500: #87D142`, `--green-700: #5EA61B` (`--success`)
  * **Violet (Інфо / Клуби / Бонуси):** `--violet-50: #E4E4FA`, `--violet-800: #7070EE`, `--violet-950: #4141F2` (`--info`)
  * **Yellow (Акції / Black Friday / Зірки):** `--yellow-50: #FBE1AD`, `--yellow-500: #F5A300`, `#FBC314` (фірмовий жовтий для кнопок Black Friday на темному фоні `#1C160C`)
  * **Base (Нейтральні та текст):** `--base-50: #FFFFFF`, `--base-100: #F8F8F8`, `--base-200: #F0F0F0`, `--base-300: #E0E0E0`, `--base-600: #808080` (`--text-muted`), `--base-700: #585858` (`--text-secondary`), `--base-900: #141414` (`--text-body`), `--base-950: #000000` (`--text-strong`).

### 4.2. Типографіка та компоненти (`ds/components/core/`)
* **Основний шрифт (`--font-core`):** `Montserrat` (ваги 400, 500, 600, 700, 800, 900). Для акційних заголовків Black Friday додатково підключається `Unbounded`.
* **Готові React-компоненти в `src/ds/components/core/`:**
  * `<Button variant="primary" | "secondary" | "ghost" size="lg" | "md" fullWidth>` — кнопки з фірмовими скругленнями та micro-interactions (`active:scale-[0.98]`).
  * `<Card variant="raised" | "outlined" | "sunken" padding="md" | "lg">` — контейнери для блоків та варіантів відповідей.
  * `<Badge tone="brand" | "success" | "violet" | "warning">` — статусні плашки.
  * `<Tag>` — теги характеристик курсу.
  * `<BrandShape>` — фірмові декоративні векторні елементи JustSchool.

### 4.3. Правила верстки та адаптивності
1. **Контейнер воронки:** `w-full max-w-lg mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col items-center` — гарантує ідеальний вигляд як на iPhone SE (`375px`), так і на десктопі.
2. **Адаптивні банери (`<picture>`):** Завжди використовуйте `<picture>` з `<source media="(min-width: 640px)" srcSet={bannerDesk} />` та `<img src={bannerMob} />`. Оптимізуйте важкі PNG у JPEG (`quality=88`, ширина `1920px` для десктопу та `1100px` для мобайлу), щоб вага банера становила `120–300 KB` замість `4+ MB` (критично для LCP на мобільному інтернеті).
3. **Шапка (Sticky Header):** Висота `h-14`, зліва кнопка `← Назад` (прихована на кроках `0`, `9`, `10`), по центру логотип `JustSchool`, справа індикатор прогресу `1/6` або бейдж акції. Під шапкою під час питань квізу рендериться тонкий прогрес-бар `h-1` кольору `var(--brand)`.

---

## 5. Інтеграція з CRM, базами даних та онбордингом (`/api/submit`)

### 5.1. Головне правило безпеки та надійності
> **ЗАБОРОНЕНО** відправляти запити з браузера напряму на зовнішні вебхуки (`n8n.justschool.me`, `esputnik.com`, `nocodb.com`, `supabase.co`). Через CORS, AdBlock, Brave Shields та Safari ITP частина лідів втрачається.  
> **УСІ ФОРМИ** зобов'язані відправляти `POST`-запит виключно на локальний серверний ендпоінт **`/api/submit`**.

### 5.2. Що робить `/api/submit.js` під капотом
Коли фронтенд робить `POST /api/submit`, серверна функція виконує наступний пайплайн паралельно через `Promise.allSettled`:

1. **Нормалізація номера телефону:** Видаляє всі нецифрові символи (пробіли, дужки, дефіси) і приводить телефон до строгого плаского формату `+` та цифри (наприклад, `+380952150831` або `+48500123456`). Це обов'язкова вимога валідатора Creatio CRM.
2. **Атрибуція A/B-спліттера:** Якщо передано `split_id` та `split_variant`, викликає `recordConversion(splitId, splitVariant, "lead")`, збільшуючи лічильник лідів відповідного варіанта в Supabase.
3. **Запис у Supabase (`landing_leads` — Основна БД):** Зберігає повний запис ліда (`id`, `title`, `name`, `phone`, `email`, `qa`, `ip`, `country`, `dialogue_url`, `split_id`, `split_variant`).
4. **Запис у NocoDB (`mwyhw2a79xopbef` — Резервна БД):** Дублює лід у NocoDB.
5. **Відправка у Creatio CRM через n8n Webhook:**
   * Ендпоінт: `https://n8n.justschool.me/webhook/19be50df-0410-4330-8dcb-3797fa703c56`
   * **Важливо:** Для корпоративних B2B-воронок (`b2b_ukrsib`, `b2b_metinvest`, `b2b_brsm`, `b2b_calc`) або якщо передано прапорець `skipCreatio: true` / `b2b: true`, відправка в n8n/Creatio **автоматично вимикається**, щоб не створювати роздрібні угоди у відділі продажів B2C.
6. **Відправка у eSputnik (`/api/v1/contacts`):**
   * Створює або оновлює контакт (`dedupeOn: "email_or_sms"`), передаючи кастомні поля:
     * `235251`: Джерело ліда (`ai_landing`)
     * `295300`: URL лендингу (`dialogueUrl`)
     * `235152`: Ім'я (`name`)
     * `235245`: Телефон (`phone`)
     * `235246`: Email (`email`)
     * `235249`: Тип учня (`adult` або `child` — визначається автоматично з `lead_type` або URL)
   * Має вбудований анти-фейк фільтр `isDummyPhone(phone)` (відсікає номери типу `0000000` або неіснуючі коди операторів України) та автоматичний retry тільки з Email, якщо eSputnik відхилив SMS-канал.
   * Вимикається для B2B та HR-рекрутингу (`job_justtech`).
7. **Прямий запис у Google Таблиці (`api/googleSheets.js`):**
   * Використовує системний Google Service Account: `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com`.
   * Автоматично маршрутизує спеціалізовані ліди у відповідні книги та вкладки Google Sheets (детальніше у Розділі 8).
8. **Повернення `redirectUri` для онбордингу та захист від 404:**
   * n8n повертає JSON із полем `redirectUri` (персональне посилання на онбординг студента).
   * Якщо клієнт вже зареєстрований у базі школи, n8n може повернути порожній `redirectUri: ""` або застарілий маршрут `https://justschool.me/uk/onboarding` (який віддає 404).
   * `/api/submit.js` та фронтенд автоматично перехоплюють це і перенаправляють такого користувача на безпечний URL авторизації:
     * Якщо є email: `https://id.justschool.me/login?email=${encodeURIComponent(email)}`
     * Інакше: `https://student.justschool.me/onboarding`
   * Крім того, у `vercel.json` налаштовано серверні 307-редіректи з `/onboarding` та `/uk/onboarding` на `https://student.justschool.me/onboarding`.

### 5.3. Стандартний контракт Payload для `POST /api/submit`
```typescript
const payload = {
  name: name.trim(),
  phone: rawPhone, // Наприклад "+380951234567"
  email: email.trim(),
  qa: qaParts.join(' ||| '), // Рядок відповідей квізу, розділений " ||| "
  dialogueUrl: window.location.href,
  dialogueName: 'Назва воронки (напр. Black Friday 2026 Quiz)',
  dialogueId: 'унікальний_slug_воронки',
  utm_source: urlParams.get('utm_source') || 'direct',
  utm_medium: urlParams.get('utm_medium') || 'cpc',
  utm_campaign: urlParams.get('utm_campaign') || '',
  utm_term: urlParams.get('utm_term') || '',
  utm_content: urlParams.get('utm_content') || '',
  utm_subject: 'English', // Або 'Programming', 'Math'
  subject: 'English',
  lead_type: activeLeadType, // 'english-for-adults' | 'english-for-children' | 'programming-for-children' | 'math-for-children'
  Lead_type: activeLeadType, // Дублюємо з великої літери для сумісності з усіма гілками n8n
};
```

### 5.4. Формат рядка `qa` (відповіді на квіз)
Першим елементом масиву `qaParts` **завжди** має йти IP та країна користувача у форматі `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`, оскільки `/api/submit.js` та `api/googleSheets.js` парсять це регулярним виразом для заповнення колонок `IP` та `Country`:
```typescript
const qaParts: string[] = [
  `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
  `[НАЗВА ВОРОНКИ / ВАРІАНТ]`,
  `Аудиторія: ${audience === 'adult' ? 'Дорослий' : 'Дитина'}`,
  `Вік: ${answers.age || 'Не вказано'}`,
  `Рівень: ${answers.level || 'Не вказано'}`,
  `Головна мета: ${answers.goal || 'Не вказано'}`,
  `Навички: ${answers.aspects || 'Не вказано'}`,
  `Інтенсивність: ${answers.intensity || 'Не вказано'}`,
  `Зручний час: ${answers.schedule || 'Не вказано'}`,
];
```

---

## 6. Стандарт компонента телефону (`PhoneInput`) та захист форм

Ці правила зафіксовані у `GEMINI.md` і є **суворо обов'язковими** для всіх форм:

### 6.1. Мультикраїнна маска та GEO-детекція (`PhoneInput.tsx`)
Оскільки значна частина української аудиторії перебуває в ЄС, США та Великій Британії:
1. **Автовизначення країни за IP:** При монтуванні `App.tsx` викликається `fetch('https://ipinfo.io/json')`, звідки береться `data.country` (наприклад, `"UA"`, `"PL"`, `"DE"`) і передається у `<PhoneInput initialCountry={geoCountry} />`.
2. **Клікабельний селектор прапорця:** Зліва всередині поля телефону рендериться кнопка з прапорцем поточної країни та стрілкою `▼`, яка відкриває список країн:
   * 🇺🇦 Україна (`+380`) — сувора перевірка 12 цифр + валідація реального коду оператора (`50, 63, 66, 67, 68, 73, 91..99`)
   * 🇵🇱 Польща (`+48`) — сувора перевірка 11 цифр
   * 🇩🇪 Німеччина (`+49`), 🇷🇴 Румунія (`+40`), 🇸🇰 Словаччина (`+421`), 🇨🇿 Чехія (`+420`), 🇬🇧 UK (`+44`) — динамічна перевірка 9–15 цифр
   * 🇺🇸 США/Канада (`+1`) — сувора перевірка 11 цифр
3. **Keystroke Auto-Detection («Магія на льоту»):** Якщо користувач починає вводити або вставляє номер з кодом країни (`380...`, `48...`, `420...`) або локальний `0...` (для UA автоматично підставляється `380`), `PhoneInput` миттєво перемикає прапорець, маску та правило валідації.
4. **Pre-fill on Focus:** При фокусі на порожнє поле автоматично підставляється префікс активної країни (`+380 `). При втраті фокусу (`onBlur`), якщо введено лише код країни без цифр номера, поле очищується.

### 6.2. Захист від подвійної відправки (Double Submission Guard)
Кожна форма зобов'язана мати стан `const [isSubmitting, setIsSubmitting] = useState(false)`:
* На початку обробника `handleSubmit`: `if (isSubmitting) return;`
* Усі поля вводу (`input`, `PhoneInput`) отримують `disabled={isSubmitting}` та клас `disabled:opacity-50`.
* Кнопка відправки отримує `disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()}` і змінює текст на **`"Надсилаємо заявку..."`** під час активного запиту.
* Встановлюється 7-секундний таймер безпеки (`setTimeout`), який гарантує редірект користувача в онбординг, навіть якщо мережа повільна.

---

## 7. Налаштування аналітики: Facebook Pixel, GTM, GA4 та Smart Splitter

### 7.1. Обов'язкові коди в `index.html` кожного лендингу

У `<head>` кожного `index.html` прописуються:
1. **Google Tag Manager (`GTM-P6BDRT25`):**
```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-P6BDRT25");
</script>
<!-- End Google Tag Manager -->
```
2. **Facebook Pixel (`9067851526565677`):**
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '9067851526565677');
  fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->
```
3. **Універсальний трекер спліттера JustSchool:**
```html
<script src="https://lp.justschool.me/js-tracker.js" async></script>
```
4. У `<body>` — відповідні `<noscript>` блоки для Facebook Pixel та GTM.

### 7.2. Покрокова розмітка подій для Google Analytics / GTM (`dataLayer`)
Для побудови воронки конверсій по кожному кроку квізу в GA4 та GTM, у `App.tsx` додається `useEffect`, який спрацьовує при кожній зміні `step`:
```typescript
useEffect(() => {
  const dl = (window.dataLayer = window.dataLayer || []);
  dl.push({
    event: 'quiz_step_reach',
    quiz_name: 'eng-adult-black-friday', // Унікальне ім'я квізу
    quiz_variant: variant,               // 'v1' або 'standard'
    step_number: step,                   // Числовий номер кроку (0..10)
    audience: audience,                  // 'adult' або 'child'
    step_name:
      step === 0
        ? `hero_screen_${variant}`
        : step === 1
        ? 'audience_selection'
        : step === 8
        ? 'clubs_value_interstitial'
        : step === 9
        ? 'loader_calculation'
        : step === 10
        ? 'lead_form_gate'
        : `question_${step}`,
  });
}, [step, audience, variant]);
```
А при успішній відправці форми (`res.ok` у `handleSubmitLead`):
```typescript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_success',
  quiz_name: 'eng-adult-black-friday',
  quiz_variant: variant,
  audience: audience,
});
if (typeof window.fbq === 'function') {
  window.fbq('track', 'Lead');
}
```

### 7.3. Як працює система A/B-тестування (`Smart Splitter` на `/splitter` та `/s/:slug`)
* **Адмін-панель:** `https://lp.justschool.me/splitter`
* Дозволяє створити спліт-експеримент із коротким посиланням вигляду `https://lp.justschool.me/s/bf-test` та вказати 2+ варіантів URL із вагами у відсотках (наприклад, 50% на `/black-friday` та 50% на `/bf-v1`).
* **Як працює серверний роутер (`api/s_router.js`):**
  1. Відсіює ботів та краулерів (`facebookexternalhit`, `Facebot`, `TelegramBot`, `Googlebot`, `headlesschrome`), щоб прев'ю посилань у рекламних кабінетах не накручували візити.
  2. Перевіряє cookie `js_split_<slug>` (Sticky Session на 30 днів), щоб повторний візит користувача завжди потрапляв на ту саму варіацію лендингу.
  3. Для нового користувача обирає варіант за вагами, записує візит у Supabase (`smart_split_experiments`) і робить `307 Redirect` на цільовий лендинг зі збереженням усіх рекламних UTM-міток та додаванням `?split_id=<slug>&split_variant=<var_id>`.
  4. При відправці форми `/api/submit.js` та клієнтський `js-tracker.js` автоматично фіксують конверсію (`leads + 1`) для конкретного варіанта.

---

## 8. Архітектура B2B-лендингів та інтерактивних калькуляторів

B2B-напрямок у JustSchool суттєво відрізняється від B2C як за структурою воронки, так і за логікою обробки лідів.

### 8.1. Тип 1: Ко-брендингові корпоративні портали (`b2b_ukrsib`, `b2b_metinvest`, `b2b_brsm`)
Це спеціалізовані лендинги-опитувальники для співробітників компаній-партнерів, яким JustSchool надає корпоративну знижку або спеціальні умови навчання.

**Ключові особливості побудови B2B-порталу:**
1. **Ко-брендинг у шапці та на Hero:** Поруч відображаються логотип `JustSchool` та логотип компанії-партнера (наприклад, `UKRSIBBANK BNP Paribas Group`, `Метінвест — Сталевий Бонус`, `БРСМ-Нафта`). Використовуються корпоративні кольорові акценти партнера (зелений BNP Paribas для УкрСиббанку, червоно-сталевий для Метінвесту, жовто-чорний для БРСМ).
2. **Структура анкети співробітника (12–13 кроків):**
   * Крок 0: Вітальний корпоративний екран із описом спецпропозиції для співробітників компанії.
   * Кроки 1–3: Контактні дані співробітника (ПІБ, Корпоративний або особистий Email, Телефон через `PhoneInput`).
   * Крок 4: Бажана інтенсивність навчання (наприклад, 2–3 рази на тиждень, інтенсив).
   * Крок 5: Матриця розкладу (мультивибір зручних днів тижня `Пн..Нд` + мультивибір часових слотів `Ранок / День / Вечір`).
   * Крок 6: Поточний рівень англійської (від `A0 Starter` до `C1 Advanced`).
   * Крок 7: Основна мета вивчення (з опцією `Інше` та текстовим полем вводу).
   * Крок 8: Робочі та життєві ситуації використання англійської (мультивибір).
   * Крок 9: Навички для першочергового покращення (мультивибір).
   * Крок 10: Побажання щодо викладача.
   * Крок 11: Напрям курсу (`General English`, `Business English`, `IT English`, `Підготовка до іспитів`).
   * Крок 12: Анімований лоадер підбору корпоративної групи.
   * Крок 13: Перевірка даних та фінальна відправка заявки.
   * Крок 14: Екран успіху з **кнопкою переходу в корпоративний Telegram-канал/чат** (`https://t.me/+L_g5QbqbbqsxYzU6`).
3. **Маршрутизація B2B-лідів на бекенді (`/api/submit.js` + `api/googleSheets.js`):**
   * **Creatio CRM та eSputnik ВИМКНЕНІ (`skipCreatio: true`, `skipEsputnik: true`)**, щоб B2B-співробітники не потрапляли у стандартну B2C-воронку дзвінків.
   * Ліди записуються у **Supabase (`landing_leads`)** та **напряму в Google Таблицю** `https://docs.google.com/spreadsheets/d/1DMWMSXsTUtmoJ5kKV_N2Kbld56Y0IPbArRKwNypfu4Q/edit` через Google Sheets API v4 (Service Account: `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com`):
     * `b2b_ukrsib` -> вкладка `Лист1!A:T` (20 колонок)
     * `b2b_metinvest` -> вкладка `Метінвест!A:T` (20 колонок)
     * `b2b_brsm` -> вкладка `БРСМ-Нафта!A:T` (20 колонок)

### 8.2. Тип 2: Інтерактивні B2B-калькулятори (`b2b_calc` — Калькулятор втрат HR-рутини)
Розташований у `/b2b_calc` (`https://lp.justschool.me/b2b_calc`). Це B2B лід-магніт для HRD, CEO та L&D менеджерів.

**Як працює логіка калькулятора:**
1. **Крок 1 (Масштаб компанії):** Вибір кількості співробітників задає мультиплікатор (`COMPANY_SIZES[sizeIdx].multiplier`, наприклад від `1.0x` до `3.5x`).
2. **Кроки 2–13 (12 операційних питань):** Кожна відповідь має вагу у годинах втраченого часу на тиждень (`opts[ansIdx].hours`). Під час проходження зверху в реальному часі тікає **лічильник втрачених годин та грошей (`$$$`)**, мотивуючи дійти до кінця.
3. **Математична модель (`calcResults`):**
   * `weekHours = baseHours * multiplier`
   * `monthHours = weekHours * 4.33`
   * `monthMoney = Math.round(monthHours * hourlyRate)`
   * Автоматичний розподіл у зону ризику (`ZONES`: Зелена / Жовта / Червона критична зона) та рейтинг ТОП-5 найбільш витратних процесів.
4. **Крок 14 (Lead Gate):** Щоб відкрити детальний PDF/дашборд аудиту, користувач вводить Ім'я, Робочий Email, Назву компанії та Телефон (`dialogueId: "b2b_calc"`).
5. **Крок 15 (Повний інтерактивний звіт + Secondary Conversion Modal):** Після відправки форми миттєво відкривається дашборд із графіками втрат по процесах та кнопкою **«Записатися на персональне Демо»**. Запис на демо відправляє другий запит із `dialogueId: "b2b_calc_demo"`, який у Google Таблиці (`вкладка HR-калькулятор!A:T`) позначається статусом `"Запис на Демо"`.

---

## 9. Покрокова інструкція: Як підняти свій перший лендинг з нуля

### 9.1. Локальне розгортання проєкту
```bash
# 1. Клонуємо репозиторій
git clone git@github.com:advanncer/jt_land.git justschool-funnel
cd justschool-funnel

# 2. Встановлюємо залежності (Node.js v20+ або v24+)
npm install

# 3. Запускаємо локальний сервер розробки
npm run dev
# Відкриється http://localhost:5173/<шлях-до-лендингу>/index.html
```

### 9.2. Чек-ліст створення нового лендингу за 5 кроків
Припустимо, потрібно створити новий лендинг `/summer-promo`:

1. **Клонуємо еталонний шаблон:**
   Найкраще взяти за основу `eng-adult/black-friday` або `eng-adult/quiz-plan-v2` (вони вже містять повну Дизайн-Систему `ds/`, правильний `PhoneInput.tsx`, GTM, FB Pixel та `js-tracker.js`):
   ```bash
   cp -R eng-adult/black-friday eng-adult/summer-promo
   ```
2. **Оновлюємо контент та банери:**
   * Кладемо оптимізовані банери (`.jpg`, до 300 KB) у `eng-adult/summer-promo/src/assets/`.
   * Оновлюємо питання квізу в `src/data.ts`.
   * У `src/App.tsx` оновлюємо `quiz_name`, `dialogueId`, `dialogueName`, оффер та тексти.
3. **Реєструємо точку входу у `vite.config.ts`:**
   У `build.rollupOptions.input` додаємо:
   ```typescript
   engAdultSummerPromo: resolve(__dirname, "eng-adult/summer-promo/index.html"),
   ```
4. **Прописуємо красивий маршрут у `vercel.json`:**
   У масив `"rewrites"` додаємо:
   ```json
   {
     "source": "/summer-promo",
     "destination": "/eng-adult/summer-promo/index.html"
   },
   {
     "source": "/summer-promo/:path*",
     "destination": "/eng-adult/summer-promo/index.html"
   }
   ```
5. **Перевіряємо збірку та пушимо в GitHub (автодеплой на Vercel):**
   ```bash
   npm run build
   git add .
   git commit -m "feat(eng-adult): add summer-promo quiz landing"
   git push origin main
   ```
   Через ~35 секунд лендинг автоматично стає доступним на `https://lp.justschool.me/summer-promo`.

---

## 10. Методика промптингу та бібліотека готових промптів (Claude / Codex)

### 10.1. Як формулювати задачу для AI-агента (Формула ідеального промпту)
Щоб Claude або Codex з першого разу видав готовий до трафіку лендинг без зайвих правок, у промпті достатньо вказати **5 речей**:
1. **Джерело оффера (Референс):** посилання на лист eSputnik (`esclick.me`), скріншот банера, лендінг конкурента або короткий опис акції.
2. **Архетип воронки:**
   * *Повна версія (як `/black-friday` або `/eng-adult/quiz-plan-v2`)* — з картками вигоди та відгуками на першому екрані.
   * *Коротка версія в 1 екран (як `/bf-v1`)* — компактний перший екран без скролу з банером та кнопкою під ним.
   * *B2B корпоративна (як `/b2b_ukrsib`)* або *B2B калькулятор (як `/b2b_calc`)*.
3. **Аудиторія та `leadType`:** дорослі (`english-for-adults`), діти (`english-for-children`), або перемикач обох.
4. **Куди веде форма в кінці:** стандартний редірект в онбординг JustSchool або перехід у Telegram (`https://t.me/...`) + запис у Google Таблицю.
5. **Назва route на Vercel:** наприклад `/summer-sale` або `/bf-v1`.

---

### 10.2. Готові шаблони промптів (Copy & Paste)

#### Промпт №1: Створення нового акційного лендингу-квізу з листа або референсу
```text
Проскануй цей лист / референс: [ВСТАВИТИ URL АБО ТЕКСТ ОФФЕРА].
Необхідно зібрати за нашою методикою лендинг-квіз у папці `eng-adult/[назва-папки]` і вивести його на маршрут `/[назва-route]`.

Вимоги:
1. Використовуй нашу дизайн-систему `ds/` (як у `eng-adult/quiz-plan-v2` та `eng-adult/black-friday`), повний адаптив mobile-first для всіх пристроїв.
2. Реалізуй підтримку `leadType` (`english-for-adults` та `english-for-children`) із перемикачем аудиторії та відповідними питаннями квізу.
3. Підключи в `index.html` наш GTM (`GTM-P6BDRT25`), Facebook Pixel (`9067851526565677`) та універсальний трекер `https://lp.justschool.me/js-tracker.js`.
4. Розміть усі кроки квізу для Google Analytics через `dataLayer.push({ event: 'quiz_step_reach', ... })` та відправку ліда `form_success`.
5. Підключи наш стандартний `PhoneInput` (з GEO через ipinfo.io, вибором прапорця та магією на льоту) і відправку ліда через `/api/submit` з подальшим редіректом в онбординг (з fallback на `id.justschool.me/login` та захистом від подвійного кліку `isSubmitting`).
6. Перевір `npm run build`, закоміть і запуш у `main` на Vercel.
```

#### Промпт №2: Створення короткої версії лендингу в 1 екран (Варіація V1 / BF1)
```text
Зроби коротку варіацію цього лендингу на окремому чистому маршруті `/[назва-route-v1]` (без перемикання у GET-параметрах і без тумблера в шапці), де весь перший екран поміщається в один мобільний екран (100dvh):
1. На банері не повинно бути намальованої кнопки — використовуй чистий банер `[шлях до файлу банера]`, оптимізуй його під мобайл і десктоп.
2. Одразу під банером у темній картці розмісти велику контрастну кнопку дії «Розпочати зараз →», яка запускає квіз.
3. Нижче додай компактний перемикач аудиторії (Для дорослих / Для дитини) та 3 короткі плашки переваг.
4. Збережи всі трекери, розмітку кроків GA4 та передачу ліда в `/api/submit`.
```

#### Промпт №3: Створення корпоративного B2B-лендингу з записом у Google Таблицю та Telegram
```text
Необхідно зібрати корпоративний B2B-лендинг для компанії-партнера «[НАЗВА КОМПАНІЇ]» за аналогією з `eng-adult/b2b_ukrsib` та `eng-adult/b2b_brsm`.
Маршрут: `/b2b_[slug]`.

Вимоги:
1. У шапці та на першому екрані зроби ко-брендинг JustSchool × [НАЗВА КОМПАНІЇ] з логотипом партнера `[шлях до логотипу]`.
2. Анкета має збирати: ПІБ, Email, Телефон (`PhoneInput`), інтенсивність, зручні дні та час, поточний рівень, мету, робочі ситуації, навички, побажання до викладача та напрям курсу.
3. ВАЖЛИВО по CRM: угоди в Creatio та контакти в eSputnik створюватися НЕ повинні (`skipCreatio: true`, `skipEsputnik: true`).
4. Налаштуй у `api/googleSheets.js` та `api/submit.js` прямий запис лідів через наш системний акаунт `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com` у Google Таблицю `[ID таблиці]`, вкладка `[Назва вкладки]`.
5. У кінці після відправки форми налаштуй фінальний екран із кнопкою переходу в наш Telegram: `[посилання на Telegram]`.
```

#### Промпт №4: Редизайн / Перевірка існуючого лендингу за Дизайн-Системою
```text
Перевір лендинг `[URL або шлях у проєкті]`.
Він має бути ідеально адаптивним для всіх пристроїв (мобайл + десктоп) і повністю відповідати нашій дизайн-системі `ds/`, за якою ми робили `eng-adult/quiz-plan-v2`.
Перевір і виправ:
1. Всі кольори, шрифти, відступи та кнопки за токенами `ds/`.
2. Наявність та коректність роботи GTM (`GTM-P6BDRT25`), Facebook Pixel (`9067851526565677`), `js-tracker.js` та подій `dataLayer`.
3. Відсутність 404 помилки при редіректі в онбординг після відправки форми.
```

---

## 11. Готовий системний файл `CLAUDE.md` / `AGENTS.md` для розгортання в AI-агентах

Скопіюйте блок нижче у файл `CLAUDE.md` (для Claude Code), `AGENTS.md` (для OpenAI Codex) або `.cursorrules` (для Cursor) у корені репозиторію. Він вже створений у корені цього проєкту!

```markdown
# CLAUDE.md / AGENTS.md — JustSchool Funnel Engineering Standards

You are working in the `justschool-funnel` repository (`https://lp.justschool.me`), a Multi-Page React 19 + TypeScript + Tailwind CSS v4 + Vite application deployed on Vercel.

## 1. Architecture & Routing Rules
1. **Multi-Page Vite App:** Every landing page lives in its own folder with an `index.html`, `src/main.tsx`, and `src/App.tsx`.
2. **Registration:** Every new landing MUST be registered in TWO places:
   - `vite.config.ts` -> `build.rollupOptions.input`
   - `vercel.json` -> `rewrites` (clean routes without relying on messy GET parameters for variant switching).
3. **Design System (`ds/`):** Always use the JustSchool Design System tokens and components located in `eng-adult/quiz-plan-v2/src/ds/` (or `eng-adult/black-friday/src/ds/`). Primary font: `Montserrat`. Warm page background: `var(--surface-page-warm)` (`#FFF5EB`), brand primary: `var(--brand)` (`#F56600`).
4. **Banner Optimization:** Always compress hero banners into optimized JPEGs (`< 300 KB`) with separate desktop (`1920px`) and mobile (`1100px`) assets rendered via `<picture>`.

## 2. CRM Lead Delivery & Reliability Mandates
1. **Unified API Route:** NEVER call external webhooks (`n8n.justschool.me`, `esputnik`, `nocodb`, `supabase`) from the browser. Always `POST` JSON payloads to `/api/submit`.
2. **Double Submission Protection:**
   - Maintain `const [isSubmitting, setIsSubmitting] = useState(false);`.
   - Guard the submit handler with `if (isSubmitting) return;` on line 1.
   - Disable all inputs (`disabled={isSubmitting}`) and change the submit button label to `"Надсилаємо заявку..."`.
3. **Safe Onboarding Redirects (No 404s):**
   - Never redirect to `https://justschool.me/uk/onboarding` (returns 404).
   - Use `result.redirectUri` from `/api/submit`, and if empty/invalid, fallback to:
     `email ? "https://id.justschool.me/login?email=" + encodeURIComponent(email) : "https://student.justschool.me/onboarding"`.
   - Always include a 7000ms `setTimeout` fallback so users are redirected even if the network hangs.
4. **B2B Isolation:** Corporate B2B funnels (`b2b_ukrsib`, `b2b_metinvest`, `b2b_brsm`, `b2b_calc`) MUST set `skipCreatio: true` and `skipEsputnik: true` and route leads to Google Sheets via `api/googleSheets.js` using Service Account `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com`.

## 3. Multi-Country Phone Input (`PhoneInput.tsx`)
1. Detect user country on mount via `fetch('https://ipinfo.io/json')`.
2. Support clickable flag dropdown (UA 🇺🇦, PL 🇵🇱, DE 🇩🇪, RO 🇷🇴, SK 🇸🇰, CZ 🇨🇿, GB 🇬🇧, US 🇺🇸).
3. Support "Magic on the Fly" dial-code auto-detection when typing/pasting (`380`, `48`, `0...`).
4. Backend and `onChange` must output raw flat phone strings: `+` followed strictly by digits (e.g. `+380952150831`).

## 4. Mandatory Analytics & Tracking (`index.html` + `App.tsx`)
1. Include GTM (`GTM-P6BDRT25`), Facebook Pixel (`9067851526565677`), and `<script src="https://lp.justschool.me/js-tracker.js" async></script>` in every `index.html`.
2. Push `quiz_step_reach` to `window.dataLayer` on every step change, and `form_success` + `fbq('track', 'Lead')` on lead submission.
3. Preserve and forward `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `leadType` (`english-for-adults`, `english-for-children`, etc.).
```

---

## 12. Технічне завдання та архітектура для розробки Конструктора Лендингів (JustSchool Funnel Builder)

Цей розділ описує повну логіку та архітектуру для створення **внутрішнього Конструктора Воронок JustSchool**, щоб маркетологи та AI могли генерувати, редагувати та запускати нові лендинги-квізи за хвилини без ручного кодингу кожного файлу.

### 12.1. Концепція роботи Конструктора
Усі наші 23+ лендингів мають однакову фундаментальну архітектуру і відрізняються лише **конфігурацією даних (JSON)**.  
Тому Конструктор будується на принципі **Schema-Driven Funnel Engine (Рушій воронок на основі JSON-схеми)**:

```text
[Вхідні дані від Маркетолога: Промпт / Email URL / Банер / Таблиця]
                          │
                          ▼
        [AI Funnel Generator (Claude / Gemini API)]
                          │
                          ▼
         [Єдина JSON-конфігурація (FunnelConfig)]
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
[Візуальний Редактор (No-Code UI)]   [Універсальний React Renderer]
        │                                   │
        └─────────────────┬─────────────────┘
                          ▼
   [Публікація на lp.justschool.me/:slug + Smart Splitter]
```

### 12.2. Єдина JSON-схема воронки (`FunnelConfig`)
Будь-який лендинг JustSchool (BF0, BF1, B2B, Дитячий, Калькулятор, Telegram-воронка) повністю описується наступним інтерфейсом TypeScript:

```typescript
export interface FunnelConfig {
  // 1. Метадані та маршрутизація
  id: string;                       // Напр. "eng_black_friday_v1"
  slug: string;                     // Публічний маршрут, напр. "/bf-v1"
  name: string;                     // Внутрішня назва: "Black Friday 2026 (1 Екран)"
  category: 'b2c_adult' | 'b2c_child' | 'b2c_universal' | 'b2b_partner' | 'b2b_calc' | 'hr_recruit' | 'blogger';
  status: 'draft' | 'active' | 'archived';

  // 2. SEO та Трекери
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  tracking: {
    gtmId: string;                  // Default: "GTM-P6BDRT25"
    fbPixelId: string;              // Default: "9067851526565677"
    enableSplitterTracker: boolean; // Default: true (/js-tracker.js)
    quizAnalyticsName: string;      // Напр. "eng-adult-black-friday"
  };

  // 3. Тема та Ко-брендинг (Design System Tokens)
  theme: {
    mode: 'light_warm' | 'dark_promo' | 'b2b_custom';
    primaryColor?: string;          // Default: "#F56600"
    ctaButtonColor?: string;        // Напр. "#FBC314" для Black Friday V1
    ctaButtonTextColor?: string;    // Напр. "#000000"
    partnerLogoUrl?: string;        // Для B2B (UKRSIBBANK, Метінвест, БРСМ)
    partnerName?: string;
  };

  // 4. Налаштування Першого Екрана (Hero Step 0)
  hero: {
    layout: 'v1_single_screen' | 'v2_full_detailed';
    topBadgeText?: string;          // Напр. "🖤 BLACK FRIDAY 2026"
    urgencyText?: string;           // Напр. "Залишилось 14 місць"
    headline?: string;              // Для v2_full_detailed
    subheadline?: string;
    priceTag?: {
      currentPrice: string;         // "1 670 грн/міс"
      oldPrice?: string;            // "2 850 грн/міс"
      savingsBadge?: string;        // "Вигода 26 000+ грн"
    };
    banner: {
      desktopUrl: string;
      mobileUrl: string;
      alt: string;
    };
    ctaText: string;                // "Розпочати зараз →"
    enableAudienceSwitcher: boolean;// Перемикач "Для дорослих" / "Для дитини"
    defaultAudience: 'adult' | 'child';
    trustPills?: string[];          // 3 короткі переваги під кнопкою у V1
    detailedSections?: {            // Додаткові секції для V2 (BF0)
      includedItems?: Array<{ icon: string; title: string; subtitle: string }>;
      reviews?: Array<{ name: string; role: string; text: string; rating: number }>;
    };
  };

  // 5. Кроки Квізу (Поліморфний масив кроків)
  steps: QuizStepConfig[];

  // 6. Налаштування CRM, Google Sheets та Post-Submit Редіректу
  destination: {
    defaultLeadType: string;        // "english-for-adults" | "english-for-children" | "b2b-corporate"
    subject: 'English' | 'Programming' | 'Math' | 'Polish';
    skipCreatio: boolean;           // true для B2B та HR
    skipEsputnik: boolean;          // true для B2B та HR
    googleSheetConfig?: {
      enabled: boolean;
      spreadsheetId: string;        // Напр. "1DMWMSXsTUtmoJ5kKV_N2Kbld56Y0IPbArRKwNypfu4Q"
      sheetTabName: string;         // Напр. "Метінвест" або "HR-калькулятор"
    };
    postSubmitAction: {
      type: 'onboarding_redirect' | 'telegram_screen' | 'b2b_audit_dashboard';
      telegramUrl?: string;         // Напр. "https://t.me/+L_g5QbqbbqsxYzU6"
      telegramButtonText?: string;
      customRedirectUrl?: string;
    };
  };
}

export type QuizStepConfig =
  | {
      id: string;
      type: 'single_choice';
      audienceFilter?: 'adult' | 'child' | 'all'; // Показувати тільки для обраної аудиторії
      question: string;
      subtitle?: string;
      fieldKey: string;             // Ключ для запису у answers (напр. "age", "level", "goal")
      options: Array<{ label: string; icon?: string; description?: string; hoursWeight?: number }>;
    }
  | {
      id: string;
      type: 'multi_choice';
      audienceFilter?: 'adult' | 'child' | 'all';
      question: string;
      subtitle?: string;
      fieldKey: string;
      options: Array<{ label: string; icon?: string }>;
      buttonText?: string;          // Default: "Далі →"
    }
  | {
      id: string;
      type: 'schedule_matrix';      // Для B2B (вибір днів Пн-Нд + часових слотів)
      question: string;
      daysFieldKey: string;
      timesFieldKey: string;
    }
  | {
      id: string;
      type: 'value_interstitial';   // Проміжний мотиваційний екран (напр. Розмовні клуби у подарунок)
      badge?: string;
      title: string;
      description: string;
      bulletPoints: string[];
      buttonText: string;
    }
  | {
      id: string;
      type: 'animated_loader';      // Екран розрахунку програми (0% -> 100%)
      title: string;
      checkmarks: string[];
      durationMs: number;           // Default: 2200
    }
  | {
      id: string;
      type: 'lead_form';            // Фінальна форма збору контактів
      title: string;
      subtitle: string;
      showPlanSummary: boolean;     // Показувати картку резюме відповідей користувача
      fields: Array<'name' | 'email' | 'phone' | 'company' | 'telegram'>;
      submitButtonText: string;     // Напр. "Зафіксувати спецціну →"
      giftBannerText?: string;
    };
```

### 12.3. Модулі Конструктора, які необхідно реалізувати

1. **Модуль 1 — AI-Імпортер (Prompt / Email URL to JSON):**
   * Користувач вставляє посилання на промо-лист (`https://justschool.esclick.me/...`) або пише короткий промпт і завантажує банер.
   * Бекенд сканує HTML листа, витягує заголовок, ціну, дедлайн, буліти оффера, автоматично обрізає/оптимізує банер у 2 форматах (`desk` + `mob`) і генерує валідний `FunnelConfig` JSON.
2. **Модуль 2 — Перемикач шаблонів Hero (V1 1-Screen vs V2 Standard vs B2B):**
   * В один клік дозволяє перемкнути перший екран між повною версією (`v2_full_detailed`) та короткою версією в 1 екран (`v1_single_screen`) або створити обидві версії одночасно і автоматично об'єднати їх у спліт-тест `/s/<slug>` (50% / 50%).
3. **Модуль 3 — Візуальний редактор кроків та банерів (Canvas Preview):**
   * Відображає інтерактивну мобільну рамку (`390x844px` iPhone 15 Pro) з можливістю перемикати кроки `Step 0 .. Step 10`, редагувати тексти, варіанти відповідей, завантажувати банери та перевіряти вигляд форми.
4. **Модуль 4 — Інтеграційний блок (CRM & Sheets Inspector):**
   * Вибір `leadType` із випадаючого списку (`english-for-adults`, `english-for-children`, `programming-for-children`, `math-for-children`, `b2b-corporate`).
   * Чекбокс «Записувати в Google Таблицю» (при ввімкненні користувач вставляє URL таблиці та назву вкладки, а конструктор перевіряє доступ сервісного акаунта `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com`).
   * Вибір дії після форми: `Онбординг JustSchool` або `Перехід у Telegram-канал`.
5. **Модуль 5 — Динамічний Рендерер (`/f/:slug` або генерація статики):**
   * Зберігає `FunnelConfig` у таблицю Supabase `landing_configs`.
   * Універсальний React-додаток читає `slug` з URL, підвантажує JSON-конфіг і рендерить воронку через компоненти Дизайн-Системи `ds/` з нульовою затримкою (SSR / Edge Cache).
