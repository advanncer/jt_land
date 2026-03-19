import React, { useState, useEffect } from "react";
import Quiz from "./Quiz";
import { quizData } from "./data";
import "./App.css";

declare global {
  interface Window {
    fbq: any;
  }
}

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx1nKIeROgLQ8MJbD6hRaBXiWItvxVthXQY3d53vVJ-hFL04fHdXwrh366SFlNTGIxBFg/exec";
const Lead_type = "Quiz_Adults";

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [geo, setGeo] = useState<string>("Unknown");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmData, setUtmData] = useState<Record<string, string>>({});

  const isTgVersion = window.location.pathname.includes("/eng_adult_tg");

  useEffect(() => {
    // 1. Збір UTM-параметрів з URL
    const params = new URLSearchParams(window.location.search);
    const utms = {
      utm_campaign: params.get("utm_campaign") || "",
      utm_source: params.get("utm_source") || "",
      creo_type: params.get("creo_type") || "",
      utm_medium: params.get("utm_medium") || "",
      campaign_id: params.get("campaign_id") || "",
      adSet_id: params.get("adSet_id") || "",
      ad_id: params.get("ad_id") || "",
      utm_id: params.get("utm_id") || "",
      utm_term: params.get("utm_term") || "",
      fbclid: params.get("fbclid") || ""
    };
    setUtmData(utms);

    // 2. Отримання Геолокації
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const geoString = [data.country_name, data.city].filter(Boolean).join("/") || "Unknown";
        setGeo(geoString);
      })
      .catch(() => {
        // Fallback, якщо API недоступний (беремо часовий пояс)
        setGeo(Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown");
      });
  }, []);

  const totalSteps = quizData.length;
  const progress = step === 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;

  const submitQuizData = async (finalAnswers: Record<number, string[]>) => {
    setIsSubmitting(true);
    const formStepIndex = 11; // Крок з реєстрацією
    const formDataJson = finalAnswers[formStepIndex]?.[0];
    
    if (!formDataJson) {
      setIsSubmitting(false);
      return;
    }

    let formData = { name: "", phone: "", email: "" };
    try {
      formData = JSON.parse(formDataJson);
    } catch (e) {
      console.error("Error parsing form data", e);
    }

    // 3. Склеюємо всі відповіді з кроків 1-9 через " | "
    const answerParts: string[] = [];
    for (let i = 1; i <= 9; i++) {
      if (finalAnswers[i] && finalAnswers[i].length > 0) {
        answerParts.push(finalAnswers[i].join(", "));
      } else {
        answerParts.push("Не відповів");
      }
    }
    const Answear = answerParts.join(" | ");

    // 4. Формуємо JSON-payload
    const payload = {
      Name: formData.name,
      Phone: formData.phone ? `'+${formData.phone.replace(/\D/g, '')}` : "",
      Email: formData.email,
      Answear: Answear,
      Geo: geo,
      ...utmData,
      URL: window.location.origin + window.location.pathname,
      Lead_type: Lead_type
    };

    try {
      // Відправка GET запиту для обходу CORS і редиректів Google Apps Script
      const queryParams = new URLSearchParams(payload as Record<string, string>).toString();
      const urlWithParams = `${GOOGLE_SHEETS_WEBHOOK_URL}?${queryParams}`;
      
      await fetch(urlWithParams, {
        method: "GET",
        mode: "no-cors"
      });

      if (window.fbq) {
        window.fbq("track", "Lead");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      // Все одно показуємо екран успіху користувачу
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = (stepAnswers?: string[]) => {
    let newAnswers = answers;
    if (stepAnswers) {
      newAnswers = { ...answers, [step]: stepAnswers };
      setAnswers(newAnswers);
    }

    if (step === 11) {
      submitQuizData(newAnswers);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  // --- RENDER: Екран подяки ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full bg-black flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">
          <div className="fixed inset-0 bg-black z-0"></div>
          <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen animate-pulse-slow"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

          <div className="w-full max-w-[480px] bg-black/80 relative z-10 min-h-screen shadow-2xl flex flex-col items-center justify-center p-6 text-center border-x border-white/5 animate-fade-in-up">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Дякуємо! Ваша заявка прийнята. 🎉</h1>
              <p className="text-gray-300 text-lg mb-8 max-w-sm">
                Наш менеджер зв'яжеться з вами найближчим часом, щоб передати матеріали та відкрити доступ до Комбо-міксу.
              </p>
              
              <a
                href="https://t.me/Just_school_me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-xs bg-[#229ED9] hover:bg-[#1A8CC3] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(34,158,217,0.3)]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Перейти в наш Telegram
              </a>
          </div>
      </div>
    );
  }

  // --- RENDER: Regular App ---
  return (
    <div className="min-h-screen w-full bg-black flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">
      <div className="fixed inset-0 bg-black z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

      <div className="w-full max-w-[480px] bg-black/80 relative z-10 min-h-screen shadow-2xl flex flex-col border-x border-white/5">
        {step > 1 && !isSubmitted && (
          <div className="fixed top-0 w-full max-w-[480px] h-[4px] bg-white/5 backdrop-blur-md z-[60]">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(241,102,0,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <Quiz step={step} onNextStep={handleNextStep} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default App;
