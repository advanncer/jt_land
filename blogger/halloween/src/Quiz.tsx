import React, { useState } from 'react';
import { QuizQuestion, StepOption } from './data';
import PhoneInput from './PhoneInput';
import { CuteGhost, FlyingBat, WitchCauldron, WitchHat } from './HalloweenDecor';

interface QuizProps {
  currentQuestion: QuizQuestion;
  onAnswer: (answer: string | string[], nextStepNumber?: number) => void;
  answers: Record<number, string[]>;
  geoCountry: string;
  isSubmitting: boolean;
  onSubmitForm: (formData: { name: string; phone: string; email: string }) => void;
  selectedCourseName?: string;
}

export default function Quiz({
  currentQuestion,
  onAnswer,
  answers,
  geoCountry,
  isSubmitting,
  onSubmitForm,
  selectedCourseName = 'обраний курс',
}: QuizProps) {
  // Multiselect state for current step
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>(() => {
    return answers[currentQuestion.step] || [];
  });

  // Text input state (for child's name in step 21)
  const [textInputVal, setTextInputVal] = useState<string>(() => {
    return answers[currentQuestion.step]?.[0] || '';
  });

  // Form step state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  // Reset or initialize state when question changes
  React.useEffect(() => {
    setMultiSelectValues(answers[currentQuestion.step] || []);
    setTextInputVal(answers[currentQuestion.step]?.[0] || '');
  }, [currentQuestion.step]);

  // Handle single choice option
  const handleSingleOptionClick = (opt: StepOption) => {
    const next = opt.nextStep || currentQuestion.nextStepDefault;
    onAnswer(opt.text, next);
  };

  // Handle multiselect toggle
  const toggleMultiSelect = (val: string) => {
    setMultiSelectValues((prev) => {
      if (prev.includes(val)) {
        return prev.filter((item) => item !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  // Submit multiselect
  const handleMultiSubmit = () => {
    const next = currentQuestion.nextStepDefault;
    onAnswer(multiSelectValues, next);
  };

  // Submit text input
  const handleTextInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInputVal.trim()) return;
    const next = currentQuestion.nextStepDefault;
    onAnswer(textInputVal.trim(), next);
  };

  // Submit Final Form
  const handleFinalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors: { name?: string; phone?: string; email?: string } = {};

    if (!formName.trim()) {
      errors.name = "Будь ласка, вкажіть ваше ім'я";
    }

    if (!rawPhone || !isPhoneValid) {
      errors.phone = "Введіть дійсний номер телефону";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail.trim())) {
      errors.email = "Введіть коректну електронну адресу";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onSubmitForm({
      name: formName.trim(),
      phone: rawPhone,
      email: formEmail.trim(),
    });
  };

  // -------------------------------------------------------------
  // RENDER: Final Lead Form (Step 32)
  // -------------------------------------------------------------
  if (currentQuestion.form) {
    return (
      <div className="w-full flex flex-col items-center animate-fadeIn">
        {/* Halloween Cauldron Visual Card */}
        <div className="w-full mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#1b0c2c]/90 via-[#141a27]/90 to-[#0b1d12]/90 border border-[#8ee53f]/30 shadow-[0_0_30px_rgba(142,229,63,0.15)] flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8ee53f]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#ff7a00]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex-shrink-0 animate-bat">
            <WitchCauldron />
          </div>

          <div className="relative z-10 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7a00]/20 border border-[#ff7a00]/40 text-[#ff9e3b] text-xs font-bold uppercase tracking-wider mb-2">
              <span>🎃 Хелловін спецпропозиція</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Знижка до <span className="text-[#8ee53f] font-halloween text-2xl sm:text-3xl">-50%</span> закріплена!
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Залиште контакти, щоб отримати промокод на <strong className="text-white">{selectedCourseName}</strong> та доступ до першого уроку.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleFinalFormSubmit} className="w-full space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1.5">
              Ваше ім'я <span className="text-[#ff7a00]">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
              }}
              disabled={isSubmitting}
              placeholder="Наприклад: Олена"
              className={`w-full px-5 py-4 rounded-2xl bg-[#131926]/90 border text-white placeholder-white/40 text-base md:text-lg focus:outline-none transition-all ${
                formErrors.name
                  ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20'
                  : 'border-white/10 hover:border-[#8ee53f]/50 focus:border-[#8ee53f] focus:ring-2 focus:ring-[#8ee53f]/30'
              } disabled:opacity-50`}
            />
            {formErrors.name && (
              <p className="text-red-400 text-xs mt-1.5 pl-2">{formErrors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1.5">
              Номер телефону <span className="text-[#ff7a00]">*</span>
            </label>
            <PhoneInput
              value={formPhone}
              onChange={(formatted, raw, isValid) => {
                setFormPhone(formatted);
                setRawPhone(raw);
                setIsPhoneValid(isValid);
                if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              disabled={isSubmitting}
              defaultCountry={geoCountry}
            />
            {formErrors.phone && (
              <p className="text-red-400 text-xs mt-1.5 pl-2">{formErrors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1.5">
              Ваш E-mail <span className="text-[#ff7a00]">*</span>
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => {
                setFormEmail(e.target.value);
                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={isSubmitting}
              placeholder="name@gmail.com"
              className={`w-full px-5 py-4 rounded-2xl bg-[#131926]/90 border text-white placeholder-white/40 text-base md:text-lg focus:outline-none transition-all ${
                formErrors.email
                  ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20'
                  : 'border-white/10 hover:border-[#8ee53f]/50 focus:border-[#8ee53f] focus:ring-2 focus:ring-[#8ee53f]/30'
              } disabled:opacity-50`}
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs mt-1.5 pl-2">{formErrors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a00] via-[#ff9214] to-[#8ee53f] hover:from-[#ff6a00] hover:to-[#78cc2d] text-[#0b0e14] font-extrabold text-base sm:text-lg tracking-wide uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_25px_rgba(255,122,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#0b0e14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Надсилаємо заявку...</span>
              </>
            ) : (
              <>
                <span>Отримати знижку до -50% →</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-white/50 pt-2 flex items-center justify-center gap-1.5">
            <span>🔒</span> Ваші дані в безпеці. Ми зв'яжемось для надання знижки та доступу.
          </p>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Word Test Grid (Step 5 - Adult English)
  // -------------------------------------------------------------
  if (currentQuestion.grid && currentQuestion.answers) {
    const totalCount = currentQuestion.answers.length;
    const selectedCount = multiSelectValues.length;

    return (
      <div className="w-full flex flex-col items-center animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight mb-2">
          {currentQuestion.question}
        </h2>
        {currentQuestion.description && (
          <p className="text-white/70 text-sm sm:text-base text-center mb-5 max-w-md">
            {currentQuestion.description}
          </p>
        )}

        {/* Counter Badge */}
        <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b2333] border border-[#8ee53f]/40 text-[#8ee53f] font-bold text-sm shadow-[0_0_15px_rgba(142,229,63,0.2)]">
          <span>🎃 Обрано слів:</span>
          <span className="text-white">{selectedCount} з {totalCount}</span>
        </div>

        {/* Words Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {currentQuestion.answers.map((item) => {
            const isChecked = multiSelectValues.includes(item.text);
            return (
              <button
                key={item.text}
                type="button"
                onClick={() => toggleMultiSelect(item.text)}
                className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all duration-200 text-center flex items-center justify-between gap-1.5 select-none ${
                  isChecked
                    ? 'bg-[#8ee53f]/20 border-[#8ee53f] text-[#8ee53f] shadow-[0_0_12px_rgba(142,229,63,0.3)] scale-[1.02]'
                    : 'bg-[#131926]/80 border-white/10 text-white/80 hover:border-white/30 hover:bg-[#1a2233]'
                }`}
              >
                <span className="truncate">{item.text}</span>
                <span className={`w-4 h-4 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${
                  isChecked ? 'bg-[#8ee53f] text-[#0b0e14] font-bold' : 'border border-white/30'
                }`}>
                  {isChecked ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleMultiSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-[#8ee53f] text-[#0b0e14] font-extrabold text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_20px_rgba(255,122,0,0.35)]"
        >
          {currentQuestion.cta || 'Далі →'}
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Multiselect Checkboxes (Steps 13, 20, 29)
  // -------------------------------------------------------------
  if (currentQuestion.multiselect && currentQuestion.answers) {
    return (
      <div className="w-full flex flex-col items-center animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight mb-2">
          {currentQuestion.question}
        </h2>
        {currentQuestion.description && (
          <p className="text-white/70 text-sm sm:text-base text-center mb-6 max-w-md">
            {currentQuestion.description}
          </p>
        )}

        <div className="w-full space-y-3 mb-6">
          {currentQuestion.answers.map((opt) => {
            const isChecked = multiSelectValues.includes(opt.text);
            return (
              <button
                key={opt.text}
                type="button"
                onClick={() => toggleMultiSelect(opt.text)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 select-none ${
                  isChecked
                    ? 'bg-gradient-to-r from-[#8ee53f]/15 to-[#131926] border-[#8ee53f] shadow-[0_0_20px_rgba(142,229,63,0.25)]'
                    : 'bg-[#131926]/90 border-white/10 hover:border-white/30 hover:bg-[#1a2233]'
                }`}
              >
                <span className="text-base sm:text-lg font-medium text-white">{opt.text}</span>
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm transition-all ${
                    isChecked
                      ? 'bg-[#8ee53f] text-[#0b0e14] font-bold shadow-[0_0_10px_rgba(142,229,63,0.6)]'
                      : 'border border-white/30 bg-black/30'
                  }`}
                >
                  {isChecked ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleMultiSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-[#8ee53f] text-[#0b0e14] font-extrabold text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_20px_rgba(255,122,0,0.35)]"
        >
          {currentQuestion.cta || 'Далі →'}
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Text Input (Step 21 - Child's Name)
  // -------------------------------------------------------------
  if (currentQuestion.isInput) {
    return (
      <div className="w-full flex flex-col items-center animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight mb-2">
          {currentQuestion.question}
        </h2>
        {currentQuestion.description && (
          <p className="text-white/70 text-sm sm:text-base text-center mb-6 max-w-md">
            {currentQuestion.description}
          </p>
        )}

        <form onSubmit={handleTextInputSubmit} className="w-full space-y-4">
          <input
            type="text"
            value={textInputVal}
            onChange={(e) => setTextInputVal(e.target.value)}
            placeholder={currentQuestion.inputPlaceholder || "Введіть вашу відповідь"}
            autoFocus
            className="w-full px-5 py-4 rounded-2xl bg-[#131926]/90 border border-white/10 hover:border-[#8ee53f]/50 focus:border-[#8ee53f] focus:ring-2 focus:ring-[#8ee53f]/30 text-white placeholder-white/40 text-base md:text-lg focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!textInputVal.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-[#8ee53f] text-[#0b0e14] font-extrabold text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_20px_rgba(255,122,0,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQuestion.cta || 'Далі →'}
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Single Choice Cards (Default)
  // -------------------------------------------------------------
  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {/* Question Header */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight mb-2">
        {currentQuestion.question}
      </h2>
      {currentQuestion.description && (
        <p className="text-white/70 text-sm sm:text-base text-center mb-6 max-w-md">
          {currentQuestion.description}
        </p>
      )}

      {/* Answer Options */}
      <div className="w-full space-y-3">
        {currentQuestion.answers?.map((opt) => (
          <button
            key={opt.text}
            type="button"
            onClick={() => handleSingleOptionClick(opt)}
            className="w-full p-4 sm:p-5 rounded-2xl bg-[#131926]/90 border border-white/10 hover:border-[#8ee53f] hover:bg-gradient-to-r hover:from-[#1b2333] hover:to-[#1a2e1d] text-left flex items-center justify-between gap-3 transition-all duration-200 transform hover:scale-[1.015] active:scale-[0.99] shadow-md group select-none"
          >
            <span className="text-base sm:text-lg font-medium text-white group-hover:text-[#8ee53f] transition-colors">
              {opt.text}
            </span>

            <div className="flex items-center gap-2 flex-shrink-0">
              {opt.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff7a00]/20 border border-[#ff7a00]/40 text-[#ff9e3b] text-xs font-semibold">
                  {opt.badge}
                </span>
              )}
              <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#8ee53f] group-hover:text-[#0b0e14] flex items-center justify-center text-white/50 text-sm transition-colors">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
