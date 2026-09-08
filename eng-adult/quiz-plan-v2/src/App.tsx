import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import { STEPS, WORDS } from './data';
import { Button } from './ds/components/core/Button';
import { Badge } from './ds/components/core/Badge';
import { Card } from './ds/components/core/Card';
import { Tag } from './ds/components/core/Tag';
import { BrandShape } from './ds/components/core/BrandShape';
import logoBlack from './ds/assets/logo-horizontal-black.svg';

// Steps shown in the progress counter (choice + multi + word_test)
const PROGRESS_STEPS = [2, 3, 4, 5, 6, 8, 10, 11];
const TOTAL_PROGRESS = PROGRESS_STEPS.length;

export default function App() {
  // ─── State ───────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});
  const [checkedWords, setCheckedWords] = useState<Set<string>>(new Set());

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [animKey, setAnimKey] = useState(0);

  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // ─── GEO detection & URL leadType ────────────────────────
  useEffect(() => {
    // Automatically add leadType=english-for-adults to address bar URL if not present
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
      quiz_name: 'eng-adult-quiz-plan-v2',
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

  const toggleWord = (word: string) => {
    setCheckedWords(prev => {
      const next = new Set(prev);
      next.has(word) ? next.delete(word) : next.add(word);
      return next;
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
    if (checkedWords.size > 0)
      qaArr.push(`Q100: ${Array.from(checkedWords).join(', ')}`);

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaArr.join('|||'),
      dialogueUrl: window.location.href,
      dialogueName: "JustSchool Quiz v2",
      dialogueId: "unknown",
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
        const result = await res.json();
        window.location.href =
          result?.redirectUri || 'https://justschool.me/uk/onboarding';
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
    <div
      className="min-h-[100dvh] flex flex-col"
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
          {canGoBack && (
            <button
              id="back-btn"
              onClick={back}
              aria-label="Назад"
              className="p-2 -ml-2 transition-colors text-xl leading-none font-bold"
              style={{ color: 'var(--text-secondary)' }}
            >
              ←
            </button>
          )}
        </div>

        {/* Logo in Header */}
        <div className="flex items-center gap-2">
          <img src={logoBlack} alt="JustSchool" className="h-6 w-auto" />
        </div>

        {/* Step counter */}
        <div
          className="text-xs font-bold min-w-[40px] text-right uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          {progressIdx >= 0 ? `${progressIdx + 1}/${TOTAL_PROGRESS}` : ''}
        </div>
      </header>

      {/* ── Progress bar ── */}
      {progressIdx >= 0 && (
        <div className="h-1 bg-[var(--base-200)] shrink-0">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: 'var(--brand)',
            }}
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
          <div className="flex flex-col items-center text-center w-full relative">
            {/* Subtle decorative brand shapes */}
            <div className="absolute -top-6 -right-8 pointer-events-none select-none opacity-20">
              <BrandShape shape="burst" size={90} color="var(--element-orange)" />
            </div>

            {/* Social Proof Badge */}
            <div className="mb-6">
              <Badge tone="brand" size="md">
                {s.social_proof}
              </Badge>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-4"
              style={{ color: 'var(--text-strong)', letterSpacing: '-0.02em' }}
            >
              {s.title}
            </h1>
            <p
              className="text-sm sm:text-base font-medium leading-relaxed mb-8 max-w-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {s.subtitle}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-8">
              {[
                { v: '17 000+', l: 'студентів' },
                { v: '3.8M+', l: 'занять' },
                { v: '1 700+', l: 'викладачів' },
                { v: '95%', l: 'рекомендують' },
              ].map(b => (
                <Card
                  key={b.l}
                  variant="raised"
                  padding="sm"
                  style={{
                    textAlign: 'center',
                    border: 'var(--border-hairline) solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--brand)' }}
                  >
                    {b.v}
                  </div>
                  <div
                    className="text-xs font-semibold mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {b.l}
                  </div>
                </Card>
              ))}
            </div>

            <div className="w-full space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={advance}
                style={{
                  height: 56,
                  fontSize: 'var(--fs-body-lg)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-brand)',
                }}
              >
                {s.cta} →
              </Button>
              <p
                className="text-center text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Безкоштовно • 5 хвилин
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SINGLE CHOICE
        ════════════════════════════════════ */}
        {s.type === 'choice' && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>
            {s.subtitle ? (
              <p
                className="text-sm text-center mb-6 font-medium leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
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
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                >
                  {opt.emoji && (
                    <span
                      className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: 'var(--base-100)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {opt.emoji}
                    </span>
                  )}
                  <div className="flex-1">
                    <div
                      className="font-bold text-base leading-tight"
                      style={{ color: 'var(--text-strong)' }}
                    >
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div
                        className="text-xs font-medium mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {opt.desc}
                      </div>
                    )}
                  </div>
                  <span
                    className="text-lg shrink-0 font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--brand)' }}
                  >
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
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>
            {s.subtitle && (
              <p
                className="text-sm text-center mb-6 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
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
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98] shadow-xs"
                    style={{
                      backgroundColor: sel ? 'var(--orange-25)' : 'var(--surface-card)',
                      borderColor: sel ? 'var(--brand)' : 'var(--border-subtle)',
                    }}
                  >
                    <span
                      className="text-xl w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: 'var(--base-100)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {opt.emoji}
                    </span>
                    <span
                      className="flex-1 font-bold text-sm leading-snug"
                      style={{ color: 'var(--text-strong)' }}
                    >
                      {opt.label}
                    </span>
                    <div
                      className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                      style={{
                        borderColor: sel ? 'var(--brand)' : 'var(--border-strong)',
                        backgroundColor: sel ? 'var(--brand)' : 'transparent',
                      }}
                    >
                      {sel && (
                        <span className="text-white text-xs font-black leading-none">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              id="multi-confirm"
              variant="primary"
              size="lg"
              fullWidth
              disabled={multiSelected.length === 0}
              onClick={() => multiSelected.length > 0 && advance()}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: multiSelected.length > 0 ? 'var(--shadow-brand)' : 'none',
              }}
            >
              {s.cta}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            INTERSTITIAL (stats)
        ════════════════════════════════════ */}
        {s.type === 'interstitial' && (
          <div className="w-full">
            {/* Dark hero card */}
            <div
              className="rounded-3xl p-6 text-center text-white mb-6 relative overflow-hidden shadow-xl"
              style={{
                backgroundColor: 'var(--surface-inverse)',
                border: 'var(--border-hairline) solid var(--base-800)',
              }}
            >
              {/* Brand shape decoration in background */}
              <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-20 filter invert">
                <BrandShape shape="rings" size={160} />
              </div>
              <div className="absolute -left-6 -top-6 pointer-events-none opacity-25">
                <BrandShape shape="burst" size={120} color="var(--element-yellow)" />
              </div>

              <div className="relative z-10">
                <div className="text-4xl mb-3">🏆</div>
                <h2 className="text-xl font-extrabold mb-2 leading-tight">
                  {s.title}
                </h2>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--base-400)' }}
                >
                  {s.subtitle}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {s.stats?.map(stat => (
                <Card
                  key={stat.label}
                  variant="raised"
                  padding="sm"
                  style={{
                    textAlign: 'center',
                    border: 'var(--border-hairline) solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--brand)' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-semibold mt-1 leading-tight"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>

            <Button
              id="interstitial-cta"
              variant="primary"
              size="lg"
              fullWidth
              onClick={advance}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              {s.cta}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            WORD TEST
        ════════════════════════════════════ */}
        {s.type === 'word_test' && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 text-center leading-tight"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.question}
            </h2>
            <p
              className="text-sm text-center mb-5 font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {s.subtitle}
            </p>

            {/* Words grid */}
            <Card
              variant="raised"
              padding="sm"
              style={{
                borderRadius: 'var(--radius-2xl)',
                border: 'var(--border-hairline) solid var(--border-subtle)',
                marginBottom: '1rem',
              }}
            >
              <div className="grid grid-cols-3 gap-2">
                {WORDS.map(({ word }) => {
                  const checked = checkedWords.has(word);
                  return (
                    <Tag
                      key={word}
                      selected={checked}
                      onClick={() => toggleWord(word)}
                      style={{
                        justifyContent: 'center',
                        height: 42,
                        fontSize: 'var(--fs-body)',
                        fontWeight: 'var(--fw-bold)',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      {word}
                    </Tag>
                  );
                })}
              </div>
            </Card>

            <p
              className="text-center text-xs font-medium mb-5"
              style={{ color: 'var(--text-muted)' }}
            >
              Вибрано:{' '}
              <strong style={{ color: 'var(--brand)' }}>
                {checkedWords.size}
              </strong>{' '}
              із {WORDS.length} слів
            </p>

            <Button
              id="word-test-confirm"
              variant="primary"
              size="lg"
              fullWidth
              onClick={advance}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              {s.cta}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════ */}
        {s.type === 'testimonials' && (
          <div className="w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2
                className="text-2xl font-extrabold mb-2 leading-tight"
                style={{ color: 'var(--text-strong)' }}
              >
                {s.title}
              </h2>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {s.subtitle}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {s.reviews?.map(rev => (
                <Card
                  key={rev.name}
                  variant="raised"
                  padding="sm"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    border: 'var(--border-hairline) solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 border"
                      style={{
                        backgroundColor: 'var(--orange-25)',
                        color: 'var(--orange-700)',
                        borderColor: 'var(--orange-100)',
                      }}
                    >
                      {rev.name[0]}
                    </div>
                    <div>
                      <div
                        className="font-extrabold text-sm"
                        style={{ color: 'var(--text-strong)' }}
                      >
                        {rev.name}
                      </div>
                      <div className="text-xs">{rev.emoji}</div>
                    </div>
                  </div>
                  <p
                    className="text-xs font-medium leading-relaxed italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    "{rev.text}"
                  </p>
                </Card>
              ))}
            </div>

            <Button
              id="testimonials-cta"
              variant="primary"
              size="lg"
              fullWidth
              onClick={advance}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              {s.cta}
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            LOADER
        ════════════════════════════════════ */}
        {s.type === 'loader' && (
          <div className="w-full flex flex-col items-center text-center py-6">
            {/* Spinner with JustSchool styling */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border"
              style={{
                backgroundColor: 'var(--orange-25)',
                borderColor: 'var(--orange-100)',
              }}
            >
              <div
                className="w-10 h-10 border-4 rounded-full animate-spin"
                style={{
                  borderColor: 'var(--orange-100)',
                  borderTopColor: 'var(--brand)',
                }}
              />
            </div>

            <h2
              className="text-xl font-extrabold mb-8 leading-tight"
              style={{ color: 'var(--text-strong)' }}
            >
              {s.title}
            </h2>

            {/* Progress bar */}
            <div className="w-full bg-[var(--base-200)] rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${loaderProgress}%`,
                  backgroundColor: 'var(--brand)',
                }}
              />
            </div>
            <div
              className="font-black text-2xl font-mono mb-10"
              style={{ color: 'var(--brand)' }}
            >
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
                    className="flex items-center gap-3 text-sm font-semibold transition-all duration-500"
                    style={{
                      color: active ? 'var(--text-strong)' : 'var(--base-400)',
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-500"
                      style={{
                        backgroundColor: active ? 'var(--brand)' : 'var(--base-300)',
                      }}
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
              <h2
                className="text-2xl font-extrabold mb-2 leading-tight"
                style={{ color: 'var(--text-strong)' }}
              >
                {s.title}
              </h2>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {s.subtitle}
              </p>
            </div>

            {/* Gift banner */}
            <div
              className="rounded-2xl p-4 flex items-center gap-3 mb-6 border"
              style={{
                backgroundColor: 'var(--orange-25)',
                borderColor: 'var(--orange-100)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 text-white"
                style={{ backgroundColor: 'var(--brand)' }}
              >
                🎁
              </div>
              <p
                className="text-xs font-bold leading-tight"
                style={{ color: 'var(--orange-700)' }}
              >
                Безкоштовне пробне заняття з методистом у подарунок! Отримай
                персональну програму навчання.
              </p>
            </div>

            <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <input
                id="lead-name"
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="name"
                className="w-full p-4 rounded-2xl border-2 outline-none transition-all font-semibold bg-white disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-strong)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
                className="w-full p-4 rounded-2xl border-2 outline-none transition-all font-semibold bg-white disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-strong)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              {/* Submit */}
              <Button
                id="lead-submit"
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                disabled={
                  isSubmitting || !isPhoneValid || !name.trim() || !email.trim()
                }
                style={{
                  height: 56,
                  fontSize: 'var(--fs-body-lg)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-brand)',
                }}
              >
                {isSubmitting ? 'Надсилаємо заявку...' : s.cta}
              </Button>

              <p
                className="text-center text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Твої дані у безпеці • Без спаму
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
