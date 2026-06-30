import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { quizData } from "./data";
import alinaPhoto from "../../lp-check-up/src/assets/reviews/alina.jpg";
import dmitroPhoto from "../../lp-check-up/src/assets/reviews/dmitro.jpg";

declare global {
  interface Window {
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  placeholder: string;
  mask: string;
  length: number;
}

const COUNTRIES: CountryConfig[] = [
  {
    code: "UA",
    name: "Україна",
    flag: "🇺🇦",
    dialCode: "380",
    placeholder: "+380 (XX) XXX-XX-XX",
    mask: "+380 (XX) XXX-XX-XX",
    length: 12,
  },
  {
    code: "PL",
    name: "Польща",
    flag: "🇵🇱",
    dialCode: "48",
    placeholder: "+48 (XXX) XXX-XXX",
    mask: "+48 (XXX) XXX-XXX",
    length: 11,
  },
  {
    code: "DE",
    name: "Німеччина",
    flag: "🇩🇪",
    dialCode: "49",
    placeholder: "+49 XXX XXX XXX",
    mask: "+49 XXX XXX XXX",
    length: 11,
  },
  {
    code: "RO",
    name: "Румунія",
    flag: "🇷🇴",
    dialCode: "40",
    placeholder: "+40 XXX XXX XXX",
    mask: "+40 XXX XXX XXX",
    length: 11,
  },
  {
    code: "SK",
    name: "Словаччина",
    flag: "🇸🇰",
    dialCode: "421",
    placeholder: "+421 XXX XXX XXX",
    mask: "+421 XXX XXX XXX",
    length: 12,
  },
  {
    code: "CZ",
    name: "Чехія",
    flag: "🇨🇿",
    dialCode: "420",
    placeholder: "+420 XXX XXX XXX",
    mask: "+420 XXX XXX XXX",
    length: 12,
  },
  {
    code: "GB",
    name: "Великобританія",
    flag: "🇬🇧",
    dialCode: "44",
    placeholder: "+44 XXXX XXXXXX",
    mask: "+44 XXXX XXXXXX",
    length: 12,
  },
  {
    code: "US",
    name: "США / Канада",
    flag: "🇺🇸",
    dialCode: "1",
    placeholder: "+1 (XXX) XXX-XXXX",
    mask: "+1 (XXX) XXX-XXXX",
    length: 11,
  },
];

const formatPhone = (value: string, country: CountryConfig) => {
  let digits = value.replace(/\D/g, "");

  // If leading 0 is typed and country is Ukraine, prepend 380
  if (country.code === "UA" && digits.startsWith("0") && !digits.startsWith("380")) {
    digits = "380" + digits.substring(1);
  }

  if (!digits) return "";

  // Prepend dialCode if it doesn't match
  if (!digits.startsWith(country.dialCode)) {
    if (country.dialCode.startsWith(digits)) {
      return "+" + digits;
    }
    digits = country.dialCode + digits;
  }

  let formatted = "";
  let digitIndex = 0;
  const mask = country.mask;

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    if (char === "+") {
      formatted += "+";
    } else if (char === "X") {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else {
      if (digitIndex < digits.length) {
        formatted += char;
      } else {
        break;
      }
    }
  }

  // Handle any remainder digits for dynamic configurations
  if (digitIndex < digits.length) {
    formatted += " " + digits.substring(digitIndex);
  }

  return formatted;
};

const isPhoneValid = (phone: string, country: CountryConfig) => {
  const digits = phone.replace(/\D/g, "");
  if (country.code === "UA") {
    return digits.length === 12;
  }
  if (country.code === "PL" || country.code === "US") {
    return digits.length === 11;
  }
  return digits.length >= 9 && digits.length <= 15;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadTelegram, setLeadTelegram] = useState("");

  const [activeCountry, setActiveCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loaderProgress, setLoaderProgress] = useState(0);

  const currentStepData = quizData.find((s) => s.step === step) || quizData[0];
  const isHero = currentStepData.type === "hero";
  const isLoader = currentStepData.type === "loader";
  const isLead = currentStepData.type === "lead_contacts";

  const displayStep = currentStepData.displayStep || 1;
  const totalSteps = 15;

  // Fetch GEO on Mount
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch("https://ipinfo.io/json");
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country;
          if (countryCode) {
            const matched = COUNTRIES.find((c) => c.code === countryCode.toUpperCase());
            if (matched) {
              setActiveCountry(matched);
            }
          }
        }
      } catch (e) {
        console.error("GEO IP retrieval failed", e);
      }
    };
    fetchGeo();
  }, []);

  // Dropdown Close on Outside Click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const closeDropdown = () => setIsDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isDropdownOpen]);

  // Loader interval simulation
  useEffect(() => {
    if (isLoader) {
      const interval = setInterval(() => {
        setLoaderProgress((prev) => {
          if (prev >= 91) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 800);
            return 91;
          }
          return prev + 1;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [step, isLoader]);

  const handleChoice = (label: string) => {
    if (isSubmitting) return; // CRM guard
    const newAnswers = Object.assign({}, answers, { [step]: label });
    setAnswers(newAnswers);
    setTimeout(() => {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let digits = val.replace(/\D/g, "");

    // Handle Ukraine 0 prefix shortcut
    if (activeCountry.code === "UA" && digits.startsWith("0") && !digits.startsWith("380")) {
      digits = "380" + digits.substring(1);
    }

    // Dynamic GEO flag auto-detection on typing/pasting
    const sortedCountries = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    let detectedCountry = activeCountry;

    for (const c of sortedCountries) {
      if (digits.startsWith(c.dialCode)) {
        detectedCountry = c;
        break;
      }
    }

    if (detectedCountry.code !== activeCountry.code) {
      setActiveCountry(detectedCountry);
      const formatted = formatPhone(val, detectedCountry);
      setLeadPhone(formatted);
    } else {
      const formatted = formatPhone(val, activeCountry);
      setLeadPhone(formatted);
    }
  };

  const handlePhoneFocus = () => {
    if (!leadPhone) {
      if (activeCountry.code === "UA") {
        setLeadPhone("+380 (");
      } else if (activeCountry.code === "PL") {
        setLeadPhone("+48 (");
      } else if (activeCountry.code === "US") {
        setLeadPhone("+1 (");
      } else {
        setLeadPhone("+" + activeCountry.dialCode + " ");
      }
    }
  };

  const handlePhoneBlur = () => {
    const digits = leadPhone.replace(/\D/g, "");
    if (
      digits === activeCountry.dialCode ||
      leadPhone.trim() === "+" + activeCountry.dialCode ||
      leadPhone.trim() === "+" + activeCountry.dialCode + " ("
    ) {
      setLeadPhone("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Double Submission Guard

    if (!isPhoneValid(leadPhone, activeCountry)) {
      alert("Будь ласка, введіть коректний номер телефону відповідно до обраної країни.");
      return;
    }

    setIsSubmitting(true);

    const qaArray = Object.entries(answers).map(
      (item) => "Q" + item[0] + ": " + item[1],
    );
    const qaString = qaArray.join("|||");

    const urlParams = new URLSearchParams(window.location.search);

    const payload = {
      name: leadName,
      phone: "+" + leadPhone.replace(/\D/g, ""),
      email: leadEmail,
      telegram: leadTelegram,
      qa: qaString,
      dialogueUrl: window.location.href,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_term: urlParams.get("utm_term"),
      utm_content: urlParams.get("utm_content"),
      utm_subject: "English Reviews",
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "form_success",
            quiz_name: "lp-reviews",
          });
        }
        if (window.fbq) {
          window.fbq("track", "Purchase", { currency: "UAH", value: 0 });
        }
        const result = await response.json();
        if (result.redirectUri) {
          window.location.href = result.redirectUri;
        } else {
          alert("Дякуємо! Ваша заявка прийнята.");
          setStep(1);
          setAnswers({});
          setLeadName("");
          setLeadPhone("");
          setLeadEmail("");
          setLeadTelegram("");
        }
      } else {
        alert("Виникла помилка при відправці. Спробуйте ще раз.");
      }
    } catch (error) {
      alert("Виникла помилка при відправці.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (isSubmitting) return; // CRM guard
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full bg-Surface-Page text-Text-Primary font-sans flex flex-col items-center overflow-x-hidden relative">
      {/* Figma background layered radial circles */}
      {isHero && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[749px] h-[749px] rounded-full"
            style={{
              background:
                "radial-gradient(59.91% 59.91% at 50% 50%, #FFFFFF 0%, #FCFBFF 100%)",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[642px] h-[642px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #FFFFFF 54.26%, #F7F6FF 100%)",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[507px] h-[507px] rounded-full opacity-75"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #FFFFFF 54.26%, #F7F6FF 100%)",
            }}
          ></div>
        </div>
      )}

      {/* Header Container */}
      <header className="w-full max-w-5xl px-[18px] py-[24px] md:px-6 flex justify-between items-center relative z-10 shrink-0">
        <div className="w-[69px] flex items-center">
          {!isHero && (
            <button
              onClick={goBack}
              disabled={isSubmitting}
              className="flex items-center gap-[8px] text-[14px] font-medium text-Text-Primary hover:text-Brand-Primary transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft size={20} strokeWidth={2.5} /> Назад
            </button>
          )}
        </div>

        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-[10px] absolute left-1/2 -translate-x-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 0L19.5 11.5L31 15L19.5 18.5L16 30L12.5 18.5L1 15L12.5 11.5L16 0Z"
              fill="var(--color-Brand-Primary)"
            />
          </svg>
          <span className="font-bold text-[20px] md:text-[24px] tracking-tight text-Text-Primary">
            JustSchool
          </span>
        </div>

        {/* Counter indicator */}
        <div className="w-[69px] text-right">
          {!isHero && !isLead && (
            <span className="text-Text-Primary text-sm font-semibold font-['Montserrat']">
              {displayStep} / <span className="text-Brand-Primary">{totalSteps}</span>
            </span>
          )}
        </div>
      </header>

      {/* Responsive Animated Progress Bar */}
      {!isHero && !isLead && (
        <div className="w-full max-w-[896px] px-[18px] md:px-0 mb-[32px] z-10">
          <div className="w-full bg-Border-Muted h-2 rounded-[100px] overflow-hidden">
            <motion.div
              className="bg-Brand-Primary h-full rounded-[100px]"
              initial={{ width: 0 }}
              animate={{ width: (displayStep / totalSteps) * 100 + "%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-5xl px-[18px] md:px-6 pb-12 flex flex-col items-center z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center"
          >
            {/* 1. HERO PHASE */}
            {isHero && (
              <div className="flex flex-col items-center text-center mt-2 max-w-[896px]">
                <h1 className="text-[26px] md:text-[56px] font-bold mb-[8px] leading-[32px] md:leading-[1.1] text-Text-Primary">
                  Заговори англійською вільно —{" "}
                  <span className="text-Brand-Primary">з JustSchool</span>
                </h1>
                <p className="text-[16px] md:text-[20px] text-Text-Primary leading-[24px] font-normal mb-[8px] max-w-[600px]">
                  Наші студенти виходять на новий рівень та долають мовний
                  бар'єр вже за перший місяць. Почни говорити з перших хвилин на
                  інтерактивній платформі, що підлаштовується под твій темп.
                </p>
                <p className="text-[16px] md:text-[20px] text-Text-Primary font-semibold leading-[24px] mb-[24px]">
                  Пройди тест, дізнайся свій рівень та отримай персональний план
                  навчання.
                </p>

                <div className="w-full max-w-[284px] md:max-w-md mx-auto flex flex-col items-center">
                  {/* Alarm clock check badge */}
                  <div className="bg-Surface-Accent rounded-[50px] px-[24px] py-[8px] mb-[10px] flex items-center justify-center gap-[10px] h-[60px] w-full">
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 18 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="9"
                        cy="8.5"
                        r="7.5"
                        stroke="var(--color-Accent-Primary)"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 4.5v4l2 2"
                        stroke="var(--color-Accent-Primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-Text-Primary text-sm font-semibold font-['Montserrat']">
                      Лише <span className="text-Accent-Primary">30 секунд</span>, щоб дізнатися рівень
                    </span>
                  </div>

                  {/* Test action button */}
                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-[56px] bg-Brand-Primary text-Base-White rounded-[10px] font-bold text-[18px] flex items-center justify-center gap-[10px] active:scale-95 transition-all cursor-pointer"
                  >
                    Пройти тест{" "}
                    <ArrowLeft
                      className="rotate-180"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </button>
                  <p className="text-Text-Primary text-sm font-medium font-['Montserrat'] mt-[10px] mb-[32px]">
                    Безкоштовно та миттєво
                  </p>

                  {/* Overlapping Students Avatars Row */}
                  <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center items-center h-[44px] mb-[16px]">
                      <div className="flex -space-x-3">
                        <div className="w-[44px] h-[44px] rounded-full border-2 border-Base-White bg-blue-100 z-[5] overflow-hidden">
                          <img
                            src={alinaPhoto}
                            className="w-full h-full object-cover"
                            alt="Student"
                          />
                        </div>
                        <div className="w-[44px] h-[44px] rounded-full border-2 border-Base-White bg-green-100 z-[4] overflow-hidden">
                          <img
                            src={dmitroPhoto}
                            className="w-full h-full object-cover"
                            alt="Student"
                          />
                        </div>
                        <div className="w-[44px] h-[44px] rounded-full border-2 border-Base-White bg-purple-100 z-[3] overflow-hidden">
                          <img
                            src={alinaPhoto}
                            className="w-full h-full object-cover"
                            alt="Student"
                          />
                        </div>
                        <div className="w-[44px] h-[44px] rounded-full border-2 border-Base-White bg-yellow-100 z-[2] overflow-hidden">
                          <img
                            src={dmitroPhoto}
                            className="w-full h-full object-cover"
                            alt="Student"
                          />
                        </div>
                        <div className="w-[44px] h-[44px] rounded-full border-2 border-Base-White bg-[#F2F2FE] flex items-center justify-center text-Accent-Primary font-semibold text-[13.75px] z-[1]">
                          +20k
                        </div>
                      </div>
                    </div>
                    <p className="text-Text-Primary text-base font-medium font-['Montserrat'] leading-[24px]">
                      Більше <span className="font-bold">20 000</span> учнів вже дізналися свій рівень
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CHOICE PHASES */}
            {currentStepData.type === "choice" && (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-[32px] w-full max-w-[89px] md:max-w-[896px]">
                  <h1 className="text-Text-Primary text-2xl md:text-3xl font-bold mb-[16px] leading-[30px] font-['Montserrat']">
                    {currentStepData.question}
                  </h1>
                  {currentStepData.subtitle && (
                    <p className="text-Text-Primary text-base md:text-lg leading-[28px] font-normal font-['Montserrat'] max-w-[700px] mx-auto">
                      {currentStepData.subtitle}
                    </p>
                  )}
                </div>

                {/* Option selection grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] w-full mb-[32px] max-w-[896px]">
                  {currentStepData.options &&
                    currentStepData.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleChoice(opt.label)}
                        className={
                          "px-[24px] py-[20px] rounded-[16px] text-left flex items-center gap-[12px] min-h-[72px] transition-all cursor-pointer focus:outline-none " +
                          (answers[step] === opt.label
                            ? "bg-Interactive-Hover outline outline-1 outline-offset-[-1px] outline-Brand-Primary shadow-[0px_0px_9.8px_rgba(125,125,125,0.09)]"
                            : "bg-Base-White border border-transparent shadow-[0px_0px_9.8px_rgba(125,125,125,0.09)] hover:shadow-md")
                        }
                      >
                        <span className="text-[32px] leading-none">{opt.emoji}</span>
                        <span className="font-semibold text-[18px] text-Text-Primary leading-[20px] font-['Montserrat']">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                </div>

                {/* Testimonial or Fact Block container */}
                {currentStepData.bottomBlock && (
                  <div className="w-full max-w-[896px]">
                    {currentStepData.bottomBlock.type === "testimonial" ? (
                      <div className="w-full bg-Surface-AccentLight rounded-2xl p-6 md:p-8 flex flex-col gap-4 text-left shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full overflow-hidden border border-Border-Muted shrink-0">
                              <img
                                src={currentStepData.bottomBlock.photoUrl}
                                className="w-full h-full object-cover"
                                alt="Alina"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h4 className="text-Text-Primary text-lg font-semibold font-['Montserrat'] leading-tight">
                                {currentStepData.bottomBlock.name}
                              </h4>
                              <p className="text-Text-Secondary text-xs font-normal font-['Montserrat'] leading-tight">
                                {currentStepData.bottomBlock.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill="var(--color-Decorative-Yellow)"
                                  stroke="none"
                                />
                              ))}
                            </div>
                            <span className="text-Text-Secondary text-base font-medium font-['Montserrat']">5.0</span>
                          </div>
                        </div>
                        <p className="text-Text-Primary text-[16px] md:text-lg font-normal font-['Montserrat'] leading-relaxed italic">
                          "{currentStepData.bottomBlock.text}"
                        </p>
                      </div>
                    ) : (
                      <div className="w-full bg-Surface-AccentLight rounded-2xl p-6 md:p-8 flex flex-col gap-4 text-left shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-Decorative-PurpleSoft rounded-full flex items-center justify-center shrink-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-Accent-Primary"
                            >
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                              <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="12" cy="8" r="1" fill="currentColor" />
                            </svg>
                          </div>
                          <h4 className="text-Accent-Primary text-base font-bold font-['Montserrat']">
                            {currentStepData.bottomBlock.title}
                          </h4>
                        </div>
                        <p className="text-Text-Primary text-[16px] md:text-lg font-medium font-['Montserrat'] leading-relaxed">
                          {currentStepData.bottomBlock.text}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. LOADER / CALCULATION PHASE */}
            {isLoader && (
              <div className="w-full flex flex-col items-center max-w-[284px] md:max-w-md">
                <h1 className="text-Text-Primary text-2xl font-bold mb-[24px] leading-[30px] text-center font-['Montserrat']">
                  {currentStepData.question}
                </h1>

                {/* Animated progress circle indicator */}
                <div className="relative w-[152px] h-[152px] mb-[32px]">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="76"
                      cy="76"
                      r="68"
                      stroke="var(--color-Brand-Soft)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <motion.circle
                      cx="76"
                      cy="76"
                      r="68"
                      stroke="var(--color-Brand-Primary)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{
                        strokeDasharray: "427",
                        strokeDashoffset: "427",
                      }}
                      animate={{
                        strokeDashoffset: 427 - (427 * loaderProgress) / 100,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[36px] font-bold text-Brand-Primary tracking-[-0.2px]">
                    {loaderProgress}
                    <span className="text-[20px]">%</span>
                  </div>
                </div>

                {/* Loader active checklists */}
                <div className="space-y-[20px] w-full">
                  {currentStepData.points &&
                    currentStepData.points.map((p, i) => {
                      const isVisible = loaderProgress > i * 22;
                      return (
                        <div
                          key={p}
                          className={
                            "flex items-center gap-[12px] transition-opacity duration-500 " +
                            (isVisible ? "opacity-100" : "opacity-30")
                          }
                        >
                          <div
                            className={
                              "w-[24px] h-[24px] rounded-full flex items-center justify-center text-Base-White shrink-0 " +
                              (isVisible ? "bg-Brand-Primary" : "bg-Border-Muted")
                            }
                          >
                            <CheckCircle2 size={16} strokeWidth={3} />
                          </div>
                          <span className="font-medium text-[16px] leading-[24px] text-Text-Primary font-['Montserrat']">
                            {p}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 4. LEAD CAPTURE FORM PHASE */}
            {isLead && (
              <div className="w-full max-w-[896px] flex flex-col md:flex-row gap-[32px] items-stretch text-left">
                {/* Left Side: Submit Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div className="mb-[24px]">
                    <h2 className="text-Text-Primary text-2xl font-bold mb-[16px] leading-[30px] font-['Montserrat'] text-center md:text-left">
                      Отримай персональний план навчання!
                    </h2>
                    <p className="text-Text-Primary text-lg font-normal leading-[28px] font-['Montserrat'] text-center md:text-left">
                      Введи свій номер телефону та e-mail, і ми надішлемо тобі
                      деталі про навчання та безкоштовний пробний урок.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[16px]"
                  >
                    {/* Name input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Ім’я"
                        required
                        disabled={isSubmitting}
                        className="w-full p-[18px_16px] h-[56px] rounded-[16px] bg-Base-White border border-Border-Default transition-all text-[14px] font-medium text-Text-Primary outline-none placeholder:text-Text-Secondary focus:border-Brand-Primary disabled:opacity-50"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                      />
                    </div>

                    {/* Phone Input with flag selector */}
                    <div className="relative flex flex-col w-full">
                      <div className="relative flex items-center w-full h-[56px] rounded-[16px] bg-Base-White border border-Border-Default">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                          className="absolute left-4 flex items-center gap-[6px] focus:outline-none z-10 cursor-pointer h-full"
                        >
                          <span className="text-xl leading-none">{activeCountry.flag}</span>
                          <span className="text-[10px] text-Text-Primary">▼</span>
                          <span className="text-sm font-semibold text-Text-Primary ml-1">+{activeCountry.dialCode}</span>
                        </button>
                        <input
                          type="tel"
                          placeholder={activeCountry.placeholder}
                          required
                          disabled={isSubmitting}
                          className="w-full h-full p-[18px_16px] rounded-[16px] bg-transparent outline-none text-[14px] font-medium text-Text-Primary placeholder:text-Text-Secondary border-none transition-all disabled:opacity-50"
                          style={{
                            paddingLeft: `${activeCountry.dialCode.length === 1 ? '96px' : activeCountry.dialCode.length === 2 ? '104px' : '112px'}`
                          }}
                          value={leadPhone}
                          onChange={handlePhoneChange}
                          onFocus={handlePhoneFocus}
                          onBlur={handlePhoneBlur}
                        />
                      </div>

                      {/* Dropdown list of popular countries */}
                      {isDropdownOpen && (
                        <div className="absolute top-[60px] left-0 w-full bg-Base-White border border-Border-Muted rounded-2xl shadow-lg z-50 max-h-[220px] overflow-y-auto py-2">
                          {COUNTRIES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setActiveCountry(country);
                                setIsDropdownOpen(false);
                                const digitsOnly = leadPhone.replace(/\D/g, "");
                                if (!digitsOnly || digitsOnly === activeCountry.dialCode) {
                                  setLeadPhone("+" + country.dialCode);
                                } else {
                                  const formatted = formatPhone(leadPhone, country);
                                  setLeadPhone(formatted);
                                }
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-Surface-Accent transition-colors focus:outline-none"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span className="font-semibold text-sm text-Text-Primary flex-1">{country.name}</span>
                              <span className="text-sm text-Text-Secondary">+{country.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Email Input */}
                    <input
                      type="email"
                      placeholder="Електронна пошта"
                      required
                      disabled={isSubmitting}
                      className="w-full p-[18px_16px] h-[56px] rounded-[16px] bg-Base-White border border-Border-Default transition-all text-[14px] font-medium text-Text-Primary outline-none placeholder:text-Text-Secondary focus:border-Brand-Primary disabled:opacity-50"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />

                    {/* Telegram Nickname input */}
                    <input
                      type="text"
                      placeholder="Ваш нік в Telegram/Viber (@name)"
                      disabled={isSubmitting}
                      className="w-full p-[18px_16px] h-[56px] rounded-[16px] bg-Base-White border border-Border-Default transition-all text-[14px] font-medium text-Text-Primary outline-none placeholder:text-Text-Secondary focus:border-Brand-Primary disabled:opacity-50"
                      value={leadTelegram}
                      onChange={(e) => setLeadTelegram(e.target.value)}
                    />

                    {/* Submit Action Block */}
                    <div className="pt-[8px]">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[56px] bg-Brand-Primary text-Base-White rounded-[16px] font-bold text-[18px] leading-[28px] active:scale-95 transition-all focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? "Надсилаємо заявку..." : "Залишити заявку"}
                      </button>
                    </div>

                    <p className="text-[14px] text-Text-Secondary text-center font-normal leading-[22px] px-2 font-['Montserrat']">
                      Ми допоможемо тобі в усьому. Твої дані в безпеці та
                      використовуються лише для зв'язку з методистом.
                    </p>
                  </form>
                </div>

                {/* Right Side: Google rating and Reviews card widgets */}
                <div className="w-full md:w-1/2 bg-Surface-AccentLight rounded-[16px] p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
                  <div className="text-center mb-[16px] relative w-full flex flex-col items-center z-10">
                    <h3 className="text-Text-Primary text-lg font-bold mb-[16px] leading-[28px] font-['Montserrat']">
                      Рейтинг Google
                    </h3>

                    {/* Decorative curves */}
                    <div className="absolute top-[20px] w-full flex justify-between px-[20px] pointer-events-none">
                      <svg
                        width="45"
                        height="109"
                        viewBox="0 0 45 109"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M44 20 Q10 50 44 90"
                          stroke="#C3B8FD"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      <svg
                        width="45"
                        height="109"
                        viewBox="0 0 45 109"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transform: "scaleX(-1)" }}
                      >
                        <path
                          d="M44 20 Q10 50 44 90"
                          stroke="#C3B8FD"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Star score display */}
                    <div className="flex items-end justify-center gap-[4px] mb-[16px]">
                      <span className="text-[32px] font-black text-[#000000] leading-none">
                        4.7
                      </span>
                      <span className="text-[25px] font-bold text-Text-Primary leading-none">
                        /5
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-[8px] mb-[16px]">
                      {[0, 1, 2, 3].map((i) => (
                        <Star key={i} size={18} fill="var(--color-Decorative-Yellow)" stroke="none" />
                      ))}
                      <div className="relative w-[18px] h-[17px]">
                        <Star
                          size={18}
                          fill="#D9D9D9"
                          stroke="none"
                          className="absolute top-0 left-0"
                        />
                        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                          <Star size={18} fill="var(--color-Decorative-Yellow)" stroke="none" />
                        </div>
                      </div>
                    </div>

                    <p className="text-Text-Primary text-lg font-normal leading-[28px] font-['Montserrat']">
                      Відгуки наших студентів
                    </p>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-[16px] w-full mt-[8px] z-10">
                    {/* Review card 1 */}
                    <div className="bg-Base-White rounded-[16px] p-[16px] shadow-sm flex flex-col gap-[20px]">
                      <div className="text-[#000000] font-bold text-[14px] flex gap-1 font-['Montserrat']">
                        Education<span className="text-[#FFC107]">.ua</span>
                      </div>
                      <p className="text-[16px] font-normal leading-[24px] text-Text-Primary font-['Montserrat']">
                        Все супер, мені комфотно тут вчитись, цікаво проходять
                        уроки. Бізнес англійська це топ, я вже змогла отримати
                        офер у міжнародній компанії. Без Just School цього б не
                        сталось. Дякую!
                      </p>
                      <div className="flex items-center gap-[16px]">
                        <div className="w-[40px] h-[40px] bg-Decorative-PurpleSoft rounded-full flex items-center justify-center text-Accent-Primary shrink-0 font-['Montserrat']">
                          <svg
                            width="19"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span className="font-semibold text-[16px] text-Text-Primary font-['Montserrat']">
                          Ангеліна
                        </span>
                      </div>
                    </div>

                    {/* Review card 2 */}
                    <div className="bg-Base-White rounded-[16px] p-[16px] shadow-sm flex flex-col gap-[20px]">
                      <div className="text-[#194CD5] font-black text-[18px] tracking-tighter font-['Montserrat']">
                        enguide
                      </div>
                      <p className="text-[16px] font-normal leading-[24px] text-Text-Primary font-['Montserrat']">
                        Я займаюсь англійською вже кілька місяців, і це реально
                        приносить результати. Найбільше подобається, що викладач
                        враховує мої цілі, і ми працюємо над тим, що мені дійсно
                        важливо...
                      </p>
                      <div className="flex items-center gap-[16px]">
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-Border-Muted shrink-0">
                          <img
                            src={dmitroPhoto}
                            className="w-full h-full object-cover"
                            alt="Vladimir"
                          />
                        </div>
                        <span className="font-semibold text-[16px] text-Text-Primary font-['Montserrat']">
                          Владимир Кузьма
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Slider dots indicator */}
                  <div className="flex justify-center gap-[20px] mt-[24px] z-10">
                    <div className="w-[14px] h-[14px] rounded-full bg-Brand-Primary"></div>
                    <div className="w-[14px] h-[14px] rounded-full bg-Brand-Soft"></div>
                    <div className="w-[14px] h-[14px] rounded-full bg-Brand-Soft"></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
