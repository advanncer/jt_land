import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Share2,
  Star,
  Loader2,
  RefreshCw,
  Moon,
  Flame,
  Mountain,
  Wind,
  Droplets,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ZODIAC_SIGNS, QUESTIONS } from './constants';
import { ZodiacSign, QuizResult } from './types';
import { getAstroResult } from './services/resultService';

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";
const N8N_WEBHOOK_URL = "https://n8n.justschool.me/webhook/626983b2-94fe-4277-91fb-123aa3f6370d";

const formatPhoneNumber = (value: string) => {
    const input = value.replace(/\D/g, "").substring(0, 12);
    let numbers = input;
    if (numbers.startsWith("380")) {}
    else if (numbers.length > 0) {
        if (numbers.startsWith("0")) numbers = "380" + numbers.substring(1);
        else numbers = "380" + numbers;
    } else { return ""; }
    numbers = numbers.substring(0, 12);
    let char: any = { 0: "+", 3: " (", 5: ") ", 8: "-", 10: "-" };
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
        if (char[i]) formatted += char[i];
        formatted += numbers[i];
    }
    return formatted;
};

export default function App() {
  const [step, setStep] = useState<'hero' | 'zodiac' | 'quiz' | 'loading' | 'result' | 'lead'>('hero');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [geo, setGeo] = useState<string>("Unknown");
  const [utmData, setUtmData] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmData({
      utm_campaign: params.get("utm_campaign") || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
    });

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setGeo([data.country_name, data.city].filter(Boolean).join("/") || "Unknown"))
      .catch(() => setGeo(Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"));
  }, []);

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleZodiacSelect = (zodiac: ZodiacSign) => {
    setSelectedZodiac(zodiac);
    setStep('quiz');
  };

  const handleAnswer = (value: string) => {
    const questionId = QUESTIONS[currentQuestionIndex].id;
    setAnswers({ ...answers, [questionId]: value });

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('lead');
    }
  };

  const processResult = async () => {
    if (selectedZodiac) {
      try {
        const data = await getAstroResult(selectedZodiac, answers);
        setResult(data);
        
        const payload = {
          Name: leadName,
          Phone: leadPhone ? `'+${leadPhone.replace(/\D/g, '')}` : "",
          Email: leadEmail,
          Zodiac: selectedZodiac,
          Persona: data.persona,
          Answear: Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join(" | "),
          Geo: geo,
          ...utmData,
          URL: window.location.href,
          Lead_type: "Astro_English_Quiz"
        };

        // n8n
        fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(console.error);

        // Google Sheets (as GET query params)
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, val]) => {
          queryParams.append(key, String(val));
        });
        
        fetch(`${GOOGLE_SHEETS_WEBHOOK_URL}?${queryParams.toString()}`, {
          method: "GET",
          mode: "no-cors"
        }).catch(console.error);

        setStep('result');
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Failed", error);
        setStep('hero');
      }
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone.replace(/\D/g, "").length === 12 && leadEmail) {
      setStep('loading');
      processResult();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.length < leadPhone.length) { setLeadPhone(val); return; }
      setLeadPhone(formatPhoneNumber(val));
  };

  const shareToPlatform = (platform: 'telegram' | 'instagram' | 'tiktok') => {
    const text = `Мій мовний тип: ${result?.persona}! Дізнайся свій тип за посиланням: ${window.location.href}`;
    const url = encodeURIComponent(window.location.href);
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({ title: 'Моє Мовне Альтер-Его', text: text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Посилання скопійовано!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-x-hidden flex flex-col items-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-just-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-just-orange/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center p-4">
        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div className="mb-6">
                <span className="text-just-orange font-mono text-[8px] md:text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  Безкоштовний психологічний тест від JustSchool
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">Хто твоє <span className="text-just-orange text-glow-orange">"Мовне Альтер-Его"</span>?</h1>
              <p className="text-base md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed">Твій знак зодіаку визначає, як ти насправді розмовляєш англійською. Дізнайся свій прихований стиль спілкування та отримай персональний план навчання на 16 тижнів.</p>
              <button onClick={() => setStep('zodiac')} className="group relative px-10 py-5 bg-just-orange text-white font-bold rounded-full text-xl transition-all hover:scale-105 active:scale-95 neon-glow-orange shadow-lg shadow-just-orange/20">
                <span className="relative z-10 flex items-center gap-3">Оберіть свій знак <ChevronRight className="w-6 h-6" /></span>
              </button>
            </motion.div>
          )}

          {step === 'zodiac' && (
            <motion.div key="zodiac" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full flex flex-col py-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold mb-2">Обери свій знак</h2>
                <p className="text-white/50 text-sm">Зірки знають про твій English все. Готуйся до правди</p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                {ZODIAC_SIGNS.map((zodiac) => (
                  <motion.button key={zodiac.id} whileTap={{ scale: 0.95 }} onClick={() => handleZodiacSelect(zodiac.id)}
                    className="glass p-5 md:p-8 rounded-2xl flex flex-col items-center gap-4 transition-all hover:bg-white/10 border border-white/5 active:border-just-orange/50">
                    <span className="text-4xl md:text-6xl pointer-events-none">{zodiac.icon}</span>
                    <span className="font-bold text-xs md:text-base uppercase tracking-widest pointer-events-none">{zodiac.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full max-w-xl mx-auto flex flex-col py-10">
              <div className="mb-6 flex items-center justify-between">
                <button onClick={() => setStep('zodiac')} className="text-white/50 hover:text-white flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4" /> Назад</button>
                <div className="text-xs font-mono text-just-orange">{currentQuestionIndex + 1} / {QUESTIONS.length}</div>
              </div>
              <div className="glass p-8 rounded-3xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5"><motion.div className="h-full bg-just-orange" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
                <h3 className="text-2xl font-bold mb-8 leading-snug">{QUESTIONS[currentQuestionIndex].question}</h3>
                <div className="space-y-3">
                  {QUESTIONS[currentQuestionIndex].options.map((option) => (
                    <button key={option.value} onClick={() => handleAnswer(option.value)} className="w-full text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-just-orange/50 transition-all flex items-center justify-between group">
                      <span className="text-base md:text-lg">{option.label}</span>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 text-just-orange transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="mb-8 relative"><Loader2 className="w-20 h-20 text-just-orange animate-spin" /><div className="absolute inset-0 blur-xl bg-just-orange/20" /></div>
              <h2 className="text-3xl font-display font-bold mb-4">Аналізуємо твій шлях...</h2>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-4"><motion.div className="h-full bg-just-orange" initial={{ width: 0 }} animate={{ width: `${loadingProgress}%` }} /></div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col py-8 pb-32">
              <div className="text-center mb-8">
                <div className="text-just-yellow font-mono text-[10px] uppercase tracking-[0.4em] mb-2">ASTRO-ENGLISH IDENTITY</div>
                <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight leading-tight">{result.persona}</h2>
              </div>
              <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-white/10 mb-10 bg-white/5 backdrop-blur-2xl">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3"><Star className="text-just-purple w-5 h-5" /><div className="text-left"><div className="text-[9px] uppercase text-white/40 tracking-wider">Управитель</div><div className="text-sm font-bold">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.ruler}</div></div></div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3"><Flame className="text-just-orange w-5 h-5" /><div className="text-left"><div className="text-[9px] uppercase text-white/40 tracking-wider">Стихія</div><div className="text-sm font-bold">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element}</div></div></div>
                </div>
                <div className="space-y-8 text-left">
                  <div className="border-l-4 border-just-orange pl-5 py-1"><p className="text-just-orange font-bold italic text-lg leading-relaxed">«{result.motto}»</p></div>
                  <div className="text-white/90 text-base md:text-lg leading-relaxed whitespace-pre-wrap">{result.roast}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div><div className="flex items-center gap-2 text-just-blue font-bold text-xs uppercase tracking-widest mb-3"><CheckCircle2 className="w-4 h-4" /> Сильні сторони:</div><p className="text-sm text-white/60 italic leading-relaxed">{result.audit.strengths}</p></div>
                    <div><div className="flex items-center gap-2 text-just-orange font-bold text-xs uppercase tracking-widest mb-3"><AlertCircle className="w-4 h-4" /> Слабкі сторони:</div><p className="text-sm text-white/60 italic leading-relaxed">{result.audit.weaknesses}</p></div>
                  </div>
                  <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2 text-just-yellow font-bold text-base mb-4"><Sparkles className="w-5 h-5" /> План навчання на 16 тижнів:</div>
                    <div className="text-white/80 text-sm md:text-base space-y-4 whitespace-pre-wrap leading-relaxed">{result.advice}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-10 mb-20">
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src={result.imageUrl} alt={result.persona} className="w-full h-full object-cover" />
                </div>
                <div className="w-full max-w-md space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => shareToPlatform('telegram')} className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 border border-white/5 active:scale-95"><Send className="w-6 h-6 text-[#229ED9]" /> <span className="text-[10px] font-bold opacity-50">TG</span></button>
                    <button onClick={() => shareToPlatform('instagram')} className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 border border-white/5 active:scale-95"><MessageCircle className="w-6 h-6 text-[#E4405F]" /> <span className="text-[10px] font-bold opacity-50">IG</span></button>
                    <button onClick={() => shareToPlatform('tiktok')} className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 border border-white/5 active:scale-95"><Share2 className="w-6 h-6 text-[#00f2ea]" /> <span className="text-[10px] font-bold opacity-50">TIKTOK</span></button>
                  </div>
                  <button onClick={() => { setStep('hero'); setSelectedZodiac(null); }} className="w-full py-5 glass border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"><RefreshCw className="w-5 h-5" /> Пройти тест ще раз</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'lead' && (
            <motion.div key="lead" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-md mx-auto py-10">
              <div className="glass p-8 md:p-10 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl text-center">
                <Sparkles className="w-16 h-16 text-just-orange mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold mb-3">Майже готово! ✨</h2>
                <p className="text-white/50 text-sm mb-8">Залиш контакти, щоб отримати свій зірковий розбір</p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input type="text" placeholder="Твоє ім'я" required value={leadName} onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-white" />
                  <input type="tel" placeholder="+380 (XX) XXX-XX-XX" required value={leadPhone} onChange={handlePhoneChange} maxLength={19}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-white" />
                  <input type="email" placeholder="example@mail.com" required value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-white" />
                  <button type="submit" disabled={leadPhone.replace(/\D/g, "").length !== 12} className="w-full py-5 bg-just-orange text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-xl neon-glow-orange disabled:opacity-50 disabled:cursor-not-allowed">Дізнатися тип</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
