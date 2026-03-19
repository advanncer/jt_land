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
  1: var1, 2: var2, 3: var3, 4: var4, 5: var5, 6: var6, 7: var7, 8: var8, 9: var9,
  10: var1, 11: var2, 12: var3, 13: var4, 14: var5, 15: var6, 16: var7, 17: var8, 18: var9,
  19: var1, 20: var2, 21: var3, 22: var4
};

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

const Logo: React.FC = () => (
  <div className="w-full flex justify-center mb-6 pt-2">
    <div className="flex items-center gap-2 opacity-90">
      <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
      <span className="text-xl font-bold text-white tracking-tight">JustSchool</span>
    </div>
  </div>
);

const ShimmerButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full h-14 rounded-2xl font-bold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 group shadow-xl transform active:scale-[0.98] ${disabled ? 'bg-white/10 text-white/20 border border-white/5 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] border border-orange-400/20'}`}
  >
    {!disabled && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer"></div>}
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
  </button>
);

const highlightText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(JustSchool)/gi);
  return parts.map((part, i) => part.toLowerCase() === 'justschool' ? <span key={i} className="text-[#f16600] font-bold">JustSchool</span> : part);
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

const Quiz: React.FC<QuizProps> = ({ step, onNextStep }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    Object.values(stepImages).forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    if (!currentStepData?.form) return;
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const isPhoneValid = phoneDigits.length === 12;
    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setIsFormValid(isPhoneValid && isNameValid && isEmailValid);
  }, [formData, currentStepData]);

  if (!currentStepData) return <div className="w-full h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in-up"><div className="w-16 h-16 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin mb-6"></div><h1 className="text-2xl font-bold mb-2 text-white font-sans">Зачекайте, будь ласка...</h1><p className="text-gray-400 text-base font-sans">Відправляємо вас на платформу</p></div>;

  const handleAnswerClick = (answer: string) => {
    if (currentStepData.multiselect) {
      setSelectedAnswers((prev) => prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]);
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

  let isButtonDisabled = false;
  if (currentStepData.form) { isButtonDisabled = !isFormValid; }
  else if (currentStepData.multiselect) { isButtonDisabled = selectedAnswers.length === 0; }

  const currentImage = stepImages[step];

  return (
    <>
      <div className="w-full px-5 pt-16 pb-48 flex flex-col flex-grow overflow-y-auto no-scrollbar">
        <Logo />
        <div key={step} className="w-full flex flex-col items-center animate-fade-in-up">
            <div className="text-center mb-4 w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight font-sans tracking-tight">
                {highlightText(currentStepData.question)}
              </h1>
            </div>
            <div className="w-full">
              {currentStepData.answers && (
                <div className={`w-full mb-6 ${currentStepData.grid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2.5"}`}>
                  {currentStepData.answers.map((answer) => (
                    <button
                      key={answer.text}
                      className={`p-3 text-left rounded-xl border transition-all duration-200 font-bold w-full flex items-center ${currentStepData.grid ? "text-[12px] sm:text-[13px]" : "text-[14px] sm:text-[15px]"} ${selectedAnswers.includes(answer.text) ? "bg-white/10 border-brand-orange text-white shadow-[0_0_15px_rgba(241,102,0,0.3)]" : "bg-white/[0.03] border-white/5 text-gray-300 active:bg-white/10"}`}
                      onClick={() => handleAnswerClick(answer.text)}
                    >
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 mr-2 sm:mr-3 flex items-center justify-center ${selectedAnswers.includes(answer.text) ? "border-brand-orange" : "border-white/20"}`}>
                         {selectedAnswers.includes(answer.text) && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-brand-orange rounded-full"></div>}
                      </div>
                      <span className="leading-snug">{answer.text}</span>
                    </button>
                  ))}
                </div>
              )}
              {!currentStepData.form && currentImage && ![7, 16, 17, 18, 19].includes(step) && (
                 <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5 relative flex items-center justify-center max-w-[240px] mx-auto h-[100px] sm:h-[130px] mb-6">
                    <img src={currentImage} alt="Quiz illustration" className="w-full h-full object-cover opacity-90" />
                 </div>
              )}
              {currentStepData.form && (
                <div className="flex flex-col gap-4 w-full mt-4">
                  <div className="space-y-4">
                    <input type="text" placeholder="Ваше імʼя*" className="input-glass py-4 text-lg w-full" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none gap-2"><span className="text-xl">🇺🇦</span></div>
                      <input type="tel" placeholder="+380 (XX) XXX-XX-XX" className="input-glass py-4 pl-12 text-lg w-full" value={formData.phone} onChange={handlePhoneChange} maxLength={19} />
                    </div>
                    <input type="email" placeholder="Ваш e-mail" className="input-glass py-4 text-lg w-full" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
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
