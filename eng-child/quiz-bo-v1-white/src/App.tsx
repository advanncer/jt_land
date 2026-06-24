import React, { useState, useEffect } from "react";
import Quiz from "./Quiz";
import { quizData } from "./data";
import "./App.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTgVersion = false;

  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((data) => setIpInfo(data))
      .catch((err) => console.error("IP info error:", err));
  }, []);

  const totalSteps = quizData.length;
  const progress = step === 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;

  const submitToCRM = async (finalAnswers: Record<number, string[]>) => {
    const formStepIndex = 13;
    const formDataJson = finalAnswers[formStepIndex]?.[0];
    if (!formDataJson) return;

    setIsSubmitting(true);

    let formData = { name: "", phone: "", email: "" };
    try {
      formData = JSON.parse(formDataJson);
    } catch (e) {
      console.error("Error parsing form data", e);
      setIsSubmitting(false);
      return;
    }

    const ipString =
      "ip:" +
      (ipInfo.ip || "unknown") +
      "|country:" +
      (ipInfo.country || "unknown");
    const qaParts = [ipString];

    quizData.forEach((q) => {
      if (q.type === "form") return;
      const stepAnswers = finalAnswers[q.step];
      if (stepAnswers && stepAnswers.length > 0) {
        qaParts.push(q.question + " " + stepAnswers.join(", "));
      }
    });

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      qa: qaParts.join("|||"),
      dialogueName: "JustSchool Quiz",
      dialogueId: "unknown",
      dialogueUrl: window.location.href,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (isTgVersion) {
        setIsSubmitted(true);
        setIsSubmitting(false);
      } else {
        if (result.redirectUri) {
          window.location.href = result.redirectUri;
        } else {
          setIsSubmitted(true);
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleNextStep = (stepAnswers?: string[]) => {
    if (isSubmitting) return;
    let newAnswers = answers;
    if (stepAnswers) {
      newAnswers = { ...answers, [step]: stepAnswers };
      setAnswers(newAnswers);
    }

    if (step === 13) {
      if (window.fbq) {
        window.fbq("trackSingle", "9067851526565677", "Purchase", {
          currency: "UAH",
          value: 0,
        });
        window.fbq("trackSingle", "1033701209166819", "Purchase", {
          currency: "UAH",
          value: 0,
        });
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: "AW-11192598375/F6HqCOzpsMEcEOf-hdkp",
        });
      }
      submitToCRM(newAnswers);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">
        <div className="fixed inset-0 bg-slate-50 z-0"></div>
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse-slow"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

        <div className="w-full max-w-[480px] sm:max-w-[580px] md:max-w-[680px] bg-white relative z-10 min-h-screen shadow-2xl flex flex-col items-center justify-center p-6 text-center border-x border-slate-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Дякуємо!
            <br />
            Ми вже на зв'язку
          </h1>

          <p className="text-slate-600 text-lg mb-8 max-w-sm">
            Наш менеджер зателефонує вам найближчим часом і підбере ідеального
            репетитора з англійської саме для вашої дитини.
          </p>

          <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-xl max-w-sm flex items-center gap-4 text-left">
            <span className="text-3xl">📩</span>
            <p className="text-slate-600 text-sm">
              PDF-подарунок із корисними вправами та іграми для вивчення
              англійської буде відправлено вам на пошту{" "}
              <strong>
                {answers[13] ? JSON.parse(answers[13][0]).email : ""}
              </strong>
            </p>
          </div>

          <p className="text-slate-400 text-sm">
            Зазвичай ми зв'язуємося протягом 30 хвилин у робочий час
            (9:00–20:00).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center relative overflow-hidden font-sans selection:bg-brand-orange/30">
      <div className="fixed inset-0 bg-slate-50 z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="w-full max-w-[480px] sm:max-w-[580px] md:max-w-[680px] bg-white relative z-10 min-h-screen shadow-2xl flex flex-col border-x border-slate-100">
        {step > 1 && !isSubmitted && (
          <div className="fixed top-0 w-full max-w-[480px] sm:max-w-[580px] md:max-w-[680px] h-[4px] bg-slate-100/80 backdrop-blur-md z-[60]">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(241,102,0,0.5)]"
              style={{ width: progress + "%" }}
            ></div>
          </div>
        )}
        <Quiz
          step={step}
          onNextStep={handleNextStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default App;
