import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import {
  ADULT_QUESTIONS,
  CHILD_QUESTIONS,
  COMMON_QUESTIONS,
  REVIEWS,
} from './data';
import logoWhite from './assets/logo-horizontal-white.svg';
import bannerDesk from './assets/banner-desk.png';
import bannerMob from './assets/banner-mob.png';

declare global {
  interface Window {
    fbq?: any;
    dataLayer?: any[];
  }
}

type Audience = 'adult' | 'child';

export default function App() {
  // ─── State ───────────────────────────────────────────────
  const [step, setStep] = useState<number>(0); // 0 = Hero, 1 = Audience, 2..7 = Questions, 8 = Interstitial, 9 = Loader, 10 = LeadForm
  const [audience, setAudience] = useState<Audience>('adult');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAspects, setMultiAspects] = useState<string[]>([]);

  // Contact Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [rawPhone, setRawPhone] = useState<string>('');
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Loader & GEO State
  const [loaderProgress, setLoaderProgress] = useState<number>(0);
  const [geoCountry, setGeoCountry] = useState<string>('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // 1. GEO Detection & URL Sync on mount
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set(
          'leadType',
          audience === 'child' ? 'english-for-children' : 'english-for-adults'
        );
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info fetch error:', err));
  }, []);

  // Sync leadType when audience changes
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(
        'leadType',
        audience === 'child' ? 'english-for-children' : 'english-for-adults'
      );
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, [audience]);

  // 2. Step Reach Tracking in GTM dataLayer
  useEffect(() => {
    const dl = (window.dataLayer = window.dataLayer || []);
    dl.push({
      event: 'quiz_step_reach',
      quiz_name: 'eng-adult-black-friday',
      step_number: step,
      audience: audience,
      step_name:
        step === 0
          ? 'hero_screen'
          : step === 1
          ? 'audience_selection'
          : step === 8
          ? 'clubs_value_interstitial'
          : step === 9
          ? 'loader_calculation'
          : step === 10
          ? 'lead_form_gate'
          : `question_${step}`,
    });
  }, [step, audience]);

  // 3. Loader Auto-Advance on Step 9
  useEffect(() => {
    if (step !== 9) return;
    setLoaderProgress(0);

    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(10);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 450);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [step]);

  // ─── Handlers ────────────────────────────────────────────
  const handleStartFromHero = (chosenAudience?: Audience) => {
    if (chosenAudience) {
      setAudience(chosenAudience);
      setStep(2); // Skip audience question if selected from Hero
    } else {
      setStep(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAudience = (type: Audience) => {
    setAudience(type);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSingleAnswer = (questionKey: string, optionLabel: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: optionLabel }));
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMultiAspect = (label: string) => {
    setMultiAspects((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleMultiSubmit = () => {
    if (multiAspects.length === 0) return;
    setAnswers((prev) => ({ ...prev, aspects: multiAspects.join(', ') }));
    setStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 2 && answers['audience_picked_on_hero']) {
      setStep(0);
    } else if (step > 0) {
      setStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Lead Form Submission ────────────────────────────────
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim() || !email.trim() || !isPhoneValid) return;

    setIsSubmitting(true);

    const qaParts: string[] = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      `[BLACK FRIDAY 2026]`,
      `Пропозиція: 48 уроків (1 670 грн/міс) + Цілий рік розмовних клубів у подарунок`,
      `Аудиторія: ${audience === 'adult' ? 'Дорослий (для себе)' : 'Дитина'}`,
      `Вік: ${answers.age || 'Не вказано'}`,
      `Рівень/Ситуація: ${answers.level || answers.situation || 'Не вказано'}`,
      `Головна мета/Пріоритет: ${answers.goal || answers.priority || 'Не вказано'}`,
      `Навички для покращення: ${answers.aspects || 'Не вказано'}`,
      `Інтенсивність: ${answers.intensity || '2 рази на тиждень'}`,
      `Зручний час: ${answers.schedule || 'Гнучкий'}`,
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const activeLeadType =
      urlParams.get('leadType') ||
      (audience === 'child' ? 'english-for-children' : 'english-for-adults');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaParts.join(' ||| '),
      dialogueUrl: window.location.href,
      dialogueName: 'Black Friday 2026 English Year Quiz',
      dialogueId: 'eng_black_friday_2026',
      utm_source: urlParams.get('utm_source') || 'esputnik',
      utm_medium: urlParams.get('utm_medium') || 'promo_email',
      utm_campaign: urlParams.get('utm_campaign') || 'black_friday_year',
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: 'English',
      subject: 'English',
      lead_type: activeLeadType,
      Lead_type: activeLeadType,
    };

    try {
      // 7-second fallback redirect in case network hangs
      const fallbackTimer = setTimeout(() => {
        window.location.href = 'https://justschool.me/uk/onboarding';
      }, 7000);

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearTimeout(fallbackTimer);

      if (res.ok) {
        const dl = (window.dataLayer = window.dataLayer || []);
        dl.push({
          event: 'form_success',
          quiz_name: 'eng-adult-black-friday',
          audience: audience,
        });

        const result = await res.json();
        window.location.href =
          result?.redirectUri || 'https://justschool.me/uk/onboarding';
      } else {
        window.location.href = 'https://justschool.me/uk/onboarding';
      }
    } catch (err) {
      console.error('Submission error:', err);
      window.location.href = 'https://justschool.me/uk/onboarding';
    } finally {
      setIsSubmitting(false);
    }
  };

  // Questions configuration based on audience
  const currentQuestions = audience === 'adult' ? ADULT_QUESTIONS : CHILD_QUESTIONS;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-between selection:bg-[#FF3D2E] selection:text-white relative overflow-hidden font-sans">
      {/* ─── Top Marquee Ticker ─── */}
      <div className="bg-[#FF3D2E] py-2 px-3 overflow-hidden select-none border-b border-red-700/50">
        <div className="animate-marquee whitespace-nowrap text-xs font-black tracking-widest uppercase text-black flex items-center gap-8">
          <span>🖤 Black Friday 2026</span>
          <span>•</span>
          <span>Рік англійської — 1 670 грн/місяць</span>
          <span>•</span>
          <span>Рік розмовних клубів у подарунок</span>
          <span>•</span>
          <span>Вигода 26 000+ грн</span>
          <span>•</span>
          <span>48 індивідуальних уроків</span>
          <span>•</span>
          <span>🖤 Black Friday 2026</span>
          <span>•</span>
          <span>Рік англійської — 1 670 грн/місяць</span>
          <span>•</span>
          <span>Рік розмовних клубів у подарунок</span>
          <span>•</span>
          <span>Вигода 26 000+ грн</span>
        </div>
      </div>

      {/* ─── Header ─── */}
      <header className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-neutral-800/80">
        <a href="#hero" onClick={() => setStep(0)} className="block">
          <img
            src={logoWhite}
            alt="JustSchool"
            className="h-7 sm:h-8 w-auto hover:opacity-90 transition-opacity"
          />
        </a>

        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="tel:0800335481"
            className="text-xs sm:text-sm font-bold text-neutral-300 hover:text-[#FF3D2E] transition-colors flex items-center gap-1.5"
          >
            <span className="text-[#FF3D2E]">📞</span> 080 033 54 81
            <span className="hidden sm:inline text-xs font-normal text-neutral-500">
              (безкоштовно)
            </span>
          </a>

          {step > 0 && step < 9 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              ← Назад
            </button>
          )}
        </div>
      </header>

      {/* ─── Progress Bar (for Quiz Steps 1–7) ─── */}
      {step >= 1 && step <= 7 && (
        <div className="w-full max-w-xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-2">
            <span>Крок {step} з 7</span>
            <span className="text-[#FF3D2E]">
              {Math.round((step / 7) * 100)}% заповнено
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-[#FF3D2E] rounded-full transition-all duration-300 shadow-sm shadow-red-500/50"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col justify-center">
        {/* ══════════════════════════════════════════════════
            STEP 0: HERO & VALUE OFFER (From Email)
        ══════════════════════════════════════════════════ */}
        {step === 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Banner from Email */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative">
              <picture>
                <source media="(max-width: 640px)" srcSet={bannerMob} />
                <img
                  src={bannerDesk}
                  alt="Black Friday в JustSchool: рік англійської"
                  className="w-full h-auto object-cover block"
                />
              </picture>
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-yellow-500/40 text-yellow-400 text-xs font-black uppercase tracking-wider shadow-lg">
                  ⚡ Знижка діє обмежений час
                </span>
              </div>
            </div>

            {/* Hero Offer & Price Box */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-black tracking-wider text-yellow-400 uppercase">
                🖤 ГОЛОВНА ПРОПОЗИЦІЯ РОКУ
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Цілий рік англійської
              </h1>

              <div className="flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg text-neutral-500 font-semibold line-through">
                  2 276 грн
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-7xl font-black text-[#FF3D2E] tracking-tight drop-shadow-md">
                    1 670 грн
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-neutral-300">
                    / місяць
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
                Для дитини чи для себе — 48 уроків з викладачем і{' '}
                <strong className="text-white underline decoration-[#FF3D2E] decoration-2 underline-offset-4">
                  цілий рік розмовних клубів у подарунок
                </strong>
                . Найвигідніший спосіб заговорити англійською без страху.
              </p>
            </div>

            {/* Receipt Card / Чек Black Friday (Exact from Email) */}
            <div className="max-w-xl mx-auto bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-neutral-200">
              <div className="text-center pb-4 border-b border-dashed border-neutral-300">
                <span className="text-xs font-extrabold tracking-widest uppercase text-neutral-500">
                  🧾 Ваш розрахунковий чек Black Friday
                </span>
              </div>

              <div className="py-4 space-y-3.5 text-sm sm:text-base">
                <div className="flex justify-between items-center py-1 border-b border-dashed border-neutral-200">
                  <span className="font-bold flex items-center gap-2">
                    📚 48 уроків з викладачем
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 line-through mr-1.5">
                      27 312 грн
                    </span>
                    <strong className="text-neutral-900 font-black">
                      20 018 грн
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-dashed border-neutral-200">
                  <span className="font-bold flex items-center gap-2">
                    🗣 Рік розмовних клубів (52 тижні)
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 line-through mr-1.5">
                      19 200 грн
                    </span>
                    <strong className="text-[#FF3D2E] font-black uppercase text-xs sm:text-sm bg-red-100 px-2 py-0.5 rounded-md">
                      ПОДАРУНОК 🎁
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-baseline">
                  <span className="font-black text-sm uppercase tracking-wide text-neutral-800">
                    ВАША ЗАГАЛЬНА ВИГОДА:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FF3D2E]">
                    26 000+ грн
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 text-center space-y-1 bg-neutral-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <p className="text-xs text-neutral-600 font-semibold">
                  20 018 грн за повний річний курс = <strong>1 670 грн на місяць</strong>
                </p>
                <p className="text-xs text-neutral-500">
                  ☕ Це близько <strong>55 грн на день</strong> — менше, ніж чашка кави
                </p>
              </div>
            </div>

            {/* Audience Pickers (Для дитини чи для дорослих) */}
            <div className="max-w-xl mx-auto space-y-3">
              <h3 className="text-center text-sm font-extrabold uppercase tracking-wider text-neutral-400 mb-1">
                Оберіть, хто буде навчатися:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleStartFromHero('adult')}
                  className="p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all text-left flex flex-col justify-between group shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🧑‍💼</span>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                        Для дорослих
                      </h4>
                      <span className="text-xs text-neutral-400 font-medium">
                        (від 18 років)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Для роботи, кар'єри, подорожей та щотижнева розмовна практика без страху.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-bold text-[#FF3D2E]">
                    Почати підбір →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartFromHero('child')}
                  className="p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all text-left flex flex-col justify-between group shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🧒</span>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                        Для дитини
                      </h4>
                      <span className="text-xs text-neutral-400 font-medium">
                        (4–17 років)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Рік спокійного прогресу з викладачем, підтягування оцінок і клуби з однолітками.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-bold text-[#FF3D2E]">
                    Почати підбір →
                  </span>
                </button>
              </div>
            </div>

            {/* Why Clubs Value Callout Box */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#121212] border-l-4 border-yellow-400 border border-neutral-800 text-left space-y-1.5">
              <h4 className="text-sm font-black text-yellow-400 flex items-center gap-2">
                🎁 Чому клуби — це головний бонус Black Friday?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                На індивідуальних уроках ви розбираєте граматику та правила, а в розмовних
                клубах — починаєте говорити! Цілий рік живої групової практики зніме мовний
                бар'єр назавжди.
              </p>
            </div>

            {/* Bottom Primary CTA Button */}
            <div className="max-w-xl mx-auto text-center pt-2">
              <button
                type="button"
                onClick={() => handleStartFromHero()}
                className="w-full py-5 px-6 rounded-2xl bg-[#FF3D2E] hover:bg-[#E03022] text-white font-black text-lg sm:text-xl uppercase tracking-wider transition-all shadow-xl shadow-red-600/30 transform hover:-translate-y-0.5 active:translate-y-0 bf-glow-btn flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Зафіксувати ціну 1 670 грн/міс</span>
                <span className="text-2xl">→</span>
              </button>
              <p className="text-xs text-neutral-500 mt-2">
                Залишилося лише 24 промо-пакети на поточний потік
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 1: AUDIENCE SELECTOR (Fallback if not picked on Hero)
        ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 1 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Хто буде вивчати англійську?
              </h2>
              <p className="text-sm text-neutral-400">
                Це потрібно для адаптації програми та підбору відповідного викладача
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => handleSelectAudience('adult')}
                className="w-full p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] transition-all flex items-center gap-4 text-left group"
              >
                <span className="text-3xl sm:text-4xl">🧑‍💼</span>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-white group-hover:text-[#FF3D2E] transition-colors">
                    Для себе (Дорослі)
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Англійська для роботи, кар'єри, подорожей або розмовна практика
                  </p>
                </div>
                <span className="text-neutral-500 group-hover:text-white transition-colors text-xl font-bold">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAudience('child')}
                className="w-full p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] transition-all flex items-center gap-4 text-left group"
              >
                <span className="text-3xl sm:text-4xl">🧒</span>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-white group-hover:text-[#FF3D2E] transition-colors">
                    Для моєї дитини
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Для дошкільнят, школярів чи підлітків (4–17 років)
                  </p>
                </div>
                <span className="text-neutral-500 group-hover:text-white transition-colors text-xl font-bold">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 2: AGE
        ══════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 2 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {currentQuestions.age.question}
              </h2>
              <p className="text-sm text-neutral-400">
                {currentQuestions.age.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestions.age.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleAnswer('age', opt.label)}
                  className="p-4 sm:p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all flex items-center gap-3.5 text-left group cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                  <span className="font-black text-sm sm:text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 3: LEVEL / SITUATION
        ══════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 3 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {audience === 'adult'
                  ? ADULT_QUESTIONS.level.question
                  : CHILD_QUESTIONS.situation.question}
              </h2>
              <p className="text-sm text-neutral-400">
                {audience === 'adult'
                  ? ADULT_QUESTIONS.level.subtitle
                  : CHILD_QUESTIONS.situation.subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {(audience === 'adult'
                ? ADULT_QUESTIONS.level.options
                : CHILD_QUESTIONS.situation.options
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    handleSingleAnswer(
                      audience === 'adult' ? 'level' : 'situation',
                      opt.label
                    )
                  }
                  className="w-full p-4 sm:p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all flex items-center gap-3.5 text-left group cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-black text-sm sm:text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                      {opt.label}
                    </div>
                    {opt.subtitle && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="text-neutral-600 group-hover:text-white transition-colors">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 4: GOAL / PRIORITY
        ══════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 4 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {audience === 'adult'
                  ? ADULT_QUESTIONS.goal.question
                  : CHILD_QUESTIONS.priority.question}
              </h2>
              <p className="text-sm text-neutral-400">
                {audience === 'adult'
                  ? ADULT_QUESTIONS.goal.subtitle
                  : CHILD_QUESTIONS.priority.subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {(audience === 'adult'
                ? ADULT_QUESTIONS.goal.options
                : CHILD_QUESTIONS.priority.options
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    handleSingleAnswer(
                      audience === 'adult' ? 'goal' : 'priority',
                      opt.label
                    )
                  }
                  className="w-full p-4 sm:p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all flex items-center gap-3.5 text-left group cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-black text-sm sm:text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                      {opt.label}
                    </div>
                    {opt.subtitle && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="text-neutral-600 group-hover:text-white transition-colors">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 5: ASPECTS (MULTI-SELECT)
        ══════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 5 з 7 • Можна обрати декілька
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {audience === 'adult'
                  ? ADULT_QUESTIONS.aspects.question
                  : CHILD_QUESTIONS.aspects.question}
              </h2>
              <p className="text-sm text-neutral-400">
                Позначте всі навички, на яких слід зробити особливий акцент
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {(audience === 'adult'
                ? ADULT_QUESTIONS.aspects.options
                : CHILD_QUESTIONS.aspects.options
              ).map((opt) => {
                const isSelected = multiAspects.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiAspect(opt.label)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E1212] border-[#FF3D2E] text-white shadow-lg shadow-red-500/20'
                        : 'bg-[#121212] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="font-black text-sm sm:text-base">
                        {opt.label}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'border-[#FF3D2E] bg-[#FF3D2E] text-white'
                          : 'border-neutral-600 bg-transparent'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3">
              <button
                type="button"
                disabled={multiAspects.length === 0}
                onClick={handleMultiSubmit}
                className="w-full py-4.5 rounded-2xl bg-[#FF3D2E] hover:bg-[#E03022] text-white font-black text-base uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Продовжити ({multiAspects.length} обрано) →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 6: INTENSITY
        ══════════════════════════════════════════════════ */}
        {step === 6 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 6 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {COMMON_QUESTIONS.intensity.question}
              </h2>
              <p className="text-sm text-neutral-400">
                {COMMON_QUESTIONS.intensity.subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {COMMON_QUESTIONS.intensity.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleAnswer('intensity', opt.label)}
                  className="w-full p-4 sm:p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all flex items-center gap-3.5 text-left group cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-black text-sm sm:text-base text-white group-hover:text-[#FF3D2E] transition-colors">
                      {opt.label}
                    </div>
                    {opt.subtitle && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="text-neutral-600 group-hover:text-white transition-colors">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 7: SCHEDULE
        ══════════════════════════════════════════════════ */}
        {step === 7 && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3D2E]">
                Крок 7 з 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {COMMON_QUESTIONS.schedule.question}
              </h2>
              <p className="text-sm text-neutral-400">
                {COMMON_QUESTIONS.schedule.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {COMMON_QUESTIONS.schedule.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleAnswer('schedule', opt.label)}
                  className="p-4 sm:p-5 rounded-2xl bg-[#121212] border-2 border-neutral-800 hover:border-[#FF3D2E] hover:bg-[#181818] transition-all flex items-center gap-3 text-left group cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                  <span className="font-black text-sm text-white group-hover:text-[#FF3D2E] transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 8: VALUE INTERSTITIAL & REVIEWS
        ══════════════════════════════════════════════════ */}
        {step === 8 && (
          <div className="max-w-2xl mx-auto w-full space-y-6 animate-fade-in text-center">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-wider">
                🎁 Головний бонус вашого пакета
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Цілий рік розмовних клубів (52 тижні) — 0 грн замість 19 200 грн
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto">
                На індивідуальних уроках ви розбираєте граматику з викладачем, а в клубах —
                спілкуєтеся наживо. Це саме те, що перетворює знання на вільне впевнене мовлення!
              </p>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-neutral-800">
                <div className="text-xl sm:text-2xl font-black text-[#FF3D2E]">17 000+</div>
                <div className="text-[11px] font-semibold text-neutral-400">активних учнів</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-neutral-800">
                <div className="text-xl sm:text-2xl font-black text-[#FF3D2E]">3.8 млн+</div>
                <div className="text-[11px] font-semibold text-neutral-400">проведених уроків</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-neutral-800">
                <div className="text-xl sm:text-2xl font-black text-[#FF3D2E]">1 700+</div>
                <div className="text-[11px] font-semibold text-neutral-400">викладачів</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-neutral-800">
                <div className="text-xl sm:text-2xl font-black text-[#FF3D2E]">4.9 / 5</div>
                <div className="text-[11px] font-semibold text-neutral-400">середня оцінка</div>
              </div>
            </div>

            {/* Reviews Carousel/Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {REVIEWS.map((rev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#121212] border border-neutral-800 flex flex-col justify-between"
                >
                  <p className="text-xs text-neutral-300 leading-relaxed italic mb-3">
                    "{rev.text}"
                  </p>
                  <div>
                    <div className="text-xs font-black text-white">{rev.name}</div>
                    <div className="text-[10px] text-neutral-500">{rev.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep(9)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#FF3D2E] hover:bg-[#E03022] text-white font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl shadow-red-600/30 bf-glow-btn cursor-pointer inline-flex items-center justify-center gap-3"
              >
                <span>Отримати мій розрахунок та план →</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 9: DYNAMIC LOADER CALCULATION
        ══════════════════════════════════════════════════ */}
        {step === 9 && (
          <div className="max-w-md mx-auto w-full text-center space-y-6 animate-fade-in py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-950/40 border-2 border-[#FF3D2E] flex items-center justify-center text-2xl animate-spin">
              ⚙️
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Формуємо ваш Black Friday пакет...
              </h3>
              <p className="text-xs text-neutral-400">
                Фіксуємо знижку 26 000+ грн та закріплюємо викладача
              </p>
            </div>

            {/* Animated percentage progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-400">
                <span>Прогрес генерації</span>
                <span className="text-[#FF3D2E]">{loaderProgress}%</span>
              </div>
              <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-[#FF3D2E] rounded-full transition-all duration-150"
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-neutral-800 text-left text-xs space-y-2.5">
              <div
                className={`flex items-center gap-2 transition-opacity ${
                  loaderProgress > 20 ? 'text-white' : 'text-neutral-600'
                }`}
              >
                <span>{loaderProgress > 20 ? '✓' : '○'}</span>
                <span>Фіксація ціни 1 670 грн/місяць замість 2 276 грн</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-opacity ${
                  loaderProgress > 50 ? 'text-white' : 'text-neutral-600'
                }`}
              >
                <span>{loaderProgress > 50 ? '✓' : '○'}</span>
                <span>Нарахування 52 тижнів розмовних клубів (0 грн)</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-opacity ${
                  loaderProgress > 80 ? 'text-white' : 'text-neutral-600'
                }`}
              >
                <span>{loaderProgress > 80 ? '✓' : '○'}</span>
                <span>Підбір розкладу під ваш обраний час</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 10: LEAD FORM GATE (With Onboarding Redirect)
        ══════════════════════════════════════════════════ */}
        {step === 10 && (
          <div className="max-w-xl mx-auto w-full bg-[#101010] border border-neutral-800 rounded-3xl p-6 sm:p-9 shadow-2xl animate-fade-in space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-950/40 border border-[#FF3D2E]/40 text-[#FF3D2E] text-xs font-black uppercase tracking-wider">
                🎉 Пропозицію зафіксовано
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Заберіть рік англійської за 1 670 грн/міс
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Введіть контактні дані для активації акційного пакету «48 уроків + Рік
                розмовних клубів у подарунок». Менеджер зв'яжеться для узгодження першого уроку.
              </p>
            </div>

            {/* Summary mini card */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
              <div className="space-y-0.5">
                <span className="text-neutral-400 block text-xs">Обрано для:</span>
                <span className="font-bold text-white">
                  {audience === 'adult' ? 'Дорослий (18+)' : 'Дитина'} • {answers.intensity || '2 рази/тижд'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 block text-xs">Ціна Black Friday:</span>
                <span className="font-black text-[#FF3D2E] text-base">
                  1 670 грн / міс
                </span>
              </div>
            </div>

            {/* Lead Form */}
            <form onSubmit={handleSubmitLead} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Ваше ім'я <span className="text-[#FF3D2E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Олена або Олександр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-800 bg-[#161616] text-white focus:border-[#FF3D2E] focus:ring-4 focus:ring-[#FF3D2E]/20 outline-none font-semibold text-base transition-all disabled:opacity-50"
                />
              </div>

              {/* Phone Input with Multi-Country Validation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Номер телефону <span className="text-[#FF3D2E]">*</span>
                </label>
                <PhoneInput
                  value={rawPhone}
                  onChange={(p, valid) => {
                    setRawPhone(p);
                    setIsPhoneValid(valid);
                  }}
                  disabled={isSubmitting}
                  initialCountry={geoCountry}
                  theme="dark"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Електронна пошта (Email) <span className="text-[#FF3D2E]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-800 bg-[#161616] text-white focus:border-[#FF3D2E] focus:ring-4 focus:ring-[#FF3D2E]/20 outline-none font-semibold text-base transition-all disabled:opacity-50"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || !isPhoneValid}
                  className="w-full py-4.5 px-6 rounded-2xl bg-[#FF3D2E] hover:bg-[#E03022] text-white font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl shadow-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bf-glow-btn flex items-center justify-center gap-2"
                >
                  <span>
                    {isSubmitting ? 'Реєструємо пропозицію...' : 'Забрати рік англійської →'}
                  </span>
                </button>
              </div>

              <div className="text-center text-[11px] text-neutral-500 pt-1">
                🔒 Ваші дані захищено. Після надсилання ви перейдете в інтерактивний кабінет студента JustSchool.
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full border-t border-neutral-900 bg-[#050505] py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-neutral-400 font-bold mb-1">
              JustSchool © {new Date().getFullYear()} • Black Friday Special Offer
            </div>
            <div className="text-[11px]">
              Онлайн-школа англійської мови для дітей та дорослих
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://justschool.me/uk/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Конфіденційність
            </a>
            <span>•</span>
            <a
              href="https://justschool.me/uk/terms-of-use"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Умови акції
            </a>
            <span>•</span>
            <a
              href="tel:0800335481"
              className="text-[#FF3D2E] hover:underline"
            >
              080 033 54 81
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
