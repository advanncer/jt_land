export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizReview {
  name: string;
  text: string;
}

export interface QuizStep {
  step: number;
  question?: string;
  subtext?: string;
  type: 'hero' | 'choice' | 'testimonials' | 'value' | 'loader' | 'lead_name' | 'lead_contacts';
  options?: QuizOption[];
  points?: string[];
  reviews?: QuizReview[];
  cta?: string;
  meta?: string;
  pre_cta?: string;
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'hero',
    question: "Твоя вільна англійська починається тут — з гарантією JustSchool",
    subtext: "🔥 87% наших студентів долають мовний бар'єр вже за перший місяць. Навчайся за власним графіком із топовими викладачами.",
    pre_cta: "Лише 30 секунд, щоб дізнатися свій рівень:",
    cta: "Пройти тест",
    meta: "Безкоштовно та миттєво"
  },
  {
    step: 2,
    type: 'choice',
    question: "Для кого шукаєте навчання?",
    options: [
      { label: "Для себе", value: "self" },
      { label: "Для дитини", value: "child" },
      { label: "Для всієї родини", value: "family" }
    ]
  },
  {
    step: 3,
    type: 'choice',
    question: "Скільки вам років?",
    subtext: "Ми знайдемо для вас ідеальний формат та викладача.",
    options: [
      { label: "Менше 18", value: "u18" },
      { label: "18-24", value: "18-24" },
      { label: "25-35", value: "25-35" },
      { label: "35 і більше", value: "o35" }
    ]
  },
  {
    step: 4,
    type: 'choice',
    question: "Який ваш рівень англійської?",
    options: [
      { label: "Початківець", value: "beginner" },
      { label: "Трохи розумію", value: "passive" },
      { label: "Спілкуюся", value: "intermediate" },
      { label: "Вільно володію", value: "advanced" }
    ]
  },
  {
    step: 5,
    type: 'choice',
    question: "Яка ваша головна мета?",
    options: [
      { label: "Кар'єра", value: "career" },
      { label: "Подорожі", value: "travel" },
      { label: "Саморозвиток", value: "self" },
      { label: "Переїзд", value: "relocation" }
    ]
  },
  {
    step: 6,
    type: 'testimonials',
    question: "Відгуки студентів",
    reviews: [
      { name: "Аліна", text: "За 2 місяці подолала мовний бар'єр и пройшла співбесіду!" },
      { name: "Ігор", text: "Багато розмовної практики на кожному уроці. Бачу реальний прогрес." }
    ]
  },
  {
    step: 7,
    type: 'value',
    question: "Наші переваги",
    points: [
      "Індивідуальна стратегія",
      "Сотні сертифікованих викладачів",
      "Власний інтерактивний додаток"
    ]
  },
  {
    step: 8,
    type: 'value',
    question: "Ваша програма майже готова!",
    points: [
      "Комфортний темп: 3 заняття",
      "Фокус на розмовній практиці",
      "4000+ нових слів"
    ]
  },
  {
    step: 9,
    type: 'loader',
    question: "Формуємо план...",
    points: [
      "Враховуємо інтереси",
      "Оцінюємо рівень",
      "Підбираємо ментора"
    ]
  },
  {
    step: 10,
    type: 'lead_name',
    question: "Готові підкорити англійську?",
    subtext: "Як до вас звертатися?",
    cta: "Далі"
  },
  {
    step: 11,
    type: 'lead_contacts',
    question: "Лишився останній крок!",
    subtext: "Куди надіслати вашу програму навчання?",
    cta: "Отримати програму"
  }
];
