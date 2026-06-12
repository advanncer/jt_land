import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  BookOpen,
  Star,
  Quote,
} from "lucide-react";
import { quizData } from "./data";

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
  const [answers, setAnswers] = useState({});
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [loaderProgress, setLoaderProgress] = useState(0);

  const currentStep = quizData.find((s) => s.step === step) || quizData[0];
  const totalSteps = 15; 

  useEffect(() => {
    if (currentStep && currentStep.type === "loader") {
      const interval = setInterval(() => {
        setLoaderProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 600);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, currentStep]);

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

    let ipData = { ip: "unknown", country: "unknown" };
    try {
      const ipResponse = await fetch("https://ipinfo.io/json");
      if (ipResponse.ok) {
        const data = await ipResponse.json();
        ipData = {
          ip: data.ip || "unknown",
          country: data.country || "unknown",
        };
      }
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
    }

    const qaArray = Object.entries(answers).map(
      (item) => "Q" + item[0] + ": " + item[1]
    );
    const ipString = "ip:" + ipData.ip + "|country:" + ipData.country;
    qaArray.unshift(ipString);
    const qaString = qaArray.join("|||");

    const urlParams = new URLSearchParams(window.location.search);

    const payload = {
      name: leadName,
      phone: "+" + leadPhone.replace(/\D/g, ""),
      email: leadEmail,
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "form_success",
            quiz_name: "lp-reviews",
          });
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
        }
      } else {
        alert("Виникла помилка при відправці. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Виникла помилка при відправці.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#1D1D1F] font-sans flex flex-col items-center">
      <header className="w-full max-w-6xl px-6 py-4 flex justify-between items-center relative h-[80px]">
        <div className="w-24">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} /> Назад
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0L19.5 11.5L31 15L19.5 18.5L16 30L12.5 18.5L1 15L12.5 11.5L16 0Z" fill="#FF5C00"/>
            </svg>
            <span className="font-bold text-xl tracking-tight">JustSchool</span>
        </div>

        <div className="text-lg font-bold text-[#FF5C00] w-24 text-right">
          {step <= totalSteps ? step + " / " + totalSteps : ""}
        </div>
      </header>

      <div className="w-full max-w-6xl px-6 mb-8">
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
                className="bg-[#FF5C00] h-full"
                initial={{ width: 0 }}
                animate={{ width: (step / totalSteps) * 100 + "%" }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl px-6 pb-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-10 w-full max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                {currentStep.question}
              </h1>
              {currentStep.subtitle && (
                <p className="text-lg text-gray-500 leading-relaxed font-medium">
                  {currentStep.subtitle}
                </p>
              )}
            </div>

            {currentStep.type === "choice" && currentStep.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-12">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChoice(opt.label)}
                    className={
                      "group p-6 rounded-2xl border-2 transition-all duration-200 text-left flex items-center gap-4 " +
                      (answers[step] === opt.label 
                        ? "border-[#FF5C00] bg-[#FFF8F4] shadow-md" 
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm")
                    }
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
                    <span className="font-bold text-lg">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {currentStep.bottomBlock && (
                <div className="w-full bg-[#F5F5FF] rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                    {currentStep.bottomBlock.type === "testimonial" ? (
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={currentStep.bottomBlock.photoUrl} 
                                    alt={currentStep.bottomBlock.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">{currentStep.bottomBlock.name}</h4>
                                    <p className="text-gray-400 text-sm">{currentStep.bottomBlock.title}</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-1 mb-3">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <Star key={i} size={18} fill={i < (currentStep.bottomBlock.stars || 5) ? "#FFC107" : "none"} stroke="#FFC107" />
                                    ))}
                                    <span className="ml-2 font-bold text-[#FFC107]">5.0</span>
                                </div>
                                <p className="text-lg font-medium leading-relaxed italic text-gray-700">
                                    {"\"" + currentStep.bottomBlock.text + "\""}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                                <BookOpen className="text-blue-500" size={32} />
                            </div>
                            <div>
                                <h4 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-1">
                                    {currentStep.bottomBlock.title}
                                </h4>
                                <p className="text-xl font-bold leading-tight">
                                    {currentStep.bottomBlock.text}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {currentStep.type === "loader" && (
              <div className="w-full max-w-md flex flex-col items-center py-12">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-[#FF5C00] rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#FF5C00]">
                    {loaderProgress}%
                  </div>
                </div>
                <div className="space-y-4 w-full">
                  {currentStep.points && currentStep.points.map((p, i) => (
                    <div 
                      key={p} 
                      className={"flex items-center gap-3 transition-opacity duration-300 " + (loaderProgress > i * 25 ? "opacity-100" : "opacity-30")}
                    >
                      <CheckCircle2 size={20} className="text-[#FF5C00]" />
                      <span className="font-bold">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(currentStep.type === "lead_name" || currentStep.type === "lead_contacts") && (
              <div className="w-full max-w-md bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-xl">
                {currentStep.type === "lead_name" ? (
                  <div className="space-y-6">
                    <input
                      type="text"
                      placeholder={currentStep.form && currentStep.form.name_placeholder}
                      className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-[#FF5C00] transition-all text-lg font-bold text-center"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                    />
                    <button
                      onClick={() => { if (leadName.trim().length >= 2) setStep(step + 1) }}
                      disabled={leadName.trim().length < 2}
                      className="w-full py-4 bg-[#FF5C00] text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-30 uppercase tracking-wider"
                    >
                      Далі
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder={currentStep.form && currentStep.form.email_placeholder}
                      required
                      className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-[#FF5C00] transition-all text-lg font-bold text-center"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder={currentStep.form && currentStep.form.phone_placeholder}
                      required
                      className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-[#FF5C00] transition-all text-lg font-bold text-center"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(formatPhoneNumber(e.target.value))}
                      maxLength={19}
                    />
                    <button
                      type="submit"
                      disabled={leadPhone.replace(/\D/g, "").length !== 12}
                      className="w-full py-4 bg-[#FF5C00] text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-30 uppercase tracking-wider"
                    >
                      Отримати результат
                    </button>
                    <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest pt-4">
                      {currentStep.guarantee_text}
                    </p>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{"body { background: #FFFFFF; -webkit-font-smoothing: antialiased; } input::placeholder { color: #D1D1D6; font-weight: 700; }"}</style>
    </div>
  );
}
