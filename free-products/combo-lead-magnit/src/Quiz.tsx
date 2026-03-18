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
  1: var1, 2: var2, 3: var3, 4: var4, 5: var5, 6: var6, 7: var7, 8: var8, 9: var9
};

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
  isSubmitting?: boolean;
}

const Logo: React.FC = () => (
  <div className="w-full flex justify-center mb-6 pt-2">
    <div className="flex items-center gap-2 opacity-90">
      <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
      <span className="text-xl font-bold text-white tracking-tight">JustSchool</span>
    </div>
  </div>
);

const ShimmerButton: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode; type?: "button" | "submit" }> = ({ onClick, disabled, children, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full h-14 rounded-2xl font-bold text-lg tracking-wide text-white overflow-hidden transition-all duration-300
        group shadow-xl transform active:scale-[0.98]
        ${disabled
          ? "bg-white/10 text-white/20 border border-white/5 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] border border-orange-400/20"
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

const formatPhoneNumber = (value: string) => {
    const input = value.replace(/\D/g, "").substring(0, 12);
    let numbers = input;
    if (numbers.startsWith("380")) {}
    else if (numbers.length > 0) {
        if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
        else numbers = "380" + numbers;
    } else { return ""; }
    numbers = numbers.substring(0, 12);
    let char: any = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
        if (char[i]) formatted += char[i];
        formatted += numbers[i];
    }
    return formatted;
};

const Quiz: React.FC<QuizProps> = ({ step, onNextStep, isSubmitting = false }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderText, setLoaderText] = useState("Аналізуємо ваші відповіді...");

  useEffect(() => {
    Object.values(stepImages).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!currentStepData) return;
    
    // Validation for Screen 11 (Email)
    if (currentStepData.type === "email_capture") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      setIsEmailValid(emailValid);
    }
    
    // Validation for Screen 12 (Registration)
    if (currentStepData.type === "registration") {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const phoneValid = phoneDigits.length === 12;
      const nameValid = formData.name.trim().length >= 2;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      setIsFormValid(phoneValid && nameValid && emailValid);
    }
    
    // Logic for Screen 10 (Loader)
    if (currentStepData.type === "loader") {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 5) + 2;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setTimeout(() => onNextStep(), 500); // Auto-transition
        }
        setLoaderProgress(currentProgress);
        
        if (currentProgress < 30) setLoaderText("Аналізуємо ваші відповіді...");
        else if (currentProgress < 70) setLoaderText("Підбираємо ідеальну стратегію навчання...");
        else setLoaderText("Формуємо бонусні матеріали...");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [formData, currentStepData, onNextStep]);

  if (!currentStepData) return null;

  const handleAnswerClick = (answer: string) => {
    if (currentStepData.answers) {
      setSelectedAnswers([answer]);
      // If we want immediate transition on single choice, uncomment below
      // onNextStep([answer]);
    }
  };

  const handleNextClick = () => {
    if (currentStepData.type === "registration") {
      onNextStep([JSON.stringify(formData)]);
    } else if (currentStepData.type === "email_capture") {
      // just move next, email is in formData
      onNextStep();
    } else {
      onNextStep(selectedAnswers);
      setSelectedAnswers([]);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.length < formData.phone.length) { setFormData({ ...formData, phone: val }); return; }
      setFormData({ ...formData, phone: formatPhoneNumber(val) });
  };

  let isButtonDisabled = false;
  if (currentStepData.type === "registration") isButtonDisabled = !isFormValid;
  else if (currentStepData.type === "email_capture") isButtonDisabled = !isEmailValid;
  else if (currentStepData.answers) isButtonDisabled = selectedAnswers.length === 0;

  const currentImage = stepImages[step];

  return (
    <>
      <div className="w-full px-5 pt-16 pb-48 flex flex-col flex-grow overflow-y-auto no-scrollbar">
        <Logo />

        <div key={step} className="w-full flex flex-col items-center animate-fade-in-up">
          
          {/* LOADER SCREEN */}
          {currentStepData.type === "loader" && (
            <div className="flex flex-col items-center justify-center w-full h-[60vh]">
              <div className="w-20 h-20 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin mb-8"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center h-16">{loaderText}</h2>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300 ease-out" 
                  style={{ width: `${loaderProgress}%` }}
                ></div>
              </div>
              <p className="text-brand-orange font-bold mt-3">{loaderProgress}%</p>
            </div>
          )}
          
          {/* EMAIL CAPTURE SCREEN */}
          {currentStepData.type === "email_capture" && (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(241,102,0,0.3)]">
                🎁
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center leading-tight">
                Готово! Ваш профіль проаналізовано.
              </h1>
              <p className="text-gray-300 text-center mb-8">
                Заберіть безкоштовний PDF-гайд <span className="text-white font-bold">«1000 найуживаніших слів англійською»</span>. Вивчення саме цієї бази дозволить вам розуміти 80% повсякденної мови.
              </p>
              
              <div className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl">
                <label className="block text-white/70 text-sm mb-2 font-medium">Введіть ваш Email для отримання PDF</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>
          )}

          {/* REGISTRATION SCREEN */}
          {currentStepData.type === "registration" && (
            <div className="w-full flex flex-col items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center leading-tight">
                PDF-словник вже летить на вашу пошту! 🚀 Але це ще не все.
              </h1>
              <p className="text-gray-300 text-center mb-6">
                Щоб ви реально запамʼятали ці слова, ми відкриваємо доступ до <span className="text-white font-bold">Комбо-міксу</span> (аудіо-озвучка, інтерактивні картки, міні-курс).
              </p>
              
              {/* Value Block */}
              <div className="mb-8 p-[2px] rounded-3xl bg-gradient-to-r from-orange-500 to-purple-600 w-full relative">
                <div className="bg-[#0f0f0f] rounded-[22px] p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                  
                  <p className="text-white font-bold text-lg mb-2">Доступ до Комбо-міксу</p>
                  <div className="flex items-end gap-3">
                    <span className="text-gray-500 line-through text-2xl font-bold">1430 грн.</span>
                    <span className="text-brand-orange text-3xl font-black">0 грн.</span>
                    <span className="text-gray-400 text-sm mb-1">для нових студентів</span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center mb-4 text-white/90 font-medium">
                Створіть безкоштовний акаунт на платформі JustSchool, щоб забрати все:
              </div>

              <div className="w-full flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="Ваше імʼя" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/40 focus:outline-none focus:border-brand-orange transition-all"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                  type="tel" 
                  placeholder="+380 (XX) XXX-XX-XX" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/40 focus:outline-none focus:border-brand-orange transition-all"
                  value={formData.phone} 
                  onChange={handlePhoneChange} 
                  maxLength={19} 
                />
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white/50 cursor-not-allowed"
                  value={formData.email} 
                  readOnly 
                />
              </div>
            </div>
          )}

          {/* STANDARD QUESTION SCREENS */}
          {currentStepData.answers && (
            <div className="w-full">
              <div className="text-center mb-4 w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {currentStepData.question}
                </h1>
              </div>

              <div className="flex flex-col gap-2.5 w-full mb-6">
                {currentStepData.answers.map((answer) => (
                  <button
                    key={answer.text}
                    className={`p-3.5 text-left rounded-xl border transition-all duration-200 font-bold w-full text-[14px] sm:text-[15px] flex items-center ${
                      selectedAnswers.includes(answer.text)
                        ? "bg-white/10 border-brand-orange text-white shadow-[0_0_15px_rgba(241,102,0,0.3)]"
                        : "bg-white/[0.03] border-white/5 text-gray-300 active:bg-white/10"
                    }`}
                    onClick={() => handleAnswerClick(answer.text)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-3 flex items-center justify-center ${
                        selectedAnswers.includes(answer.text) ? "border-brand-orange" : "border-white/20"
                    }`}>
                       {selectedAnswers.includes(answer.text) && <div className="w-2.5 h-2.5 bg-brand-orange rounded-full"></div>}
                    </div>
                    <span className="leading-snug">{answer.text}</span>
                  </button>
                ))}
              </div>
              
              {currentImage ? (
                 <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5 relative flex items-center justify-center max-w-[240px] mx-auto h-[100px] sm:h-[130px]">
                    <img src={currentImage} alt="Quiz illustration" className="w-full h-full object-cover opacity-90" />
                 </div>
              ) : (
                <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center max-w-[240px] mx-auto">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {currentStepData.cta && currentStepData.type !== "loader" && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 px-6 pb-12 backdrop-blur-[2px]">
            
            <ShimmerButton onClick={handleNextClick} disabled={isButtonDisabled || isSubmitting}>
              {isSubmitting ? (
                 <span className="flex items-center gap-2">
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Відправка...
                 </span>
              ) : currentStepData.cta}
            </ShimmerButton>

        </div>
      )}
    </>
  );
};

export default Quiz;
