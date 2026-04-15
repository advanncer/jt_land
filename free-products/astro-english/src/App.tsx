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
  Instagram,
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

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V14.42a6.72 6.72 0 01-1.3 4.2 6.6 6.6 0 01-4.7 2.4c-1.3.12-2.67-.14-3.83-.8a6.53 6.53 0 01-3.23-4.22 6.64 6.64 0 014.24-7.54c.73-.25 1.5-.39 2.27-.42v4.05c-.42.01-.84.1-1.23.28a2.53 2.53 0 00-1.43 2.2c-.01.55.2 1.11.6 1.48.42.39.99.59 1.56.57a2.55 2.55 0 002.5-2.5V0z"/>
  </svg>
);

export default function App() {
  const [step, setStep] = useState<'hero' | 'zodiac' | 'quiz' | 'loading' | 'result' | 'lead'>('hero');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Аналізуємо твій зірковий шлях...');
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
    });
    fetch("https://ipapi.co/json/").then(r => r.json()).then(d => setGeo(`${d.country_name}/${d.city}`)).catch(() => {});
  }, []);

  const handleStart = () => setStep('zodiac');

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
    if (!selectedZodiac) return;
    setStep('loading');
    setLoadingProgress(0);

    // 1. Start intervals for text and progress
    const texts = [
      "Аналізуємо твій зірковий шлях...",
      "Поки ти чекаєш, 500 учнів JustSchool вже вивчили по 10 нових слів 🚀",
      "Зіставляємо твій ретроградний Меркурій з рівнем Grammar...",
      "Розраховуємо персональну стратегію на 16 тижнів...",
      "Майже готово! Твій мовний діагноз формується..."
    ];
    let textIdx = 0;
    const textInt = setInterval(() => {
      textIdx = (textIdx + 1) % texts.length;
      setLoadingText(texts[textIdx]);
    }, 1000);

    const progInt = setInterval(() => {
      setLoadingProgress(p => {
        if (p >= 100) return 100;
        return p + 1;
      });
    }, 45);

    try {
      // 2. Start Data fetching immediately
      const dataPromise = getAstroResult(selectedZodiac, answers);
      
      // 3. Submit lead data while loading
      const payload = {
        Name: leadName,
        Phone: leadPhone ? `'+${leadPhone.replace(/\D/g, '')}` : "",
        Email: leadEmail,
        Zodiac: selectedZodiac,
        Answear: Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join(" | "),
        Geo: geo,
        ...utmData,
        URL: window.location.href,
        Lead_type: "Astro_English_Quiz"
      };

      fetch(N8N_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(console.error);
      const qp = new URLSearchParams(payload as any).toString();
      fetch(`${GOOGLE_SHEETS_WEBHOOK_URL}?${qp}`, { method: "GET", mode: "no-cors" }).catch(console.error);

      // 4. Wait for both data AND minimum time (4.5s)
      const [data] = await Promise.all([
        dataPromise,
        new Promise(res => setTimeout(res, 5000))
      ]);
      
      // 5. Success! Clear intervals and set result
      clearInterval(textInt);
      clearInterval(progInt);
      setLoadingProgress(100);
      setResult(data);
      setStep('result');
      window.scrollTo(0, 0);

    } catch (e) {
      clearInterval(textInt);
      clearInterval(progInt);
      console.error("Critical error:", e);
      setStep('hero');
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone.replace(/\D/g, "").length === 12) {
      processResult();
    }
  };

  const shareToPlatform = (platform: string) => {
    const title = 'Хто твоє "Мовне Альтер-Его"?';
    const text = `${title}\n\nМій тип: ${result?.persona}! Дізнайся свій:`;
    const url = window.location.origin + window.location.pathname;
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Скопійовано!");
    }
  };

  const reset = () => {
    setStep('hero');
    setSelectedZodiac(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setLoadingProgress(0);
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-600/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col p-4 md:p-6">
        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
              <span className="text-just-orange font-mono text-[9px] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">Безкоштовний психологічний тест від JustSchool</span>
              <h1 className="text-4xl md:text-7xl font-bold mb-6">Хто твоє <span className="text-just-orange">"Мовне Альтер-Его"</span>?</h1>
              <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl">Твій знак зодіаку визначає стиль спілкування. Дізнайся правду та отримай персональний план на 16 тижнів.</p>
              <button onClick={handleStart} className="bg-just-orange px-10 py-5 rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3">Оберіть свій знак <ChevronRight /></button>
            </motion.div>
          )}

          {step === 'zodiac' && (
            <motion.div key="zodiac" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
              <h2 className="text-3xl font-bold text-center mb-2">Обери свій знак</h2>
              <p className="text-center text-gray-500 mb-8 text-sm">Зірки знають про твій English все</p>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                {ZODIAC_SIGNS.map(z => (
                  <button key={z.id} onClick={() => handleZodiacSelect(z.id)} className="bg-white/5 p-4 md:p-8 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:bg-white/10 active:border-orange-500/50 transition-all">
                    <span className="text-4xl md:text-6xl">{z.icon}</span>
                    <span className="font-bold text-xs md:text-base uppercase tracking-widest">{z.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col py-10 max-w-xl mx-auto w-full px-4">
               <div className="flex justify-between items-center mb-6">
                 <button onClick={() => setStep('zodiac')} className="text-gray-500 flex items-center gap-1"><ArrowLeft size={16}/> Назад</button>
                 <span className="text-just-orange font-mono">{currentQuestionIndex+1}/{QUESTIONS.length}</span>
               </div>
               <div className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
                 <div className="absolute top-0 left-0 h-1 bg-just-orange transition-all duration-300" style={{width: `${((currentQuestionIndex+1)/QUESTIONS.length)*100}%`}} />
                 <h3 className="text-2xl font-bold mb-8">{QUESTIONS[currentQuestionIndex].question}</h3>
                 <div className="space-y-3">
                   {QUESTIONS[currentQuestionIndex].options.map(o => (
                     <button key={o.value} onClick={() => handleAnswer(o.value)} className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/50 transition-all flex justify-between items-center group">
                       <span className="text-base md:text-lg">{o.label}</span> <ChevronRight className="opacity-0 group-hover:opacity-100 text-just-orange transition-all"/>
                     </button>
                   ))}
                 </div>
               </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
              <Loader2 className="w-16 h-16 text-just-orange animate-spin mb-8" />
              <h2 className="text-xl md:text-3xl font-bold mb-6 h-20 flex items-center justify-center">{loadingText}</h2>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full bg-just-orange" initial={{ width: 0 }} animate={{ width: `${loadingProgress}%` }} transition={{ ease: "linear" }} />
              </div>
              <span className="text-just-orange font-mono font-bold">{loadingProgress}%</span>
            </motion.div>
          )}

          {step === 'lead' && (
            <motion.div key="lead" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center py-10 w-full max-w-md mx-auto px-4">
              <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 text-center w-full backdrop-blur-3xl shadow-2xl">
                <Sparkles className="w-12 h-12 text-just-orange mx-auto mb-6"/>
                <h2 className="text-3xl font-bold mb-2">Майже готово!</h2>
                <p className="text-gray-400 mb-8 text-sm px-4">Залиш контакти, щоб отримати свій зірковий розбір</p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input type="text" placeholder="Ім'я" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-orange-500 text-white" value={leadName} onChange={e => setLeadName(e.target.value)} />
                  <input type="tel" placeholder="+380 (XX) XXX-XX-XX" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-orange-500 text-white" value={leadPhone} onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} />
                  <input type="email" placeholder="Email" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-orange-500 text-white" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                  <button type="submit" disabled={leadPhone.replace(/\D/g,'').length!==12} className="w-full p-5 bg-just-orange rounded-2xl font-bold text-xl active:scale-95 transition-all shadow-lg shadow-orange-600/30 disabled:opacity-30">Дізнатися тип</button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col py-8 px-4 pb-40">
              <div className="text-center mb-10">
                <span className="text-just-yellow font-mono text-[10px] tracking-[0.4em] uppercase">Astro-English Identity</span>
                <h2 className="text-4xl md:text-7xl font-bold uppercase mt-2 leading-tight">{result.persona}</h2>
              </div>
              
              <div className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] border border-white/10 mb-12 backdrop-blur-3xl shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <Star className="text-purple-500" size={20}/> 
                    <div className="text-left">
                      <div className="text-[10px] opacity-40 uppercase">Управитель</div>
                      <div className="font-bold text-sm md:text-base">{selectedZodiac && ZODIAC_SIGNS.find(z=>z.id===selectedZodiac)?.ruler}</div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <Flame className="text-orange-500" size={20}/> 
                    <div className="text-left">
                      <div className="text-[10px] opacity-40 uppercase">Стихія</div>
                      <div className="font-bold text-sm md:text-base">{selectedZodiac && ZODIAC_SIGNS.find(z=>z.id===selectedZodiac)?.element}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-10 text-left">
                  <div className="border-l-4 border-just-orange pl-6 py-1"><p className="text-just-orange font-bold italic text-xl">«{result.motto}»</p></div>
                  <p className="text-base md:text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">{result.roast}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-white/10">
                    <div>
                      <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest mb-4"><CheckCircle2 size={16}/> Сильні сторони:</div>
                      <p className="text-gray-400 text-sm italic leading-relaxed">{result.audit.strengths}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase text-[10px] tracking-widest mb-4"><AlertCircle size={16}/> Слабкі сторони:</div>
                      <p className="text-gray-400 text-sm italic leading-relaxed">{result.audit.weaknesses}</p>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/10">
                    <h4 className="flex items-center gap-2 text-just-yellow font-bold text-lg mb-6"><Sparkles size={20}/> План навчання на 16 тижнів:</h4>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{result.advice}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-12 mb-20">
                <img src={result.imageUrl} alt={result.persona} className="w-72 h-72 md:w-96 md:h-96 rounded-[3rem] object-cover border border-white/10 shadow-2xl shadow-orange-500/20" />
                <div className="w-full max-w-md space-y-6 px-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={()=>shareToPlatform('telegram')} className="p-5 bg-white/5 rounded-2xl flex flex-col items-center gap-2 border border-white/5 active:bg-[#229ED9]/20 transition-all group">
                      <Send className="text-[#229ED9] group-hover:scale-110 transition-transform"/>
                      <span className="text-[10px] font-bold opacity-50">TG</span>
                    </button>
                    <button onClick={()=>shareToPlatform('instagram')} className="p-5 bg-white/5 rounded-2xl flex flex-col items-center gap-2 border border-white/5 active:bg-[#E4405F]/20 transition-all group">
                      <Instagram className="text-[#E4405F] group-hover:scale-110 transition-transform"/>
                      <span className="text-[10px] font-bold opacity-50">IG</span>
                    </button>
                    <button onClick={()=>shareToPlatform('tiktok')} className="p-5 bg-white/5 rounded-2xl flex flex-col items-center gap-2 border border-white/5 active:bg-white/10 transition-all group">
                      <TikTokIcon className="text-white group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold opacity-50">TIKTOK</span>
                    </button>
                  </div>
                  <button onClick={reset} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 hover:bg-white/10 transition-all"><RefreshCw size={18}/> Пройти ще раз</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.3); border-radius: 10px; }
        .font-display { font-family: system-ui, -apple-system, sans-serif; }
      `}</style>
    </div>
  );
}
