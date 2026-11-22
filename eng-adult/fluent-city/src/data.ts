export type Audience = 'adult' | 'child';
export type QuestionKey = 'level' | 'goal' | 'focus' | 'pace' | 'time';
export type LocationId = 'hq' | 'airport' | 'office' | 'cafe' | 'gym' | 'garage';

export interface Option {
  id: string;
  label: string;
  subtitle?: string;
  /** Mission 2: where on the map this answer takes the player */
  location?: LocationId;
}

export interface Mission {
  key: QuestionKey;
  location: LocationId | null; // null = depends on the answer (mission 2)
  locationLabel: string;
  question: string;
  options: Option[];
  multi?: boolean;
}

// ─── Rewards: fill in the real values ─────────────────────────────────────
// While a value is null, the page shows the reward without it.
export const REWARDS = {
  discountPercent: null as number | null, // [ЗНИЖКА %]
  clubsAccess: null as string | null, // [ДОСТУП ДО РОЗМОВНИХ КЛУБІВ], e.g. «2 тижні розмовних клубів»
};

export const rewardCards = () => [
  {
    id: 'discount',
    title: REWARDS.discountPercent ? `Знижка −${REWARDS.discountPercent}%` : 'Знижка на навчання',
    text: 'На пакет занять у JustSchool',
  },
  { id: 'trial', title: 'Безкоштовний пробний урок', text: 'Знайомство з викладачем і платформою' },
  {
    id: 'clubs',
    title: REWARDS.clubsAccess || 'Доступ до розмовних клубів',
    text: 'Жива практика англійської в групі',
  },
];

export const GAME = {
  missions: 5,
  bonusPerMission: 1000, // in-game currency, not money
  disclaimer: 'Бонуси на сторінці — ігрові й не є грошовими коштами. Подарунки надаються за умовами акції.',
};

export const LOCATIONS: Record<LocationId, { name: string; icon: string; x: number; y: number; text: string }> = {
  hq: { name: 'Штаб', icon: '/fluent-city/pin-hq.svg', x: 50, y: 50, text: 'Старт і фініш: визначаємо рівень і зручний час для місій.' },
  airport: { name: 'Аеропорт', icon: '/fluent-city/pin-airport.svg', x: 18, y: 22, text: 'Подорожі й переїзд: англійська для мандрівок і нового життя.' },
  office: { name: 'Офіс', icon: '/fluent-city/pin-office.svg', x: 78, y: 20, text: 'Карʼєра: співбесіди, листи й дзвінки з колегами.' },
  cafe: { name: 'Кафе', icon: '/fluent-city/pin-cafe.svg', x: 82, y: 62, text: 'Вільне спілкування: small talk без страху помилок.' },
  gym: { name: 'Тренажерка', icon: '/fluent-city/pin-gym.svg', x: 30, y: 74, text: 'Прокачуємо навички: розмовна, граматика, аудіювання, словник.' },
  garage: { name: 'Гараж', icon: '/fluent-city/pin-garage.svg', x: 62, y: 84, text: 'Обираємо швидкість: скільки занять на тиждень.' },
};

// Map marks for the 5 missions (mission 2 moves to the chosen location)
export const MISSION_MARKS: { x: number; y: number }[] = [
  { x: 50, y: 50 },
  { x: 78, y: 20 },
  { x: 30, y: 74 },
  { x: 62, y: 84 },
  { x: 56, y: 42 },
];

// The 5 places shown on the V2 city map
export const MAP_PLACES: LocationId[] = ['hq', 'airport', 'office', 'cafe', 'gym', 'garage'];

const LEVEL: Mission = {
  key: 'level',
  location: 'hq',
  locationLabel: 'ШТАБ',
  question: 'Який у вас рівень на старті?',
  options: [
    { id: 'zero', label: 'Нуль', subtitle: 'Починаю з чистого аркуша' },
    { id: 'beginner', label: 'Початковий', subtitle: 'Знаю базові слова й прості фрази' },
    { id: 'intermediate', label: 'Середній', subtitle: 'Можу підтримати просту розмову' },
    { id: 'upper', label: 'Вище середнього', subtitle: 'Говорю, але хочу вільніше' },
  ],
};

const FOCUS: Mission = {
  key: 'focus',
  location: 'gym',
  locationLabel: 'ТРЕНАЖЕРКА',
  question: 'Що прокачуємо?',
  multi: true,
  options: [
    { id: 'speaking', label: 'Розмовна' },
    { id: 'grammar', label: 'Граматика' },
    { id: 'listening', label: 'Аудіювання' },
    { id: 'vocabulary', label: 'Словник' },
  ],
};

const PACE: Mission = {
  key: 'pace',
  location: 'garage',
  locationLabel: 'ГАРАЖ',
  question: 'На якій швидкості їдемо?',
  options: [
    { id: '2x', label: '2 рази на тиждень', subtitle: 'Круїз' },
    { id: '3x', label: '3 рази на тиждень', subtitle: 'Спорт' },
    { id: 'intensive', label: 'Інтенсив', subtitle: 'Турбо' },
  ],
};

const TIME: Mission = {
  key: 'time',
  location: 'hq',
  locationLabel: 'ШТАБ',
  question: 'Коли виходите на місії?',
  options: [
    { id: 'morning', label: 'Ранок' },
    { id: 'day', label: 'День' },
    { id: 'evening', label: 'Вечір' },
    { id: 'weekend', label: 'Вихідні' },
  ],
};

export const MISSIONS: Record<Audience, Mission[]> = {
  adult: [
    LEVEL,
    {
      key: 'goal',
      location: null,
      locationLabel: 'АЕРОПОРТ/ОФІС/КАФЕ',
      question: 'Яка ваша головна ціль у місті?',
      options: [
        { id: 'career', label: 'Карʼєра', subtitle: 'Офіс', location: 'office' },
        { id: 'travel', label: 'Подорожі', subtitle: 'Аеропорт', location: 'airport' },
        { id: 'relocate', label: 'Переїзд', subtitle: 'Аеропорт', location: 'airport' },
        { id: 'talk', label: 'Вільне спілкування', subtitle: 'Кафе', location: 'cafe' },
      ],
    },
    FOCUS,
    PACE,
    TIME,
  ],
  child: [
    LEVEL,
    {
      key: 'goal',
      location: null,
      locationLabel: 'АЕРОПОРТ/ОФІС/КАФЕ',
      question: 'Яка головна ціль дитини в місті?',
      options: [
        { id: 'school', label: 'Школа', subtitle: 'Офіс', location: 'office' },
        { id: 'exams', label: 'Іспити', subtitle: 'Офіс', location: 'office' },
        { id: 'speaking', label: 'Вільна розмова', subtitle: 'Кафе', location: 'cafe' },
        { id: 'hobby', label: 'Хобі', subtitle: 'Аеропорт', location: 'airport' },
      ],
    },
    FOCUS,
    PACE,
    TIME,
  ],
};

export const LOADING_TIP = 'Порада: 10 хвилин англійської щодня — і місто ваше';

export const TIPS = [
  { en: 'Practice makes perfect.', uk: 'Практика робить майстра.' },
  { en: 'Small steps every day.', uk: 'Маленькі кроки щодня.' },
  { en: "Don't be afraid to make mistakes.", uk: 'Не бійтеся помилятися.' },
  { en: 'Think in English, not just speak.', uk: 'Думайте англійською, а не лише говоріть.' },
  { en: 'Every expert was once a beginner.', uk: 'Кожен експерт колись був початківцем.' },
];

export const CURATOR_MESSAGES = [
  'Йо! Ти пройшов усі 5 місій.',
  'На твоєму рахунку $5000 бонусів.',
  'Залиш контакти — і я обміняю їх на реальні подарунки.',
];

export const HOW_STEPS = [
  { title: 'Пройдіть місії', text: '5 коротких питань про рівень, ціль і темп навчання.' },
  { title: 'Зберіть бонуси', text: 'За кожну місію — +$1000 ігрових бонусів і зірка впевненості.' },
  { title: 'Обміняйте на подарунки', text: 'Залиште контакти, і ігрові бонуси перетворяться на реальні подарунки.' },
];

// Existing reviews reused verbatim from eng-adult/quiz-plan-v2
export const REVIEWS = [
  { name: 'Аліна К.', text: "За 2 місяці подолала мовний бар'єр і успішно пройшла співбесіду англійською!" },
  { name: 'Ігор М.', text: 'Формат ідеально підійшов до мого щільного графіка. Дуже багато розмовної практики.' },
  { name: 'Марина В.', text: 'Перша школа, де вже через 2 місяці бачу реальний результат!' },
];

export const PRIVACY_URL = 'https://justschool.me/uk/privacy-policy';
export const REDIRECT_DELAY_MS = 3000;

// Hero images: WebP (served first) + JPEG fallback. When replacing the art,
// replace both files with the same name (or delete the .webp to use only the .jpg).
export const IMAGES = {
  heroDesktop: { src: '/fluent-city/hero-desktop.jpg', webp: '/fluent-city/hero-desktop.webp', w: 1920, h: 900 },
  heroMobile: { src: '/fluent-city/hero-mobile.jpg', webp: '/fluent-city/hero-mobile.webp', w: 1100, h: 1100 },
  map: { src: '/fluent-city/city-map.jpg', w: 800, h: 800 },
};
