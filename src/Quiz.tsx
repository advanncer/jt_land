import React, { useState, useEffect } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

/* --- Components --- */

const EnglishBooster: React.FC = () => {
  const boosters = [
    { icon: "🇬🇧", title: "Слово дня", text: "Did you know? 'Eunoia' — це найкоротше англійське слово, яке містить усі п'ять голосних. Воно означає «красиве мислення»." },
    { icon: "🔥", title: "Факт мотивації", text: "Англійська — офіційна мова 67 країн. Ви відкриваєте двері у весь світ!" },
    { icon: "🇬🇧", title: "Ідіома дня", text: "'Break the ice' означає розпочати розмову в соціальній ситуації, коли люди почуваються ніяково." },
    { icon: "⚡", title: "Порада", text: "Думати англійською, а не перекладати з рідної мови — найшвидший шлях до вільного володіння." }
  ];
  const randomBooster = boosters[Math.floor(Math.random() * boosters.length)];

  return (
    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <span className="text-xl pt-1">{randomBooster.icon}</span>
        <div className="text-left">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{randomBooster.title}</h4>
          <p className="text-xs text-white/60 leading-relaxed">{randomBooster.text}</p>
        </div>
      </div>
    </div>
  );
};

const WelcomeBox: React.FC = () => {
  return (
    <div className="mb-6 p-5 rounded-xl border-2 border-dashed border-brand-orange/40 bg-brand-orange/5 flex items-center gap-4 animate-fade-in-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-orange/10 blur-xl rounded-full pointer-events-none"></div>
        <div className="w-10 h-10 flex items-center justify-center bg-brand-orange/20 rounded-full text-2xl shadow-inner shadow-brand-orange/30">
            🎁
        </div>
        <div className="text-left">
            <p className="font-bold text-white text-sm">Welcome Box + Подарунок</p>
            <p className="text-[11px] text-white/60 mt-0.5">Гарантовано після відправки форми</p>
        </div>
    </div>
  );
};

/* --- Logic Helpers --- */

const formatPhoneNumber = (value: string) => {
    // Keep only digits
    const input = value.replace(/\D/g, '').substring(0, 12);
    
    // Auto-prefix +380 if missing or started typing differently
    let numbers = input;
    if (numbers.startsWith("380")) {
        // ok
    } else if (numbers.length > 0) {
        // If user starts typing '0...', treat as '380...'
        if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
        else numbers = "380" + numbers;
    } else {
        return ""; 
    }

    numbers = numbers.substring(0, 12);

    // Apply Mask: +380 (XX) XXX-XX-XX
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

  // Validate Form Effect
  useEffect(() => {
    if (!currentStepData?.form) return;
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const isPhoneValid = phoneDigits.length === 12; // 380XXXXXXXXX
    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    setIsFormValid(isPhoneValid && isNameValid && isEmailValid);
  }, [formData, currentStepData]);


  if (!currentStepData) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold mb-4 text-white">Вітаємо!</h1>
        <p className="text-white/60">Ваш персональний план готовий. Менеджер звʼяжеться з вами найближчим часом.</p>
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
      // Allow deletion (backspace)
      if (val.length < formData.phone.length) {
          setFormData({ ...formData, phone: val });
          return;
      }
      setFormData({ ...formData, phone: formatPhoneNumber(val) });
  };

  
  const isFirstStep = step === 1;
  const isEvenStep = step % 2 === 0;
  
  // Button Disable Logic
  let isButtonDisabled = false;
  if (currentStepData.form) {
      isButtonDisabled = !isFormValid;
  } else if (currentStepData.multiselect) {
      isButtonDisabled = selectedAnswers.length === 0;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight text-center font-['Space_Grotesk']">
        {currentStepData.question}
      </h1>
      
      {currentStepData.description && (
        <p className="text-lg text-[#e5e5e5] mb-8 max-w-[500px] text-center font-medium opacity-80">
          {currentStepData.description}
        </p>
      )}

      {isFirstStep && (
        <div className="flex flex-col gap-3 mb-10 w-full max-w-[450px]">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <span className="font-semibold text-white/90 text-sm">Навчаємо більше 8 років</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="font-semibold text-white/90 text-sm">15 000 активних студентів щомісяця</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-orange/10 rounded-lg text-brand-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <span className="font-semibold text-white/90 text-sm">Більше 100 000 студентів успішно закінчили навчання</span>
          </div>
        </div>
      )}

      {currentStepData.answers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-8">
          {currentStepData.answers.map((answer) => (
            <button
              key={answer.text}
              className={`p-5 text-left rounded-2xl border-2 transition-all duration-300 font-bold group ${
                selectedAnswers.includes(answer.text)
                  ? "bg-brand-orange border-brand-orange text-black shadow-[0_0_25px_rgba(241,102,0,0.4)] translate-y-[-2px]"
                  : "bg-[#111] border-white/10 text-white/80 hover:border-brand-orange/50 hover:bg-[#161616] hover:text-white"
              }`}
              onClick={() => handleAnswerClick(answer.text)}
            >
              <div className="flex justify-between items-center w-full">
                <span>{answer.text}</span>
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

      {currentStepData.form && (
        <div className="flex flex-col gap-4 w-full max-w-[400px] mb-8">
          <WelcomeBox />
          
          <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Імʼя</label>
              <input 
                type="text" 
                placeholder="Введіть ваше імʼя" 
                className="input-field placeholder:text-white/20" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
          </div>

          <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Телефон</label>
              <input 
                type="tel" 
                placeholder="+380 (XX) XXX-XX-XX" 
                className="input-field placeholder:text-white/20" 
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={19}
              />
          </div>

          <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                className="input-field placeholder:text-white/20" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
          </div>
        </div>
      )}

      {currentStepData.cta && (
        <div className="w-full max-w-[320px]">
          <button
            className={`btn-primary ${
                isButtonDisabled 
                ? "opacity-50 cursor-not-allowed shadow-none bg-[#333] text-white/30" 
                : "animate-pulse-slow shadow-[0_0_20px_rgba(241,102,0,0.6)]"
            } ${isFirstStep ? "animate-pulse-slow" : ""}`}
            onClick={handleNextClick}
            disabled={isButtonDisabled}
          >
            {currentStepData.cta}
          </button>
          
          {/* Show Booster on even steps, BUT NOT on the form step (which is usually the last one) */}
          {isEvenStep && !currentStepData.form && <EnglishBooster />}
        </div>
      )}
    </div>
  );
};

export default Quiz;
