export interface StepOption {
  text: string;
  badge?: string;
  branch?: 'adult_english' | 'child_english' | 'child_prog' | 'child_math';
  nextStep?: number;
}

export interface QuizQuestion {
  step: number;
  question: string;
  description?: string;
  answers?: StepOption[];
  multiselect?: boolean;
  grid?: boolean;
  isInput?: boolean;
  inputPlaceholder?: string;
  form?: boolean;
  cta?: string;
  nextStepDefault?: number;
  branchTag?: string;
}

export const QUIZ_QUESTIONS: Record<number, QuizQuestion> = {
  // Step 1: Branch Selector
  1: {
    step: 1,
    question: "Який курс оберете для навчання?",
    description: "Оберіть напрям, щоб отримати персоналізовану програму та святкову знижку до -50%",
    answers: [
      { text: "Англійська для дорослих", badge: "18+ років", branch: "adult_english", nextStep: 2 },
      { text: "Англійська для дітей", badge: "5–17 років", branch: "child_english", nextStep: 9 },
      { text: "Програмування для дітей", badge: "8–17 років", branch: "child_prog", nextStep: 16 },
      { text: "Математика для дітей", badge: "1–11 класи", branch: "child_math", nextStep: 24 }
    ]
  },

  // -------------------------------------------------------------
  // BRANCH 1: АНГЛІЙСЬКА ДЛЯ ДОРОСЛИХ (Steps 2 - 8)
  // -------------------------------------------------------------
  2: {
    step: 2,
    branchTag: "adult_english",
    question: "Який у вас рівень англійської мови?",
    nextStepDefault: 3,
    answers: [
      { text: "Beginner - Я знаю кілька простих слів 🐣" },
      { text: "Elementary - Я можу говорити про базові теми, наприклад про погоду 🎒" },
      { text: "Intermediate - Я можу трохи спілкуватися з іноземцями 🤓" },
      { text: "Upper-Intermediate - Я досить вільно говорю, але хочу більше 💪" }
    ]
  },
  3: {
    step: 3,
    branchTag: "adult_english",
    question: "Яка ваша мотивація вивчати англійську мову?",
    nextStepDefault: 4,
    answers: [
      { text: "Кар'єра 💼" },
      { text: "Освіта 📚" },
      { text: "Культура 🌏" },
      { text: "Подорожі 🛩" },
      { text: "Інший 👑" }
    ]
  },
  4: {
    step: 4,
    branchTag: "adult_english",
    question: "Які аспекти англійської мови ви хотіли б покращити?",
    nextStepDefault: 5,
    answers: [
      { text: "Вимова 🗣️" },
      { text: "Словниковий запас 📖" },
      { text: "Розділові знаки 🖊️" },
      { text: "Часи ⏳" },
      { text: "Фразові дієслова ✨" },
      { text: "Стилі мови 👔" }
    ]
  },
  5: {
    step: 5,
    branchTag: "adult_english",
    question: "Скільки англійських слів ти знаєш?",
    description: "Позначте знайомі слова, щоб точніше визначити ваш словниковий запас",
    multiselect: true,
    grid: true,
    cta: "Далі →",
    nextStepDefault: 6,
    answers: [
      { text: "spoon" }, { text: "honey" }, { text: "gate" }, { text: "pillow" },
      { text: "neighbour" }, { text: "anniversary" }, { text: "enjoy" }, { text: "casual" },
      { text: "newspaper" }, { text: "price" }, { text: "bench" }, { text: "road" },
      { text: "traffic jam" }, { text: "party" }, { text: "wallet" }, { text: "summer" },
      { text: "vacancy" }, { text: "emergency" }, { text: "money" }, { text: "sun" }
    ]
  },
  6: {
    step: 6,
    branchTag: "adult_english",
    question: "Виберіть теми, які вам цікаві",
    nextStepDefault: 7,
    answers: [
      { text: "Технології 💻" },
      { text: "Повсякденне життя 🚶🏻‍♂️" },
      { text: "Подорожі 🏞️" },
      { text: "Здоров'я та фітнес 🏃🏻" },
      { text: "Бізнес 👨🏻‍💼" },
      { text: "Харчування 🍖" },
      { text: "Інше 🌐" }
    ]
  },
  7: {
    step: 7,
    branchTag: "adult_english",
    question: "Скільки разів на тиждень ви готові займатись англійською мовою?",
    nextStepDefault: 8,
    answers: [
      { text: "1 😴" },
      { text: "2 🥰" },
      { text: "3 😍" },
      { text: ">4 🤯" }
    ]
  },
  8: {
    step: 8,
    branchTag: "adult_english",
    question: "В який час вам найкраще вивчати англійську?",
    nextStepDefault: 32,
    answers: [
      { text: "Вранці (8.00 - 12.00) 🌅" },
      { text: "Вдень (13.00 - 16.00) ☀️" },
      { text: "Ввечері (17.00 - 20.00) 🌇" }
    ]
  },

  // -------------------------------------------------------------
  // BRANCH 2: АНГЛІЙСЬКА ДЛЯ ДІТЕЙ (Steps 9 - 15)
  // -------------------------------------------------------------
  9: {
    step: 9,
    branchTag: "child_english",
    question: "Скільки років вашій дитині?",
    nextStepDefault: 10,
    answers: [
      { text: "5-6 років 🐣" },
      { text: "7-11 років 🐥" },
      { text: "12-17 років 🐤" }
    ]
  },
  10: {
    step: 10,
    branchTag: "child_english",
    question: "Який результат хочете отримати від навчання?",
    nextStepDefault: 11,
    answers: [
      { text: "Підготуватись до школи 🎒" },
      { text: "Сформувати звичку до навчання 📚" },
      { text: "Підтягнути оцінки 📈" },
      { text: "Підготуватись до ЗНО/ДПА 🎯" },
      { text: "Інше ✨" }
    ]
  },
  11: {
    step: 11,
    branchTag: "child_english",
    question: "Який формат навчання більше підходить вашій дитині?",
    nextStepDefault: 12,
    answers: [
      { text: "Відео 📺" },
      { text: "Ігри 👾" },
      { text: "Читання (книги) 📚" },
      { text: "Заняття офлайн 🏫" },
      { text: "Онлайн заняття з репетитором 🌐" }
    ]
  },
  12: {
    step: 12,
    branchTag: "child_english",
    question: "Які аспекти англійської мови потрібно покращити дитині?",
    nextStepDefault: 13,
    answers: [
      { text: "Вимова 🗣️" },
      { text: "Словниковий запас 📖" },
      { text: "Розділові знаки 🖊️" },
      { text: "Часи ⏳" },
      { text: "Всі варіанти 🔥" }
    ]
  },
  13: {
    step: 13,
    branchTag: "child_english",
    question: "Виберіть теми, які цікавлять вашу дитину",
    description: "Можна обрати декілька варіантів",
    multiselect: true,
    cta: "Далі →",
    nextStepDefault: 14,
    answers: [
      { text: "Технології 💻" },
      { text: "Повсякденне життя 🚶🏻‍♂️" },
      { text: "Подорожі 🏞️" },
      { text: "Здоров'я та фітнес 🏃🏻" },
      { text: "Харчування 🍖" },
      { text: "Інше 🎨" }
    ]
  },
  14: {
    step: 14,
    branchTag: "child_english",
    question: "Скільки разів на тиждень ваша дитина готова займатись англійською мовою?",
    nextStepDefault: 15,
    answers: [
      { text: "1 😴" },
      { text: "2 🥰" },
      { text: "3 😍" },
      { text: ">4 🤯" }
    ]
  },
  15: {
    step: 15,
    branchTag: "child_english",
    question: "Коли вашій дитині буде зручно вивчати англійську?",
    nextStepDefault: 32,
    answers: [
      { text: "Вранці (8.00 - 12.00) 🌅" },
      { text: "Вдень (13.00 - 16.00) ☀️" },
      { text: "Ввечері (17.00 - 20.00) 🌇" }
    ]
  },

  // -------------------------------------------------------------
  // BRANCH 3: ПРОГРАМУВАННЯ ДЛЯ ДІТЕЙ (Steps 16 - 23)
  // -------------------------------------------------------------
  16: {
    step: 16,
    branchTag: "child_prog",
    question: "Скільки років Вашій дитині?",
    nextStepDefault: 17,
    answers: [
      { text: "8-10 років 🐣" },
      { text: "10-13 років 🐥" },
      { text: "14-17 років 🐤" }
    ]
  },
  17: {
    step: 17,
    branchTag: "child_prog",
    question: "Який результат хочете отримати від навчання?",
    nextStepDefault: 18,
    answers: [
      { text: "Сформувати звичку до навчання 💡" },
      { text: "Зайняти дитину чимось корисним 🎮" },
      { text: "Навчити створювати веб-сайт 🌐" },
      { text: "Привчити до базового розуміння коду 💻" }
    ]
  },
  18: {
    step: 18,
    branchTag: "child_prog",
    question: "Які навчальні предмети даються вашій дитині легше?",
    nextStepDefault: 19,
    answers: [
      { text: "Математика 🔢" },
      { text: "Образотворче мистецтво 🎶" },
      { text: "Мова та література 📚" },
      { text: "Фізкультура 🏃‍♂️" },
      { text: "Інші ✨" }
    ]
  },
  19: {
    step: 19,
    branchTag: "child_prog",
    question: "Чи має Ваша дитина досвід в програмуванні?",
    nextStepDefault: 20,
    answers: [
      { text: "Так, добре розбирається 🚀" },
      { text: "Має, але треба покращувати 🛠️" },
      { text: "Пробували розібратись, нічого не вийшло 🤔" },
      { text: "Не має 🐣" }
    ]
  },
  20: {
    step: 20,
    branchTag: "child_prog",
    question: "Яка техніка доступна дитині для навчання?",
    description: "Можна обрати декілька варіантів",
    multiselect: true,
    cta: "Далі →",
    nextStepDefault: 21,
    answers: [
      { text: "Стаціонарний ПК 🖥" },
      { text: "Ноутбук 💻" },
      { text: "Планшет або Смартфон 📱" }
    ]
  },
  21: {
    step: 21,
    branchTag: "child_prog",
    question: "Як звати вашу дитину?",
    description: "Вкажіть ім'я, щоб викладач міг підготувати персональне завдання",
    isInput: true,
    inputPlaceholder: "Введіть ім'я дитини",
    cta: "Далі →",
    nextStepDefault: 22
  },
  22: {
    step: 22,
    branchTag: "child_prog",
    question: "Скільки разів на тиждень ваша дитина готова займатись програмуванням?",
    nextStepDefault: 23,
    answers: [
      { text: "1 😴" },
      { text: "2 🥰" },
      { text: "3 😍" },
      { text: ">4 🤯" }
    ]
  },
  23: {
    step: 23,
    branchTag: "child_prog",
    question: "Коли вашій дитині буде зручно займатись програмуванням?",
    nextStepDefault: 32,
    answers: [
      { text: "Вранці (8.00 - 12.00) 🌅" },
      { text: "Вдень (13.00 - 16.00) ☀️" },
      { text: "Ввечері (17.00 - 20.00) 🌇" }
    ]
  },

  // -------------------------------------------------------------
  // BRANCH 4: МАТЕМАТИКА ДЛЯ ДІТЕЙ (Steps 24 - 31)
  // -------------------------------------------------------------
  24: {
    step: 24,
    branchTag: "child_math",
    question: "В якому класі навчається Ваша дитина?",
    nextStepDefault: 25,
    answers: [
      { text: "1-4 класи 🐣" },
      { text: "5-7 класи 🐥" },
      { text: "8-9 класи 🐤" },
      { text: "10-11 класи 🐔" }
    ]
  },
  25: {
    step: 25,
    branchTag: "child_math",
    question: "Яка середня оцінка по математиці у Вашої дитини?",
    nextStepDefault: 26,
    answers: [
      { text: "1-4 бали 📉" },
      { text: "5-8 балів 📊" },
      { text: "9-12 балів 📈" }
    ]
  },
  26: {
    step: 26,
    branchTag: "child_math",
    question: "Чи любить Ваша дитина вивчати математику?",
    nextStepDefault: 27,
    answers: [
      { text: "Так, звичайно ❤️" },
      { text: "Нейтрально відноситься 😐" },
      { text: "Взагалі не подобається 💔" }
    ]
  },
  27: {
    step: 27,
    branchTag: "child_math",
    question: "Який результат хочете отримати від навчання?",
    nextStepDefault: 28,
    answers: [
      { text: "🏫 Поліпшити оцінки з математики в школі" },
      { text: "📚 Допоможіть моїй дитині з домашнім завданням" },
      { text: "🏃 Наздогнати шкільну програму з математики" },
      { text: "🏆 Я хочу, щоб моя дитина розвивалась" },
      { text: "😎 Розвинути впевненість у математиці" }
    ]
  },
  28: {
    step: 28,
    branchTag: "child_math",
    question: "Як ви думаєте, яка допомога потрібна вашій дитині з математикою?",
    nextStepDefault: 29,
    answers: [
      { text: "Багато допомоги 🆘" },
      { text: "Якась допомога 🤝" },
      { text: "Лише трохи 👌" },
      { text: "Невпевнений 🤔" }
    ]
  },
  29: {
    step: 29,
    branchTag: "child_math",
    question: "Яка техніка доступна дитині для навчання?",
    description: "Можна обрати декілька варіантів",
    multiselect: true,
    cta: "Далі →",
    nextStepDefault: 30,
    answers: [
      { text: "Стаціонарний ПК 🖥" },
      { text: "Ноутбук 💻" },
      { text: "Планшет або Смартфон 📱" }
    ]
  },
  30: {
    step: 30,
    branchTag: "child_math",
    question: "Скільки разів на тиждень ваша дитина готова займатись математикою?",
    nextStepDefault: 31,
    answers: [
      { text: "1 😴" },
      { text: "2 🥰" },
      { text: "3 😍" },
      { text: ">4 🤯" }
    ]
  },
  31: {
    step: 31,
    branchTag: "child_math",
    question: "Коли вашій дитині буде зручно займатись математикою?",
    nextStepDefault: 32,
    answers: [
      { text: "Вранці (8.00 - 12.00) 🌅" },
      { text: "Вдень (13.00 - 16.00) ☀️" },
      { text: "Ввечері (17.00 - 20.00) 🌇" }
    ]
  },

  // -------------------------------------------------------------
  // FINAL STEP 32: LEAD FORM & HALLOWEEN DISCOUNT
  // -------------------------------------------------------------
  32: {
    step: 32,
    form: true,
    question: "Записуйтеся на безкоштовний пробний урок",
    description: "Вітаємо! Ми закріпили за вами святкову знижку до -50% на перший місяць навчання у JustSchool!",
    cta: "Отримати знижку та записатися →"
  }
};
