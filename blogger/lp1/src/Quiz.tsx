import React, { useState, useEffect } from "react";
import { quizData } from "./data";
import var1 from "../img/Y26_W5_Static_Quiz_var1.png";
import var2 from "../img/Y26_W5_Static_Quiz_var2.png";
import var3 from "../img/Y26_W5_Static_Quiz_var3.png";
import var4 from "../img/Y26_W5_Static_Quiz_var4.png";
import var5 from "../img/Y26_W5_Static_Quiz_var5.png";
import var6 from "../img/Y26_W5_Static_Quiz_var6.png";
import var7 from "../img/Y26_W5_Static_Quiz_var7.png";
import var8 from "../img/Y26_W5_Static_Quiz_var8.png";
import var9 from "../img/Y26_W5_Static_Quiz_var9.png";

const stepImages: { [key: number]: string } = {
  1: var1,
  2: var2,
  3: var3,
  4: var4,
  5: var5,
  6: var6,
  7: var7,
  8: var8,
  9: var9,
  10: var1,
  11: var2,
  12: var3,
  13: var4,
  14: var5,
};

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

/* --- UI COMPONENTS --- */

// 1. LOGO (Text/Icon based for reliability)
const Logo: React.FC = () => (
  <div className="w-full flex justify-center mb-6 pt-2">
    <div className="flex items-center gap-2 opacity-90">
      <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
      <span className="text-xl font-bold text-white tracking-tight">JustSchool</span>
    </div>
  </div>
);

// 2. SHIMMER BUTTON
const ShimmerButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full h-14 rounded-2xl font-bold text-lg tracking-wide text-white overflow-hidden transition-all duration-300
        group shadow-xl transform active:scale-[0.98]
        ${disabled
          ? 'bg-white/10 text-white/20 border border-white/5 cursor-not-allowed'
          : 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] border border-orange-400/20'
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

// 3. SKELETON BLOCK (Replaces Images)
const SkeletonBlock: React.FC = () => {
  return (
    <div className="w-full h-32 sm:h-48 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 animate-fade-in-up">
      <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  );
};

const WelcomeBox: React.FC = () => {
  return (
    <div className="mb-6 p-1 rounded-2xl bg-gradient-to-r from-orange-500/50 to-purple-600/50 w-full">
        <div className="bg-[#0f0f0f] rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 blur-[40px] rounded-full pointer-events-none"></div>
            <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-white/5 border border-white/10 rounded-full text-2xl">
                🎁
            </div>
            <div className="text-left z-10">
                <p className="font-bold text-white text-base leading-tight font-sans">Welcome Box + Подарунок</p>
                <p className="text-xs text-gray-400 mt-1 font-medium font-sans">Гарантуємо після отримання заявки</p>
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

  // Preload all images on mount
  useEffect(() => {
    Object.values(stepImages).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
  }, []);

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
      <div className="w-full h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4 text-white font-sans">Вітаємо!</h1>
        <p className="text-gray-400 text-lg font-sans">Ваш персональний план готовий.</p>
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

  const currentImage = stepImages[step];

  return (
    <>
      {/* 1. SCROLLABLE CONTENT AREA */}
      {/* pb-48 ensures content clears the sticky footer */}
      <div className="w-full px-5 pt-16 pb-48 flex flex-col flex-grow overflow-y-auto no-scrollbar">

        {/* LOGO */}
        <Logo />

        {/* WRAPPER FOR ANIMATION KEYED BY STEP */}
        <div key={step} className="w-full flex flex-col items-center animate-fade-in-up">
            
            {/* HEADER - Fluid Typography */}
            <div className="text-center mb-6 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight font-sans tracking-tight">
                {highlightText(currentStepData.question)}
              </h1>
              {currentStepData.description && (
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-sans max-w-sm mx-auto whitespace-pre-line">
                  {highlightText(currentStepData.description)}
                </p>
              )}
            </div>

            {/* CONTENT */}
            <div className="w-full">
              {currentImage ? (
                 <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 relative min-h-[160px] flex items-center justify-center">
                    <img src={currentImage} alt="Quiz illustration" className="w-full h-auto object-cover" />
                 </div>
              ) : isFirstStep ? (
                <div className="flex flex-col gap-3 mb-4 w-full">
                  {[
                    {icon: "award", text: "Навчаємо більше 8 років"},
                    {icon: "users", text: "15 000 активних студентів"},
                    {icon: "academic-cap", text: "100 000+ випускників"}
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-xl text-brand-orange">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="font-bold text-white/90 text-sm sm:text-base font-sans">{item.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                 /* SKELETON BLOCK (Replaces Illustration) */
                 !currentStepData.form && <SkeletonBlock />
              )}

              {/* ANSWERS - Larger touch targets */}
              {currentStepData.answers && (
                <div className="flex flex-col gap-3 w-full mt-2">
                  {currentStepData.answers.map((answer) => (
                    <button
                      key={answer.text}
                      className={`p-5 text-center rounded-2xl border transition-all duration-200 font-bold w-full font-sans text-base sm:text-lg ${
                        selectedAnswers.includes(answer.text)
                          ? "bg-white/10 border-brand-orange text-white shadow-[0_0_15px_rgba(241,102,0,0.3)]"
                          : "bg-white/[0.03] border-white/5 text-gray-300 active:bg-white/10"
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
                  <div className="space-y-4">
                    <input type="text" placeholder="Імʼя" className="input-glass py-4 text-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="tel" placeholder="+380 (XX) XXX-XX-XX" className="input-glass py-4 text-lg" value={formData.phone} onChange={handlePhoneChange} maxLength={19} />
                    <input type="email" placeholder="Email" className="input-glass py-4 text-lg" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* 2. UNIVERSAL STICKY FOOTER */}
      {/*
          Positioning Strategy:
          - fixed bottom-0: Sticks to viewport bottom.
          - left-1/2 -translate-x-1/2: Centers it horizontally relative to viewport.
          - w-full max-w-[480px]: Constraints width to match the app container.
      */}
      {currentStepData.cta && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 px-6 pb-12 backdrop-blur-[2px]">
            <ShimmerButton onClick={handleNextClick} disabled={isButtonDisabled}>
              {currentStepData.cta}
            </ShimmerButton>
        </div>
      )}
    </>
  );
};

export default Quiz;
