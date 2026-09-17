import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import { STEPS, QuizStep } from './data';
import logoUkrSib from './assets/logo-ukrsib.png';

export default function App() {
  // ─── State ───────────────────────────────────────────────
  const [step, setStep] = useState(0); // 0 = Hero, 1..11 = Steps, 12 = Loader, 13 = Final Form, 14 = Success
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState('');

  // Contact fields (filled in steps 1, 2, 3 and verified in step 13)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [animKey, setAnimKey] = useState(0);
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // ─── GEO detection & URL leadType ────────────────────────
  useEffect(() => {
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
      quiz_name: 'eng-adult-b2b-ukrsib',
      step_number: step,
      step_type: currentStepData?.type || 'unknown',
      step_title: currentStepData?.question || currentStepData?.title || 'unknown',
    });
  }, [step, currentStepData]);

  // ─── Loader animation ────────────────────────────────────
  useEffect(() => {
    if (step !== 12) return;
    setLoaderProgress(0);
    const interval = setInterval(() => {
      setLoaderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(13);
            window.scrollTo(0, 0);
          }, 500);
          return 100;
        }
        return Math.min(prev + 1.6, 100);
      });
    }, 35);
    return () => clearInterval(interval);
  }, [step]);

  // ─── Navigation ──────────────────────────────────────────
  const advance = () => {
    setAnimKey(k => k + 1);
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    if (step <= 0 || isSuccess) return;
    setAnimKey(k => k + 1);
    setStep(s => (s === 13 ? 11 : s - 1));
    window.scrollTo(0, 0);
  };

  // ─── Choice Handlers ─────────────────────────────────────
  const handleChoice = (stepId: number, label: string) => {
    setAnswers(prev => ({ ...prev, [stepId]: label }));
    advance();
  };

  const toggleMulti = (stepId: number, label: string) => {
    setMultiAnswers(prev => {
      const cur = prev[stepId] || [];
      return {
        ...prev,
        [stepId]: cur.includes(label) ? cur.filter(o => o !== label) : [...cur, label],
      };
    });
  };

  const toggleDay = (label: string) => {
    setScheduleDays(prev =>
      prev.includes(label) ? prev.filter(d => d !== label) : [...prev, label]
    );
  };

  const toggleTime = (label: string) => {
    setScheduleTimes(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  // ─── Form submit ─────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // double submission guard
    if (!isPhoneValid || !name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    // Build structured Q&A strings for Excel and database
    const ipString = `ip:${ipInfo.ip || 'unknown'}|country:${ipInfo.country || 'unknown'}`;
    const goalText =
      answers[7] === 'Інше' && otherGoal.trim()
        ? `Інше: ${otherGoal.trim()}`
        : answers[7] || '';

    const qaParts = [
      ipString,
      `ПІБ співробітника: ${name.trim()}`,
      `Контактний телефон: ${rawPhone}`,
      `Email співробітника: ${email.trim()}`,
      `Інтенсивність навчання: ${answers[4] || 'Не вказано'}`,
      `Зручні дні для занять: ${scheduleDays.length ? scheduleDays.join(', ') : 'Не вказано'}`,
      `Зручний час для занять: ${scheduleTimes.length ? scheduleTimes.join(', ') : 'Не вказано'}`,
      `Поточний рівень англійської: ${answers[6] || 'Не вказано'}`,
      `Основна мета вивчення: ${goalText || 'Не вказано'}`,
      `Ситуації використання англійської: ${(multiAnswers[8] || []).join(', ') || 'Не вказано'}`,
      `Навички для покращення: ${(multiAnswers[9] || []).join(', ') || 'Не вказано'}`,
      `Побажання щодо викладача: ${answers[10] || 'Не вказано'}`,
      `Напрям навчання: ${answers[11] || 'Не вказано'}`,
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim(),
      qa: qaParts.join(' ||| '),
      dialogueUrl: window.location.href,
      dialogueName: 'JustSchool x UkrSibbank B2B Quiz',
      dialogueId: 'b2b_ukrsib',
      utm_source: urlParams.get('utm_source') || 'ukrsibbank',
      utm_medium: urlParams.get('utm_medium') || 'b2b_corporate',
      utm_campaign: urlParams.get('utm_campaign') || 'ukrsib_english',
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      utm_subject: 'English',
      subject: 'English',
      lead_type: 'english-for-adults-b2b',
      Lead_type: 'english-for-adults-b2b',
      company: 'UKRSIBBANK BNP Paribas Group',
      b2b: true,
      saveToGoogleSheets: true,
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
          quiz_name: 'eng-adult-b2b-ukrsib',
        });
      }
      setIsSuccess(true);
      setStep(14);
      window.scrollTo(0, 0);
    } catch {
      // Show success screen even if network error so user isn't stuck
      setIsSuccess(true);
      setStep(14);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Progress calculation ────────────────────────────────
  // Progress across steps 1..11
  const currentProgressPercent =
    step === 0
      ? 0
      : step >= 12
      ? 100
      : Math.round((step / 11) * 100);

  return (
    <div
      className="min-h-screen text-slate-900 flex flex-col items-center selection:bg-[var(--orange-100)] selection:text-[var(--orange-800)]"
      style={{ backgroundColor: 'var(--surface-page-warm)' }}
    >
      {/* ─── Sticky Header ─── */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 0 && !isSuccess && (
              <button
                type="button"
                onClick={back}
                aria-label="Назад"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                ←
              </button>
            )}
            {/* Co-branded logo */}
            <div className="flex items-center">
              <img
                src={logoUkrSib}
                alt="JustSchool × UKRSIBBANK BNP PARIBAS GROUP"
                className="h-8 md:h-9 object-contain"
              />
            </div>
          </div>

          {step > 0 && step <= 11 && !isSuccess && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Питання
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--orange-25)] text-[var(--orange-700)] border border-[var(--orange-100)]">
                {step} / 11
              </span>
            </div>
          )}
        </div>

        {/* JustSchool Brand orange progress bar */}
        {step > 0 && !isSuccess && (
          <div className="w-full h-1 bg-[var(--orange-100)]/60">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${currentProgressPercent}%`,
                backgroundColor: 'var(--brand)',
              }}
            />
          </div>
        )}
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="w-full max-w-2xl px-4 py-8 flex-1 flex flex-col justify-center">
        <div key={animKey} className="step-enter">
          {/* ════ STEP 0: HERO ════ */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--orange-25)] border border-[var(--orange-200)] text-[var(--orange-700)] text-xs md:text-sm font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
                Корпоративна програма навчання англійської
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Визначення рівня, розкладу та цілей навчання для співробітників{' '}
                <span className="text-[#00965E]">UKRSIBBANK</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                Спільний проєкт професійного розвитку від UKRSIBBANK BNP Paribas Group та
                онлайн-школи JustSchool. Пройдіть коротке опитування для підбору
                індивідуальної програми занять.
              </p>

              {/* Highlights cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[var(--orange-300)] transition-all">
                  <div className="text-2xl mb-1.5">🎯</div>
                  <div className="font-bold text-slate-900 text-sm">Цільовий трек</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Бізнес-англійська, розмовна практика або IT-напрям
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[var(--orange-300)] transition-all">
                  <div className="text-2xl mb-1.5">🗓️</div>
                  <div className="font-bold text-slate-900 text-sm">Гнучкий графік</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Уроки вранці, в обід або ввечері під ваш робочий розклад
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[var(--orange-300)] transition-all">
                  <div className="text-2xl mb-1.5">👨‍🏫</div>
                  <div className="font-bold text-slate-900 text-sm">Кращі викладачі</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Україномовні або Native Speakers на вибір
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={advance}
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--brand)',
                    boxShadow: 'var(--shadow-brand)',
                  }}
                >
                  Розпочати опитування →
                </button>
                <div className="text-xs text-slate-400 mt-2.5">
                  Час проходження: ~2 хвилини • Безкоштовно в межах програми банку
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 1: ПІБ ════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[1].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[1].subtitle}</p>
              </div>

              <div>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && name.trim().length >= 2) advance();
                  }}
                  placeholder={STEPS[1].placeholder}
                  className="w-full px-4 py-3.5 text-base font-semibold rounded-2xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/20 outline-none bg-white transition-all shadow-xs"
                />
              </div>

              <button
                type="button"
                disabled={name.trim().length < 2}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow:
                    name.trim().length >= 2
                      ? 'var(--shadow-brand)'
                      : 'none',
                }}
              >
                {STEPS[1].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 2: ТЕЛЕФОН ════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[2].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[2].subtitle}</p>
              </div>

              <div>
                <PhoneInput
                  value={rawPhone}
                  onChange={(raw, valid) => {
                    setRawPhone(raw);
                    setIsPhoneValid(valid);
                  }}
                  initialCountry={geoCountry}
                />
              </div>

              <button
                type="button"
                disabled={!isPhoneValid}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow: isPhoneValid
                    ? 'var(--shadow-brand)'
                    : 'none',
                }}
              >
                {STEPS[2].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 3: EMAIL ════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[3].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[3].subtitle}</p>
              </div>

              <div>
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && email.includes('@') && email.includes('.'))
                      advance();
                  }}
                  placeholder={STEPS[3].placeholder}
                  className="w-full px-4 py-3.5 text-base font-semibold rounded-2xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/20 outline-none bg-white transition-all shadow-xs"
                />
              </div>

              <button
                type="button"
                disabled={!email.includes('@') || !email.includes('.')}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow:
                    email.includes('@') && email.includes('.')
                      ? 'var(--shadow-brand)'
                      : 'none',
                }}
              >
                {STEPS[3].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 4: ІНТЕНСИВНІСТЬ ════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[4].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[4].subtitle}</p>
              </div>

              <div className="space-y-3">
                {STEPS[4].options?.map(opt => {
                  const isSelected = answers[4] === opt.label;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChoice(4, opt.label)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-base">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 5: ДНІ ТА ЧАС ════ */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[5].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[5].subtitle}</p>
              </div>

              {/* Days selection */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Зручні дні тижня:
                </div>
                <div className="flex flex-wrap gap-2">
                  {STEPS[5].days?.map(d => {
                    const isSelected = scheduleDays.includes(d.label);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.label)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--orange-25)] text-[var(--orange-800)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {d.label} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots selection */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Зручний час для занять:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STEPS[5].timeSlots?.map(t => {
                    const isSelected = scheduleTimes.includes(t.label);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => toggleTime(t.label)}
                        className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--orange-25)]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold text-sm ${
                              isSelected ? 'text-[var(--orange-800)]' : 'text-slate-900'
                            }`}
                          >
                            {t.label}
                          </span>
                          {isSelected && (
                            <span className="text-xs font-bold text-[var(--brand)]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{t.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={scheduleDays.length === 0 || scheduleTimes.length === 0}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow:
                    scheduleDays.length > 0 && scheduleTimes.length > 0
                      ? 'var(--shadow-brand)'
                      : 'none',
                }}
              >
                {STEPS[5].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 6: РІВЕНЬ ════ */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[6].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[6].subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {STEPS[6].options?.map(opt => {
                  const isSelected = answers[6] === opt.label;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChoice(6, opt.label)}
                      className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 7: МЕТА НАВЧАННЯ ════ */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[7].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[7].subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {STEPS[7].options?.map(opt => {
                  const isSelected = answers[7] === opt.label;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, [7]: opt.label }));
                        if (opt.value !== 'other') advance();
                      }}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="flex-1 font-bold text-slate-900 text-sm sm:text-base">
                        {opt.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Інше" is chosen */}
              {answers[7] === 'Інше' && (
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    autoFocus
                    value={otherGoal}
                    onChange={e => setOtherGoal(e.target.value)}
                    placeholder="Опишіть вашу мету..."
                    className="w-full px-4 py-3 text-base rounded-xl border-2 border-slate-300 focus:border-[var(--brand)] outline-none bg-white"
                  />
                  <button
                    type="button"
                    disabled={!otherGoal.trim()}
                    onClick={advance}
                    className="w-full py-3.5 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 cursor-pointer"
                    style={{ backgroundColor: 'var(--brand)' }}
                  >
                    Продовжити →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 8: СИТУАЦІЇ ВИКОРИСТАННЯ ════ */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[8].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[8].subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {STEPS[8].options?.map(opt => {
                  const isSelected = (multiAnswers[8] || []).includes(opt.label);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleMulti(8, opt.label)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="flex-1 font-bold text-slate-900 text-sm sm:text-base">
                        {opt.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={(multiAnswers[8] || []).length === 0}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow:
                    (multiAnswers[8] || []).length > 0
                      ? 'var(--shadow-brand)'
                      : 'none',
                }}
              >
                {STEPS[8].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 9: НАВИЧКИ ДЛЯ ПОКРАЩЕННЯ ════ */}
          {step === 9 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[9].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[9].subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {STEPS[9].options?.map(opt => {
                  const isSelected = (multiAnswers[9] || []).includes(opt.label);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleMulti(9, opt.label)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="flex-1 font-bold text-slate-900 text-sm sm:text-base">
                        {opt.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={(multiAnswers[9] || []).length === 0}
                onClick={advance}
                className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--brand)',
                  boxShadow:
                    (multiAnswers[9] || []).length > 0
                      ? 'var(--shadow-brand)'
                      : 'none',
                }}
              >
                {STEPS[9].cta}
              </button>
            </div>
          )}

          {/* ════ STEP 10: ВИКЛАДАЧ ════ */}
          {step === 10 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[10].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[10].subtitle}</p>
              </div>

              <div className="space-y-3">
                {STEPS[10].options?.map(opt => {
                  const isSelected = answers[10] === opt.label;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChoice(10, opt.label)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-base">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 11: НАПРЯМ НАВЧАННЯ ════ */}
          {step === 11 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[11].question}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[11].subtitle}</p>
              </div>

              <div className="space-y-3">
                {STEPS[11].options?.map(opt => {
                  const isSelected = answers[11] === opt.label;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, [11]: opt.label }));
                        // Move to Loader
                        setStep(12);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--orange-25)] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[var(--orange-200)] hover:bg-[var(--orange-25)]/40'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-base">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 12: АНІМОВАНИЙ ЛОАДЕР ════ */}
          {step === 12 && (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-200 border-t-[var(--brand)] animate-spin" />

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {STEPS[12].title}
                </h2>
                <p className="text-sm text-slate-500">{STEPS[12].subtitle}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-sm mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-150"
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>

              <div className="text-xs font-bold text-[var(--orange-700)]">
                {Math.round(loaderProgress)}% завершено
              </div>

              {/* Checklist items */}
              <div className="max-w-md mx-auto space-y-2 text-left pt-2">
                {STEPS[12].points?.map((pt, i) => {
                  const threshold = (i + 1) * 23;
                  const isDone = loaderProgress >= threshold;
                  return (
                    <div
                      key={pt}
                      className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
                        isDone ? 'opacity-100 font-semibold text-slate-800' : 'opacity-40 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          isDone
                            ? 'bg-[var(--orange-25)] text-[var(--brand)] font-bold border border-[var(--orange-200)]'
                            : 'bg-slate-100 text-slate-300'
                        }`}
                      >
                        ✓
                      </span>
                      <span>{pt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 13: ФОРМА ЗАХВАТУ КОНТАКТУ / ПІДТВЕРДЖЕННЯ ════ */}
          {step === 13 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--orange-25)] border border-[var(--orange-200)] text-[var(--orange-700)] text-xs font-bold">
                  <span>✨</span> Індивідуальну програму сформовано
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {STEPS[13].title}
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {STEPS[13].subtitle}
                </p>
              </div>

              {/* Questionnaire Summary Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ваш попередній вибір:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block">Рівень:</span>
                    <span className="font-bold text-slate-800">
                      {answers[6] || 'Визначається'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block">Інтенсивність:</span>
                    <span className="font-bold text-slate-800">
                      {answers[4] || '2 рази на тиждень'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block">Напрям:</span>
                    <span className="font-bold text-slate-800">
                      {answers[11] || 'Загальна англійська'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block">Зручні дні:</span>
                    <span className="font-bold text-slate-800">
                      {scheduleDays.length ? scheduleDays.join(', ') : 'Гнучко'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Confirmation Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    ПІБ співробітника:
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Прізвище, Ім'я, По батькові"
                    className="w-full px-4 py-3.5 text-base font-semibold rounded-2xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/20 outline-none bg-white transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Номер телефону:
                  </label>
                  <PhoneInput
                    value={rawPhone}
                    disabled={isSubmitting}
                    onChange={(raw, valid) => {
                      setRawPhone(raw);
                      setIsPhoneValid(valid);
                    }}
                    initialCountry={geoCountry}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Електронна пошта:
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@ukrsibbank.com"
                    className="w-full px-4 py-3.5 text-base font-semibold rounded-2xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/20 outline-none bg-white transition-all disabled:opacity-50"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !isPhoneValid || !email.trim()}
                    className="w-full py-4 rounded-full text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: 'var(--brand)',
                      boxShadow: 'var(--shadow-brand)',
                    }}
                  >
                    {isSubmitting ? 'Надсилаємо заявку...' : STEPS[13].cta}
                  </button>
                </div>

                <div className="text-center text-xs text-slate-400 pt-1">
                  🔒 Ваші дані захищено відповідно до політики конфіденційності та
                  корпоративних стандартів UKRSIBBANK BNP Paribas Group.
                </div>
              </form>
            </div>
          )}

          {/* ════ STEP 14: SUCCESS / ДЯКУЄМО ════ */}
          {step === 14 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-[var(--orange-25)] border-2 border-[var(--orange-200)] flex items-center justify-center text-4xl text-[var(--brand)] shadow-xs">
                ✓
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Дякуємо, {name.split(' ')[1] || name}!
                </h2>
                <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Вашу анкету успішно прийнято та зафіксовано в системі корпоративного
                  навчання UKRSIBBANK BNP Paribas Group.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 max-w-md mx-auto text-left space-y-2 shadow-xs">
                <div className="font-bold text-slate-800 text-sm">
                  Що відбуватиметься далі:
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <div>
                    1. Методист JustSchool зв’яжеться з вами за номером{' '}
                    <span className="font-bold text-slate-800">{rawPhone}</span> або через{' '}
                    <span className="font-bold text-slate-800">{email}</span>.
                  </div>
                  <div>
                    2. Ми узгодимо точний розклад вступного уроку згідно з вашими побажаннями.
                  </div>
                  <div>
                    3. Ви отримаєте доступ до інтерактивної навчальної платформи JustSchool.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://justschool.me/uk"
                  className="inline-block px-8 py-3.5 rounded-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold text-sm transition-all shadow-md"
                  style={{ boxShadow: 'var(--shadow-brand)' }}
                >
                  Перейти на головну JustSchool →
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Minimal Corporate Footer ─── */}
      <footer className="w-full py-4 border-t border-slate-200 bg-white/70 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} JustSchool × UKRSIBBANK BNP Paribas Group.
          </div>
          <div>Корпоративна програма навчання англійської мови</div>
        </div>
      </footer>
    </div>
  );
}
