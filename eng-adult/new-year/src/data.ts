export type Audience = 'adult' | 'child';
export type QuestionKey = 'age' | 'level' | 'wish' | 'focus' | 'pace' | 'time';

export interface Option {
  id: string;
  label: string;
  subtitle?: string;
  emoji?: string;
}

export interface Question {
  key: QuestionKey;
  question: string;
  subtitle?: string;
  options: Option[];
  multi?: boolean;
}

// ─── Offer config: change deadline / discount here only ───────────────────
export const OFFER = {
  discountLabel: 'до −50%',
  deadlineLabel: '23:59 31.12',
  deadlineISO: '2026-12-31T23:59:59+02:00', // 23:59:59 Europe/Kyiv
  disclaimer: 'Розмір знижки залежить від обраної програми.',
};

export const GIFTS_QA = 'Подарунки: знижка до −50%, пробний, клуби, 200 фраз';

export interface Gift {
  id: string;
  tag: string;
  title: string;
  text: string;
  emoji: string;
}

export const GIFTS: Gift[] = [
  {
    id: 'discount',
    tag: 'до −50%',
    title: 'Знижка на навчання',
    text: 'До −50% на програму. Точний розмір залежить від обраної програми.',
    emoji: '🏷️',
  },
  {
    id: 'trial',
    tag: 'FREE',
    title: 'Безкоштовний пробний урок',
    text: 'Знайомство з викладачем і платформою без оплати.',
    emoji: '🎓',
  },
  {
    id: 'clubs',
    tag: 'CLUB',
    title: 'Розмовні клуби',
    text: 'Жива практика англійської в групі, щоб заговорити впевнено.',
    emoji: '🗣️',
  },
  {
    id: 'phrases',
    tag: '200',
    title: '200 фраз англійською',
    text: 'PDF на пошту одразу після квізу.',
    emoji: '📘',
  },
];

const LEVELS: Option[] = [
  { id: 'zero', label: 'Нуль', subtitle: 'Починаю з чистого аркуша', emoji: '❄️' },
  { id: 'beginner', label: 'Початковий', subtitle: 'Знаю базові слова й прості фрази', emoji: '🌱' },
  { id: 'intermediate', label: 'Середній', subtitle: 'Можу підтримати просту розмову', emoji: '📘' },
  { id: 'upper', label: 'Вище середнього', subtitle: 'Говорю, але хочу звучати впевненіше', emoji: '🎯' },
];

const COMMON_TAIL: Question[] = [
  {
    key: 'focus',
    multi: true,
    question: 'Що покласти в мішок насамперед?',
    subtitle: 'Можна обрати кілька варіантів',
    options: [
      { id: 'speaking', label: 'Розмовна мова', emoji: '💬' },
      { id: 'grammar', label: 'Граматика', emoji: '🧩' },
      { id: 'listening', label: 'Розуміння на слух', emoji: '🎧' },
      { id: 'vocabulary', label: 'Словниковий запас', emoji: '📚' },
    ],
  },
  {
    key: 'pace',
    question: 'Який темп обираєте?',
    options: [
      { id: '2x', label: '2 рази на тиждень', subtitle: 'Спокійно, як сніг за вікном', emoji: '❄️' },
      { id: '3x', label: '3 рази на тиждень', subtitle: 'Оптимальний прогрес', emoji: '⭐' },
      { id: 'intensive', label: 'Інтенсив', subtitle: 'Швидко, як сани Діда Мороза', emoji: '🛷' },
    ],
  },
  {
    key: 'time',
    question: 'Коли зручно займатися?',
    options: [
      { id: 'morning', label: 'Ранок', emoji: '☀️' },
      { id: 'day', label: 'День', emoji: '🌤️' },
      { id: 'evening', label: 'Вечір', emoji: '🌙' },
      { id: 'weekend', label: 'Вихідні', emoji: '🎄' },
    ],
  },
];

export const QUESTIONS: Record<Audience, Question[]> = {
  adult: [
    {
      key: 'age',
      question: 'Скільки вам років?',
      options: [
        { id: '18-24', label: '18–24', emoji: '🎓' },
        { id: '25-34', label: '25–34', emoji: '💼' },
        { id: '35-44', label: '35–44', emoji: '🏆' },
        { id: '45+', label: '45+', emoji: '⭐' },
      ],
    },
    { key: 'level', question: 'З яким рівнем зустрічаєте Новий рік?', options: LEVELS },
    {
      key: 'wish',
      question: 'Яке англійське бажання загадаєте на 2027?',
      options: [
        { id: 'career', label: 'Нова робота чи підвищення', emoji: '💼' },
        { id: 'travel', label: 'Подорожувати без перекладача', emoji: '✈️' },
        { id: 'relocate', label: 'Переїзд', emoji: '🧳' },
        { id: 'speak', label: 'Нарешті заговорити для себе', emoji: '🗣️' },
      ],
    },
    ...COMMON_TAIL,
  ],
  child: [
    {
      key: 'age',
      question: 'Скільки років дитині?',
      options: [
        { id: '4-6', label: '4–6', emoji: '🧸' },
        { id: '7-9', label: '7–9', emoji: '🎒' },
        { id: '10-13', label: '10–13', emoji: '📚' },
        { id: '14-17', label: '14–17', emoji: '🎓' },
      ],
    },
    { key: 'level', question: 'З яким рівнем дитина зустрічає Новий рік?', options: LEVELS },
    {
      key: 'wish',
      question: 'Що дитина має отримати в новому році?',
      options: [
        { id: 'grades', label: 'Кращі оцінки', emoji: '📈' },
        { id: 'exams', label: 'Підготовка до іспитів', emoji: '📝' },
        { id: 'speaking', label: 'Вільна розмова', emoji: '🗣️' },
        { id: 'hobby', label: 'Хобі', emoji: '🎨' },
      ],
    },
    ...COMMON_TAIL,
  ],
};

export const LOADER_STAGES = [
  'Читаємо ваш лист Дідові Морозу',
  'Пакуємо персональну програму',
  'Кладемо знижку під ялинку',
];

export const STEPS_HOW = [
  { title: 'Пройдіть квіз', text: '6 коротких питань про рівень, мету й зручний графік.' },
  { title: 'Отримайте мішок', text: 'Персональну програму, знижку й бонуси під ваші відповіді.' },
  { title: 'Залиште контакти', text: 'Надішлемо 200 фраз на пошту й призначимо пробний урок.' },
];

export const PHRASES_POINTS = [
  'Small talk на роботі й у мандрівках',
  'Фрази для листів, дзвінків і зустрічей',
  'Як попросити, уточнити й перепитати',
];

// Existing reviews reused verbatim from eng-adult/quiz-plan-v2, eng-child/quiz-plan
// and eng-adult/black-friday data.
export const REVIEWS: Record<Audience, { name: string; role: string; text: string }[]> = {
  adult: [
    { name: 'Аліна К.', role: '', text: "За 2 місяці подолала мовний бар'єр і успішно пройшла співбесіду англійською!" },
    { name: 'Ігор М.', role: '', text: 'Формат ідеально підійшов до мого щільного графіка. Дуже багато розмовної практики.' },
    { name: 'Марина В.', role: '', text: 'Перша школа, де вже через 2 місяці бачу реальний результат!' },
  ],
  child: [
    { name: 'Михайло Д.', role: 'Тато 10-річного Артема', text: 'Син нарешті сам сідає за англійську без нагадувань. За пів року оцінка в школі піднялася з 7 до 11 балів.' },
    { name: 'Ігор М.', role: '', text: 'Донька сама біжить на урок — викладач знайшов підхід' },
    { name: 'Марина В.', role: '', text: 'Оцінки в школі підтягнулися вже після місяця занять' },
  ],
};

export const IMAGES = {
  bannerDesktop: { webp: '/new-year/banner-desktop.webp', jpg: '/new-year/banner-desktop.jpg', webp1100: '/new-year/banner-desktop-1100.webp', jpg1100: '/new-year/banner-desktop-1100.jpg', w: 1672, h: 941 },
  bannerMobile: { webp: '/new-year/banner-mobile.webp', jpg: '/new-year/banner-mobile.jpg', webp750: '/new-year/banner-mobile-750.webp', jpg750: '/new-year/banner-mobile-750.jpg', w: 1100, h: 1100 },
  cover: { webp: '/new-year/phrases-cover.webp', jpg: '/new-year/phrases-cover.jpg', w: 640, h: 565 },
};
