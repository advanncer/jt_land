import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import { QUIZ_QUESTIONS } from './data';
import { CuteGhost, FlyingBat, SpiderWeb, WitchCauldron, WitchHat, HangingSpider } from './HalloweenDecor';
import './index.css';

const logoWhite = '/assets/logo-horizontal-white.svg';

declare global {
  interface Window {
    fbq?: any;
    dataLayer?: any[];
  }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepHistory, setStepHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [selectedCourse, setSelectedCourse] = useState<string>('Англійська для дорослих');
  const [leadType, setLeadType] = useState<string>('english-for-adults');
  const [geoCountry, setGeoCountry] = useState<string>('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 1. GEO detection & leadType URL sync on mount
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', 'english-for-adults');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info error:', err));
  }, []);

  // 2. Track step reach in GTM dataLayer
  useEffect(() => {
    const dl = window.dataLayer || [];
    window.dataLayer = dl;
    dl.push({
      event: 'quiz_step_reach',
      quiz_name: 'blogger-halloween',
      step_number: currentStep,
      course: selectedCourse,
    });
  }, [currentStep, selectedCourse]);

  // Estimate branch length & progress
  const getBranchProgress = () => {
    if (currentStep === 1) return 10;
    if (currentStep === 32) return 95;
    // We are on questions 2-31
    const historyCount = stepHistory.length;
    const progress = Math.min(85, 20 + historyCount * 10);
    return progress;
  };

  // Back button handler
  const handleGoBack = () => {
    if (stepHistory.length === 0 || isSubmitting || isRedirecting) return;
    const prev = stepHistory[stepHistory.length - 1];
    setStepHistory((prevHistory) => prevHistory.slice(0, -1));
    setCurrentStep(prev);
  };

  // Step Answer Handler
  const handleAnswer = (answer: string | string[], nextStepNumber?: number) => {
    const arrAnswer = Array.isArray(answer) ? answer : [answer];
    setAnswers((prev) => ({ ...prev, [currentStep]: arrAnswer }));

    // If selecting course on Step 1, update course name & leadType
    if (currentStep === 1) {
      const chosen = arrAnswer[0];
      setSelectedCourse(chosen);
      let newLeadType = 'english-for-adults';

      if (chosen.includes('Англійська для дітей')) {
        newLeadType = 'english-for-children';
      } else if (chosen.includes('Програмування')) {
        newLeadType = 'programming-for-children';
      } else if (chosen.includes('Математика')) {
        newLeadType = 'math-for-children';
      }

      setLeadType(newLeadType);

      try {
        const url = new URL(window.location.href);
        url.searchParams.set('leadType', newLeadType);
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }

    if (nextStepNumber) {
      setStepHistory((prev) => [...prev, currentStep]);
      setCurrentStep(nextStepNumber);
    }
  };

  // Form Submission Handler
  const handleSubmitForm = async (formData: { name: string; phone: string; email: string }) => {
    if (isSubmitting || isRedirecting) return;
    setIsSubmitting(true);

    // Client-side fbq Purchase/Lead disabled to match GoodPromo (GP) standard:
    // Conversions are sent server-side via n8n CAPI on /api/submit.

    // Build QA formatted string
    const ipString = `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`;
    const qaParts = [ipString, `Курс: ${selectedCourse}`];

    Object.entries(answers).forEach(([stepNum, ansList]) => {
      const qObj = QUIZ_QUESTIONS[parseInt(stepNum, 10)];
      if (qObj && !qObj.form && ansList.length > 0) {
        qaParts.push(`${qObj.question}: ${ansList.join(', ')}`);
      }
    });

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      qa: qaParts.join('|||'),
      Lead_type: leadType,
      lead_type: leadType,
      dialogueName: 'Blogger / Halloween Sale Quiz',
      dialogueId: 'blogger_halloween',
      dialogueUrl: window.location.href,
    };

    setIsRedirecting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const dl = window.dataLayer || [];
        window.dataLayer = dl;
        dl.push({
          event: 'form_success',
          quiz_name: 'blogger-halloween',
          course: selectedCourse,
        });
      }

      const result = await response.json().catch(() => ({}));

      // Redirect to onboarding
      const targetUrl = result.redirectUri || 'https://justschool.me/uk/onboarding';
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1200);
    } catch (err) {
      console.error('Submission failed, redirecting to fallback onboarding:', err);
      setTimeout(() => {
        window.location.href = 'https://justschool.me/uk/onboarding';
      }, 1500);
    }
  };

  const question = QUIZ_QUESTIONS[currentStep] || QUIZ_QUESTIONS[1];
  const progressVal = getBranchProgress();

  return (
    <div className="min-h-screen w-full bg-[#0b0e14] text-white flex justify-center relative overflow-hidden font-sans selection:bg-[#8ee53f] selection:text-black">
      {/* --- Ambient Background Lights & Effects --- */}
      <div className="fixed inset-0 bg-[#0b0e14] z-0" />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#8ee53f]/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 bg-[#ff7a00]/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 bg-[#3a1259]/35 rounded-full blur-[130px] pointer-events-none" />

      {/* Spiderwebs in top corners */}
      <SpiderWeb className="fixed top-0 left-0" />
      <SpiderWeb className="fixed top-0 right-0" flip />

      {/* Floating Ghost (Left) */}
      <div className="hidden lg:block fixed left-6 top-32 z-10 animate-ghost pointer-events-none">
        <CuteGhost />
      </div>

      {/* Flying Bat (Right) */}
      <div className="hidden lg:block fixed right-8 top-28 z-10 animate-bat pointer-events-none">
        <FlyingBat />
      </div>

      {/* --- Main App Container (Mobile & Desktop Phone Simulator) --- */}
      <div className="w-full max-w-[560px] bg-[#0e131d]/90 relative z-10 min-h-screen shadow-2xl flex flex-col border-x border-white/10 backdrop-blur-md overflow-hidden">
        {/* Corner Spiderwebs in container */}
        <div className="absolute top-0 right-0 pointer-events-none z-10">
          <SpiderWeb className="w-14 h-14 sm:w-16 sm:h-16 opacity-40 -scale-x-100" />
        </div>
        <div className="absolute top-0 left-0 pointer-events-none z-10">
          <SpiderWeb className="w-14 h-14 sm:w-16 sm:h-16 opacity-40" />
        </div>

        {/* Cute Hanging Spider on Silk Thread - VISIBLE ON MOBILE */}
        <div className="absolute top-0 right-3 sm:right-5 z-30 animate-spider pointer-events-none drop-shadow-[0_2px_10px_rgba(142,229,63,0.4)]">
          <HangingSpider className="w-8 h-14 sm:w-10 sm:h-16" />
        </div>

        {/* Progress Bar */}
        {!isRedirecting && (
          <div className="sticky top-0 w-full h-[5px] bg-white/5 backdrop-blur-md z-30">
            <div
              className="h-full bg-gradient-to-r from-[#ff7a00] via-[#ff9214] to-[#8ee53f] transition-all duration-500 ease-out shadow-[0_0_15px_rgba(142,229,63,0.8)]"
              style={{ width: `${progressVal}%` }}
            />
          </div>
        )}

        {/* Header */}
        <header className="w-full px-5 py-4 border-b border-white/10 flex items-center justify-between relative z-20">
          {/* Back button or spacer */}
          <div className="w-10">
            {stepHistory.length > 0 && !isRedirecting && (
              <button
                type="button"
                onClick={handleGoBack}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Назад"
              >
                ←
              </button>
            )}
          </div>

          {/* Logo with witch hat */}
          <div className="flex items-center gap-1.5 relative">
            <div className="relative">
              <img src={logoWhite} alt="JustSchool" className="h-6 sm:h-7 w-auto object-contain" />
              <div className="absolute -top-3.5 -left-2.5 transform -rotate-12 pointer-events-none">
                <WitchHat />
              </div>
            </div>
          </div>

          {/* Halloween Sale Mini Badge (positioned to leave room for hanging spider) */}
          <div className="flex items-center justify-end pr-6 sm:pr-8">
            <span className="px-2.5 py-1 rounded-full bg-[#8ee53f]/20 border border-[#8ee53f]/40 text-[#8ee53f] text-xs font-bold font-halloween tracking-wider uppercase shadow-[0_0_10px_rgba(142,229,63,0.3)]">
              SALE -50%
            </span>
          </div>
        </header>

        {/* Promo Top Strip (Matching SMM Creative) with Mobile-Visible Cute Ghost */}
        {!isRedirecting && (
          <div className="w-full px-4 sm:px-5 pt-5 pb-2 relative z-20">
            {/* Cute Ghost floating visibly on mobile right above the promo banner */}
            <div className="absolute -top-4 left-2 sm:left-3 z-30 animate-ghost pointer-events-none drop-shadow-[0_0_15px_rgba(142,229,63,0.5)]">
              <CuteGhost className="w-12 h-14 sm:w-16 sm:h-20" />
            </div>

            <div className="w-full py-2.5 pl-12 sm:pl-16 pr-3.5 rounded-2xl bg-gradient-to-r from-[#1f0e30] via-[#122312] to-[#251508] border border-[#8ee53f]/30 flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(142,229,63,0.15)] relative overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl">🎃</span>
                <span className="text-[11px] sm:text-sm font-bold text-white uppercase tracking-wide">
                  SPECIAL OFFER: <span className="text-[#8ee53f] font-halloween text-sm sm:text-base">HALLOWEEN SALE</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#ff9e3b] font-bold whitespace-nowrap bg-[#ff7a00]/15 px-2 py-0.5 rounded-full border border-[#ff7a00]/30">
                на усі курси
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 px-5 py-6 flex flex-col justify-center">
          {isRedirecting ? (
            /* Redirecting Animation Screen */
            <div className="w-full flex flex-col items-center justify-center text-center py-12 animate-fadeIn">
              <div className="relative mb-6 animate-ghost">
                <WitchCauldron />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Зачекайте, будь ласка... 🎃
              </h2>
              <p className="text-white/70 text-base max-w-sm mb-6">
                Виконується переадресація в Особистий кабінет JustSchool
              </p>
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-[#ff7a00] to-[#8ee53f] animate-pulse" />
              </div>
            </div>
          ) : (
            <Quiz
              currentQuestion={question}
              onAnswer={handleAnswer}
              answers={answers}
              geoCountry={geoCountry}
              isSubmitting={isSubmitting}
              onSubmitForm={handleSubmitForm}
              selectedCourseName={selectedCourse}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full px-5 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-2">
          <span>© JustSchool, {new Date().getFullYear()}</span>
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8ee53f] animate-pulse" />
            <span>Хелловін знижка активна</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
