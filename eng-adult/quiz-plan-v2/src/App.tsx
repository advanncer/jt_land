import { useState, useEffect } from 'react';
import { STEPS, WORDS } from './data';
import { PhoneInput } from './PhoneInput';
import logoBlack from './assets/logo-horizontal-black.svg';
import logoSticker from './assets/logo-sticker.svg';
import burstSvg from './assets/brand/burst.svg';
import ringsSvg from './assets/brand/rings.svg';
import chevronSvg from './assets/brand/chevron.svg';
import crossSvg from './assets/brand/cross.svg';

const PROGRESS_STEPS = [2, 3, 4, 5, 6, 8, 10, 11];

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [animKey, setAnimKey] = useState(0);

  // ─── GEO detection & Auto leadType in URL ─────────────────
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', 'english-for-adults');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    fetch('https://ipinfo.io/json')
      .then(r => r.json())
      .then(d => {
        if (d?.country) setGeoCountry(d.country);
      })
      .catch(() => {});
  }, []);

  const currentStepData = STEPS.find(s => s.id === step);

  // ─── GTM step tracking ───────────────────────────────────
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'quiz_step_reach',
      quiz_name: 'eng-adult-quiz-plan-v2',
      step_number: step,
      step_type: currentStepData?.type || 'unknown',
      step_title: currentStepData?.question || currentStepData?.title || 'unknown',
    });
  }, [step, currentStepData]);

  // ─── Loader step logic ───────────────────────────────────
  useEffect(() => {
    if (step !== 12) return;
    setLoaderProgress(0);
    const interval = setInterval(() => {
      setLoaderProgress(prev => {
        if (prev >= 99) {
          clearInterval(interval);
          setTimeout(() => advance(), 600);
          return 100;
        }
        return Math.min(prev + 1.25, 100);
      });
    }, 32);
    return () => clearInterval(interval);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Progress Calculation ────────────────────────────────
  const progressIdx = PROGRESS_STEPS.indexOf(step);
  const progressPercent =
    progressIdx >= 0 ? Math.round(((progressIdx + 1) / PROGRESS_STEPS.length) * 100) : 0;

  // ─── Navigation Handlers ─────────────────────────────────
  const advance = () => {
    setAnimKey(k => k + 1);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setAnimKey(k => k + 1);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChoice = (label: string) => {
    setAnswers(prev => ({ ...prev, [step]: label }));
    advance();
  };

  const toggleMulti = (label: string) => {
    setMultiAnswers(prev => {
      const cur = prev[step] || [];
      return {
        ...prev,
        [step]: cur.includes(label) ? cur.filter(o => o !== label) : [...cur, label],
      };
    });
  };

  const toggleWord = (word: string) => {
    setKnownWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  // ─── Word Test Level Calculator ──────────────────────────
  const calculateWordLevel = () => {
    const count = knownWords.length;
    if (count <= 4) return 'Starter / A0-A1 (Початковий)';
    if (count <= 10) return 'Elementary / A2 (Базовий)';
    if (count <= 17) return 'Intermediate / B1 (Середній)';
    if (count <= 23) return 'Upper-Intermediate / B2 (Вище середнього)';
    return 'Advanced / C1 (Просунутий)';
  };

  // ─── Form Submission ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      alert("Будь ласка, введіть ваше ім'я");
      return;
    }
    if (!rawPhone || !isPhoneValid) {
      alert('Будь ласка, введіть коректний номер телефону');
      return;
    }

    setIsSubmitting(true);

    const qaArr: string[] = [];
    STEPS.forEach(s => {
      if (s.type === 'choice' && answers[s.id]) {
        qaArr.push(`Q${s.id} (${s.question}): ${answers[s.id]}`);
      } else if (s.type === 'multi' && multiAnswers[s.id]?.length) {
        qaArr.push(`Q${s.id} (${s.question}): ${multiAnswers[s.id].join(', ')}`);
      } else if (s.type === 'word_test') {
        qaArr.push(`Q8 (Слова): ${knownWords.length} слів відомо (${calculateWordLevel()})`);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaArr.join('|||'),
      dialogueUrl: window.location.href,
      dialogueName: 'JustSchool Adult Quiz Plan v2',
      dialogueId: '',
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: 'English',
      subject: 'English',
      lead_type: urlParams.get('leadType') || 'english-for-adults',
      Lead_type: urlParams.get('leadType') || 'english-for-adults',
    };

    try {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead');
        (window as any).fbq('track', 'Purchase', { currency: 'UAH', value: 0 });
      }

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
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: 'form_success',
          quiz_name: 'eng-adult-quiz-plan-v2',
        });
        try {
          const result = await res.json();
          window.location.href =
            result?.redirectUri || 'https://justschool.me/uk/onboarding';
        } catch {
          window.location.href = 'https://justschool.me/uk/onboarding';
        }
      } else {
        window.location.href = 'https://justschool.me/uk/onboarding';
      }
    } catch {
      window.location.href = 'https://justschool.me/uk/onboarding';
    }
  };

  const s = currentStepData || STEPS[0];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#141414] flex flex-col justify-between selection:bg-[#FFE0CA] selection:text-[#F56600]">
      {/* ─── Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0F0F0] px-4 py-3.5 transition-all">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoBlack} alt="JustSchool" className="h-6 w-auto" />
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF5EB] text-[#F56600] rounded-full border border-[#FFE0CA]">
              Adult English
            </span>
          </div>

          {/* Step Counter or Trust Badge */}
          {progressIdx >= 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#808080]">
                Крок <span className="text-[#F56600]">{progressIdx + 1}</span> з {PROGRESS_STEPS.length}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#585858]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#87D142] animate-pulse"></span>
              17 000+ учнів
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        {progressIdx >= 0 && (
          <div className="max-w-xl mx-auto mt-3">
            <div className="w-full bg-[#F0F0F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF7411] to-[#F56600] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(245,102,0,0.35)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ─── Main Content Container ────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-xl w-full mx-auto relative">
        <div key={animKey} className="animate-fade-in w-full">
          {/* Back Button */}
          {step > 1 && step !== 12 && step !== 13 && (
            <button
              onClick={back}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#808080] hover:text-[#141414] mb-6 transition-colors group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span> Назад
            </button>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 1: HERO
          ══════════════════════════════════════════════════ */}
          {s.type === 'hero' && (
            <div className="relative overflow-hidden rounded-3xl bg-[#FFF5EB] border border-[#FFE0CA] p-6 sm:p-10 shadow-sm">
              {/* Background Brand Shapes */}
              <img
                src={ringsSvg}
                alt=""
                aria-hidden="true"
                className="absolute -right-12 -top-12 w-64 h-64 opacity-15 pointer-events-none select-none"
              />
              <img
                src={burstSvg}
                alt=""
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-44 h-44 opacity-25 pointer-events-none select-none"
              />
              <img
                src={crossSvg}
                alt=""
                aria-hidden="true"
                className="absolute right-12 bottom-8 w-8 h-8 opacity-40 pointer-events-none select-none"
              />

              <div className="relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FBC59F] text-[#F56600] text-xs font-extrabold uppercase tracking-wide shadow-xs mb-6">
                  {s.social_proof}
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#141414] leading-[1.15] tracking-tight mb-4">
                  {s.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#585858] font-medium leading-relaxed max-w-md mx-auto mb-8">
                  {s.subtitle}
                </p>

                {/* Benefits Pill Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#FFE0CA] text-xs font-semibold text-[#141414]">
                    ⏱️ Всього 5 хвилин
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#FFE0CA] text-xs font-semibold text-[#141414]">
                    🎯 Точний рівень знань
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#FFE0CA] text-xs font-semibold text-[#141414]">
                    🎁 Урок у подарунок
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={advance}
                  className="js-btn-primary w-full py-4 text-base sm:text-lg font-bold"
                >
                  {s.cta} →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP TYPE: SINGLE CHOICE
          ══════════════════════════════════════════════════ */}
          {s.type === 'choice' && (
            <div>
              {/* Question Header */}
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#141414] leading-snug tracking-tight mb-2">
                  {s.question}
                </h2>
                {s.subtitle && (
                  <p className="text-xs sm:text-sm text-[#585858] font-medium">
                    {s.subtitle}
                  </p>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-3">
                {s.options?.map((opt, i) => {
                  const isSelected = answers[s.id] === opt.label;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChoice(opt.label)}
                      className={`js-card js-card-interactive w-full p-4 sm:p-5 flex items-center justify-between text-left transition-all ${
                        isSelected ? 'js-card-selected' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {opt.emoji && (
                          <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-2xl bg-[#F8F8F8] border border-[#F0F0F0]">
                            {opt.emoji}
                          </span>
                        )}
                        <div>
                          <div className="text-sm sm:text-base font-bold text-[#141414]">
                            {opt.label}
                          </div>
                          {opt.desc && (
                            <div className="text-xs text-[#585858] font-normal mt-0.5">
                              {opt.desc}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-[#F56600] bg-[#F56600] text-white text-xs font-bold'
                            : 'border-[#C8C8C8] bg-white'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP TYPE: MULTIPLE CHOICE
          ══════════════════════════════════════════════════ */}
          {s.type === 'multi' && (
            <div>
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#141414] leading-snug tracking-tight mb-2">
                  {s.question}
                </h2>
                {s.subtitle && (
                  <p className="text-xs sm:text-sm text-[#585858] font-medium">
                    {s.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {s.options?.map((opt, i) => {
                  const isChecked = multiAnswers[s.id]?.includes(opt.label);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleMulti(opt.label)}
                      className={`js-card js-card-interactive w-full p-4 sm:p-5 flex items-center justify-between text-left transition-all ${
                        isChecked ? 'js-card-selected' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {opt.emoji && (
                          <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-2xl bg-[#F8F8F8] border border-[#F0F0F0]">
                            {opt.emoji}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-bold text-[#141414]">
                          {opt.label}
                        </span>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? 'border-[#F56600] bg-[#F56600] text-white text-xs font-bold'
                            : 'border-[#C8C8C8] bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!multiAnswers[s.id] || multiAnswers[s.id].length === 0}
                onClick={advance}
                className="js-btn-primary w-full py-4 text-base font-bold"
              >
                {s.cta}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 7: INTERSTITIAL SOCIAL PROOF
          ══════════════════════════════════════════════════ */}
          {s.type === 'interstitial' && (
            <div className="relative overflow-hidden rounded-3xl bg-[#141414] text-white p-6 sm:p-10 shadow-xl border border-[#303030]">
              {/* Background brand elements */}
              <img
                src={ringsSvg}
                alt=""
                aria-hidden="true"
                className="absolute -right-16 -bottom-16 w-60 h-60 opacity-15 pointer-events-none select-none filter invert"
              />
              <img
                src={burstSvg}
                alt=""
                aria-hidden="true"
                className="absolute -left-12 -top-12 w-48 h-48 opacity-20 pointer-events-none select-none"
              />

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF7411] text-xs font-extrabold uppercase tracking-wider mb-5">
                  🔥 JustSchool Community
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
                  {s.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#A8A8A8] font-normal leading-relaxed max-w-md mx-auto mb-8">
                  {s.subtitle}
                </p>

                {/* Stats Matrix */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {s.stats?.map((st, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xs"
                    >
                      <div className="text-xl sm:text-2xl font-extrabold text-[#F56600]">
                        {st.value}
                      </div>
                      <div className="text-xs text-[#C8C8C8] font-medium mt-1">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={advance}
                  className="js-btn-primary w-full py-4 text-base font-bold"
                >
                  {s.cta}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 8: WORD TEST MATRIX
          ══════════════════════════════════════════════════ */}
          {s.type === 'word_test' && (
            <div>
              <div className="mb-5 text-center sm:text-left">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#141414] leading-snug tracking-tight mb-2">
                  {s.question}
                </h2>
                <p className="text-xs sm:text-sm text-[#585858] font-medium">
                  {s.subtitle}
                </p>
              </div>

              {/* Live Knowledge Tracker Badge */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#FFF5EB] border border-[#FFE0CA] mb-5">
                <div className="text-xs font-bold text-[#F56600]">
                  Обрано слів: <span className="text-base">{knownWords.length}</span> з {WORDS.length}
                </div>
                <div className="text-xs font-semibold text-[#585858]">
                  Рівень: <span className="font-bold text-[#141414]">{calculateWordLevel().split(' ')[0]}</span>
                </div>
              </div>

              {/* Words Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 max-h-[50vh] overflow-y-auto p-1">
                {WORDS.map((item, idx) => {
                  const isChecked = knownWords.includes(item.word);
                  const levelColors: Record<string, { bg: string; text: string; badge: string }> = {
                    a1: { bg: '#EAF5E0', text: '#5EA61B', badge: 'A1' },
                    a2: { bg: '#FBE1AD', text: '#A87000', badge: 'A2' },
                    b1: { bg: '#FFE0CA', text: '#D95B00', badge: 'B1' },
                    b2: { bg: '#FBCCB9', text: '#DA3E00', badge: 'B2' },
                    c1: { bg: '#E4E4FA', text: '#5959EF', badge: 'C1' },
                  };
                  const color = levelColors[item.level] || levelColors.a1;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleWord(item.word)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[#F56600] bg-[#FFF5EB] shadow-xs'
                          : 'border-[#E0E0E0] bg-white hover:border-[#C8C8C8]'
                      }`}
                    >
                      <span
                        className={`text-sm font-bold truncate ${
                          isChecked ? 'text-[#F56600]' : 'text-[#141414]'
                        }`}
                      >
                        {item.word}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        {color.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={advance}
                className="js-btn-primary w-full py-4 text-base font-bold"
              >
                {s.cta}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 9: TESTIMONIALS
          ══════════════════════════════════════════════════ */}
          {s.type === 'testimonials' && (
            <div>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF5E0] text-[#5EA61B] text-xs font-extrabold uppercase tracking-wide mb-3">
                  ⭐ Реальні історії учнів
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#141414] leading-snug tracking-tight mb-2">
                  {s.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#585858] font-medium max-w-md mx-auto">
                  {s.subtitle}
                </p>
              </div>

              <div className="space-y-3.5 mb-6">
                {s.reviews?.map((r, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FFF5EB] text-[#F56600] flex items-center justify-center font-bold text-xs border border-[#FFE0CA]">
                          {r.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#141414]">{r.name}</div>
                          {r.role && <div className="text-[11px] text-[#808080]">{r.role}</div>}
                        </div>
                      </div>
                      <span className="text-xs">{r.emoji}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#585858] font-normal leading-relaxed italic">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={advance}
                className="js-btn-primary w-full py-4 text-base font-bold"
              >
                {s.cta}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 12: LOADER
          ══════════════════════════════════════════════════ */}
          {s.type === 'loader' && (
            <div className="text-center py-6">
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img
                  src={burstSvg}
                  alt=""
                  className="absolute inset-0 w-full h-full animate-spin-slow opacity-80"
                />
                <span className="text-xl font-extrabold text-[#F56600]">
                  {Math.round(loaderProgress)}%
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#141414] mb-3">
                {s.title}
              </h2>

              {/* Progress track */}
              <div className="w-full bg-[#F0F0F0] h-2.5 rounded-full overflow-hidden mb-6 max-w-xs mx-auto">
                <div
                  className="bg-gradient-to-r from-[#FF7411] to-[#F56600] h-full rounded-full transition-all duration-300"
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>

              {/* Analysis checklist */}
              <div className="space-y-2 max-w-sm mx-auto text-left">
                {s.points?.map((pt, i) => {
                  const isDone = loaderProgress > (i + 1) * 16;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 text-xs font-semibold p-2.5 rounded-xl transition-all ${
                        isDone
                          ? 'bg-[#EAF5E0] text-[#5EA61B]'
                          : 'bg-[#F8F8F8] text-[#808080] opacity-60'
                      }`}
                    >
                      <span className="text-sm">{isDone ? '✓' : '○'}</span>
                      <span>{pt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 13: LEAD FORM
          ══════════════════════════════════════════════════ */}
          {s.type === 'lead_form' && (
            <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E0E0E0] p-6 sm:p-8 shadow-md">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5EB] text-[#F56600] text-xs font-extrabold uppercase tracking-wide mb-3 border border-[#FFE0CA]">
                  ✨ Фінальний крок
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#141414] leading-tight mb-2">
                  {s.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#585858] font-medium">
                  {s.subtitle}
                </p>
              </div>

              {/* Free Trial Gift Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF5EB] to-[#FFE0CA] border border-[#FBC59F] flex items-center gap-3.5 mb-6 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-[#F56600] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                  🎁
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#141414] uppercase tracking-wide">
                    Безкоштовний урок у подарунок
                  </div>
                  <div className="text-[11px] text-[#585858] font-medium">
                    Методист перевірить рівень та надасть покроковий план навчання
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="Ваше ім'я"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-[#E0E0E0] outline-none font-semibold text-base text-[#141414] placeholder:text-[#A8A8A8] focus:border-[#F56600] focus:ring-4 focus:ring-[#F56600]/15 transition-all bg-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <PhoneInput
                    onChange={(raw, valid) => {
                      setRawPhone(raw);
                      setIsPhoneValid(valid);
                    }}
                    initialCountry={geoCountry}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    placeholder="Ваш Email (необов'язково)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-[#E0E0E0] outline-none font-semibold text-base text-[#141414] placeholder:text-[#A8A8A8] focus:border-[#F56600] focus:ring-4 focus:ring-[#F56600]/15 transition-all bg-white disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="js-btn-primary w-full py-4 text-base sm:text-lg font-bold mt-2"
                >
                  {isSubmitting ? 'Надсилаємо заявку...' : s.cta}
                </button>

                <p className="text-[11px] text-center text-[#808080] font-medium pt-2">
                  🔒 Ваші дані захищені. Ми зв'яжемося тільки для узгодження часу пробного уроку.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-[#F0F0F0] bg-white py-4 px-4 text-center text-xs text-[#808080] font-medium">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={logoSticker} alt="JustSchool" className="w-5 h-5" />
            <span>© {new Date().getFullYear()} JustSchool. Всі права захищені.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Політика конфіденційності</span>
            <span>•</span>
            <span>Договір оферти</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
