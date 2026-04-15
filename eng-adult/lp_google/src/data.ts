export interface QuizOption {
  label: string;
  value: string;
  icon: string;
}

export interface QuizReview {
  name: string;
  text: string;
}

export interface QuizStep {
  step: number;
  question?: string;
  subtext?: string;
  type: 'hero' | 'choice' | 'testimonials_interstitial' | 'loader' | 'program_ready' | 'lead_name' | 'lead_contacts';
  icon?: string;
  options?: QuizOption[];
  points?: string[];
  reviews?: QuizReview[];
  cta?: string;
  meta?: string;
  pre_cta?: string;
  social_proof?: string;
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'hero',
    icon: 'Sparkles',
    title: "Заговори англійською вільно — з JustSchool",
    subtitle: "Наші студенти виходять на новий рівень та долають мовний бар'єр вже за перший місяць. Почни говорити з перших хвилин на інтерактивній платформі, що підлаштовується під твій темп. Пройди тест, дізнайся свій рівень та отримай персональний план навчання.",
    social_proof: "🎓 Вибір 100 000+ студентів по всьому світу",
    pre_cta: "Лише 30 секунд, щоб зробити перший крок:",
    cta: "Пройти тест",
    meta: "Безкоштовно та миттєво"
  },
  {
    step: 2,
    type: 'choice',
    icon: 'Users',
    question: "Для кого ви обираєте навчання?",
    options: [
      { label: "Для себе", value: "self", icon: "User" },
      { label: "Для дитини", value: "child", icon: "Smile" },
      { label: "Для всієї родини", value: "family", icon: "Home" }
    ]
  },
  {
    step: 3,
    type: 'choice',
    icon: 'Cake',
    question: "Вкажіть ваш вік",
    subtext: "Вік — це лише цифра! У нас є студенти від 5 до 65 років. Головне — ваше бажання вчитися, а комфортний темп ми забезпечимо.",
    options: [
      { label: "Менше 18", value: "u18", icon: "Sunrise" },
      { label: "18-24", value: "18-24", icon: "Sun" },
      { label: "25-35", value: "25-35", icon: "Sunset" },
      { label: "35+", value: "35+", icon: "Moon" }
    ]
  },
  {
    step: 4,
    type: 'choice',
    icon: 'Target',
    question: "Яка ваша головна мета?",
    options: [
      { label: "Кар'єра та робота", value: "career", icon: "Briefcase" },
      { label: "Подорожі та життя за кордоном", value: "travel", icon: "Globe2" },
      { label: "Вільне спілкування для себе", value: "self", icon: "MessageCircle" },
      { label: "Підготовка до іспитів (IELTS/НМТ)", value: "exams", icon: "BookOpen" }
    ]
  },
  {
    step: 5,
    type: 'choice',
    icon: 'BarChart3',
    question: "Як би ви оцінили свій поточний рівень?",
    subtext: "Не хвилюйтеся, якщо ви починаєте з нуля. Ми допоможемо побудувати фундамент, на якому ви впевнено заговорите англійською.",
    options: [
      { label: "Починаю з нуля", value: "zero", icon: "Battery" },
      { label: "Вчив у школі, але нічого не пам'ятаю", value: "school", icon: "BatteryLow" },
      { label: "Розумію, але важко розмовляти", value: "passive", icon: "BatteryMedium" },
      { label: "Впевнений середній рівень", value: "intermediate", icon: "BatteryFull" }
    ]
  },
  {
    step: 6,
    type: 'testimonials_interstitial',
    icon: 'Heart',
    title: "Наші студенти вже досягають своїх цілей. Ви — наступні!",
    subtitle: "Подивіється, як наші студенти апгрейднули свою англійську та змінили життя:",
    reviews: [
      { name: "Аліна", text: "JustSchool — це любов! За 2 місяці занять я подолала мовний бар'єр і успішно пройшла співбесіду. Платформа просто неймовірна, все в одному місці!" },
      { name: "Ігор", text: "Формат ідеально підійшов для мого щільного графіка. Дуже багато розмовної практики на кожному уроці. Бачу реальний прогрес." },
      { name: "Сергій", text: "Спершу сумнівався, чи онлайн-навчання для мене, але після пробного уроку всі страхи зникли. Методист підібрав крутого викладача!" },
      { name: "Марина", text: "Мені подобається, що в JustSchool ми не просто зубримо правила, а реально розмовляємо. Моя впевненість зросла в рази." },
      { name: "Дмитро", text: "Додаток — це знахідка! Вчу слова в метро, а ввечері практикую їх на уроці. Дуже зручно, сучасно та ефективно, рекомендую всім." }
    ],
    cta: "Продовжити тест"
  },
  {
    step: 7,
    type: 'choice',
    icon: 'LayoutGrid',
    question: "Який формат занять для вас найзручніший?",
    options: [
      { label: "Індивідуально з вчителем", value: "solo", icon: "User" },
      { label: "У невеликій групі", value: "group", icon: "Users" },
      { label: "Самостійно на платформі", value: "self-study", icon: "PlaySquare" },
      { label: "Ще не визначився", value: "unsure", icon: "HelpCircle" }
    ]
  },
  {
    step: 8,
    type: 'choice',
    icon: 'Frown',
    question: "Що було найскладнішим у минулому досвіді навчання?",
    options: [
      { label: "Нудна граматика замість розмов", value: "grammar", icon: "Book" },
      { label: "Не було розмовної практики", value: "speaking", icon: "MessageSquare" },
      { label: "Важко було підібрати зручний час", value: "time", icon: "Clock" },
      { label: "Брак мотивації та системи", value: "motivation", icon: "TrendingDown" }
    ]
  },
  {
    step: 9,
    type: 'choice',
    icon: 'Clock',
    question: "Скільки часу ви готові приділяти англійській на тиждень?",
    subtext: "Навіть 15 хвилин практики на нашій платформі дають кращий результат.",
    options: [
      { label: "1-2 заняття (підтримую)", value: "low", icon: "Coffee" },
      { label: "3-4 заняття (інтенсив)", value: "medium", icon: "Zap" },
      { label: "Кожного дня потроху (максимум)", value: "high", icon: "Rocket" }
    ]
  },
  {
    step: 10,
    type: 'choice',
    icon: 'CalendarDays',
    question: "В який час вам зручніше займатися?",
    options: [
      { label: "Ранок (до 12:00)", value: "morning", icon: "Sunrise" },
      { label: "День (12:00 - 18:00)", value: "day", icon: "Sun" },
      { label: "Вечір (після 18:00)", value: "evening", icon: "Moon" },
      { label: "Будь-коли, гнучкий графік", value: "flex", icon: "Shuffle" }
    ]
  },
  {
    step: 11,
    type: 'choice',
    icon: 'Smartphone',
    question: "Чи важлива для вас наявність мобільного додатка?",
    options: [
      { label: "Так, хочу вчити слова в дорозі", value: "yes", icon: "ThumbsUp" },
      { label: "Ні, планую вчити лише за комп'ютером", value: "no", icon: "Monitor" },
      { label: "Бажано, щоб усе було в одному місці", value: "maybe", icon: "CheckCircle" }
    ]
  },
  {
    step: 12,
    type: 'choice',
    icon: 'UserCheck',
    question: "З ким би ви хотіли займатися?",
    subtext: "Усі наші викладачі проходять суворий відбір. Ви будете вчитися лише у найкращих.",
    options: [
      { label: "З україномовним викладачем", value: "local", icon: "User" },
      { label: "З носієм мови (Native Speaker)", value: "native", icon: "Globe" },
      { label: "Головне, щоб ми знайшли спільну мову", value: "match", icon: "HeartHandshake" }
    ]
  },
  {
    step: 13,
    type: 'choice',
    icon: 'TrendingUp',
    question: "Яка навичка для вас зараз у пріоритеті?",
    options: [
      { label: "Розмовна мова та вимова", value: "speaking", icon: "Mic" },
      { label: "Граматика та письмо", value: "grammar-writing", icon: "Edit" },
      { label: "Сприйняття на слух", value: "listening", icon: "Headphones" },
      { label: "Професійна лексика", value: "business", icon: "Briefcase" }
    ]
  },
  {
    step: 14,
    type: 'choice',
    icon: 'Timer',
    question: "Як швидко ви хочете побачити перші відчутні результати?",
    options: [
      { label: "За місяць (потрібен швидкий старт)", value: "1m", icon: "Rocket" },
      { label: "За 3 місяці (впевнений прогрес)", value: "3m", icon: "TrendingUp" },
      { label: "Готовий до довготривалого навчання", value: "long-term", icon: "Award" }
    ]
  },
  {
    step: 15,
    type: 'choice',
    icon: 'Trophy',
    question: "Що для вас є найкращою мотивацією продовжувати навчання?",
    options: [
      { label: "Визнання моїх успіхів викладачем", value: "recognition", icon: "Award" },
      { label: "Розуміння фільмів та пісень в оригіналі", value: "culture", icon: "Film" },
      { label: "Системний графік та підтримка методиста", value: "support", icon: "Shield" },
      { label: "Можливість вільно спілкуватися в подорожах", value: "success", icon: "Plane" }
    ]
  },
  {
    step: 16,
    type: 'choice',
    icon: 'Gift',
    question: "Чи готові ви присвятити 30 хвилин пробному уроку, щоб протестувати нашу платформу?",
    subtext: "Це абсолютно безкоштовно. Наш методист покаже, як проходять заняття, та визначить ваш точний рівень.",
    options: [
      { label: "Так, готовий спробувати!", value: "yes", icon: "Check" },
      { label: "Хотів би спершу дізнатися деталі", value: "later", icon: "FileText" },
      { label: "Так, підберіть мені зручний час", value: "free", icon: "Clock" }
    ]
  },
  {
    step: 17,
    type: 'loader',
    icon: 'Wand2',
    title: "Обробляємо ваші дані...",
    points: [
      "Аналізуємо вашу мету навчання",
      "Оцінюємо побажання щодо графіка",
      "Підбираємо найкращих викладачів",
      "Бронюємо місце на пробний урок"
    ]
  },
  {
    step: 18,
    type: 'program_ready',
    icon: 'Sparkles',
    title: "Ваша персональна стратегія готова!",
    subtitle: "Ми проаналізували ваші відповіді та склали оптимальний маршрут до вашої вільної англійської.",
    points: [
      "Фокус на розмовній мові з першого уроку",
      "Доступ до інтерактивної платформи 24/7",
      "Підбір ментора, який розділяє ваші інтереси"
    ],
    cta: "Отримати програму"
  },
  {
    step: 19,
    type: 'lead_name',
    icon: 'User',
    title: "Раді знайомству! Як до вас звертатися?",
    subtitle: "Ми вже майже створили твій ідеальний маршрут до вільної англійської. Скажи своє ім'я, щоб ми зробили твою стратегію максимально персоналізованою.",
    cta: "Далі"
  },
  {
    step: 20,
    type: 'lead_contacts',
    icon: 'Mail',
    title: "Твоя покрокова стратегія успіху готова!",
    subtitle: "Залиш контакти, щоб отримати результати тесту та персональний план навчання від методиста JustSchool.",
    guarantee_text: "Ми допоможемо тобі в усьому. Твої дані в безпеці.",
    cta: "Відправити та отримати план"
  }
];
