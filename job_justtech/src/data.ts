export interface QuizOption {
  label: string;
  sublabel?: string;
  badge?: string;
}

export interface QuizStep {
  id: number;
  question: string;
  subtitle?: string;
  options?: QuizOption[];
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 1,
    question: "Скільки тобі років?",
    subtitle: "Обери свою вікову категорію",
    options: [
      { label: "19-25" },
      { label: "26-35" },
    ],
  },
  {
    id: 2,
    question: "Чим зараз займаєшся?",
    subtitle: "Це допоможе підібрати найзручніший формат",
    options: [
      { label: "Навчаюсь" },
      { label: "Працюю, шукаю підробіток" },
      { label: "У декреті" },
      { label: "Шукаю роботу" },
      { label: "Інше" },
    ],
  },
  {
    id: 3,
    question: "Скільки часу готовий(а) приділяти?",
    subtitle: "Графік повністю гнучкий, ти обираєш сам(а)",
    options: [
      { label: "1–2 години на день" },
      { label: "3–4 години на день" },
      { label: "Повний день" },
    ],
  },
];
