export interface QuizOption {
  label: string;
  value: string;
  emoji: string;
}

export interface BottomBlock {
  type: 'testimonial' | 'fact';
  name?: string;
  photoUrl?: string;
  text: string;
  stars?: number;
  icon?: string;
  title?: string;
}

export interface QuizStep {
  step: number;
  question: string;
  subtitle?: string;
  type: 'choice' | 'loader' | 'program_ready' | 'lead_name' | 'lead_contacts';
  options?: QuizOption[];
  bottomBlock?: BottomBlock;
  points?: string[];
  cta?: string;
  guarantee_text?: string;
  form?: {
    name_placeholder?: string;
    email_placeholder?: string;
    phone_placeholder?: string;
    cta?: string;
  };
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: 'choice',
    question: 'Для кого ти шукаєш навчання?',
    options: [
      { label: 'Для себе', value: 'self', emoji: '🙋‍♀️' },
      { label: 'Для дитини', value: 'child', emoji: '👧' },
      { label: 'Для всієї родини', value: 'family', emoji: '👨‍👩‍👧‍👦' },
    ],
    bottomBlock: {
      type: 'testimonial',
      name: 'Аліна',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg', // Placeholder
      text: 'JustSchool — це любов! За 2 місяці занять я подолала мовний бар\'єр і успішно пройшла співбесіду. Платформа просто неймовірна, все в одному місці!',
      stars: 5,
      title: 'Студентка JustSchool'
    }
  },
  {
    step: 2,
    type: 'choice',
    question: 'Вкажіть ваш вік',
    subtitle: 'Вік — це лише цифра! У нас є студенти від 5 до 65 років. Головне — ваше бажання вчитися, а комфортний темп ми забезпечимо.',
    options: [
      { label: 'Менше 18', value: 'u18', emoji: '🌑' },
      { label: '18-24', value: '18-24', emoji: '🌗' },
      { label: '25-35', value: '25-35', emoji: '🌖' },
      { label: '35+', value: '35+', emoji: '🌕' },
    ],
    bottomBlock: {
      type: 'fact',
      title: 'Цікавий факт',
      text: '80% уроку — це розмовна практика',
      icon: 'BookOpen'
    }
  },
  // Placeholder steps to fill up to 15 if needed, but I'll start with these two + flow end
  {
    step: 13,
    type: 'loader',
    question: 'Обробляємо ваші дані...',
    points: [
      'Аналізуємо вашу мету навчання',
      'Оцінюємо побажання щодо графіка',
      'Підбираємо найкращих викладачів',
      'Бронюємо місце на пробний урок',
    ],
  },
  {
    step: 14,
    type: 'lead_name',
    question: 'Раді знайомству! Як нам до тебе звертатися?',
    form: {
      name_placeholder: 'Твоє ім\'я',
    }
  },
  {
    step: 15,
    type: 'lead_contacts',
    question: 'Твоя покрокова стратегія успіху готова!',
    subtitle: 'Залиш свої контакти, щоб отримати персональний план та справжній заряд мотивації для потужного старту.',
    guarantee_text: 'Ми допоможемо тобі в усьому. Твої дані в безпеці.',
    form: {
      email_placeholder: 'Твій e-mail',
      phone_placeholder: 'Твій номер телефону',
    }
  }
];
