import React, { useState, useEffect, useRef } from 'react';
import PhoneInput from './PhoneInput';
import logoBlack from './assets/logo-black.svg';
import heroBrush from './assets/hero-brush.png';
import heroStudent from './assets/hero-student.png';
import teacherPhoto from './assets/photo-1.jpg';

// ─── Analytics Helpers ─────────────────────────────────────
function pushAnalytics(event: string, data: Record<string, any> = {}) {
  try {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event,
      page: 'lp_test1',
      ...data,
    });
  } catch {}
}

function triggerFbLead() {
  try {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead');
      (window as any).fbq('track', 'Purchase', { currency: 'UAH', value: 0 });
    }
  } catch {}
}

export default function App() {
  // Hero Form State
  const [heroName, setHeroName] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroPhoneValid, setHeroPhoneValid] = useState(false);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSent, setHeroSent] = useState(false);

  // Final Form State
  const [finalName, setFinalName] = useState('');
  const [finalPhone, setFinalPhone] = useState('');
  const [finalPhoneValid, setFinalPhoneValid] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [finalSent, setFinalSent] = useState(false);

  // General UI state
  const [geoCountry, setGeoCountry] = useState('UA');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [nearFinal, setNearFinal] = useState(false);

  const heroFormRef = useRef<HTMLDivElement>(null);
  const finalFormRef = useRef<HTMLDivElement>(null);

  // ─── GEO detection & Auto leadType in URL ─────────────────
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
        if (d?.country) setGeoCountry(d.country);
      })
      .catch(() => {});
  }, []);

  // ─── Scroll tracker for floating sticky bar ───────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (finalFormRef.current) {
        const rect = finalFormRef.current.getBoundingClientRect();
        setNearFinal(rect.top < window.innerHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Smooth Scroll to Forms ──────────────────────────────
  const scrollToHeroForm = () => {
    pushAnalytics('cta_click', { cta_target: 'hero_form' });
    if (heroFormRef.current) {
      heroFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = heroFormRef.current.querySelector('input');
      if (input) setTimeout(() => input.focus(), 600);
    }
  };

  const scrollToFinalForm = () => {
    pushAnalytics('cta_click', { cta_target: 'final_form' });
    if (finalFormRef.current) {
      finalFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = finalFormRef.current.querySelector('input');
      if (input) setTimeout(() => input.focus(), 600);
    }
  };

  // ─── Lead Submission Handler ─────────────────────────────
  const submitLead = async (formSource: 'hero' | 'final') => {
    const isHero = formSource === 'hero';
    const name = isHero ? heroName : finalName;
    const phone = isHero ? heroPhone : finalPhone;
    const isPhoneValid = isHero ? heroPhoneValid : finalPhoneValid;
    const setSubmitting = isHero ? setHeroSubmitting : setFinalSubmitting;
    const setSent = isHero ? setHeroSent : setFinalSent;

    if (!name.trim()) {
      alert("Будь ласка, вкажіть ваше ім'я");
      return;
    }
    if (!phone || !isPhoneValid) {
      alert('Будь ласка, введіть коректний номер телефону');
      return;
    }

    setSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: phone,
      email: `${phone.replace(/\D/g, '')}@lead.justschool.me`,
      qa: `Форма: ${isHero ? 'Hero Form (Верхня форма)' : 'Final CTA (Нижня форма)'} ||| Сторінка: LP Test 1 (Redesign Design System)`,
      dialogueUrl: window.location.href,
      dialogueName: 'JustSchool LP Test 1',
      dialogueId: 'lp_test1',
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
      // 1. Trigger Facebook Pixel Lead events
      triggerFbLead();

      // 2. Fallback timeout for client redirect if needed
      const fallbackTimer = setTimeout(() => {
        setSent(true);
        setSubmitting(false);
      }, 7000);

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearTimeout(fallbackTimer);

      if (res.ok) {
        // 3. Trigger GTM & GA4 form_success event
        pushAnalytics('form_success', {
          form_source: formSource,
          form_name: `lp_test1_${formSource}`,
          lead_type: 'english-for-adults',
        });

        const data = await res.json();
        setSent(true);

        if (data?.redirectUri) {
          setTimeout(() => {
            window.location.href = data.redirectUri;
          }, 1500);
        }
      } else {
        setSent(true);
      }
    } catch (err) {
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── FAQ Data ────────────────────────────────────────────
  const faqList = [
    {
      q: 'Скільки коштує навчання?',
      a: 'Вартість залежить від обраного формату (індивідуально чи в групі) та кількості занять у пакеті. Під час безкоштовного пробного уроку методист визначить ваш рівень та підбере найвигідніший тариф.',
    },
    {
      q: 'Чи підійде курс, якщо я починаю з нуля?',
      a: 'Так, неодмінно! Наша програма розроблена для всіх рівнів — від абсолютного початківця (Beginner A0/A1) до вільного володіння (Advanced C1/C2). Викладач рухається у комфортному для вас темпі.',
    },
    {
      q: 'Чи можна змінити викладача або перенести заняття?',
      a: 'Так. Ви можете безкоштовно змінити викладача в будь-який момент без пояснення причин, а також самостійно керувати розкладом і переносити уроки в особистому кабінеті.',
    },
    {
      q: 'Що потрібно для навчання?',
      a: 'Лише комп’ютер, ноутбук, планшет або смартфон зі стабільним інтернетом. Усі підручники, аудіоматеріали, вправи та відеозв’язок вже вбудовані у нашу інтерактивну платформу.',
    },
  ];

  const toggleFaq = (index: number) => {
    const isOpening = openFaq !== index;
    setOpenFaq(isOpening ? index : null);
    pushAnalytics('faq_toggle', {
      faq_question: faqList[index].q,
      is_open: isOpening,
    });
  };

  const showStickyBar = scrollY > 700 && !nearFinal;

  return (
    <div className="min-h-screen bg-white text-[#09090A] flex flex-col items-center selection:bg-[#FFE0CA] selection:text-[#F56600]">
      {/* ─── Header ─── */}
      <header className="w-full border-b border-[#E5E5E5] bg-white sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[140px] py-4 sm:py-6 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img src={logoBlack} alt="JustSchool" className="h-6 sm:h-[26px] w-auto" />
          </a>
          <div className="flex items-center gap-4 sm:gap-7">
            <span className="hidden sm:inline text-xs sm:text-[13px] font-semibold tracking-[0.12em] uppercase text-[#747474]">
              Онлайн-школа англійської
            </span>
            <span className="hidden sm:block w-[1px] h-4 bg-[#E5E5E5]" />
            <span className="text-xs sm:text-[14px] font-semibold text-[#09090A]">
              ⭐ 4.9/5 · 1 700+ викладачів
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main Container ─── */}
      <main className="w-full max-w-[1440px] overflow-hidden flex flex-col">
        {/* ─── Hero Section ─── */}
        <section className="px-4 sm:px-8 lg:px-[140px] pt-8 sm:pt-14 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 lg:gap-12 items-start">
          {/* Left Hero Content */}
          <div className="pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2.5 bg-[#FFF5EB] rounded-full px-4 py-2 mb-6 sm:mb-7">
              <span className="w-2 h-2 rounded-full bg-[#F46600] animate-pulse" />
              <span className="text-xs sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#BF6823]">
                Перший урок безкоштовно · 30 хвилин
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[68px] font-bold leading-[1.05] tracking-[-0.025em] text-[#09090A]">
              Заговоріть англійською{' '}
              <span className="text-[#F56600]">впевнено</span> — для роботи, подорожей і життя
            </h1>

            <p className="mt-5 sm:mt-7 text-base sm:text-[19px] leading-relaxed text-[#65676B] max-w-[560px]">
              Онлайн-заняття з викладачем за персональною програмою. 80% уроку — розмовна практика, а графік підлаштовується під вас.
            </p>

            <div className="flex flex-col gap-3 sm:gap-3.5 mt-7 sm:mt-9 pt-6 sm:pt-8 border-t border-[#E9E9E9]">
              <div className="flex items-center gap-3">
                <span className="text-[#F46600] text-lg font-bold">✓</span>
                <span className="text-sm sm:text-[17px] font-medium text-[#09090A]">
                  Програма відповідно до вашого рівня та цілей
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#F46600] text-lg font-bold">✓</span>
                <span className="text-sm sm:text-[17px] font-medium text-[#09090A]">
                  Індивідуально або в мінігрупі
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#F46600] text-lg font-bold">✓</span>
                <span className="text-sm sm:text-[17px] font-medium text-[#09090A]">
                  Результат або навчаємо за наш рахунок
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
              <button
                type="button"
                onClick={scrollToHeroForm}
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-white bg-[#F46600] hover:bg-[#F5AC72] active:bg-[#BF6823] transition-all h-[58px] sm:h-[62px] px-8 text-base sm:text-[17px] rounded-full shadow-[0px_4px_32px_0px_rgba(244,102,0,0.28)] cursor-pointer"
              >
                Записатися на безкоштовний урок
              </button>
              <span className="text-xs sm:text-[14px] leading-snug text-[#747474] max-w-[180px]">
                30 хвилин · без передоплати та зобов’язань
              </span>
            </div>
          </div>

          {/* Right Hero Visual & Embedded Form */}
          <div className="relative flex flex-col items-center">
            {/* Background Picture Card */}
            <div className="w-full h-[320px] sm:h-[400px] rounded-3xl bg-gradient-to-b from-[#FFF5EB] to-[#FFE0CA] relative overflow-hidden flex items-end justify-center">
              <img
                src={heroBrush}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply pointer-events-none"
              />
              <img
                src={heroStudent}
                alt="Студентка JustSchool"
                className="relative z-10 max-h-[92%] object-contain"
              />
            </div>

            {/* Embedded Lead Form Card */}
            <div
              ref={heroFormRef}
              className="w-full bg-white rounded-3xl shadow-[-2px_4px_16px_1px_rgba(0,0,0,0.08)] border border-slate-100 p-6 sm:p-8 -mt-12 sm:-mt-16 relative z-20"
            >
              <h3 className="text-lg sm:text-[21px] font-bold leading-tight text-[#09090A]">
                Отримати безкоштовний урок
              </h3>
              <p className="text-xs sm:text-[14px] text-[#747474] mt-1.5">
                Передзвонимо протягом 15 хвилин і підберемо час
              </p>

              {heroSent ? (
                <div className="mt-5 bg-[#FFF5EB] rounded-2xl p-5 border border-[#FFE0CA] text-center">
                  <div className="text-base font-bold text-[#BF6823]">Дякуємо! Заявку прийнято</div>
                  <div className="text-xs sm:text-sm text-[#65676B] mt-1.5">
                    Менеджер зв’яжеться з вами найближчим часом для підбору зручного часу.
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!heroSubmitting) submitLead('hero');
                  }}
                  className="flex flex-col gap-3 mt-5"
                >
                  <input
                    type="text"
                    required
                    placeholder="Ім’я"
                    value={heroName}
                    disabled={heroSubmitting}
                    onChange={(e) => setHeroName(e.target.value)}
                    className="h-[54px] sm:h-[58px] rounded-2xl border-0 shadow-[inset_0_0_0_1px_#C7C9CB] focus:shadow-[inset_0_0_0_2px_#F46600] px-5 text-base text-[#09090A] outline-hidden bg-white transition-all disabled:opacity-50"
                  />

                  <PhoneInput
                    value={heroPhone}
                    disabled={heroSubmitting}
                    initialCountry={geoCountry}
                    onChange={(raw, valid) => {
                      setHeroPhone(raw);
                      setHeroPhoneValid(valid);
                    }}
                  />

                  <button
                    type="submit"
                    disabled={heroSubmitting}
                    className="w-full inline-flex items-center justify-center font-semibold text-white bg-[#F46600] hover:bg-[#F5AC72] active:bg-[#BF6823] transition-all h-[54px] sm:h-[58px] text-base sm:text-[17px] rounded-2xl shadow-[0px_4px_24px_rgba(244,102,0,0.2)] disabled:opacity-60 cursor-pointer"
                  >
                    {heroSubmitting ? 'Надсилаємо заявку...' : 'Отримати безкоштовний урок'}
                  </button>

                  <p className="text-[11px] sm:text-xs text-[#747474] text-center mt-1">
                    Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ─── Trust & Stats Banner ─── */}
        <section className="w-full mt-10 sm:mt-16 bg-gradient-to-r from-[#F16600] to-[#F34500] text-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[140px] py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-14 items-center">
            <h2 className="text-2xl sm:text-[32px] font-bold leading-snug tracking-[-0.01em]">
              JustSchool — онлайн-школа, якій довіряють
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-0">
              <div className="sm:pl-6 sm:border-l sm:border-white/30">
                <div className="text-3xl sm:text-[40px] font-bold leading-none tracking-tight">
                  3 800 000+
                </div>
                <div className="text-xs sm:text-sm text-white/90 mt-2">проведених занять</div>
              </div>
              <div className="sm:pl-6 sm:border-l sm:border-white/30">
                <div className="text-3xl sm:text-[40px] font-bold leading-none tracking-tight">
                  1 700+
                </div>
                <div className="text-xs sm:text-sm text-white/90 mt-2">викладачів у команді</div>
              </div>
              <div className="sm:pl-6 sm:border-l sm:border-white/30">
                <div className="text-3xl sm:text-[40px] font-bold leading-none tracking-tight">
                  95%
                </div>
                <div className="text-xs sm:text-sm text-white/90 mt-2">студентів рекомендують нас</div>
              </div>
              <div className="sm:pl-6 sm:border-l sm:border-white/30">
                <div className="text-3xl sm:text-[40px] font-bold leading-none tracking-tight">
                  4.9/5
                </div>
                <div className="text-xs sm:text-sm text-white/90 mt-2">середня оцінка навчання</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4 Core Advantages ─── */}
        <section className="px-4 sm:px-8 lg:px-[140px] py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 sm:gap-14 items-end pb-8 sm:pb-12 border-b border-[#E9E9E9]">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.1] max-w-[700px]">
              Англійська, яка вписується у ваше життя
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#65676B]">
              Чотири речі, які роблять навчання в JustSchool якісно іншим від звичайних курсів «за підручником».
            </p>
          </div>

          <div className="divide-y divide-[#E9E9E9]">
            <div className="grid grid-cols-1 md:grid-cols-[80px_380px_1fr] gap-4 sm:gap-8 py-7 sm:py-9 items-start">
              <span className="text-lg sm:text-[20px] font-bold text-[#F46600]">01</span>
              <h3 className="text-xl sm:text-[26px] font-bold leading-snug">80% уроку — розмовна практика</h3>
              <p className="text-sm sm:text-[17px] leading-relaxed text-[#65676B] max-w-[520px]">
                Ви починаєте говорити англійською вже з першого заняття, а граматику вивчаєте через реальні ситуації та діалоги.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[80px_380px_1fr] gap-4 sm:gap-8 py-7 sm:py-9 items-start">
              <span className="text-lg sm:text-[20px] font-bold text-[#F46600]">02</span>
              <h3 className="text-xl sm:text-[26px] font-bold leading-snug">Персональна програма</h3>
              <p className="text-sm sm:text-[17px] leading-relaxed text-[#65676B] max-w-[520px]">
                Викладач адаптує заняття під ваш стартовий рівень і конкретну мету: кар’єру, подорожі, переїзд чи вільне спілкування.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[80px_380px_1fr] gap-4 sm:gap-8 py-7 sm:py-9 items-start">
              <span className="text-lg sm:text-[20px] font-bold text-[#F46600]">03</span>
              <h3 className="text-xl sm:text-[26px] font-bold leading-snug">Гнучкий графік занять</h3>
              <p className="text-sm sm:text-[17px] leading-relaxed text-[#65676B] max-w-[520px]">
                Навчайтеся вранці, вдень або ввечері. Уроки можна легко переносити в особистому кабінеті відповідно до ваших планів.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[80px_380px_1fr] gap-4 sm:gap-8 py-7 sm:py-9 items-start">
              <span className="text-lg sm:text-[20px] font-bold text-[#F46600]">04</span>
              <h3 className="text-xl sm:text-[26px] font-bold leading-snug">Прогрес під контролем</h3>
              <p className="text-sm sm:text-[17px] leading-relaxed text-[#65676B] max-w-[520px]">
                Після кожного уроку ви бачите фідбек викладача, словниковий запас та наочну аналітику досягнутих результатів на платформі.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Free Lesson Overview ─── */}
        <section className="w-full bg-[#FFFAF7] py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[140px] grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-3xl sm:text-[44px] font-bold tracking-[-0.025em] leading-[1.1]">
                Почніть із безкоштовного уроку
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#65676B]">
                Познайомтеся з форматом навчання та отримайте персональний план без жодної оплати й зобов’язань.
              </p>

              <div className="mt-8 bg-white rounded-2xl shadow-[-2px_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#747474]">
                  На уроці ви
                </div>
                <div className="flex flex-col gap-3.5 mt-5">
                  <div className="flex items-start gap-3">
                    <span className="text-[#F46600] font-bold">✓</span>
                    <span className="text-sm sm:text-base text-[#09090A]">визначите свій точний рівень англійської</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#F46600] font-bold">✓</span>
                    <span className="text-sm sm:text-base text-[#09090A]">познайомитеся з викладачем і платформою</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#F46600] font-bold">✓</span>
                    <span className="text-sm sm:text-base text-[#09090A]">сформулюєте реальні цілі та терміни навчання</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#F46600] font-bold">✓</span>
                    <span className="text-sm sm:text-base text-[#09090A]">отримаєте рекомендації щодо персональної програми</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={scrollToFinalForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-white bg-[#F46600] hover:bg-[#F5AC72] active:bg-[#BF6823] transition-all h-[56px] px-8 text-base rounded-full shadow-[0px_4px_24px_rgba(244,102,0,0.22)] cursor-pointer"
                >
                  Обрати час безкоштовного уроку
                </button>
              </div>
            </div>

            {/* 3 Steps Road */}
            <div className="flex flex-col gap-8 pt-2">
              <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[64px_1fr] gap-5 sm:gap-6 pb-7 border-b border-[#F0E4DA]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-[inset_0_0_0_1px_#FFE0CA] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#F46600]">
                  1
                </div>
                <div>
                  <h3 className="text-xl sm:text-[22px] font-bold leading-snug">Залишаєте заявку</h3>
                  <p className="text-xs sm:text-sm text-[#747474] mt-1.5">до 1 хвилини</p>
                </div>
              </div>

              <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[64px_1fr] gap-5 sm:gap-6 pb-7 border-b border-[#F0E4DA]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-[inset_0_0_0_1px_#FFE0CA] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#F46600]">
                  2
                </div>
                <div>
                  <h3 className="text-xl sm:text-[22px] font-bold leading-snug">Проходите безкоштовний урок</h3>
                  <p className="text-xs sm:text-sm text-[#747474] mt-1.5">приблизно 30 хвилин практики</p>
                </div>
              </div>

              <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[64px_1fr] gap-5 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#F16600] to-[#F34500] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-[0px_4px_16px_rgba(244,102,0,0.3)]">
                  3
                </div>
                <div>
                  <h3 className="text-xl sm:text-[22px] font-bold leading-snug">Отримуєте персональний план</h3>
                  <p className="text-xs sm:text-sm text-[#747474] mt-1.5">і вирішуєте, чи продовжувати навчання</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Teachers & Social Proof ─── */}
        <section className="px-4 sm:px-8 lg:px-[140px] py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 sm:gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.1] max-w-[600px]">
                Викладач, з яким легко заговорити
              </h2>
              <p className="mt-5 text-base sm:text-[18px] leading-relaxed text-[#65676B] max-w-[560px]">
                Ми підбираємо викладача відповідно до вашого рівня, цілей і темпу. Якщо викладач вам не підійде — його можна змінити в один клік без пояснень і доплат.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-7 mt-8 sm:mt-11">
                <div className="border-t-2 border-[#F46600] pt-4">
                  <div className="text-2xl sm:text-[34px] font-bold tracking-tight">1 із 89</div>
                  <div className="text-xs sm:text-[14px] text-[#65676B] mt-2 leading-tight">кандидатів проходить відбір</div>
                </div>
                <div className="border-t-2 border-[#F46600] pt-4">
                  <div className="text-2xl sm:text-[34px] font-bold tracking-tight">72%</div>
                  <div className="text-xs sm:text-[14px] text-[#65676B] mt-2 leading-tight">мають міжнародні сертифікати</div>
                </div>
                <div className="border-t-2 border-[#F46600] pt-4">
                  <div className="text-2xl sm:text-[34px] font-bold tracking-tight">4.9/5</div>
                  <div className="text-xs sm:text-[14px] text-[#65676B] mt-2 leading-tight">середня оцінка викладачів</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-[300px] sm:h-[396px] bg-[#FFF5EB] shadow-[-2px_4px_16px_rgba(0,0,0,0.06)]">
              <img
                src={teacherPhoto}
                alt="Викладачка JustSchool"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 3 Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 sm:mt-16">
            <div className="bg-white rounded-3xl shadow-[-2px_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#FFF5EB] text-[#F46600] font-bold flex items-center justify-center text-lg">
                    Д
                  </div>
                  <div>
                    <div className="text-base font-bold text-[#09090A]">Дмитро</div>
                    <div className="text-xs text-[#747474]">англійська для IT</div>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#454754]">
                  «Записався в JustSchool, бо треба було підтягнути технічну англійську для нової роботи. Викладач одразу підлаштував уроки під IT. В результаті я нормально пройшов співбесіду в американську компанію та отримав офер!»
                </p>
              </div>
              <div className="mt-5 text-[#F46600] text-sm tracking-widest">★★★★★</div>
            </div>

            <div className="bg-white rounded-3xl shadow-[-2px_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#FFF5EB] text-[#F46600] font-bold flex items-center justify-center text-lg">
                    К
                  </div>
                  <div>
                    <div className="text-base font-bold text-[#09090A]">Ксенія</div>
                    <div className="text-xs text-[#747474]">курс розмовної англійської</div>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#454754]">
                  «Викладач одразу помітив, що моя проблема не в граматиці, а в страху говорити. Вже після 10 занять стало набагато легше на мітингах з іноземними колегами. Дякую за підтримку і людяний підхід!»
                </p>
              </div>
              <div className="mt-5 text-[#F46600] text-sm tracking-widest">★★★★★</div>
            </div>

            <div className="bg-white rounded-3xl shadow-[-2px_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#FFF5EB] text-[#F46600] font-bold flex items-center justify-center text-lg">
                    А
                  </div>
                  <div>
                    <div className="text-base font-bold text-[#09090A]">Андрій</div>
                    <div className="text-xs text-[#747474]">бізнес-англійська</div>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#454754]">
                  «Займаюсь бізнес-англійською, бо працюю з партнерами зі США. Уроки максимально практичні: розбираємо реальні кейси з моєї роботи. Дуже зручна платформа. Прогрес відчутний!»
                </p>
              </div>
              <div className="mt-5 text-[#F46600] text-sm tracking-widest">★★★★★</div>
            </div>
          </div>
        </section>

        {/* ─── FAQ Accordion ─── */}
        <section className="px-4 sm:px-8 lg:px-[140px] pb-16 sm:pb-24">
          <div className="bg-[#F5F5F5] rounded-3xl p-6 sm:p-14 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 sm:gap-14 items-start">
            <div>
              <h2 className="text-2xl sm:text-[40px] font-bold leading-tight tracking-[-0.02em]">
                Залишилися запитання?
              </h2>
              <p className="text-sm sm:text-base text-[#65676B] mt-3">
                Менеджер із радістю відповість на всі інші під час вашого безкоштовного пробного уроку.
              </p>
            </div>

            <div className="divide-y divide-[#E0E0E0]">
              {faqList.map((item, idx) => (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-base sm:text-[19px] text-[#09090A] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xl font-bold text-[#F46600] shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="mt-3 text-sm sm:text-[16px] leading-relaxed text-[#65676B] pr-4 sm:pr-12 animate-fadeIn">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ─── */}
        <section ref={finalFormRef} className="px-4 sm:px-8 lg:px-[140px] pb-20 sm:pb-28">
          <div className="bg-gradient-to-r from-[#F16600] to-[#F34500] rounded-3xl p-6 sm:p-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-16 items-center shadow-[0px_4px_32px_rgba(0,0,0,0.09)]">
            <div className="text-white">
              <h2 className="text-3xl sm:text-5xl font-bold leading-[1.08] tracking-[-0.025em]">
                Зробіть перший крок до впевненої англійської
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-[18px] leading-relaxed text-white/95 max-w-[520px]">
                Пройдіть безкоштовний урок, визначте свій рівень і отримайте персональний план навчання.
              </p>
              <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/80">
                Без передоплати · без зобов’язань · приблизно 30 хвилин
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-lg sm:text-[21px] font-bold leading-tight text-[#09090A]">
                Спробувати безкоштовно
              </h3>
              <p className="text-xs sm:text-[13px] text-[#747474] mt-1.5">
                Заповніть форму і ми підберемо зручний час
              </p>

              {finalSent ? (
                <div className="mt-5 bg-[#FFF5EB] rounded-2xl p-5 border border-[#FFE0CA] text-center">
                  <div className="text-base font-bold text-[#BF6823]">Дякуємо, заявку прийнято!</div>
                  <div className="text-xs sm:text-sm text-[#65676B] mt-1.5">
                    Менеджер зв’яжеться з вами найближчим часом.
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!finalSubmitting) submitLead('final');
                  }}
                  className="flex flex-col gap-3 mt-5"
                >
                  <input
                    type="text"
                    required
                    placeholder="Ім’я"
                    value={finalName}
                    disabled={finalSubmitting}
                    onChange={(e) => setFinalName(e.target.value)}
                    className="h-[54px] sm:h-[58px] rounded-2xl border-0 shadow-[inset_0_0_0_1px_#C7C9CB] focus:shadow-[inset_0_0_0_2px_#F46600] px-5 text-base text-[#09090A] outline-hidden bg-white transition-all disabled:opacity-50"
                  />

                  <PhoneInput
                    value={finalPhone}
                    disabled={finalSubmitting}
                    initialCountry={geoCountry}
                    onChange={(raw, valid) => {
                      setFinalPhone(raw);
                      setFinalPhoneValid(valid);
                    }}
                  />

                  <button
                    type="submit"
                    disabled={finalSubmitting}
                    className="w-full inline-flex items-center justify-center font-semibold text-white bg-[#F46600] hover:bg-[#F5AC72] active:bg-[#BF6823] transition-all h-[54px] sm:h-[58px] text-base sm:text-[17px] rounded-2xl shadow-[0px_4px_24px_rgba(244,102,0,0.2)] disabled:opacity-60 cursor-pointer"
                  >
                    {finalSubmitting ? 'Надсилаємо заявку...' : 'Спробувати безкоштовно'}
                  </button>

                  <p className="text-[11px] sm:text-xs text-[#747474] text-center mt-1">
                    Натискаючи кнопку, ви погоджуєтесь на обробку даних
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-7 border-t border-[#E9E9E9]">
            <img src={logoBlack} alt="JustSchool" className="h-5 w-auto opacity-75" />
            <div className="text-xs text-[#747474] text-center sm:text-right">
              © 2026 JustSchool · Онлайн-школа англійської мови. Всі права захищено.
            </div>
          </div>
        </section>
      </main>

      {/* ─── Floating Sticky Bottom Bar ─── */}
      {showStickyBar && (
        <aside aria-label="Швидкий запис на безкоштовний урок" className="fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur-md shadow-[0px_-4px_24px_rgba(0,0,0,0.1)] border-t border-[#E5E5E5] transition-all">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[140px] py-3 sm:py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logoBlack} alt="JustSchool" className="h-5 w-auto hidden md:block" />
              <span className="hidden md:block w-[1px] h-5 bg-[#E5E5E5]" />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-[#09090A]">
                Безкоштовний урок · 30 хвилин, без передоплати
              </span>
            </div>
            <button
              type="button"
              onClick={scrollToFinalForm}
              className="inline-flex items-center justify-center font-semibold text-white bg-[#F46600] hover:bg-[#F5AC72] active:bg-[#BF6823] transition-all h-[44px] sm:h-[48px] px-5 sm:px-7 text-xs sm:text-sm md:text-base rounded-full shrink-0 shadow-md cursor-pointer"
            >
              Записатися на безкоштовний урок
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
