export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizReview {
  name: string;
  text: string;
}

export interface QuizStep {
  step: number;
  question?: string;
  subtext?: string;
  type: 'hero' | 'choice' | 'testimonials_interstitial' | 'value' | 'loader' | 'lead_name' | 'lead_contacts';
  icon?: string;
  options?: QuizOption[];
  points?: string[];
  reviews?: QuizReview[];
  cta?: string;
  meta?: string;
  pre_cta?: string;
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'hero',
    question: "Твоя вільна англійська починається тут — з JustSchool",
    subtext: "🔥 87% наших студентів долають мовний бар'єр вже за перший місяць. Навчайся за власним графіком із сотнями топових викладачів на сучасній платформі, що підлаштовується під тебе. Отримай персональний план навчання вже зараз!",
    pre_cta: "Лише 30 секунд, щоб дізнатися свій рівень та отримати персональну стратегію навчання:",
    cta: "Пройти тест",
    meta: "Безкоштовно та миттєво"
  },
  {
    step: 2,
    type: 'choice',
    icon: 'Users',
    question: "Для кого ви обираєте навчання?",
    options: [
      { label: "Для себе", value: "self" },
      { label: "Для дитини", value: "child" },
      { label: "Для всієї родини", value: "family" }
    ]
  },
  {
    step: 3,
    type: 'choice',
    icon: 'Cake',
    question: "Вкажіть ваш вік",
    subtext: "Вік — це лише цифра! У нас є студенти від 5 до 65 років, і кожен знаходить свій ідеальний темп.",
    options: [
      { label: "Менше 18", value: "u18" },
      { label: "18-24", value: "18-24" },
      { label: "25-35", value: "25-35" },
      { label: "35+", value: "35+" }
    ]
  },
  {
    step: 4,
    type: 'choice',
    icon: 'Target',
    question: "Яка ваша головна мета вивчення мови?",
    options: [
      { label: "Кар'єра та робота", value: "career" },
      { label: "Подорожі та життя за кордоном", value: "travel" },
      { label: "Вільне спілкування для себе", value: "self" },
      { label: "Підготовка до іспитів (IELTS/НМТ)", value: "exams" }
    ]
  },
  {
    step: 5,
    type: 'choice',
    icon: 'BarChart3',
    question: "Як би ви оцінили свій поточний рівень?",
    subtext: "Не хвилюйтеся, якщо ви починаєте з нуля. Ми допоможемо побудувати фундамент.",
    options: [
      { label: "Починаю з нуля", value: "zero" },
      { label: "Вчив у школі, але нічого не пам'ятаю", value: "school" },
      { label: "Розумію, але важко розмовляти", value: "passive" },
      { label: "Впевнений середній рівень", value: "intermediate" }
    ]
  },
  {
    step: 6,
    type: 'testimonials_interstitial',
    icon: 'Heart',
    question: "Наші студенти вже досягають своїх цілей!",
    subtext: "Поки ми підбираємо для вас відгуки, оберіть комфортний формат навчання:",
    options: [
      { label: "Індивідуально з вчителем", value: "solo" },
      { label: "У невеликій групі", value: "group" },
      { label: "Самостійно на платформі", value: "self-study" },
      { label: "Ще не визначився", value: "unsure" }
    ],
    reviews: [
      { name: "Аліна", text: "За 2 місяці подолала мовний бар'єр і пройшла співбесіду. Платформа неймовірна!" },
      { name: "Ігор", text: "Формат ідеально підійшов для мого щільного графіка. Бачу реальний прогрес." },
      { name: "Сергій", text: "Спершу сумнівався, але після першого уроку всі страхи зникли. Викладачі знаходять підхід!" },
      { name: "Марина", text: "Мені подобається, що ми не зубримо, а реально розмовляємо. Моя впевненість зросла в рази." },
      { name: "Дмитро", text: "Додаток — це знахідка! Вчу слова в метро, а ввечері практикую їх на уроці. Дуже зручно." }
    ]
  },
  {
    step: 7,
    type: 'choice',
    icon: 'Frown',
    question: "Що було найскладнішим у минулому досвіді навчання?",
    options: [
      { label: "Нудна граматика", value: "grammar" },
      { label: "Не було розмовної практики", value: "speaking" },
      { label: "Важко підібрати зручний час", value: "time" },
      { label: "Брак мотивації та системи", value: "motivation" }
    ]
  },
  {
    step: 8,
    type: 'choice',
    icon: 'Clock',
    question: "Скільки часу ви готові приділяти англійській на тиждень?",
    subtext: "Навіть 15 хвилин на день на нашій платформі дають результат.",
    options: [
      { label: "1-2 заняття (підтримую)", value: "low" },
      { label: "3-4 заняття (інтенсив)", value: "medium" },
      { label: "Кожного дня потроху (максимум)", value: "high" }
    ]
  },
  {
    step: 9,
    type: 'choice',
    icon: 'Coffee',
    question: "В який час вам зручніше займатися?",
    options: [
      { label: "Ранок (до 12:00)", value: "morning" },
      { label: "День (12:00 - 18:00)", value: "day" },
      { label: "Вечір (після 18:00)", value: "evening" },
      { label: "Гнучкий графік", value: "flex" }
    ]
  },
  {
    step: 10,
    type: 'choice',
    icon: 'Smartphone',
    question: "Чи важлива для вас наявність мобільного додатка?",
    options: [
      { label: "Так, хочу вчити слова всюди", value: "yes" },
      { label: "Ні, лише за комп'ютером", value: "no" },
      { label: "Бажано, щоб все було в одному місці", value: "nice-to-have" }
    ]
  },
  {
    step: 11,
    type: 'choice',
    icon: 'UserCheck',
    question: "З ким би ви хотіли займатися?",
    subtext: "Усі наші викладачі проходять суворий відбір.",
    options: [
      { label: "З україномовним викладачем", value: "local" },
      { label: "З носієм мови (Native Speaker)", value: "native" },
      { label: "Головне, щоб ми підійшли один одному", value: "match" }
    ]
  },
  {
    step: 12,
    type: 'choice',
    icon: 'TrendingUp',
    question: "Який навичок для вас зараз у пріоритеті?",
    options: [
      { label: "Розмовна мова", value: "speaking" },
      { label: "Граматика та письмо", value: "grammar-writing" },
      { label: "Сприйняття на слух", value: "listening" },
      { label: "Професійна лексика", value: "business" }
    ]
  },
  {
    step: 13,
    type: 'choice',
    icon: 'Calendar',
    question: "Як швидко ви хочете побачити результат?",
    options: [
      { label: "За місяць (швидкий старт)", value: "1m" },
      { label: "За 3 місяці (впевнений прогрес)", value: "3m" },
      { label: "Готовий до довготривалого навчання", value: "long-term" }
    ]
  },
  {
    step: 14,
    type: 'choice',
    icon: 'Group',
    question: "Чи цікаво вам брати участь у розмовних клубах?",
    options: [
      { label: "Так, це крута практика!", value: "yes" },
      { label: "Ні, краще індивідуально", value: "no" },
      { label: "Можливо, спробую пізніше", value: "maybe" }
    ]
  },
  {
    step: 15,
    type: 'choice',
    icon: 'Trophy',
    question: "Що для вас є найкращою мотивацією?",
    options: [
      { label: "Визнання моїх успіхів", value: "recognition" },
      { label: "Розуміння фільмів в оригіналі", value: "culture" },
      { label: "Системний графік", value: "system" },
      { label: "Досягнення мети", value: "success" }
    ]
  },
  {
    step: 16,
    type: 'choice',
    icon: 'Gift',
    question: "Чи готові ви до безкоштовного пробного уроку?",
    subtext: "Це допоможе нам фіналізувати вашу персональну програму.",
    options: [
      { label: "Так, готовий спробувати", value: "yes" },
      { label: "Хочу спершу побачити програму", value: "later" },
      { label: "Так, якщо це безкоштовно", value: "free" }
    ]
  },
  {
    step: 17,
    type: 'loader',
    icon: 'Wand2',
    question: "Обробляємо ваші дані та підбираємо викладача...",
    points: [
      "Аналізуємо вашу мету та рівень",
      "Складаємо перелік тем для навчання",
      "Шукаємо вільні вікна у найкращих вчителів",
      "Формуємо бонусний пакет для старту"
    ]
  },
  {
    step: 18,
    type: 'lead_name',
    icon: 'User',
    question: "Останній крок до вашої мети!",
    subtext: "Як до вас звертатися?",
    cta: "Далі"
  },
  {
    step: 19,
    type: 'lead_contacts',
    icon: 'Mail',
    question: "Куди надіслати ваш персональний план?",
    subtext: "Ми вже готуємо ваші бонуси!",
    cta: "Отримати план та бонуси"
  }
];
