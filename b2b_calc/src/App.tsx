import React, { useState, useEffect, useMemo, useRef } from 'react';
import PhoneInput from './PhoneInput';
import {
  COMPANY_SIZES,
  QUESTIONS,
  SHORT_TOPICS,
  CALC_CONFIG,
  ZONES,
  getZone,
  CompanySizeOption,
  QuizQuestion,
  ZoneType,
} from './data';
import logoBlack from './assets/logo-horizontal-black.svg';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingDown,
  Building2,
  AlertTriangle,
  Sparkles,
  Calendar,
  X,
  Send,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  // ─── State ───────────────────────────────────────────────
  // step: 0 = Hero, 1 = Size, 2..13 = Questions 1..12, 14 = Lead Form, 15 = Result
  const [step, setStep] = useState<number>(0);
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(12).fill(null));

  // Lead fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [rawPhone, setRawPhone] = useState<string>('');
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [geoCountry, setGeoCountry] = useState<string>('UA');
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});
  const [lossBump, setLossBump] = useState<boolean>(false);

  // Demo Booking Modal on Result Screen
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoNote, setDemoNote] = useState<string>('');
  const [demoSubmitting, setDemoSubmitting] = useState<boolean>(false);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  // ─── GEO & URL leadType detection ────────────────────────
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', 'b2b-corporate');
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

  // ─── Calculations ────────────────────────────────────────
  const multiplier = useMemo(() => {
    return sizeIdx !== null ? COMPANY_SIZES[sizeIdx].multiplier : 1.0;
  }, [sizeIdx]);

  const calcResults = useMemo(() => {
    let baseHours = 0;
    answers.forEach((ansIdx, qIdx) => {
      if (ansIdx !== null && QUESTIONS[qIdx]?.opts[ansIdx]) {
        baseHours += QUESTIONS[qIdx].opts[ansIdx].hours;
      }
    });

    const weekHours = Number((baseHours * multiplier).toFixed(1));
    const monthHours = Number((weekHours * CALC_CONFIG.weeksPerMonth).toFixed(1));
    const monthMoney = Math.round(monthHours * CALC_CONFIG.hourlyRate);
    const zoneType = getZone(baseHours);

    // Breakdown of top wasted processes
    const processItems = QUESTIONS.map((q, idx) => {
      const ansIdx = answers[idx];
      const h = ansIdx !== null ? q.opts[ansIdx].hours * multiplier : 0;
      return {
        id: q.id,
        name: q.shortName,
        category: q.categoryBadge,
        hours: Number(h.toFixed(1)),
      };
    })
      .filter((item) => item.hours > 0)
      .sort((a, b) => b.hours - a.hours);

    const topProcesses = processItems.slice(0, 5);
    const maxProcessHours = topProcesses.length > 0 ? topProcesses[0].hours : 1;

    return {
      baseHours,
      weekHours,
      monthHours,
      monthMoney,
      zoneType,
      topProcesses,
      maxProcessHours,
    };
  }, [answers, multiplier]);

  // ─── GTM Step Tracking ───────────────────────────────────
  useEffect(() => {
    try {
      const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
      let stepName = 'hero';
      if (step === 1) stepName = 'company_size';
      else if (step >= 2 && step <= 13) stepName = `question_${step - 1}_${QUESTIONS[step - 2]?.shortName}`;
      else if (step === 14) stepName = 'lead_form';
      else if (step === 15) stepName = `result_${calcResults.zoneType}`;

      dl.push({
        event: 'quiz_step_reach',
        quiz_name: 'b2b_hr_calc',
        step_number: step,
        step_title: stepName,
      });
    } catch {}
  }, [step, calcResults.zoneType]);

  // ─── Step Navigation ─────────────────────────────────────
  const goTo = (targetStep: number) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSize = (idx: number) => {
    setSizeIdx(idx);
    setTimeout(() => goTo(2), 150);
  };

  const handleSelectOption = (optIdx: number) => {
    const qIndex = step - 2;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIdx;
    setAnswers(newAnswers);

    // Trigger floating counter bounce
    setLossBump(true);
    setTimeout(() => setLossBump(false), 450);

    // Auto advance
    setTimeout(() => {
      if (step === 13) {
        goTo(14); // to Lead Form
      } else {
        goTo(step + 1);
      }
    }, 220);
  };

  const handleRestart = () => {
    setStep(0);
    setSizeIdx(null);
    setAnswers(Array(12).fill(null));
    setName('');
    setEmail('');
    setCompany('');
    setRawPhone('');
    setIsPhoneValid(false);
    setIsDemoModalOpen(false);
    setDemoSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Lead Form Submission ────────────────────────────────
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim() || !email.trim() || !isPhoneValid) return;

    setIsSubmitting(true);

    const qaFormatted: string[] = [
      `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`,
      `Розмір компанії: ${sizeIdx !== null ? COMPANY_SIZES[sizeIdx].label : 'Не вказано'}`,
      `Втрати на тиждень: ${calcResults.weekHours} год`,
      `Втрати на місяць: ${calcResults.monthHours} год`,
      `Фінансові збитки: $${calcResults.monthMoney}/міс`,
      `Зона автоматизації: ${calcResults.zoneType.toUpperCase()}`,
      `Компанія: ${company.trim() || 'Не вказано'}`,
    ];

    QUESTIONS.forEach((q, idx) => {
      const aIdx = answers[idx];
      if (aIdx !== null && q.opts[aIdx]) {
        qaFormatted.push(`Q${q.id} (${q.shortName}): ${q.opts[aIdx].key}. ${q.opts[aIdx].text} (+${q.opts[aIdx].hours} год)`);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      company: company.trim() || 'B2B Client',
      companySize: sizeIdx !== null ? COMPANY_SIZES[sizeIdx].label : '',
      qa: qaFormatted.join('|||'),
      dialogueUrl: window.location.href,
      dialogueName: 'JustSchool B2B HR Routine Calculator',
      dialogueId: 'b2b_calc',
      b2b: true,
      saveToGoogleSheets: true,
      skipCreatio: true,
      totalHoursWeek: calcResults.weekHours,
      totalHoursMonth: calcResults.monthHours,
      totalMoneyMonth: calcResults.monthMoney,
      zone: calcResults.zoneType,
      topProcess: calcResults.topProcesses[0]?.name || '',
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: 'English B2B',
      lead_type: 'b2b-corporate',
    };

    try {
      // Fire client-side Meta Lead for B2B analytics
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead', {
          content_name: 'b2b_hr_calculator',
          value: calcResults.monthMoney,
          currency: 'USD',
        });
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
        dl.push({
          event: 'form_success',
          quiz_name: 'b2b_hr_calc',
          lead_type: 'b2b-corporate',
          week_hours: calcResults.weekHours,
          month_money: calcResults.monthMoney,
          zone: calcResults.zoneType,
        });
      }
    } catch (err) {
      console.error('Lead submit error:', err);
    } finally {
      setIsSubmitting(false);
      goTo(15); // Show results screen!
    }
  };

  // ─── Demo Modal Submission ───────────────────────────────
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoSubmitting) return;
    setDemoSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: rawPhone,
          email: email.trim(),
          company: company.trim() || 'B2B Client',
          qa: `[DEMO REQUEST] Примітка / Зручний час: ${demoNote.trim() || 'Якнайшвидше'}|||Зона: ${calcResults.zoneType}|||Втрати: ${calcResults.weekHours} год/тижд ($${calcResults.monthMoney}/міс)`,
          dialogueUrl: window.location.href,
          dialogueName: 'JustSchool B2B Demo Request',
          dialogueId: 'b2b_calc_demo',
          b2b: true,
          saveToGoogleSheets: true,
          skipCreatio: true,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
        }),
      });

      const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
      dl.push({
        event: 'cta_click',
        quiz_name: 'b2b_hr_calc',
        cta_action: 'demo_booked',
        zone: calcResults.zoneType,
      });

      setDemoSubmitted(true);
    } catch (err) {
      console.error('Demo booking error:', err);
      setDemoSubmitted(true);
    } finally {
      setDemoSubmitting(false);
    }
  };

  const currentZone = ZONES[calcResults.zoneType];
  const progressPercent = step <= 1 ? 0 : step >= 14 ? 100 : Math.round(((step - 1) / 12) * 100);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-slate-900 relative selection:bg-orange-100 flex flex-col justify-between font-sans">
      {/* Ambient background glows */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Floating Loss Counter Badge (Visible during questions 2..13) */}
      {step >= 2 && step <= 13 && (
        <div
          className={`fixed top-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-orange-200/80 rounded-2xl px-4 py-2.5 shadow-lg shadow-orange-950/5 flex items-center gap-3 transition-transform duration-200 ${
            lossBump ? 'animate-bump ring-4 ring-orange-200' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B09]">
            <Clock size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Втрати рутини
            </div>
            <div className="text-base font-extrabold text-[#FF5B09] leading-tight flex items-baseline gap-1">
              <span>{calcResults.weekHours}</span>
              <span className="text-xs font-semibold text-slate-500">год/тижд</span>
              <span className="text-xs font-bold text-slate-400 ml-1">
                (~${calcResults.monthMoney}/міс)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <img src={logoBlack} alt="JustSchool Logo" className="h-7 w-auto object-contain" />
          <span className="hidden sm:inline-block w-px h-5 bg-slate-300" />
          <span className="text-xs font-extrabold tracking-wider uppercase bg-orange-100/80 text-[#B23C00] px-2.5 py-1 rounded-full border border-orange-200">
            B2B Корпоративні рішення
          </span>
        </div>

        {step > 0 && step < 15 && (
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/60"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Почати спочатку</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 relative z-10 flex flex-col justify-center">
        {/* ══════════════════════════════════════════════════
            SCREEN 0: HERO
        ══════════════════════════════════════════════════ */}
        {step === 0 && (
          <section className="py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#B23C00] border border-orange-200 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#FF5B09] animate-pulse" />
                B2B HR-Analytics Tool
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Скільки годин на тиждень ваш HR-відділ{' '}
                <span className="text-[#FF5B09] underline decoration-[#FFCBA8] decoration-4 underline-offset-4">
                  спалює на рутину?
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Пройдіть 3-хвилинний інтерактивний розрахунок, підрахуйте приховані фінансові втрати
                бізнесу на ручному адмініструванні та дізнайтеся, як автоматизувати навчання
                співробітників.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF7411] to-[#FF5B09] hover:from-[#F56600] hover:to-[#E24A00] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  <span>Розрахувати втрати</span>
                  <ArrowRight size={20} />
                </button>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 justify-center sm:justify-start">
                  <Clock size={16} className="text-slate-400" />
                  <span>12 запитань • близько 3 хвилин</span>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-white flex flex-col gap-5 shadow-xl shadow-orange-950/5">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">
                  HR Routine Breakdown
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Що ми аналізуємо в розрахунку</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {SHORT_TOPICS.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-white/80 border border-orange-200/60 text-xs font-bold text-slate-700 shadow-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-orange-200/60 text-xs font-medium text-slate-500 leading-relaxed">
                💡 <span className="font-bold text-slate-700">У фінальному звіті:</span> точна сума
                втрачених годин і бюджету компанії щомісяця, топ-5 вузьких місць та покрокові
                рекомендації з автоматизації.
              </div>
            </aside>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            SCREEN 1: STEP 0 (COMPANY SIZE MULTIPLIER)
        ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-2xl animate-fade-in-up">
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span className="uppercase tracking-wider text-orange-600">Крок 0 • Масштаб компанії</span>
                <span>Ввідне запитання</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Скільки співробітників працює у вашій компанії?
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1.5">
                Кількість співробітників визначає коефіцієнт навантаження та масштаб фінансових втрат.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {COMPANY_SIZES.map((size, idx) => {
                const isSelected = sizeIdx === idx;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => handleSelectSize(idx)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-[#FF5B09] bg-orange-50/80 shadow-md shadow-orange-500/10'
                        : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-900">{size.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        x{size.multiplier}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{size.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => goTo(0)}
                className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                <span>Назад</span>
              </button>
              <span className="text-xs font-semibold text-slate-400">Оберіть розмір штату</span>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SCREENS 2..13: QUESTIONS 1..12
        ══════════════════════════════════════════════════ */}
        {step >= 2 && step <= 13 && (
          <div className="max-w-2xl mx-auto w-full glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-2xl animate-fade-in-up">
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span className="text-[#FF5B09] uppercase tracking-wider">
                  Питання {step - 1} з 12
                </span>
                <span className="font-mono text-slate-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7411] to-[#FF5B09] transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            {(() => {
              const qIndex = step - 2;
              const q = QUESTIONS[qIndex];
              const selectedOptIndex = answers[qIndex];

              return (
                <div>
                  <div className="mb-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-100/70 text-[#B23C00] text-[11px] font-bold uppercase tracking-wider mb-2">
                      {q.categoryBadge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {q.question}
                    </h2>
                  </div>

                  <div className="space-y-3 mb-8">
                    {q.opts.map((opt, optIdx) => {
                      const isPicked = selectedOptIndex === optIdx;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${
                            isPicked
                              ? 'border-[#FF5B09] bg-orange-50/80 shadow-md shadow-orange-500/10'
                              : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/30'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-black text-sm transition-colors ${
                              isPicked
                                ? 'bg-[#FF5B09] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                              {opt.text}
                            </p>
                            <span
                              className={`inline-block mt-1 text-[11px] font-extrabold ${
                                opt.hours > 0 ? 'text-[#FF5B09]' : 'text-emerald-600'
                              }`}
                            >
                              {opt.hours > 0 ? `+${opt.hours} год рутини` : '✓ 0 год (автоматизовано)'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goTo(step === 2 ? 1 : step - 1)}
                      className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft size={16} />
                      <span>Назад</span>
                    </button>
                    <span className="text-xs font-semibold text-slate-400">
                      Оберіть варіант для продовження
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SCREEN 14: LEAD FORM
        ══════════════════════════════════════════════════ */}
        {step === 14 && (
          <div className="max-w-xl mx-auto w-full glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 text-[#FF5B09] flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                📊
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                🎉 Ваш розрахунок готовий!
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                Вкажіть контакти, щоб розблокувати повну аналітику фінансових втрат компанії та
                отримати персональний розбір автоматизації.
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ваше ім'я <span className="text-[#FF5B09]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Олена або Олександр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#FF5B09] outline-none font-semibold text-slate-900 bg-white transition-all disabled:opacity-50 text-base"
                />
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Корпоративний Work Email <span className="text-[#FF5B09]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="hr@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#FF5B09] outline-none font-semibold text-slate-900 bg-white transition-all disabled:opacity-50 text-base"
                />
              </div>

              {/* Phone with multi-country dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Номер телефону <span className="text-[#FF5B09]">*</span>
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

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Назва вашої компанії <span className="text-slate-400 font-normal">(необов'язково)</span>
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: IT Solutions Group"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#FF5B09] outline-none font-semibold text-slate-900 bg-white transition-all disabled:opacity-50 text-base"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !email.trim() || !isPhoneValid}
                className="w-full py-4.5 bg-gradient-to-r from-[#FF7411] to-[#FF5B09] hover:from-[#F56600] hover:to-[#E24A00] text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                <span>{isSubmitting ? 'Формуємо ваш звіт...' : 'Показати мій результат'}</span>
                {!isSubmitting && <ArrowRight size={20} />}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-1">
                <ShieldCheck size={14} className="text-slate-400" />
                <span>Конфіденційність гарантовано • Жодного спаму</span>
              </div>
            </form>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goTo(13)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Назад до запитань</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SCREEN 15: FINAL RESULT DASHBOARD
        ══════════════════════════════════════════════════ */}
        {step === 15 && (
          <section className="space-y-7 animate-fade-in-up py-4">
            {/* Top Banner & Heading */}
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black tracking-wide ${currentZone.badgeClass}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {currentZone.badge}
                </div>
                {company.trim() && (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Звіт для: <strong>{company.trim()}</strong>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                {currentZone.titleTemplate(calcResults.weekHours, calcResults.monthMoney)}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mb-6">
                {currentZone.desc}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF7411] to-[#FF5B09] hover:from-[#F56600] hover:to-[#E24A00] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3"
                >
                  <span>{currentZone.ctaText}</span>
                  <ArrowRight size={20} />
                </button>
                <a
                  href="https://t.me/+L_g5QbqbbqsxYzU6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-[#229ED9] hover:bg-[#1E8EC4] text-white font-black text-sm sm:text-base rounded-2xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-2.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>Перейти в наш Telegram →</span>
                </a>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base rounded-2xl border border-slate-300 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  <span>Пройти ще раз</span>
                </button>
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Metric 1 */}
              <div className="glass-panel rounded-3xl p-6 border border-white flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Втрати на тиждень</span>
                  <Clock size={18} className="text-orange-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                  {calcResults.weekHours}{' '}
                  <span className="text-base font-semibold text-slate-500">годин</span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-2">
                  Час, який HR-команда витрачає суто на ручні таблиці й запити
                </p>
              </div>

              {/* Metric 2 */}
              <div className="glass-panel rounded-3xl p-6 border border-white flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Втрати на місяць</span>
                  <TrendingDown size={18} className="text-orange-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                  {calcResults.monthHours}{' '}
                  <span className="text-base font-semibold text-slate-500">годин</span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-2">
                  Еквівалент майже половини робочого місяця окремого фахівця
                </p>
              </div>

              {/* Metric 3 */}
              <div className="glass-panel rounded-3xl p-6 border border-white flex flex-col justify-between bg-gradient-to-br from-orange-500/5 to-transparent">
                <div className="flex items-center justify-between text-xs font-bold text-[#FF5B09] uppercase tracking-wider mb-2">
                  <span>Збитки бізнесу</span>
                  <DollarSign size={18} className="text-[#FF5B09]" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#FF5B09] leading-none">
                  ${calcResults.monthMoney}{' '}
                  <span className="text-base font-semibold text-slate-500">/ місяць</span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-2">
                  Розраховано за середньою ставкою HR-спеціаліста $12/год
                </p>
              </div>
            </div>

            {/* Telegram Community Card */}
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-sky-100/80 bg-gradient-to-r from-sky-50/60 via-white to-orange-50/30 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/25">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#0284c7] mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                    Офіційна спільнота JustSchool Business
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Спільнота HR & People Partners у Telegram
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 leading-relaxed">
                    Обмін практиками, шаблони оптимізації рутини та поради щодо навчання команд без зайвої бюрократії.
                  </p>
                </div>
              </div>
              <a
                href="https://t.me/+L_g5QbqbbqsxYzU6"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-full sm:w-auto px-7 py-4 bg-[#229ED9] hover:bg-[#1E8EC4] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2.5"
              >
                <span>Перейти в Telegram →</span>
              </a>
            </div>

            {/* Breakdown of Processes & Actionable recommendation */}
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-xl">
              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                  Аналітика вузьких місць
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Де ваша компанія втрачає найбільше часу
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  Топ-процеси за вашими відповідями, відсортовані за обсягом ручної праці (годин на тиждень).
                </p>
              </div>

              {calcResults.topProcesses.length > 0 ? (
                <div className="space-y-4 mb-7">
                  {calcResults.topProcesses.map((proc, i) => {
                    const share = calcResults.weekHours > 0 ? Math.round((proc.hours / calcResults.weekHours) * 100) : 0;
                    const barWidth = Math.max(10, Math.round((proc.hours / calcResults.maxProcessHours) * 100));

                    return (
                      <div key={proc.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2">
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF5B09] text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            {proc.name}
                          </span>
                          <span className="font-mono text-slate-600 font-extrabold">
                            {proc.hours} год <span className="text-xs font-normal text-slate-400">({share}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-[#FF5B09] rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold mb-7">
                  🎉 У всіх процесах ручної рутини не виявлено! Ваша система максимально оптимізована.
                </div>
              )}

              {/* Actionable recommendation box */}
              {calcResults.topProcesses.length > 0 && (
                <div className="p-5 rounded-2xl bg-orange-50/90 border border-orange-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5B09] text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                      З чого почати автоматизацію: «{calcResults.topProcesses[0].name}»
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      На цей процес припадає{' '}
                      <strong>
                        {calcResults.weekHours > 0
                          ? Math.round((calcResults.topProcesses[0].hours / calcResults.weekHours) * 100)
                          : 0}
                        %
                      </strong>{' '}
                      ваших щотижневих втрат ({calcResults.topProcesses[0].hours} год/тиждень).
                      Впровадження HR-платформи JustSchool для корпоративної англійської автоматизує
                      розклад, перенесення уроків, баланс занять та відвідуваність в один клік —
                      співробітники керують навчанням самі, а ви отримуєте готову онлайн-аналітику.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-7 py-4 bg-gradient-to-r from-[#FF7411] to-[#FF5B09] hover:from-[#F56600] hover:to-[#E24A00] text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2.5"
                >
                  <Sparkles size={18} />
                  <span>{currentZone.secondaryCtaText}</span>
                </button>
                <span className="text-xs font-semibold text-slate-400">
                  Множник масштабу: ×{multiplier} ({sizeIdx !== null ? COMPANY_SIZES[sizeIdx].label : ''} людей)
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 border-t border-slate-200/60 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500 relative z-10">
        <div>
          © {new Date().getFullYear()} JustSchool B2B Corporate Solutions. Всі права захищено.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://justschool.me/uk/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            Політика конфіденційності
          </a>
          <span>•</span>
          <a
            href="https://justschool.me/uk/terms-of-use"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            Умови користування
          </a>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════
          DEMO BOOKING MODAL
      ══════════════════════════════════════════════════ */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {!demoSubmitted ? (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="pr-8">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-100 text-[#B23C00] text-[11px] font-extrabold uppercase tracking-wider mb-2">
                    B2B Презентація та Демо
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Запис на онлайн-демо платформи JustSchool
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Покажемо за 15 хвилин, як автоматизувати корпоративну англійську та зекономити до
                    80% робочого часу HR-відділу.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex flex-col gap-1">
                    <div>
                      <span className="text-slate-400">Контактна особа:</span> {name} ({email})
                    </div>
                    <div>
                      <span className="text-slate-400">Телефон:</span> {rawPhone}
                    </div>
                    {company && (
                      <div>
                        <span className="text-slate-400">Компанія:</span> {company}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Зручний час для дзвінка або коментар
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Наприклад: Зручно завтра після 14:00 або напишіть у Telegram"
                      value={demoNote}
                      onChange={(e) => setDemoNote(e.target.value)}
                      disabled={demoSubmitting}
                      className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#FF5B09] outline-none font-medium text-slate-900 text-sm resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={demoSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#FF7411] to-[#FF5B09] hover:from-[#F56600] hover:to-[#E24A00] text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  <span>{demoSubmitting ? 'Підтверджуємо...' : 'Підтвердити запис на демо'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900">Заявку прийнято!</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Дякуємо! Наш B2B Account Director зв'яжеться з вами найближчим часом для узгодження
                  зручного часу онлайн-демо.
                </p>
                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href="https://t.me/+L_g5QbqbbqsxYzU6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#229ED9] hover:bg-[#1E8EC4] text-white font-black text-base rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                    <span>Перейти в наш Telegram →</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsDemoModalOpen(false)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Закрити вікно
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
