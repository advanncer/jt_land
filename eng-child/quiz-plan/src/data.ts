export type StepType =
  | 'hero'
  | 'choice'
  | 'multi'
  | 'interstitial'
  | 'testimonials'
  | 'loader'
  | 'lead_name'
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
    social_proof: '🎓 ВИБІР 17 000+ СТУДЕНТІВ',
    title: 'Дізнайся, з чого почати англійську твоїй дитині, та отримай персональний план навчання',
    subtitle:
      'Пройди 5-хвилинне опитування — отримай план та безкоштовний пробний урок з викладачем',
    cta: 'ПОЧАТИ →',
    stats: [
      { value: '17 000+', label: 'студентів' },
      { value: '3.8M+', label: 'занять' },
      { value: '1 700+', label: 'викладачів' },
      { value: '95%', label: 'рекомендують' },
    ],
  },
  {
    id: 2,
    type: 'choice',
    question: 'Для початку — хто буде навчатися?',
    subtitle: 'Це допоможе підібрати ідеального викладача',
    options: [
      { label: 'Хлопчик', value: 'boy', emoji: '👦' },
      { label: 'Дівчинка', value: 'girl', emoji: '👧' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: 'Скільки років дитині?',
    subtitle: 'Підберемо оптимальний формат навчання та програму',
    options: [
      { label: '4–6', value: '4-6', emoji: '🧸' },
      { label: '7–9', value: '7-9', emoji: '🎒' },
      { label: '10–12', value: '10-12', emoji: '📗' },
      { label: '13–15', value: '13-15', emoji: '🎓' },
      { label: '16–17', value: '16-17', emoji: '🏆' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    question: 'Який рівень англійської у дитини?',
    subtitle: 'Під кожен рівень є адаптована програма навчання',
    options: [
      { label: 'Нульовий — тільки починаємо', value: 'zero', emoji: '🌱' },
      { label: 'Початковий — знає букви та прості слова', value: 'beginner', emoji: '📗' },
      { label: 'Середній — може будувати прості речення', value: 'intermediate', emoji: '📘' },
      { label: 'Впевнений — вільно спілкується на базові теми', value: 'confident', emoji: '📙' },
      { label: 'Не знаю — визначить викладач', value: 'unknown', emoji: '🤔' },
    ],
  },
  {
    id: 5,
    type: 'multi',
    question: 'Що для тебе найважливіше у навчанні дитини?',
    subtitle: 'Обери всі варіанти, що підходять',
    cta: 'ДАЛІ →',
    options: [
      { label: 'Розмовна англійська без страху', value: 'speaking', emoji: '🗣️' },
      { label: 'Підтягнути шкільну програму', value: 'school', emoji: '📚' },
      { label: 'Навчання/переїзд за кордон', value: 'abroad', emoji: '✈️' },
      { label: 'Підготовка до ЗНО/НМТ чи іспитів', value: 'exams', emoji: '📝' },
      { label: 'Цікаве дозвілля замість гаджетів', value: 'leisure', emoji: '🎮' },
      { label: 'Загальний розвиток та впевненість', value: 'development', emoji: '🚀' },
    ],
  },
  {
    id: 6,
    type: 'multi',
    question: 'Який курс цікавить?',
    subtitle: 'Можеш обрати декілька варіантів',
    cta: 'ДАЛІ →',
    options: [
      { label: 'Загальний курс', value: 'general', emoji: '📚' },
      { label: 'Розмовна практика', value: 'speaking_practice', emoji: '🗣️' },
      { label: 'Допомога зі шкільною програмою', value: 'school_help', emoji: '🏫' },
      { label: 'Підготовка до іспитів (НМТ, Cambridge)', value: 'cambridge_nmt', emoji: '🎯' },
      { label: 'Для переїзду', value: 'relocation', emoji: '🏡' },
      { label: 'Інтенсив (3 місяці)', value: 'intensive', emoji: '⚡' },
    ],
  },
  {
    id: 7,
    type: 'interstitial',
    title: 'Понад 17 000 студентів навчаються у JustSchool',
    subtitle: 'Ми підберемо найефективнішу програму та викладача саме для твоєї дитини',
    cta: 'ПРОДОВЖИТИ →',
    stats: [
      { value: '17 000+', label: 'активних студентів' },
      { value: '3 800 000+', label: 'успішних занять' },
      { value: '1 700+', label: 'досвідчених викладачів' },
      { value: '95%', label: 'рекомендують нас' },
    ],
  },
  {
    id: 8,
    type: 'lead_name',
    question: 'Як звати твою дитину?',
    cta: 'Далі →',
  },
  {
    id: 9,
    type: 'testimonials',
    title: 'Чудово! Ти майже там!',
    subtitle: 'Ще 2 питання — і ми сформуємо персональний план та підберемо викладача',
    cta: 'ПРОДОВЖИТИ →',
    reviews: [
      {
        name: 'Аліна К.',
        text: 'Син за 2 місяці перестав боятися говорити англійською',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Ігор М.',
        text: 'Донька сама біжить на урок — викладач знайшов підхід',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Марина В.',
        text: 'Оцінки в школі підтягнулися вже після місяця занять',
        emoji: '⭐⭐⭐⭐⭐',
      },
    ],
  },
  {
    id: 10,
    type: 'choice',
    question: 'Коли плануєте почати навчання?',
    options: [
      { label: 'Якнайшвидше', value: 'asap', emoji: '🔥' },
      { label: 'Протягом місяця', value: 'month', emoji: '📅' },
      { label: 'Поки роздумую', value: 'thinking', emoji: '🤔' },
    ],
  },
  {
    id: 11,
    type: 'choice',
    question: 'Скільки занять на тиждень?',
    subtitle: '3+ заняття на тиждень = помітний результат за 6 місяців',
    options: [
      { label: '1', value: '1', emoji: '🌙' },
      { label: '2', value: '2', emoji: '⚡' },
      { label: '3', value: '3', emoji: '🔥' },
      { label: '4+', value: '4+', emoji: '🚀' },
    ],
  },
  {
    id: 12,
    type: 'loader',
    title: 'Аналізуємо твої відповіді…',
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
    title: '🎉 Персональний план для дитини готовий!',
    subtitle: 'Залиш контакти — отримай план та безкоштовний урок з викладачем',
    cta: 'ОТРИМАТИ ПЛАН І УРОК',
  },
];
