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
      // CHANGED: We now send to our internal API endpoint which handles both NocoDB and n8n
      // The base path is configured in vite.config.ts as /eng_adult/, but the API function is at root /api/submit
      // When deployed on Vercel, /api/submit works globally.
      // However, since we are under /eng_adult/, let's try absolute path.
      
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.redirectUri) {
        window.location.href = result.redirectUri;
      }
    } catch (err) {
      console.error("Submission failed:", err);
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
        window.fbq('track', 'Lead');
      }
      submitToCRM(newAnswers);
    }

    setStep((prev) => prev + 1);
  };

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
        {step > 1 && (
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
