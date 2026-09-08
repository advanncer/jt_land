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
  reviews?: { name: string; text: string; emoji: string }[];
}

export const STEPS: QuizStep[] = [
  {
    id: 1,
    type: 'hero',
    title: 'Дізнайся свій рівень англійської та отримай персональний план навчання',
    subtitle:
      'Пройди 5-хвилинний тест — дізнайся рівень, отримай план та безкоштовний пробний урок з викладачем',
    cta: 'Почати тест',
    social_proof: '🎓 Вибір 17 000+ студентів',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Для початку — хто ти?',
    subtitle: 'Це допоможе підібрати ідеального викладача',
    options: [
      { label: 'Жінка', value: 'female', emoji: '👩' },
      { label: 'Чоловік', value: 'male', emoji: '👨' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: 'Скільки тобі років?',
    subtitle: 'Підберемо оптимальний формат навчання та рівень',
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
    question: 'Який у тебе рівень англійської?',
    subtitle: 'Під кожен рівень є адаптована програма навчання',
    options: [
      { label: 'Нульовий', value: 'a0', desc: 'Не вчив або все забув', emoji: '🌱' },
      { label: 'Початковий (A1–A2)', value: 'a1-a2', desc: 'Знаю базові слова та фрази', emoji: '📗' },
      { label: 'Середній (B1)', value: 'b1', desc: 'Можу спілкуватися на базові теми', emoji: '📘' },
      { label: 'Вище середнього (B2)', value: 'b2', desc: 'Говорю впевнено, але є помилки', emoji: '📙' },
      { label: 'Просунутий (C1+)', value: 'c1plus', desc: 'Майже вільно, хочу відшліфувати', emoji: '🏅' },
    ],
  },
  {
    id: 5,
    type: 'multi',
    question: 'Що мотивує тебе вивчати англійську?',
    subtitle: 'Обери всі варіанти, що підходять',
    cta: 'Далі →',
    options: [
      { label: "Кар'єра та нові можливості", value: 'career', emoji: '💼' },
      { label: 'Переїзд за кордон', value: 'relocation', emoji: '✈️' },
      { label: 'Подорожі', value: 'travel', emoji: '🗺️' },
      { label: 'Особистий розвиток', value: 'self-dev', emoji: '🚀' },
      { label: 'Серіали, книги та контент', value: 'content', emoji: '🎬' },
      { label: 'Підготовка до іспитів', value: 'exams', emoji: '📝' },
      { label: 'Спілкування з іноземцями', value: 'communication', emoji: '🌍' },
    ],
  },
  {
    id: 6,
    type: 'multi',
    question: 'Який курс тебе цікавить?',
    subtitle: 'Можеш обрати декілька варіантів',
    cta: 'Далі →',
    options: [
      { label: 'Загальний курс', value: 'general', emoji: '📚' },
      { label: 'Розмовна практика', value: 'speaking', emoji: '🗣️' },
      { label: 'Бізнес англійська', value: 'business', emoji: '💼' },
      { label: 'IELTS / TOEFL', value: 'exams', emoji: '🎯' },
      { label: 'Для переїзду', value: 'moving', emoji: '🏠' },
      { label: 'Експрес-курс (3 місяці)', value: 'express', emoji: '⚡' },
    ],
  },
  {
    id: 7,
    type: 'interstitial',
    title: 'Понад 17 000 студентів навчаються у JustSchool',
    subtitle: 'Ми підберемо найефективнішу програму та викладача саме для тебе',
    cta: 'Пройти тест рівня →',
    stats: [
      { value: '17 000+', label: 'активних студентів' },
      { value: '3 800 000+', label: 'успішних занять' },
      { value: '1 700+', label: 'досвідчених викладачів' },
      { value: '95%', label: 'рекомендують нас' },
    ],
  },
  {
    id: 8,
    type: 'word_test',
    question: 'Познач слова, які ти знаєш',
    subtitle: 'Відповідай чесно — так ми визначимо твій реальний рівень 🙂',
    cta: 'Перевірити результат →',
  },
  {
    id: 9,
    type: 'testimonials',
    title: 'Чудово! Ти майже там!',
    subtitle: 'Ще 2 питання — і ми сформуємо твій персональний план та підберемо викладача',
    cta: 'Продовжити →',
    reviews: [
      {
        name: 'Аліна К.',
        text: "За 2 місяці подолала мовний бар'єр і успішно пройшла співбесіду англійською!",
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Ігор М.',
        text: 'Формат ідеально підійшов до мого щільного графіка. Дуже багато розмовної практики.',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Марина В.',
        text: 'Перша школа, де вже через 2 місяці бачу реальний результат!',
        emoji: '⭐⭐⭐⭐⭐',
      },
    ],
  },
  {
    id: 10,
    type: 'choice',
    question: 'Коли плануєш почати навчання?',
    options: [
      { label: 'Якнайшвидше', value: 'asap', emoji: '🔥' },
      { label: 'Протягом місяця', value: 'month', emoji: '📅' },
      { label: 'Поки роздумую', value: 'considering', emoji: '🤔' },
    ],
  },
  {
    id: 11,
    type: 'choice',
    question: 'Скільки занять на тиждень?',
    subtitle: '3+ заняття на тиждень = вільна мова через 6 місяців',
    options: [
      { label: '1 заняття на тиждень', value: '1x', emoji: '🌙' },
      { label: '2 заняття на тиждень', value: '2x', emoji: '⚡' },
      { label: '3 заняття на тиждень', value: '3x', emoji: '🔥' },
      { label: '4+ заняття на тиждень', value: '4xplus', emoji: '🚀' },
    ],
  },
  {
    id: 12,
    type: 'loader',
    title: 'Аналізуємо твої відповіді...',
    points: [
      'Оцінюємо рівень знань',
      'Визначаємо мету навчання',
      'Підбираємо теми для спілкування',
      'Складаємо графік занять',
      'Персоналізуємо план навчання',
      'Підбираємо методиста',
    ],
  },
  {
    id: 13,
    type: 'lead_form',
    title: '🎉 Твій персональний план готовий!',
    subtitle: 'Залиш контакти — отримай план та безкоштовний урок з викладачем',
    cta: 'Отримати план і урок',
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
