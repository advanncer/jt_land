import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  DoorOpen,
  Gift,
  GraduationCap,
  KeyRound,
  Lock,
  MessagesSquare,
  Percent,
  ScanFace,
  Star,
  Ticket,
  Users,
} from 'lucide-react';
import PhoneInput from './PhoneInput';
import logoWhite from './ds/assets/logo-horizontal-white.svg';
import {
  CLUB_FACTS,
  HOW_STEPS,
  IMAGES,
  LOCKED_BONUSES,
  PASSWORD,
  PRIVACY_URL,
  QUESTIONS,
  REDIRECT_DELAY_MS,
  REVIEWS,
  SEATS_LIMIT,
  TIERS,
  TIER_BY_PACE,
  tierBonuses,
} from './data';
import type { Audience, Question, QuestionKey, Tier } from './data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type Variant = 'v1' | 'v2';

const QUIZ_NAME = 'eng-adult-private-club';
const DIALOGUE_ID = 'private_club_2026';

// Step map: 0 entry · 1–5 face control · 6 password accepted · 7 card + form · 8 doors open
const FIRST_Q = 1;
const LAST_Q = 5;
const STEP_ACCEPTED = 6;
const STEP_CARD = 7;
const STEP_OPEN = 8;

const LEAD_TYPE: Record<Audience, string> = {
  adult: 'english-for-adults',
  child: 'english-for-children',
};
const TIER_ORDER: Tier[] = ['silver', 'gold', 'black'];
const ICON = { strokeWidth: 1.25, 'aria-hidden': true } as const;
const BONUS_ICONS = [Percent, GraduationCap, MessagesSquare, Gift];

// Variant strictly by route: /club-v1 → V1, everything else → V2
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

const push = (data: Record<string, unknown>) => (window.dataLayer = window.dataLayer || []).push(data);

// ─── Decorative / shared pieces ────────────────────────────────────────────
function DecoDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`deco-divider ${className}`} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="text-center mb-8">
      <div className="text-xs tracking-[0.3em] text-[var(--c-brass)] mb-2">№ {n}</div>
      <h2 className="font-display text-3xl sm:text-4xl text-[var(--c-text)]">{children}</h2>
      <DecoDivider className="mt-4 mx-auto max-w-[220px]" />
    </div>
  );
}

function PasswordPlate({ revealed, accepted = false, flipIndex = -1 }: { revealed: number; accepted?: boolean; flipIndex?: number }) {
  return (
    <div
      className={`pw-plate ${accepted ? 'is-accepted' : ''}`}
      role="img"
      aria-label={revealed === 0 ? 'Пароль: 5 порожніх клітинок' : `Пароль: ${PASSWORD.slice(0, revealed)}${'_'.repeat(5 - revealed)}`}
    >
      {PASSWORD.split('').map((ch, i) => (
        <span key={i} className={`pw-cell ${i < revealed ? 'is-open' : ''} ${i === flipIndex ? 'is-flipping' : ''}`}>
          {i < revealed ? ch : '_'}
        </span>
      ))}
    </div>
  );
}

function Hero({ className = '' }: { className?: string }) {
  const d = IMAGES.heroDesktop;
  const m = IMAGES.heroMobile;
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={m.src} width={m.w} height={m.h} />
      <img
        src={d.src}
        width={d.w}
        height={d.h}
        alt="Арочні двері приватного клубу JustSchool, з-під яких пробивається тепле світло"
        fetchPriority="high"
        decoding="sync"
        className={`block w-full h-auto ${className}`}
      />
    </picture>
  );
}

function Door({ tier, state, label }: { tier: Tier; state: 'active' | 'muted' | 'neutral'; label?: string }) {
  const t = TIERS[tier];
  const isBlack = tier === 'black';
  return (
    <figure className={`door door--${state} flex flex-col items-center gap-2`}>
      <svg viewBox="0 0 100 170" className="w-full max-w-[120px] h-auto" aria-hidden="true">
        <path d="M6 168 V54 A44 44 0 0 1 94 54 V168 Z" fill="none" stroke="#C9A45C" strokeWidth="1.5" />
        <path
          d="M14 168 V56 A36 36 0 0 1 86 56 V168 Z"
          fill={isBlack ? '#2B2B2B' : '#5A1426'}
          stroke={isBlack ? '#C9A45C' : t.color}
          strokeWidth="2"
        />
        <rect x="24" y="64" width="52" height="40" fill="none" stroke={t.color === '#2B2B2B' ? '#C9A45C' : t.color} strokeWidth="1" />
        <rect x="24" y="112" width="52" height="46" fill="none" stroke={t.color === '#2B2B2B' ? '#C9A45C' : t.color} strokeWidth="1" />
        <circle cx="76" cy="108" r="3" fill="#C9A45C" />
      </svg>
      <figcaption className="text-center">
        <span className="block font-display text-lg" style={{ color: isBlack ? '#C9A45C' : t.color }}>
          {t.name}
        </span>
        {label && <span className="block text-xs tracking-widest uppercase text-[var(--c-brass)] mt-0.5">{label}</span>}
        {state === 'muted' && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--c-muted)] mt-0.5">
            <Lock size={12} {...ICON} /> зачинено
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function LockedBonus({ label, index }: { label: string; index: number }) {
  const Icon = BONUS_ICONS[index] || Gift;
  return (
    <li className="lux-card relative overflow-hidden rounded-xl p-4 min-h-[5.5rem]">
      <div className="flex items-center gap-2 text-sm text-[var(--c-text)]">
        <Icon size={18} {...ICON} className="text-[var(--c-brass)] shrink-0" />
        {label}
      </div>
      {/* placeholder only — the real value is not rendered until the form is sent */}
      <div className="mt-2 font-display text-2xl text-[var(--c-brass)] select-none blur-[6px]" aria-hidden="true">
        ••••••
      </div>
      <span className="absolute right-3 bottom-3 text-[var(--c-brass)]">
        <Lock size={18} strokeWidth={1.25} aria-hidden="true" />
        <span className="sr-only">Відкриється після активації картки</span>
      </span>
    </li>
  );
}

function BrassButton({
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
      className={`brass-btn rounded-full py-4 px-7 text-base font-bold tracking-wide inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function AudienceToggle({ audience, onChange }: { audience: Audience; onChange: (a: Audience) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-[var(--c-line)] p-1" role="tablist" aria-label="Для кого навчання">
      {(['adult', 'child'] as Audience[]).map((a) => (
        <button
          key={a}
          type="button"
          role="tab"
          aria-selected={audience === a}
          onClick={() => onChange(a)}
          className={`rounded-full py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
            audience === a ? 'bg-[var(--c-brass)] text-[var(--c-bg)]' : 'text-[var(--c-muted)] hover:text-[var(--c-text)]'
          }`}
        >
          {a === 'adult' ? 'Для себе' : 'Для дитини'}
        </button>
      ))}
    </div>
  );
}

function MemberCard({ tier, name, number }: { tier: Tier; name: string; number: string }) {
  const t = TIERS[tier];
  const dark = tier === 'black';
  const ink = dark ? '#F4EDE1' : '#1A1816';
  return (
    <div className="member-card relative w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-2xl">
      <img src={t.card} width={IMAGES.card.w} height={IMAGES.card.h} alt={`Членська картка рівня ${t.name}`} className="block w-full h-auto" />
      <div className="absolute inset-0 p-[7%] flex flex-col justify-between" style={{ color: ink }}>
        <div className="flex items-start justify-between">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase opacity-80">JustSchool · Private Club</span>
        </div>
        <div>
          <div className="font-display text-xl sm:text-2xl leading-tight truncate" aria-live="polite">
            {name.trim() ? name.trim().toUpperCase() : 'ВАШЕ ІМʼЯ'}
          </div>
          <div className="mt-2 flex items-end justify-between text-xs sm:text-sm tracking-widest">
            <span className="font-semibold uppercase" style={{ color: dark ? '#C9A45C' : ink }}>
              {t.name} member
            </span>
            <span className="tabular-nums opacity-80">{number}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const variant = useMemo(detectVariant, []);
  const [cardNumber] = useState(() => `№ 2027-${String(Math.floor(1000 + Math.random() * 9000))}`);

  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [paceId, setPaceId] = useState<string>('');
  const [focus, setFocus] = useState<string[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [flipIdx, setFlipIdx] = useState(-1); // letter that is flipping right now

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const [geoCountry, setGeoCountry] = useState('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  const questions: Question[] = QUESTIONS[audience];
  const currentQ = step >= FIRST_Q && step <= LAST_Q ? questions[step - FIRST_Q] : null;
  const tier: Tier = TIER_BY_PACE[paceId] || 'silver';
  const revealed = Math.min(5, Math.max(0, step - FIRST_Q, flipIdx + 1));

  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info fetch error:', err));
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('leadType', LEAD_TYPE[audience]);
      window.history.replaceState({}, '', url.toString());
    } catch {
      /* ignore */
    }
  }, [audience]);

  // Analytics on every step
  useEffect(() => {
    const base = { quiz_name: QUIZ_NAME, quiz_variant: variant, audience, leadType: LEAD_TYPE[audience] };
    const stepName =
      step === 0
        ? `entry_${variant}`
        : currentQ
        ? `question_${currentQ.key}`
        : step === STEP_ACCEPTED
        ? 'password_accepted'
        : step === STEP_CARD
        ? 'member_card_form'
        : 'doors_open';
    push({ event: 'quiz_step_reach', ...base, step_number: step, step_name: stepName });
    if (step === STEP_ACCEPTED) {
      push({ event: 'password_complete', ...base });
      push({ event: 'tier_assigned', ...base, tier });
    }
    if (step === STEP_CARD) push({ event: 'card_form_view', ...base, tier });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Doors open → redirect after REDIRECT_DELAY_MS
  useEffect(() => {
    if (step !== STEP_OPEN || !redirectUrl) return;
    const t = setTimeout(() => (window.location.href = redirectUrl), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [step, redirectUrl]);

  const goTo = (next: number) => {
    setFlipIdx(-1);
    setAnimKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeAudience = (a: Audience) => {
    if (a === audience) return;
    setAudience(a);
    setAnswers({});
    setFocus([]);
    setPaceId('');
  };

  const startQuiz = (a?: Audience) => {
    if (a) changeAudience(a);
    goTo(FIRST_Q);
  };

  const answerSingle = (q: Question, optId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [q.key]: label }));
    if (q.key === 'pace') setPaceId(optId);
    revealNextLetter();
  };

  // Flip the next password letter on the current screen, then move on
  const revealNextLetter = () => {
    if (flipIdx !== -1) return;
    setFlipIdx(step - FIRST_Q);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => goTo(step + 1), reduce ? 150 : 650);
  };

  const toggleFocus = (label: string) =>
    setFocus((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  const submitFocus = () => {
    if (focus.length === 0) return;
    setAnswers((prev) => ({ ...prev, focus: focus.join(', ') }));
    revealNextLetter();
  };

  const canGoBack = step > 0 && step <= STEP_CARD;

  // ─── Lead submission ───────────────────────────────────────────────────
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submission guard
    if (!name.trim() || !email.trim() || !isPhoneValid) return;
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const params = new URLSearchParams(window.location.search);
    const leadType = LEAD_TYPE[audience];
    const tierName = TIERS[tier].name;

    const qa = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      `[КЛУБ JUSTSCHOOL · ВХІД ЗА ПАРОЛЕМ · ${variant.toUpperCase()}]`,
      `Рівень клубу: ${tierName}`,
      `Бонуси рівня: ${tierBonuses(tier).join(', ')}`,
      `Аудиторія: ${audience === 'adult' ? 'Дорослий' : 'Дитина'}`,
      `Вік: ${answers.age || 'Не вказано'}`,
      `Рівень англійської: ${answers.level || 'Не вказано'}`,
      `Мета: ${answers.reason || 'Не вказано'}`,
      `Фокус: ${answers.focus || 'Не вказано'}`,
      `Темп: ${answers.pace || 'Не вказано'}`,
      `Номер картки (декоративний): ${cardNumber}`,
    ].join(' ||| ');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: cleanEmail,
      qa,
      dialogueUrl: window.location.href,
      dialogueName: `Клуб JustSchool · Вхід за паролем (${variant.toUpperCase()})`,
      dialogueId: DIALOGUE_ID,
      quiz_name: QUIZ_NAME,
      quiz_variant: variant,
      club_tier: tier,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign') || 'private_club_2026',
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

    let redirect = fallbackUrl;
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        push({ event: 'form_success', quiz_name: QUIZ_NAME, quiz_variant: variant, audience, leadType, tier });
        window.fbq?.('track', 'Lead');
        const result = await res.json().catch(() => ({}));
        const uri = String(result?.redirectUri || '').trim();
        if (uri && !uri.includes('/uk/onboarding')) redirect = uri;
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
    clearTimeout(fallbackTimer);
    setRedirectUrl(redirect);
    goTo(STEP_OPEN);
  };

  const isLanding = variant === 'v2' && step === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col club-page">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-[var(--c-bg)]/95 backdrop-blur-md border-b border-[var(--c-line)] shrink-0">
        <div className={`mx-auto flex items-center justify-between gap-3 px-4 h-14 ${isLanding ? 'max-w-6xl' : 'max-w-lg'}`}>
          <div className="flex items-center gap-1">
            {canGoBack && (
              <button
                id="back-btn"
                type="button"
                onClick={() => goTo(step - 1)}
                aria-label="Назад"
                className="p-2 -ml-2 text-[var(--c-muted)] hover:text-[var(--c-text)] cursor-pointer"
              >
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
            )}
            <button type="button" onClick={() => goTo(0)} className="cursor-pointer" aria-label="JustSchool — на початок">
              <img src={logoWhite} alt="JustSchool" width={150} height={28} className="h-5 sm:h-6 w-auto" />
            </button>
          </div>
          {isLanding ? (
            <BrassButton id="header-cta" onClick={() => startQuiz()} className="!py-2.5 !px-4 !text-sm">
              Отримати запрошення
            </BrassButton>
          ) : (
            <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-brass)]">Private club</span>
          )}
        </div>
      </header>

      <main key={animKey} className={`step-enter flex-1 w-full mx-auto flex flex-col ${isLanding ? '' : 'max-w-lg px-4 py-6'}`}>
        {/* ═══ ENTRY · V1 ═══ */}
        {step === 0 && variant === 'v1' && (
          <section className="flex flex-col items-center text-center gap-4">
            <span className="lux-badge">
              <KeyRound size={14} {...ICON} /> Вхід за паролем
            </span>
            <h1 className="font-display text-[1.75rem] leading-[1.15] text-[var(--c-text)]">
              Двері клубу відчиняються лише для своїх
            </h1>
            <p className="text-sm text-[var(--c-muted)]">Пройдіть фейс-контроль — 5 питань — і отримайте персональне запрошення</p>
            <div className="w-full rounded-2xl overflow-hidden border border-[var(--c-line)] aspect-[16/10]">
              <Hero className="h-full object-cover" />
            </div>
            <PasswordPlate revealed={0} />
            <div className="w-full space-y-3">
              <BrassButton id="hero-v1-start-btn" onClick={() => startQuiz()} className="w-full">
                Отримати запрошення →
              </BrassButton>
              <AudienceToggle audience={audience} onChange={changeAudience} />
              {SEATS_LIMIT && <p className="text-xs text-[var(--c-muted)]">Місць у клубі: {SEATS_LIMIT}</p>}
            </div>
          </section>
        )}

        {/* ═══ ENTRY · V2 landing ═══ */}
        {isLanding && (
          <div className="flex flex-col">
            <section className="relative">
              <div className="max-w-6xl mx-auto px-4 pt-8 lg:pt-12 grid lg:grid-cols-[1fr_1.15fr] gap-8 items-center">
                <div className="flex flex-col gap-5 items-center lg:items-start text-center lg:text-left">
                  <span className="lux-badge">
                    <KeyRound size={14} {...ICON} /> Вхід за паролем
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-[var(--c-text)]">
                    Двері клубу відчиняються лише для своїх
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--c-muted)] max-w-xl">
                    Приватний англомовний клуб JustSchool. Пройдіть фейс-контроль, зберіть пароль і отримайте рівень доступу з
                    персональною пропозицією.
                  </p>
                  <PasswordPlate revealed={0} />
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start">
                    <BrassButton id="hero-v2-start-btn" onClick={() => startQuiz('adult')}>
                      Отримати запрошення →
                    </BrassButton>
                    <button
                      id="hero-v2-child-btn"
                      type="button"
                      onClick={() => startQuiz('child')}
                      className="rounded-full py-4 px-7 font-semibold whitespace-nowrap border border-[var(--c-brass)] text-[var(--c-text)] hover:bg-[var(--c-brass)]/10 cursor-pointer"
                    >
                      Запрошення для дитини
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[var(--c-line)]">
                  <Hero />
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-16">
              <SectionTitle n="01">Як потрапити в клуб</SectionTitle>
              <ol className="grid gap-4 md:grid-cols-3">
                {HOW_STEPS.map((s, i) => {
                  const Icon = [ScanFace, KeyRound, CreditCard][i];
                  return (
                    <li key={s.title} className="lux-card rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-display text-2xl text-[var(--c-brass)]">№ 0{i + 1}</span>
                        <Icon size={26} {...ICON} className="text-[var(--c-brass)]" />
                      </div>
                      <h3 className="font-display text-xl text-[var(--c-text)]">{s.title}</h3>
                      <p className="mt-2 text-sm text-[var(--c-muted)]">{s.text}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-16">
              <SectionTitle n="02">Що за дверима</SectionTitle>
              <div className="grid gap-6 md:grid-cols-3">
                {TIER_ORDER.map((t) => (
                  <div key={t} className="lux-card rounded-xl p-5 flex flex-col items-center gap-4">
                    <Door tier={t} state="neutral" />
                    <ul className="grid gap-2 w-full">
                      {LOCKED_BONUSES(t).map((b, i) => (
                        <LockedBonus key={b} label={b} index={i} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-[var(--c-muted)] mt-6">
                Рівень доступу визначає ваш темп навчання. Бонуси відкриваються після активації членської картки.
              </p>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-16">
              <SectionTitle n="03">Розмовні клуби JustSchool</SectionTitle>
              <div className="grid gap-4 md:grid-cols-3">
                {CLUB_FACTS.map((f, i) => {
                  const Icon = [MessagesSquare, Users, Ticket][i];
                  return (
                    <div key={f.title} className="lux-card rounded-xl p-6">
                      <Icon size={26} {...ICON} className="text-[var(--c-brass)] mb-3" />
                      <h3 className="font-display text-xl text-[var(--c-text)]">{f.title}</h3>
                      <p className="mt-2 text-sm text-[var(--c-muted)]">{f.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-8">
                <BrassButton id="clubs-cta" onClick={() => startQuiz()}>
                  Пройти фейс-контроль →
                </BrassButton>
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-16">
              <SectionTitle n="04">Що кажуть учасники</SectionTitle>
              <div className="grid gap-4 md:grid-cols-3">
                {REVIEWS.map((r) => (
                  <figure key={r.name} className="lux-card rounded-xl p-6 flex flex-col gap-3">
                    <span className="flex gap-1 text-[var(--c-brass)]" role="img" aria-label="Оцінка 5 з 5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={14} strokeWidth={1.25} aria-hidden="true" />
                      ))}
                    </span>
                    <blockquote className="font-display text-lg leading-snug text-[var(--c-text)]">«{r.text}»</blockquote>
                    <figcaption className="text-sm text-[var(--c-muted)]">{r.name}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="mt-16 bg-[var(--c-velvet)] border-y border-[var(--c-brass)]/40">
              <div className="max-w-3xl mx-auto px-4 py-14 text-center flex flex-col items-center gap-5">
                <DecoDivider className="w-full max-w-[260px]" />
                <h2 className="font-display text-3xl sm:text-4xl text-[var(--c-text)]">Ваше запрошення вже підписане</h2>
                <p className="text-[var(--c-text)]/80">Залишилось пройти фейс-контроль і назвати пароль.</p>
                <BrassButton id="velvet-cta" onClick={() => startQuiz()}>
                  Отримати запрошення →
                </BrassButton>
              </div>
            </section>

            <footer className="border-t border-[var(--c-line)]">
              <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-3 justify-between items-center text-sm text-[var(--c-muted)]">
                <img src={logoWhite} alt="JustSchool" width={150} height={28} loading="lazy" className="h-6 w-auto" />
                <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[var(--c-text)]">
                  Політика конфіденційності
                </a>
              </div>
            </footer>
          </div>
        )}

        {/* ═══ FACE CONTROL ═══ */}
        {currentQ && (
          <section className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <PasswordPlate revealed={revealed} flipIndex={flipIdx} />
              <span className="text-xs tracking-[0.25em] uppercase text-[var(--c-muted)]">
                Питання {step - FIRST_Q + 1} з {LAST_Q - FIRST_Q + 1}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-center text-[var(--c-text)] leading-tight">{currentQ.question}</h2>
            <div className="grid gap-3">
              {currentQ.options.map((opt, i) => {
                const selected = currentQ.multi ? focus.includes(opt.label) : answers[currentQ.key] === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={currentQ.multi ? selected : undefined}
                    onClick={() => (currentQ.multi ? toggleFocus(opt.label) : answerSingle(currentQ, opt.id, opt.label))}
                    className={`lux-option w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left cursor-pointer ${selected ? 'is-selected' : ''}`}
                  >
                    <span className="font-display text-sm text-[var(--c-brass)] w-8 shrink-0">0{i + 1}</span>
                    <span className="flex-1 text-base font-medium text-[var(--c-text)]">{opt.label}</span>
                    {currentQ.multi ? (
                      <span
                        className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 ${
                          selected ? 'bg-[var(--c-brass)] border-[var(--c-brass)] text-[var(--c-bg)]' : 'border-[var(--c-line)]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check size={14} strokeWidth={2} />}
                      </span>
                    ) : (
                      <span className="text-[var(--c-brass)]" aria-hidden="true">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {currentQ.multi && (
              <BrassButton onClick={submitFocus} disabled={focus.length === 0} className="w-full">
                Далі →
              </BrassButton>
            )}
          </section>
        )}

        {/* ═══ PASSWORD ACCEPTED ═══ */}
        {step === STEP_ACCEPTED && (
          <section className="flex flex-col items-center text-center gap-5">
            <PasswordPlate revealed={5} accepted />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--c-text)]">Пароль прийнято</h2>
              <p className="mt-1 text-[var(--c-muted)]">Ваш рівень доступу визначено</p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full">
              {TIER_ORDER.map((t) => (
                <Door key={t} tier={t} state={t === tier ? 'active' : 'muted'} label={t === tier ? 'Ваші двері' : undefined} />
              ))}
            </div>
            <DecoDivider className="w-full max-w-[220px]" />
            <ul className="grid grid-cols-2 gap-3 w-full text-left">
              {LOCKED_BONUSES(tier).map((b, i) => (
                <LockedBonus key={b} label={b} index={i} />
              ))}
            </ul>
            <BrassButton id="activate-card-btn" onClick={() => goTo(STEP_CARD)} className="w-full">
              Активувати членську картку →
            </BrassButton>
          </section>
        )}

        {/* ═══ MEMBER CARD + FORM ═══ */}
        {step === STEP_CARD && (
          <section className="flex flex-col gap-5">
            <h2 className="font-display text-2xl text-center text-[var(--c-text)]">Членська картка {TIERS[tier].name}</h2>
            <MemberCard tier={tier} name={name} number={cardNumber} />
            <form onSubmit={handleSubmitLead} className="lux-card rounded-xl p-5 space-y-4">
              <label className="block">
                <span className="block text-sm text-[var(--c-muted)] mb-1.5">Імʼя</span>
                <input
                  id="lead-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  maxLength={40}
                  autoComplete="name"
                  placeholder="Як до вас звертатися"
                  className="lux-input w-full px-4 py-3.5 rounded-xl border outline-none bg-white font-medium disabled:opacity-50"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-[var(--c-muted)] mb-1.5">Email</span>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="lux-input w-full px-4 py-3.5 rounded-xl border outline-none bg-white font-medium disabled:opacity-50"
                />
              </label>
              <div>
                <label htmlFor="phone-input" className="block text-sm text-[var(--c-muted)] mb-1.5">
                  Телефон
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
              <BrassButton id="lead-submit" type="submit" disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()} className="w-full">
                {isSubmitting ? 'Відчиняємо...' : 'Відчинити двері →'}
              </BrassButton>
              <p className="text-[11px] leading-relaxed text-[var(--c-muted)] text-center">
                Натискаючи «Відчинити двері», ви погоджуєтеся на обробку персональних даних відповідно до{' '}
                <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--c-text)]">
                  Політики конфіденційності
                </a>
                .
              </p>
            </form>
          </section>
        )}

        {/* ═══ DOORS OPEN ═══ */}
        {step === STEP_OPEN && (
          <section className="flex flex-col items-center text-center gap-6">
            <div className="door-stage" aria-hidden="true">
              <div className="door-light" />
              <div className={`door-leaf door-leaf--${tier}`}>
                <span className="door-panel" />
                <span className="door-panel" />
                <span className="door-knob" />
              </div>
            </div>
            <div className="reveal reveal-1">
              <DoorOpen size={28} {...ICON} className="mx-auto text-[var(--c-brass)]" />
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--c-text)] mt-2">
                Ласкаво просимо до клубу{name.trim() ? `, ${name.trim()}` : ''}
              </h2>
              <p className="text-sm text-[var(--c-muted)] mt-1">Рівень доступу: {TIERS[tier].name}</p>
            </div>
            <ul className="grid gap-3 w-full text-left reveal reveal-2">
              {tierBonuses(tier).map((b, i) => {
                const Icon = BONUS_ICONS[i] || Gift;
                return (
                  <li key={b} className="lux-card rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <Icon size={20} {...ICON} className="text-[var(--c-brass)] shrink-0" />
                    <span className="text-[var(--c-text)] font-medium">{b}</span>
                  </li>
                );
              })}
            </ul>
            <div className="w-full reveal reveal-3">
              <BrassButton id="go-now-btn" onClick={() => redirectUrl && (window.location.href = redirectUrl)} className="w-full">
                Перейти зараз →
              </BrassButton>
              <p className="text-xs text-[var(--c-muted)] mt-2">Переходимо до особистого кабінету за кілька секунд…</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
