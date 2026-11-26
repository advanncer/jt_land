export type QuestionKey = 'level' | 'goal' | 'time';

export interface Option {
  id: string;
  label: string;
  subtitle?: string;
}

export interface Question {
  key: QuestionKey;
  question: string;
  options: Option[];
}

// ─── Offer config: one landing for both creatives ─────────────────────────
export const OFFER = {
  firstLessonPrice: 0,
  pricePerLesson: 86,
  bestLessonsPerWeek: 4,
  // Package conditions for the footnote. null → the footnote ends after «на тиждень».
  packageTerms: null as string | null, // [умови пакета]
};

export const FOOTNOTE = `*при ${OFFER.bestLessonsPerWeek} заняттях на тиждень${OFFER.packageTerms ? `, ${OFFER.packageTerms}` : ''}`;

export const MARQUEE = [
  `Перший урок — ${OFFER.firstLessonPrice} грн`,
  `Від ${OFFER.pricePerLesson} грн/урок`,
  `${OFFER.bestLessonsPerWeek} заняття на тиждень`,
  'Для дорослих',
];

export const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
export const HERO_DAYS = ['Пн', 'Вт', 'Чт', 'Сб'];

// 1 заняття · 2–4 заняття · 5+ занять
export const lessonsWord = (n: number) => (n === 1 ? 'заняття' : n >= 2 && n <= 4 ? 'заняття' : 'занять');

export const LEVEL: Question = {
  key: 'level',
  question: 'Який у вас зараз рівень англійської?',
  options: [
    { id: 'zero', label: 'Нуль', subtitle: 'Починаю з чистого аркуша' },
    { id: 'beginner', label: 'Початковий', subtitle: 'Знаю базові слова й прості фрази' },
    { id: 'intermediate', label: 'Середній', subtitle: 'Можу підтримати просту розмову' },
    { id: 'upper', label: 'Вище середнього', subtitle: 'Говорю, але хочу вільніше' },
  ],
};

export const GOAL: Question = {
  key: 'goal',
  question: 'Навіщо вам англійська?',
  options: [
    { id: 'work', label: 'Для роботи' },
    { id: 'travel', label: 'Для подорожей' },
    { id: 'relocate', label: 'Для переїзду' },
    { id: 'self', label: 'Для себе' },
  ],
};

export const TIME: Question = {
  key: 'time',
  question: 'О котрій вам зручно?',
  options: [
    { id: 'morning', label: 'Зранку', subtitle: 'до 12:00' },
    { id: 'day', label: 'Вдень', subtitle: '12:00–18:00' },
    { id: 'evening', label: 'Ввечері', subtitle: 'після 18:00' },
  ],
};

export const PRIVACY_URL = 'https://justschool.me/uk/privacy-policy';
