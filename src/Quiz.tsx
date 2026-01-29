import React, { useState, useEffect } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

/* --- Components --- */

const IllustrationPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-center justify-center my-8 backdrop-blur-sm group hover:bg-white/[0.05] transition-colors duration-300">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <span className="text-white/30 text-xs font-medium uppercase tracking-widest">Тут буде ілюстрація</span>
    </div>
  );
};

const WelcomeBox: React.FC = () => {
  return (
    <div className="mb-6 p-5 rounded-xl border border-brand-orange/40 bg-brand-orange/10 flex items-center gap-4 animate-fade-in-up relative overflow-hidden mx-auto w-full">
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
      <div className="text-center py-10 animate-fade-in-up">
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
  
  let isButtonDisabled = false;
  if (currentStepData.form) {
      isButtonDisabled = !isFormValid;
  } else if (currentStepData.multiselect) {
      isButtonDisabled = selectedAnswers.length === 0;
  }

  return (
    <div className="w-full flex flex-col items-center font-sans text-center">
      
      {/* 1. HEADER (Centered) */}
      <h1 className="text-[26px] md:text-3xl font-bold text-white mb-3 leading-[1.2] w-full font-sans">
        {currentStepData.question}
      </h1>
      
      {/* Description (Centered) */}
      {currentStepData.description && (
        <p className="text-base text-white/60 mb-2 w-full max-w-[400px] leading-relaxed font-sans mx-auto">
          {currentStepData.description}
        </p>
      )}

      {/* 2. PLACEHOLDER / GRAPHICS AREA */}
      
      {/* Special Stats for Step 1 */}
      {isFirstStep ? (
        <div className="flex flex-col gap-3 my-8 w-full">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-left">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">Навчаємо більше 8 років</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-left">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">15 000 активних студентів щомісяця</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-left">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <span className="font-medium text-white/90 text-sm font-sans">Більше 100 000 студентів успішно закінчили навчання</span>
          </div>
        </div>
      ) : (
        /* The requested Placeholder for other steps */
        !currentStepData.form && <IllustrationPlaceholder />
      )}

      {/* 3. ANSWERS / BUTTONS */}
      {currentStepData.answers && (
        <div className="grid grid-cols-1 gap-3 w-full mb-8">
          {currentStepData.answers.map((answer) => (
            <button
              key={answer.text}
              className={`p-4 text-center rounded-xl border-2 transition-all duration-200 font-bold w-full font-sans ${
                selectedAnswers.includes(answer.text)
                  ? "bg-brand-orange border-brand-orange text-black shadow-lg scale-[1.02]"
                  : "bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/[0.08] hover:border-white/20"
              }`}
              onClick={() => handleAnswerClick(answer.text)}
            >
              <span className="text-base">{answer.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Form Step */}
      {currentStepData.form && (
        <div className="flex flex-col gap-5 w-full mb-8 mt-6">
          <WelcomeBox />
          
          <div className="space-y-4 text-left">
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
