import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import {
  ADULT_QUESTIONS,
  CHILD_QUESTIONS,
  COMMON_QUESTIONS,
  REVIEWS,
} from './data';
import { Button } from './ds/components/core/Button';
import { Badge } from './ds/components/core/Badge';
import { Card } from './ds/components/core/Card';
import { Tag } from './ds/components/core/Tag';
import { BrandShape } from './ds/components/core/BrandShape';
import logoBlack from './ds/assets/logo-horizontal-black.svg';
import bannerDesk from './assets/banner-desk.png';
import bannerMob from './assets/banner-mob.png';
import bannerDeskV1 from './assets/banner-desk-v1.png';
import bannerMobV1 from './assets/banner-mob-v1.png';

declare global {
  interface Window {
    fbq?: any;
    dataLayer?: any[];
  }
}

type Audience = 'adult' | 'child';
type FunnelVariant = 'v1' | 'standard';

// Progress steps shown in quiz: Steps 2, 3, 4, 5, 6, 7 (Total 6 questions)
const PROGRESS_STEPS = [2, 3, 4, 5, 6, 7];
const TOTAL_PROGRESS = PROGRESS_STEPS.length;

export default function App() {
  // ─── Detect Initial Variant from URL ───────────────────────
  const getInitialVariant = (): FunnelVariant => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('v') === 'standard' || url.searchParams.get('v') === '2') {
        return 'standard';
      }
      if (
        url.pathname.includes('/v1') ||
        url.pathname.includes('-v1') ||
        url.searchParams.get('v') === '1' ||
        url.searchParams.get('version') === 'v1'
      ) {
        return 'v1';
      }
    } catch {}
    return 'v1'; // Default to V1 single-screen as requested!
  };

  // ─── State ───────────────────────────────────────────────
  const [variant, setVariant] = useState<FunnelVariant>(getInitialVariant);
  const [step, setStep] = useState<number>(0); // 0 = Hero, 1 = Audience, 2..7 = Questions, 8 = Interstitial, 9 = Loader, 10 = LeadForm
  const [audience, setAudience] = useState<Audience>('adult');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAspects, setMultiAspects] = useState<string[]>([]);
  const [showV1Details, setShowV1Details] = useState<boolean>(false);

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
  const [animKey, setAnimKey] = useState<number>(0);

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
      quiz_variant: variant,
      step_number: step,
      audience: audience,
      step_name:
        step === 0
          ? `hero_screen_${variant}`
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
  }, [step, audience, variant]);

  // 3. Loader Auto-Advance on Step 9
  useEffect(() => {
    if (step !== 9) return;
    setLoaderProgress(0);

    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            advance(10);
          }, 450);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [step]);

  // ─── Navigation Handlers ──────────────────────────────────
  const advance = (nextStep?: number) => {
    setAnimKey((k) => k + 1);
    setStep((s) => (typeof nextStep === 'number' ? nextStep : s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFromHero = () => {
    advance(2); // directly advance to age question with selected audience
  };

  const handleSingleAnswer = (questionKey: string, optionLabel: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: optionLabel }));
    advance();
  };

  const toggleMultiAspect = (label: string) => {
    setMultiAspects((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleMultiSubmit = () => {
    if (multiAspects.length === 0) return;
    setAnswers((prev) => ({ ...prev, aspects: multiAspects.join(', ') }));
    advance(6);
  };

  const handleBack = () => {
    setAnimKey((k) => k + 1);
    if (step === 2) {
      setStep(0);
    } else if (step > 0) {
      setStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Lead Form Submission ────────────────────────────────
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submission guard
    if (!name.trim() || !email.trim() || !isPhoneValid) return;

    setIsSubmitting(true);

    const qaParts: string[] = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      `[BLACK FRIDAY 2026 - VARIANT: ${variant.toUpperCase()}]`,
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
      dialogueName: `Black Friday 2026 Quiz (${variant.toUpperCase()})`,
      dialogueId: `eng_black_friday_${variant}`,
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

    const defaultOnboardingUrl = email.trim()
      ? `https://id.justschool.me/login?email=${encodeURIComponent(email.trim())}`
      : 'https://student.justschool.me/onboarding';

    try {
      // 7-second fallback redirect in case network hangs
      const fallbackTimer = setTimeout(() => {
        window.location.href = defaultOnboardingUrl;
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
          quiz_variant: variant,
          audience: audience,
        });

        const result = await res.json();
        const targetRedirect =
          result?.redirectUri &&
          String(result.redirectUri).trim() !== '' &&
          !String(result.redirectUri).includes('justschool.me/uk/onboarding')
            ? String(result.redirectUri).trim()
            : defaultOnboardingUrl;

        window.location.href = targetRedirect;
      } else {
        window.location.href = defaultOnboardingUrl;
      }
    } catch (err) {
      console.error('Submission error:', err);
      window.location.href = defaultOnboardingUrl;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Questions configuration based on audience
  const currentQuestions = audience === 'adult' ? ADULT_QUESTIONS : CHILD_QUESTIONS;
  const progressIdx = PROGRESS_STEPS.indexOf(step);
  const progressPercent =
    progressIdx >= 0
      ? Math.round(((progressIdx + 1) / TOTAL_PROGRESS) * 100)
      : 0;

  const canGoBack = step > 0 && step !== 9 && step !== 10;

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        backgroundColor: 'var(--surface-page-warm)',
        fontFamily: 'var(--font-core)',
        color: 'var(--text-body)',
      }}
    >
      {/* ─── Top Marquee Ticker ─── */}
      <div
        className="py-1.5 px-3 overflow-hidden select-none border-b shrink-0"
        style={{
          backgroundColor: '#1C160C',
          borderColor: 'rgba(255,255,255,0.1)',
          color: '#FAF8F5',
        }}
      >
        <div className="animate-marquee whitespace-nowrap text-[11px] font-black tracking-widest uppercase flex items-center gap-6">
          <span className="text-[#FF5B09]">🖤 BLACK FRIDAY 2026</span>
          <span>•</span>
          <span>РІК АНГЛІЙСЬКОЇ — 1 670 ГРН/МІС</span>
          <span>•</span>
          <span className="text-[#FFB800]">52 ТИЖНІ РОЗМОВНИХ КЛУБІВ У ПОДАРУНОК</span>
          <span>•</span>
          <span>ВИГОДА 26 000+ ГРН</span>
          <span>•</span>
          <span>48 ІНДИВІДУАЛЬНИХ УРОКІВ</span>
          <span>•</span>
          <span className="text-[#FF5B09]">🖤 BLACK FRIDAY 2026</span>
          <span>•</span>
          <span>РІК АНГЛІЙСЬКОЇ — 1 670 ГРН/МІС</span>
          <span>•</span>
          <span className="text-[#FFB800]">52 ТИЖНІ РОЗМОВНИХ КЛУБІВ У ПОДАРУНОК</span>
          <span>•</span>
          <span>ВИГОДА 26 000+ ГРН</span>
        </div>
      </div>

      {/* ─── Sticky Header ─── */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b h-14 flex items-center px-4 justify-between shrink-0"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="w-12 flex items-center">
          {canGoBack && (
            <button
              id="back-btn"
              onClick={handleBack}
              aria-label="Назад"
              className="p-2 -ml-2 transition-colors text-xl leading-none font-bold cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              ←
            </button>
          )}
        </div>

        {/* Logo in Header */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setStep(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src={logoBlack} alt="JustSchool" className="h-6 w-auto" />
        </div>

        {/* Right side: step counter, BF tag or variant switcher */}
        <div className="flex items-center gap-2 text-right">
          {progressIdx >= 0 ? (
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              {progressIdx + 1}/{TOTAL_PROGRESS}
            </span>
          ) : step === 0 ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVariant(variant === 'v1' ? 'standard' : 'v1')}
                title="Перемкнути версію лендингу (V1 в один екран / Стандартна)"
                className="text-[10px] font-black px-2 py-0.5 rounded-full border transition-all cursor-pointer"
                style={{
                  backgroundColor: variant === 'v1' ? '#1C160C' : 'var(--orange-25)',
                  color: variant === 'v1' ? '#FBC314' : 'var(--brand)',
                  borderColor: variant === 'v1' ? '#1C160C' : 'var(--orange-100)',
                }}
              >
                {variant === 'v1' ? '⚡ V1: 1 ЕКРАН' : 'V2: ДЕТАЛЬНИЙ'}
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {/* ─── Progress Bar (for questions) ─── */}
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

      {/* ─── Main Content Container (Mobile-first max-w-lg) ─── */}
      <main
        key={animKey}
        className="step-enter flex-1 flex flex-col items-center px-4 py-4 sm:py-6 w-full max-w-lg mx-auto"
      >
        {/* ══════════════════════════════════════════════════════
            STEP 0 (HERO): VARIATION V1 (SINGLE SCREEN / 1 ЕКРАН)
        ══════════════════════════════════════════════════════ */}
        {step === 0 && variant === 'v1' && (
          <div className="w-full flex flex-col items-center text-center">
            {/* Top Compact BF Badge */}
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="bg-[#1C160C] text-[#FBC314] text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border border-neutral-700">
                🖤 BLACK FRIDAY 2026
              </span>
              <span className="text-xs font-bold text-neutral-500">
                Залишилось 14 місць
              </span>
            </div>

            {/* Main Single-Screen Hero Card with Cropped Banner & Interactive Button */}
            <div className="w-full bg-[#1C160C] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col relative transition-all">
              {/* Cropped Banner Image (fake button cleanly cut off at table level) */}
              <div className="relative w-full bg-[#1C160C] select-none">
                <picture>
                  <source media="(min-width: 640px)" srcSet={bannerDeskV1} />
                  <img
                    src={bannerMobV1}
                    alt="Black Friday JustSchool"
                    className="w-full h-auto object-cover block"
                  />
                </picture>
              </div>

              {/* Real Interactive Button replacing the cropped static image text */}
              <div className="p-3 sm:p-4 bg-[#140A07] border-t border-neutral-800/80">
                <button
                  type="button"
                  id="hero-v1-start-btn"
                  onClick={handleStartFromHero}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105"
                  style={{
                    backgroundColor: '#FBC314', // Exact authentic yellow from banner design
                    color: '#000000',
                    boxShadow: '0 8px 24px rgba(251, 195, 20, 0.4)',
                  }}
                >
                  <span>Розпочати зараз</span>
                  <span className="text-xl leading-none">→</span>
                </button>
              </div>
            </div>

            {/* Audience Segmented Control */}
            <div className="mt-3 w-full">
              <div
                className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--base-100)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAudience('adult')}
                  className="py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: audience === 'adult' ? 'white' : 'transparent',
                    color: audience === 'adult' ? 'var(--text-strong)' : 'var(--text-muted)',
                    boxShadow: audience === 'adult' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <span className="text-sm">🧑</span>
                  <span>Для дорослих (18+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('child')}
                  className="py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: audience === 'child' ? 'white' : 'transparent',
                    color: audience === 'child' ? 'var(--text-strong)' : 'var(--text-muted)',
                    boxShadow: audience === 'child' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <span className="text-sm">🧒</span>
                  <span>Для дітей (4–17)</span>
                </button>
              </div>
            </div>

            {/* 3 Core Value Pills (Fits comfortably above fold) */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 w-full text-center">
              <div
                className="p-2 rounded-xl border text-[11px] font-bold leading-tight"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-strong)',
                }}
              >
                <div className="text-[#FF5B09] font-black">48 занять</div>
                <div className="text-[10px] text-neutral-500">1 670 грн/міс</div>
              </div>

              <div
                className="p-2 rounded-xl border text-[11px] font-bold leading-tight"
                style={{
                  backgroundColor: 'var(--orange-25)',
                  borderColor: 'var(--orange-100)',
                  color: 'var(--brand)',
                }}
              >
                <div className="font-black">Рік клубів</div>
                <div className="text-[10px] uppercase font-extrabold">0 грн Подарунок</div>
              </div>

              <div
                className="p-2 rounded-xl border text-[11px] font-bold leading-tight"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-strong)',
                }}
              >
                <div className="text-emerald-600 font-black">26 000+ грн</div>
                <div className="text-[10px] text-neutral-500">Загальна вигода</div>
              </div>
            </div>

            {/* Micro guarantee line */}
            <p
              className="mt-2 text-center text-[11px] font-semibold tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              ✓ Безкоштовний підбір • ~55 грн/день за щоденну практику
            </p>

            {/* Optional expandable details toggle for users who want to review the full breakdown */}
            <div className="mt-3 w-full">
              <button
                type="button"
                onClick={() => setShowV1Details(!showV1Details)}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center gap-1 mx-auto py-1"
              >
                <span>{showV1Details ? 'Приховати деталі розрахунку ▲' : 'Переглянути чек та відгуки ▼'}</span>
              </button>

              {showV1Details && (
                <div className="mt-4 text-left space-y-4 step-enter">
                  {/* Receipt Card */}
                  <Card
                    variant="raised"
                    padding="md"
                    style={{
                      borderRadius: 'var(--radius-2xl)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dashed border-[var(--border-subtle)]">
                      <span className="text-lg">🧾</span>
                      <span
                        className="font-extrabold text-sm tracking-tight"
                        style={{ color: 'var(--text-strong)' }}
                      >
                        Ваш розрахунковий чек Black Friday
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          48 уроків (2 рази на тиждень):
                        </span>
                        <div className="text-right shrink-0">
                          <span className="line-through text-neutral-400 mr-1.5">
                            27 312 грн
                          </span>
                          <span className="font-bold" style={{ color: 'var(--text-strong)' }}>
                            20 018 грн
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          52 тижні розмовних клубів:
                        </span>
                        <span className="font-bold text-emerald-600 uppercase">
                          0 грн (Подарунок)
                        </span>
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Платформа JustClass 24/7:
                        </span>
                        <span className="font-bold text-emerald-600">0 грн</span>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-dashed border-[var(--border-subtle)] flex justify-between items-center">
                        <div>
                          <div
                            className="font-extrabold text-sm"
                            style={{ color: 'var(--text-strong)' }}
                          >
                            РАЗОМ: 1 670 грн / міс
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold">
                            Сумарна вигода 26 000+ грн
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleStartFromHero}
                        >
                          Почати →
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Reviews Mini Block */}
                  <div className="space-y-2">
                    {REVIEWS.slice(0, 2).map((rev) => (
                      <Card
                        key={rev.name}
                        variant="raised"
                        padding="sm"
                        style={{
                          borderRadius: 'var(--radius-xl)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div className="text-xs font-bold text-neutral-800">{rev.name} ({rev.role})</div>
                        <p className="text-[11px] text-neutral-600 italic mt-0.5">"{rev.text}"</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            STEP 0 (HERO): VARIATION V2 (STANDARD MULTI-CARD)
        ══════════════════════════════════════════════════════ */}
        {step === 0 && variant === 'standard' && (
          <div className="flex flex-col items-center text-center w-full relative">
            {/* Decorative brand shapes */}
            <div className="absolute -top-4 -right-6 pointer-events-none select-none opacity-20">
              <BrandShape shape="burst" size={80} color="var(--element-orange)" />
            </div>

            {/* Badge */}
            <div className="mb-4">
              <Badge tone="brand" size="md">
                🖤 ГОЛОВНА ПРОПОЗИЦІЯ РОКУ
              </Badge>
            </div>

            {/* Main Title */}
            <h1
              className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-2"
              style={{ color: 'var(--text-strong)', letterSpacing: '-0.02em' }}
            >
              Цілий рік англійської
            </h1>
            <p
              className="text-sm sm:text-base font-medium leading-relaxed mb-5 max-w-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              48 індивідуальних уроків + 52 тижні розмовних клубів у подарунок
            </p>

            {/* Price Callout Card */}
            <Card
              variant="raised"
              padding="md"
              style={{
                width: '100%',
                marginBottom: '1.25rem',
                borderRadius: 'var(--radius-2xl)',
                border: '2px solid var(--orange-100)',
                backgroundColor: 'var(--surface-card)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Спецціна Black Friday
                </span>
                <span className="bg-[#1C160C] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Знижка -35%
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <div className="text-left">
                  <div
                    className="text-xs font-semibold line-through"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    2 276 грн / міс
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-3xl sm:text-4xl font-black"
                      style={{ color: 'var(--brand)' }}
                    >
                      1 670 грн
                    </span>
                    <span
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      / місяць
                    </span>
                  </div>
                </div>

                <div
                  className="text-right px-3 py-1.5 rounded-xl border text-xs font-black"
                  style={{
                    backgroundColor: 'var(--orange-25)',
                    borderColor: 'var(--orange-100)',
                    color: 'var(--brand)',
                  }}
                >
                  <div>Вигода</div>
                  <div>26 000+ грн</div>
                </div>
              </div>
            </Card>

            {/* Banner */}
            <div className="w-full mb-6 rounded-2xl overflow-hidden border shadow-sm">
              <picture>
                <source media="(min-width: 640px)" srcSet={bannerDesk} />
                <img
                  src={bannerMob}
                  alt="Black Friday JustSchool"
                  className="w-full h-auto object-cover block"
                />
              </picture>
            </div>

            {/* Audience Picker */}
            <div className="w-full text-left mb-6">
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2.5 px-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Оберіть, для кого навчання:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAudience('adult')}
                  className="p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] shadow-xs cursor-pointer"
                  style={{
                    backgroundColor:
                      audience === 'adult' ? 'var(--orange-25)' : 'var(--surface-card)',
                    borderColor:
                      audience === 'adult' ? 'var(--brand)' : 'var(--border-subtle)',
                  }}
                >
                  <div className="text-2xl mb-1.5">🧑</div>
                  <div
                    className="font-extrabold text-sm leading-tight"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    Для дорослих
                  </div>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    18+ років
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('child')}
                  className="p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] shadow-xs cursor-pointer"
                  style={{
                    backgroundColor:
                      audience === 'child' ? 'var(--orange-25)' : 'var(--surface-card)',
                    borderColor:
                      audience === 'child' ? 'var(--brand)' : 'var(--border-subtle)',
                  }}
                >
                  <div className="text-2xl mb-1.5">🧒</div>
                  <div
                    className="font-extrabold text-sm leading-tight"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    Для дитини
                  </div>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    4–17 років
                  </div>
                </button>
              </div>
            </div>

            {/* Receipt Card ("🧾 Ваш розрахунковий чек Black Friday") */}
            <Card
              variant="raised"
              padding="md"
              style={{
                width: '100%',
                marginBottom: '1.5rem',
                textAlign: 'left',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dashed border-[var(--border-subtle)]">
                <span className="text-lg">🧾</span>
                <span
                  className="font-extrabold text-sm tracking-tight"
                  style={{ color: 'var(--text-strong)' }}
                >
                  Ваш розрахунковий чек Black Friday
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    48 індивідуальних уроків (2 рази на тиждень):
                  </span>
                  <div className="text-right shrink-0">
                    <span className="line-through text-neutral-400 mr-1.5">
                      27 312 грн
                    </span>
                    <span className="font-bold" style={{ color: 'var(--text-strong)' }}>
                      20 018 грн
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    52 тижні розмовних клубів (щотижня):
                  </span>
                  <div className="text-right shrink-0">
                    <span className="line-through text-neutral-400 mr-1.5">
                      19 200 грн
                    </span>
                    <span className="font-bold text-emerald-600 uppercase">
                      0 грн (Подарунок)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Інтерактивна платформа JustClass 24/7:
                  </span>
                  <span className="font-bold text-emerald-600">0 грн</span>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Персональний куратор та сертифікат:
                  </span>
                  <span className="font-bold text-emerald-600">0 грн</span>
                </div>

                <div className="pt-3 mt-2 border-t border-dashed border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div
                      className="font-extrabold text-sm"
                      style={{ color: 'var(--text-strong)' }}
                    >
                      РАЗОМ до сплати:
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600">
                      Сумарна економія 26 000+ грн
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-lg font-black"
                      style={{ color: 'var(--brand)' }}
                    >
                      1 670 грн / міс
                    </div>
                    <div
                      className="text-[10px] font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ~55 грн / день за щоденну англійську
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Speaking Clubs Callout Box */}
            <div
              className="w-full rounded-2xl p-4 flex items-start gap-3 mb-6 text-left border"
              style={{
                backgroundColor: 'var(--orange-25)',
                borderColor: 'var(--orange-100)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 text-white"
                style={{ backgroundColor: 'var(--brand)' }}
              >
                🗣️
              </div>
              <div className="flex-1">
                <div
                  className="text-xs font-black uppercase tracking-wider mb-1"
                  style={{ color: 'var(--brand)' }}
                >
                  Чому розмовні клуби — це прорив у навчанні?
                </div>
                <p
                  className="text-xs font-semibold leading-relaxed"
                  style={{ color: 'var(--orange-700)' }}
                >
                  Кожен тиждень ви отримуєте додаткову практику живого спілкування в
                  міні-групах до 8 осіб. 300+ розмовних тем на вибір — ідеальний спосіб
                  назавжди подолати мовний бар’єр.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              {[
                { v: '17 000+', l: 'студентів' },
                { v: '3.8M+', l: 'занять проведено' },
                { v: '1 700+', l: 'викладачів' },
                { v: '95%', l: 'рекомендують друзям' },
              ].map((b) => (
                <Card
                  key={b.l}
                  variant="raised"
                  padding="sm"
                  style={{
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <div
                    className="text-xl sm:text-2xl font-black"
                    style={{ color: 'var(--brand)' }}
                  >
                    {b.v}
                  </div>
                  <div
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {b.l}
                  </div>
                </Card>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="w-full space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartFromHero}
                style={{
                  height: 56,
                  fontSize: 'var(--fs-body-lg)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-brand)',
                }}
              >
                Зафіксувати знижку та почати →
              </Button>
              <p
                className="text-center text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Безкоштовно • Залишилось 14 місць за спецціною
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 1: AUDIENCE SELECTOR (Fallback)
        ════════════════════════════════════ */}
        {step === 1 && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              Для кого обираєте навчання?
            </h2>
            <p
              className="text-sm text-center mb-6 font-medium leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Спецпропозиція Black Friday діє як для дорослих, так і для дитячих програм
            </p>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setAudience('adult');
                  advance(2);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                }}
              >
                <span
                  className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: 'var(--base-100)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  🧑
                </span>
                <div className="flex-1">
                  <div
                    className="font-bold text-base leading-tight"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    Для себе (Дорослі 18+)
                  </div>
                  <div
                    className="text-xs font-medium mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Кар'єра, переїзд, подорожі та вільне спілкування
                  </div>
                </div>
                <span
                  className="text-lg shrink-0 font-bold"
                  style={{ color: 'var(--brand)' }}
                >
                  ›
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudience('child');
                  advance(2);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                }}
              >
                <span
                  className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: 'var(--base-100)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  🧒
                </span>
                <div className="flex-1">
                  <div
                    className="font-bold text-base leading-tight"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    Для дитини (4–17 років)
                  </div>
                  <div
                    className="text-xs font-medium mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Шкільні оцінки, подолання страху та вільна мова в ігровій формі
                  </div>
                </div>
                <span
                  className="text-lg shrink-0 font-bold"
                  style={{ color: 'var(--brand)' }}
                >
                  ›
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 2: AGE QUESTION
        ════════════════════════════════════ */}
        {step === 2 && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {currentQuestions.age.question}
            </h2>
            <p
              className="text-sm text-center mb-6 font-medium leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentQuestions.age.subtitle}
            </p>

            <div className="grid gap-3">
              {currentQuestions.age.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSingleAnswer('age', opt.label)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                >
                  <span
                    className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: 'var(--base-100)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    {opt.emoji}
                  </span>
                  <div className="flex-1 font-bold text-base" style={{ color: 'var(--text-strong)' }}>
                    {opt.label}
                  </div>
                  <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 3: LEVEL OR SITUATION
        ════════════════════════════════════ */}
        {step === 3 && (
          <div className="w-full">
            {audience === 'adult' ? (
              <>
                <h2
                  className="text-2xl font-extrabold mb-2 leading-tight text-center"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {ADULT_QUESTIONS.level.question}
                </h2>
                <p
                  className="text-sm text-center mb-6 font-medium leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {ADULT_QUESTIONS.level.subtitle}
                </p>

                <div className="grid gap-3">
                  {ADULT_QUESTIONS.level.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSingleAnswer('level', opt.label)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand)';
                        e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      }}
                    >
                      <span
                        className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: 'var(--base-100)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {opt.emoji}
                      </span>
                      <div className="flex-1">
                        <div
                          className="font-bold text-base leading-tight"
                          style={{ color: 'var(--text-strong)' }}
                        >
                          {opt.label}
                        </div>
                        {opt.subtitle && (
                          <div
                            className="text-xs font-medium mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {opt.subtitle}
                          </div>
                        )}
                      </div>
                      <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-2xl font-extrabold mb-2 leading-tight text-center"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {CHILD_QUESTIONS.situation.question}
                </h2>
                <p
                  className="text-sm text-center mb-6 font-medium leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {CHILD_QUESTIONS.situation.subtitle}
                </p>

                <div className="grid gap-3">
                  {CHILD_QUESTIONS.situation.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSingleAnswer('situation', opt.label)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand)';
                        e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      }}
                    >
                      <span
                        className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: 'var(--base-100)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {opt.emoji}
                      </span>
                      <div
                        className="flex-1 font-bold text-sm leading-snug"
                        style={{ color: 'var(--text-strong)' }}
                      >
                        {opt.label}
                      </div>
                      <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 4: GOAL OR PRIORITY
        ════════════════════════════════════ */}
        {step === 4 && (
          <div className="w-full">
            {audience === 'adult' ? (
              <>
                <h2
                  className="text-2xl font-extrabold mb-2 leading-tight text-center"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {ADULT_QUESTIONS.goal.question}
                </h2>
                <p
                  className="text-sm text-center mb-6 font-medium leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {ADULT_QUESTIONS.goal.subtitle}
                </p>

                <div className="grid gap-3">
                  {ADULT_QUESTIONS.goal.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSingleAnswer('goal', opt.label)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand)';
                        e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      }}
                    >
                      <span
                        className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: 'var(--base-100)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {opt.emoji}
                      </span>
                      <div className="flex-1">
                        <div
                          className="font-bold text-base leading-tight"
                          style={{ color: 'var(--text-strong)' }}
                        >
                          {opt.label}
                        </div>
                        {opt.subtitle && (
                          <div
                            className="text-xs font-medium mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {opt.subtitle}
                          </div>
                        )}
                      </div>
                      <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-2xl font-extrabold mb-2 leading-tight text-center"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {CHILD_QUESTIONS.priority.question}
                </h2>
                <p
                  className="text-sm text-center mb-6 font-medium leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {CHILD_QUESTIONS.priority.subtitle}
                </p>

                <div className="grid gap-3">
                  {CHILD_QUESTIONS.priority.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSingleAnswer('priority', opt.label)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand)';
                        e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      }}
                    >
                      <span
                        className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: 'var(--base-100)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {opt.emoji}
                      </span>
                      <div
                        className="flex-1 font-bold text-sm leading-snug"
                        style={{ color: 'var(--text-strong)' }}
                      >
                        {opt.label}
                      </div>
                      <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 5: MULTI-SELECT ASPECTS
        ════════════════════════════════════ */}
        {step === 5 && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {audience === 'adult'
                ? ADULT_QUESTIONS.aspects.question
                : CHILD_QUESTIONS.aspects.question}
            </h2>
            <p
              className="text-sm text-center mb-6 font-medium leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Оберіть один або кілька варіантів для акценту в програмі
            </p>

            <div className="grid gap-2.5 mb-6">
              {(audience === 'adult'
                ? ADULT_QUESTIONS.aspects.options
                : CHILD_QUESTIONS.aspects.options
              ).map((opt) => {
                const sel = multiAspects.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleMultiAspect(opt.label)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98] shadow-xs cursor-pointer"
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
                        <span className="text-white text-xs font-black leading-none">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={multiAspects.length === 0}
              onClick={handleMultiSubmit}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: multiAspects.length > 0 ? 'var(--shadow-brand)' : 'none',
              }}
            >
              Продовжити →
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 6: INTENSITY
        ════════════════════════════════════ */}
        {step === 6 && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {COMMON_QUESTIONS.intensity.question}
            </h2>
            <p
              className="text-sm text-center mb-6 font-medium leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {COMMON_QUESTIONS.intensity.subtitle}
            </p>

            <div className="grid gap-3">
              {COMMON_QUESTIONS.intensity.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSingleAnswer('intensity', opt.label)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                >
                  <span
                    className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: 'var(--base-100)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    {opt.emoji}
                  </span>
                  <div className="flex-1">
                    <div
                      className="font-bold text-base leading-tight"
                      style={{ color: 'var(--text-strong)' }}
                    >
                      {opt.label}
                    </div>
                    {opt.subtitle && (
                      <div
                        className="text-xs font-medium mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 7: SCHEDULE
        ════════════════════════════════════ */}
        {step === 7 && (
          <div className="w-full">
            <h2
              className="text-2xl font-extrabold mb-2 leading-tight text-center"
              style={{ color: 'var(--text-strong)' }}
            >
              {COMMON_QUESTIONS.schedule.question}
            </h2>
            <p
              className="text-sm text-center mb-6 font-medium leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {COMMON_QUESTIONS.schedule.subtitle}
            </p>

            <div className="grid gap-3">
              {COMMON_QUESTIONS.schedule.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, schedule: opt.label }));
                    advance(8);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group shadow-xs active:scale-[0.98] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.backgroundColor = 'var(--orange-25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                >
                  <span
                    className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: 'var(--base-100)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    {opt.emoji}
                  </span>
                  <div
                    className="flex-1 font-bold text-base leading-tight"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    {opt.label}
                  </div>
                  <span className="text-lg shrink-0 font-bold" style={{ color: 'var(--brand)' }}>
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 8: INTERSTITIAL (VALUE & REVIEWS)
        ════════════════════════════════════ */}
        {step === 8 && (
          <div className="w-full">
            {/* Dark Hero Card */}
            <div
              className="rounded-3xl p-6 text-center text-white mb-6 relative overflow-hidden shadow-xl"
              style={{
                backgroundColor: 'var(--surface-inverse)',
                border: '1px solid var(--base-800)',
              }}
            >
              <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-20 filter invert">
                <BrandShape shape="rings" size={160} />
              </div>
              <div className="absolute -left-6 -top-6 pointer-events-none opacity-25">
                <BrandShape shape="burst" size={120} color="var(--element-yellow)" />
              </div>

              <div className="relative z-10">
                <div className="text-4xl mb-3">🖤</div>
                <h2 className="text-xl font-extrabold mb-2 leading-tight">
                  Вашу знижку Black Friday зафіксовано!
                </h2>
                <p className="text-sm font-normal text-neutral-300 leading-relaxed mb-4 max-w-sm mx-auto">
                  Пакет з 48 індивідуальних уроків (1 670 грн/міс) та цілий рік щотижневих
                  розмовних клубів у подарунок зарезервовано.
                </p>

                <div className="inline-flex items-center gap-2 bg-[#FF5B09]/20 border border-[#FF5B09]/50 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>🔥 Економія понад 26 000 грн</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="text-center mb-4">
              <h3
                className="text-lg font-extrabold"
                style={{ color: 'var(--text-strong)' }}
              >
                Відгуки студентів JustSchool
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {REVIEWS.map((rev) => (
                <Card
                  key={rev.name}
                  variant="raised"
                  padding="sm"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
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
                      <div
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {rev.role}
                      </div>
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
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => advance(9)}
              style={{
                height: 56,
                fontSize: 'var(--fs-body-lg)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              Перейти до розрахунку плану →
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 9: LOADER (CALCULATION)
        ════════════════════════════════════ */}
        {step === 9 && (
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
              Формуємо ваш персональний план Black Friday...
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
              {[
                'Фіксація спецціни Black Friday 1 670 грн/місяць...',
                'Нарахування безкоштовного року розмовних клубів (0 грн)...',
                'Складання персонального графіку уроків...',
                'Підбір сертифікованого викладача за критеріями...',
              ].map((p, i) => {
                const threshold = (i / 4) * 100;
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
            STEP 10: LEAD FORM GATE
        ════════════════════════════════════ */}
        {step === 10 && (
          <div className="w-full">
            <div className="text-center mb-6">
              <div className="mb-2">
                <Badge tone="brand" size="md">
                  🎉 СПЕЦПРОПОЗИЦІЯ ЗБЕРЕЖЕНА
                </Badge>
              </div>
              <h2
                className="text-2xl font-extrabold mb-2 leading-tight"
                style={{ color: 'var(--text-strong)' }}
              >
                Отримайте рік англійської за спецціною
              </h2>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Залиште контакти, щоб закріпити знижку 1 670 грн/місяць та забрати цілий рік
                розмовних клубів у подарунок
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
                Безкоштовний пробний урок з методистом у подарунок! Отримайте
                індивідуальний розбір та протестуйте платформу.
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4">
              {/* Name */}
              <input
                id="lead-name"
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="name"
                className="w-full p-4 rounded-2xl border-2 outline-none transition-all font-semibold bg-white disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-strong)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                }}
                onBlur={(e) => {
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="email"
                className="w-full p-4 rounded-2xl border-2 outline-none transition-all font-semibold bg-white disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-strong)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand)';
                  e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                }}
                onBlur={(e) => {
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
                {isSubmitting ? 'Надсилаємо заявку...' : 'Забрати рік англійської →'}
              </Button>

              <p
                className="text-center text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Твої дані у безпеці • Без спаму • Офіційна оферта
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
