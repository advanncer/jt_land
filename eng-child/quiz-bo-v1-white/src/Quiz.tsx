import React, { useState } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
  isSubmitting?: boolean;
}

const Logo: React.FC = () => (
  <div className="w-full flex justify-center mb-6 pt-2">
    <div className="flex items-center gap-2 opacity-90">
      <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">
        J
      </div>
      <span className="text-xl font-bold text-slate-900 tracking-tight">
        JustSchool
      </span>
    </div>
  </div>
);

const ShimmerButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      "relative w-full h-14 rounded-2xl font-bold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 group shadow-xl transform active:scale-[0.98] " +
      (disabled
        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
        : "bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] border border-orange-400/20")
    }
  >
    {!disabled && (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer"></div>
    )}
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
  </button>
);

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  let numbers = digits;
  if (numbers.startsWith("380")) {
    // Already starts with 380, keep as is
  } else if (numbers === "3" || numbers === "38") {
    // User is typing part of country code
    numbers = "380";
  } else if (numbers.startsWith("80")) {
    numbers = "38" + numbers;
  } else if (numbers === "8") {
    numbers = "380";
  } else if (numbers.startsWith("0")) {
    numbers = "380" + numbers.substring(1);
  } else {
    numbers = "380" + numbers;
  }

  numbers = numbers.substring(0, 12);
  const char = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
  let formatted = "";
  for (let i = 0; i < numbers.length; i++) {
    // @ts-expect-error char map access
    if (char[i]) formatted += char[i];
    formatted += numbers[i];
  }
  return formatted;
};

const Quiz: React.FC<QuizProps> = ({
  step,
  onNextStep,
  isSubmitting = false,
}) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [textAnswer, setTextAnswer] = useState("");
  let isFormValid = false;
  if (currentStepData && currentStepData.type === "form") {
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const isPhoneValid = phoneDigits.length === 12;
    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    isFormValid = isPhoneValid && isNameValid && isEmailValid;
  }

  if (!currentStepData)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-orange rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900 font-sans">
          Зачекайте, будь ласка...
        </h1>
        <p className="text-slate-500 text-base font-sans">
          Відправляємо вас на платформу
        </p>
      </div>
    );

  const handleAnswerClick = (answer: string) => {
    onNextStep([answer]);
  };

  const handleNextClick = () => {
    if (currentStepData.type === "form") {
      onNextStep([JSON.stringify(formData)]);
    } else if (currentStepData.type === "text") {
      onNextStep([textAnswer]);
    } else {
      onNextStep(selectedAnswers);
    }
    setSelectedAnswers([]);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < formData.phone.length) {
      setFormData({ ...formData, phone: val });
      return;
    }
    setFormData({ ...formData, phone: formatPhoneNumber(val) });
  };

  const renderStart = () => (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight text-center">
        Дитина заговорить англійською вже через кілька занять:{" "}
        <span className="text-brand-orange">
          безкоштовний пробний урок + гарантія результату
        </span>
      </h1>
      <p className="text-slate-700 font-semibold mb-3 text-center">
        Пройдіть короткий тест — і отримайте:
      </p>
      <ul className="text-slate-600 space-y-3 mb-6 mx-auto max-w-sm">
        <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-2xl">👨‍🏫</span>
          <span className="text-slate-700">
            Ідеального репетитора під ваші потреби
          </span>
        </li>
        <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-2xl">🎁</span>
          <span className="text-slate-700">
            Корисний PDF подарунок для дитини
          </span>
        </li>
      </ul>
      <div className="w-full h-px bg-slate-100 my-6"></div>
      <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
        {currentStepData.question}
      </h2>
      <div className="flex flex-col gap-2.5 w-full">
        {currentStepData.answers?.map((answer) => (
          <button
            key={answer.text}
            className="p-4 text-left rounded-xl border border-brand-orange/50 bg-brand-orange/5 hover:border-brand-orange/80 hover:bg-brand-orange/15 transition-all duration-300 font-bold text-slate-800 shadow-[0_4px_12px_rgba(241,102,0,0.05)] active:scale-[0.99]"
            onClick={() => handleAnswerClick(answer.text)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </>
  );

  const renderChoice = () => (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
        {currentStepData.question}
      </h2>
      {currentStepData.desc && (
        <p className="text-slate-500 text-center mb-6">
          {currentStepData.desc}
        </p>
      )}
      {!currentStepData.desc && <div className="mb-6"></div>}
      <div className="flex flex-col gap-2.5 w-full">
        {currentStepData.answers?.map((answer) => (
          <button
            key={answer.text}
            className="p-4 text-left rounded-xl border border-brand-orange/50 bg-brand-orange/5 hover:border-brand-orange/80 hover:bg-brand-orange/15 transition-all duration-300 font-bold text-slate-800 shadow-[0_4px_12px_rgba(241,102,0,0.05)] active:scale-[0.99]"
            onClick={() => handleAnswerClick(answer.text)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </>
  );

  const renderBanner1 = () => (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Чому обирають JustSchool?
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-bold text-sm text-slate-900 mb-1">
            Перший урок — безкоштовно
          </div>
          <div className="text-xs text-slate-500">
            Бачите прогрес дитини, перш ніж платити хоч копійку
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-sm text-slate-900 mb-1">
            Навчання через гру
          </div>
          <div className="text-xs text-slate-500">
            Авторські інтерактивні квести замість нудних підручників
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-bold text-sm text-slate-900 mb-1">
            Програма під дитину
          </div>
          <div className="text-xs text-slate-500">
            Індивідуально або в групі, 6–17 років
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-sm text-slate-900 mb-1">
            Трамплін у топові виші
          </div>
          <div className="text-xs text-slate-500">
            Підготовка до НМТ/ЗНО та вступ за кордон
          </div>
        </div>
      </div>
    </>
  );

  const renderStats = () => (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        JustSchool у цифрах
      </h2>
      <div className="flex flex-col gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-extrabold text-brand-orange mb-1">
            15 000+
          </div>
          <div className="text-sm text-slate-600">
            випускників школи за весь час роботи
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-extrabold text-brand-orange mb-1">
            4 міс
          </div>
          <div className="text-sm text-slate-600">
            середній час підняття рівня (A2→B1)
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-extrabold text-brand-orange mb-1">
            187
          </div>
          <div className="text-sm text-slate-600">
            середній бал з англійської на НМТ/ЗНО
          </div>
        </div>
      </div>
    </>
  );

  const renderCompare = () => (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Чому JustSchool — інакше?
      </h2>
      <div className="flex flex-col gap-4 mb-6">
        {[
          ["Платний пробний урок", "Перший урок — повністю безкоштовно"],
          ["Стандартні підручники", "Авторський інтерактивний контент"],
          ["Немає гарантій", "Гарантія результату за 72 заняття"],
          ["Один формат для всіх", "Гнучкість: індивідуальні/групові заняття"],
          ["Тільки розмовна практика", "Комплексний підхід: розмовна + ЗНО"],
        ].map((row, i) => (
          <div
            key={i}
            className="bg-slate-50 border border-brand-orange/30 rounded-xl p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange"></div>
            <div className="text-xs font-bold text-brand-orange uppercase mb-1">
              JustSchool ✓
            </div>
            <div className="text-slate-900 font-semibold mb-3">{row[1]}</div>
            <div className="text-xs text-slate-400 uppercase mb-1">
              Інші школи
            </div>
            <div className="text-slate-400 line-through text-sm">{row[0]}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderText = () => (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        {currentStepData.question}
      </h2>
      <p className="text-slate-500 text-center mb-6">{currentStepData.desc}</p>
      <input
        type="text"
        placeholder={currentStepData.placeholder}
        className="input-glass py-4 text-lg w-full mb-6"
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
      />
    </>
  );

  const renderForm = () => (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        {currentStepData.question}
      </h2>
      <p className="text-slate-500 text-center mb-6">{currentStepData.desc}</p>
      <div className="flex flex-col gap-4 w-full">
        <input
          type="text"
          placeholder="Ваше імʼя*"
          className="input-glass py-4 text-lg w-full disabled:opacity-50"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
        />
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none gap-2">
            <span className="text-xl">🇺🇦</span>
          </div>
          <input
            type="tel"
            placeholder="+380 (XX) XXX-XX-XX"
            className="input-glass py-4 pl-12 text-lg w-full disabled:opacity-50"
            value={formData.phone}
            onChange={handlePhoneChange}
            onFocus={() => {
              if (!formData.phone) {
                setFormData({ ...formData, phone: "+380 (" });
              }
            }}
            onBlur={() => {
              if (
                formData.phone === "+380 (" ||
                formData.phone === "+380" ||
                formData.phone === "+"
              ) {
                setFormData({ ...formData, phone: "" });
              }
            }}
            maxLength={19}
            disabled={isSubmitting}
          />
        </div>
        <input
          type="email"
          placeholder="Ваш e-mail*"
          className="input-glass py-4 text-lg w-full disabled:opacity-50"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isSubmitting}
        />
      </div>
    </>
  );

  let ctaText = "ПРОДОВЖИТИ";
  let showCta = false;
  let isButtonDisabled = false;

  if (
    currentStepData.type === "banner1" ||
    currentStepData.type === "stats" ||
    currentStepData.type === "compare"
  ) {
    showCta = true;
  } else if (currentStepData.type === "text") {
    showCta = true;
    isButtonDisabled = textAnswer.trim().length === 0;
    ctaText = "Далі →";
  } else if (currentStepData.type === "form") {
    showCta = true;
    isButtonDisabled = !isFormValid || isSubmitting;
    ctaText = isSubmitting
      ? "Надсилаємо заявку..."
      : currentStepData.cta || "Отримати безплатну консультацію";
  }

  return (
    <>
      <div className="w-full px-5 pt-16 pb-32 flex flex-col flex-grow overflow-y-auto no-scrollbar">
        <Logo />
        <div
          key={step}
          className="w-full flex flex-col items-center animate-fade-in-up"
        >
          <div className="w-full">
            {currentStepData.type === "start" && renderStart()}
            {currentStepData.type === "choice" && renderChoice()}
            {currentStepData.type === "banner1" && renderBanner1()}
            {currentStepData.type === "stats" && renderStats()}
            {currentStepData.type === "compare" && renderCompare()}
            {currentStepData.type === "text" && renderText()}
            {currentStepData.type === "form" && renderForm()}
          </div>
        </div>
      </div>
      {showCta && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 px-6 pb-8 backdrop-blur-[2px]">
          <ShimmerButton onClick={handleNextClick} disabled={isButtonDisabled}>
            {ctaText}
          </ShimmerButton>
        </div>
      )}
    </>
  );
};

export default Quiz;
