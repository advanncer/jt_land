import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { quizData } from "./data";
import alinaPhoto from "../../lp-check-up/src/assets/reviews/alina.jpg";
import vladimirPhoto from "../../lp-check-up/src/assets/reviews/dmitro.jpg";

declare global {
  interface Window {
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

const formatPhoneNumber = (value: string) => {
  const input = value.replace(/\D/g, "").substring(0, 12);
  let numbers = input;
  if (!numbers.startsWith("380") && numbers.length > 0) {
    if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
    else numbers = "380" + numbers;
  }
  numbers = numbers.substring(0, 12);
  let char: any = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
  let formatted = "";
  for (let i = 0; i < numbers.length; i++) {
    if (char[i]) formatted += char[i];
    formatted += numbers[i];
  }
  return formatted;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadTelegram, setLeadTelegram] = useState("");
  
  const [loaderProgress, setLoaderProgress] = useState(0);

  const currentStepData = quizData.find((s) => s.step === step) || quizData[0];
  const isHero = currentStepData.type === "hero";
  const isLoader = currentStepData.type === "loader";
  const isLead = currentStepData.type === "lead_contacts";

  const displayStep = currentStepData.displayStep || 1;
  const totalSteps = 15;

  useEffect(() => {
    if (isLoader) {
      const interval = setInterval(() => {
        setLoaderProgress((prev) => {
          if (prev >= 91) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 800);
            return 91;
          }
          return prev + 1;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [step, isLoader]);

  const handleChoice = (label: string) => {
    const newAnswers = Object.assign({}, answers, { [step]: label });
    setAnswers(newAnswers);
    setTimeout(() => {
        setStep(step + 1);
        window.scrollTo(0, 0);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadPhone.replace(/\D/g, "").length !== 12) return;

    const qaArray = Object.entries(answers).map(
      (item) => "Q" + item[0] + ": " + item[1]
    );
    const qaString = qaArray.join("|||");

    const urlParams = new URLSearchParams(window.location.search);

    const payload = {
      name: leadName,
      phone: "+" + leadPhone.replace(/\D/g, ""),
      email: leadEmail,
      telegram: leadTelegram,
      qa: qaString,
      dialogueUrl: window.location.href,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_term: urlParams.get("utm_term"),
      utm_content: urlParams.get("utm_content"),
      utm_subject: "English Reviews",
    };

    try {
      const response = await fetch(
        "https://n8n.justschool.me/webhook/19be50df-0410-4330-8dcb-3797fa703c56",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        if (window.dataLayer) {
          window.dataLayer.push({ event: "form_success", quiz_name: "lp-reviews" });
        }
        if (window.fbq) {
          window.fbq("track", "Purchase", { currency: "UAH", value: 0 });
        }
        const result = await response.json();
        if (result.redirectUri) {
          window.location.href = result.redirectUri;
        } else {
          alert("Дякуємо! Ваша заявка прийнята.");
          setStep(1);
          setAnswers({});
          setLeadName("");
          setLeadPhone("");
          setLeadEmail("");
          setLeadTelegram("");
        }
      } else {
        alert("Виникла помилка при відправці. Спробуйте ще раз.");
      }
    } catch (error) {
      alert("Виникла помилка при відправці.");
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const nameError = step === 5 && leadName.length > 0 && leadName.length < 2;

  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] text-[#09090A] font-sans flex flex-col items-center overflow-x-hidden relative">
      
      {isHero && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[749px] h-[749px] rounded-full" style={{ background: "radial-gradient(59.91% 59.91% at 50% 50%, #FFFFFF 0%, #FCFBFF 100%)" }}></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[642px] h-[642px] rounded-full opacity-50" style={{ background: "radial-gradient(50% 50% at 50% 50%, #FFFFFF 54.26%, #F7F6FF 100%)" }}></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[507px] h-[507px] rounded-full opacity-75" style={{ background: "radial-gradient(50% 50% at 50% 50%, #FFFFFF 54.26%, #F7F6FF 100%)" }}></div>
        </div>
      )}

      <header className="w-full max-w-5xl px-[18px] py-[24px] md:px-6 flex justify-between items-center relative z-10 shrink-0">
        <div className="w-[69px] flex items-center">
          {!isHero && (
            <button
              onClick={goBack}
              className="flex items-center gap-[8px] text-[14px] font-medium text-[#09090A] hover:text-[#F46600] transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} /> Назад
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-[10px] absolute left-1/2 -translate-x-1/2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0L19.5 11.5L31 15L19.5 18.5L16 30L12.5 18.5L1 15L12.5 11.5L16 0Z" fill="#F46600"/>
            </svg>
            <span className="font-bold text-[20px] md:text-[24px] tracking-tight">JustSchool</span>
        </div>

        <div className="w-[69px] text-right">
            {!isHero && !isLead && (
              <span className="text-[14px] font-semibold text-[#09090A]">
                 {displayStep} / {totalSteps}
              </span>
            )}
        </div>
      </header>

      {!isHero && !isLead && (
        <div className="w-full max-w-[896px] px-[18px] md:px-0 mb-[32px] z-10">
          <div className="w-full bg-[#E6E6E6] h-[8px] rounded-[100px] overflow-hidden">
              <motion.div 
                  className="bg-[#F46600] h-full rounded-[100px]"
                  initial={{ width: 0 }}
                  animate={{ width: (displayStep / totalSteps) * 100 + "%" }}
                  transition={{ duration: 0.5 }}
              />
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-5xl px-[18px] md:px-6 pb-12 flex flex-col items-center z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center"
          >
            
            {isHero && (
              <div className="flex flex-col items-center text-center mt-2 max-w-[896px]">
                <h1 className="text-[26px] md:text-[56px] font-bold mb-[8px] leading-[32px] md:leading-[1.1] text-[#09090A]">
                  Заговори англійською вільно — <span className="text-[#F46600]">з JustSchool</span>
                </h1>
                <p className="text-[16px] md:text-[20px] text-[#09090A] leading-[24px] font-normal mb-[8px] max-w-[600px]">
                  Наші студенти виходять на новий рівень та долають мовний бар"єр вже за перший місяць. 
                  Почни говорити з перших хвилин на інтерактивній платформі, що підлаштовується під твій темп.
                </p>
                <p className="text-[16px] md:text-[20px] text-[#09090A] font-semibold leading-[24px] mb-[24px]">
                  Пройди тест, дізнайся свій рівень та отримай персональний план навчання.
                </p>
                
                <div className="w-full max-w-[284px] md:max-w-md mx-auto flex flex-col items-center">
                    <div className="bg-[#F2F2FE] rounded-[50px] px-[24px] py-[8px] mb-[10px] flex items-center justify-center gap-[10px] h-[60px] w-full">
                       <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="9" cy="8.5" r="7.5" stroke="#4D63FF" strokeWidth="2"/>
                          <path d="M9 4.5v4l2 2" stroke="#4D63FF" strokeWidth="2" strokeLinecap="round"/>
                       </svg>
                       <span className="text-[14px] font-semibold text-[#09090A]">Лише <span className="text-[#4D63FF]">30 секунд</span>, щоб дізнатися рівень</span>
                    </div>
                    
                    <button
                      onClick={() => setStep(2)}
                      className="w-full h-[56px] bg-[#F46600] text-white rounded-[10px] font-bold text-[18px] flex items-center justify-center gap-[10px] active:scale-95 transition-all"
                    >
                      Пройти тест <ArrowLeft className="rotate-180" size={20} strokeWidth={2.5}/>
                    </button>
                    <p className="text-[14px] text-[#09090A] font-medium mt-[10px] mb-[32px]">
                      Безкоштовно та миттєво
                    </p>
                    
                    <div className="flex flex-col items-center w-full">
                        <div className="flex justify-center items-center h-[44px] mb-[16px]">
                            <div className="flex -space-x-3">
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-white bg-blue-100 z-[5] overflow-hidden"><img src={alinaPhoto} className="w-full h-full object-cover"/></div>
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-white bg-green-100 z-[4] overflow-hidden"><img src={vladimirPhoto} className="w-full h-full object-cover"/></div>
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-white bg-purple-100 z-[3] overflow-hidden"><img src={alinaPhoto} className="w-full h-full object-cover"/></div>
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-white bg-yellow-100 z-[2] overflow-hidden"><img src={vladimirPhoto} className="w-full h-full object-cover"/></div>
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-white bg-[#F2F2FE] flex items-center justify-center text-[#4D63FF] font-semibold text-[13.75px] z-[1]">+20k</div>
                            </div>
                        </div>
                        <p className="text-[16px] text-[#09090A] font-medium leading-[24px]">
                            Більше <b>20 000</b> учнів вже дізналися свій рівень
                        </p>
                    </div>
                </div>
              </div>
            )}

            {currentStepData.type === "choice" && (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-[32px] w-full max-w-[896px]">
                  <h1 className="text-[24px] font-bold mb-[16px] leading-[30px] text-[#09090A]">
                    {currentStepData.question}
                  </h1>
                  {currentStepData.subtitle && (
                    <p className="text-[18px] text-[#09090A] leading-[28px] font-normal">
                      {currentStepData.subtitle}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full mb-[32px] max-w-[896px]">
                  {currentStepData.options && currentStepData.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChoice(opt.label)}
                      className={
                        "px-[24px] py-[20px] rounded-[16px] text-left flex items-center gap-[12px] min-h-[72px] transition-all " +
                        (answers[step] === opt.label 
                          ? "bg-[#FFFAF5] border border-[#F46600]" 
                          : "bg-[#FFFFFF] border border-transparent shadow-[0px_0px_9.8px_rgba(125,125,125,0.09)]")
                      }
                    >
                      <span className="text-[32px]">{opt.emoji}</span>
                      <span className="font-semibold text-[18px] text-[#09090A] leading-[20px]">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {currentStepData.bottomBlock && (
                  <div className="w-full max-w-[896px] bg-[#F4F5FF] rounded-[16px] p-[20px_24px] md:p-[32px] relative flex flex-col gap-[16px]">
                      {currentStepData.bottomBlock.type === "testimonial" ? (
                          <div className="flex flex-col md:flex-row gap-[16px] items-start w-full">
                              <div className="flex flex-row items-center gap-[16px]">
                                  <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden">
                                      <img src={currentStepData.bottomBlock.photoUrl} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                      <h4 className="font-semibold text-[18px] leading-[18px] text-[#09090A]">{currentStepData.bottomBlock.name}</h4>
                                      <p className="text-[#747474] text-[12px] leading-[16px]">{currentStepData.bottomBlock.title}</p>
                                  </div>
                                  <div className="ml-auto md:ml-6 flex items-center gap-[4px]">
                                      {[0, 1, 2, 3, 4].map((i) => (
                                          <Star key={i} size={16} fill="#FFB800" stroke="none" />
                                      ))}
                                      <span className="ml-[8px] font-medium text-[#747474] text-[16px]">5.0</span>
                                  </div>
                              </div>
                              <p className="text-[18px] font-normal leading-[28px] text-[#09090A]">
                                  " {currentStepData.bottomBlock.text} "
                              </p>
                          </div>
                      ) : (
                          <div className="flex items-center gap-[16px]">
                              <div className="w-[44px] h-[44px] bg-[#E3E3FB] rounded-full flex items-center justify-center shrink-0">
                                  <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M13 0C5.82 0 0 5.82 0 13C0 18.83 3.82 23.77 9 25.4V30L13 27L17 30V25.4C22.18 23.77 26 18.83 26 13C26 5.82 20.18 0 13 0ZM13 24C6.92 24 2 19.08 2 13C2 6.92 6.92 2 13 2C19.08 2 24 6.92 24 13C24 19.08 19.08 24 13 24Z" fill="#4D63FF"/>
                                      <path d="M13 6C10.79 6 9 7.79 9 10H11C11 8.9 11.9 8 13 8C14.1 8 15 8.9 15 10C15 11.5 13 11.25 13 14H15C15 12.25 17 12 17 10C17 7.79 15.21 6 13 6Z" fill="#4D63FF"/>
                                      <rect x="12" y="16" width="2" height="2" fill="#4D63FF"/>
                                  </svg>
                              </div>
                              <div className="flex flex-col gap-[4px]">
                                  <h4 className="text-[#4D63FF] font-bold text-[16px] leading-[24px]">
                                      {currentStepData.bottomBlock.title}
                                  </h4>
                                  <p className="text-[18px] font-medium leading-[28px] text-[#09090A]">
                                      {currentStepData.bottomBlock.text}
                                  </p>
                              </div>
                          </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {isLoader && (
              <div className="w-full flex flex-col items-center max-w-[284px] md:max-w-md">
                <h1 className="text-[24px] font-bold mb-[24px] leading-[30px] text-center text-[#09090A]">
                  {currentStepData.question}
                </h1>
                
                <div className="relative w-[152px] h-[152px] mb-[32px]">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="76" cy="76" r="68" stroke="#FFDCC0" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <motion.circle 
                      cx="76" cy="76" r="68" 
                      stroke="#F46600" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "427", strokeDashoffset: "427" }}
                      animate={{ strokeDashoffset: 427 - (427 * loaderProgress) / 100 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[36px] font-bold text-[#F46600] tracking-[-0.2px]">
                    {loaderProgress}<span className="text-[20px]">%</span>
                  </div>
                </div>

                <div className="space-y-[20px] w-full">
                  {currentStepData.points && currentStepData.points.map((p, i) => {
                    const isVisible = loaderProgress > (i * 22);
                    return (
                      <div 
                        key={p} 
                        className={"flex items-center gap-[12px] transition-opacity duration-500 " + (isVisible ? "opacity-100" : "opacity-30")}
                      >
                        <div className={"w-[24px] h-[24px] rounded-full flex items-center justify-center text-white shrink-0 " + (isVisible ? "bg-[#FF6100]" : "bg-gray-300")}>
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                        <span className="font-medium text-[16px] leading-[24px] text-[#09090A]">{p}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isLead && (
              <div className="w-full max-w-[896px] flex flex-col md:flex-row gap-[32px] items-stretch">
                
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="mb-[24px]">
                    <h2 className="text-[24px] font-bold mb-[16px] leading-[30px] text-[#09090A] text-center md:text-left">
                      Отримай персональний план навчання!
                    </h2>
                    <p className="text-[18px] text-[#09090A] font-normal leading-[28px] text-center md:text-left">
                      Введи свій номер телефону та e-mail, і ми надішлемо тобі деталі про навчання та безкоштовний пробний урок.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
                    <div>
                        <input
                          type="text"
                          placeholder="Ім’я"
                          required
                          className={"w-full p-[18px_16px] h-[56px] rounded-[16px] bg-[#FFFFFF] border transition-all text-[14px] font-medium text-[#09090A] outline-none placeholder:text-[#747474] " + (nameError ? "border-[#D20000]" : "border-[#F5AC72]")}
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                        />
                        {nameError && <p className="text-[12px] text-[#D20000] mt-1 pl-4">Текст помилки</p>}
                    </div>
                    
                    <div className="relative flex items-center">
                        <div className="absolute left-4 flex items-center gap-[8px] h-full pointer-events-none">
                            <div className="w-[25px] h-[20px] rounded-[4px] bg-[#F9D549] overflow-hidden relative">
                                <div className="absolute top-0 w-full h-1/2 bg-[#205EB5]"></div>
                            </div>
                            <span className="text-[14px] font-semibold text-[#09090A] flex items-center gap-[4px]">+380 <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 7L0 0H13L6.5 7Z" fill="#09090A"/></svg></span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Номер телефону"
                          required
                          className="w-full p-[18px_16px] h-[56px] pl-[120px] rounded-[16px] bg-[#FFFFFF] border border-[#F5AC72] transition-all text-[14px] font-medium text-[#09090A] outline-none placeholder:text-[#747474]"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(formatPhoneNumber(e.target.value))}
                          maxLength={15}
                        />
                    </div>

                    <input
                      type="email"
                      placeholder="Електронна пошта"
                      required
                      className="w-full p-[18px_16px] h-[56px] rounded-[16px] bg-[#FFFFFF] border border-[#F5AC72] transition-all text-[14px] font-medium text-[#09090A] outline-none placeholder:text-[#747474]"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />
                    
                    <input
                      type="text"
                      placeholder="Ваш нік в Telegram/Viber (@name)"
                      className="w-full p-[18px_16px] h-[56px] rounded-[16px] bg-[#FFFFFF] border border-[#F5AC72] transition-all text-[14px] font-medium text-[#09090A] outline-none placeholder:text-[#747474]"
                      value={leadTelegram}
                      onChange={(e) => setLeadTelegram(e.target.value)}
                    />

                    <div className="pt-[8px]">
                        <button
                          type="submit"
                          className="w-full h-[56px] bg-[#F46600] text-white rounded-[16px] font-bold text-[18px] leading-[28px] active:scale-95 transition-all"
                        >
                          Залишити заявку
                        </button>
                    </div>
                    <p className="text-[14px] text-[#747474] text-center font-normal leading-[22px] px-2">
                      Ми допоможемо тобі в усьому. Твої дані в безпеці та використовуються лише для зв"язку з методистом.
                    </p>
                  </form>
                </div>

                <div className="w-full md:w-1/2 bg-[#F4F5FF] rounded-[16px] p-[18px] md:p-[32px] flex flex-col items-center relative overflow-hidden">
                   <div className="text-center mb-[16px] relative w-full flex flex-col items-center z-10">
                       <h3 className="text-[18px] font-bold text-[#09090A] mb-[16px] leading-[28px]">Рейтинг Google</h3>
                       
                       <div className="absolute top-[20px] w-full flex justify-between px-[20px]">
                           <svg width="45" height="109" viewBox="0 0 45 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M44 20 Q10 50 44 90" stroke="#C3B8FD" strokeWidth="8" fill="none" strokeLinecap="round"/>
                           </svg>
                           <svg width="45" height="109" viewBox="0 0 45 109" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: "scaleX(-1)"}}>
                               <path d="M44 20 Q10 50 44 90" stroke="#C3B8FD" strokeWidth="8" fill="none" strokeLinecap="round"/>
                           </svg>
                       </div>

                       <div className="flex items-end justify-center gap-[4px] mb-[16px]">
                           <span className="text-[32px] font-black text-[#000000] leading-none">4.7</span>
                           <span className="text-[25px] font-bold text-[#09090A] leading-none">/5</span>
                       </div>
                       <div className="flex items-center justify-center gap-[8px] mb-[16px]">
                            {[0, 1, 2, 3].map((i) => (
                                <Star key={i} size={18} fill="#FFB800" stroke="none" />
                            ))}
                            <div className="relative w-[18px] h-[17px]">
                                <Star size={18} fill="#D9D9D9" stroke="none" className="absolute top-0 left-0" />
                                <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                                   <Star size={18} fill="#FFB800" stroke="none" />
                                </div>
                            </div>
                       </div>
                       <p className="text-[18px] font-normal text-[#09090A] leading-[28px]">Відгуки наших студентів</p>
                   </div>

                   <div className="space-y-[16px] w-full mt-[8px] z-10">
                      <div className="bg-[#FFFFFF] rounded-[16px] p-[16px] shadow-sm flex flex-col gap-[20px]">
                         <div className="text-[#000000] font-bold text-[14px] flex gap-1">Education<span className="text-[#FFC107]">.ua</span></div>
                         <p className="text-[16px] font-normal leading-[24px] text-[#09090A]">
                            Все супер, мені комфотно тут вчитись, цікаво проходять уроки. Бізнес англійська це топ, я вже змогла отримати офер у міжнародній компанії. Без Just School цього б не сталось. Дякую!
                         </p>
                         <div className="flex items-center gap-[16px]">
                            <div className="w-[40px] h-[40px] bg-[#E3E3FB] rounded-full flex items-center justify-center text-[#4D63FF]">
                                <svg width="19" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <span className="font-semibold text-[16px] text-[#09090A]">Ангеліна</span>
                         </div>
                      </div>

                      <div className="bg-[#FFFFFF] rounded-[16px] p-[16px] shadow-sm flex flex-col gap-[20px]">
                         <div className="text-[#194CD5] font-black text-[18px] tracking-tighter">enguide</div>
                         <p className="text-[16px] font-normal leading-[24px] text-[#09090A]">
                            Я займаюсь англійською вже кілька місяців, і це реально приносить результати. Найбільше подобається, що викладач враховує мої цілі, і ми працюємо над тим, що мені дійсно важливо...
                         </p>
                         <div className="flex items-center gap-[16px]">
                             <img src={vladimirPhoto} className="w-[40px] h-[40px] rounded-full object-cover"/>
                             <span className="font-semibold text-[16px] text-[#09090A]">Владимир Кузьма</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-center gap-[20px] mt-[24px] z-10">
                       <div className="w-[14px] h-[14px] rounded-full bg-[#F46600]"></div>
                       <div className="w-[14px] h-[14px] rounded-full bg-[#FFDCC0]"></div>
                       <div className="w-[14px] h-[14px] rounded-full bg-[#FFDCC0]"></div>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
