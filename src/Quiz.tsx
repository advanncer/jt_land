import React, { useState, useEffect } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

/* --- Components --- */

const EvenStepIllustration: React.FC = () => {
  return (
    <div className="w-full flex justify-center mb-8 animate-fade-in-up">
      <svg className="h-32 w-auto opacity-90" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Abstract Background Elements */}
        <circle cx="200" cy="30" r="12" fill="#222" />
        <circle cx="40" cy="90" r="8" fill="#222" />
        <path d="M180 90 L220 90" stroke="#222" strokeWidth="2" strokeLinecap="round" />
        
        {/* Main Dynamics - Orange Accents */}
        <path d="M40 40 C60 20, 100 20, 120 40 S 180 60, 200 40" stroke="#f16600" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
        <path d="M120 60 L140 30 L160 60" fill="none" stroke="#f16600" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Symbols: Flag / Book / Lightning */}
        <rect x="60" y="60" width="30" height="40" rx="4" fill="#111" stroke="#333" strokeWidth="2" />
        <path d="M60 70 H90" stroke="#333" strokeWidth="2" />
        <path d="M60 80 H90" stroke="#333" strokeWidth="2" />
        
        <circle cx="140" cy="80" r="20" stroke="#f16600" strokeWidth="2" fill="#0a0a0a" />
        <path d="M135 80 L140 85 L150 75" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const WelcomeBox: React.FC = () => {
  return (
    <div className="mb-6 p-5 rounded-xl border border-brand-orange/40 bg-brand-orange/5 flex items-center gap-4 animate-fade-in-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-brand-orange text-white rounded-full text-2xl shadow-[0_0_15px_rgba(241,102,0,0.5)]">
            🎁
        </div>
        <div className="text-left z-10">
            <p className="font-bold text-white text-base leading-tight font-sans">Welcome Box + Подарунок</p>
            <p className="text-xs text-white/60 mt-1 font-medium font-sans">Гарантовано залиш заявку та отримай доступ</p>
        </div>
    </div>
  );
};

/* --- Logic Helpers --- */

const formatPhoneNumber = (value: string) => {
    const input = value.replace(/\D/g, '').substring(0, 12);
    let numbers = input;
    if (numbers.startsWith("380")) {
        // ok
    } else if (numbers.length > 0) {
        if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
        else numbers = "380" + numbers;
    } else {
        return ""; 
    }
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

/* --- Main Component --- */

const Quiz: React.FC<QuizProps> = ({ step, onNextStep }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  // Form State
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
      <div className="text-left py-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4 text-white leading-tight font-sans">Вітаємо!</h1>
        <p className="text-white/70 text-lg font-sans">Ваш персональний план готовий. Менеджер звʼяжеться з вами найближчим часом.</p>
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
      if (val.length < formData.phone.length) {
          setFormData({ ...formData, phone: val });
          return;
      }
      setFormData({ ...formData, phone: formatPhoneNumber(val) });
  };

  const isFirstStep = step === 1;
  const isEvenStep = step % 2 === 0;
  
  let isButtonDisabled = false;
  if (currentStepData.form) {
      isButtonDisabled = !isFormValid;
  } else if (currentStepData.multiselect) {
      isButtonDisabled = selectedAnswers.length === 0;
  }

  return (
    <div className="w-full flex flex-col items-start font-sans">
      
      {/* 1. HEADER (Left aligned, Sans-serif) */}
      <h1 className="text-[28px] md:text-4xl font-bold text-white mb-4 leading-[1.15] text-left w-full font-sans">
        {currentStepData.question}
      </h1>
      
      {/* Description */}
      {currentStepData.description && (
        <p className="text-base md:text-lg text-white/70 mb-8 w-full text-left leading-relaxed font-sans">
          {currentStepData.description}
        </p>
      )}

      {/* 2. GRAPHICS (For even steps) - Centered */}
      {isEvenStep && !currentStepData.form && <EvenStepIllustration />}

      {/* First Step Stats */}
      {isFirstStep && (
        <div className="flex flex-col gap-3 mb-10 w-full">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">Навчаємо більше 8 років</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">15 000 активних студентів щомісяця</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">Більше 100 000 студентів успішно закінчили навчання</span>
          </div>
        </div>
      )}

      {/* 3. ANSWERS / BUTTONS */}
      {currentStepData.answers && (
        <div className="grid grid-cols-1 gap-3 w-full mb-8">
          {currentStepData.answers.map((answer) => (
            <button
              key={answer.text}
              className={`p-5 text-left rounded-xl border-2 transition-all duration-200 font-bold w-full font-sans ${
                selectedAnswers.includes(answer.text)
                  ? "bg-brand-orange border-brand-orange text-black shadow-lg translate-x-1"
                  : "bg-[#111] border-white/5 text-white/80 hover:bg-[#181818] hover:text-white"
              }`}
              onClick={() => handleAnswerClick(answer.text)}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-base">{answer.text}</span>
                {selectedAnswers.includes(answer.text) && (
                    <span className="bg-black/20 rounded-full p-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Form Step */}
      {currentStepData.form && (
        <div className="flex flex-col gap-5 w-full mb-8">
          <WelcomeBox />
          
          <div className="space-y-4">
              <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brand-orange ml-1 font-sans">Імʼя</label>
                  <input 
                    type="text" 
                    placeholder="Введіть ваше імʼя" 
                    className="input-field" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brand-orange ml-1 font-sans">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+380 (XX) XXX-XX-XX" 
                    className="input-field" 
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={19}
                  />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brand-orange ml-1 font-sans">Email</label>
                  <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    className="input-field" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
              </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      {currentStepData.cta && (
        <div className="w-full">
          <button
            className={`btn-primary font-sans text-lg ${
                isButtonDisabled 
                ? "opacity-50 cursor-not-allowed shadow-none bg-[#222] text-white/40 border border-white/5" 
                : "animate-pulse-slow shadow-[0_0_20px_rgba(241,102,0,0.4)] border border-brand-orange"
            }`}
            onClick={handleNextClick}
            disabled={isButtonDisabled}
          >
            {currentStepData.cta}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
