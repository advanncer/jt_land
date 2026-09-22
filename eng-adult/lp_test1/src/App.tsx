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
    } else if (heroFormRef.current) {
      heroFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      {/* ─── Outer Canvas Container (1440px max standard canvas) ─── */}
      <div className="js-page-wrap">

        {/* ─── Header ─── */}
        <header className="js-header">
          <img src={logoBlack} alt="JustSchool" style={{ height: '26px', display: 'block' }} />
          <div className="js-header-pill-desktop">
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747474' }}>
              Онлайн-школа англійської
            </span>
            <span style={{ width: '1px', height: '18px', background: '#e5e5e5', display: 'block' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#09090a' }}>
              4.9/5 · 1 700+ викладачів
            </span>
          </div>
          <div className="js-header-pill-mobile">
            <span>★ 4.9/5 · 1.7k+</span>
          </div>
        </header>

        {/* ─── Hero Section ─── */}
        <section className="js-hero-section">
          <div className="js-hero-container">
            {/* Left Column */}
            <div className="js-hero-text-col">
              <div className="js-hero-badge">
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f46600', display: 'block' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bf6823' }}>
                  Перший урок безкоштовно · 30 хвилин
                </span>
              </div>

              <h1 className="js-hero-h1">
                Заговоріть англійською <span style={{ color: '#f56600' }}>впевнено</span> — для роботи, подорожей і життя
              </h1>

              <p className="js-hero-sub">
                Онлайн-заняття з викладачем за персональною програмою. 80% уроку — розмовна практика, а графік підлаштовується під вас.
              </p>

              <div className="js-hero-features">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#09090a' }}>Програма відповідно до вашого рівня та цілей</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#09090a' }}>Індивідуально або в мінігрупі</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f46600', fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#09090a' }}>Результат або навчаємо за наш рахунок</span>
                </div>
              </div>

              <div className="js-hero-cta-wrap">
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

            {/* Right Column: Visual + Form */}
            <div className="js-hero-visual-col">
              {/* Student Card */}
              <div className="js-hero-img-card">
                <img src={heroBrush} alt="" className="js-brush-bg" />
                <img src={heroStudent} alt="Студентка JustSchool" className="js-student-img" />
              </div>

              {/* Floating Form Card */}
              <div ref={heroFormRef} id="hero-form-box" className="js-hero-form-card">
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
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}
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
          </div>
        </section>

        {/* ─── Social Proof / Metrics Strip ─── */}
        <section className="js-stats-section">
          <div className="js-stats-box">
            <h2 className="js-stats-title">
              JustSchool — онлайн-школа, якій довіряють
            </h2>
            <div className="js-stats-grid">
              <div className="js-stat-item">
                <div className="js-stat-num">3 800 000+</div>
                <div className="js-stat-label">проведених занять</div>
              </div>
              <div className="js-stat-item">
                <div className="js-stat-num">1 700+</div>
                <div className="js-stat-label">викладачів у команді</div>
              </div>
              <div className="js-stat-item">
                <div className="js-stat-num">95%</div>
                <div className="js-stat-label">студентів рекомендують нас</div>
              </div>
              <div className="js-stat-item">
                <div className="js-stat-num">4.9/5</div>
                <div className="js-stat-label">середня оцінка навчання</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4 Core Advantages ─── */}
        <section className="js-adv-section">
          <div className="js-adv-header">
            <h2 className="js-adv-title">
              Англійська, яка вписується у ваше життя
            </h2>
            <div className="js-adv-sub">
              Чотири речі, які роблять навчання в JustSchool інакшим від курсів «за підручником».
            </div>
          </div>
          <div>
            <div className="js-adv-row">
              <div className="js-adv-num">01</div>
              <h3 className="js-adv-h3">80% уроку — розмовна практика</h3>
              <p className="js-adv-p">Ви починаєте говорити англійською вже з першого заняття, а граматику вивчаєте через реальні ситуації.</p>
            </div>
            <div className="js-adv-row">
              <div className="js-adv-num">02</div>
              <h3 className="js-adv-h3">Персональна програма</h3>
              <p className="js-adv-p">Викладач адаптує заняття під ваш рівень і ціль: роботу, подорожі, переїзд або спілкування.</p>
            </div>
            <div className="js-adv-row">
              <div className="js-adv-num">03</div>
              <h3 className="js-adv-h3">Гнучкий графік</h3>
              <p className="js-adv-p">Навчайтеся вранці, ввечері або на вихідних. Заняття можна переносити відповідно до умов курсу.</p>
            </div>
            <div className="js-adv-row" style={{ borderBottom: '1px solid #e9e9e9' }}>
              <div className="js-adv-num">04</div>
              <h3 className="js-adv-h3">Прогрес під контролем</h3>
              <p className="js-adv-p">Після кожного уроку ви отримуєте фідбек, домашнє завдання та бачите свій прогрес в особистому кабінеті.</p>
            </div>
          </div>
        </section>

        {/* ─── Free Lesson Roadmap ─── */}
        <section className="js-trial-section">
          <div className="js-trial-grid">
            <div>
              <h2 className="js-trial-title">
                Почніть із безкоштовного уроку
              </h2>
              <p className="js-trial-sub">
                Познайомтеся з форматом навчання та отримайте персональний план без оплати й зобов’язань.
              </p>
              <div className="js-trial-card">
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
                  className="js-btn-primary js-trial-btn"
                  style={{ height: '62px', padding: '0 34px', fontSize: '17px', borderRadius: '100px', boxShadow: '0px 4px 32px 0px rgba(244,102,0,0.22)' }}
                >
                  Обрати час безкоштовного уроку
                </button>
              </div>
            </div>

            <div style={{ paddingTop: '8px' }}>
              <div className="js-step-row" style={{ paddingBottom: '30px', borderBottom: '1px solid #f0e4da' }}>
                <div className="js-step-badge" style={{ background: '#ffffff', boxShadow: 'inset 0 0 0 1px #ffe0ca', color: '#f46600' }}>1</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>Залишаєте заявку</div>
                  <div style={{ fontSize: '14px', color: '#747474', marginTop: '6px' }}>до 1 хвилини</div>
                </div>
              </div>
              <div className="js-step-row" style={{ padding: '30px 0', borderBottom: '1px solid #f0e4da' }}>
                <div className="js-step-badge" style={{ background: '#ffffff', boxShadow: 'inset 0 0 0 1px #ffe0ca', color: '#f46600' }}>2</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>Проходите безкоштовний урок</div>
                  <div style={{ fontSize: '14px', color: '#747474', marginTop: '6px' }}>приблизно 30 хвилин</div>
                </div>
              </div>
              <div className="js-step-row" style={{ paddingTop: '30px' }}>
                <div className="js-step-badge" style={{ background: 'linear-gradient(69.559deg,#f16600 -4.95%,#f34500 125.03%)', color: '#ffffff' }}>3</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>Отримуєте персональний план</div>
                  <div style={{ fontSize: '14px', color: '#747474', marginTop: '6px' }}>і вирішуєте, чи продовжувати</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Teachers & Reviews ─── */}
        <section className="js-teacher-section">
          <div className="js-teacher-grid">
            <div>
              <h2 className="js-teacher-title">
                Викладач, з яким легко заговорити
              </h2>
              <p className="js-teacher-sub">
                Ми підбираємо викладача відповідно до вашого рівня, цілей і стилю навчання. Якщо викладач вам не підійшов — його можна змінити без пояснень і доплат.
              </p>
              <div className="js-teacher-stats">
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div className="js-teacher-stat-num">1 із 89</div>
                  <div style={{ fontSize: '14px', color: '#65676b', marginTop: '8px', lineHeight: 1.4 }}>кандидатів проходить відбір</div>
                </div>
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div className="js-teacher-stat-num">72%</div>
                  <div style={{ fontSize: '14px', color: '#65676b', marginTop: '8px', lineHeight: 1.4 }}>викладачів мають міжнародні сертифікати</div>
                </div>
                <div style={{ borderTop: '2px solid #f46600', paddingTop: '16px' }}>
                  <div className="js-teacher-stat-num">4.9/5</div>
                  <div style={{ fontSize: '14px', color: '#65676b', marginTop: '8px', lineHeight: 1.4 }}>середня оцінка викладачів</div>
                </div>
              </div>
            </div>
            <div className="js-teacher-photo-wrap">
              <img src={teacherPhoto} alt="Викладачка JustSchool" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="js-reviews-grid">
            <div className="js-review-card">
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

            <div className="js-review-card">
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

            <div className="js-review-card">
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
        <section className="js-faq-section">
          <div className="js-faq-box">
            <div>
              <h2 className="js-faq-title">
                Залишилися запитання?
              </h2>
              <p className="js-faq-sub" style={{ margin: '18px 0 0 0', fontSize: '16px', lineHeight: 1.55, color: '#65676b' }}>
                Менеджер відповість на решту під час безкоштовного уроку.
              </p>
            </div>
            <div>
              {faqData.map((f, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <div
                    onClick={() => toggleFaq(i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '22px 0', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.35, color: '#09090a' }}>{f.q}</div>
                    <div style={{ width: '32px', height: '32px', flex: '0 0 32px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, color: '#f46600' }}>
                      {openFaq === i ? '−' : '+'}
                    </div>
                  </div>
                  {openFaq === i && (
                    <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#65676b', padding: '0 20px 24px 0', maxWidth: '640px' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ─── */}
        <section ref={finalCtaRef} id="final-cta" className="js-final-section">
          <div className="js-final-box">
            <div>
              <h2 className="js-final-title" style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff' }}>
                Зробіть перший крок до впевненої англійської
              </h2>
              <p className="js-final-sub" style={{ margin: '20px 0 0 0', fontSize: '17px', lineHeight: 1.55, color: '#ffffff', maxWidth: '520px' }}>
                Пройдіть безкоштовний урок, визначте свій рівень і отримайте персональний план навчання.
              </p>
              <div style={{ marginTop: '24px', fontSize: '14px', color: '#ffffff' }}>
                Без передоплати, без зобов’язань, приблизно 30 хвилин
              </div>
            </div>

            <div className="js-final-form-card">
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

          <div className="js-footer-row">
            <img src={logoBlack} alt="JustSchool" style={{ height: '20px', display: 'block', opacity: 0.75 }} />
            <div style={{ fontSize: '13px', color: '#747474' }}>© 2026 JustSchool · Онлайн-школа англійської мови</div>
          </div>
        </section>
      </div>

      {/* ─── Floating Sticky Bottom Bar ─── */}
      {showStickyBar && (
        <aside className="js-sticky-bar" aria-label="Швидкий запис на безкоштовний урок">
          <div className="js-bar-inner">
            <div className="js-bar-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src={logoBlack} alt="JustSchool" style={{ height: '20px', display: 'block' }} />
              <span style={{ width: '1px', height: '24px', background: '#e5e5e5', display: 'block' }} />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#09090a' }}>
                Безкоштовний урок · 30 хвилин, без передоплати
              </span>
            </div>
            <button
              type="button"
              onClick={focusHeroForm}
              className="js-btn-primary js-bar-btn"
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
