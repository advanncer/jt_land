export type StepType =
  | 'hero'
  | 'choice'
  | 'multi'
  | 'interstitial'
  | 'testimonials'
  | 'loader'
  | 'lead_name'
  | 'lead_form';

import roblox3Vid from './assets/videos/roblox3.mp4';
import python3Vid from './assets/videos/python3.mp4';
import websites4Vid from './assets/videos/websites4.mp4';
import gamedesign4Vid from './assets/videos/gamedesign4.mp4';

export interface StepOption {
  label: string;
  value: string;
  desc?: string;
  emoji?: string;
}

export interface QuizStep {
  id: number;
  type: StepType;
  title?: string;
  subtitle?: string;
  question?: string;
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
    social_proof: '🔥 Більше 17 000 студентів',
    title: 'Який напрям програмування підходить вашій дитині?',
    subtitle:
      'Пройдіть тест за 2 хвилини, щоб отримати персональний план навчання та безкоштовний урок',
    cta: 'ПОЧАТИ ТЕСТ',
    stats: [
      { value: '7-17', label: 'років' },
      { value: '1 на 1', label: 'з викладачем' },
    ],
  },
  {
    id: 2,
    type: 'choice',
    question: 'Скільки років вашій дитині?',
    options: [
      { label: '7-9 років', value: '7-9' },
      { label: '10-12 років', value: '10-12' },
      { label: '13-15 років', value: '13-15' },
      { label: '16-17 років', value: '16-17' },
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
      { id: roblox3Vid, title: 'Roblox' },
      { id: python3Vid, title: 'Python' },
      { id: websites4Vid, title: 'Створення сайтів' },
      { id: gamedesign4Vid, title: 'Game Design' }
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
