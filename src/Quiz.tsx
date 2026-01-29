import React, { useState, useEffect } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

/* --- UI COMPONENTS --- */

const Logo: React.FC = () => (
  // Using a placeholder that looks like the logo, replace 'src' with local file later
  <img 
    src="https://placehold.co/200x60/transparent/ffffff?text=JustSchool" 
    alt="JustSchool" 
    className="h-8 md:h-10 w-auto mx-auto mb-3 md:mb-5 opacity-90" 
  />
);

const ShimmerButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full h-[52px] md:h-[60px] rounded-xl font-bold text-base md:text-lg tracking-wide text-white overflow-hidden transition-all duration-300
        group shrink-0
        ${disabled 
          ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed' 
          : 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] hover:-translate-y-0.5 border border-orange-400/20'
        }
      `}
    >
      {!disabled && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer"></div>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

const IllustrationPlaceholder: React.FC = () => {
  return (
    // Compact height for mobile (h-28)
    <div className="w-full h-28 md:h-48 bg-black/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center my-4 md:my-8 backdrop-blur-sm group hover:bg-black/30 transition-colors duration-300 shrink-0">
      <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <svg className="w-5 h-5 md:w-8 md:h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <span className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-widest">Ілюстрація</span>
    </div>
  );
};

const WelcomeBox: React.FC = () => {
  return (
    <div className="mb-6 p-1 rounded-2xl bg-gradient-to-r from-orange-500/50 to-purple-600/50 w-full">
        <div className="bg-[#0f0f0f] rounded-xl p-3 md:p-4 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 blur-[40px] rounded-full pointer-events-none"></div>
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-white/5 border border-white/10 rounded-full text-xl">
                🎁
            </div>
            <div className="text-left z-10">
                <p className="font-bold text-white text-sm leading-tight font-sans">Welcome Box + Подарунок</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 font-medium font-sans">Гарантовано залиш заявку</p>
            </div>
        </div>
    </div>
  );
};

/* --- LOGIC & HELPERS --- */

const highlightText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(JustSchool)/gi);
  return parts.map((part, i) => 
    part.toLowerCase() === 'justschool' 
      ? <span key={i} className="text-[#f16600] font-bold">JustSchool</span> 
      : part
  );
};

const formatPhoneNumber = (value: string) => {
    const input = value.replace(/\D/g, '').substring(0, 12);
    let numbers = input;
    if (numbers.startsWith("380")) {} 
    else if (numbers.length > 0) {
        if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
        else numbers = "380" + numbers;
    } else { return ""; }
    numbers = numbers.substring(0, 12);
    let char = { 0: '+', 3: ' (', 5: ') ', 8: '-', 10: '-' };
    let formatted = '';
    for (let i = 0; i < numbers.length; i++) {
        // @ts-ignore
        if (char[i]) formatted += char[i];
        formatted += numbers[i];
    }
    return formatted;
};

/* --- MAIN COMPONENT --- */

const Quiz: React.FC<QuizProps> = ({ step, onNextStep }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!currentStepData?.form) return;
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const isPhoneValid = phoneDigits.length === 12;
    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setIsFormValid(isPhoneValid && isNameValid && isEmailValid);
  }, [formData, currentStepData]);


  if (!currentStepData) {
    return (
      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4 text-white font-sans">Вітаємо!</h1>
        <p className="text-gray-400 text-base font-sans">Ваш персональний план готовий.</p>
      </div>
    );
  }

  const handleAnswerClick = (answer: string) => {
    if (currentStepData.multiselect) {
      setSelectedAnswers((prev) =>
        prev.includes(answer)
          ? prev.filter((a) => a !== answer)
          : [...prev, answer]
      );
    } else {
      onNextStep([answer]);
    }
  };

  const handleNextClick = () => {
    onNextStep(currentStepData.form ? [JSON.stringify(formData)] : selectedAnswers);
    setSelectedAnswers([]);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.length < formData.phone.length) { setFormData({ ...formData, phone: val }); return; }
      setFormData({ ...formData, phone: formatPhoneNumber(val) });
  };

  const isFirstStep = step === 1;
  let isButtonDisabled = false;
  if (currentStepData.form) { isButtonDisabled = !isFormValid; } 
  else if (currentStepData.multiselect) { isButtonDisabled = selectedAnswers.length === 0; }

  return (
    // GLASS CARD: Reduced padding for mobile (p-5)
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 md:p-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
      
      {/* 1. LOGO */}
      <Logo />

      {/* 2. HEADER */}
      <div className="text-center mb-2 md:mb-6 shrink-0">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight font-sans">
          {highlightText(currentStepData.question)}
        </h1>
        {currentStepData.description && (
          <p className="text-gray-300 text-xs md:text-base leading-relaxed font-sans max-w-sm mx-auto">
            {highlightText(currentStepData.description)}
          </p>
        )}
      </div>

      {/* 3. CONTENT AREA (Flexible growth) */}
      <div className="flex-grow flex flex-col justify-center mb-4 md:mb-8">
        {isFirstStep ? (
          <div className="flex flex-col gap-2 w-full">
            {[
              {icon: "award", text: "Навчаємо більше 8 років"},
              {icon: "users", text: "15 000 активних студентів"},
              {icon: "academic-cap", text: "100 000+ випускників"}
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-7 h-7 flex items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-medium text-white/80 text-xs md:text-sm font-sans">{item.text}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder is hidden on very small screens for form, visual elsewhere */
          (!currentStepData.form && <IllustrationPlaceholder />)
        )}

        {/* ANSWERS */}
        {currentStepData.answers && (
          <div className="grid grid-cols-1 gap-2 w-full mt-2">
            {currentStepData.answers.map((answer) => (
              <button
                key={answer.text}
                className={`p-3.5 text-center rounded-xl border transition-all duration-300 font-bold w-full font-sans text-sm md:text-base ${
                  selectedAnswers.includes(answer.text)
                    ? "bg-white/10 border-brand-orange text-white shadow-[0_0_15px_rgba(241,102,0,0.3)] scale-[1.01]"
                    : "bg-black/20 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20 hover:text-white"
                }`}
                onClick={() => handleAnswerClick(answer.text)}
              >
                {answer.text}
              </button>
            ))}
          </div>
        )}

        {/* FORM */}
        {currentStepData.form && (
          <div className="flex flex-col gap-4 w-full mt-4">
            <WelcomeBox />
            <div className="space-y-3">
              <input type="text" placeholder="Імʼя" className="input-glass py-3" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="+380 (XX) XXX-XX-XX" className="input-glass py-3" value={formData.phone} onChange={handlePhoneChange} maxLength={19} />
              <input type="email" placeholder="Email" className="input-glass py-3" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
        )}
      </div>

      {/* 4. CTA BUTTON (Sticky bottom feel if needed, but here inline) */}
      {currentStepData.cta && (
        <div className="w-full shrink-0">
          <ShimmerButton onClick={handleNextClick} disabled={isButtonDisabled}>
            {currentStepData.cta}
          </ShimmerButton>
        </div>
      )}
    </div>
  );
};

export default Quiz;
