import { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import { STEPS } from './data';

// Steps shown in the progress counter (choice + multi questions)
const PROGRESS_STEPS = [2, 3, 4, 5, 6, 10, 11];
const TOTAL_PROGRESS = PROGRESS_STEPS.length;

export default function App() {
  // ─── State ───────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});

  const [name, setName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [animKey, setAnimKey] = useState(0);

  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // ─── GEO detection ───────────────────────────────────────
  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then(r => r.json())
      .then(d => {
        setIpInfo(d);
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
      quiz_name: 'eng-child-quiz-plan',
      step_number: step,
      step_type: currentStepData?.type || 'unknown',
      step_title: currentStepData?.question || currentStepData?.title || 'unknown',
    });
  }, [step, currentStepData]);

  // ─── Loader animation ────────────────────────────────────
  useEffect(() => {
    if (currentStepData?.type !== 'loader') return;
    setLoaderProgress(0);
    const interval = setInterval(() => {
      setLoaderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => advance(), 600);
          return 100;
        }
        return Math.min(prev + 1.2, 100);
      });
    }, 35);
    return () => clearInterval(interval);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Progress bar ────────────────────────────────────────
  const progressIdx = PROGRESS_STEPS.indexOf(step);

  // ─── Navigation ──────────────────────────────────────────
  const advance = () => {
    setAnimKey(k => k + 1);
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    setAnimKey(k => k + 1);
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  // ─── Handlers ────────────────────────────────────────────
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

  // ─── Form submit ─────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submission guard
    if (!isPhoneValid || !name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    // Build Q&A string from all answers
    const ipString = `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`;
    const qaArr: string[] = [ipString];
    STEPS.forEach(s => {
      if (answers[s.id])
        qaArr.push(`Q${s.id}: ${answers[s.id]}`);
      if (multiAnswers[s.id]?.length)
        qaArr.push(`Q${s.id}: ${multiAnswers[s.id].join(', ')}`);
    });
    if (childName.trim()) {
      qaArr.push(`Q99: Ім'я дитини: ${childName.trim()}`);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaArr.join('|||'),
      dialogueUrl: window.location.href,
      dialogueName: "JustSchool Quiz",
      dialogueId: "unknown",
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: urlParams.get('utm_subject') || 'Child',
    };

    try {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead');
        (window as any).fbq('track', 'Purchase', { currency: 'UAH', value: 0 });
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: 'form_success',
          quiz_name: 'eng-child-quiz-plan',
        });
        const result = await res.json();
        window.location.href =
          result.redirectUri || 'https://justschool.me/uk/onboarding';
      } else {
        window.location.href = 'https://justschool.me/uk/onboarding';
      }
    } catch {
      window.location.href = 'https://justschool.me/uk/onboarding';
    }
  };

  // ─── Derived ─────────────────────────────────────────────
  const s = currentStepData;
  if (!s) return null;

  const canGoBack =
    step > 1 && !['loader', 'lead_form'].includes(s.type);
  const multiSelected = multiAnswers[step] || [];
  const progressPercent =
    progressIdx >= 0
      ? Math.round(((progressIdx + 1) / TOTAL_PROGRESS) * 100)
      : 0;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-[100dvh] bg-violet-50 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-violet-100 h-12 flex items-center px-4 justify-between shrink-0">
        <div className="w-10">
          {canGoBack && (
            <button
              id="back-btn"
              onClick={back}
              aria-label="Назад"
              className="p-2 -ml-2 text-violet-400 hover:text-violet-700 transition-colors text-xl leading-none"
            >
              ←
            </button>
          )}
        </div>

        {/* Step counter */}
        <div className="text-[11px] font-bold text-violet-300 min-w-[40px] text-right uppercase tracking-widest">
          {progressIdx >= 0 ? `${progressIdx + 1}/${TOTAL_PROGRESS}` : ''}
        </div>
      </header>

      {/* ── Progress bar ── */}
      {progressIdx >= 0 && (
        <div className="h-1 bg-violet-100 shrink-0">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* ── Main content — animated on step change ── */}
      <main
        key={animKey}
        className="step-enter flex-1 flex flex-col items-center px-4 py-6 w-full max-w-lg mx-auto"
      >

        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        {s.type === 'hero' && (
          <div className="flex flex-col items-center text-center w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-6">
              {s.social_proof}
            </div>

            <h1 className="text-3xl font-black text-violet-950 leading-tight tracking-tight mb-4">
              {s.title}
            </h1>
            <p className="text-sm text-violet-500 font-medium leading-relaxed mb-8 max-w-sm">
              {s.subtitle}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-8">
              {s.stats?.map(b => (
                <div
                  key={b.label}
                  className="bg-white rounded-2xl p-4 text-center border border-violet-100 shadow-sm"
                >
                  <div className="text-xl font-black text-violet-950">{b.value}</div>
                  <div className="text-xs text-violet-400 font-semibold mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>

            <div className="w-full space-y-3">
              <button
                id="hero-cta"
                onClick={advance}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                {s.cta}
              </button>
              <p className="text-center text-xs text-violet-300 font-semibold uppercase tracking-widest">
                БЕЗКОШТОВНО • 5 ХВИЛИН
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SINGLE CHOICE
        ════════════════════════════════════ */}
        {s.type === 'choice' && (
          <div className="w-full">
            <h2 className="text-2xl font-black text-violet-950 mb-2 leading-tight text-center">
              {s.question}
            </h2>
            {s.subtitle ? (
              <p className="text-sm text-violet-500 text-center mb-6 font-medium leading-relaxed">
                {s.subtitle}
              </p>
            ) : (
              <div className="mb-6" />
            )}

            <div className="grid gap-3">
              {s.options?.map(opt => (
                <button
                  key={opt.value}
                  id={`choice-${opt.value}`}
                  onClick={() => handleChoice(opt.label)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-violet-100 hover:border-violet-500 hover:bg-violet-50 active:scale-[0.98] transition-all text-left group shadow-sm"
                >
                  {opt.emoji && (
                    <span className="text-2xl w-9 text-center shrink-0">{opt.emoji}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-violet-950 text-base leading-tight">
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-xs text-violet-400 font-medium mt-0.5">
                        {opt.desc}
                      </div>
                    )}
                  </div>
                  <span className="text-violet-200 group-hover:text-violet-500 transition-colors text-lg shrink-0">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            MULTI CHOICE
        ════════════════════════════════════ */}
        {s.type === 'multi' && (
          <div className="w-full">
            <h2 className="text-2xl font-black text-violet-950 mb-2 leading-tight text-center">
              {s.question}
            </h2>
            {s.subtitle && (
              <p className="text-sm text-violet-500 text-center mb-6 font-medium">
                {s.subtitle}
              </p>
            )}

            <div className="grid gap-2.5 mb-6">
              {s.options?.map(opt => {
                const sel = multiSelected.includes(opt.label);
                return (
                  <button
                    key={opt.value}
                    id={`multi-${opt.value}`}
                    onClick={() => toggleMulti(opt.label)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98] shadow-sm ${
                      sel
                        ? 'bg-violet-600 border-violet-600'
                        : 'bg-white border-violet-100 hover:border-violet-400'
                    }`}
                  >
                    <span className="text-xl w-8 text-center shrink-0">{opt.emoji}</span>
                    <span
                      className={`flex-1 font-bold text-sm leading-snug ${
                        sel ? 'text-white' : 'text-violet-950'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                        sel ? 'bg-white border-white' : 'border-violet-300'
                      }`}
                    >
                      {sel && (
                        <span className="text-violet-600 text-xs font-black leading-none">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              id="multi-confirm"
              onClick={() => multiSelected.length > 0 && advance()}
              disabled={multiSelected.length === 0}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base uppercase tracking-wide shadow-lg shadow-orange-200 disabled:opacity-30 active:scale-95 transition-all"
            >
              {s.cta}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            INTERSTITIAL (stats)
        ════════════════════════════════════ */}
        {s.type === 'interstitial' && (
          <div className="w-full">
            {/* Dark hero card */}
            <div className="bg-violet-950 rounded-3xl p-6 text-center text-white mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-4 w-28 h-28 bg-violet-600/40 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="text-4xl mb-3">🏆</div>
                <h2 className="text-xl font-black mb-2 leading-tight">{s.title}</h2>
                <p className="text-violet-400 text-sm font-medium">{s.subtitle}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {s.stats?.map(stat => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-4 text-center border border-violet-100 shadow-sm"
                >
                  <div className="text-xl font-black text-violet-950">{stat.value}</div>
                  <div className="text-xs text-violet-400 font-semibold mt-1 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              id="interstitial-cta"
              onClick={advance}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base uppercase tracking-wide shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              {s.cta}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════ */}
        {s.type === 'testimonials' && (
          <div className="w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl font-black text-violet-950 mb-2 leading-tight">
                {s.title}
              </h2>
              <p className="text-sm text-violet-500 font-medium leading-relaxed">
                {s.subtitle}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {s.reviews?.map(rev => (
                <div
                  key={rev.name}
                  className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-black text-sm shrink-0">
                      {rev.name[0]}
                    </div>
                    <div>
                      <div className="font-black text-violet-950 text-sm">{rev.name}</div>
                      <div className="text-xs">{rev.emoji}</div>
                    </div>
                  </div>
                  <p className="text-xs text-violet-500 font-medium leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>

            <button
              id="testimonials-cta"
              onClick={advance}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base uppercase tracking-wide shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              {s.cta}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            LEAD NAME
        ════════════════════════════════════ */}
        {s.type === 'lead_name' && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-black text-violet-950 mb-6 text-center leading-tight">
              {s.question}
            </h2>

            <input
              type="text"
              placeholder="Введіть відповідь"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-violet-200 outline-none focus:border-violet-500 transition-all font-semibold text-violet-950 bg-white mb-6"
              autoFocus
            />

            <button
              id="name-confirm"
              onClick={() => childName.trim().length > 0 && advance()}
              disabled={childName.trim().length === 0}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base uppercase tracking-wide shadow-lg shadow-orange-200 disabled:opacity-30 active:scale-95 transition-all"
            >
              {s.cta}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            LOADER
        ════════════════════════════════════ */}
        {s.type === 'loader' && (
          <div className="w-full flex flex-col items-center text-center py-6">
            {/* Spinner */}
            <div className="w-20 h-20 bg-violet-100 border border-violet-200 rounded-2xl flex items-center justify-center mb-6">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>

            <h2 className="text-xl font-black text-violet-950 mb-8 leading-tight">
              {s.title}
            </h2>

            {/* Progress bar */}
            <div className="w-full bg-violet-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${loaderProgress}%` }}
              />
            </div>
            <div className="text-orange-500 font-black text-2xl font-mono mb-10">
              {Math.round(loaderProgress)}%
            </div>

            {/* Checklist */}
            <div className="w-full space-y-3 text-left">
              {s.points?.map((p, i) => {
                const threshold = (i / (s.points?.length ?? 6)) * 100;
                const active = loaderProgress > threshold;
                return (
                  <div
                    key={p}
                    className={`flex items-center gap-3 text-sm font-semibold transition-all duration-500 ${
                      active ? 'text-violet-950' : 'text-violet-200'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${
                        active ? 'bg-orange-500' : 'bg-violet-200'
                      }`}
                    />
                    {p}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            LEAD FORM
        ════════════════════════════════════ */}
        {s.type === 'lead_form' && (
          <div className="w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-violet-950 mb-2 leading-tight">
                {childName.trim()
                  ? `🎉 Персональний план для ${childName.trim()} готовий!`
                  : s.title}
              </h2>
              <p className="text-sm text-violet-500 font-medium leading-relaxed">
                {s.subtitle}
              </p>
            </div>

            {/* Gift banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl shrink-0">
                🎁
              </div>
              <p className="text-orange-700 text-xs font-bold leading-tight">
                Безкоштовне пробне заняття з методистом у подарунок! Отримай персональну програму навчання.
              </p>
            </div>

            <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Name */}
              <input
                id="lead-name"
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="name"
                className="w-full p-4 rounded-2xl border-2 border-violet-200 outline-none focus:border-violet-500 transition-all font-semibold text-violet-950 bg-white disabled:opacity-50"
              />

              {/* Phone (multi-country) */}
              <PhoneInput
                onChange={(raw, valid) => {
                  setRawPhone(raw);
                  setIsPhoneValid(valid);
                }}
                initialCountry={geoCountry}
                disabled={isSubmitting}
              />

              {/* Email */}
              <input
                id="lead-email"
                type="email"
                placeholder="Ваш e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="email"
                className="w-full p-4 rounded-2xl border-2 border-violet-200 outline-none focus:border-violet-500 transition-all font-semibold text-violet-950 bg-white disabled:opacity-50"
              />

              {/* Submit */}
              <button
                id="lead-submit"
                type="submit"
                disabled={
                  isSubmitting || !isPhoneValid || !name.trim() || !email.trim()
                }
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base uppercase tracking-wide shadow-lg shadow-orange-200 disabled:opacity-30 active:scale-95 transition-all"
              >
                {isSubmitting ? 'Надсилаємо заявку...' : s.cta}
              </button>

              <p className="text-center text-[10px] text-violet-300 font-semibold uppercase tracking-widest">
                ТВОЇ ДАНІ У БЕЗПЕЦІ • БЕЗ СПАМУ
              </p>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
