import { useState, useEffect } from 'react';
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function App() {
  const [step, setStep] = useState<'hero' | 'zodiac' | 'quiz' | 'lead' | 'loading' | 'result'>('hero');
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

  const handleStart = () => {
    setStep('zodiac');
    window.scrollTo(0, 0);
  };

  const handleZodiacSelect = (zodiac: ZodiacSign) => {
    setSelectedZodiac(zodiac);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStep('quiz');
    window.scrollTo(0, 0);
  };

  const handleAnswer = (value: string) => {
    const questionId = QUESTIONS[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep('lead');
    }
    window.scrollTo(0, 0);
  };

  const submitLeadAndProcess = async () => {
    if (!selectedZodiac) return;
    setStep('loading');
    setLoadingProgress(0);

    const texts = [
      "Аналізуємо твій зірковий шлях...",
      "Поки ти чекаєш, 500 учнів JustSchool вже вивчили по 10 нових слів 🚀",
      "Зіставляємо твій ретроградний Меркурій з рівнем Grammar...",
      "Розраховуємо персональну стратегію на 16 тижнів...",
      "Майже готово! Твій мовний діагноз формується..."
    ];
    
    let t = 0;
    const tInt = setInterval(() => {
      t = (t + 1) % texts.length;
      setLoadingText(texts[t]);
    }, 1000);

    const pInt = setInterval(() => {
      setLoadingProgress(p => (p < 100 ? p + 1 : 100));
    }, 50);

    try {
      const data = await getAstroResult(selectedZodiac, answers);
      
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

      // Facebook Lead Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
          try { (window as any).fbq("track", "Lead"); } catch(e) {}
      }

      // Tracking
      fetch(N8N_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
      const qp = new URLSearchParams(payload as any).toString();
      fetch(`${GOOGLE_SHEETS_WEBHOOK_URL}?${qp}`, { method: "GET", mode: "no-cors" }).catch(() => {});

      // Min 5s delay
      await new Promise(res => setTimeout(res, 5000));
      
      clearInterval(tInt);
      clearInterval(pInt);
      setResult(data);
      setStep('result');
      window.scrollTo(0, 0);

    } catch (e) {
      clearInterval(tInt);
      clearInterval(pInt);
      console.error(e);
      setStep('hero');
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone.replace(/\D/g, "").length === 12) {
      submitLeadAndProcess();
    }
  };

  const shareToPlatform = (platform: string) => {
    const title = 'Хто твоє "Мовне Альтер-Его"?';
    const text = `${title}\n\nМій тип: ${result?.persona}! Дізнайся свій:`;
    const url = window.location.origin + window.location.pathname;
    if (platform === 'telegram') {
      window.open('https://t.me/+tefTRl_Ff8hkMzNi', '_blank');
    } else if (platform === 'instagram') {
      window.open('https://www.instagram.com/just_school_ua/', '_blank');
    } else if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Скопійовано!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center font-sans selection:bg-orange-500/30">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col p-4 md:p-6 items-center">
        {step === 'hero' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <span className="text-orange-500 font-mono text-[9px] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">Безкоштовний психологічний тест від JustSchool</span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight uppercase">Хто твоє <br/><span className="text-orange-500">"Мовне Альтер-Его"</span>?</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed font-medium">Твій знак зодіаку визначає стиль спілкувания. Дізнайся свою приховану сторону та отримай персональний план на 16 тижнів.</p>
            <button onClick={handleStart} className="bg-orange-500 px-10 py-5 rounded-full text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center gap-3 uppercase tracking-wider">Оберіть свій знак <ChevronRight strokeWidth={3} /></button>
          </div>
        )}

        {step === 'zodiac' && (
          <div className="py-6 w-full max-w-2xl">
            <h2 className="text-3xl font-black text-center mb-2 uppercase tracking-tight">Обери свій знак</h2>
            <p className="text-center text-gray-500 mb-10 text-sm font-bold">Зірки знають про твій English все. Готуйся до правди</p>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {ZODIAC_SIGNS.map(z => (
                <button key={z.id} onClick={() => handleZodiacSelect(z.id)} className="bg-white/5 p-4 md:p-8 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5 hover:bg-white/10 active:border-orange-500/50 transition-all aspect-square group shadow-xl">
                  <span className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">{z.icon}</span>
                  <span className="font-black text-[10px] md:text-sm uppercase tracking-widest text-white/70">{z.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="flex-1 flex flex-col py-10 max-w-xl mx-auto w-full px-4 justify-center">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setStep('zodiac')} className="text-gray-500 flex items-center gap-1 font-bold hover:text-white transition-colors uppercase text-xs tracking-widest"><ArrowLeft size={16}/> Назад</button>
              <span className="text-orange-500 font-mono font-black">{currentQuestionIndex + 1}/{QUESTIONS.length}</span>
            </div>
            <div className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
              <div className="absolute top-0 left-0 h-1.5 bg-orange-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }} />
              <h3 className="text-2xl md:text-3xl font-black mb-10 leading-tight">{QUESTIONS[currentQuestionIndex].question}</h3>
              <div className="space-y-4">
                {QUESTIONS[currentQuestionIndex].options.map(o => (
                  <button key={o.value} onClick={() => handleAnswer(o.value)} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/50 hover:bg-white/10 transition-all flex justify-between items-center group active:scale-[0.98]">
                    <span className="text-lg md:text-xl font-bold text-white/90">{o.label}</span> <ChevronRight className="opacity-0 group-hover:opacity-100 text-orange-500 transition-all" strokeWidth={3}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
            <Loader2 className="w-20 h-20 text-orange-500 animate-spin mb-10" />
            <div className="h-32 flex items-center justify-center">
              <h2 className="text-2xl md:text-4xl font-black leading-tight max-w-md uppercase tracking-tight">{loadingText}</h2>
            </div>
            <div className="w-full max-w-sm h-3 bg-white/5 rounded-full overflow-hidden mt-8 border border-white/10">
              <div className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)]" style={{ width: `${loadingProgress}%` }} />
            </div>
            <span className="text-orange-500 font-mono font-black mt-4 text-2xl">{loadingProgress}%</span>
          </div>
        )}

        {step === 'lead' && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 w-full max-w-md mx-auto px-4">
            <div className="bg-white/5 p-8 md:p-14 rounded-[3.5rem] border border-white/10 text-center w-full backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-8 animate-pulse"/>
              <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-none">Майже готово!</h2>
              <p className="text-gray-400 mb-10 text-base font-medium">Залиш контакти, щоб отримати свій зірковий розбір</p>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input type="text" placeholder="Ім'я" required className="w-full p-5 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-orange-500 text-white font-bold text-lg" value={leadName} onChange={e => setLeadName(e.target.value)} />
                <input type="tel" placeholder="+380 (XX) XXX-XX-XX" required className="w-full p-5 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-orange-500 text-white font-bold text-lg" value={leadPhone} onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} />
                <input type="email" placeholder="Email" required className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-orange-500 text-white font-bold text-lg" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                <button type="submit" disabled={leadPhone.replace(/\D/g,'').length!==12} className="w-full p-6 bg-orange-500 rounded-2xl font-black text-2xl active:scale-95 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-30 uppercase tracking-widest text-white mt-4">Дізнатися тип</button>
              </form>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="w-full flex flex-col py-8 px-4 pb-40 items-center">
            <div className="text-center mb-12 w-full">
              <span className="text-yellow-500 font-mono text-xs tracking-[0.5em] uppercase font-black">Astro-English Identity</span>
              <h2 className="text-5xl md:text-8xl font-black uppercase mt-4 leading-none tracking-tighter text-white">{result.persona}</h2>
            </div>
            
            <div className="bg-white/5 p-8 md:p-14 rounded-[4rem] border border-white/10 mb-16 backdrop-blur-3xl shadow-2xl w-full max-w-3xl">
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-white/5 p-5 rounded-3xl flex items-center gap-4 border border-white/5">
                  <Star className="text-purple-500" size={24}/> 
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase font-black mb-1">Управитель</div>
                    <div className="font-black text-sm md:text-lg text-white">{selectedZodiac && ZODIAC_SIGNS.find(z=>z.id===selectedZodiac)?.ruler}</div>
                  </div>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl flex items-center gap-4 border border-white/5">
                  <Flame className="text-orange-500" size={24}/> 
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase font-black mb-1">Стихія</div>
                    <div className="font-black text-sm md:text-lg text-white">{selectedZodiac && ZODIAC_SIGNS.find(z=>z.id===selectedZodiac)?.element}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-12 text-left">
                <div className="border-l-8 border-orange-500 pl-8 py-2 bg-orange-500/5 rounded-r-2xl">
                  <p className="text-orange-500 font-black italic text-2xl leading-tight">«{result.motto}»</p>
                </div>
                <p className="text-lg md:text-2xl leading-relaxed text-white font-medium whitespace-pre-wrap">{result.roast}</p>
                
                <div className="grid md:grid-cols-2 gap-10 pt-12 border-t border-white/10">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-sm tracking-widest"><CheckCircle2 size={20} strokeWidth={3}/> Сильні сторони:</div>
                    <p className="text-gray-300 text-lg italic leading-relaxed font-medium">{result.audit.strengths}</p>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-orange-500 font-black uppercase text-sm tracking-widest"><AlertCircle size={20} strokeWidth={3}/> Слабкі сторони:</div>
                    <p className="text-gray-400 text-lg italic leading-relaxed font-medium">{result.audit.weaknesses}</p>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/10 text-left">
                  <h4 className="flex items-center gap-3 text-yellow-500 font-black text-xl mb-8 uppercase tracking-widest"><Sparkles size={24}/> План навчання</h4>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-bold">{result.advice}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-16 mb-20 w-full px-4">
              <div className="w-full max-w-2xl aspect-square rounded-[4rem] overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(249,115,22,0.2)]">
                <img src={result.imageUrl} alt={result.persona} className="w-full h-full object-cover" />
              </div>
              <div className="w-full max-w-md space-y-10">
                <div className="grid grid-cols-3 gap-6">
                  <button onClick={()=>shareToPlatform('telegram')} className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 border-2 border-white/5 active:bg-[#229ED9]/30 transition-all group hover:bg-[#229ED9]/10">
                    <Send className="text-[#229ED9] group-hover:scale-110 transition-transform" size={32} strokeWidth={2.5}/>
                    <span className="text-xs font-black uppercase tracking-widest text-[#229ED9]">TG</span>
                  </button>
                  <button onClick={()=>shareToPlatform('instagram')} className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 border-2 border-white/5 active:bg-[#E4405F]/30 transition-all group hover:bg-[#E4405F]/10">
                    <Instagram className="text-[#E4405F] group-hover:scale-110 transition-transform" size={32} strokeWidth={2.5}/>
                    <span className="text-xs font-black uppercase tracking-widest text-[#E4405F]">IG</span>
                  </button>
                  <button onClick={()=>shareToPlatform('tiktok')} className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 border-2 border-white/5 active:bg-white/20 transition-all group hover:bg-white/10">
                    <TikTokIcon size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">TT</span>
                  </button>
                </div>
                <button onClick={reset} className="w-full py-6 bg-white/5 border-2 border-white/10 rounded-3xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 hover:bg-white/10 transition-all uppercase tracking-[0.2em]">Пройти ще раз</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
