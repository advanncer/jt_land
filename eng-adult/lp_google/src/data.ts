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
  guarantee_text?: string;
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'hero',
    icon: 'Sparkles',
    question: "Заговори англійською вільно — з JustSchool",
    subtext: "Наші студенти долають мовний бар'єр вже за перший місяць. Почни говорити з перших хвилин на інтерактивній платформі, що підлаштовується під твій темп.",
    social_proof: "🎓 Вибір 100 000+ студентів по всьому світу",
    pre_cta: "Лише 30 секунд, щоб дізнатися рівень:",
    cta: "Пройти тест",
    meta: "Безкоштовно та миттєво",
    points: [
      "Почни говорити з перших хвилин",
      "Навчайся на інтерактивній платформі",
      "Отримай персональний план навчання"
    ]
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
    subtext: "Вік — це лише цифра! Головне — ваше бажання вчитися.",
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
      { label: "Подорожі за кордоном", value: "travel", icon: "Globe2" },
      { label: "Вільне спілкування для себе", value: "self", icon: "MessageCircle" },
      { label: "Підготовка до іспитів", value: "exams", icon: "BookOpen" }
    ]
  },
  {
    step: 5,
    type: 'choice',
    icon: 'BarChart3',
    question: "Ваш поточний рівень?",
    subtext: "Ми допоможемо побудувати міцний фундамент.",
    options: [
      { label: "Починаю з нуля", value: "zero", icon: "Battery" },
      { label: "Вчив у школі, але забув", value: "school", icon: "BatteryLow" },
      { label: "Розумію, важко розмовляти", value: "passive", icon: "BatteryMedium" },
      { label: "Впевнений середній", value: "intermediate", icon: "BatteryFull" }
    ]
  },
  {
    step: 6,
    type: 'testimonials_interstitial',
    icon: 'Heart',
    question: "Наші студенти досягають цілей!",
    subtext: "Оберіть комфортний формат навчання:",
    options: [
      { label: "Індивідуально з вчителем", value: "solo", icon: "User" },
      { label: "У невеликій групі", value: "group", icon: "Users" },
      { label: "Самостійно на платформі", value: "self-study", icon: "PlaySquare" },
      { label: "Ще не визначився", value: "unsure", icon: "HelpCircle" }
    ],
    reviews: [
      { name: "Аліна", text: "За 2 місяці занять я подолала мовний бар'єр і пройшла співбесіду." },
      { name: "Ігор", text: "Багато розмовної практики на кожному уроці. Бачу прогрес." },
      { name: "Сергій", text: "Після пробного уроку всі страхи зникли. Супер!" }
    ],
    cta: "Продовжити тест"
  },
  {
    step: 7,
    type: 'choice',
    icon: 'Frown',
    question: "Що було найскладнішим у минулому досвіді?",
    options: [
      { label: "Нудна граматика", value: "grammar", icon: "Book" },
      { label: "Не було розмовної практики", value: "speaking", icon: "MessageSquare" },
      { label: "Важко було підібрати час", value: "time", icon: "Clock" },
      { label: "Брак мотивації", value: "motivation", icon: "TrendingDown" }
    ]
  },
  {
    step: 8,
    type: 'choice',
    icon: 'Clock',
    question: "Скільки часу ви готові приділяти на тиждень?",
    subtext: "Навіть 15 хвилин практики щодня дають результат.",
    options: [
      { label: "1-2 заняття (підтримую)", value: "low", icon: "Coffee" },
      { label: "3-4 заняття (інтенсив)", value: "medium", icon: "Zap" },
      { label: "Щодня потроху (максимум)", value: "high", icon: "Rocket" }
    ]
  },
  {
    step: 9,
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
    step: 10,
    type: 'choice',
    icon: 'Smartphone',
    question: "Чи важливий для вас мобільний додаток?",
    options: [
      { label: "Так, хочу вчити в дорозі", value: "yes", icon: "ThumbsUp" },
      { label: "Ні, лише за комп'ютером", value: "no", icon: "Monitor" },
      { label: "Бажано, щоб усе було разом", value: "maybe", icon: "CheckCircle" }
    ]
  },
  {
    step: 11,
    type: 'choice',
    icon: 'UserCheck',
    question: "З ким би ви хотіли займатися?",
    subtext: "Усі наші викладачі проходять суворий відбір.",
    options: [
      { label: "З україномовним", value: "local", icon: "User" },
      { label: "З носієм мови", value: "native", icon: "Globe" },
      { label: "Головне знайти спільну мову", value: "match", icon: "HeartHandshake" }
    ]
  },
  {
    step: 12,
    type: 'choice',
    icon: 'TrendingUp',
    question: "Яка навичка для вас зараз у пріоритеті?",
    options: [
      { label: "Розмовна мова", value: "speaking", icon: "Mic" },
      { label: "Граматика та письмо", value: "grammar-writing", icon: "Edit" },
      { label: "Сприйняття на слух", value: "listening", icon: "Headphones" },
      { label: "Професійна лексика", value: "business", icon: "Briefcase" }
    ]
  },
  {
    step: 13,
    type: 'choice',
    icon: 'Timer',
    question: "Як швидко ви хочете побачити результати?",
    options: [
      { label: "За місяць (старт)", value: "1m", icon: "Rocket" },
      { label: "За 3 місяці (прогрес)", value: "3m", icon: "TrendingUp" },
      { label: "Довготривале навчання", value: "long-term", icon: "Award" }
    ]
  },
  {
    step: 14,
    type: 'choice',
    icon: 'Trophy',
    question: "Що є найкращою мотивацією продовжувати?",
    options: [
      { label: "Визнання успіхів", value: "recognition", icon: "Award" },
      { label: "Розуміння фільмів", value: "culture", icon: "Film" },
      { label: "Системний графік", value: "support", icon: "Shield" },
      { label: "Вільне спілкування", value: "success", icon: "Plane" }
    ]
  },
  {
    step: 15,
    type: 'choice',
    icon: 'Gift',
    question: "Готові до безкоштовного пробного уроку?",
    subtext: "Це абсолютно безкоштовно. Наш методист визначить ваш рівень.",
    options: [
      { label: "Так, готовий спробувати!", value: "yes", icon: "Check" },
      { label: "Спершу дізнатися деталі", value: "later", icon: "FileText" },
      { label: "Так, підберіть час", value: "free", icon: "Clock" }
    ]
  },
  {
    step: 16,
    type: 'loader',
    icon: 'Wand2',
    question: "Обробляємо ваші дані...",
    points: [
      "Аналізуємо вашу мету",
      "Оцінюємо графік",
      "Підбираємо викладача",
      "Бронюємо місце"
    ]
  },
  {
    step: 17,
    type: 'program_ready',
    icon: 'Sparkles',
    question: "Ваша стратегія готова!",
    subtext: "Залишився лише один крок до вашої вільної англійської.",
    points: [
      "Фокус на розмовній мові",
      "Доступ до платформи 24/7",
      "Підбір ідеального ментора"
    ],
    cta: "Отримати програму"
  },
  {
    step: 18,
    type: 'lead_name',
    icon: 'User',
    question: "Раді знайомству! Як до вас звертатися?",
    subtext: "Скажіть своє ім'я, щоб ми зробили вашу стратегію максимально персоналізованою.",
    cta: "Далі"
  },
  {
    step: 19,
    type: 'lead_contacts',
    icon: 'Mail',
    question: "Куди надіслати вашу стратегію?",
    subtext: "Ми вже готуємо ваші бонуси!",
    guarantee_text: "Ми допоможемо тобі в усьому. Твої дані в безпеці.",
    cta: "Відправити та отримати план"
  }
];
