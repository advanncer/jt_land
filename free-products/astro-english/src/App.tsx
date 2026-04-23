import { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Share2,
  Star,
  Loader2,
  RefreshCw,
  Flame,
  Send,
  Instagram,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ZODIAC_SIGNS, QUESTIONS } from "./constants";
import { ZodiacSign, QuizResult } from "./types";
import { getAstroResult } from "./services/resultService";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";
const N8N_WEBHOOK_URL =
  "https://n8n.justschool.me/webhook/626983b2-94fe-4277-91fb-123aa3f6370d";

const formatPhoneNumber = (value: string) => {
  const input = value.replace(/\D/g, "").substring(0, 12);
  let numbers = input;
  if (!numbers.startsWith("380") && numbers.length > 0) {
    if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
    else numbers = "380" + numbers;
  }
  numbers = numbers.substring(0, 12);
  let char: any = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
  let formatted = "";
  for (let i = 0; i < numbers.length; i++) {
    if (char[i]) formatted += char[i];
    formatted += numbers[i];
  }
  return formatted;
};

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function App() {
  const [step, setStep] = useState<
    "hero" | "zodiac" | "quiz" | "loading" | "result" | "lead"
  >("hero");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    "Аналізуємо твій зірковий шлях...",
  );
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [geo, setGeo] = useState<string>("Unknown");
  const [utmData, setUtmData] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmData({
      utm_campaign: params.get("utm_campaign") || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
    });
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => setGeo(`${d.country_name}/${d.city}`))
      .catch(() => {});
  }, []);

  const processResultAction = async () => {
    if (!selectedZodiac) return;
    setStep("loading");
    setLoadingProgress(0);

    const texts = [
      "Аналізуємо твій зірковий шлях...",
      "Поки ти чекаєш, 500 учнів JustSchool вже вивчили по 10 нових слів 🚀",
      "Зіставляємо твій ретроградний Меркурій з рівнем Grammar...",
      "Розраховуємо персональну стратегію на 16 тижнів...",
      "Майже готово! Твій мовний діагноз формується...",
    ];

    let t = 0;
    const tInt = setInterval(() => {
      t = (t + 1) % texts.length;
      setLoadingText(texts[t]);
    }, 1000);

    const pInt = setInterval(() => {
      setLoadingProgress((p) => (p < 100 ? p + 1 : 100));
    }, 50);

    try {
      const data = await getAstroResult(selectedZodiac, answers);

      const payload = {
        Name: leadName,
        Phone: leadPhone ? `'+${leadPhone.replace(/\D/g, "")}` : "",
        Email: leadEmail,
        Zodiac: selectedZodiac,
        Persona: data.persona,
        Answear: Object.entries(answers)
          .map(([q, a]) => `${q}: ${a}`)
          .join(" | "),
        Geo: geo,
        ...utmData,
        URL: window.location.href,
        Lead_type: "Astro_English_Quiz",
      };

      fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
      const qp = new URLSearchParams(payload as any).toString();
      fetch(`${GOOGLE_SHEETS_WEBHOOK_URL}?${qp}`, {
        method: "GET",
        mode: "no-cors",
      }).catch(() => {});

      if (window.fbq) {
        try {
          window.fbq("track", "Lead");
        } catch (e) {}
      }

      await new Promise((res) => setTimeout(res, 5000));

      clearInterval(tInt);
      clearInterval(pInt);
      setResult(data);
      setTimeout(() => {
        setStep("result");
        window.scrollTo(0, 0);
      }, 100);
    } catch (e) {
      clearInterval(tInt);
      clearInterval(pInt);
      setStep("hero");
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone.replace(/\D/g, "").length === 12) {
      processResultAction();
    }
  };

  const shareToPlatform = (platform: string) => {
    const title = 'Хто твоє "Мовне Альтер-Его"?';
    const text = `${title}\n\nМій тип: ${result?.persona}! Дізнайся свій:`;
    const url = window.location.origin + window.location.pathname;

    if (platform === "telegram") {
      window.open("https://t.me/+tefTRl_Ff8hkMzNi", "_blank");
    } else if (platform === "instagram") {
      window.open("https://www.instagram.com/just_school_ua/", "_blank");
    } else if (platform === "tiktok") {
      // TikTok doesn't have a direct "profile" URL provided, so we keep Web Share or alert
      if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Текст та посилання скопійовано!");
      }
    }
  };

  const renderContent = () => {
    switch (step) {
      case "hero":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
            <span className="text-just-orange font-mono text-[9px] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">
              Безкоштовний психологічний тест від JustSchool
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight uppercase text-white">
              Хто твоє{" "}
              <span className="text-just-orange">"Мовне Альтер-Его"</span>?
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Твій знак зодіаку визначає стиль спілкування. Дізнайся правду та
              отримай персональний план на 16 тижнів.
            </p>
            <button
              onClick={() => setStep("zodiac")}
              className="bg-just-orange px-10 py-5 rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3 text-white uppercase tracking-widest"
            >
              Оберіть свій знак <ChevronRight />
            </button>
          </div>
        );
      case "zodiac":
        return (
          <div className="py-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-2 text-white uppercase tracking-tight">
              Обери свій знак
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Зірки знають про твій English все. Готуйся до правди
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {ZODIAC_SIGNS.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    setSelectedZodiac(z.id);
                    setStep("quiz");
                  }}
                  className="bg-white/5 p-5 md:p-10 rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/5 hover:bg-white/10 active:border-orange-500/50 transition-all aspect-square"
                >
                  <span className="text-5xl md:text-7xl leading-none">
                    {z.icon}
                  </span>
                  <span className="font-bold text-[10px] md:text-base uppercase tracking-widest leading-none text-white/80">
                    {z.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case "quiz":
        return (
          <div className="flex-1 flex flex-col py-10 max-w-xl mx-auto w-full px-4 justify-center text-center">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setStep("zodiac")}
                className="text-gray-500 flex items-center gap-1 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Назад
              </button>
              <span className="text-just-orange font-mono font-bold">
                {currentQuestionIndex + 1}/{QUESTIONS.length}
              </span>
            </div>
            <div className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div
                className="absolute top-0 left-0 h-1 bg-just-orange transition-all duration-300 shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                style={{
                  width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
                }}
              />
              <h3 className="text-2xl font-bold mb-8 leading-tight text-white">
                {QUESTIONS[currentQuestionIndex].question}
              </h3>
              <div className="space-y-3">
                {QUESTIONS[currentQuestionIndex].options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      const questionId = QUESTIONS[currentQuestionIndex].id;
                      setAnswers((prev) => ({
                        ...prev,
                        [questionId]: o.value,
                      }));
                      if (currentQuestionIndex < QUESTIONS.length - 1)
                        setCurrentQuestionIndex((prev) => prev + 1);
                      else setStep("lead");
                    }}
                    className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/50 hover:bg-white/10 transition-all flex justify-between items-center group active:scale-[0.98]"
                  >
                    <span className="text-base md:text-lg text-white/90">
                      {o.label}
                    </span>{" "}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 text-just-orange transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "loading":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
            <Loader2 className="w-16 h-16 text-just-orange animate-spin mb-8" />
            <div className="h-24 flex items-center justify-center">
              <h2 className="text-xl md:text-3xl font-bold leading-tight max-w-md text-white">
                {loadingText}
              </h2>
            </div>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mt-6 border border-white/5">
              <div
                className="h-full bg-just-orange transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-just-orange font-mono font-bold mt-4">
              {loadingProgress}%
            </span>
          </div>
        );
      case "lead":
        return (
          <div className="flex-1 flex flex-col items-center justify-center py-10 w-full max-w-md mx-auto px-4">
            <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 text-center w-full backdrop-blur-3xl shadow-2xl">
              <Sparkles className="w-12 h-12 text-just-orange mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight text-white leading-none">
                Майже готово!
              </h2>
              <p className="text-gray-400 mb-8 text-sm">
                Залиш контакти, щоб отримати свій зірковий розбір
              </p>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ім'я"
                  required
                  className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-orange-500 text-white transition-all"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="+380 (XX) XXX-XX-XX"
                  required
                  className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-orange-500 text-white transition-all"
                  value={leadPhone}
                  onChange={(e) =>
                    setLeadPhone(formatPhoneNumber(e.target.value))
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-orange-500 text-white transition-all"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={leadPhone.replace(/\D/g, "").length !== 12}
                  className="w-full p-5 bg-just-orange rounded-2xl font-bold text-xl active:scale-95 transition-all shadow-lg shadow-orange-600/30 disabled:opacity-30 uppercase tracking-widest text-white"
                >
                  Дізнатися тип
                </button>
              </form>
            </div>
          </div>
        );
      case "result":
        if (!result) return null;
        return (
          <div className="w-full flex flex-col py-8 px-4 pb-40 items-center">
            <div className="text-center mb-10 w-full">
              <span className="text-just-yellow font-mono text-[10px] tracking-[0.4em] uppercase">
                Astro-English Identity
              </span>
              <h2 className="text-4xl md:text-7xl font-bold uppercase mt-2 leading-tight tracking-tighter text-white">
                {result.persona}
              </h2>
            </div>

            <div className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] border border-white/10 mb-12 backdrop-blur-3xl shadow-2xl w-full">
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                  <Star className="text-purple-500" size={20} />
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase leading-none mb-1">
                      Управитель
                    </div>
                    <div className="font-bold text-sm md:text-base leading-none text-white">
                      {selectedZodiac &&
                        ZODIAC_SIGNS.find((z) => z.id === selectedZodiac)
                          ?.ruler}
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                  <Flame className="text-orange-500" size={20} />
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase leading-none mb-1 text-white/50">
                      Стихія
                    </div>
                    <div className="font-bold text-sm md:text-base leading-none text-white">
                      {selectedZodiac &&
                        ZODIAC_SIGNS.find((z) => z.id === selectedZodiac)
                          ?.element}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 text-left">
                <div className="border-l-4 border-just-orange pl-6 py-1">
                  <p className="text-just-orange font-bold italic text-xl leading-snug">
                    «{result.motto}»
                  </p>
                </div>
                <p className="text-base md:text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {result.roast}
                </p>

                <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                      <CheckCircle2 size={16} /> Сильні сторони:
                    </div>
                    <p className="text-gray-400 text-sm italic leading-relaxed">
                      {result.audit.strengths}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-400 font-bold uppercase text-[10px] tracking-widest">
                      <AlertCircle size={16} /> Слабкі сторони:
                    </div>
                    <p className="text-gray-400 text-sm italic leading-relaxed">
                      {result.audit.weaknesses}
                    </p>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 text-left">
                  <h4 className="flex items-center gap-2 text-just-yellow font-bold text-lg mb-6 leading-none uppercase tracking-widest">
                    <Sparkles size={20} /> План навчання
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {result.advice}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-12 mb-20 w-full px-4">
              <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => shareToPlatform("telegram")}
                    className="aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 active:bg-[#229ED9]/20 transition-all group hover:bg-white/10"
                  >
                    <Send
                      className="text-[#229ED9] group-hover:scale-110 transition-transform"
                      size={24}
                    />
                    <span className="text-[10px] font-bold opacity-50 uppercase text-white">
                      TG
                    </span>
                  </button>
                  <button
                    onClick={() => shareToPlatform("instagram")}
                    className="aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 active:bg-[#E4405F]/20 transition-all group hover:bg-white/10"
                  >
                    <Instagram
                      className="text-[#E4405F] group-hover:scale-110 transition-transform"
                      size={24}
                    />
                    <span className="text-[10px] font-bold opacity-50 uppercase text-white leading-none mt-1">
                      IG
                    </span>
                  </button>
                  <button
                    onClick={() => shareToPlatform("tiktok")}
                    className="aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 active:bg-white/10 transition-all group hover:bg-white/10"
                  >
                    <div className="text-white group-hover:scale-110 transition-transform flex items-center justify-center">
                      <TikTokIcon size={24} />
                    </div>
                    <span className="text-[10px] font-bold opacity-50 uppercase text-white leading-none mt-1">
                      TikTok
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setStep("hero");
                    setSelectedZodiac(null);
                    setResult(null);
                    setCurrentQuestionIndex(0);
                  }}
                  className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 hover:bg-white/10 transition-all uppercase tracking-widest text-white"
                >
                  Пройти ще раз
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-orange-900/10 opacity-50" />
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-600/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col p-4 md:p-6 items-center">
        {renderContent()}
      </main>

      <style>{`
        .text-glow-orange { text-shadow: 0 0 10px rgba(255, 107, 0, 0.4); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
