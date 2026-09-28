import React, { useState, useEffect } from "react";
import PhoneInput from "./PhoneInput";
import { QUIZ_STEPS } from "./data";

export default function App() {
  // Step 0: Hero
  // Step 1: Вік
  // Step 2: Зайнятість
  // Step 3: Час
  // Step 4: Контакти
  // Step 5: Фінальний екран
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Contacts
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [geoCountry, setGeoCountry] = useState("UA");
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});

  // IP Geo detection on mount
  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setIpInfo(d);
          if (d.country) setGeoCountry(d.country);
        }
      })
      .catch(() => {});
  }, []);

  // Track quiz step views in GTM & Pixel
  useEffect(() => {
    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "quiz_step_reach",
        quiz_name: "job_justtech",
        step_number: step,
      });
    } catch {}
  }, [step]);

  const handleSelectOption = (stepId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep(stepId + 1);
  };

  const handleBack = () => {
    if (step <= 0 || step === 5 || isSubmitting) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setSubmitError("Будь ласка, вкажи своє ім'я");
      return;
    }

    if (!rawPhone || !isPhoneValid) {
      setSubmitError("Будь ласка, введи коректний номер телефону");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const urlObj = new URL(window.location.href);
      const utmSource = urlObj.searchParams.get("utm_source") || "";
      const utmMedium = urlObj.searchParams.get("utm_medium") || "";
      const utmCampaign = urlObj.searchParams.get("utm_campaign") || "";
      const utmContent = urlObj.searchParams.get("utm_content") || "";
      const utmTerm = urlObj.searchParams.get("utm_term") || "";

      const age = answers[1] || "";
      const occupation = answers[2] || "";
      const timeCommitment = answers[3] || "";

      const qaString = [
        `ip:${ipInfo.ip || ""}|country:${ipInfo.country || geoCountry}`,
        `Скільки тобі років: ${age}`,
        `Чим зараз займаєшся: ${occupation}`,
        `Скільки часу готовий(а) приділяти: ${timeCommitment}`,
        telegram.trim() ? `Telegram: ${telegram.trim()}` : "",
      ]
        .filter(Boolean)
        .join("|||");

      const payload = {
        name: name.trim(),
        phone: rawPhone,
        telegram: telegram.trim(),
        age,
        occupation,
        timeCommitment,
        dialogueId: "job_justtech",
        dialogueName: "JustTech Recruitment Quiz",
        lead_type: "recruitment_job_justtech",
        job_justtech: true,
        skipEsputnik: true,
        qa: qaString,
        ip: ipInfo.ip || "",
        country: ipInfo.country || geoCountry,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        dialogueUrl: window.location.href,
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Помилка сервера: ${res.status}`);
      }

      // Track Facebook Pixel Lead
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Lead", {
          content_name: "job_justtech",
        });
      }

      // Track GTM Conversion Event
      if (Array.isArray((window as any).dataLayer)) {
        (window as any).dataLayer.push({
          event: "form_success",
          form_name: "job_justtech",
          lead_type: "recruitment_job_justtech",
        });
      }

      // Advance to final screen
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(
        "Не вдалося надіслати заявку. Будь ласка, спробуй ще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          padding: "20px 20px 12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/assets/logo-horizontal-black.svg"
            alt="JustSchool"
            style={{ height: "26px", objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "#fff5eb",
              color: "#f46600",
              padding: "4px 8px",
              borderRadius: "8px",
            }}
          >
            JustTech
          </span>
        </div>

        {step > 0 && step < 5 && (
          <button
            type="button"
            onClick={handleBack}
            className="js-btn-secondary"
            disabled={isSubmitting}
            style={{ fontSize: "14px", gap: "4px" }}
          >
            ← Назад
          </button>
        )}
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
          padding: "16px 20px 48px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Step Indicator for Quiz Steps (1-4) */}
        {step >= 1 && step <= 4 && (
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#65676b",
              }}
            >
              <span>Крок {step} з 4</span>
              <span>{Math.round((step / 4) * 100)}%</span>
            </div>
            <div
              style={{
                height: "6px",
                width: "100%",
                background: "#e8e8e8",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(step / 4) * 100}%`,
                  background: "linear-gradient(90deg, #f46600, #ff8b36)",
                  borderRadius: "999px",
                  transition: "width 300ms ease",
                }}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 0: HERO ─────────────────────────────────── */}
        {step === 0 && (
          <div className="animate-fade-in">
            {/* Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff5eb",
                border: "1px solid #ffd8b8",
                color: "#f46600",
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              <span>🔥</span> Віддалена робота зі смартфона
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(28px, 6vw, 42px)",
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#09090a",
                margin: "0 0 16px 0",
              }}
            >
              Робота в чатах зі смартфона — виплати двічі на місяць
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                color: "#65676b",
                margin: "0 0 28px 0",
                fontWeight: 500,
              }}
            >
              Навчимо з нуля. Вільний графік та ніяких дзвінків.
            </p>

            {/* Bullet Points Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #ececec",
                borderRadius: "24px",
                padding: "24px 22px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                marginBottom: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#fff5eb",
                    color: "#f46600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#09090a" }}>
                    Переписки за готовими скриптами
                  </div>
                  <div style={{ fontSize: "14px", color: "#747474", marginTop: "2px" }}>
                    Усі відповіді та шаблони вже підготовлені, жодних дзвінків.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#fff5eb",
                    color: "#f46600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#09090a" }}>
                    Працюєш з будь-якого місця
                  </div>
                  <div style={{ fontSize: "14px", color: "#747474", marginTop: "2px" }}>
                    З дому, кав'ярні чи в дорозі — потрібен лише доступ до інтернету.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#fff5eb",
                    color: "#f46600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#09090a" }}>
                    Фікс за кожного кандидата + бонуси
                  </div>
                  <div style={{ fontSize: "14px", color: "#747474", marginTop: "2px" }}>
                    Прозора система виплат без затримок кожні два тижні.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Highlights Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "36px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "16px 12px",
                  borderRadius: "18px",
                  border: "1px solid #ebebeb",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>💸</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090a" }}>
                  Виплати 2р/міс
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "16px 12px",
                  borderRadius: "18px",
                  border: "1px solid #ebebeb",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>📱</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090a" }}>
                  Лише смартфон
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "16px 12px",
                  borderRadius: "18px",
                  border: "1px solid #ebebeb",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>⏱</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090a" }}>
                  Вільний графік
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setStep(1);
              }}
              className="js-btn-primary"
            >
              Перевірити, чи мені підходить →
            </button>
          </div>
        )}

        {/* ─── QUIZ STEPS (1..3) ────────────────────────────── */}
        {step >= 1 && step <= 3 && (
          <div className="animate-fade-in">
            {QUIZ_STEPS.filter((s) => s.id === step).map((s) => (
              <div key={s.id}>
                <h2
                  style={{
                    fontSize: "clamp(24px, 5vw, 32px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#09090a",
                    margin: "0 0 10px 0",
                  }}
                >
                  {s.question}
                </h2>
                {s.subtitle && (
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#65676b",
                      margin: "0 0 28px 0",
                      fontWeight: 500,
                    }}
                  >
                    {s.subtitle}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {s.options?.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(s.id, opt.label)}
                      className={`js-option-card ${answers[s.id] === opt.label ? "selected" : ""}`}
                    >
                      <span>{opt.label}</span>
                      <span
                        style={{
                          color: answers[s.id] === opt.label ? "#f46600" : "#c7c9cb",
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 4: CONTACT FORM ─────────────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#eafaf1",
                border: "1px solid #c7f0db",
                color: "#188c52",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              <span>🎉</span> Тест пройдено успішно
            </div>

            <h2
              style={{
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#09090a",
                margin: "0 0 12px 0",
              }}
            >
              Ти нам підходиш!
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#65676b",
                margin: "0 0 28px 0",
                fontWeight: 500,
              }}
            >
              Залиш контакти — куратор розповість про навчання і перші кроки.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                background: "#ffffff",
                border: "1.5px solid #ececec",
                borderRadius: "24px",
                padding: "28px 24px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Name field */}
              <div>
                <label
                  htmlFor="user-name"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#09090a",
                    marginBottom: "8px",
                  }}
                >
                  Ім'я <span style={{ color: "#f46600" }}>*</span>
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Твоє ім'я"
                  disabled={isSubmitting}
                  className="js-input"
                  required
                />
              </div>

              {/* Phone field */}
              <div>
                <label
                  htmlFor="phone-input"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#09090a",
                    marginBottom: "8px",
                  }}
                >
                  Номер телефону <span style={{ color: "#f46600" }}>*</span>
                </label>
                <PhoneInput
                  value={rawPhone}
                  onChange={(val, valid) => {
                    setRawPhone(val);
                    setIsPhoneValid(valid);
                  }}
                  initialCountry={geoCountry}
                  disabled={isSubmitting}
                />
              </div>

              {/* Telegram field */}
              <div>
                <label
                  htmlFor="user-telegram"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#09090a",
                    marginBottom: "8px",
                  }}
                >
                  Telegram{" "}
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#8f8f8f" }}>
                    (необов'язково)
                  </span>
                </label>
                <input
                  id="user-telegram"
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username або номер"
                  disabled={isSubmitting}
                  className="js-input"
                />
              </div>

              {submitError && (
                <div
                  style={{
                    background: "#fde8e8",
                    color: "#c81e1e",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !isPhoneValid}
                className="js-btn-primary"
                style={{ marginTop: "8px" }}
              >
                {isSubmitting ? "Надсилаємо заявку..." : "Записатися на навчання"}
              </button>

              <p
                style={{
                  fontSize: "12px",
                  color: "#8f8f8f",
                  textAlign: "center",
                  margin: "4px 0 0 0",
                  lineHeight: 1.4,
                }}
              >
                Натискаючи кнопку, ти погоджуєшся на обробку персональних даних згідно з політикою конфіденційності
              </p>
            </form>
          </div>
        )}

        {/* ─── STEP 5: FINAL SUCCESS SCREEN ────────────────── */}
        {step === 5 && (
          <div className="animate-fade-in" style={{ textAlign: "center", paddingTop: "20px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #fff5eb 0%, #ffd8b8 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                margin: "0 auto 24px auto",
                boxShadow: "0 8px 24px rgba(244, 102, 0, 0.2)",
              }}
            >
              🎉
            </div>

            <h2
              style={{
                fontSize: "clamp(28px, 6vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#09090a",
                margin: "0 0 16px 0",
              }}
            >
              Готово!
            </h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                color: "#65676b",
                maxWidth: "460px",
                margin: "0 auto 32px auto",
                fontWeight: 500,
              }}
            >
              Куратор зв'яжеться з тобою найближчим часом і розповість про навчання.
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #ececec",
                borderRadius: "20px",
                padding: "24px",
                maxWidth: "420px",
                margin: "0 auto",
                textAlign: "left",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#f46600",
                  letterSpacing: "0.06em",
                  marginBottom: "12px",
                }}
              >
                Твоя заявка прийнята
              </div>
              <div style={{ fontSize: "15px", color: "#09090a", marginBottom: "8px" }}>
                <strong>Ім'я:</strong> {name}
              </div>
              <div style={{ fontSize: "15px", color: "#09090a", marginBottom: "8px" }}>
                <strong>Телефон:</strong> {rawPhone}
              </div>
              {telegram && (
                <div style={{ fontSize: "15px", color: "#09090a", marginBottom: "8px" }}>
                  <strong>Telegram:</strong> {telegram}
                </div>
              )}
              {answers[3] && (
                <div style={{ fontSize: "15px", color: "#09090a" }}>
                  <strong>Графік:</strong> {answers[3]}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "32px",
                fontSize: "14px",
                color: "#858585",
                fontWeight: 500,
              }}
            >
              💡 Зверни увагу на повідомлення у Telegram або дзвінок від нашого куратора.
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          padding: "24px 20px",
          textAlign: "center",
          fontSize: "13px",
          color: "#858585",
          borderTop: "1px solid #eaeaea",
          boxSizing: "border-box",
        }}
      >
        © {new Date().getFullYear()} JustTech · JustSchool. Усі права захищено.
      </footer>
    </div>
  );
}
