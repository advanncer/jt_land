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

  // UI state
  const [geoCountry, setGeoCountry] = useState('UA');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [nearFinal, setNearFinal] = useState(false);

  const heroFormRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);

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
      if (finalCtaRef.current) {
        const rect = finalCtaRef.current.getBoundingClientRect();
        setNearFinal(rect.top < window.innerHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Smooth Scroll to Form Handlers ──────────────────────
  const focusHeroForm = () => {
    pushAnalytics('cta_click', { cta_target: 'hero_form' });
    const input = document.getElementById('hero-name');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    }
  };

  const focusFinalForm = () => {
    pushAnalytics('cta_click', { cta_target: 'final_form' });
    const input = document.getElementById('final-name');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    } else if (finalCtaRef.current) {
      finalCtaRef.current.scrollIntoView({ behavior: 'smooth' });
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
      triggerFbLead();

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
    } catch {
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── FAQ Toggle ──────────────────────────────────────────
  const faqData = [
    {
      q: 'Скільки коштує навчання?',
      a: 'Вартість залежить від формату та кількості занять. Після безкоштовного уроку менеджер допоможе підібрати оптимальну програму.',
    },
    {
      q: 'Чи підійде курс, якщо я починаю з нуля?',
      a: 'Так. Програма адаптується до вашого стартового рівня та темпу навчання.',
    },
    {
      q: 'Чи можна змінити викладача або перенести заняття?',
      a: 'Так. Ви можете змінити викладача та керувати розкладом відповідно до умов обраного формату.',
    },
    {
      q: 'Що потрібно для навчання?',
      a: 'Комп’ютер, планшет або смартфон зі стабільним інтернетом. Усі матеріали вже доступні на платформі JustSchool.',
    },
  ];

  const toggleFaq = (idx: number) => {
    const isOpening = openFaq !== idx;
    setOpenFaq(isOpening ? null : idx);
    pushAnalytics('faq_toggle', {
      faq_question: faqData[idx].q,
      is_open: isOpening,
    });
  };

  const showStickyBar = scrollY > 760 && !nearFinal;

  return (
    <div className="w-full min-h-screen bg-white text-[#09090a] font-['Montserrat',sans-serif] antialiased">
      {/* ─── Outer Canvas Container (1440px standard canvas) ─── */}
      <div className="js-desktop-wrap" style={{ width: '1440px', margin: '0 auto', background: '#ffffff', color: '#09090a', overflow: 'hidden' }}>

        {/* ─── Header ─── */}
        <header className="js-section-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 140px 0 140px' }}>
          <img src={logoBlack} alt="JustSchool" style={{ height: '26px', display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747474' }}>
              Онлайн-школа англійської
            </span>
            <span style={{ width: '1px', height: '18px', background: '#e5e5e5', display: 'block' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#09090a' }}>
              4.9/5 · 1 700+ викладачів
            </span>
          </div>
        </header>

        {/* ─── Hero Section ─── */}
        <section className="js-hero-grid" style={{ padding: '56px 140px 0 140px', display: 'grid', gridTemplateColumns: '640px 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Left Column */}
          <div style={{ paddingTop: '18px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#fff5eb', borderRadius: '100px', padding: '9px 18px', marginBottom: '28px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f46600', display: 'block' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bf6823' }}>
                Перший урок безкоштовно · 30 хвилин
              </span>
            </div>

            <h1 className="js-h1" style={{ margin: 0, fontSize: '70px', lineHeight: 1.01, fontWeight: 700, letterSpacing: '-0.025em', color: '#09090a' }}>
              Заговоріть англійською <span style={{ color: '#f56600' }}>впевнено</span> — для роботи, подорожей і життя
            </h1>

            <p style={{ margin: '28px 0 0 0', fontSize: '19px', lineHeight: 1.5, color: '#65676b', maxWidth: '560px' }}>
              Онлайн-заняття з викладачем за персональною програмою. 80% уроку — розмовна практика, а графік підлаштовується під вас.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '34px', paddingTop: '30px', borderTop: '1px solid #e9e9e9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                <span style={{ fontSize: '17px', fontWeight: 500, color: '#09090a' }}>Програма відповідно до вашого рівня та цілей</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                <span style={{ fontSize: '17px', fontWeight: 500, color: '#09090a' }}>Індивідуально або в мінігрупі</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                <span style={{ fontSize: '17px', fontWeight: 500, color: '#09090a' }}>Результат або навчаємо за наш рахунок</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginTop: '38px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={focusHeroForm}
                className="js-btn-primary"
                style={{ height: '62px', padding: '0 34px', fontSize: '17px', borderRadius: '100px' }}
              >
                Записатися на безкоштовний урок
              </button>
              <span style={{ fontSize: '14px', lineHeight: 1.4, color: '#747474', maxWidth: '160px' }}>
                30 хвилин · без передоплати та зобов’язань
              </span>
            </div>
          </div>

          {/* Right Hero Visual (Layered Card Composition from Design System) */}
          <div className="js-hero-visual" style={{ position: 'relative', height: '690px' }}>
            {/* Top Right Student Card */}
            <div className="js-hero-img-card" style={{ position: 'absolute', top: 0, right: 0, width: '472px', height: '430px', borderRadius: '24px', background: 'linear-gradient(180deg,#fff5eb 0%,#ffe0ca 100%)', overflow: 'hidden' }}>
              <img src={heroBrush} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
              <img src={heroStudent} alt="Студентка JustSchool" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-46%)', height: '440px', objectFit: 'contain', pointerEvents: 'none' }} />
            </div>

            {/* Floating Form Card */}
            <div ref={heroFormRef} className="js-hero-form-card" style={{ position: 'absolute', top: '352px', left: 0, width: '430px', background: '#ffffff', borderRadius: '24px', boxShadow: '-2px 4px 9px 1px rgba(0,0,0,0.09)', padding: '30px 32px 32px 32px' }}>
              <div style={{ fontSize: '21px', fontWeight: 700, lineHeight: 1.2, color: '#09090a' }}>
                Отримати безкоштовний урок
              </div>
              <div style={{ fontSize: '14px', color: '#747474', marginTop: '8px' }}>
                Передзвонимо протягом 15 хвилин і підберемо час
              </div>

              {heroSent ? (
                <div style={{ marginTop: '22px', background: '#fff5eb', borderRadius: '16px', padding: '22px 24px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#bf6823' }}>Заявку прийнято</div>
                  <div style={{ fontSize: '14px', color: '#65676b', marginTop: '6px' }}>Менеджер зв’яжеться з вами найближчим часом.</div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!heroSubmitting) submitLead('hero');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '22px' }}
                >
                  <input
                    id="hero-name"
                    placeholder="Ім’я"
                    value={heroName}
                    disabled={heroSubmitting}
                    onChange={(e) => setHeroName(e.target.value)}
                    className="js-input"
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
                    className="js-btn-primary"
                    style={{ height: '58px', width: '100%', fontSize: '17px', borderRadius: '16px' }}
                  >
                    {heroSubmitting ? 'Надсилаємо заявку...' : 'Отримати безкоштовний урок'}
                  </button>
                  <div style={{ fontSize: '12px', color: '#747474', textAlign: 'center', marginTop: '2px' }}>
                    Натискаючи, ви погоджуєтесь на обробку даних
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ─── Social Proof / Metrics Strip (Exact Design Gradient) ─── */}
        <section style={{ marginTop: '104px', background: 'linear-gradient(69.559deg,#f16600 -4.95%,#f34500 125.03%)' }}>
          <div className="js-stats-box" style={{ maxWidth: '1152px', margin: '0 auto', padding: '56px 0', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '56px', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '32px', lineHeight: 1.14, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
              JustSchool — онлайн-школа, якій довіряють
            </h2>
            <div className="js-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
              <div style={{ paddingLeft: '28px', borderLeft: '1px solid rgba(255,255,255,0.28)' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>3 800 000+</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', marginTop: '10px' }}>проведених занять</div>
              </div>
              <div style={{ paddingLeft: '28px', borderLeft: '1px solid rgba(255,255,255,0.28)' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>1 700+</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', marginTop: '10px' }}>викладачів у команді</div>
              </div>
              <div style={{ paddingLeft: '28px', borderLeft: '1px solid rgba(255,255,255,0.28)' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>95%</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', marginTop: '10px' }}>студентів рекомендують нас</div>
              </div>
              <div style={{ paddingLeft: '28px', borderLeft: '1px solid rgba(255,255,255,0.28)' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>4.9/5</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', marginTop: '10px' }}>середня оцінка навчання</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4 Core Advantages ─── */}
        <section className="js-section-pad" style={{ padding: '96px 140px 0 140px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '64px', alignItems: 'end', paddingBottom: '44px' }}>
            <h2 style={{ margin: 0, fontSize: '52px', lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.025em', maxWidth: '700px' }}>
              Англійська, яка вписується у ваше життя
            </h2>
            <div style={{ fontSize: '16px', lineHeight: 1.55, color: '#65676b' }}>
              Чотири речі, які роблять навчання в JustSchool інакшим від курсів «за підручником».
            </div>
          </div>
          <div>
            <div className="js-adv-row" style={{ display: 'grid', gridTemplateColumns: '92px 420px 1fr', gap: '32px', padding: '34px 0', borderTop: '1px solid #e9e9e9', alignItems: 'start' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f46600', letterSpacing: '0.02em' }}>01</div>
              <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1.16, fontWeight: 700, letterSpacing: '-0.015em' }}>80% уроку — розмовна практика</h3>
              <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#65676b', maxWidth: '520px' }}>Ви починаєте говорити англійською вже з першого заняття, а граматику вивчаєте через реальні ситуації.</p>
            </div>
            <div className="js-adv-row" style={{ display: 'grid', gridTemplateColumns: '92px 420px 1fr', gap: '32px', padding: '34px 0', borderTop: '1px solid #e9e9e9', alignItems: 'start' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f46600', letterSpacing: '0.02em' }}>02</div>
              <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1.16, fontWeight: 700, letterSpacing: '-0.015em' }}>Персональна програма</h3>
              <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#65676b', maxWidth: '520px' }}>Викладач адаптує заняття під ваш рівень і ціль: роботу, подорожі, переїзд або спілкування.</p>
            </div>
            <div className="js-adv-row" style={{ display: 'grid', gridTemplateColumns: '92px 420px 1fr', gap: '32px', padding: '34px 0', borderTop: '1px solid #e9e9e9', alignItems: 'start' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f46600', letterSpacing: '0.02em' }}>03</div>
              <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1.16, fontWeight: 700, letterSpacing: '-0.015em' }}>Гнучкий графік</h3>
              <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#65676b', maxWidth: '520px' }}>Навчайтеся вранці, ввечері або на вихідних. Заняття можна переносити відповідно до умов курсу.</p>
            </div>
            <div className="js-adv-row" style={{ display: 'grid', gridTemplateColumns: '92px 420px 1fr', gap: '32px', padding: '34px 0', borderTop: '1px solid #e9e9e9', borderBottom: '1px solid #e9e9e9', alignItems: 'start' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f46600', letterSpacing: '0.02em' }}>04</div>
              <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1.16, fontWeight: 700, letterSpacing: '-0.015em' }}>Прогрес під контролем</h3>
              <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#65676b', maxWidth: '520px' }}>Після кожного уроку ви отримуєте фідбек, домашнє завдання та бачите свій прогрес в особистому кабінеті.</p>
            </div>
          </div>
        </section>

        {/* ─── Free Lesson Roadmap ─── */}
        <section style={{ marginTop: '96px', background: '#fffaf7' }}>
          <div className="js-trial-grid" style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 0', display: 'grid', gridTemplateColumns: '490px 1fr', gap: '96px', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '46px', lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.025em' }}>
                Почніть із безкоштовного уроку
              </h2>
              <p style={{ margin: '20px 0 0 0', fontSize: '17px', lineHeight: 1.55, color: '#65676b' }}>
                Познайомтеся з форматом навчання та отримайте персональний план без оплати й зобов’язань.
              </p>
              <div style={{ marginTop: '34px', background: '#ffffff', borderRadius: '20px', boxShadow: '-2px 4px 9px 1px rgba(0,0,0,0.09)', padding: '28px 30px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747474' }}>
                  На уроці ви
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginTop: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#f46600', fontWeight: 700, lineHeight: 1.5, flex: '0 0 auto' }}>✓</span><span style={{ fontSize: '16px', lineHeight: 1.5, color: '#09090a' }}>визначите свій рівень англійської;</span></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#f46600', fontWeight: 700, lineHeight: 1.5, flex: '0 0 auto' }}>✓</span><span style={{ fontSize: '16px', lineHeight: 1.5, color: '#09090a' }}>познайомитеся з викладачем;</span></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#f46600', fontWeight: 700, lineHeight: 1.5, flex: '0 0 auto' }}>✓</span><span style={{ fontSize: '16px', lineHeight: 1.5, color: '#09090a' }}>сформулюєте цілі навчання;</span></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#f46600', fontWeight: 700, lineHeight: 1.5, flex: '0 0 auto' }}>✓</span><span style={{ fontSize: '16px', lineHeight: 1.5, color: '#09090a' }}>отримаєте рекомендації щодо програми та формату.</span></div>
                </div>
              </div>
              <div style={{ marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={focusFinalForm}
                  className="js-btn-primary"
                  style={{ height: '62px', padding: '0 34px', fontSize: '17px', borderRadius: '100px', boxShadow: '0px 4px 32px 0px rgba(244,102,0,0.22)' }}
                >
                  Обрати час безкоштовного уроку
                </button>
              </div>
            </div>

            <div style={{ paddingTop: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '24px', paddingBottom: '30px', borderBottom: '1px solid #f0e4da' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', boxShadow: 'inset 0 0 0 1px #ffe0ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#f46600' }}>1</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>Залишаєте заявку</div>
                  <div style={{ fontSize: '15px', color: '#747474', marginTop: '8px' }}>до 1 хвилини</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '24px', padding: '30px 0', borderBottom: '1px solid #f0e4da' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', boxShadow: 'inset 0 0 0 1px #ffe0ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#f46600' }}>2</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>Проходите безкоштовний урок</div>
                  <div style={{ fontSize: '15px', color: '#747474', marginTop: '8px' }}>приблизно 30 хвилин</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '24px', paddingTop: '30px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(69.559deg,#f16600 -4.95%,#f34500 125.03%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>3</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>Отримуєте персональний план</div>
                  <div style={{ fontSize: '15px', color: '#747474', marginTop: '8px' }}>і вирішуєте, чи продовжувати</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Teachers & Reviews ─── */}
        <section className="js-section-pad" style={{ padding: '96px 140px 0 140px' }}>
          <div className="js-teacher-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 432px', gap: '64px', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '52px', lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.025em', maxWidth: '600px' }}>
                Викладач, з яким легко заговорити
              </h2>
              <p style={{ margin: '24px 0 0 0', fontSize: '18px', lineHeight: 1.6, color: '#65676b', maxWidth: '560px' }}>
                Ми підбираємо викладача відповідно до вашого рівня, цілей і стилю навчання. Якщо викладач вам не підійшов — його можна змінити без пояснень і доплат.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px', marginTop: '44px' }}>
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>1 із 89</div>
                  <div style={{ fontSize: '15px', color: '#65676b', marginTop: '10px', lineHeight: 1.45 }}>кандидатів проходить відбір</div>
                </div>
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>72%</div>
                  <div style={{ fontSize: '15px', color: '#65676b', marginTop: '10px', lineHeight: 1.45 }}>викладачів мають міжнародні сертифікати</div>
                </div>
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>4.9/5</div>
                  <div style={{ fontSize: '15px', color: '#65676b', marginTop: '10px', lineHeight: 1.45 }}>середня оцінка викладачів</div>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: '24px', overflow: 'hidden', height: '396px', background: '#fff5eb' }}>
              <img src={teacherPhoto} alt="Викладачка JustSchool" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="js-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginTop: '64px' }}>
            <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '-2px 4px 9px 1px rgba(0,0,0,0.09)', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 700, color: '#f46600' }}>Д</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>Дмитро</div>
                  <div style={{ fontSize: '13px', color: '#747474', marginTop: '4px' }}>англійська для IT</div>
                </div>
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#454754' }}>
                Записався в JustSchool, бо треба було підтягнути технічну англійську для нової роботи. Звичайну англійську ще якось розумів, але коли доходило до документації, вже починав трохи плавати. Викладач одразу підлаштував уроки під IT, все по ділу. В результаті я нормально пройшов співбесіду в американську компанію та отримав офер. Так що айтівцям можу сміливо рекомендувати!
              </div>
              <div style={{ marginTop: 'auto', fontSize: '14px', letterSpacing: '0.18em', color: '#f46600' }}>★★★★★</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '-2px 4px 9px 1px rgba(0,0,0,0.09)', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 700, color: '#f46600' }}>К</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>Ксенія</div>
                  <div style={{ fontSize: '13px', color: '#747474', marginTop: '4px' }}>курс розмовної англійської</div>
                </div>
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#454754' }}>
                Після не дуже вдалого досвіду з іншою школою я прийшла в JustSchool без особливих очікувань, але була приємно здивована. Викладач одразу помітив, що моя проблема не в граматиці, а в страху говорити. Поступово на уроках я почала більше практикувати розмовну англійську, і вже після 10 занять стало набагато легше говорити на мітах з іноземними колегами. Дякую за терпіння, підтримку і нормальний людяний підхід до навчання!
              </div>
              <div style={{ marginTop: 'auto', fontSize: '14px', letterSpacing: '0.18em', color: '#f46600' }}>★★★★★</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '-2px 4px 9px 1px rgba(0,0,0,0.09)', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 700, color: '#f46600' }}>А</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>Андрій</div>
                  <div style={{ fontSize: '13px', color: '#747474', marginTop: '4px' }}>бізнес-англійська</div>
                </div>
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#454754' }}>
                Доброго дня! Займаюсь бізнес-англійською, бо працюю з американцями. Уроки максимально практичні. Із викладачем знайшли спільну мову відразу, адже ми однолітки, і цікаво розбираємо реальні кейси з моєї роботи. Дуже класна і зручна платформа. Прогрес відчутний, раджу ДжастСкул!
              </div>
              <div style={{ marginTop: 'auto', fontSize: '14px', letterSpacing: '0.18em', color: '#f46600' }}>★★★★★</div>
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─── */}
        <section className="js-section-pad" style={{ padding: '96px 140px 0 140px' }}>
          <div className="js-faq-box" style={{ background: '#f5f5f5', borderRadius: '24px', padding: '56px 64px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '42px', lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Залишилися запитання?
              </h2>
              <p style={{ margin: '18px 0 0 0', fontSize: '16px', lineHeight: 1.55, color: '#65676b' }}>
                Менеджер відповість на решту під час безкоштовного уроку.
              </p>
            </div>
            <div>
              {faqData.map((f, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <div
                    onClick={() => toggleFaq(i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '24px 0', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '19px', fontWeight: 600, lineHeight: 1.35, color: '#09090a' }}>{f.q}</div>
                    <div style={{ width: '32px', height: '32px', flex: '0 0 32px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, color: '#f46600' }}>
                      {openFaq === i ? '−' : '+'}
                    </div>
                  </div>
                  {openFaq === i && (
                    <div style={{ fontSize: '16px', lineHeight: 1.6, color: '#65676b', padding: '0 60px 26px 0', maxWidth: '640px' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ─── */}
        <section ref={finalCtaRef} id="final-cta" className="js-section-pad" style={{ padding: '96px 140px 110px 140px' }}>
          <div className="js-final-box" style={{ background: 'linear-gradient(69.559deg,#f16600 -4.95%,#f34500 125.03%)', borderRadius: '32px', padding: '64px', display: 'grid', gridTemplateColumns: '1fr 430px', gap: '80px', alignItems: 'center', boxShadow: '0px 4px 32px 0px rgba(0,0,0,0.09)' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '52px', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff' }}>
                Зробіть перший крок до впевненої англійської
              </h2>
              <p style={{ margin: '24px 0 0 0', fontSize: '18px', lineHeight: 1.55, color: '#ffffff', maxWidth: '520px' }}>
                Пройдіть безкоштовний урок, визначте свій рівень і отримайте персональний план навчання.
              </p>
              <div style={{ marginTop: '28px', fontSize: '15px', color: '#ffffff' }}>
                Без передоплати, без зобов’язань, приблизно 30 хвилин
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px' }}>
              <div style={{ fontSize: '21px', fontWeight: 700, lineHeight: 1.2, color: '#09090a' }}>
                Спробувати безкоштовно
              </div>

              {finalSent ? (
                <div style={{ marginTop: '20px', background: '#fff5eb', borderRadius: '16px', padding: '22px 24px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#bf6823' }}>Дякуємо, заявку прийнято</div>
                  <div style={{ fontSize: '14px', color: '#65676b', marginTop: '6px' }}>Менеджер зателефонує, щоб узгодити час уроку.</div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!finalSubmitting) submitLead('final');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}
                >
                  <input
                    id="final-name"
                    placeholder="Ім’я"
                    value={finalName}
                    disabled={finalSubmitting}
                    onChange={(e) => setFinalName(e.target.value)}
                    className="js-input"
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
                    className="js-btn-primary"
                    style={{ height: '58px', width: '100%', fontSize: '17px', borderRadius: '16px' }}
                  >
                    {finalSubmitting ? 'Надсилаємо заявку...' : 'Спробувати безкоштовно'}
                  </button>
                  <div style={{ fontSize: '12px', color: '#747474', textAlign: 'center', marginTop: '2px' }}>
                    Натискаючи, ви погоджуєтесь на обробку даних
                  </div>
                </form>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '48px', paddingTop: '28px', borderTop: '1px solid #e9e9e9', flexWrap: 'wrap', gap: '16px' }}>
            <img src={logoBlack} alt="JustSchool" style={{ height: '20px', display: 'block', opacity: 0.75 }} />
            <div style={{ fontSize: '13px', color: '#747474' }}>© 2026 JustSchool · Онлайн-школа англійської мови</div>
          </div>
        </section>
      </div>

      {/* ─── Floating Sticky Bottom Bar ─── */}
      {showStickyBar && (
        <aside aria-label="Швидкий запис на безкоштовний урок" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: '#ffffff', boxShadow: '0px -4px 32px 0px rgba(0,0,0,0.1)' }}>
          <div className="js-bar-inner" style={{ width: '1440px', maxWidth: '100%', margin: '0 auto', padding: '16px 140px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src={logoBlack} alt="JustSchool" style={{ height: '20px', display: 'block' }} />
              <span style={{ width: '1px', height: '24px', background: '#e5e5e5', display: 'block' }} />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#09090a' }}>
                Безкоштовний урок · 30 хвилин, без передоплати
              </span>
            </div>
            <button
              type="button"
              onClick={focusFinalForm}
              className="js-btn-primary"
              style={{ height: '52px', padding: '0 28px', fontSize: '16px', borderRadius: '100px' }}
            >
              Записатися на безкоштовний урок
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
