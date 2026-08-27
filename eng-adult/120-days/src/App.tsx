import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, Star, Play, ChevronRight, CheckCircle2 } from "lucide-react";

const countryDialCodes: Record<string, string> = {
  UA: "380",
  PL: "48",
  DE: "49",
  RO: "40",
  SK: "421",
  CZ: "420",
  GB: "44",
  US: "1",
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

  if (numbers.startsWith("0") && dialCode === "380") {
    numbers = "380" + numbers.substring(1);
  } else if (numbers.startsWith("0") && dialCode === "48") {
    numbers = "48" + numbers.substring(1);
  } else if (!numbers.startsWith(dialCode)) {
    numbers = dialCode + numbers;
  }

  if (numbers.startsWith("380")) {
    numbers = numbers.substring(0, 12);
    const char = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      // @ts-expect-error
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
    }
    return formatted;
  } else if (numbers.startsWith("48") || numbers.startsWith("1")) {
    numbers = numbers.substring(0, 11);
    const char = numbers.startsWith("48") ? { 0: "+", 2: " (", 5: ") ", 8: "-" } : { 0: "+", 1: " (", 4: ") ", 7: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      // @ts-expect-error
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

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipInfo, setIpInfo] = useState<{ ip?: string; country?: string }>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const activeCountryCode = selectedCountry || ipInfo.country || "UA";


  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('leadType')) {
        url.searchParams.set('leadType', 'english-for-adults');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((data) => setIpInfo(data))
      .catch((err) => console.error("IP info error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    const ipString = `ip:${ipInfo.ip || "unknown"}|country:${ipInfo.country || "unknown"}`;

    const payload = {
      name,
      phone,
      email,
      qa: `${ipString}|||120 Days Adult Form Submission`,
      dialogueName: "120 Days Adult JS",
      dialogueId: "unknown",
      dialogueUrl: window.location.href,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_term: urlParams.get("utm_term"),
      utm_content: urlParams.get("utm_content"),
      utm_subject: "English Adult 120 Days JS",
    };

    try {
      if ((window as any).fbq) (window as any).fbq("track", "Lead");
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const dl = (window as any).dataLayer || [];
        (window as any).dataLayer = dl;
        dl.push({ event: "form_success", form_name: "eng-adult-120-days" });
        const result = await response.json();
        window.location.href = result.redirectUri || "https://justschool.me/uk/onboarding";
      } else {
        window.location.href = "https://justschool.me/uk/onboarding";
      }
    } catch (error) {
      window.location.href = "https://justschool.me/uk/onboarding";
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans flex flex-col items-center overflow-x-hidden relative selection:bg-orange-100">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/10 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2F80ED]/10 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-multiply"></div>

      <header className="w-full max-w-5xl px-4 py-4 flex justify-between items-center relative z-10">
        <button className="text-slate-600 hover:text-slate-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
           <span className="font-black text-xl tracking-tighter">JustSchool</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-sm text-slate-700">
          UA <ChevronDown size={16} />
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center relative z-10 px-4 pb-20">
        
        {/* HERO */}
        <section className="mt-8 md:mt-16 flex flex-col items-center text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 max-w-4xl">
            120 днів до нового рівня <br/>
            <span className="text-[var(--primary)]">Навчання без прокрастинації</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mb-8">
            Флагманський формат АнтиШколи. Результат запланований наперед.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 font-bold text-slate-800 shadow-sm border border-white/50">
              10 Років в освіті
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 font-bold text-slate-800 shadow-sm border border-white/50">
              100 000+ Студентів
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 font-bold text-[var(--primary)] shadow-sm border border-[var(--primary)]/20">
              Флагманський формат
            </div>
          </div>

          {/* Form Block */}
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] to-orange-300"></div>
            <h2 className="text-2xl font-black text-center mb-2">Отримайте безкоштовний демо-урок</h2>
            <p className="text-slate-500 text-center text-sm mb-6 font-medium">та персональний план розвитку</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text"
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all disabled:opacity-50"
              />
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 border-r border-slate-200 gap-1.5 cursor-pointer z-10"
                >
                  <span className="text-xl">{getFlagEmoji(activeCountryCode)}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>
                <input 
                  type="tel"
                  placeholder="+380 (XX) XXX-XX-XX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length < phone.length) { setPhone(val); return; }
                    setPhone(formatPhoneNumber(val, activeCountryCode));
                  }}
                  onFocus={() => {
                    const dial = countryDialCodes[activeCountryCode.toUpperCase()] || "380";
                    const prefix = dial === "380" ? "+380 (" : dial === "48" ? "+48 (" : dial === "1" ? "+1 (" : `+${dial} `;
                    if (!phone) setPhone(prefix);
                  }}
                  onBlur={() => {
                    const dial = countryDialCodes[activeCountryCode.toUpperCase()] || "380";
                    const prefix = dial === "380" ? "+380 (" : dial === "48" ? "+48 (" : dial === "1" ? "+1 (" : `+${dial} `;
                    if (phone === prefix || phone === `+${dial}` || phone === "+" || phone === `+${dial} `) setPhone("");
                  }}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F3F4F6] rounded-xl pl-[88px] pr-5 py-4 font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all disabled:opacity-50"
                />
                {showCountryDropdown && (
                  <div className="absolute left-0 top-[105%] w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto text-left">
                    {Object.entries(countryDialCodes).map(([code, dial]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setShowCountryDropdown(false);
                          setSelectedCountry(code);
                          setPhone("");
                        }}
                        className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors text-slate-800 font-bold text-sm"
                      >
                        <span className="text-xl">{getFlagEmoji(code)}</span>
                        <span className="flex-1 text-left">{code}</span>
                        <span className="text-slate-400 text-xs font-semibold">+{dial}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input 
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-[var(--primary)]/30 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Надсилаємо заявку..." : "Спробувати безкоштовно"}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Натискаючи «Спробувати безкоштовно» ви приймаєте згоду на обробку персональних даних
              </p>
            </form>
          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <section className="mt-24 w-full flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-6 max-w-2xl">
            Що таке «120 днів — новий рівень»?
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-3xl mb-12">
            Це формат навчання, де результат запланований наперед. Для нас результат — це не факт навчання, а конкретна зміна. Фіксуємо прогрес, коригуємо темп, підсилюємо там, де потрібно.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
             {/* A1 */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
               <div className="bg-orange-100 text-[var(--primary)] font-black px-3 py-1 rounded-lg text-sm mb-4">A1</div>
               <h3 className="text-xl font-bold mb-2">Старт без страху</h3>
               <p className="text-sm text-slate-500 mb-4 flex-grow">Базовий курс, який знімає страх і формує фундамент для подальшого росту.</p>
               <div className="flex items-start gap-2">
                 <CheckCircle2 size={20} className="text-[var(--primary)] shrink-0 mt-0.5" />
                 <span className="text-sm font-medium">Present Simple / Continuous, базові запитання і заперечення</span>
               </div>
             </div>

             {/* A2 */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
               <div className="bg-orange-100 text-[var(--primary)] font-black px-3 py-1 rounded-lg text-sm mb-4">A2</div>
               <h3 className="text-xl font-bold mb-2">Впевнена база</h3>
               <p className="text-sm text-slate-500 mb-4 flex-grow">Курс для стабілізації бази та переходу від «знаю» до «користуюсь».</p>
               <div className="flex items-start gap-2">
                 <CheckCircle2 size={20} className="text-[var(--primary)] shrink-0 mt-0.5" />
                 <span className="text-sm font-medium">Всі базові часи, модальні дієслова, прості майбутні форми</span>
               </div>
             </div>

             {/* B1 */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
               <div className="bg-blue-100 text-[#2F80ED] font-black px-3 py-1 rounded-lg text-sm mb-4">B1</div>
               <h3 className="text-xl font-bold mb-2">Вхід у впевнену мову</h3>
               <p className="text-sm text-slate-500 mb-4 flex-grow">Навчання повністю адаптується під твої задачі. Робота, релокація, життя.</p>
               <div className="flex items-start gap-2">
                 <CheckCircle2 size={20} className="text-[#2F80ED] shrink-0 mt-0.5" />
                 <span className="text-sm font-medium">Умовні речення, пасивний стан, складні часові конструкції</span>
               </div>
             </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mt-24 w-full flex flex-col items-center bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <h2 className="text-3xl font-black text-center mb-10">Перевірено студентами</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="bg-[#F8FAFC] p-6 rounded-2xl">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-700">О</div>
                    <div>
                      <h4 className="font-bold">Олена</h4>
                      <p className="text-xs text-slate-500">старт A2</p>
                    </div>
                 </div>
                 <p className="text-sm font-medium italic text-slate-700">«Раніше я постійно починала і кидала. У цьому форматі вперше зʼявилось відчуття, що все вже продумано за мене. Я просто виконувала кроки — і дійшла до результату.»</p>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-2xl">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700">А</div>
                    <div>
                      <h4 className="font-bold">Андрій</h4>
                      <p className="text-xs text-slate-500">англійська для роботи</p>
                    </div>
                 </div>
                 <p className="text-sm font-medium italic text-slate-700">«Найсильніше — не уроки, а система. Ти не думаєш, що робити далі. Через 120 днів я реально почав говорити впевнено.»</p>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
};

export default App;
