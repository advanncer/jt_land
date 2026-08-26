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
  projects?: { id: string; title: string }[];
  points?: string[];
  reviews?: { name: string; text: string; emoji: string }[];
}

export const STEPS: QuizStep[] = [
  {
    id: 1,
    type: 'hero',
    title: 'Дізнайся, який напрям програмування підходить твоїй дитині — та отримай персональний план',
    subtitle:
      'Пройди 2-хвилинний тест — підберемо курс, рівень і безкоштовний пробний урок з викладачем',
    cta: 'ПОЧАТИ ТЕСТ →',
    social_proof: '🎓 ВИБІР 17 000+ БАТЬКІВ',
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
    question: 'Скільки років Вашій дитині?',
    subtitle: 'Це допоможе підібрати відповідний курс програмування',
    options: [
      { label: '6-7 років', value: '6-7', emoji: '🐥' },
      { label: '8-9 років', value: '8-9', emoji: '🧩' },
      { label: '10-13 років', value: '10-13', emoji: '🚀' },
      { label: '14-17 років', value: '14-17', emoji: '💻' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: 'Який рівень знань у програмуванні має ваша дитина?',
    options: [
      { label: 'Початковий', value: 'beginner', desc: 'ще не пробувала / не пробував', emoji: '🌱' },
      { label: 'Базовий', value: 'basic', desc: 'Scratch, Minecraft або Roblox на початковому рівні', emoji: '🧱' },
      { label: 'Середній', value: 'intermediate', desc: 'створювала прості проєкти', emoji: '⚙️' },
      { label: 'Досвідчений', value: 'advanced', desc: 'вже має готові проєкти / сайти / ігри', emoji: '🏆' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    question: 'Для чого ви хочете, щоб дитина вивчала програмування?',
    options: [
      { label: 'IT майбутнє та кар\'єра', value: 'career', emoji: '🔢' },
      { label: 'Створення власних ігор або сайтів', value: 'games', emoji: '🎮' },
      { label: 'Розвиток логіки та креативності', value: 'logic', emoji: '🧠' },
      { label: 'Корисне проведення часу замість гаджетів', value: 'useful', emoji: '📱' },
      { label: 'Самостійність та проєктне мислення', value: 'independence', emoji: '🚀' },
    ],
  },
  {
    id: 5,
    type: 'interstitial',
    title: 'Ось так виглядають проєкти наших учнів',
    cta: 'ПРОДОВЖИТИ →',
    projects: [
      { id: 'SjGMdETg8_8', title: 'Roblox 2' },
      { id: 'ueIsBXKliNE', title: 'Roblox 1' },
      { id: 'JK7b_OtfkIk', title: 'Створення сайтів 4' },
      { id: '0m2PoN1gOxI', title: 'Game Design 4' }
    ]
  },
  {
    id: 6,
    type: 'multi',
    question: 'Які напрямки програмування вам важливо прокачати у дитини?',
    subtitle: 'Можете обрати декілька варіантів',
    cta: 'ДАЛІ →',
    options: [
      { label: 'Створення ігор', value: 'games', emoji: '🎮' },
      { label: 'Робота з логікою', value: 'logic', emoji: '🧠' },
      { label: 'Креативність', value: 'creativity', emoji: '🎨' },
      { label: 'Робота з комп\'ютером', value: 'pc', emoji: '💻' },
      { label: 'Навички роботи в команді', value: 'team', emoji: '👥' },
    ],
  },
  {
    id: 7,
    type: 'testimonials',
    title: 'Чудово! Ти майже там!',
    subtitle: 'Ще 1 крок — і ми підберемо ідеальний курс та викладача',
    cta: 'ПРОДОВЖИТИ →',
    reviews: [
      {
        name: 'Олена М.',
        text: 'Син у захваті! Замість безглуздих ігор на телефоні тепер сам створює свої ігри в Roblox.',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Андрій К.',
        text: 'Дуже подобається підхід викладачів. Дочка стала більш уважною, розвиває логіку.',
        emoji: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Ірина В.',
        text: 'Класний формат навчання! Ми почали з нуля, а зараз син вже показує свої перші сайти.',
        emoji: '⭐⭐⭐⭐⭐',
      },
    ],
  },
  {
    id: 8,
    type: 'lead_name',
    question: 'Як звати вашу дитину?',
    cta: 'Далі →',
  },
  {
    id: 9,
    type: 'loader',
    title: 'Аналізуємо відповіді…',
    points: [
      'Оцінюємо рівень підготовки',
      'Визначаємо мету навчання',
      'Підбираємо напрям (ігри / сайти / логіка)',
      'Складаємо графік занять',
      'Персоналізуємо план навчання',
      'Підбираємо викладача-ментора',
    ],
  },
  {
    id: 10,
    type: 'lead_form',
    title: '🎉 Персональний план з програмування готовий!',
    subtitle: 'Залиш контакти — отримай план та безкоштовний пробний урок з викладачем',
    cta: 'ОТРИМАТИ ПЛАН І УРОК',
  },
];
