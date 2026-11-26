import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PhoneInput from './PhoneInput';
import logoBlack from './ds/assets/logo-horizontal-black.svg';
import { DAYS, FOOTNOTE, GOAL, HERO_DAYS, LEVEL, MARQUEE, OFFER, PRIVACY_URL, TIME, lessonsWord } from './data';
import type { Question, QuestionKey } from './data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const QUIZ_NAME = 'eng-adult-offer';
const DIALOGUE_ID = 'adults_offer_2026';
const LEAD_TYPE = 'english-for-adults';

// Step map: 0 hero · 1 level · 2 goal · 3 days · 4 time · 5 loader · 6 form · 7 success
const STEP_LOADER = 5;
const STEP_FORM = 6;
const STEP_SUCCESS = 7;
const QUIZ_STEPS = 4;
const STEP_NAMES = ['hero', 'level', 'goal', 'days', 'time', 'loader', 'lead_form', 'success'];

const push = (data: Record<string, unknown>) => (window.dataLayer = window.dataLayer || []).push(data);
const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function WeekRow({ active, dark = false }: { active: string[]; dark?: boolean }) {
  return (
    <div className="grid grid-cols-7 gap-1" aria-label={`Дні занять: ${active.join(', ') || 'не обрано'}`} role="img">
      {DAYS.map((d) => {
        const on = active.includes(d);
        return (
          <span
            key={d}
            className={`h-8 rounded-md flex items-center justify-center text-xs font-bold ${
              dark ? (on ? 'bg-[var(--accent)] text-white' : 'bg-white/10 text-white/50') : on ? 'bg-[#111] text-white' : 'bg-[#E6E6E3] text-[var(--grey)]'
            }`}
          >
            {d}
          </span>
        );
      })}
    </div>
  );
}

function OptionButton({ opt, selected, onClick }: { opt: { label: string; subtitle?: string }; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`opt w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl text-left cursor-pointer ${selected ? 'is-selected' : ''}`}
    >
      <span>
        <span className="block font-bold text-base">{opt.label}</span>
        {opt.subtitle && <span className="block text-sm text-[var(--grey)] mt-0.5">{opt.subtitle}</span>}
      </span>
      <span className="text-[var(--accent)] font-bold" aria-hidden="true">
        →
      </span>
    </button>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [days, setDays] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); // auto-advance in progress
  const [loader, setLoader] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  const orderedDays = DAYS.filter((d) => days.includes(d));
  const n = orderedDays.length;

  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((data) => {
        setIpInfo(data);
        if (data?.country) setGeoCountry(data.country);
      })
      .catch((err) => console.error('IP info fetch error:', err));
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', LEAD_TYPE);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    push({ event: 'quiz_step_reach', quiz_name: QUIZ_NAME, step_number: step, step_name: STEP_NAMES[step], leadType: LEAD_TYPE });
  }, [step]);

  const goTo = (next: number) => {
    setBusy(false);
    setAnimKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  // Loader 0 → 100% in ~1.7 s
  useEffect(() => {
    if (step !== STEP_LOADER) return;
    const start = performance.now();
    const total = reducedMotion() ? 300 : 1700;
    const id = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / total);
      setLoader(Math.round(k * 100));
      if (k >= 1) {
        window.clearInterval(id);
        window.setTimeout(() => goTo(STEP_FORM), 250);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [step]);

  const answer = (q: Question, label: string) => {
    if (busy) return;
    setBusy(true);
    setAnswers((prev) => ({ ...prev, [q.key]: label }));
    window.setTimeout(() => goTo(step + 1), 180);
  };

  const toggleDay = (d: string) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submitDays = () => {
    if (n === 0) return;
    push({ event: 'days_selected', quiz_name: QUIZ_NAME, count: n, days: orderedDays.join(', ') });
    goTo(4);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submission guard
    if (!name.trim() || !email.trim() || !isPhoneValid) return;
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const params = new URLSearchParams(window.location.search);
    const qa = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      '[АНГЛІЙСЬКА ДЛЯ ДОРОСЛИХ · ОФЕР: ПЕРШИЙ УРОК 0 ГРН / ВІД 86 ГРН]',
      `Рівень: ${answers.level || 'Не вказано'}`,
      `Мета: ${answers.goal || 'Не вказано'}`,
      `Дні: ${orderedDays.join(', ') || 'Не вказано'}`,
      `Занять на тиждень: ${n}`,
      `Час: ${answers.time || 'Не вказано'}`,
      `Креатив (utm_content): ${params.get('utm_content') || 'не вказано'}`,
    ].join(' ||| ');

    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: cleanEmail,
      qa,
      dialogueUrl: window.location.href,
      dialogueName: 'Англійська для дорослих · Офер',
      dialogueId: DIALOGUE_ID,
      quiz_name: QUIZ_NAME,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      utm_subject: 'English',
      subject: 'English',
      leadType: LEAD_TYPE,
      lead_type: LEAD_TYPE,
      Lead_type: LEAD_TYPE,
    };

    const fallbackUrl = cleanEmail
      ? `https://id.justschool.me/login?email=${encodeURIComponent(cleanEmail)}`
      : 'https://student.justschool.me/onboarding';
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
        push({ event: 'form_success', quiz_name: QUIZ_NAME, leadType: LEAD_TYPE, lessons_per_week: n });
        window.fbq?.('track', 'Lead');
        const result = await res.json().catch(() => ({}));
        const uri = String(result?.redirectUri || '').trim();
        if (uri && !uri.includes('/uk/onboarding')) redirect = uri;
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
    clearTimeout(fallbackTimer);
    goTo(STEP_SUCCESS);
    window.setTimeout(() => (window.location.href = redirect), 1500);
  };

  const quizIdx = step >= 1 && step <= 4 ? step : 0;
  const q: Question | null = step === 1 ? LEVEL : step === 2 ? GOAL : step === 4 ? TIME : null;

  return (
    <div className="min-h-[100dvh] page">
      <div className="mx-auto w-full max-w-[480px] min-h-[100dvh] flex flex-col">
        {/* Marquee */}
        <div className="marquee">
          <span className="sr-only">{MARQUEE.join(' · ')}</span>
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((k) => (
              <span key={k} className="marquee-group">
                {MARQUEE.map((t) => (
                  <span key={t}>
                    {t}
                    <i>·</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <header className="h-12 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            {quizIdx > 0 && (
              <button id="back-btn" type="button" onClick={() => goTo(step - 1)} aria-label="Назад" className="p-2 -ml-2 cursor-pointer">
                <ArrowLeft size={20} strokeWidth={2} />
              </button>
            )}
            <img src={logoBlack} alt="JustSchool" width={150} height={28} className="h-5 w-auto" />
          </div>
          {quizIdx > 0 && (
            <span className="text-sm font-bold text-[var(--grey)] tabular-nums">
              {quizIdx}/{QUIZ_STEPS}
            </span>
          )}
        </header>
        {quizIdx > 0 && (
          <div className="h-1 bg-[#E6E6E3] mx-4 rounded-full overflow-hidden" role="progressbar" aria-valuenow={quizIdx} aria-valuemin={0} aria-valuemax={QUIZ_STEPS}>
            <div className="h-full bg-[var(--accent)] transition-[width] duration-300" style={{ width: `${(quizIdx / QUIZ_STEPS) * 100}%` }} />
          </div>
        )}

        <main key={animKey} className="step-enter flex-1 px-4 pt-3 pb-6 flex flex-col">
          {/* ═══ HERO ═══ */}
          {step === 0 && (
            <section className="flex flex-col gap-3">
              <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--grey)]">ОНЛАЙН · З ВИКЛАДАЧЕМ · ДЛЯ ДОРОСЛИХ</p>
              <h1 className="display hero-h1">Англійська для дорослих</h1>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="ticket ticket--dark">
                  <span className="ticket-label">Перший урок</span>
                  <span className="display ticket-price">{OFFER.firstLessonPrice} грн</span>
                  <span className="ticket-note">спробуйте безкоштовно</span>
                </div>
                <div className="ticket ticket--light">
                  <span className="ticket-label">Далі</span>
                  <span className="display ticket-price">від {OFFER.pricePerLesson} грн</span>
                  <span className="ticket-note">за урок*</span>
                </div>
              </div>
              <div className="card p-3 flex flex-col gap-2">
                <p className="text-sm font-bold">
                  {OFFER.bestLessonsPerWeek} заняття на тиждень <span className="text-[var(--grey)] font-medium">· дні обираєте ви</span>
                </p>
                <WeekRow active={HERO_DAYS} />
              </div>
              <button id="hero-start-btn" type="button" onClick={() => goTo(1)} className="cta">
                Спробувати безкоштовно →
              </button>
              <p className="text-[11px] text-[var(--grey)]">{FOOTNOTE}</p>
            </section>
          )}

          {/* ═══ Single-choice questions ═══ */}
          {q && (
            <section className="flex flex-col gap-3 pt-3">
              <h2 className="display text-[2.5rem] leading-[0.92]">{q.question}</h2>
              <div className="grid gap-2.5 mt-2">
                {q.options.map((o) => (
                  <OptionButton key={o.id} opt={o} selected={answers[q.key] === o.label} onClick={() => answer(q, o.label)} />
                ))}
              </div>
            </section>
          )}

          {/* ═══ Days ═══ */}
          {step === 3 && (
            <section className="flex flex-col gap-3 pt-3">
              <h2 className="display text-[2.5rem] leading-[0.92]">Зберіть свій тиждень англійської</h2>
              <div className="grid grid-cols-7 gap-1.5 mt-2" role="group" aria-label="Дні тижня">
                {DAYS.map((d) => {
                  const on = days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleDay(d)}
                      className={`day-btn h-14 rounded-xl font-bold cursor-pointer ${on ? 'is-on' : ''}`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div
                aria-live="polite"
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  n >= OFFER.bestLessonsPerWeek ? 'bg-[var(--accent)] text-white' : 'bg-white border border-[#E1E1DD]'
                }`}
              >
                {n === 0 && 'Оберіть хоча б один день'}
                {n > 0 && n < OFFER.bestLessonsPerWeek &&
                  `${n} ${lessonsWord(n)} на тиждень. При ${OFFER.bestLessonsPerWeek} заняттях на тиждень урок коштуватиме від ${OFFER.pricePerLesson} грн.`}
                {n >= OFFER.bestLessonsPerWeek &&
                  `${n} ${lessonsWord(n)} на тиждень. Найвигідніший темп: від ${OFFER.pricePerLesson} грн за урок*`}
              </div>
              <button id="days-next-btn" type="button" onClick={submitDays} disabled={n === 0} className="cta">
                Далі →
              </button>
              {n >= OFFER.bestLessonsPerWeek && <p className="text-[11px] text-[var(--grey)]">{FOOTNOTE}</p>}
            </section>
          )}

          {/* ═══ Loader ═══ */}
          {step === STEP_LOADER && (
            <section className="flex-1 flex flex-col justify-center gap-4 py-16" role="status">
              <h2 className="display text-[2.5rem] leading-[0.92]">Складаємо ваш розклад і програму</h2>
              <div className="h-3 rounded-full bg-[#E6E6E3] overflow-hidden">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${loader}%` }} />
              </div>
              <span className="display text-5xl tabular-nums">{loader}%</span>
            </section>
          )}

          {/* ═══ Form ═══ */}
          {step === STEP_FORM && (
            <section className="flex flex-col gap-4 pt-2">
              <div className="rounded-2xl bg-[#111] text-white p-4 flex flex-col gap-3">
                <span className="display text-2xl tracking-wide">ВАШ ТИЖДЕНЬ</span>
                <WeekRow active={orderedDays} dark />
                <dl className="grid gap-1.5 text-sm">
                  {(
                    [
                      ['Рівень', answers.level],
                      ['Мета', answers.goal],
                      ['Час', answers.time],
                      ['Перший урок', `${OFFER.firstLessonPrice} грн`],
                      ...(n >= OFFER.bestLessonsPerWeek ? [['Далі', `від ${OFFER.pricePerLesson} грн/урок*`]] : []),
                    ] as [string, string | undefined][]
                  )
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-1.5 last:border-0">
                        <dt className="text-white/60">{k}</dt>
                        <dd className="font-semibold text-right">{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
              <h2 className="display text-[2rem] leading-[0.95]">Куди надіслати запрошення на безкоштовний урок?</h2>
              <form onSubmit={handleSubmitLead} className="flex flex-col gap-3">
                <label className="block">
                  <span className="block text-sm font-semibold mb-1">Імʼя</span>
                  <input id="lead-name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} required autoComplete="name" className="field disabled:opacity-50" />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold mb-1">Email</span>
                  <input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} required autoComplete="email" className="field disabled:opacity-50" />
                </label>
                <div>
                  <label htmlFor="phone-input" className="block text-sm font-semibold mb-1">
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
                <button id="lead-submit" type="submit" disabled={isSubmitting || !isPhoneValid || !name.trim() || !email.trim()} className="cta mt-1">
                  {isSubmitting ? 'Надсилаємо заявку...' : 'Записатися безкоштовно →'}
                </button>
                <p className="text-[11px] leading-snug text-[var(--grey)]">
                  Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних відповідно до{' '}
                  <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline">
                    Політики конфіденційності
                  </a>
                  .{n >= OFFER.bestLessonsPerWeek && ` ${FOOTNOTE}`}
                </p>
              </form>
            </section>
          )}

          {/* ═══ Success ═══ */}
          {step === STEP_SUCCESS && (
            <section className="flex-1 flex flex-col justify-center gap-4 py-16" role="status">
              <h2 className="display text-[3rem] leading-[0.9]">Тиждень англійської зібрано</h2>
              <WeekRow active={orderedDays} />
              <p className="text-[var(--grey)]">Переходимо до особистого кабінету…</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
