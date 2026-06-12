import alinaPhoto from "../../lp-check-up/src/assets/reviews/alina.jpg";

export interface QuizOption {
  label: string;
  value: string;
  emoji: string;
}

export interface BottomBlock {
  type: "testimonial" | "fact";
  name?: string;
  photoUrl?: string;
  text: string;
  stars?: number;
  title?: string;
  icon?: string;
}

export interface QuizStep {
  step: number;
  type: "hero" | "choice" | "loader" | "lead_contacts";
  question?: string;
  subtitle?: string;
  options?: QuizOption[];
  bottomBlock?: BottomBlock;
  points?: string[];
}

export const quizData: QuizStep[] = [
  {
    step: 1,
    type: "hero",
  },
  {
    step: 2,
    type: "choice",
    question: "Для кого ти шукаєш навчання?",
    options: [
      { label: "Для себе", value: "self", emoji: "🙋‍♀️" },
      { label: "Для дитини", value: "child", emoji: "👧" },
      { label: "Для всієї родини", value: "family", emoji: "👨‍👩‍👧‍👦" },
    ],
    bottomBlock: {
      type: "testimonial",
      name: "Аліна",
      photoUrl: alinaPhoto,
      title: "Студентка JustSchool",
      stars: 5,
      text: "JustSchool — це любов! За 2 місяці занять я подолала мовний бар'єр і успішно пройшла співбесіду. Платформа просто неймовірна, все в одному місці!",
    },
  },
  {
    step: 3,
    type: "choice",
    question: "Вкажіть ваш вік",
    subtitle: "Вік — це лише цифра! У нас є студенти від 5 до 65 років. Головне — ваше бажання вчитися, а комфортний темп ми забезпечимо.",
    options: [
      { label: "Менше 18", value: "u18", emoji: "🌑" },
      { label: "18-24", value: "18-24", emoji: "🌗" },
      { label: "25-35", value: "25-35", emoji: "🌖" },
      { label: "35+", value: "35+", emoji: "🌕" },
    ],
    bottomBlock: {
      type: "fact",
      title: "Цікавий факт",
      text: "80% уроку — це розмовна практика",
    },
  },
  {
    step: 4,
    type: "loader",
    question: "Ми формуємо для вас персоналізовану програму!",
    points: [
      "Аналізуємо інтереси",
      "Визначаємо рівень знань та цілі навчання",
      "Персоналізуємо програму",
      "Консультуємо з методистом"
    ],
  },
  {
    step: 5,
    type: "lead_contacts",
  },
];
