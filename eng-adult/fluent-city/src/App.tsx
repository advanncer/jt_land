import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Coins,
  Flame,
  Gamepad2,
  GraduationCap,
  MapPin,
  MessagesSquare,
  Percent,
  Phone,
  Star,
  Trophy,
} from 'lucide-react';
import PhoneInput from './PhoneInput';
import logoWhite from './ds/assets/logo-horizontal-white.svg';
import {
  CURATOR_MESSAGES,
  GAME,
  HOW_STEPS,
  IMAGES,
  LOADING_TIP,
  LOCATIONS,
  MAP_PLACES,
  MISSIONS,
  MISSION_MARKS,
  PRIVACY_URL,
  REDIRECT_DELAY_MS,
  REVIEWS,
  TIPS,
  rewardCards,
} from './data';
import type { Audience, LocationId, Mission, QuestionKey } from './data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type Variant = 'v1' | 'v2';
type Phase = 'question' | 'complete' | 'tip';

const QUIZ_NAME = 'eng-adult-fluent-city';
const DIALOGUE_ID = 'fluent_city_2026';

// Step map: 0 start · 1–5 missions · 6 final mission (curator call + form) · 7 jackpot
const FIRST_M = 1;
const LAST_M = 5;
const STEP_FINAL = 6;
const STEP_JACKPOT = 7;

const LEAD_TYPE: Record<Audience, string> = {
  adult: 'english-for-adults',
  child: 'english-for-children',
};
const ICON = { strokeWidth: 2, 'aria-hidden': true } as const;
const REWARD_ICONS = [Percent, GraduationCap, MessagesSquare];

const detectVariant = (): Variant => (/-v1\/?$/.test(window.location.pathname) ? 'v1' : 'v2');
const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const initialAudience = (): Audience => {
  try {
    const lt = (new URLSearchParams(window.location.search).get('leadType') || '').toLowerCase();
    if (lt.includes('child')) return 'child';
  } catch {
    /* ignore */
  }
  return 'adult';
};

// Loading screen only on the first visit in this browser session (V1)
const shouldBoot = (variant: Variant) => {
  if (variant !== 'v1' || reducedMotion()) return false;
  try {
    if (sessionStorage.getItem('fc_booted')) return false;
    sessionStorage.setItem('fc_booted', '1');
  } catch {
    /* storage unavailable: still show it once per page load */
  }
  return true;
};

const push = (data: Record<string, unknown>) => (window.dataLayer = window.dataLayer || []).push(data);
const money = (n: number) => `$ ${n.toLocaleString('en-US')}`;

// Count-up for the HUD money counter (instant with reduced motion)
function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;
    if (from === target) return;
    const duration = reducedMotion() ? 0 : 700;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = duration ? Math.min(1, (t - start) / duration) : 1;
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

// ─── HUD & game pieces ─────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`Рівень впевненості: ${count} з ${GAME.missions}`}>
      {Array.from({ length: GAME.missions }, (_, i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={i < count ? 'hud-star is-on' : 'hud-star'}
          fill={i < count ? '#FFD23F' : 'none'}
          color={i < count ? '#000' : '#B8BCC4'}
        />
      ))}
    </span>
  );
}

function MoneyCounter({ value }: { value: number }) {
  const shown = useCountUp(value);
  return (
    <span className="font-game text-lg text-[var(--g-money)] tabular-nums leading-none" aria-label={`Ігрові бонуси: ${value}`}>
      {money(shown)}
    </span>
  );
}

function MiniMap({
  size = 96,
  done,
  current,
  goalLocation,
  className = '',
}: {
  size?: number;
  done: number;
  current: number; // 0-based mission index, -1 = none
  goalLocation?: LocationId | null;
  className?: string;
}) {
  return (
    <div
      className={`minimap ${className}`}
      style={{ width: size, height: size, backgroundImage: `url(${IMAGES.map.src})` }}
      role="img"
      aria-label={`Мінімапа: виконано ${done} з ${GAME.missions} місій`}
    >
      {MISSION_MARKS.map((m, i) => {
        const pos = i === 1 && goalLocation ? LOCATIONS[goalLocation] : m;
        const state = i < done ? 'is-done' : i === current ? 'is-current' : '';
        return <span key={i} className={`map-mark ${state}`} style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />;
      })}
    </div>
  );
}

function Hero({ className = '' }: { className?: string }) {
  const d = IMAGES.heroDesktop;
  const m = IMAGES.heroMobile;
  return (
    <picture>
      <source media="(max-width: 767px)" type="image/webp" srcSet={m.webp} width={m.w} height={m.h} />
      <source media="(max-width: 767px)" srcSet={m.src} width={m.w} height={m.h} />
      <source type="image/webp" srcSet={d.webp} />
      <img
        src={d.src}
        width={d.w}
        height={d.h}
        alt="Хлопець у навушниках сидить на капоті й дивиться на вечірнє місто з мітками аеропорту, офісу та кафе"
        fetchPriority="high"
        decoding="sync"
        className={`block w-full h-auto ${className}`}
      />
    </picture>
  );
}

function OrangeButton({
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
      className={`comic-btn font-game rounded-xl py-3.5 px-6 text-2xl uppercase inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function AudienceToggle({ audience, onChange }: { audience: Audience; onChange: (a: Audience) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 hud-panel rounded-xl p-1" role="tablist" aria-label="За кого граєте">
      {(['adult', 'child'] as Audience[]).map((a) => (
        <button
          key={a}
          type="button"
          role="tab"
          aria-selected={audience === a}
          onClick={() => onChange(a)}
          className={`rounded-lg py-2.5 text-sm font-bold cursor-pointer transition-colors ${
            audience === a ? 'bg-[var(--g-accent)] text-[#111214]' : 'text-[var(--g-muted)] hover:text-white'
          }`}
        >
          {a === 'adult' ? 'Граю за себе' : 'За дитину'}
        </button>
      ))}
    </div>
  );
}

function RewardCard({ i, title, text, className = '' }: { i: number; title: string; text: string; className?: string }) {
  const Icon = REWARD_ICONS[i] || Trophy;
  return (
    <div className={`comic-card rounded-xl p-5 flex items-start gap-4 ${className}`}>
      <span className="w-12 h-12 rounded-lg bg-[var(--g-mark)] border-2 border-black flex items-center justify-center shrink-0">
        <Icon size={24} {...ICON} color="#111214" />
      </span>
      <span>
        <span className="block font-game text-lg text-white leading-tight">{title}</span>
        <span className="block text-sm text-[var(--g-muted)] mt-1">{text}</span>
      </span>
    </div>
  );
}

function Typing() {
  return (
    <span className="typing" aria-label="Куратор друкує">
      <i />
      <i />
      <i />
    </span>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const variant = useMemo(detectVariant, []);
  const [booting, setBooting] = useState(() => shouldBoot(variant));

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [completed, setCompleted] = useState(0);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [goalLocation, setGoalLocation] = useState<LocationId | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [chatShown, setChatShown] = useState(0);
  const [mapPlace, setMapPlace] = useState<LocationId>('hq');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const [geoCountry, setGeoCountry] = useState('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});
  const timers = useRef<number[]>([]);

  const missions: Mission[] = MISSIONS[audience];
  const mIndex = step - FIRST_M; // 0-based
  const currentM = step >= FIRST_M && step <= LAST_M ? missions[mIndex] : null;
  const missionLabel = currentM
    ? currentM.location === null && goalLocation
      ? LOCATIONS[goalLocation].name.toUpperCase()
      : currentM.locationLabel
    : '';

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Loading screen (V1 first visit): 1.5 s
  useEffect(() => {
    if (!booting) return;
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, [booting]);

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

  useEffect(() => {
    const base = { quiz_name: QUIZ_NAME, quiz_variant: variant, audience, leadType: LEAD_TYPE[audience] };
    const stepName =
      step === 0
        ? `start_${variant}`
        : currentM
        ? `mission_${step}_${currentM.key}`
        : step === STEP_FINAL
        ? 'final_mission'
        : 'jackpot';
    push({ event: 'quiz_step_reach', ...base, step_number: step, step_name: stepName });
    if (step === STEP_FINAL) push({ event: 'final_mission_view', ...base });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Curator chat: messages appear one by one with a typing indicator
  useEffect(() => {
    if (step !== STEP_FINAL) return;
    if (reducedMotion()) {
      setChatShown(CURATOR_MESSAGES.length);
      return;
    }
    setChatShown(0);
    const ids = CURATOR_MESSAGES.map((_, i) => window.setTimeout(() => setChatShown(i + 1), 900 * (i + 1)));
    return () => ids.forEach(clearTimeout);
  }, [step]);

  // Jackpot → redirect after REDIRECT_DELAY_MS
  useEffect(() => {
    if (step !== STEP_JACKPOT || !redirectUrl) return;
    const t = setTimeout(() => (window.location.href = redirectUrl), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [step, redirectUrl]);

  const goTo = (next: number) => {
    setPhase('question');
    setAnimKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeAudience = (a: Audience) => {
    if (a === audience) return;
    setAudience(a);
    setAnswers({});
    setFocus([]);
    setGoalLocation(null);
    setCompleted(0);
  };

  const startGame = (a?: Audience) => {
    if (a) changeAudience(a);
    push({ event: 'game_start', quiz_name: QUIZ_NAME, quiz_variant: variant, audience: a || audience, leadType: LEAD_TYPE[a || audience] });
    goTo(FIRST_M);
  };

  // Mission done: plate + $1000 + star + green mark → tip → next mission
  const completeMission = () => {
    if (phase !== 'question') return;
    const n = step - FIRST_M + 1;
    setPhase('complete');
    setCompleted(n);
    push({ event: 'mission_complete', quiz_name: QUIZ_NAME, quiz_variant: variant, audience, n });
    const fast = reducedMotion();
    later(() => {
      if (step >= LAST_M) return goTo(STEP_FINAL);
      setPhase('tip');
      later(() => goTo(step + 1), fast ? 300 : 600);
    }, fast ? 400 : 900);
  };

  const answerSingle = (m: Mission, optLabel: string, loc?: LocationId) => {
    if (phase !== 'question') return;
    setAnswers((prev) => ({ ...prev, [m.key]: optLabel }));
    if (m.key === 'goal' && loc) setGoalLocation(loc);
    completeMission();
  };

  const toggleFocus = (label: string) =>
    setFocus((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  const submitFocus = () => {
    if (focus.length === 0) return;
    setAnswers((prev) => ({ ...prev, focus: focus.join(', ') }));
    completeMission();
  };

  const handleBack = () => {
    if (phase !== 'question') return;
    if (step > FIRST_M && step <= STEP_FINAL) setCompleted(Math.max(0, step - FIRST_M - 1));
    if (step === FIRST_M) setCompleted(0);
    goTo(step - 1);
  };

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
      `[FLUENT CITY · МІСІЯ: ЗАГОВОРИТИ · ${variant.toUpperCase()}]`,
      `Гра: Fluent City, ${completed}/${GAME.missions} місій`,
      `Подарунки: ${rewardCards().map((r) => r.title).join(', ')}`,
      `Аудиторія: ${audience === 'adult' ? 'Дорослий' : 'Дитина'}`,
      `Рівень: ${answers.level || 'Не вказано'}`,
      `Ціль: ${answers.goal || 'Не вказано'}`,
      `Навички: ${answers.focus || 'Не вказано'}`,
      `Темп: ${answers.pace || 'Не вказано'}`,
      `Час: ${answers.time || 'Не вказано'}`,
    ].join(' ||| ');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: cleanEmail,
      qa,
      dialogueUrl: window.location.href,
      dialogueName: `Fluent City · Місія: заговорити (${variant.toUpperCase()})`,
      dialogueId: DIALOGUE_ID,
      quiz_name: QUIZ_NAME,
      quiz_variant: variant,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign') || 'fluent_city_2026',
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
        push({ event: 'form_success', quiz_name: QUIZ_NAME, quiz_variant: variant, audience, leadType });
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
    goTo(STEP_JACKPOT);
  };

  const isLanding = variant === 'v2' && step === 0;
  const inGame = step > 0;
  const tip = TIPS[Math.max(0, mIndex) % TIPS.length];
  const rewards = rewardCards();

  return (
    <div className="min-h-[100dvh] flex flex-col game-page">
      {/* ─── Loading screen (V1, first visit) ─── */}
      {booting && (
        <div className="boot-screen" role="status" aria-label="Завантаження гри">
          <div className="font-game text-4xl text-white tracking-wider">FLUENT CITY</div>
          <div className="boot-bar">
            <span />
          </div>
          <p className="text-sm text-[var(--g-muted)] max-w-[260px] text-center">{LOADING_TIP}</p>
        </div>
      )}

      {/* ─── HUD ─── */}
      <header className="hud sticky top-0 z-40 shrink-0">
        <div className={`mx-auto flex items-center justify-between gap-3 px-3 h-14 ${isLanding ? 'max-w-6xl' : 'max-w-lg'}`}>
          <div className="flex items-center gap-1 min-w-0">
            {inGame && step <= STEP_FINAL && (
              <button
                id="back-btn"
                type="button"
                onClick={handleBack}
                aria-label="Назад"
                className="hud-btn w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
            )}
            <button type="button" onClick={() => goTo(0)} className="cursor-pointer shrink-0 px-1" aria-label="JustSchool — на початок">
              <img src={logoWhite} alt="JustSchool" width={150} height={28} className="h-5 sm:h-6 w-auto" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {isLanding && (
              <span className="hidden md:block">
                <OrangeButton id="header-cta" onClick={() => startGame()} className="!py-2 !px-4 !text-sm">
                  Почати гру
                </OrangeButton>
              </span>
            )}
            <div className="hud-panel rounded-lg px-2.5 py-1.5 flex flex-col items-end gap-1">
              <MoneyCounter value={completed * GAME.bonusPerMission} />
              <Stars count={completed} />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mission complete overlay: plate + flying bonus ─── */}
      {currentM && phase === 'complete' && (
        <>
          <div className="mission-plate" role="status">
            <Check size={22} strokeWidth={3} aria-hidden="true" />
            <span className="font-game">МІСІЮ ВИКОНАНО</span>
            <span className="font-game">+$1000</span>
          </div>
          <span className="fly-bonus font-game" aria-hidden="true">
            +$1000
          </span>
        </>
      )}

      <main key={animKey} className={`step-enter flex-1 w-full mx-auto flex flex-col ${isLanding ? '' : 'max-w-lg px-4 pt-5 pb-32'}`}>
        {/* ═══ START · V1 ═══ */}
        {step === 0 && variant === 'v1' && (
          <section className="flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden border-2 border-black comic-shadow">
              <Hero className="aspect-[4/3] object-cover object-[50%_35%]" />
              <span className="badge-new absolute left-3 top-3">
                <Gamepad2 size={14} {...ICON} /> Нова гра
              </span>
            </div>
            <h1 className="font-game text-[1.85rem] leading-[1.1] text-white uppercase">5 місій — і ви заговорите англійською</h1>
            <p className="text-[var(--g-muted)]">Проходьте місії, збирайте бонуси й обміняйте їх на реальні подарунки</p>
            <div className="flex items-center gap-4">
              <MiniMap size={88} done={0} current={-1} className="shrink-0" />
              <p className="text-sm text-[var(--g-muted)]">
                <span className="font-game text-white">5 міток</span> на мапі міста. Кожна місія — коротке питання і{' '}
                <span className="text-[var(--g-money)] font-bold">+$1000</span> ігрових бонусів.
              </p>
            </div>
            <OrangeButton id="hero-v1-start-btn" onClick={() => startGame()} className="w-full">
              Почати гру →
            </OrangeButton>
            <AudienceToggle audience={audience} onChange={changeAudience} />
            <p className="text-[11px] text-[var(--g-muted)]">{GAME.disclaimer}</p>
          </section>
        )}

        {/* ═══ START · V2 landing ═══ */}
        {isLanding && (
          <div className="flex flex-col">
            <section className="relative halftone border-b-2 border-black">
              <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 grid lg:grid-cols-[1fr_1.25fr] gap-8 items-center">
                <div className="flex flex-col gap-5 items-center lg:items-start text-center lg:text-left">
                  <span className="badge-new">
                    <Gamepad2 size={14} {...ICON} /> Нова гра
                  </span>
                  <h1 className="font-game text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white uppercase">
                    5 місій — і ви заговорите англійською
                  </h1>
                  <p className="text-lg text-[var(--g-muted)] max-w-xl">
                    Проходьте місії, збирайте бонуси й обміняйте їх на реальні подарунки.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start">
                    <OrangeButton id="hero-v2-start-btn" onClick={() => startGame('adult')}>
                      Почати гру →
                    </OrangeButton>
                    <button
                      id="hero-v2-child-btn"
                      type="button"
                      onClick={() => startGame('child')}
                      className="comic-btn-ghost font-game rounded-xl py-3.5 px-6 text-2xl uppercase whitespace-nowrap cursor-pointer"
                    >
                      Грати за дитину
                    </button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-black comic-shadow-lg">
                  <Hero />
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-14">
              <h2 className="section-title">Карта міста</h2>
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-center">
                <div className="relative rounded-xl overflow-hidden border-2 border-black comic-shadow max-w-[560px] w-full mx-auto">
                  <img src={IMAGES.map.src} width={IMAGES.map.w} height={IMAGES.map.h} alt="Ігрова мапа міста з локаціями місій" loading="lazy" decoding="async" className="block w-full h-auto" />
                  {MAP_PLACES.map((id) => {
                    const p = LOCATIONS[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onMouseEnter={() => setMapPlace(id)}
                        onFocus={() => setMapPlace(id)}
                        onClick={() => setMapPlace(id)}
                        aria-pressed={mapPlace === id}
                        aria-label={p.name}
                        className={`map-pin ${mapPlace === id ? 'is-active' : ''}`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      >
                        <img src={p.icon} width={64} height={80} alt="" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
                <div className="hud-panel rounded-xl p-6" aria-live="polite">
                  <div className="flex items-center gap-2 text-[var(--g-mark)] font-game uppercase">
                    <MapPin size={18} {...ICON} /> {LOCATIONS[mapPlace].name}
                  </div>
                  <p className="mt-2 text-lg text-white">{LOCATIONS[mapPlace].text}</p>
                  <ul className="mt-5 grid grid-cols-2 gap-2">
                    {MAP_PLACES.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setMapPlace(id)}
                          className={`w-full text-left text-sm rounded-lg px-3 py-2 border-2 cursor-pointer ${
                            mapPlace === id ? 'border-[var(--g-mark)] text-white' : 'border-[#2a2d33] text-[var(--g-muted)]'
                          }`}
                        >
                          {LOCATIONS[id].name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-14">
              <h2 className="section-title">Що можна виграти</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {rewards.map((r, i) => (
                  <RewardCard key={r.id} i={i} title={r.title} text={r.text} />
                ))}
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-14">
              <h2 className="section-title">Як це працює</h2>
              <ol className="grid gap-4 md:grid-cols-3">
                {HOW_STEPS.map((s, i) => (
                  <li key={s.title} className="comic-card rounded-xl p-5">
                    <span className="font-game text-4xl text-[var(--g-cta)] leading-none">0{i + 1}</span>
                    <h3 className="font-game text-xl text-white mt-3 uppercase">{s.title}</h3>
                    <p className="text-sm text-[var(--g-muted)] mt-1">{s.text}</p>
                  </li>
                ))}
              </ol>
              <div className="flex justify-center mt-8">
                <OrangeButton id="how-cta" onClick={() => startGame()}>
                  Почати гру →
                </OrangeButton>
              </div>
            </section>

            <section className="max-w-6xl mx-auto w-full px-4 pt-14">
              <h2 className="section-title">Гравці кажуть</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {REVIEWS.map((r) => (
                  <figure key={r.name} className="flex flex-col gap-6">
                    <blockquote className="speech-bubble">«{r.text}»</blockquote>
                    <figcaption className="font-game text-[var(--g-accent)] pl-14">{r.name}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="mt-14 bg-[var(--g-cta)] border-y-2 border-black halftone-orange">
              <div className="max-w-3xl mx-auto px-4 py-14 text-center flex flex-col items-center gap-5">
                <h2 className="font-game text-4xl text-white uppercase text-outline">Гра чекає на вас</h2>
                <p className="text-white text-lg">5 місій, $5000 ігрових бонусів і реальні подарунки наприкінці.</p>
                <button
                  id="final-cta"
                  type="button"
                  onClick={() => startGame()}
                  className="font-game rounded-xl py-4 px-7 text-lg uppercase bg-white text-[#111214] border-2 border-black comic-shadow cursor-pointer active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Почати гру →
                </button>
              </div>
            </section>

            <footer className="border-t-2 border-black">
              <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4 text-sm text-[var(--g-muted)]">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <img src={logoWhite} alt="JustSchool" width={150} height={28} loading="lazy" className="h-6 w-auto" />
                  <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
                    Політика конфіденційності
                  </a>
                </div>
                <p className="text-xs text-center sm:text-left">{GAME.disclaimer}</p>
              </div>
            </footer>
          </div>
        )}

        {/* ═══ MISSIONS ═══ */}
        {currentM && phase !== 'tip' && (
          <section className="flex flex-col gap-4">
            <div className="font-game text-sm tracking-wider text-[var(--g-mark)] uppercase">
              Місія {step}/{GAME.missions} · {missionLabel}
            </div>
            <h2 className="font-game text-2xl sm:text-3xl text-white leading-tight">{currentM.question}</h2>
            <div className="grid gap-3">
              {currentM.options.map((opt) => {
                const selected = currentM.multi ? focus.includes(opt.label) : answers[currentM.key] === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={currentM.multi ? selected : undefined}
                    disabled={phase !== 'question'}
                    onClick={() => (currentM.multi ? toggleFocus(opt.label) : answerSingle(currentM, opt.label, opt.location))}
                    className={`game-option w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left cursor-pointer ${selected ? 'is-selected' : ''}`}
                  >
                    <span className="flex-1">
                      <span className="block font-bold text-white">{opt.label}</span>
                      {opt.subtitle && (
                        <span className="block text-xs uppercase tracking-wider text-[var(--g-accent)] mt-0.5">{opt.subtitle}</span>
                      )}
                    </span>
                    {currentM.multi ? (
                      <span
                        className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center shrink-0 ${
                          selected ? 'bg-[var(--g-money)]' : 'bg-[#2a2d33]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check size={16} strokeWidth={3} color="#111214" />}
                      </span>
                    ) : (
                      <span className="font-game text-[var(--g-cta)]" aria-hidden="true">
                        ›
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {currentM.multi && (
              <OrangeButton onClick={submitFocus} disabled={focus.length === 0 || phase !== 'question'} className="w-full">
                Далі →
              </OrangeButton>
            )}
          </section>
        )}

        {/* ═══ Mini-loading between missions ═══ */}
        {currentM && phase === 'tip' && (
          <section className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16" role="status">
            <div className="font-game text-white uppercase tracking-wider">Завантаження місії {step + 1}</div>
            <div className="boot-bar boot-bar--short">
              <span />
            </div>
            <p className="font-game text-xl text-[var(--g-accent)]">{tip.en}</p>
            <p className="text-sm text-[var(--g-muted)]">{tip.uk}</p>
          </section>
        )}

        {/* Minimap on mission screens */}
        {currentM && (
          <MiniMap done={completed} current={phase === 'question' ? mIndex : -1} goalLocation={goalLocation} className="minimap--fixed" />
        )}

        {/* ═══ FINAL MISSION: curator call ═══ */}
        {step === STEP_FINAL && (
          <section className="flex flex-col items-center gap-3">
            <div className="font-game text-sm tracking-wider text-[var(--g-mark)] uppercase">Фінальна місія · Дзвінок від куратора</div>
            <div className="phone">
              <div className="phone-notch" aria-hidden="true" />
              <div className="phone-head">
                <span className="w-9 h-9 rounded-full bg-[var(--g-cta)] border-2 border-black flex items-center justify-center">
                  <Phone size={16} {...ICON} color="#fff" />
                </span>
                <span>
                  <span className="block font-bold text-white text-sm">Куратор JustSchool</span>
                  <span className="block text-[11px] text-[var(--g-money)]">онлайн</span>
                </span>
              </div>
              <div className="chat" aria-live="polite">
                {CURATOR_MESSAGES.slice(0, chatShown).map((msg, i) => (
                  <p key={i} className="bubble">
                    {i === 0 && <Flame size={16} {...ICON} className="inline -mt-0.5 mr-1 text-[var(--g-cta)]" />}
                    {msg}
                  </p>
                ))}
                {chatShown < CURATOR_MESSAGES.length && <Typing />}
              </div>
              {chatShown >= CURATOR_MESSAGES.length && (
                <form onSubmit={handleSubmitLead} className="phone-form space-y-2.5">
                  <label className="block">
                    <span className="sr-only">Імʼя</span>
                    <input
                      id="lead-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      required
                      autoComplete="name"
                      placeholder="Імʼя"
                      className="phone-input w-full px-4 py-3 rounded-xl outline-none bg-white disabled:opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      autoComplete="email"
                      placeholder="Email"
                      className="phone-input w-full px-4 py-3 rounded-xl outline-none bg-white disabled:opacity-50"
                    />
                  </label>
                  <div>
                    <label htmlFor="phone-input" className="sr-only">
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
                  <OrangeButton id="lead-submit" type="submit" disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()} className="w-full">
                    {isSubmitting ? 'Переказуємо бонуси...' : 'Забрати куш →'}
                  </OrangeButton>
                  <p className="text-[10px] leading-snug text-[var(--g-muted)] text-center">
                    Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних відповідно до{' '}
                    <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline">
                      Політики конфіденційності
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </section>
        )}

        {/* ═══ JACKPOT ═══ */}
        {step === STEP_JACKPOT && (
          <section className="flex flex-col items-center text-center gap-5">
            <div className="jackpot font-game text-[var(--g-money)]" aria-hidden="true">
              $5000
            </div>
            <div className="exchange flex items-center gap-2 font-game text-white uppercase">
              <Coins size={20} {...ICON} className="text-[var(--g-money)]" /> Бонуси обміняно на подарунки
            </div>
            <div className="grid gap-3 w-full text-left">
              {rewards.map((r, i) => (
                <RewardCard key={r.id} i={i} title={r.title} text={r.text} className={`reward-in reward-in-${i + 1}`} />
              ))}
            </div>
            <div className="reward-in reward-in-4 w-full">
              <p className="font-game text-[var(--g-accent)] uppercase">Нова гра відкрита: перше заняття</p>
              <OrangeButton id="go-now-btn" onClick={() => redirectUrl && (window.location.href = redirectUrl)} className="w-full mt-4">
                Перейти зараз →
              </OrangeButton>
              <p className="text-xs text-[var(--g-muted)] mt-2">Переходимо до особистого кабінету за кілька секунд…</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
