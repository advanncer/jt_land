import React, { useState, useEffect } from 'react';
import PhoneInput from './PhoneInput';
import { Button } from './ds/components/core/Button';
import { Badge } from './ds/components/core/Badge';
import { Card } from './ds/components/core/Card';
import { BrandShape } from './ds/components/core/BrandShape';
import logoBlack from './ds/assets/logo-horizontal-black.svg';
import heroImg from './assets/hero.png';

const COURSES = [
  {
    id: 'preschool',
    title: 'Англійська для дошкільнят',
    age: '4–5 років',
    level: 'Pre-A1',
    desc: 'Ігрові уроки, які перетворюють навчання на захопливу гру через пісні, казки та інтерактивні вправи.',
    badge: 'Ігрова методика',
    emoji: '🧸',
  },
  {
    id: 'teens',
    title: 'Англійська для дітей і підлітків',
    age: '6–17 років',
    level: 'A1–B2',
    desc: 'Уроки з акцентом на розмовну практику, шкільну програму та підготовку до НМТ/ДПА без зубріння.',
    badge: 'Підвищення оцінок',
    emoji: '🎒',
  },
  {
    id: 'adults',
    title: 'Англійська для дорослих',
    age: '18+',
    level: 'A1–C1',
    desc: 'Розмовна англійська для життя, кар’єри чи переїзду. Подолання мовного бар’єра вже за перші тижні.',
    badge: 'Топ вибір',
    emoji: '💼',
  },
  {
    id: 'business',
    title: 'Бізнес-англійська',
    age: '18+',
    level: 'B1–C1',
    desc: 'Ділове листування, переговори, пітчі та презентації для роботи з міжнародними партнерами.',
    badge: 'Кар’єрний ріст',
    emoji: '📈',
  },
  {
    id: 'exams',
    title: 'Підготовка до іспитів',
    age: 'IELTS / TOEFL / НМТ',
    level: 'B1–C1',
    desc: 'Структурована підготовка до тестувань з практикою всіх секцій: speaking, writing, listening, reading.',
    badge: 'Гарантія балу',
    emoji: '🎯',
  },
  {
    id: 'corporate',
    title: 'Корпоративне навчання',
    age: 'Для команд',
    level: 'A1–C1',
    desc: 'Індивідуальні та групові програми для співробітників компаній з фокусом на бізнес-завдання.',
    badge: 'Для бізнесу',
    emoji: '🏢',
  },
];

const FEATURES_STRIP = [
  { text: 'Індивідуально або в групах', icon: '👥' },
  { text: 'Перший урок безкоштовно', icon: '🎁' },
  { text: 'З гарантією результату', icon: '🛡️' },
  { text: '4.9/5 оцінка на незалежних платформах', icon: '⭐' },
  { text: 'Гнучкий графік занять', icon: '📅' },
  { text: '80% уроку — розмовна практика', icon: '🗣️' },
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Запишіться на безкоштовний урок');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoCountry, setGeoCountry] = useState('UA');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const openLeadModal = (title = 'Запишіться на безкоштовний урок') => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeLeadModal = () => {
    if (!isSubmitting) setIsModalOpen(false);
  };

  // ─── Form Submission Handler ─────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      alert("Будь ласка, вкажіть ваше ім'я");
      return;
    }
    if (!rawPhone || !isPhoneValid) {
      alert('Будь ласка, введіть коректний номер телефону');
      return;
    }

    setIsSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim() || 'lead@justschool.me',
      qa: `Звернення: Головна сторінка JustSchool | Форма: ${modalTitle}`,
      dialogueUrl: window.location.href,
      dialogueName: 'JustSchool Main Page Copy',
      dialogueId: 'main_page_copy',
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
          form_name: 'main_page_copy_lead',
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

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#FFE0CA] selection:text-[#F56600]"
      style={{
        backgroundColor: 'var(--surface-page)',
        fontFamily: 'var(--font-core)',
        color: 'var(--text-body)',
      }}
    >
      {/* ══════════════════════════════════════════════════════
          1. HEADER / NAVIGATION BAR (Exact as screenshot)
      ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-subtle)] h-20 flex items-center px-4 sm:px-8 transition-all">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <img src={logoBlack} alt="JustSchool" className="h-7 w-auto" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[var(--text-body)]">
            <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand)] transition-colors">
              <span>Продукти</span>
              <span className="text-[10px] text-[var(--text-muted)]">▼</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand)] transition-colors">
              <span>Форми навчання</span>
              <span className="text-[10px] text-[var(--text-muted)]">▼</span>
            </div>
            <a href="#courses" className="hover:text-[var(--brand)] transition-colors">
              Блог
            </a>
            <a href="#courses" className="hover:text-[var(--brand)] transition-colors">
              Тест рівня
            </a>
            <a href="#contact" className="hover:text-[var(--brand)] transition-colors">
              Контакти
            </a>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand)] transition-colors">
              <span>Justsmart</span>
              <span className="text-[10px] text-[var(--text-muted)]">▼</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--brand)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--base-100)]">
              <span>UA</span>
              <span className="text-[10px] text-[var(--text-muted)]">▼</span>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Outline 'Увійти' button */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => openLeadModal('Вхід в особистий кабінет')}
              style={{
                borderRadius: 'var(--radius-pill)',
                borderColor: 'var(--brand)',
                color: 'var(--brand)',
                height: 44,
                padding: '0 24px',
              }}
            >
              Увійти
            </Button>

            {/* Filled 'Зареєструватися' button */}
            <Button
              variant="primary"
              size="md"
              onClick={() => openLeadModal('Реєстрація на безкоштовний урок')}
              style={{
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--brand)',
                color: '#fff',
                height: 44,
                padding: '0 24px',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              Зареєструватися
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-2xl text-[var(--text-strong)]"
            aria-label="Меню"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-[var(--border-subtle)] p-6 shadow-xl space-y-4">
            <div className="flex flex-col gap-3 font-semibold text-[var(--text-body)]">
              <a href="#courses" onClick={() => setMobileMenuOpen(false)}>Продукти та курси</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Переваги</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Контакти</a>
            </div>
            <div className="pt-4 border-t flex flex-col gap-2.5">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => { setMobileMenuOpen(false); openLeadModal('Увійти'); }}
              >
                Увійти
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => { setMobileMenuOpen(false); openLeadModal('Зареєструватися'); }}
              >
                Зареєструватися
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════
          2. HERO SECTION (1-to-1 matching uploaded screenshot)
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FFF5EB] via-[#FDFCFB] to-white">
        {/* Subtle decorative brand shapes */}
        <div className="absolute top-10 right-4 pointer-events-none opacity-20 hidden lg:block">
          <BrandShape shape="burst" size={140} color="var(--element-orange)" />
        </div>
        <div className="absolute bottom-10 left-4 pointer-events-none opacity-15 hidden lg:block">
          <BrandShape shape="rings" size={160} color="var(--element-yellow)" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.12] tracking-[-0.02em] text-[var(--text-strong)]">
                Заговоріть <br className="hidden sm:inline" />
                англійською вільно <br />
                в онлайн-школі <br />
                <span style={{ color: 'var(--brand)' }}>JustSchool</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Індивідуальні та групові уроки англійської для всіх. Від рівня A1 до C2 з гарантією результату!
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openLeadModal('Спробувати безкоштовно')}
                  style={{
                    height: 56,
                    padding: '0 36px',
                    fontSize: '17px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--brand)',
                    boxShadow: 'var(--shadow-brand)',
                  }}
                >
                  Спробувати безкоштовно
                </Button>
              </div>
            </div>

            {/* Right Graphic Column: Image with floating metric badges matching screenshot */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative max-w-[540px] w-full">
                {/* Hero Illustration from Screenshot */}
                <img
                  src={heroImg}
                  alt="JustSchool Англійська мова онлайн"
                  className="w-full h-auto object-contain rounded-3xl drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. BENEFIT BADGES STRIP (Under Hero as in screenshot)
      ══════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--border-subtle)] bg-white py-4 shadow-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 min-w-max">
          {FEATURES_STRIP.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border bg-[var(--base-50)] text-xs sm:text-sm font-semibold text-[var(--text-strong)] shadow-2xs hover:border-[var(--brand)] transition-colors"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <span className="text-base">{feat.icon}</span>
              <span>{feat.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. COURSES SECTION ("Курси англійської мови...")
      ══════════════════════════════════════════════════════ */}
      <section id="courses" className="py-16 sm:py-24 bg-[var(--base-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge tone="brand" size="md" style={{ marginBottom: '12px' }}>
              🎯 Усі вікові групи
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-strong)] leading-tight tracking-tight mb-4">
              Курси англійської мови для всіх вікових груп
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed">
              Онлайн-уроки англійської мови в JustSchool охоплюють усі рівні від A1 до C1. Програми адаптовані під вік, цілі та темп кожного студента.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map(c => (
              <Card
                key={c.id}
                variant="raised"
                padding="lg"
                interactive
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  border: 'var(--border-hairline) solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 rounded-2xl bg-[var(--orange-25)] border border-[var(--orange-100)]">
                      {c.emoji}
                    </span>
                    <Badge tone="brand" size="sm">
                      {c.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-strong)] mb-2">
                    {c.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)] mb-3">
                    <span>Вік: {c.age}</span>
                    <span>•</span>
                    <span>Рівень: {c.level}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal leading-relaxed mb-6">
                    {c.desc}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => openLeadModal(`Курс: ${c.title}`)}
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    borderColor: 'var(--border-default)',
                    fontWeight: 700,
                  }}
                >
                  Дізнатися більше →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. METHODOLOGY & PROOF SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge tone="success" size="md" style={{ marginBottom: '16px' }}>
                🌟 Доведена ефективність
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-strong)] leading-tight mb-6">
                Чому 17 000+ учнів обирають уроки в JustSchool
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--orange-25)] border border-[var(--orange-100)] flex items-start gap-4">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-strong)]">80% часу — говоріння</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Ви говорите з першого уроку, а граматика засвоюється природно через реальні діалоги.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[var(--border-subtle)] flex items-start gap-4 shadow-xs">
                  <span className="text-2xl">👩‍🏫</span>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-strong)]">Ретельний відбір викладачів</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Лише 1 з 89 кандидатів проходить відбір. 72% мають міжнародні сертифікати CELTA / DELTA.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[var(--border-subtle)] flex items-start gap-4 shadow-xs">
                  <span className="text-2xl">💻</span>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-strong)]">Власна інтерактивна платформа</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Всі матеріали, словник, домашні завдання та фідбек викладача доступні 24/7 з будь-якого пристрою.</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openLeadModal('Запис на безкоштовне пробне заняття')}
                  style={{
                    height: 52,
                    padding: '0 32px',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-brand)',
                  }}
                >
                  Записатися на пробний урок 🎁
                </Button>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-[var(--surface-inverse)] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
              <div className="absolute -top-12 -right-12 pointer-events-none opacity-20 filter invert">
                <BrandShape shape="rings" size={200} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="text-3xl text-[var(--brand)] font-black">★★★★★</div>
                <p className="text-base sm:text-lg italic font-normal leading-relaxed text-[var(--base-200)]">
                  "Записався на уроки англійської в JustSchool, щоб підтягнути мову для нової роботи. Викладач одразу побудував план під сферу IT. Вже після 10 занять я впевнено пройшов технічну співбесіду в міжнародну компанію!"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--base-800)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand)] text-white font-extrabold flex items-center justify-center">
                    Д
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Дмитро</div>
                    <div className="text-xs text-[var(--base-400)]">Курс англійської для IT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. FLOATING ACTION BUTTONS (Right edge as in screenshot)
      ══════════════════════════════════════════════════════ */}
      <div className="fixed right-4 bottom-6 z-30 flex flex-col gap-3">
        {/* Call button */}
        <button
          type="button"
          onClick={() => openLeadModal('Швидкий дзвінок')}
          className="w-12 h-12 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-xl"
          aria-label="Замовити дзвінок"
        >
          📞
        </button>

        {/* Flag badge */}
        <button
          type="button"
          onClick={() => openLeadModal('Консультація')}
          className="w-12 h-12 rounded-full bg-white border border-[#E0E0E0] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-2xl"
          aria-label="Мова"
        >
          🇬🇧
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          7. LEAD FORM MODAL (Complies with GEMINI.md)
      ══════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[var(--border-subtle)] relative animate-modal-enter">
            {/* Close button */}
            <button
              type="button"
              onClick={closeLeadModal}
              disabled={isSubmitting}
              className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-strong)] text-xl font-bold p-1 leading-none"
              aria-label="Закрити"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <Badge tone="brand" size="md" style={{ marginBottom: '10px' }}>
                🎁 30 хв з методистом у подарунок
              </Badge>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-strong)] leading-tight">
                {modalTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
                Визначте свій рівень та отримайте персональну програму занять.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Ваше ім'я"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full px-4 py-4 rounded-2xl border-2 outline-none font-semibold text-base transition-all bg-white disabled:opacity-50"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-strong)' }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <PhoneInput
                  onChange={(raw, valid) => {
                    setRawPhone(raw);
                    setIsPhoneValid(valid);
                  }}
                  initialCountry={geoCountry}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <input
                  type="email"
                  disabled={isSubmitting}
                  placeholder="Ваш Email (необов'язково)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-4 rounded-2xl border-2 outline-none font-semibold text-base transition-all bg-white disabled:opacity-50"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-strong)' }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'var(--brand)';
                    e.currentTarget.style.boxShadow = 'var(--focus-ring)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                style={{
                  height: 54,
                  fontSize: '16px',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-brand)',
                }}
              >
                {isSubmitting ? 'Надсилаємо заявку...' : 'Отримати безкоштовний урок'}
              </Button>

              <p className="text-[11px] text-center text-[var(--text-muted)] font-medium pt-1">
                🔒 Ваші дані захищені. Ми зв'яжемося тільки для узгодження часу першого заняття.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          8. FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--border-subtle)] bg-white py-8 px-4 sm:px-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoBlack} alt="JustSchool" className="h-5 w-auto" />
            <span>© {new Date().getFullYear()} JustSchool. Онлайн-школа англійської мови.</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Політика конфіденційності</a>
            <span>•</span>
            <a href="#" className="hover:underline">Договір оферти</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
