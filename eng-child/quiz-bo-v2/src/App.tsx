import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import { QUIZ_STEPS, QuizStep } from './data';
import { Button } from './ds/components/core/Button';
import { Badge } from './ds/components/core/Badge';
import { BrandShape } from './ds/components/core/BrandShape';
import logoBlack from './ds/assets/logo-horizontal-black.svg';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

// Question steps that contribute to the progress bar (choice, text, form)
const QUESTION_STEPS = [1, 2, 4, 5, 7, 8, 10, 11, 12, 13];
const TOTAL_QUESTIONS = QUESTION_STEPS.length;

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [childName, setChildName] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [animKey, setAnimKey] = useState(0);

  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // ─── GEO detection & leadType param ───────────────────────────
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', 'english-for-children');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((d) => {
        setIpInfo(d);
        if (d?.country) setGeoCountry(d.country);
      })
      .catch(() => {});
  }, []);

  const currentStepData: QuizStep | undefined = QUIZ_STEPS.find((s) => s.id === step);

  // ─── GTM Step Tracking ─────────────────────────────────────────
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'quiz_step_reach',
      quiz_name: 'eng-child-quiz-bo-v2',
      step_number: step,
      step_type: currentStepData?.type || 'unknown',
      step_title: currentStepData?.question || currentStepData?.title || 'unknown',
    });
  }, [step, currentStepData]);

  // ─── Progress bar calculations ────────────────────────────────
  const questionIndex = QUESTION_STEPS.indexOf(step);
  const progressPercent =
    questionIndex >= 0
      ? Math.round(((questionIndex + 1) / TOTAL_QUESTIONS) * 100)
      : step === 1
      ? 10
      : Math.round((step / QUIZ_STEPS.length) * 100);

  // ─── Navigation ────────────────────────────────────────────────
  const advance = () => {
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    if (step <= 1) return;
    setAnimKey((k) => k + 1);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChoice = (optionText: string) => {
    setAnswers((prev) => ({ ...prev, [step]: optionText }));
    advance();
  };

  // ─── Form submit ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Guard: double submission prevention
    if (!isPhoneValid || !name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const ipString = `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`;
    const qaArr: string[] = [ipString];

    QUIZ_STEPS.forEach((s) => {
      if (s.type === 'form') return;
      if (s.type === 'text' && childName.trim()) {
        qaArr.push(`${s.question || 'Імʼя дитини'} ${childName.trim()}`);
      } else if (answers[s.id]) {
        qaArr.push(`${s.question || s.title || `Крок ${s.id}`} ${answers[s.id]}`);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaArr.join('|||'),
      dialogueUrl: window.location.href,
      dialogueName: 'eng-child-quiz-bo-v2',
      dialogueId: 'unknown',
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: 'English',
      subject: 'English',
      lead_type: urlParams.get('leadType') || 'english-for-children',
      Lead_type: urlParams.get('leadType') || 'english-for-children',
    };

    try {
      if (window.fbq) {
        window.fbq('trackSingle', '9067851526565677', 'Purchase', {
          currency: 'UAH',
          value: 0,
        });
        window.fbq('trackSingle', '1033701209166819', 'Purchase', {
          currency: 'UAH',
          value: 0,
        });
        window.fbq('track', 'Lead');
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-11192598375/F6HqCOzpsMEcEOf-hdkp',
        });
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'form_success',
          quiz_name: 'eng-child-quiz-bo-v2',
        });
      }

      const result = await res.json().catch(() => null);
      if (result && result.redirectUri) {
        window.location.href = result.redirectUri;
      } else {
        setIsSubmitted(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    isPhoneValid &&
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // ─── Thank You Screen ──────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div
        className="min-h-[100dvh] flex flex-col items-center justify-center p-4 selection:bg-orange-200"
        style={{
          backgroundColor: 'var(--surface-page-warm)',
          fontFamily: 'var(--font-core)',
          color: 'var(--text-body)',
        }}
      >
        <div className="w-full max-w-lg bg-white border border-[var(--border-subtle)] rounded-[28px] p-6 sm:p-10 shadow-lg text-center relative overflow-hidden animate-fade-in">
          <div className="w-20 h-20 bg-[var(--orange-25)] border border-[var(--orange-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--text-strong)' }}
          >
            Дякуємо!
            <br />
            Ми вже на зв'язку
          </h1>

          <p className="text-base font-medium mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Наш методист зателефонує вам найближчим часом і підбере ідеального викладача саме для вашої дитини.
          </p>

          <div className="mb-8 p-5 bg-[var(--orange-25)] border border-[var(--orange-100)] rounded-2xl text-left flex items-start gap-4">
            <span className="text-3xl leading-none">📩</span>
            <div>
              <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-strong)' }}>
                PDF-подарунок для дитини
              </div>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                Корисні вправи та розвиваючі ігри для вивчення англійської відправлено на пошту{' '}
                <strong className="text-[var(--text-strong)]">{email}</strong>
              </p>
            </div>
          </div>

          <div
            className="text-xs font-semibold py-3 px-4 rounded-xl inline-block bg-[var(--base-100)] border border-[var(--border-subtle)]"
            style={{ color: 'var(--text-muted)' }}
          >
            Зазвичай ми зв'язуємося протягом 30 хвилин у робочий час (9:00–20:00).
          </div>
        </div>
      </div>
    );
  }

  const s = currentStepData;
  if (!s) return null;

  return (
    <div
      className="min-h-[100dvh] flex flex-col selection:bg-orange-200"
      style={{
        backgroundColor: 'var(--surface-page-warm)',
        fontFamily: 'var(--font-core)',
        color: 'var(--text-body)',
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b h-14 flex items-center px-4 justify-between shrink-0"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="w-10">
          {step > 1 && (
            <button
              id="back-btn"
              onClick={back}
              aria-label="Назад"
              className="p-2 -ml-2 transition-colors text-xl leading-none font-bold cursor-pointer hover:text-[var(--brand)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              ←
            </button>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logoBlack} alt="JustSchool" className="h-6 w-auto" />
        </div>

        {/* Step counter */}
        <div
          className="text-xs font-bold min-w-[40px] text-right uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          {questionIndex >= 0 ? `${questionIndex + 1}/${TOTAL_QUESTIONS}` : ''}
        </div>
      </header>

      {/* ── 4px Progress Bar ── */}
      <div className="h-1 bg-[var(--base-200)] shrink-0 w-full">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: 'var(--brand)',
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <main
        key={animKey}
        className="step-enter flex-1 flex flex-col items-center px-4 py-6 w-full max-w-lg mx-auto"
      >
        {/* ════════════════════════════════════
            HERO / STEP 1
        ════════════════════════════════════ */}
        {s.type === 'hero' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="absolute -top-6 -right-6 pointer-events-none select-none opacity-20">
              <BrandShape shape="burst" size={90} color="var(--element-orange)" />
            </div>

            {/* Social proof badge */}
            <div className="mb-4">
              <Badge tone="brand" size="md">
                {s.eyebrow || 'БЕЗКОШТОВНИЙ ПРОБНИЙ УРОК + ГАРАНТІЯ'}
              </Badge>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight mb-3"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.title}
            </h1>

            <p
              className="text-sm sm:text-base font-medium leading-relaxed mb-6 max-w-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {s.subtitle}
            </p>

            {/* Value cards */}
            <div className="w-full grid grid-cols-1 gap-2.5 mb-6 text-left">
              <div className="p-3.5 bg-white border border-[var(--border-default)] rounded-2xl flex items-center gap-3.5 shadow-xs">
                <span className="text-2xl leading-none">👨‍🏫</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                  Ідеального репетитора під потреби вашої дитини
                </span>
              </div>
              <div className="p-3.5 bg-white border border-[var(--border-default)] rounded-2xl flex items-center gap-3.5 shadow-xs">
                <span className="text-2xl leading-none">🎁</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                  Корисний PDF-подарунок із вправами та іграми
                </span>
              </div>
            </div>

            <div className="w-full border-t border-[var(--border-subtle)] pt-6">
              <h2
                className="text-lg font-bold mb-4 text-center"
                style={{ color: 'var(--text-strong)' }}
              >
                {s.question}
              </h2>

              <div className="flex flex-col gap-3 w-full">
                {s.options?.map((opt) => (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => handleChoice(opt.text)}
                    className="w-full p-4 rounded-2xl border-2 bg-white text-left transition-all duration-200 flex items-center justify-between group shadow-xs hover:border-[var(--brand)] hover:bg-[var(--orange-25)] cursor-pointer"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <span className="text-base font-bold" style={{ color: 'var(--text-strong)' }}>
                      {opt.text}
                    </span>
                    <span className="w-6 h-6 rounded-full border-2 border-[var(--border-default)] group-hover:border-[var(--brand)] flex items-center justify-center shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[var(--brand)] transition-colors" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            CHOICE STEP
        ════════════════════════════════════ */}
        {s.type === 'choice' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <h2
              className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>

            {s.subtitle && (
              <p
                className="text-sm font-medium leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {s.subtitle}
              </p>
            )}
            {!s.subtitle && <div className="mb-4" />}

            <div className="flex flex-col gap-3 w-full">
              {s.options?.map((opt) => {
                const isSelected = answers[s.id] === opt.text;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => handleChoice(opt.text)}
                    className="w-full p-4 rounded-2xl border-2 bg-white text-left transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer"
                    style={{
                      borderColor: isSelected ? 'var(--brand)' : 'var(--border-default)',
                      backgroundColor: isSelected ? 'var(--orange-25)' : '#FFFFFF',
                    }}
                  >
                    <span className="text-base font-bold" style={{ color: 'var(--text-strong)' }}>
                      {opt.text}
                    </span>
                    <span
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        borderColor: isSelected ? 'var(--brand)' : 'var(--border-default)',
                        backgroundColor: isSelected ? 'var(--brand)' : 'transparent',
                      }}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            BENEFITS STEP (STEP 3)
        ════════════════════════════════════ */}
        {s.type === 'benefits' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="mb-3">
              <Badge tone="brand" size="md">
                ЧОМУ JUSTSCHOOL
              </Badge>
            </div>

            <h2
              className="text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.title}
            </h2>

            {s.subtitle && (
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                {s.subtitle}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 w-full mb-8 text-left">
              {s.benefits?.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-[var(--border-default)] rounded-2xl p-4 shadow-xs flex flex-col"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div
                    className="font-bold text-sm mb-1.5 leading-snug"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    {item.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={advance}
              style={{ height: 56, fontSize: '17px' }}
            >
              {s.cta || 'Продовжити →'}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            STATS STEP (STEP 6)
        ════════════════════════════════════ */}
        {s.type === 'stats' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="mb-3">
              <Badge tone="brand" size="md">
                НАШІ РЕЗУЛЬТАТИ
              </Badge>
            </div>

            <h2
              className="text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.title}
            </h2>

            {s.subtitle && (
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                {s.subtitle}
              </p>
            )}

            <div className="flex flex-col gap-3 w-full mb-8">
              {s.stats?.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-[var(--border-default)] rounded-2xl p-5 text-center shadow-xs"
                >
                  <div
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1"
                    style={{ color: 'var(--brand)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={advance}
              style={{ height: 56, fontSize: '17px' }}
            >
              {s.cta || 'Продовжити →'}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            COMPARE STEP (STEP 9)
        ════════════════════════════════════ */}
        {s.type === 'compare' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="mb-3">
              <Badge tone="brand" size="md">
                ПОРІВНЯННЯ
              </Badge>
            </div>

            <h2
              className="text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.title}
            </h2>

            {s.subtitle && (
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                {s.subtitle}
              </p>
            )}

            <div className="flex flex-col gap-3 w-full mb-8 text-left">
              {s.comparison?.map((row, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-[var(--orange-100)] rounded-2xl p-4 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--brand)]" />
                  <div className="pl-1">
                    <div className="text-xs font-bold tracking-wider uppercase mb-1 text-[var(--brand)]">
                      JustSchool ✓
                    </div>
                    <div
                      className="font-bold text-sm sm:text-base mb-2.5 leading-snug"
                      style={{ color: 'var(--text-strong)' }}
                    >
                      {row.us}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--base-500)] mb-0.5">
                      Інші школи
                    </div>
                    <div className="text-xs sm:text-sm line-through text-[var(--base-600)]">
                      {row.them}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={advance}
              style={{ height: 56, fontSize: '17px' }}
            >
              {s.cta || 'Продовжити →'}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            TEXT STEP (STEP 10 - CHILD NAME)
        ════════════════════════════════════ */}
        {s.type === 'text' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="mb-3">
              <Badge tone="brand" size="md">
                {s.eyebrow || 'ПОДАРУНОК ДЛЯ ДИТИНИ'}
              </Badge>
            </div>

            <h2
              className="text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>

            {s.subtitle && (
              <p
                className="text-sm font-medium leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {s.subtitle}
              </p>
            )}

            <div className="w-full mb-6">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={s.placeholder || "Ім'я дитини"}
                className="w-full h-14 px-5 rounded-2xl border-2 bg-white text-base font-semibold outline-none shadow-xs transition-all"
                style={{
                  borderColor: childName.trim() ? 'var(--brand)' : 'var(--border-default)',
                  color: 'var(--text-strong)',
                }}
              />
            </div>

            <Button
              size="lg"
              fullWidth
              disabled={!childName.trim()}
              onClick={() => {
                if (childName.trim()) advance();
              }}
              style={{ height: 56, fontSize: '17px' }}
            >
              {s.cta || 'Далі →'}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            FORM STEP (STEP 13 - LEAD CAPTURE)
        ════════════════════════════════════ */}
        {s.type === 'form' && (
          <div className="flex flex-col items-center text-center w-full relative">
            <div className="mb-3">
              <Badge tone="brand" size="md">
                {s.eyebrow || 'ФІНАЛЬНИЙ КРОК'}
              </Badge>
            </div>

            <h2
              className="text-2xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>

            {s.subtitle && (
              <p
                className="text-sm font-medium leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {s.subtitle}
              </p>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5 text-left mb-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-strong)' }}>
                  Ваше імʼя*
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Олена"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl border-2 bg-white text-base font-semibold outline-none shadow-xs transition-all disabled:opacity-50"
                  style={{
                    borderColor: name.trim().length >= 2 ? 'var(--brand)' : 'var(--border-default)',
                    color: 'var(--text-strong)',
                  }}
                />
              </div>

              {/* Phone with Multi-country GEO masking */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-strong)' }}>
                  Номер телефону*
                </label>
                <PhoneInput
                  initialCountry={geoCountry}
                  disabled={isSubmitting}
                  onChange={(raw, valid) => {
                    setRawPhone(raw);
                    setIsPhoneValid(valid);
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-strong)' }}>
                  Ваш e-mail* (для отримання PDF-подарунка)
                </label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl border-2 bg-white text-base font-semibold outline-none shadow-xs transition-all disabled:opacity-50"
                  style={{
                    borderColor: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                      ? 'var(--brand)'
                      : 'var(--border-default)',
                    color: 'var(--text-strong)',
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={!isFormValid || isSubmitting}
                  style={{ height: 56, fontSize: '16px' }}
                >
                  {isSubmitting
                    ? 'Надсилаємо заявку...'
                    : s.cta || 'Отримати безплатну консультацію та бонуси 🎁'}
                </Button>
              </div>

              <div className="text-center text-[11px] leading-relaxed pt-1 text-[var(--base-600)]">
                Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних та отримання консультації.
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
