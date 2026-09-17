export type StepType =
  | 'hero'
  | 'text_input'
  | 'phone_input'
  | 'email_input'
  | 'choice'
  | 'schedule'
  | 'choice_with_other'
  | 'multi'
  | 'loader'
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
  placeholder?: string;
  options?: StepOption[];
  days?: { label: string; value: string }[];
  timeSlots?: { label: string; value: string; time: string }[];
  points?: string[];
}

export const STEPS: QuizStep[] = [
  {
    id: 0,
    type: 'hero',
    title: 'Корпоративна програма навчання англійської мови',
    subtitle:
      'Спеціальний проєкт розвитку для співробітників UKRSIBBANK BNP Paribas Group від онлайн-школи JustSchool. Пройдіть коротке опитування для визначення рівня, цілей та зручного розкладу.',
    cta: 'Розпочати опитування',
    social_proof: 'Офіційне опитування співробітників UKRSIBBANK',
  },
  {
    id: 1,
    type: 'text_input',
    question: '👤 Вкажіть, будь ласка, ваше ПІБ:',
    subtitle: 'Прізвище, ім’я та по батькові для реєстрації в корпоративній системі',
    placeholder: 'Шевченко Тарас Григорович',
    cta: 'Продовжити →',
  },
  {
    id: 2,
    type: 'phone_input',
    question: '📞 Вкажіть номер телефону:',
    subtitle: 'Для оперативного зв’язку та узгодження графіка з методистом',
    cta: 'Продовжити →',
  },
  {
    id: 3,
    type: 'email_input',
    question: '📧 Вкажіть електронну пошту:',
    subtitle: 'Корпоративна скринька (@ukrsibbank.com) або особистий email',
    placeholder: 'name@ukrsibbank.com',
    cta: 'Продовжити →',
  },
  {
    id: 4,
    type: 'choice',
    question: '📌 Яка інтенсивність навчання була б для вас комфортною?',
    subtitle: 'Оберіть оптимальну кількість занять на тиждень',
    options: [
      {
        label: '1 раз на тиждень',
        value: '1x',
        desc: 'Підтримуючий формат для дуже високого навантаження',
        emoji: '🌱',
      },
      {
        label: '2 рази на тиждень',
        value: '2x',
        desc: 'Оптимальний баланс між робочими завданнями та навчанням',
        emoji: '⚡',
      },
      {
        label: '3 рази на тиждень',
        value: '3x',
        desc: 'Інтенсивний прогрес та відчутний результат вже за місяць',
        emoji: '🔥',
      },
      {
        label: '4 рази на тиждень або більше',
        value: '4xplus',
        desc: 'Максимальне занурення в мовне середовище',
        emoji: '🚀',
      },
    ],
  },
  {
    id: 5,
    type: 'schedule',
    question: '🗓️ Які дні та час вам найзручніші для занять?',
    subtitle: 'Оберіть зручні дні тижня та часові проміжки для уроків',
    cta: 'Продовжити →',
    days: [
      { label: 'Понеділок', value: 'mon' },
      { label: 'Вівторок', value: 'tue' },
      { label: 'Середа', value: 'wed' },
      { label: 'Четвер', value: 'thu' },
      { label: 'П’ятниця', value: 'fri' },
      { label: 'Субота', value: 'sat' },
      { label: 'Неділя', value: 'sun' },
    ],
    timeSlots: [
      { label: 'Перша половина дня', value: 'morning', time: '08:00 – 12:00' },
      { label: 'Обідній час', value: 'lunch', time: '12:00 – 15:00' },
      { label: 'Друга половина дня', value: 'afternoon', time: '15:00 – 18:00' },
      { label: 'Вечір', value: 'evening', time: '18:00 – 21:00' },
    ],
  },
  {
    id: 6,
    type: 'choice',
    question: '📚 Як ви оцінюєте свій поточний рівень англійської мови?',
    subtitle: 'Під кожен рівень ми надаємо адаптовану програму',
    options: [
      {
        label: 'Початковий (Beginner / Elementary)',
        value: 'beginner',
        desc: 'Знаю базові фрази або починаю вивчення з нуля',
        emoji: '🌱',
      },
      {
        label: 'Нижче середнього (Pre-Intermediate)',
        value: 'pre_intermediate',
        desc: 'Розумію просту інформацію, можу будувати нескладні речення',
        emoji: '📗',
      },
      {
        label: 'Середній (Intermediate)',
        value: 'intermediate',
        desc: 'Можу підтримати бесіду на знайомі робочі та побутові теми',
        emoji: '📘',
      },
      {
        label: 'Вище середнього (Upper-Intermediate)',
        value: 'upper_intermediate',
        desc: 'Впевнено висловлюю думки, читаю ділові матеріали',
        emoji: '📙',
      },
      {
        label: 'Високий (Advanced / Proficiency)',
        value: 'advanced',
        desc: 'Вільне володіння, прагну відшліфувати нюанси й термінологію',
        emoji: '🏅',
      },
      {
        label: 'Не знаю свій рівень',
        value: 'unknown',
        desc: 'Потрібна консультація або тестування з методистом',
        emoji: '🤔',
      },
    ],
  },
  {
    id: 7,
    type: 'choice_with_other',
    question: '🎯 Яка ваша основна мета у вивченні англійської мови?',
    subtitle: 'Оберіть головний орієнтир для вашої програми',
    options: [
      { label: 'Професійний розвиток', value: 'professional_growth', emoji: '📈' },
      { label: 'Робота та комунікація з колегами або клієнтами', value: 'work_communication', emoji: '🤝' },
      { label: 'Підготовка до співбесід', value: 'interviews', emoji: '💼' },
      { label: 'Навчання', value: 'education', emoji: '🎓' },
      { label: 'Переїзд або життя за кордоном', value: 'relocation', emoji: '✈️' },
      { label: 'Вільне повсякденне спілкування', value: 'casual_talk', emoji: '💬' },
      { label: 'Особистий розвиток', value: 'self_growth', emoji: '🚀' },
      { label: 'Інше', value: 'other', emoji: '✏️' },
    ],
  },
  {
    id: 8,
    type: 'multi',
    question: '🌍 У яких ситуаціях ви найчастіше плануєте використовувати англійську мову?',
    subtitle: 'Оберіть усі варіанти, які для вас актуальні',
    cta: 'Продовжити →',
    options: [
      { label: 'На роботі', value: 'at_work', emoji: '🏢' },
      { label: 'Під час ділових зустрічей або презентацій', value: 'meetings', emoji: '📊' },
      { label: 'У листуванні', value: 'emails', emoji: '✉️' },
      { label: 'У спілкуванні з іноземними колегами або клієнтами', value: 'international_colleagues', emoji: '🌐' },
      { label: 'Під час подорожей', value: 'travel', emoji: '🧳' },
      { label: 'У навчанні', value: 'study', emoji: '📚' },
      { label: 'У повсякденному спілкуванні', value: 'daily_talk', emoji: '☕' },
    ],
  },
  {
    id: 9,
    type: 'multi',
    question: '💬 Які навички ви хотіли б покращити насамперед?',
    subtitle: 'Оберіть пріоритетні сфери або оберіть все комплексно',
    cta: 'Продовжити →',
    options: [
      { label: 'Розмовну англійську', value: 'speaking', emoji: '🗣️' },
      { label: 'Граматику', value: 'grammar', emoji: '📝' },
      { label: 'Словниковий запас', value: 'vocabulary', emoji: '📖' },
      { label: 'Розуміння мови на слух', value: 'listening', emoji: '🎧' },
      { label: 'Вимову', value: 'pronunciation', emoji: '🎙️' },
      { label: 'Письмову англійську', value: 'writing', emoji: '✍️' },
      { label: 'Ділове листування', value: 'business_correspondence', emoji: '📧' },
      { label: 'Усе комплексно', value: 'all_complex', emoji: '🎯' },
    ],
  },
  {
    id: 10,
    type: 'choice',
    question: '👩‍🏫 Чи є у вас побажання щодо викладача?',
    subtitle: 'Ми підберемо викладача, з яким вам буде комфортно',
    options: [
      {
        label: 'Україномовний викладач',
        value: 'ukrainian_speaker',
        desc: 'Пояснення складних тем та граматики рідною мовою',
        emoji: '🇺🇦',
      },
      {
        label: 'Носій мови (Native speaker)',
        value: 'native_speaker',
        desc: 'Повне занурення в мовне середовище та автентична вимова',
        emoji: '🇬🇧',
      },
      {
        label: 'Не має значення',
        value: 'any',
        desc: 'Головне — професіоналізм, методика та результат',
        emoji: '✨',
      },
    ],
  },
  {
    id: 11,
    type: 'choice',
    question: '💡 Який напрям навчання вас цікавить?',
    subtitle: 'Програма буде налаштована під вашу сферу інтересів',
    options: [
      {
        label: 'Загальна англійська (General English)',
        value: 'general',
        desc: 'Впевнена розмовна мова, граматика, подорожі та щоденне спілкування',
        emoji: '🌟',
      },
      {
        label: 'Бізнес-англійська (Business & Banking)',
        value: 'business',
        desc: 'Ділові переговори, фінанси, презентації та робоча комунікація',
        emoji: '💼',
      },
      {
        label: 'Англійська для IT та Digital',
        value: 'it',
        desc: 'Спеціалізована термінологія, agile-комунікація та технічна документація',
        emoji: '💻',
      },
      {
        label: 'Поки не визначився / не визначилася',
        value: 'need_recommendation',
        desc: 'Потрібна рекомендація та допомога методиста на вступному уроці',
        emoji: '🧭',
      },
    ],
  },
  {
    id: 12,
    type: 'loader',
    title: 'Формуємо вашу індивідуальну програму...',
    subtitle: 'Враховуємо корпоративні стандарти UKRSIBBANK BNP Paribas Group',
    points: [
      'Аналізуємо ваш рівень та цілі',
      'Враховуємо робочий розклад та зручні дні',
      'Формуємо персоналізовану траєкторію',
      'Підбираємо сертифікованого викладача',
    ],
  },
  {
    id: 13,
    type: 'lead_form',
    title: '🎉 Ваша персональна програма готова!',
    subtitle:
      'Перевірте та підтвердіть контактні дані для закріплення за вами корпоративного місця та зв’язку з методистом JustSchool.',
    cta: 'Надіслати заявку на навчання',
  },
];
