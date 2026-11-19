import React, { useEffect, useMemo, useState } from 'react';
import PhoneInput from './PhoneInput';
import logoWhite from './ds/assets/logo-horizontal-white.svg';
import {
  GIFTS,
  GIFTS_QA,
  IMAGES,
  LOADER_STAGES,
  OFFER,
  PHRASES_POINTS,
  QUESTIONS,
  REVIEWS,
  STEPS_HOW,
} from './data';
import type { Audience, Question, QuestionKey } from './data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type Variant = 'v1' | 'v2';

const QUIZ_NAME = 'eng-adult-new-year';
const DIALOGUE_ID = 'new_year_2027';

// Step map: 0 hero · 1–6 questions · 7 «Мішок майже зібрано» · 8 loader · 9 summary + form
const FIRST_Q = 1;
const LAST_Q = 6;
const STEP_BAG = 7;
const STEP_LOADER = 8;
const STEP_FORM = 9;

const LEAD_TYPE: Record<Audience, string> = {
  adult: 'english-for-adults',
  child: 'english-for-children',
};

// Variant strictly by route: /new-year-v1 → V1, everything else → V2
const detectVariant = (): Variant => (/-v1\/?$/.test(window.location.pathname) ? 'v1' : 'v2');

const initialAudience = (): Audience => {
  try {
    const lt = (new URLSearchParams(window.location.search).get('leadType') || '').toLowerCase();
    if (lt.includes('child')) return 'child';
  } catch {
    /* ignore */
  }
  return 'adult';
};

// ─── Countdown to OFFER.deadlineISO ────────────────────────────────────────
const DEADLINE_MS = new Date(OFFER.deadlineISO).getTime();
const secondsLeft = () => Math.max(0, Math.floor((DEADLINE_MS - Date.now()) / 1000));

function useCountdown() {
  const [left, setLeft] = useState(secondsLeft);
  useEffect(() => {
    const id = setInterval(() => setLeft(secondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    days: Math.floor(left / 86400),
    hms: `${pad(Math.floor((left % 86400) / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`,
  };
}

function TimerText({ className = '' }: { className?: string }) {
  const { days, hms } = useCountdown();
  return (
    <span className={`tabular-nums whitespace-nowrap ${className}`} role="timer" aria-live="off">
      До Нового року: <b className="text-[var(--ny-gold)]">{days} дн {hms}</b>
    </span>
  );
}

function TimerBoxes({ onRed = false }: { onRed?: boolean }) {
  const { days, hms } = useCountdown();
  const [h, m, s] = hms.split(':');
  const units: [string, string][] = [
    [String(days), 'дн'],
    [h, 'год'],
    [m, 'хв'],
    [s, 'сек'],
  ];
  return (
    <div className="flex items-start justify-center gap-2" role="timer" aria-live="off">
      {units.map(([v, l]) => (
        <span key={l} className="flex flex-col items-center">
          <span
            className={`ny-display tabular-nums text-xl sm:text-2xl min-w-[3rem] rounded-xl px-2 py-1.5 text-center border text-[var(--ny-text)] ${
              onRed ? 'bg-black/20 border-white/30' : 'bg-[var(--ny-card)] border-[var(--ny-border)]'
            }`}
          >
            {v}
          </span>
          <span className={`mt-1 text-[10px] font-semibold ${onRed ? 'text-[var(--ny-text)]' : 'text-[var(--ny-muted)]'}`}>{l}</span>
        </span>
      ))}
    </div>
  );
}

// ─── Decorative pieces ─────────────────────────────────────────────────────
const GARLAND_COLORS = ['#E5484D', '#F2C14E', '#3FB37A', '#FFF8EC'];

function Garland() {
  return (
    <div className="ny-garland" aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <span
          key={i}
          style={{
            backgroundColor: GARLAND_COLORS[i % 4],
            color: GARLAND_COLORS[i % 4],
            animationDelay: `${(i % 6) * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}

function Banner({ priority = true, className = '' }: { priority?: boolean; className?: string }) {
  const d = IMAGES.bannerDesktop;
  const m = IMAGES.bannerMobile;
  return (
    <picture>
      <source media="(max-width: 767px)" type="image/webp" srcSet={`${m.webp750} 750w, ${m.webp} 1100w`} sizes="100vw" />
      <source media="(max-width: 767px)" type="image/jpeg" srcSet={`${m.jpg750} 750w, ${m.jpg} 1100w`} sizes="100vw" />
      <source type="image/webp" srcSet={`${d.webp1100} 1100w, ${d.webp} 1672w`} sizes="(min-width: 1024px) 640px, 100vw" />
      <img
        src={d.jpg}
        srcSet={`${d.jpg1100} 1100w, ${d.jpg} 1672w`}
        sizes="(min-width: 1024px) 640px, 100vw"
        width={d.w}
        height={d.h}
        alt="Дід Мороз тримає мішок із подарунками: знижка −50%, безкоштовний урок і 200 фраз англійською"
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={`block w-full h-auto ${className}`}
      />
    </picture>
  );
}

function MobileBanner({ className = '' }: { className?: string }) {
  const m = IMAGES.bannerMobile;
  return (
    <picture>
      <source type="image/webp" srcSet={`${m.webp750} 750w, ${m.webp} 1100w`} sizes="(min-width: 480px) 448px, 100vw" />
      <img
        src={m.jpg750}
        srcSet={`${m.jpg750} 750w, ${m.jpg} 1100w`}
        sizes="(min-width: 480px) 448px, 100vw"
        width={m.w}
        height={m.h}
        alt="Дід Мороз тримає мішок із подарунками: знижка −50%, безкоштовний урок і 200 фраз англійською"
        fetchPriority="high"
        decoding="sync"
        className={`block w-full ${className || 'h-auto'}`}
      />
    </picture>
  );
}

function Cover({ className = '' }: { className?: string }) {
  const c = IMAGES.cover;
  return (
    <picture>
      <source type="image/webp" srcSet={c.webp} />
      <img
        src={c.jpg}
        width={c.w}
        height={c.h}
        alt="Обкладинка PDF-посібника «The Native's Guide» з 200 фразами англійською"
        loading="lazy"
        decoding="async"
        className={`block h-auto ${className}`}
      />
    </picture>
  );
}

function GoldButton({
  children,
  onClick,
  id,
  type = 'button',
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ny-cta rounded-full py-4 px-6 text-base sm:text-lg font-extrabold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function AudienceToggle({ audience, onChange }: { audience: Audience; onChange: (a: Audience) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full bg-[var(--ny-card)] border border-[var(--ny-border)] p-1" role="tablist" aria-label="Для кого навчання">
      {(['adult', 'child'] as Audience[]).map((a) => (
        <button
          key={a}
          type="button"
          role="tab"
          aria-selected={audience === a}
          onClick={() => onChange(a)}
          className={`rounded-full py-2.5 text-sm font-bold cursor-pointer transition-colors ${
            audience === a ? 'bg-[var(--ny-text)] text-[#141414]' : 'text-[var(--ny-muted)] hover:text-[var(--ny-text)]'
          }`}
        >
          {a === 'adult' ? 'Для дорослих' : 'Для дитини'}
        </button>
      ))}
    </div>
  );
}

function OptionButton({
  opt,
  selected,
  multi,
  onClick,
}: {
  opt: { label: string; subtitle?: string; emoji?: string };
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      className={`ny-option w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left cursor-pointer active:scale-[0.98] ${selected ? 'is-selected' : ''}`}
    >
      {opt.emoji && (
        <span className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[var(--ny-bg)]" aria-hidden>
          {opt.emoji}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-bold text-base text-[var(--ny-text)]">{opt.label}</span>
        {opt.subtitle && <span className="block text-sm text-[var(--ny-muted)] mt-0.5">{opt.subtitle}</span>}
      </span>
      {multi ? (
        <span
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 text-xs font-black ${
            selected ? 'bg-[var(--ny-gold)] border-[var(--ny-gold)] text-[#141414]' : 'border-[var(--ny-border)]'
          }`}
          aria-hidden
        >
          {selected ? '✓' : ''}
        </span>
      ) : (
        <span className="text-lg font-bold text-[var(--ny-gold)]" aria-hidden>
          ›
        </span>
      )}
    </button>
  );
}

function GiftList({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-2.5 ${compact ? '' : 'sm:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
      {GIFTS.map((g, i) => (
        <li key={g.id} className={`ny-card rounded-2xl flex ${compact ? 'items-center gap-3 p-3.5' : 'flex-col gap-3 p-5'}`}>
          {compact && g.id === 'phrases' ? (
            <Cover className="w-14 rounded-lg shrink-0 self-start" />
          ) : (
          <span className={`ny-display shrink-0 self-start rounded-xl bg-[var(--ny-red)] text-[var(--ny-text)] flex items-center justify-center whitespace-nowrap ${compact ? 'min-w-14 h-12 px-2 text-sm' : 'h-12 px-4 text-lg'}`}>
            {g.tag}
          </span>
          )}
          <span>
            <span className="block font-bold text-[var(--ny-text)]">
              {compact && <span className="text-[var(--ny-gold)]">{i + 1}. </span>}
              {g.title}
            </span>
            <span className="block text-sm text-[var(--ny-muted)] mt-0.5">{g.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const variant = useMemo(detectVariant, []);

  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [focus, setFocus] = useState<string[]>([]);
  const [opened, setOpened] = useState<string[]>([]);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [geoCountry, setGeoCountry] = useState('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  const questions: Question[] = QUESTIONS[audience];
  const currentQ = step >= FIRST_Q && step <= LAST_Q ? questions[step - FIRST_Q] : null;
  const inQuiz = step > 0;

  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info fetch error:', err));
  }, []);

  // Keep leadType in URL in sync (UTMs and other params are preserved)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('leadType', LEAD_TYPE[audience]);
      window.history.replaceState({}, '', url.toString());
    } catch {
      /* ignore */
    }
  }, [audience]);

  useEffect(() => {
    const stepName =
      step === 0
        ? `hero_${variant}`
        : currentQ
        ? `question_${currentQ.key}`
        : step === STEP_BAG
        ? 'bag_almost_ready'
        : step === STEP_LOADER
        ? 'loader'
        : 'bag_summary_lead_form';
    (window.dataLayer = window.dataLayer || []).push({
      event: 'quiz_step_reach',
      quiz_name: QUIZ_NAME,
      quiz_variant: variant,
      step_number: step,
      step_name: stepName,
      audience,
      leadType: LEAD_TYPE[audience],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step !== STEP_LOADER) return;
    setLoaderProgress(0);
    const id = setInterval(() => setLoaderProgress((p) => Math.min(100, p + 1)), 35);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step !== STEP_LOADER || loaderProgress < 100) return;
    const t = setTimeout(() => goTo(STEP_FORM), 500);
    return () => clearTimeout(t);
  }, [loaderProgress, step]);

  const goTo = (next: number) => {
    setAnimKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeAudience = (a: Audience) => {
    if (a === audience) return;
    setAudience(a);
    setAnswers({});
    setFocus([]);
  };

  const startQuiz = (a?: Audience) => {
    if (a) changeAudience(a);
    goTo(FIRST_Q);
  };

  const answerSingle = (key: QuestionKey, label: string) => {
    setAnswers((prev) => ({ ...prev, [key]: label }));
    // short pause so the selected state is visible before auto-advance
    setTimeout(() => goTo(step + 1), 180);
  };

  const toggleFocus = (label: string) =>
    setFocus((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  const submitFocus = () => {
    if (focus.length === 0) return;
    setAnswers((prev) => ({ ...prev, focus: focus.join(', ') }));
    goTo(step + 1);
  };

  const openGift = (id: string) => setOpened((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const allOpened = opened.length === GIFTS.length;

  const canGoBack = inQuiz && step !== STEP_LOADER && step !== STEP_FORM;
  const handleBack = () => goTo(step - 1);

  // ─── Lead submission ───────────────────────────────────────────────────
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submission guard
    if (!name.trim() || !email.trim() || !isPhoneValid) return;
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const params = new URLSearchParams(window.location.search);
    const leadType = LEAD_TYPE[audience];

    const qa = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      `[НОВИЙ РІК · ПОДАРУНКИ ВІД ДІДА МОРОЗА · ${variant.toUpperCase()}]`,
      GIFTS_QA,
      `Знижка діє до ${OFFER.deadlineLabel}`,
      `Аудиторія: ${audience === 'adult' ? 'Дорослий' : 'Дитина'}`,
      `Вік: ${answers.age || 'Не вказано'}`,
      `Рівень: ${answers.level || 'Не вказано'}`,
      `Бажання: ${answers.wish || 'Не вказано'}`,
      `Фокус: ${answers.focus || 'Не вказано'}`,
      `Темп: ${answers.pace || 'Не вказано'}`,
      `Час: ${answers.time || 'Не вказано'}`,
    ].join(' ||| ');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: cleanEmail,
      qa,
      dialogueUrl: window.location.href,
      dialogueName: `Новий рік · Подарунки від Діда Мороза (${variant.toUpperCase()})`,
      dialogueId: DIALOGUE_ID,
      quiz_name: QUIZ_NAME,
      quiz_variant: variant,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign') || 'new_year_2027',
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      utm_subject: 'English',
      subject: 'English',
      leadType,
      lead_type: leadType,
      Lead_type: leadType,
    };

    const fallbackUrl = cleanEmail
      ? `https://id.justschool.me/login?email=${encodeURIComponent(cleanEmail)}`
      : 'https://student.justschool.me/onboarding';

    // Redirect even if the network hangs
    const fallbackTimer = setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 7000);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let redirect = fallbackUrl;
      if (res.ok) {
        (window.dataLayer = window.dataLayer || []).push({
          event: 'form_success',
          quiz_name: QUIZ_NAME,
          quiz_variant: variant,
          audience,
          leadType,
        });
        window.fbq?.('track', 'Lead');
        const result = await res.json().catch(() => ({}));
        const uri = String(result?.redirectUri || '').trim();
        if (uri && !uri.includes('/uk/onboarding')) redirect = uri;
      }
      clearTimeout(fallbackTimer);
      window.location.href = redirect;
    } catch (err) {
      console.error('Submission error:', err);
      clearTimeout(fallbackTimer);
      window.location.href = fallbackUrl;
    }
    // isSubmitting stays true: the page is navigating away
  };

  const progressPercent = currentQ ? Math.round(((step - FIRST_Q + 1) / questions.length) * 100) : 0;
  const loaderStage = Math.min(LOADER_STAGES.length - 1, Math.floor(loaderProgress / (100 / LOADER_STAGES.length)));
  const isWideLanding = variant === 'v2' && step === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col ny-page">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-[var(--ny-bg)]/95 backdrop-blur-md border-b border-[var(--ny-border)] shrink-0">
        <div className={`mx-auto flex items-center justify-between gap-2 px-4 h-14 ${isWideLanding ? 'max-w-6xl' : 'max-w-lg'}`}>
          <div className="flex items-center gap-1 min-w-0">
            {canGoBack && (
              <button
                id="back-btn"
                type="button"
                onClick={handleBack}
                aria-label="Назад"
                className="p-2 -ml-2 text-xl font-bold text-[var(--ny-muted)] hover:text-[var(--ny-text)] cursor-pointer"
              >
                ←
              </button>
            )}
            <button type="button" onClick={() => goTo(0)} className="cursor-pointer shrink-0" aria-label="JustSchool — на початок">
              <img src={logoWhite} alt="JustSchool" width={150} height={28} className="h-5 sm:h-6 w-auto" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {currentQ ? (
              <span className="text-xs font-bold text-[var(--ny-muted)]">
                {step - FIRST_Q + 1}/{questions.length}
              </span>
            ) : (
              <TimerText className="text-[10.5px] sm:text-sm font-semibold text-[var(--ny-muted)]" />
            )}
            {isWideLanding && (
              <span className="hidden md:block">
                <GoldButton id="header-cta" onClick={() => startQuiz()} className="!py-2.5 !px-5 !text-sm">
                  Розпакувати подарунки →
                </GoldButton>
              </span>
            )}
          </div>
        </div>
        <Garland />
      </header>

      {currentQ && (
        <div className="h-1 bg-[var(--ny-border)] shrink-0" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-[var(--ny-gold)] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      <main key={animKey} className={`step-enter flex-1 w-full mx-auto flex flex-col ${isWideLanding ? '' : 'max-w-lg px-4 py-5 sm:py-8'}`}>
        {/* ═══ STEP 0 · V1 — single-screen quiz hero ═══ */}
        {step === 0 && variant === 'v1' && (
          <section className="ny-snow relative flex flex-col items-center text-center gap-3 -mx-4 px-4 -mt-5 pt-4">
            <span className="ny-badge">🎅 Подарунки від Діда Мороза</span>
            <h1 className="ny-display text-[1.4rem] leading-[1.15] text-[var(--ny-text)]">
              Дід Мороз уже приніс вашу <span className="text-[var(--ny-gold)]">англійську</span> під ялинку
            </h1>
            <div className="w-full rounded-3xl overflow-hidden border border-[var(--ny-border)] bg-[var(--ny-card)] aspect-[16/9]">
              <MobileBanner className="h-full object-cover object-[50%_62%]" />
            </div>
            <p className="text-sm font-semibold text-[var(--ny-muted)] leading-snug">
              У мішку 4 подарунки. Торкніться, щоб розпакувати:{' '}
              <b className="text-[var(--ny-gold)]" aria-live="polite">
                {opened.length} з 4
              </b>
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {GIFTS.map((g, i) => {
                const isOpen = opened.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => openGift(g.id)}
                    aria-pressed={isOpen}
                    aria-label={isOpen ? `${g.tag}: ${g.title}` : `Розпакувати подарунок ${i + 1}`}
                    className={`ny-gift ${isOpen ? 'is-open' : ''} rounded-2xl min-h-[4.75rem] p-2.5 flex flex-col items-center justify-center gap-1 cursor-pointer`}
                  >
                    {isOpen ? (
                      <>
                        <span className="ny-display text-xl text-[var(--ny-gold)] leading-none">{g.tag}</span>
                        <span className="text-xs font-bold text-[var(--ny-text)] leading-tight">{g.title}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl ny-wiggle" aria-hidden>
                          🎁
                        </span>
                        <span className="text-xs font-bold text-[var(--ny-text)]">Подарунок {i + 1}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="w-full space-y-3 pb-2">
              <GoldButton id="hero-v1-start-btn" onClick={() => startQuiz()} className="w-full">
                {allOpened ? 'Забрати подарунки →' : 'Забрати всі подарунки →'}
              </GoldButton>
              <AudienceToggle audience={audience} onChange={changeAudience} />
              <p className="text-[11px] text-[var(--ny-muted)]">{OFFER.disclaimer}</p>
            </div>
          </section>
        )}

        {/* ═══ STEP 0 · V2 — full landing ═══ */}
        {step === 0 && variant === 'v2' && (
          <div className="flex flex-col">
            {/* Hero */}
            <section className="ny-snow relative">
              <div className="max-w-6xl mx-auto px-4 py-8 lg:py-14 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start order-1 min-w-0">
                  <span className="ny-badge">🎅 Подарунки від Діда Мороза</span>
                  <h1 className="ny-display text-[1.75rem] sm:text-4xl lg:text-5xl leading-[1.12] text-[var(--ny-text)]">
                    Дід Мороз уже залишив вашу <span className="text-[var(--ny-gold)]">англійську</span> під ялинкою
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--ny-muted)] max-w-xl">
                    4 подарунки в мішку: знижка {OFFER.discountLabel} на навчання, безкоштовний пробний урок, розмовні клуби
                    та 200 фраз англійською в PDF. Діє до {OFFER.deadlineLabel}.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:w-auto justify-center lg:justify-start">
                    <GoldButton id="hero-v2-start-btn" onClick={() => startQuiz('adult')}>
                      Розпакувати подарунки →
                    </GoldButton>
                    <button
                      id="hero-v2-child-btn"
                      type="button"
                      onClick={() => startQuiz('child')}
                      className="rounded-full py-4 px-6 font-bold whitespace-nowrap border-2 border-[var(--ny-border)] text-[var(--ny-text)] hover:border-[var(--ny-gold)] cursor-pointer"
                    >
                      🧒 Подарунок для дитини
                    </button>
                  </div>
                  <TimerBoxes />
                </div>
                <div className="order-2 rounded-3xl overflow-hidden border border-[var(--ny-border)] shadow-2xl">
                  <Banner />
                </div>
              </div>
            </section>

            {/* What's in the bag */}
            <section className="max-w-6xl mx-auto w-full px-4 py-10">
              <h2 className="ny-display text-2xl sm:text-3xl text-[var(--ny-text)] text-center mb-8">Що лежить у мішку</h2>
              <GiftList />
            </section>

            {/* How */}
            <section className="max-w-6xl mx-auto w-full px-4 py-10">
              <h2 className="ny-display text-2xl sm:text-3xl text-[var(--ny-text)] text-center mb-8">Як забрати подарунки за хвилину</h2>
              <ol className="grid gap-4 md:grid-cols-3">
                {STEPS_HOW.map((s, i) => (
                  <li key={s.title} className="ny-card rounded-2xl p-5 flex gap-4 items-start">
                    <span className="ny-display text-3xl text-[var(--ny-gold)] leading-none">{i + 1}</span>
                    <span>
                      <span className="block font-bold text-[var(--ny-text)]">{s.title}</span>
                      <span className="block text-sm text-[var(--ny-muted)] mt-1">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex justify-center">
                <GoldButton id="how-cta" onClick={() => startQuiz()}>
                  Пройти квіз →
                </GoldButton>
              </div>
            </section>

            {/* 200 phrases */}
            <section className="max-w-6xl mx-auto w-full px-4 py-10">
              <div className="ny-card rounded-3xl p-6 sm:p-10 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 items-center">
                <Cover className="w-full max-w-sm mx-auto rounded-2xl shadow-xl" />
                <div className="flex flex-col gap-4">
                  <span className="ny-badge self-start">🎁 Подарунок №4 · PDF</span>
                  <h2 className="ny-display text-2xl sm:text-3xl text-[var(--ny-text)] leading-tight">
                    200 фраз, які знадобляться вже в січні
                  </h2>
                  <ul className="space-y-2">
                    {PHRASES_POINTS.map((p) => (
                      <li key={p} className="flex gap-3 text-[var(--ny-text)]">
                        <span className="text-[var(--ny-gold)]" aria-hidden>
                          ✦
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[var(--ny-muted)]">Надішлемо PDF на пошту одразу після квізу.</p>
                  <GoldButton id="phrases-cta" onClick={() => startQuiz()} className="self-start">
                    Отримати 200 фраз →
                  </GoldButton>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="max-w-6xl mx-auto w-full px-4 py-10">
              <h2 className="ny-display text-2xl sm:text-3xl text-[var(--ny-text)] text-center mb-8">Що кажуть наші учні</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[...REVIEWS.adult, REVIEWS.child[0]].slice(0, 3).map((r) => (
                  <figure key={r.name + r.text} className="ny-card rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-[var(--ny-gold)] text-sm tracking-widest" aria-label="5 з 5">
                      ★★★★★
                    </span>
                    <blockquote className="text-[var(--ny-text)] leading-relaxed">«{r.text}»</blockquote>
                    <figcaption className="text-sm text-[var(--ny-muted)] font-semibold">
                      {r.name}
                      {r.role && ` · ${r.role}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* Red deadline band */}
            <section className="bg-[#B3141F] mt-6">
              <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
                <div>
                  <h2 className="ny-display text-2xl sm:text-3xl text-[var(--ny-text)]">Опівночі 31 грудня мішок закриється</h2>
                  <p className="mt-2 text-[var(--ny-text)]/85">Встигніть забрати знижку {OFFER.discountLabel} і всі бонуси.</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <TimerBoxes onRed />
                  <GoldButton id="band-cta" onClick={() => startQuiz()}>
                    Забрати подарунки →
                  </GoldButton>
                </div>
              </div>
            </section>

            <footer className="border-t border-[var(--ny-border)]">
              <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-3 justify-between items-center text-sm text-[var(--ny-muted)]">
                <img src={logoWhite} alt="JustSchool" width={150} height={28} loading="lazy" className="h-6 w-auto" />
                <p>
                  {OFFER.disclaimer} Акція діє до {OFFER.deadlineLabel}.
                </p>
              </div>
            </footer>
          </div>
        )}

        {/* ═══ Questions ═══ */}
        {currentQ && (
          <section>
            <h2 className="ny-display text-xl sm:text-2xl text-[var(--ny-text)] text-center leading-tight mb-2">{currentQ.question}</h2>
            {currentQ.subtitle && <p className="text-sm text-center text-[var(--ny-muted)] mb-2">{currentQ.subtitle}</p>}
            <div className="grid gap-3 mt-5">
              {currentQ.options.map((opt) => (
                <OptionButton
                  key={opt.id}
                  opt={opt}
                  multi={currentQ.multi}
                  selected={currentQ.multi ? focus.includes(opt.label) : answers[currentQ.key] === opt.label}
                  onClick={() => (currentQ.multi ? toggleFocus(opt.label) : answerSingle(currentQ.key, opt.label))}
                />
              ))}
            </div>
            {currentQ.multi && (
              <GoldButton onClick={submitFocus} disabled={focus.length === 0} className="w-full mt-6">
                Далі →
              </GoldButton>
            )}
          </section>
        )}

        {/* ═══ Bag almost ready ═══ */}
        {step === STEP_BAG && (
          <section className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-5xl" aria-hidden>
                🎅
              </span>
              <h2 className="ny-display text-2xl text-[var(--ny-text)] leading-tight mt-2">Мішок майже зібрано</h2>
              <p className="text-sm text-[var(--ny-muted)] mt-2">Ось що Дід Мороз уже поклав для вас:</p>
            </div>
            <GiftList compact />
            <GoldButton id="bag-continue-btn" onClick={() => goTo(STEP_LOADER)} className="w-full">
              Зібрати мій мішок →
            </GoldButton>
          </section>
        )}

        {/* ═══ Loader ═══ */}
        {step === STEP_LOADER && (
          <section className="flex flex-col items-center text-center pt-8">
            <div className="ny-display text-6xl text-[var(--ny-gold)] tabular-nums mb-6">{loaderProgress}%</div>
            <div className="w-full h-2.5 rounded-full bg-[var(--ny-border)] overflow-hidden mb-8">
              <div className="h-full bg-[var(--ny-red)] transition-all duration-200" style={{ width: `${loaderProgress}%` }} />
            </div>
            <ul className="w-full space-y-3 text-left">
              {LOADER_STAGES.map((label, i) => {
                const done = i < loaderStage || loaderProgress >= 100;
                const active = i === loaderStage && !done;
                return (
                  <li key={label} className={`flex items-center gap-3 font-semibold ${done || active ? 'text-[var(--ny-text)]' : 'text-[var(--ny-muted)]/60'}`}>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        done
                          ? 'bg-[var(--ny-green)] text-[#141414]'
                          : active
                          ? 'border-2 border-[var(--ny-gold)] border-t-transparent animate-spin'
                          : 'border-2 border-[var(--ny-border)]'
                      }`}
                    >
                      {done ? '✓' : ''}
                    </span>
                    {label}…
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ═══ Summary + form ═══ */}
        {step === STEP_FORM && (
          <section className="flex flex-col gap-5">
            <h2 className="ny-display text-2xl text-[var(--ny-text)] text-center">Ваш новорічний мішок</h2>
            <div className="ny-card rounded-3xl p-5">
              <dl className="grid gap-3 text-sm">
                {(
                  [
                    ['Програма', audience === 'adult' ? 'Англійська для дорослих' : 'Англійська для дитини'],
                    ['Рівень', answers.level],
                    ['Бажання', answers.wish],
                    ['Темп', answers.pace],
                    ['Знижка', `${OFFER.discountLabel} до ${OFFER.deadlineLabel}`],
                    ['Бонуси', 'Пробний урок, розмовні клуби, 200 фраз (PDF)'],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-[var(--ny-border)] pb-2 last:border-0 last:pb-0">
                      <dt className="text-[var(--ny-muted)] shrink-0">{k}</dt>
                      <dd className="text-[var(--ny-text)] font-semibold text-right">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            <form onSubmit={handleSubmitLead} className="ny-form rounded-3xl p-5 space-y-4">
              <h3 className="ny-display text-lg text-[#141414] text-center">Куди доставити подарунки?</h3>
              <label className="block">
                <span className="block text-sm font-bold text-[#141414] mb-1.5">Імʼя</span>
                <input
                  id="lead-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="name"
                  placeholder="Ваше імʼя"
                  className="ny-input w-full p-4 rounded-2xl border-2 outline-none font-semibold bg-white disabled:opacity-50"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-bold text-[#141414] mb-1.5">
                  Email <span className="font-medium text-[var(--text-muted)]">— сюди надішлемо 200 фраз</span>
                </span>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="ny-input w-full p-4 rounded-2xl border-2 outline-none font-semibold bg-white disabled:opacity-50"
                />
              </label>
              <div>
                <label htmlFor="phone-input" className="block text-sm font-bold text-[#141414] mb-1.5">
                  Телефон <span className="font-medium text-[var(--text-muted)]">— щоб призначити пробний урок</span>
                </label>
                <PhoneInput
                  onChange={(raw, valid) => {
                    setRawPhone(raw);
                    setIsPhoneValid(valid);
                  }}
                  initialCountry={geoCountry}
                  disabled={isSubmitting}
                />
              </div>
              <GoldButton id="lead-submit" type="submit" disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()} className="w-full">
                {isSubmitting ? 'Надсилаємо заявку...' : 'Забрати подарунки →'}
              </GoldButton>
              <p className="text-center text-[11px] text-[var(--text-muted)]">{OFFER.disclaimer}</p>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
