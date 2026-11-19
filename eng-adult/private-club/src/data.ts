export type Audience = 'adult' | 'child';
export type Tier = 'silver' | 'gold' | 'black';
export type QuestionKey = 'age' | 'level' | 'reason' | 'focus' | 'pace';

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  key: QuestionKey;
  question: string;
  options: Option[];
  multi?: boolean;
}

export const PASSWORD = 'HELLO';

// ─── Offer config ─────────────────────────────────────────────────────────
// Fill in the real values. While a value is null, the page shows the bonus
// without a number (e.g. «Знижка рівня Silver») instead of a placeholder.
export const TIER_OFFERS: Record<
  Tier,
  { discountPercent: number | null; clubs: string; extraBonus: string | null }
> = {
  silver: { discountPercent: null, clubs: '1 розмовний клуб', extraBonus: null },
  gold: { discountPercent: null, clubs: '2 тижні розмовних клубів', extraBonus: null },
  black: { discountPercent: null, clubs: 'Місяць розмовних клубів', extraBonus: null },
};

// Real seat limit, if there is one. null → nothing about seats is shown.
export const SEATS_LIMIT: number | null = null;

export const TIERS: Record<Tier, { name: string; color: string; card: string }> = {
  silver: { name: 'Silver', color: '#C7CCD1', card: '/club/card-silver.jpg' },
  gold: { name: 'Gold', color: '#C9A45C', card: '/club/card-gold.jpg' },
  black: { name: 'Black', color: '#2B2B2B', card: '/club/card-black.jpg' },
};

// Tier is decided by the chosen pace (question 5)
export const TIER_BY_PACE: Record<string, Tier> = {
  '2x': 'silver',
  '3x': 'gold',
  intensive: 'black',
};

export const REDIRECT_DELAY_MS = 3000;

export const tierBonuses = (tier: Tier): string[] => {
  const o = TIER_OFFERS[tier];
  const name = TIERS[tier].name;
  return [
    o.discountPercent ? `Знижка −${o.discountPercent}% рівня ${name}` : `Знижка рівня ${name}`,
    'Безкоштовний пробний урок',
    o.clubs,
    ...(o.extraBonus ? [o.extraBonus] : []),
  ];
};

// Locked previews: labels only, values are never rendered before submit
export const LOCKED_BONUSES = (tier: Tier) => [
  `Знижка рівня ${TIERS[tier].name}`,
  'Пробний урок',
  'Пропуск у розмовний клуб',
  'Бонус для учасників',
];

const AGES = {
  adult: ['18–24', '25–34', '35–44', '45+'],
  child: ['4–6', '7–9', '10–13', '14–17'],
};

const LEVELS: Option[] = [
  { id: 'silent', label: 'Ще мовчу' },
  { id: 'phrases', label: 'Кілька фраз' },
  { id: 'conversation', label: 'Підтримую розмову' },
  { id: 'fluent', label: 'Говорю, але хочу вільніше' },
];

const FOCUS: Question = {
  key: 'focus',
  multi: true,
  question: 'Що прокачуємо першим?',
  options: [
    { id: 'speaking', label: 'Розмовна' },
    { id: 'grammar', label: 'Граматика' },
    { id: 'listening', label: 'Аудіювання' },
    { id: 'vocabulary', label: 'Словник' },
  ],
};

const PACE: Question = {
  key: 'pace',
  question: 'У якому темпі рухаєтесь?',
  options: [
    { id: '2x', label: '2 рази на тиждень' },
    { id: '3x', label: '3 рази на тиждень' },
    { id: 'intensive', label: 'Інтенсив' },
  ],
};

export const QUESTIONS: Record<Audience, Question[]> = {
  adult: [
    { key: 'age', question: 'Як вас представити в клубі?', options: AGES.adult.map((a) => ({ id: a, label: a })) },
    { key: 'level', question: 'Якою англійською ви говорите зараз?', options: LEVELS },
    {
      key: 'reason',
      question: 'Навіщо вам ключ від клубу?',
      options: [
        { id: 'career', label: 'Карʼєра' },
        { id: 'travel', label: 'Подорожі' },
        { id: 'relocate', label: 'Переїзд' },
        { id: 'self', label: 'Для себе' },
      ],
    },
    FOCUS,
    PACE,
  ],
  child: [
    { key: 'age', question: 'Як представити дитину в клубі?', options: AGES.child.map((a) => ({ id: a, label: a })) },
    { key: 'level', question: 'Якою англійською дитина говорить зараз?', options: LEVELS },
    {
      key: 'reason',
      question: 'Навіщо дитині ключ від клубу?',
      options: [
        { id: 'school', label: 'Школа' },
        { id: 'exams', label: 'Іспити' },
        { id: 'speaking', label: 'Вільна розмова' },
        { id: 'hobby', label: 'Хобі' },
      ],
    },
    FOCUS,
    PACE,
  ],
};

export const HOW_STEPS = [
  { title: 'Фейс-контроль', text: '5 коротких питань про рівень, мету й темп.' },
  { title: 'Пароль', text: 'Кожна відповідь відкриває літеру пароля. Зберіть HELLO.' },
  { title: 'Членська картка', text: 'Отримайте рівень доступу й активуйте картку.' },
];

// Facts about speaking clubs reused from the existing eng-adult/black-friday copy
export const CLUB_FACTS = [
  { title: 'Щотижня', text: 'Додаткова практика живого спілкування англійською щотижня.' },
  { title: 'Міні-групи до 8 осіб', text: 'Кожен встигає говорити, а не лише слухати.' },
  { title: '300+ розмовних тем', text: 'Від подорожей і роботи до кіно та повсякденного життя.' },
];

// Existing reviews reused verbatim from eng-adult/quiz-plan-v2
export const REVIEWS = [
  { name: 'Аліна К.', text: "За 2 місяці подолала мовний бар'єр і успішно пройшла співбесіду англійською!" },
  { name: 'Ігор М.', text: 'Формат ідеально підійшов до мого щільного графіка. Дуже багато розмовної практики.' },
  { name: 'Марина В.', text: 'Перша школа, де вже через 2 місяці бачу реальний результат!' },
];

export const PRIVACY_URL = 'https://justschool.me/uk/privacy-policy';

export const IMAGES = {
  heroDesktop: { src: '/club/hero-desktop.jpg', w: 1920, h: 900 },
  heroMobile: { src: '/club/hero-mobile.jpg', w: 1100, h: 1100 },
  card: { w: 1012, h: 638 },
};
