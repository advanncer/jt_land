export interface CompanySizeOption {
  id: string;
  label: string;
  desc: string;
  multiplier: number;
}

export const COMPANY_SIZES: CompanySizeOption[] = [
  { id: 'size_50', label: 'До 50', desc: 'співробітників', multiplier: 0.5 },
  { id: 'size_150', label: '50–150', desc: 'співробітників', multiplier: 1.0 },
  { id: 'size_300', label: '150–300', desc: 'співробітників', multiplier: 2.0 },
  { id: 'size_300plus', label: '300+', desc: 'співробітників', multiplier: 3.0 },
];

export interface QuizOption {
  key: 'A' | 'B' | 'C';
  text: string;
  hours: number;
}

export interface QuizQuestion {
  id: number;
  name: string;
  shortName: string;
  question: string;
  categoryBadge: string;
  opts: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    name: 'Відпустки і лікарняні',
    shortName: 'Відпустки і лікарняні',
    categoryBadge: 'Workforce & HR Operations',
    question: 'Як ви збираєте та зводите графіки відпусток і лікарняних?',
    opts: [
      { key: 'A', text: 'Усі пишуть в особисті, а я руками вношу це в Excel / Google Таблицю', hours: 4.0 },
      { key: 'B', text: 'Є спільна таблиця, де всі самі відмічаються, але я перевіряю ліміти', hours: 2.0 },
      { key: 'C', text: 'Використовуємо HRM-систему / бота, який сам рахує дні та оновлює статус', hours: 0.0 },
    ],
  },
  {
    id: 2,
    name: 'Пульс-опитування (eNPS)',
    shortName: 'Пульс-опитування eNPS',
    categoryBadge: 'Employee Engagement',
    question: 'Як у компанії проходять пульс-опитування (eNPS, задоволеність)?',
    opts: [
      { key: 'A', text: 'Створюю Google Форму, пінгую кожного в чаті, зводжу дані руками', hours: 3.0 },
      { key: 'B', text: 'Форма йде автоматично, але аналітику та графіки будую самостійно', hours: 1.5 },
      { key: 'C', text: 'Запуском і нагадуваннями керує система, я отримую готовий дашборд', hours: 0.0 },
    ],
  },
  {
    id: 3,
    name: 'Щоденні та щотижневі статуси',
    shortName: 'Статуси команд',
    categoryBadge: 'Team Communication',
    question: 'Як ви збираєте щотижневі або щоденні статуси від команд?',
    opts: [
      { key: 'A', text: 'Проводимо довгі мітинги або я запитую кожного в месенджері', hours: 5.0 },
      { key: 'B', text: 'Всі пишуть у спецканал, але я витрачаю час на зведення у звіт', hours: 2.0 },
      { key: 'C', text: 'Працює автоматичний стендап-бот (Slack/TG), звіт генерується сам', hours: 0.0 },
    ],
  },
  {
    id: 4,
    name: 'Розклад корпоративної англійської',
    shortName: 'Розклад англійської',
    categoryBadge: 'Corporate Learning (L&D)',
    question: 'Корпоративна англійська: як ви організовуєте розклад занять?',
    opts: [
      { key: 'A', text: 'Узгоджую графіки в чатах, вручну переношу заняття, шукаю заміни', hours: 4.5 },
      { key: 'B', text: 'Даю контакти школи/викладача, але вручну веду облік оплат та балансу', hours: 2.0 },
      { key: 'C', text: 'На платформі провайдера співробітники самі бронюють уроки в межах бюджету', hours: 0.0 },
    ],
  },
  {
    id: 5,
    name: 'Прогрес корпоративної англійської',
    shortName: 'Прогрес англійської',
    categoryBadge: 'Corporate Learning (L&D)',
    question: 'Корпоративна англійська: як ви відстежуєте прогрес і відвідуваність?',
    opts: [
      { key: 'A', text: 'Раз на місяць прошу викладачів надіслати звіти в Excel, шукаю прогульників', hours: 3.0 },
      { key: 'B', text: 'Запитую фідбек безпосередньо у студентів, вручну заповнюю таблицю', hours: 1.0 },
      { key: 'C', text: 'Маю доступ до онлайн-кабінету з живою аналітикою відвідуваності та прогресу', hours: 0.0 },
    ],
  },
  {
    id: 6,
    name: 'Типові документи (офери, NDA)',
    shortName: 'Типові документи',
    categoryBadge: 'HR Administration',
    question: 'Як ви оформлюєте типові документи (офери, довідки, NDA)?',
    opts: [
      { key: 'A', text: 'Щоразу копіюю старий вордівський файл і вручну змінюю імена та дати', hours: 3.0 },
      { key: 'B', text: 'Маю шаблони в Google Docs, але вношу дані та конвертую в PDF руками', hours: 1.0 },
      { key: 'C', text: 'Документи генеруються в 1 клік з картки кандидата чи співробітника', hours: 0.0 },
    ],
  },
  {
    id: 7,
    name: 'Performance Review (360°)',
    shortName: 'Performance Review 360°',
    categoryBadge: 'Talent Management',
    question: 'Як організований процес Performance Review (360 градусів)?',
    opts: [
      { key: 'A', text: 'Вручну надсилаю анкети колегам, збираю відповіді, зводжу все в один документ', hours: 5.0 },
      { key: 'B', text: 'Опитування йде через автоматичну форму, але фінальний звіт пишу вручну', hours: 2.5 },
      { key: 'C', text: 'HRM-система сама проводить опитування 360 і видає візуальний звіт з графіками', hours: 0.0 },
    ],
  },
  {
    id: 8,
    name: 'Онбординг і доступи',
    shortName: 'Онбординг і доступи',
    categoryBadge: 'Onboarding & IT Setup',
    question: 'Організація онбордингу: як новачок отримує доступи та інфо?',
    opts: [
      { key: 'A', text: 'Проводжу годинну зустріч, створюю пошту руками, кидаю лінки в чат', hours: 4.0 },
      { key: 'B', text: 'Є чек-лист (Notion), але надання доступів і нагадування на мені', hours: 1.5 },
      { key: 'C', text: 'Працює Welcome-бот та автостворення акаунтів через скрипти/систему', hours: 0.0 },
    ],
  },
  {
    id: 9,
    name: 'Бюджети на навчання та L&D',
    shortName: 'Бюджети на L&D',
    categoryBadge: 'Corporate Learning (L&D)',
    question: 'Як ви трекаєте бюджети на навчання та розвиток (L&D)?',
    opts: [
      { key: 'A', text: 'Оплату курсів пишу в табличку вручну, звіряю залишки кожного співробітника', hours: 2.0 },
      { key: 'B', text: 'Запити йдуть через форму, але апрув і фіксація витрат на мені', hours: 1.0 },
      { key: 'C', text: 'Бюджети лімітовані автоматично в системі або на боці провайдерів', hours: 0.0 },
    ],
  },
  {
    id: 10,
    name: 'Місячний HR-звіт',
    shortName: 'Місячний HR-звіт',
    categoryBadge: 'HR Analytics & Reporting',
    question: 'Скільки часу займає підготовка фінального HR-звіту за місяць?',
    opts: [
      { key: 'A', text: 'Кілька днів: вивантажую дані з 5 різних таблиць, малюю графіки', hours: 6.0 },
      { key: 'B', text: 'Близько півдня: частина підтягується сама, візуал роблю руками', hours: 2.0 },
      { key: 'C', text: '5 хвилин: усі дані живуть у дашборді, який оновлюється автоматично', hours: 0.0 },
    ],
  },
  {
    id: 11,
    name: 'Turnover rate (плинність)',
    shortName: 'Turnover rate',
    categoryBadge: 'Retention & Exit Analytics',
    question: 'Як ви рахуєте плинність кадрів (Turnover rate) та причини звільнень?',
    opts: [
      { key: 'A', text: 'Збираю дані з наказів, рахую за формулою в Excel, самостійно групую причини', hours: 3.0 },
      { key: 'B', text: 'Вивантажую список звільнених, але аналітику та тренди будую у зведених таблицях', hours: 1.5 },
      { key: 'C', text: 'HRM або дашборд рахує Turnover rate онлайн та будує графіки за причинами', hours: 0.0 },
    ],
  },
  {
    id: 12,
    name: 'Мерч і подарунки',
    shortName: 'Мерч і подарунки',
    categoryBadge: 'Corporate Culture & Events',
    question: 'Як ви керуєте видачею корпоративного мерчу та подарунків?',
    opts: [
      { key: 'A', text: 'Веду табличку дат, пишу кожному за розмір/адресу, контролюю відправку', hours: 4.0 },
      { key: 'B', text: 'Маю нагадування і форму для збору адрес, але передача підрядникам на мені', hours: 2.0 },
      { key: 'C', text: 'Система сама збирає дані, а vendor відправляє бокси без моєї участі', hours: 0.0 },
    ],
  },
];

export const SHORT_TOPICS = [
  'Відпустки і лікарняні',
  'Пульс-опитування eNPS',
  'Статуси команд',
  'Розклад англійської',
  'Прогрес англійської',
  'Типові документи',
  'Performance Review 360°',
  'Онбординг і доступи',
  'Бюджети L&D',
  'Місячний HR-звіт',
  'Turnover rate',
  'Мерч і подарунки',
];

export const CALC_CONFIG = {
  hourlyRate: 12, // $12 за годину HR
  weeksPerMonth: 4,
};

export type ZoneType = 'red' | 'yellow' | 'green';

export interface ZoneConfig {
  type: ZoneType;
  badge: string;
  badgeClass: string;
  titleTemplate: (weekHours: number, monthMoney: number) => string;
  desc: string;
  ctaText: string;
  secondaryCtaText: string;
}

export const ZONES: Record<ZoneType, ZoneConfig> = {
  red: {
    type: 'red',
    badge: 'Критичний рівень ручної праці',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    titleTemplate: (h, m) =>
      `Ваша компанія втрачає ${h} годин на тиждень. Це обходиться бізнесу в $${m} щомісяця!`,
    desc: "Ваш HR-відділ працює як дата-центр. Масштаб у вашій компанії вимагає термінової автоматизації, інакше ви просто оплачуєте роботу з таблицями за рейтом HR-фахівців. Найбільше грошей з'їдають звіти, збір статусів та ручне адміністрування навчання (зокрема англійської).",
    ctaText: 'Отримати демо та зупинити втрати',
    secondaryCtaText: 'Забронювати консультацію щодо платформи',
  },
  yellow: {
    type: 'yellow',
    badge: 'Помірний рівень автоматизації',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    titleTemplate: (h, m) =>
      `Рутина з'їдає ${h} годин на тиждень. Бізнес втрачає на цьому $${m} щомісяця.`,
    desc: 'У вас непогана база, але ви досі втрачаєте гроші на мікроменеджменті. Особливо на адмініструванні англійської, мерчу та аналітиці звільнень. Ви можете вивільнити цей час для стратегічної роботи з людьми.',
    ctaText: 'Дізнатися, як автоматизувати англійську',
    secondaryCtaText: 'Отримати персональну презентацію B2B-кабінету',
  },
  green: {
    type: 'green',
    badge: 'Зразковий рівень автоматизації',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    titleTemplate: (h, m) =>
      `Вашій автоматизації можна позаздрити! Ви втрачаєте лише ${h} год/тижд ($${m}/міс).`,
    desc: 'Ви побудували чудову систему. Скрипти працюють, боти збирають статуси, дашборди будуються самі. Тепер переконайтеся, що ваші підрядники з навчання співробітників працюють так само технологічно.',
    ctaText: 'Протестувати B2B HR-кабінет JustSchool',
    secondaryCtaText: 'Дізнатися про інтеграції з вашою HRM',
  },
};

export function getZone(baseHours: number): ZoneType {
  if (baseHours > 25) return 'red';
  if (baseHours < 10) return 'green';
  return 'yellow';
}
