import React, { useEffect, useMemo, useState } from 'react';
import PhoneInput from './PhoneInput';
import { Card } from './ds/components/core/Card';
import logoWhite from './ds/assets/logo-horizontal-white.svg';
import {
  FAQ,
  HERO_BULLETS,
  LOADER_STAGES,
  OFFER,
  PRICE_LINE,
  QUESTIONS,
  formatUah,
} from './data';
import type { Question, QuestionKey } from './data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type Audience = 'adult' | 'child';
type Variant = 'v1' | 'v2';

const QUIZ_NAME = 'eng-adult-friday-13';
const DIALOGUE_ID = 'friday_13_2026';

// Step map: 0 hero · 1–6 questions · 7 discount screen · 8 loader · 9 plan + form
const FIRST_Q = 1;
const LAST_Q = 6;
const STEP_DISCOUNT = 7;
const STEP_LOADER = 8;
const STEP_FORM = 9;

const LEAD_TYPE: Record<Audience, string> = {
  adult: 'english-for-adults',
  child: 'english-for-children',
};

// Variant strictly by route: /friday-13-v1 → V1, everything else → V2
const detectVariant = (): Variant =>
  /-v1\/?$/.test(window.location.pathname) ? 'v1' : 'v2';

const initialAudience = (): Audience => {
  try {
    const lt = (new URLSearchParams(window.location.search).get('leadType') || '').toLowerCase();
    if (lt.includes('child')) return 'child';
  } catch {
    /* ignore */
  }
  return 'adult';
};

// Seconds left until midnight in Kyiv time (offer ends 23:59)
const secondsToMidnight = (): number => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: OFFER.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value || 0);
  return Math.max(0, 86400 - (get('hour') * 3600 + get('minute') * 60 + get('second')));
};

function useCountdown() {
  const [left, setLeft] = useState(secondsToMidnight);
  useEffect(() => {
    const id = setInterval(() => setLeft(secondsToMidnight()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map(pad);
}

// ─── Small presentational pieces ────────────────────────────────────────────

function Countdown({ compact = false }: { compact?: boolean }) {
  const [h, m, s] = useCountdown();
  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-1.5">
        До кінця акції
      </span>
      <div className="flex items-center gap-1.5" role="timer" aria-live="off">
        {[h, m, s].map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[var(--f13-cta)] font-black">:</span>}
            <span
              className={`f13-display tabular-nums rounded-xl bg-white/[0.06] border border-white/10 text-white text-center ${
                compact ? 'text-lg px-2 py-1 min-w-[2.6rem]' : 'text-2xl px-2.5 py-1.5 min-w-[3.2rem]'
              }`}
            >
              {v}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PromoBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--f13-cta)]/40 bg-[var(--f13-cta)]/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--f13-cta)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] f13-pulse" />
      Пʼятниця 13 · Лише сьогодні
    </span>
  );
}

function Big13({ size = 'lg' }: { size?: 'md' | 'lg' }) {
  return (
    <div className="relative select-none flex items-center justify-center" aria-hidden="true">
      <span className={`f13-outline ${size === 'lg' ? 'text-[9.5rem] sm:text-[11rem]' : 'text-[7rem]'}`}>13</span>
      <span className="absolute -right-2 top-4 rotate-12 rounded-xl bg-[var(--brand)] px-2.5 py-1 f13-display text-xl text-white shadow-lg">
        −{OFFER.discountPercent}%
      </span>
    </div>
  );
}

function PriceBlock() {
  if (!OFFER.price || !OFFER.oldPrice) return null;
  return (
    <div className="flex items-baseline justify-center gap-3">
      <span className="f13-display text-3xl text-white">
        {formatUah(OFFER.price)} <span className="text-base font-bold">грн/міс</span>
      </span>
      <span className="text-base font-semibold text-white/40 line-through">
        {formatUah(OFFER.oldPrice)}
      </span>
    </div>
  );
}

function CtaButton({
  children,
  onClick,
  id,
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="f13-cta w-full rounded-full py-4 px-6 text-base sm:text-lg font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function AudienceToggle({
  audience,
  onChange,
}: {
  audience: Audience;
  onChange: (a: Audience) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] border border-white/10 p-1" role="tablist">
      {(['adult', 'child'] as Audience[]).map((a) => {
        const active = audience === a;
        return (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(a)}
            className={`rounded-full py-2.5 text-sm font-bold transition-colors cursor-pointer ${
              active ? 'bg-white text-[var(--f13-bg)]' : 'text-white/70 hover:text-white'
            }`}
          >
            {a === 'adult' ? '🧑 Дорослі' : '🧒 Дитина'}
          </button>
        );
      })}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-left">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 text-sm font-semibold text-white/85">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[11px] font-black text-white">
            ✓
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

function OptionButton({
  emoji,
  label,
  subtitle,
  selected,
  multi,
  onClick,
}: {
  emoji?: string;
  label: string;
  subtitle?: string;
  selected?: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      className={`f13-option w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left cursor-pointer active:scale-[0.98] ${
        selected ? 'is-selected' : ''
      }`}
    >
      {emoji && (
        <span className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.06]">
          {emoji}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-bold text-base text-white">{label}</span>
        {subtitle && <span className="block text-xs font-medium text-white/55 mt-0.5">{subtitle}</span>}
      </span>
      {multi ? (
        <span
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 text-xs font-black ${
            selected ? 'bg-[var(--f13-cta)] border-[var(--f13-cta)] text-black' : 'border-white/30'
          }`}
        >
          {selected ? '✓' : ''}
        </span>
      ) : (
        <span className="text-lg shrink-0 font-bold text-[var(--brand)]">›</span>
      )}
    </button>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const variant = useMemo(detectVariant, []);

  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [multi, setMulti] = useState<string[]>([]);
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

  // GEO detection for PhoneInput
  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info fetch error:', err));
  }, []);

  // Keep leadType in URL in sync with audience (other params, incl. UTMs, are preserved)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('leadType', LEAD_TYPE[audience]);
      window.history.replaceState({}, '', url.toString());
    } catch {
      /* ignore */
    }
  }, [audience]);

  // quiz_step_reach on every step change
  useEffect(() => {
    const stepName =
      step === 0
        ? `hero_${variant}`
        : currentQ
        ? `question_${currentQ.key}`
        : step === STEP_DISCOUNT
        ? 'discount_waiting'
        : step === STEP_LOADER
        ? 'loader'
        : 'plan_lead_form';
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

  // Loader 0 → 100%
  useEffect(() => {
    if (step !== STEP_LOADER) return;
    setLoaderProgress(0);
    const id = setInterval(() => {
      setLoaderProgress((p) => Math.min(100, p + 1));
    }, 35);
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
    setMulti([]);
  };

  const answerSingle = (key: QuestionKey, label: string) => {
    setAnswers((prev) => ({ ...prev, [key]: label }));
    goTo(step + 1);
  };

  const toggleMulti = (label: string) =>
    setMulti((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  const submitMulti = () => {
    if (multi.length === 0) return;
    setAnswers((prev) => ({ ...prev, aspects: multi.join(', ') }));
    goTo(step + 1);
  };

  const canGoBack = step > 0 && step !== STEP_LOADER && step !== STEP_FORM;
  const handleBack = () => goTo(step === STEP_DISCOUNT ? LAST_Q : step - 1);

  // ─── Lead submission ────────────────────────────────────────────────────
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
      `[ПʼЯТНИЦЯ 13 · 2026 · ${variant.toUpperCase()}]`,
      `Пропозиція: знижка −${OFFER.discountPercent}% на навчання${PRICE_LINE ? ` (${PRICE_LINE})` : ''}, діє до ${OFFER.deadlineLabel}`,
      `Аудиторія: ${audience === 'adult' ? 'Дорослий' : 'Дитина'}`,
      `Вік: ${answers.age || 'Не вказано'}`,
      `Рівень: ${answers.level || 'Не вказано'}`,
      `Мета: ${answers.goal || 'Не вказано'}`,
      `Навички: ${answers.aspects || 'Не вказано'}`,
      `Інтенсивність: ${answers.intensity || 'Не вказано'}`,
      `Зручний час: ${answers.schedule || 'Не вказано'}`,
    ].join(' ||| ');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: cleanEmail,
      qa,
      dialogueUrl: window.location.href,
      dialogueName: `Пʼятниця 13 · 2026 Quiz (${variant.toUpperCase()})`,
      dialogueId: DIALOGUE_ID,
      quiz_name: QUIZ_NAME,
      quiz_variant: variant,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign') || 'friday_13_2026',
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

  return (
    <div className="min-h-[100dvh] flex flex-col f13-page">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[var(--f13-bg)]/90 backdrop-blur-md shrink-0">
        <div className="w-14">
          {canGoBack && (
            <button
              id="back-btn"
              type="button"
              onClick={handleBack}
              aria-label="Назад"
              className="p-2 -ml-2 text-xl font-bold text-white/70 hover:text-white cursor-pointer"
            >
              ←
            </button>
          )}
        </div>
        <img src={logoWhite} alt="JustSchool" className="h-6 w-auto" />
        <div className="w-14 text-right">
          {currentQ ? (
            <span className="text-xs font-bold text-white/50">
              {step - FIRST_Q + 1}/{questions.length}
            </span>
          ) : (
            <span className="f13-display text-xs text-[var(--f13-cta)]">−{OFFER.discountPercent}%</span>
          )}
        </div>
      </header>

      {currentQ && (
        <div className="h-1 bg-white/10 shrink-0">
          <div
            className="h-full bg-[var(--brand)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <main key={animKey} className="step-enter flex-1 w-full max-w-lg mx-auto px-4 py-5 sm:py-8 flex flex-col">
        {/* ═══ STEP 0 · V1 — single screen ═══ */}
        {step === 0 && variant === 'v1' && (
          <section className="flex-1 flex flex-col items-center text-center gap-4">
            <PromoBadge />
            <Countdown compact />
            <Big13 size="md" />
            <div>
              <h1 className="f13-display text-2xl sm:text-3xl text-white leading-tight">
                −{OFFER.discountPercent}% на навчання англійської
              </h1>
              <p className="mt-2 text-sm font-medium text-white/60">
                Діє до {OFFER.deadlineLabel}
              </p>
            </div>
            <PriceBlock />
            <div className="w-full space-y-3">
              <CtaButton id="hero-v1-start-btn" onClick={() => goTo(FIRST_Q)}>
                Розпочати зараз <span aria-hidden>→</span>
              </CtaButton>
              <AudienceToggle audience={audience} onChange={changeAudience} />
            </div>
            <div className="w-full pt-1">
              <Bullets items={HERO_BULLETS[audience]} />
            </div>
          </section>
        )}

        {/* ═══ STEP 0 · V2 — full landing ═══ */}
        {step === 0 && variant === 'v2' && (
          <div className="flex flex-col gap-10">
            <section className="flex flex-col items-center text-center gap-5">
              <PromoBadge />
              <Big13 size="lg" />
              <div>
                <h1 className="f13-display text-3xl sm:text-4xl text-white leading-tight">
                  Пʼятниця 13 —<br />
                  <span className="text-[var(--f13-cta)]">−{OFFER.discountPercent}%</span> на навчання
                </h1>
                <p className="mt-3 text-base font-medium text-white/65">
                  Пройдіть короткий тест, отримайте персональний план і зафіксуйте знижку до{' '}
                  {OFFER.deadlineLabel}.
                </p>
              </div>
              <Countdown />
              <PriceBlock />
              <div className="w-full space-y-3">
                <AudienceToggle audience={audience} onChange={changeAudience} />
                <CtaButton id="hero-v2-start-btn" onClick={() => goTo(FIRST_Q)}>
                  Розпочати зараз <span aria-hidden>→</span>
                </CtaButton>
                <p className="text-xs font-semibold text-white/45">6 питань · менше 1 хвилини</p>
              </div>
            </section>

            <section className="f13-panel rounded-3xl p-5">
              <h2 className="f13-display text-lg text-white mb-4">Що ви отримуєте</h2>
              <Bullets items={HERO_BULLETS[audience]} />
            </section>

            <section>
              <h2 className="f13-display text-lg text-white mb-4 text-center">Як забрати знижку</h2>
              <ol className="grid gap-3">
                {[
                  ['Пройдіть тест', '6 коротких питань про рівень, мету та графік'],
                  ['Отримайте план', 'Персональна програма під ваші відповіді'],
                  ['Залиште контакти', `Знижка −${OFFER.discountPercent}% закріпиться за вами`],
                ].map(([t, d], i) => (
                  <li key={t} className="f13-panel rounded-2xl p-4 flex items-center gap-4">
                    <span className="f13-display text-2xl text-[var(--brand)] w-8 shrink-0">{i + 1}</span>
                    <span>
                      <span className="block font-bold text-white">{t}</span>
                      <span className="block text-sm text-white/60">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="f13-display text-lg text-white mb-4 text-center">Питання</h2>
              <div className="grid gap-2">
                {FAQ.map((f) => (
                  <details key={f.q} className="f13-panel rounded-2xl p-4 group">
                    <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-white">
                      {f.q}
                      <span className="text-[var(--f13-cta)] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="flex flex-col items-center gap-4 text-center pb-4">
              <Countdown compact />
              <CtaButton id="hero-v2-bottom-btn" onClick={() => goTo(FIRST_Q)}>
                Забрати −{OFFER.discountPercent}% <span aria-hidden>→</span>
              </CtaButton>
            </section>
          </div>
        )}

        {/* ═══ STEPS 1–6 · Questions ═══ */}
        {currentQ && (
          <section>
            <h2 className="f13-display text-xl sm:text-2xl text-white text-center leading-tight mb-2">
              {currentQ.question}
            </h2>
            <p className="text-sm text-center font-medium text-white/60 mb-6">{currentQ.subtitle}</p>
            <div className="grid gap-3">
              {currentQ.options.map((opt) => (
                <OptionButton
                  key={opt.id}
                  emoji={opt.emoji}
                  label={opt.label}
                  subtitle={opt.subtitle}
                  multi={currentQ.multi}
                  selected={currentQ.multi ? multi.includes(opt.label) : answers[currentQ.key] === opt.label}
                  onClick={() =>
                    currentQ.multi ? toggleMulti(opt.label) : answerSingle(currentQ.key, opt.label)
                  }
                />
              ))}
            </div>
            {currentQ.multi && (
              <div className="mt-6">
                <CtaButton onClick={submitMulti} disabled={multi.length === 0}>
                  Далі <span aria-hidden>→</span>
                </CtaButton>
              </div>
            )}
          </section>
        )}

        {/* ═══ STEP 7 · Discount is waiting ═══ */}
        {step === STEP_DISCOUNT && (
          <section className="flex-1 flex flex-col items-center text-center gap-5 pt-4">
            <span className="text-5xl" aria-hidden>🎁</span>
            <h2 className="f13-display text-2xl sm:text-3xl text-white leading-tight">
              Ваша знижка вже чекає
            </h2>
            <div className="f13-panel rounded-3xl px-6 py-5 w-full">
              <div className="f13-display text-6xl text-[var(--f13-cta)]">−{OFFER.discountPercent}%</div>
              <p className="mt-2 text-sm font-semibold text-white/70">на навчання · до {OFFER.deadlineLabel}</p>
              {PRICE_LINE && <p className="mt-3 text-base font-bold text-white">{PRICE_LINE}</p>}
            </div>
            <p className="text-sm font-medium text-white/65">
              Ще мить — складемо персональний план за вашими відповідями і закріпимо знижку.
            </p>
            <Countdown compact />
            <div className="w-full">
              <CtaButton id="discount-continue-btn" onClick={() => goTo(STEP_LOADER)}>
                Отримати план <span aria-hidden>→</span>
              </CtaButton>
            </div>
          </section>
        )}

        {/* ═══ STEP 8 · Loader ═══ */}
        {step === STEP_LOADER && (
          <section className="flex-1 flex flex-col items-center text-center pt-8">
            <div className="f13-display text-6xl text-[var(--f13-cta)] tabular-nums mb-6">{loaderProgress}%</div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden mb-8">
              <div className="h-full bg-[var(--brand)] transition-all duration-200" style={{ width: `${loaderProgress}%` }} />
            </div>
            <ul className="w-full space-y-3 text-left">
              {LOADER_STAGES.map((label, i) => {
                const done = i < loaderStage || loaderProgress >= 100;
                const active = i === loaderStage && !done;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 text-base font-semibold transition-colors ${
                      done || active ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        done ? 'bg-[var(--brand)] text-white' : active ? 'border-2 border-[var(--f13-cta)] border-t-transparent animate-spin' : 'border-2 border-white/20'
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

        {/* ═══ STEP 9 · Plan summary + lead form ═══ */}
        {step === STEP_FORM && (
          <section className="flex flex-col gap-5">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white mb-3">
                План готовий · знижку активовано
              </span>
              <h2 className="f13-display text-2xl text-white leading-tight">
                {audience === 'adult' ? 'Ваш персональний план' : 'План для вашої дитини'}
              </h2>
            </div>

            <div className="f13-panel rounded-3xl p-5">
              <dl className="grid gap-3 text-sm">
                {(
                  [
                    ['Вік', answers.age],
                    ['Рівень', answers.level],
                    ['Мета', answers.goal],
                    ['Фокус', answers.aspects],
                    ['Інтенсивність', answers.intensity],
                    ['Час занять', answers.schedule],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0">
                      <dt className="text-white/55 font-medium shrink-0">{k}</dt>
                      <dd className="text-white font-semibold text-right">{v}</dd>
                    </div>
                  ))}
              </dl>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--f13-cta)]/10 border border-[var(--f13-cta)]/30 px-4 py-3">
                <span className="text-sm font-bold text-[var(--f13-cta)]">Знижка Пʼятниці 13</span>
                <span className="f13-display text-xl text-[var(--f13-cta)]">−{OFFER.discountPercent}%</span>
              </div>
              {PRICE_LINE && <p className="mt-3 text-center text-sm font-bold text-white">{PRICE_LINE}</p>}
            </div>

            <Card variant="raised" padding="md">
              <p className="text-sm font-bold text-center mb-4" style={{ color: 'var(--text-strong)' }}>
                Залиште контакти, щоб закріпити знижку до {OFFER.deadlineLabel}
              </p>
              <form onSubmit={handleSubmitLead} className="space-y-3" noValidate={false}>
                <input
                  id="lead-name"
                  type="text"
                  placeholder="Ваше імʼя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="name"
                  className="f13-input w-full p-4 rounded-2xl border-2 outline-none font-semibold bg-white disabled:opacity-50"
                />
                <input
                  id="lead-email"
                  type="email"
                  placeholder="Ваш e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  className="f13-input w-full p-4 rounded-2xl border-2 outline-none font-semibold bg-white disabled:opacity-50"
                />
                <PhoneInput
                  onChange={(raw, valid) => {
                    setRawPhone(raw);
                    setIsPhoneValid(valid);
                  }}
                  initialCountry={geoCountry}
                  disabled={isSubmitting}
                />
                <CtaButton
                  id="lead-submit"
                  type="submit"
                  disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()}
                >
                  {isSubmitting ? 'Надсилаємо заявку...' : `Закріпити −${OFFER.discountPercent}% →`}
                </CtaButton>
                <p className="text-center text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Ваші дані в безпеці · Без спаму
                </p>
              </form>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
