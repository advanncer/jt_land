import React, { useState, useEffect } from "react";
import Quiz from "./Quiz";
import { quizData } from "./data";
import "./App.css";

declare global {
  interface Window {
    fbq: any;
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if we are on the Telegram Bot Funnel version
  const isTgVersion = window.location.pathname.includes('/eng_adult_tg');

  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((data) => setIpInfo(data))
      .catch((err) => console.error("IP info error:", err));
  }, []);

  const totalSteps = quizData.length;
  const progress = step === 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;

  const submitToCRM = async (finalAnswers: Record<number, string[]>) => {
    const formStepIndex = 15;
    const formDataJson = finalAnswers[formStepIndex]?.[0];
    if (!formDataJson) return;

    let formData = { name: "", phone: "", email: "" };
    try {
      formData = JSON.parse(formDataJson);
    } catch (e) {
      console.error("Error parsing form data", e);
      return;
    }

    const ipString = `ip:${ipInfo.ip || "unknown"}|country:${ipInfo.country || "unknown"}`;
    const qaParts = [ipString];

    quizData.forEach((q) => {
      if (q.form) return;
      const stepAnswers = finalAnswers[q.step];
      if (stepAnswers && stepAnswers.length > 0) {
        qaParts.push(`${q.question} ${stepAnswers.join(", ")}`);
      }
    });

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      qa: qaParts.join("|||"),
      dialogueName: "JustSchool Quiz",
      dialogueId: "unknown",
      dialogueUrl: window.location.href
    };

    try {
      // Send to our Serverless function
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (isTgVersion) {
        // If we are on the TG funnel, do NOT redirect to the default URL.
        // Instead, we show the Thank You screen locally.
        setIsSubmitted(true);
      } else {
        // Normal behavior: redirect if n8n returns a URL
        if (result.redirectUri) {
          window.location.href = result.redirectUri;
        }
      }

    } catch (err) {
      console.error("Submission failed:", err);
      // Even on failure, if it's TG version, show the thank you screen so user isn't stuck
      if (isTgVersion) setIsSubmitted(true);
    }
  };

  const handleNextStep = (stepAnswers?: string[]) => {
    let newAnswers = answers;
    if (stepAnswers) {
      newAnswers = { ...answers, [step]: stepAnswers };
      setAnswers(newAnswers);
    }

    if (step === 15) {
      if (window.fbq) {
        // Use 'Purchase' for the main funnel, 'Lead' for the TG funnel (or keep Lead for both if desired, but request was specifically for main funnel)
        // Request: "для воронки /eng_adult замени ивент Lead на ивент Purchase"
        // Implicitly: Keep 'Lead' for /eng_adult_tg or change both? Usually these requests mean specific change.
        // Assuming: /eng_adult -> Purchase, /eng_adult_tg -> Lead (since it's a bot flow)
        
        if (isTgVersion) {
            window.fbq('track', 'Lead');
        } else {
            window.fbq('track', 'Purchase', { currency: "UAH", value: 0 }); 
        }
      }
      submitToCRM(newAnswers);
    }

    setStep((prev) => prev + 1);
  };

  // --- RENDER: Telegram Thank You Screen ---
  if (isSubmitted && isTgVersion) {
    return (
      <div className="min-h-screen w-full bg-black flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">
          {/* Backgrounds */}
          <div className="fixed inset-0 bg-black z-0"></div>
          <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen animate-pulse-slow"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

          <div className="w-full max-w-[480px] bg-black/80 relative z-10 min-h-screen shadow-2xl flex flex-col items-center justify-center p-6 text-center border-x border-white/5 animate-fade-in-up">
              
              <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">Майже готово!</h1>
              
              <p className="text-gray-300 text-lg mb-8 max-w-sm">
                Оберіть мессенджер, щоб завершити реєстрацію
              </p>

              <a 
                href="https://t.me/JustSchool_Education_Bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full max-w-xs bg-[#229ED9] hover:bg-[#1A8CC3] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(34,158,217,0.3)]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Відкрити Telegram Bot
              </a>

              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl max-w-xs">
                <p className="text-gray-400 text-sm">
                  На email відправлено доступ до платформи, де можна пройти кілька вправ без викладача.
                </p>
              </div>

          </div>
      </div>
    );
  }

  // --- RENDER: Regular App ---
  return (
    // GLOBAL WRAPPER: Centers everything, handles dark background
    <div className="min-h-screen w-full bg-black flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">

      {/* --- GLOBAL BACKGROUNDS (Outside the app container) --- */}
      <div className="fixed inset-0 bg-black z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

      {/* --- MOBILE APP CONTAINER --- */}
      {/* This simulates the phone screen on desktop */}
      <div className="w-full max-w-[480px] bg-black/80 relative z-10 min-h-screen shadow-2xl flex flex-col border-x border-white/5">

        {/* Fixed Progress Bar (Scoped to container width) */}
        {step > 1 && !isSubmitted && (
          <div className="fixed top-0 w-full max-w-[480px] h-[4px] bg-white/5 backdrop-blur-md z-[60]">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(241,102,0,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Content Area */}
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
