import React, { useState, useEffect } from "react";
import { quizData } from "./data";
import var1 from "../../../shared/img/Y26_W5_Static_Quiz_var1.webp";
import var2 from "../../../shared/img/Y26_W5_Static_Quiz_var2.webp";
import var3 from "../../../shared/img/Y26_W5_Static_Quiz_var3.webp";
import var4 from "../../../shared/img/Y26_W5_Static_Quiz_var4.webp";
import var5 from "../../../shared/img/Y26_W5_Static_Quiz_var5.webp";
import var6 from "../../../shared/img/Y26_W5_Static_Quiz_var6.webp";
import var7 from "../../../shared/img/Y26_W5_Static_Quiz_var7.webp";
import var8 from "../../../shared/img/Y26_W5_Static_Quiz_var8.webp";
import var9 from "../../../shared/img/Y26_W5_Static_Quiz_var9.webp";

const stepImages: { [key: number]: string } = {
  1: var1,
  2: var2,
  3: var3,
  4: var4,
  5: var5,
  6: var6,
  7: var7,
  8: var8,
  9: var9,
  10: var1,
  11: var2,
  12: var3,
  13: var4,
  14: var5,
  15: var6,
  16: var7,
  17: var8,
  18: var9,
  19: var1,
  20: var2,
  21: var3,
  22: var4,
};

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
  isSubmitting?: boolean;
  country?: string;
}

const Logo: React.FC = () => (
  <div className="w-full flex justify-center mb-6 pt-2">
    <div className="flex items-center gap-2 opacity-90">
      <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">
        J
      </div>
      <span className="text-xl font-bold text-white tracking-tight">
        JustSchool
      </span>
    </div>
  </div>
);

const ShimmerButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full h-14 rounded-2xl font-bold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 group shadow-xl transform active:scale-[0.98] ${disabled ? "bg-white/10 text-white/20 border border-white/5 cursor-not-allowed" : "bg-gradient-to-r from-orange-600 to-orange-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(241,102,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_30px_rgba(241,102,0,0.6)] border border-orange-400/20"}`}
  >
    {!disabled && (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer"></div>
    )}
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
  </button>
);

const highlightText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(JustSchool)/gi);
  return parts.map((part, i) =>
    part.toLowerCase() === "justschool" ? (
      <span key={i} className="text-[#f16600] font-bold">
        JustSchool
      </span>
    ) : (
      part
    ),
  );
};

const countryDialCodes: Record<string, string> = {
  UA: "380",
  PL: "48",
  DE: "49",
  GB: "44",
  US: "1",
  CA: "1",
  RO: "40",
  HU: "36",
  SK: "421",
  CZ: "420",
  MD: "373",
  IT: "39",
  FR: "33",
  ES: "34",
  PT: "351",
  IE: "353",
  AT: "43",
  CH: "41",
  BE: "32",
  NL: "31",
  DK: "45",
  NO: "47",
  SE: "46",
  FI: "358",
  EE: "372",
  LV: "371",
  LT: "370",
  GR: "30",
  CY: "357",
  IL: "972",
  TR: "90",
  AE: "971",
};

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🇺🇦";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🇺🇦";
  }
};

const formatPhoneNumber = (value: string, countryCode: string = "UA") => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  const dialCode = countryDialCodes[countryCode.toUpperCase()] || "380";
  let numbers = digits;

  if (numbers.startsWith(dialCode)) {
    // Starts with dialCode, perfect
  } else if (numbers.startsWith("0") && dialCode === "380") {
    numbers = "380" + numbers.substring(1);
  } else if (numbers.startsWith("0") && dialCode === "48") {
    numbers = "48" + numbers.substring(1);
  } else {
    numbers = dialCode + numbers;
  }

  if (numbers.startsWith("380")) {
    numbers = numbers.substring(0, 12);
    const char = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      // @ts-expect-error char map access
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
    }
    return formatted;
  } else if (numbers.startsWith("48")) {
    numbers = numbers.substring(0, 11);
    const char = { 0: "+", 2: " (", 5: ") ", 8: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      // @ts-expect-error char map access
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
    }
    return formatted;
  } else if (numbers.startsWith("1")) {
    numbers = numbers.substring(0, 11);
    const char = { 0: "+", 1: " (", 4: ") ", 7: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      // @ts-expect-error char map access
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
    }
    return formatted;
  } else {
    numbers = numbers.substring(0, 15);
    let formatted = "+" + dialCode + " ";
    const remaining = numbers.substring(dialCode.length);
    for (let i = 0; i < remaining.length; i++) {
      if (i > 0 && i % 3 === 0) formatted += " ";
      formatted += remaining[i];
    }
    return formatted.trim();
  }
};

const Quiz: React.FC<QuizProps> = ({
  step,
  onNextStep,
  isSubmitting = false,
  country = "UA",
}) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const activeCountryCode = selectedCountry || country;

  useEffect(() => {
    Object.values(stepImages).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!currentStepData?.form) return;
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const dialCode = countryDialCodes[activeCountryCode.toUpperCase()] || "380";
    let isPhoneValid = false;
    if (dialCode === "380") {
      isPhoneValid = phoneDigits.length === 12;
    } else if (dialCode === "48" || dialCode === "1") {
      isPhoneValid = phoneDigits.length === 11;
    } else {
      isPhoneValid = phoneDigits.length >= 9 && phoneDigits.length <= 15;
    }
    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setIsFormValid(isPhoneValid && isNameValid && isEmailValid);
  }, [formData, currentStepData, activeCountryCode]);

  if (!currentStepData)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold mb-2 text-white font-sans">
          Зачекайте, будь ласка...
        </h1>
        <p className="text-gray-400 text-base font-sans">
          Відправляємо вас на платформу
        </p>
      </div>
    );

  const handleAnswerClick = (answer: string) => {
    if (currentStepData.multiselect) {
      setSelectedAnswers((prev) =>
        prev.includes(answer)
          ? prev.filter((a) => a !== answer)
          : [...prev, answer],
      );
    } else {
      onNextStep([answer]);
    }
  };

  const handleNextClick = () => {
    onNextStep(
      currentStepData.form ? [JSON.stringify(formData)] : selectedAnswers,
    );
    setSelectedAnswers([]);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < formData.phone.length) {
      setFormData({ ...formData, phone: val });
      return;
    }
    setFormData({
      ...formData,
      phone: formatPhoneNumber(val, activeCountryCode),
    });
  };

  let isButtonDisabled = false;
  if (currentStepData.form) {
    isButtonDisabled = !isFormValid || isSubmitting;
  } else if (currentStepData.multiselect) {
    isButtonDisabled = selectedAnswers.length === 0;
  }

  const currentImage = stepImages[step];

  return (
    <>
      <div className="w-full px-5 pt-16 pb-48 flex flex-col flex-grow overflow-y-auto no-scrollbar">
        <Logo />
        <div
          key={step}
          className="w-full flex flex-col items-center animate-fade-in-up"
        >
          <div className="text-center mb-4 w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight font-sans tracking-tight">
              {highlightText(currentStepData.question)}
            </h1>
          </div>
          <div className="w-full">
            {currentStepData.answers && (
              <div
                className={`w-full mb-6 ${currentStepData.grid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2.5"}`}
              >
                {currentStepData.answers.map((answer) => (
                  <button
                    key={answer.text}
                    className={`p-3 text-left rounded-xl border transition-all duration-200 font-bold w-full flex items-center ${currentStepData.grid ? "text-[12px] sm:text-[13px]" : "text-[14px] sm:text-[15px]"} ${selectedAnswers.includes(answer.text) ? "bg-white/10 border-brand-orange text-white shadow-[0_0_15px_rgba(241,102,0,0.3)]" : "bg-white/[0.03] border-white/5 text-gray-300 active:bg-white/10"}`}
                    onClick={() => handleAnswerClick(answer.text)}
                  >
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 mr-2 sm:mr-3 flex items-center justify-center ${selectedAnswers.includes(answer.text) ? "border-brand-orange" : "border-white/20"}`}
                    >
                      {selectedAnswers.includes(answer.text) && (
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-brand-orange rounded-full"></div>
                      )}
                    </div>
                    <span className="leading-snug">{answer.text}</span>
                  </button>
                ))}
              </div>
            )}
            {!currentStepData.form &&
              currentImage &&
              ![7, 16, 17, 18, 19].includes(step) && (
                <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5 relative flex items-center justify-center max-w-[240px] mx-auto h-[100px] sm:h-[130px] mb-6">
                  <img
                    src={currentImage}
                    alt="Quiz illustration"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              )}
            {currentStepData.form &&
              (() => {
                const activeDial =
                  countryDialCodes[country.toUpperCase()] || "380";
                let phonePlaceholder = "+380 (XX) XXX-XX-XX";
                if (activeDial === "380")
                  phonePlaceholder = "+380 (XX) XXX-XX-XX";
                else if (activeDial === "48")
                  phonePlaceholder = "+48 (XXX) XXX-XXX";
                else if (activeDial === "1")
                  phonePlaceholder = "+1 (XXX) XXX-XXXX";
                else phonePlaceholder = `+${activeDial} XXXXXXXXX`;

                const emptyPrefix =
                  activeDial === "380"
                    ? "+380 ("
                    : activeDial === "48"
                      ? "+48 ("
                      : activeDial === "1"
                        ? "+1 ("
                        : `+${activeDial} `;

                return (
                  <div className="flex flex-col gap-4 w-full mt-4">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Ваше імʼя*"
                        className="input-glass py-4 text-lg w-full disabled:opacity-50"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                          className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 border-r border-white/10 gap-1.5 cursor-pointer z-10"
                        >
                          <span className="text-2xl">
                            {getFlagEmoji(activeCountryCode)}
                          </span>
                          <span className="text-[10px] text-slate-400">▼</span>
                        </button>
                        <input
                          type="tel"
                          placeholder={phonePlaceholder}
                          className="input-glass py-4 pl-[88px] text-lg w-full disabled:opacity-50"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          onFocus={() => {
                            if (!formData.phone) {
                              setFormData({ ...formData, phone: emptyPrefix });
                            }
                          }}
                          onBlur={() => {
                            if (
                              formData.phone === emptyPrefix ||
                              formData.phone === `+${activeDial}` ||
                              formData.phone === "+" ||
                              formData.phone === `+${activeDial} `
                            ) {
                              setFormData({ ...formData, phone: "" });
                            }
                          }}
                          maxLength={19}
                          disabled={isSubmitting}
                        />

                        {showCountryDropdown && (
                          <div className="absolute left-0 bottom-[105%] w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto text-left">
                            {Object.entries(countryDialCodes).map(
                              ([code, dial]) => (
                                <button
                                  key={code}
                                  type="button"
                                  onClick={() => {
                                    setShowCountryDropdown(false);
                                    setSelectedCountry(code);
                                    setFormData({ ...formData, phone: "" });
                                  }}
                                  className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center gap-3 transition-colors text-white font-bold text-sm"
                                >
                                  <span className="text-xl">
                                    {getFlagEmoji(code)}
                                  </span>
                                  <span className="flex-1">
                                    {code === "UA"
                                      ? "Україна"
                                      : code === "PL"
                                        ? "Польща"
                                        : code === "DE"
                                          ? "Німеччина"
                                          : code === "RO"
                                            ? "Румунія"
                                            : code}
                                  </span>
                                  <span className="text-gray-400 text-xs font-semibold">
                                    +{dial}
                                  </span>
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type="email"
                        placeholder="Ваш e-mail*"
                        className="input-glass py-4 text-lg w-full disabled:opacity-50"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
      {currentStepData.cta && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 px-6 pb-12 backdrop-blur-[2px]">
          <ShimmerButton onClick={handleNextClick} disabled={isButtonDisabled}>
            {isSubmitting ? "Надсилаємо заявку..." : currentStepData.cta}
          </ShimmerButton>
        </div>
      )}
    </>
  );
};

export default Quiz;
