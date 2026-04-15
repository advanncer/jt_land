export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizStep {
  step: number;
  question?: string;
  subtext?: string;
  type: 'hero' | 'choice' | 'testimonials' | 'value' | 'loader' | 'lead';
  options?: QuizOption[];
  points?: string[];
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'hero',
    question: 'АнтиШкола навчає 11 РОКІВ!',
    subtext: '🔥87% учнів апгрейдеть англійську вже за 1 місяць. Вивчай англійську з носієм мови в будь-який час.',
  },
  {
    step: 2,
    type: 'choice',
    question: 'Для кого шукаєте навчання?',
    options: [
      { label: 'Для себе', value: 'self' },
      { label: 'Для дитини', value: 'child' },
      { label: 'Для всієї родини', value: 'family' },
    ],
  },
  {
    step: 3,
    type: 'choice',
    question: 'Скільки тобі років',
    subtext: 'Ми впевнені, що в тебе вийде! Ми підберемо для тебе потрібний формат навчання.',
    options: [
      { label: 'Менше 18', value: 'u18' },
      { label: '18-24', value: '18-24' },
      { label: '25-35', value: '25-35' },
      { label: '35 і більше', value: 'o35' },
    ],
  },
  {
    step: 4,
    type: 'choice',
    question: 'Відмінно! Підкажи, а який рівень англійської у тебе?',
    subtext: 'Під кожен рівень у нас є своя программа навчання, адаптована під твою мету',
    options: [
      { label: 'Нульовий', value: 'a0' },
      { label: 'Початковий', value: 'a1-a2' },
      { label: 'Середній', value: 'b1-b2' },
      { label: 'Просунутий', value: 'c1-c2' },
    ],
  },
  {
    step: 5,
    type: 'testimonials',
  },
  {
    step: 6,
    type: 'choice',
    question: 'Як часто ти практикуєш англійську?',
    options: [
      { label: 'Розмовляю щодня', value: 'daily' },
      { label: 'Іноді розмовляю', value: 'sometimes' },
      { label: 'Говорю, але рідко', value: 'rarely' },
      { label: 'Немає практики', value: 'none' },
    ],
  },
  {
    step: 7,
    type: 'choice',
    question: 'Що найскладніше для тебе в англійській?',
    options: [
      { label: 'Запам\'ятати нові слова', value: 'vocab' },
      { label: 'Розбиратись у граматиці', value: 'grammar' },
      { label: 'Говорити англійською', value: 'speaking' },
      { label: 'Розуміти мову на слух', value: 'listening' },
    ],
  },
  {
    step: 8,
    type: 'value',
    question: 'Персональна програма навчання',
    points: [
      'Персональна програма навчання',
      'Вибір з 700 викладачів',
      'Індивідуальний або груповий формат навчання',
      'Онлайн платформа з усіма матеріалами',
    ],
  },
  {
    step: 9,
    type: 'choice',
    question: 'Як швидко тобі потрібен результат?',
    options: [
      { label: 'Терміново', value: 'urgent' },
      { label: 'Є кілька місяців', value: 'months' },
      { label: 'Нема поспіху', value: 'chill' },
    ],
  },
  {
    step: 10,
    type: 'choice',
    question: 'Коли плануєте почати навчання?',
    options: [
      { label: 'Як можна швидше', value: 'asap' },
      { label: 'Я не спішу', value: 'later' },
    ],
  },
  {
    step: 11,
    type: 'choice',
    question: 'Що тобі зараз цікавіше?',
    subtext: 'У кожній програмі ми робимо акцент на тих навичках, що потрібні саме тобі.',
    options: [
      { label: 'Вільно розмовляти', value: 'fluency' },
      { label: 'Вивчити граматику', value: 'grammar' },
      { label: 'Розширити словниковий запас', value: 'vocabulary' },
      { label: 'Все і одразу', value: 'all' },
    ],
  },
  {
    step: 12,
    type: 'value',
    question: 'Вільна англійська за 3 заняття на тиждень',
    points: [
      'Навчайся тричі на тиждень',
      'Багато розмовної практики',
      'Більше 4000 нових слів за 6 місяців',
    ],
  },
  {
    step: 13,
    type: 'choice',
    question: 'Скільки ти готовий приділяти навчанню?',
    subtext: 'Якщо займатимешся 3 рази на тиждень, то через 12 місяців у тебе буде вільна англійська.',
    options: [
      { label: '1 заняття на тиждень', value: '1' },
      { label: '2 заняття на тиждень', value: '2' },
      { label: '3 заняття на тиждень', value: '3' },
      { label: '4 і більше занять', value: '4+' },
    ],
  },
  {
    step: 14,
    type: 'loader',
    question: 'Аналізуємо відповіді та збираємо програму навчання',
  },
  {
    step: 15,
    type: 'lead',
    question: 'Ну що, готовий вивчити англійську?',
    subtext: 'Залиш контакти, щоб отримати безкоштовний пробний урок та план навчання.',
  },
];
