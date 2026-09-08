export type StepType =
  | 'hero'
  | 'choice'
  | 'multi'
  | 'interstitial'
  | 'word_test'
  | 'testimonials'
  | 'loader'
  | 'lead_form';

export interface StepOption {
  label: string;
  value: string;
  desc?: string;
  emoji?: string;
}

export interface QuizStep {
  id: number;
  type: StepType;
  question?: string;
  subtitle?: string;
  title?: string;
  social_proof?: string;
  cta?: string;
  options?: StepOption[];
  stats?: { value: string; label: string }[];
  points?: string[];
  reviews?: { name: string; text: string; role?: string; emoji: string }[];
}

export const STEPS: QuizStep[] = [
  {
    id: 1,
    type: 'hero',
    title: 'Дізнайся свій рівень англійської та отримай персональний план навчання',
    subtitle:
      'Пройди 5-хвилинний інтерактивний тест: визнач рівень, отримай персональну програму та безкоштовний пробний урок з викладачем.',
    cta: 'Почати тест',
    social_proof: '🎓 Вибір 17 000+ дорослих студентів',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Для початку — хто ти?',
    subtitle: 'Це допоможе підібрати ідеального викладача та формат спілкування',
    options: [
      { label: 'Жінка', value: 'female', emoji: '👩' },
      { label: 'Чоловік', value: 'male', emoji: '👨' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: 'Скільки тобі років?',
    subtitle: 'Підберемо оптимальну групу тем, темп та методику',
    options: [
      { label: 'До 18', value: 'under18', emoji: '🎒' },
      { label: '18–24', value: '18-24', emoji: '🎓' },
      { label: '25–34', value: '25-34', emoji: '💼' },
      { label: '35–44', value: '35-44', emoji: '🏆' },
      { label: '45–54', value: '45-54', emoji: '⭐' },
      { label: '55+', value: '55plus', emoji: '🌟' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    question: 'Як ти оцінюєш свій поточний рівень?',
    subtitle: 'Під кожен рівень у нас є персоналізована програма',
    options: [
      { label: 'Нульовий (Starter / A0)', value: 'a0', desc: 'Не вчив або все забув, хочу з нуля', emoji: '🌱' },
      { label: 'Початковий (Elementary / A1–A2)', value: 'a1-a2', desc: 'Знаю базові слова, важко скласти речення', emoji: '📗' },
      { label: 'Середній (Intermediate / B1)', value: 'b1', desc: 'Розумію суть, можу говорити на прості теми', emoji: '📘' },
      { label: 'Вище середнього (Upper-Int / B2)', value: 'b2', desc: 'Говорю вільно, хочу прибрати помилки й бар’єри', emoji: '📙' },
      { label: 'Просунутий (Advanced / C1+)', value: 'c1plus', desc: 'Майже вільно, прагну відшліфувати нюанси', emoji: '🏅' },
    ],
  },
  {
    id: 5,
    type: 'multi',
    question: 'Що тебе мотивує вивчати англійську?',
    subtitle: 'Обери всі ключові цілі (можна кілька)',
    cta: 'Продовжити →',
    options: [
      { label: "Кар'єра та підвищення зарплати", value: 'career', emoji: '💼' },
      { label: 'Переїзд або життя за кордоном', value: 'relocation', emoji: '✈️' },
      { label: 'Комфортні подорожі без перекладача', value: 'travel', emoji: '🗺️' },
      { label: 'Вільне спілкування з іноземцями та колегами', value: 'communication', emoji: '🌍' },
      { label: 'Серіали, книги, подкасти в оригіналі', value: 'content', emoji: '🎬' },
      { label: 'Підготовка до міжнародних іспитів (IELTS / TOEFL)', value: 'exams', emoji: '📝' },
      { label: 'Особистий розвиток та впевненість у собі', value: 'self-dev', emoji: '🚀' },
    ],
  },
  {
    id: 6,
    type: 'multi',
    question: 'Який напрям або формат тобі ближчий?',
    subtitle: 'Можеш обрати один або кілька варіантів',
    cta: 'Продовжити →',
    options: [
      { label: 'Розмовна практика (Speaking Club)', value: 'speaking', emoji: '🗣️' },
      { label: 'Загальний комплексний курс', value: 'general', emoji: '📚' },
      { label: 'Business English для роботи та переговорів', value: 'business', emoji: '💼' },
      { label: 'Інтенсивний експрес-курс (результат за 3 міс)', value: 'express', emoji: '⚡' },
      { label: 'Підготовка до співбесіди чи переїзду', value: 'moving', emoji: '🏠' },
      { label: 'Підготовка до тестування IELTS / Duolingo', value: 'exams', emoji: '🎯' },
    ],
  },
  {
    id: 7,
    type: 'interstitial',
    title: 'Понад 17 000 дорослих уже навчаються у JustSchool',
    subtitle: 'Методика 80% практики та 20% теорії гарантує, що ти заговориш уже з перших уроків.',
    cta: 'Пройти експрес-тест слів →',
    stats: [
      { value: '17 000+', label: 'активних студентів' },
      { value: '3.8 млн+', label: 'проведених занять' },
      { value: '1 700+', label: 'сертифікованих викладачів' },
      { value: '96%', label: 'досягають своєї мети' },
    ],
  },
  {
    id: 8,
    type: 'word_test',
    question: 'Познач слова, значення яких ти точно знаєш',
    subtitle: 'Відповідай чесно — це допоможе максимально точно визначити твій рівень словникового запасу 🙂',
    cta: 'Розрахувати результат →',
  },
  {
    id: 9,
    type: 'testimonials',
    title: 'Чудовий результат! Ти майже біля мети 🎉',
    subtitle: 'Залишилося лише 2 уточнення, і ми сформуємо персональну дорожню карту',
    cta: 'Продовжити складання плану →',
    reviews: [
      {
        name: 'Аліна К.',
        role: 'IT Project Manager',
        text: "За 2 місяці повністю подолала мовний бар'єр і пройшла технічну співбесіду в міжнародну компанію!",
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Ігор М.',
        role: 'Маркетолог',
        text: 'Платформа JustSchool неймовірно зручна. Уроки проходять на одному диханні, 80% часу ми просто говоримо.',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Марина В.',
        role: 'Підприємиця',
        text: 'Перша школа, де навчання не відчувається як нудне заучування. Результат бачу щотижня на роботі!',
        emoji: '⭐⭐⭐⭐⭐',
      },
    ],
  },
  {
    id: 10,
    type: 'choice',
    question: 'Коли плануєш розпочати навчання?',
    options: [
      { label: 'Якнайшвидше (готовий стартувати на цьому тижні)', value: 'asap', emoji: '🔥' },
      { label: 'Протягом 2–4 тижнів', value: 'month', emoji: '📅' },
      { label: 'Поки розглядаю варіанти та порівнюю', value: 'considering', emoji: '🤔' },
    ],
  },
  {
    id: 11,
    type: 'choice',
    question: 'Скільки занять на тиждень буде комфортно?',
    subtitle: 'Рекомендація методистів: 2–3 заняття для стабільного прогресу без перевтоми',
    options: [
      { label: '1 заняття на тиждень (підтримуючий темп)', value: '1x', emoji: '🌙' },
      { label: '2 заняття на тиждень (стандартний баланс)', value: '2x', emoji: '⚡' },
      { label: '3 заняття на тиждень (швидкий результат)', value: '3x', emoji: '🔥' },
      { label: '4+ занять на тиждень (максимальне занурення)', value: '4xplus', emoji: '🚀' },
    ],
  },
  {
    id: 12,
    type: 'loader',
    title: 'Аналізуємо твої відповіді та формуємо план...',
    points: [
      'Оцінюємо лексичний запас та словникову матрицю',
      'Сегментуємо пріоритетні цілі навчання',
      'Підбираємо персональні теми для розмовної практики',
      'Розраховуємо графік та темп занять',
      'Формуємо дорожню карту досягнення цілі',
      'Призначаємо провідного методиста на пробний урок',
    ],
  },
  {
    id: 13,
    type: 'lead_form',
    title: '🎉 Твій персональний план навчання сформовано!',
    subtitle: 'Залиш контакти — отримай персональну програму та безкоштовний 45-хвилинний пробний урок з викладачем у подарунок.',
    cta: 'Отримати план та урок',
  },
];

export interface WordEntry {
  word: string;
  level: 'a1' | 'a2' | 'b1' | 'b2' | 'c1';
}

export const WORDS: WordEntry[] = [
  // A1 — базові
  { word: 'shop', level: 'a1' },
  { word: 'book', level: 'a1' },
  { word: 'fast', level: 'a1' },
  { word: 'love', level: 'a1' },
  { word: 'door', level: 'a1' },
  { word: 'food', level: 'a1' },
  { word: 'work', level: 'a1' },
  { word: 'home', level: 'a1' },
  // A2 — елементарний
  { word: 'hair', level: 'a2' },
  { word: 'easy', level: 'a2' },
  { word: 'soon', level: 'a2' },
  { word: 'deep', level: 'a2' },
  // B1 — середній
  { word: 'schedule', level: 'b1' },
  { word: 'achieve', level: 'b1' },
  { word: 'manage', level: 'b1' },
  { word: 'journey', level: 'b1' },
  { word: 'provide', level: 'b1' },
  { word: 'describe', level: 'b1' },
  { word: 'improve', level: 'b1' },
  // B2 — вище середнього
  { word: 'resilience', level: 'b2' },
  { word: 'eloquent', level: 'b2' },
  { word: 'pragmatic', level: 'b2' },
  { word: 'leverage', level: 'b2' },
  { word: 'meticulous', level: 'b2' },
  // C1 — просунутий
  { word: 'juxtapose', level: 'c1' },
  { word: 'ameliorate', level: 'c1' },
  { word: 'perspicacious', level: 'c1' },
  { word: 'sycophant', level: 'c1' },
];
