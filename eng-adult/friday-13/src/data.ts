export interface Option {
  id: string;
  label: string;
  subtitle?: string;
  emoji?: string;
}

export interface Question {
  key: QuestionKey;
  question: string;
  subtitle: string;
  options: Option[];
  multi?: boolean;
}

export type QuestionKey = 'age' | 'level' | 'goal' | 'aspects' | 'intensity' | 'schedule';

// ─── Offer config: change prices / deadline here only ─────────────────────
// price / oldPrice: set to a number (UAH per month) to show the price block.
// While they are null, every price line is hidden instead of rendering a placeholder.
export const OFFER = {
  discountPercent: 13,
  price: 1980 as number | null,
  oldPrice: 2276 as number | null,
  deadlineLabel: '23:59 13.11',
  timeZone: 'Europe/Kyiv',
};

export const formatUah = (n: number) =>
  n.toLocaleString('uk-UA').replace(/\s/g, ' ');

export const PRICE_LINE: string | null =
  OFFER.price && OFFER.oldPrice
    ? `${formatUah(OFFER.price)} грн/міс замість ${formatUah(OFFER.oldPrice)}`
    : null;

const ADULT: Question[] = [
  {
    key: 'age',
    question: 'Скільки вам років?',
    subtitle: 'Підберемо викладача з близьким життєвим контекстом і темами',
    options: [
      { id: '18-24', label: '18–24 роки', emoji: '🎓' },
      { id: '25-34', label: '25–34 роки', emoji: '💼' },
      { id: '35-44', label: '35–44 роки', emoji: '🏆' },
      { id: '45+', label: '45+ років', emoji: '⭐' },
    ],
  },
  {
    key: 'level',
    question: 'Який у вас зараз рівень англійської?',
    subtitle: 'Програма стартує саме з вашої точки — без повторення зайвого',
    options: [
      { id: 'a0-a1', label: 'Початковий (A0–A1)', subtitle: 'Вчив давно в школі або майже з нуля', emoji: '🌱' },
      { id: 'a2', label: 'Елементарний (A2)', subtitle: 'Знаю базу, читаю, але складно говорити', emoji: '📗' },
      { id: 'b1', label: 'Середній (B1)', subtitle: 'Підтримую бесіду, бракує словника', emoji: '📘' },
      { id: 'b2+', label: 'Вище середнього (B2+)', subtitle: 'Хочу звучати впевнено й професійно', emoji: '🎯' },
    ],
  },
  {
    key: 'goal',
    question: 'Яка ваша головна мета?',
    subtitle: 'На основі мети формуємо персональний навчальний план',
    options: [
      { id: 'career', label: "Кар'єра та робота з іноземцями", subtitle: 'Співбесіди, листування, дзвінки', emoji: '💼' },
      { id: 'travel', label: 'Подорожі та життя за кордоном', subtitle: 'Аеропорти, кафе, нові знайомства', emoji: '✈️' },
      { id: 'barrier', label: 'Подолати мовний барʼєр', subtitle: 'Перестати боятися помилок у розмові', emoji: '🗣️' },
      { id: 'self-dev', label: 'Фільми, книги та контент в оригіналі', subtitle: 'Без субтитрів і перекладача', emoji: '🎬' },
    ],
  },
  {
    key: 'aspects',
    multi: true,
    question: 'Які навички хочете підтягнути?',
    subtitle: 'Можна обрати декілька варіантів',
    options: [
      { id: 'speaking', label: 'Розмовна практика', emoji: '💬' },
      { id: 'listening', label: 'Сприйняття на слух', emoji: '🎧' },
      { id: 'vocabulary', label: 'Словниковий запас', emoji: '📚' },
      { id: 'grammar', label: 'Граматика без зубріння', emoji: '🧩' },
      { id: 'pronunciation', label: 'Вимова', emoji: '🎤' },
    ],
  },
];

const CHILD: Question[] = [
  {
    key: 'age',
    question: 'Скільки років вашій дитині?',
    subtitle: 'Програма враховує вікові інтереси та психологію дитини',
    options: [
      { id: '4-7', label: '4–7 років', emoji: '🧸' },
      { id: '8-11', label: '8–11 років', emoji: '🎒' },
      { id: '12-14', label: '12–14 років', emoji: '📱' },
      { id: '15-17', label: '15–17 років', emoji: '🎓' },
    ],
  },
  {
    key: 'level',
    question: 'Який рівень англійської у дитини зараз?',
    subtitle: 'Методист визначить акценти програми',
    options: [
      { id: 'zero', label: 'Починаємо майже з нуля', emoji: '🌱' },
      { id: 'school-basic', label: 'Шкільна база, але є прогалини', emoji: '📚' },
      { id: 'shy', label: 'Знає слова й правила, але соромиться говорити', emoji: '🤐' },
      { id: 'advanced', label: 'Добрий рівень, хочемо поглиблено', emoji: '🚀' },
    ],
  },
  {
    key: 'goal',
    question: 'Яка головна мета навчання?',
    subtitle: 'Усі заняття проходять в інтерактивній ігровій формі',
    options: [
      { id: 'grades', label: 'Підтягнути шкільні оцінки', emoji: '📈' },
      { id: 'speaking', label: 'Вільно й без страху розмовляти', emoji: '🗣️' },
      { id: 'exams', label: 'Підготуватися до іспитів (НМТ, Cambridge)', emoji: '📝' },
      { id: 'interest', label: 'Щоб дитина полюбила англійську', emoji: '🤩' },
    ],
  },
  {
    key: 'aspects',
    multi: true,
    question: 'Що дитині потрібно підтягнути першочергово?',
    subtitle: 'Можна обрати декілька варіантів',
    options: [
      { id: 'speaking', label: 'Розмовна мова', emoji: '💬' },
      { id: 'reading', label: 'Читання та вимова', emoji: '📖' },
      { id: 'grammar', label: 'Шкільна граматика', emoji: '📝' },
      { id: 'listening', label: 'Розуміння на слух', emoji: '🎧' },
      { id: 'vocabulary', label: 'Словниковий запас', emoji: '📚' },
    ],
  },
];

const COMMON: Question[] = [
  {
    key: 'intensity',
    question: 'Скільки уроків на тиждень плануєте?',
    subtitle: 'Інтенсивність можна змінити в будь-який момент',
    options: [
      { id: '2x', label: '2 рази на тиждень', subtitle: 'Рекомендовано: баланс навчання та відпочинку', emoji: '⚡' },
      { id: '3x', label: '3 рази на тиждень', subtitle: 'Інтенсив: максимально швидкий прогрес', emoji: '🔥' },
      { id: '1x', label: '1 раз на тиждень', subtitle: 'Помірний темп для підтримки рівня', emoji: '🌱' },
    ],
  },
  {
    key: 'schedule',
    question: 'Коли вам зручно займатися?',
    subtitle: 'Урок можна перенести, попередивши за 4 години',
    options: [
      { id: 'morning', label: 'Ранок (09:00–13:00)', emoji: '☀️' },
      { id: 'day', label: 'День (13:00–17:00)', emoji: '🌤️' },
      { id: 'evening', label: 'Вечір (17:00–21:00)', emoji: '🌙' },
      { id: 'flexible', label: 'Гнучкий графік', emoji: '⏱️' },
    ],
  },
];

export const QUESTIONS = {
  adult: [...ADULT, ...COMMON],
  child: [...CHILD, ...COMMON],
};

export const HERO_BULLETS = {
  adult: [
    'Індивідуальні уроки з викладачем онлайн',
    'Програма під вашу мету та рівень',
    'Знижка фіксується одразу після заявки',
  ],
  child: [
    'Ігрові індивідуальні уроки для дітей 4–17 років',
    'Програма під вік і шкільну програму',
    'Знижка фіксується одразу після заявки',
  ],
};

export const LOADER_STAGES = [
  'Аналізуємо цілі',
  'Підбираємо програму',
  'Активуємо знижку',
];

export const FAQ = [
  {
    q: 'До коли діє знижка?',
    a: `Акція «Пʼятниця 13» діє до ${OFFER.deadlineLabel}. Знижка фіксується за вами, щойно ви залишите заявку.`,
  },
  {
    q: 'Що буде після заявки?',
    a: 'Ви одразу потрапите в особистий кабінет, а менеджер звʼяжеться, щоб узгодити розклад і викладача.',
  },
  {
    q: 'Чи підходить це для дитини?',
    a: 'Так. Для дітей 4–17 років окрема ігрова програма — перемкніть «Дитина» на першому екрані.',
  },
];
