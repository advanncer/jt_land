import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, Sparkles, Users, Cake, Target, BarChart3, Heart, Frown, Clock, Coffee, Smartphone, UserCheck, TrendingUp, Calendar, Group, Trophy, Gift, Wand2, User, Mail, Globe2, Briefcase, BookOpen, MessageCircle, Home, Sunrise, Sun, Sunset, Moon, Battery, BatteryLow, BatteryMedium, BatteryFull, Smile, Book, MessageSquare, TrendingDown, Zap, Rocket, Shuffle, ThumbsUp, ThumbsDown, Check, FileText, Globe, Mic, Edit, Headphones, Award, Film, Shield, PlaySquare, HelpCircle } from 'lucide-react';
import { quizData } from './data';

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";

const icons: { [key: string]: React.FC<any> } = {
  Users, Cake, Target, BarChart3, Heart, Frown, Clock, Coffee, Smartphone, UserCheck, TrendingUp, Calendar, Group, Trophy, Gift, Wand2, User, Mail, Sparkles, Globe2, Briefcase, BookOpen, MessageCircle, Home, Sunrise, Sun, Sunset, Moon, Battery, BatteryLow, BatteryMedium, BatteryFull, Smile, Book, MessageSquare, TrendingDown, Zap, Rocket, Shuffle, ThumbsUp, ThumbsDown, Check, FileText, Globe, Mic, Edit, Headphones, Award, Film, Shield, PlaySquare, HelpCircle
};

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

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [loaderProgress, setLoaderProgress] = useState(0);

  const currentStep = quizData.find(s => s.step === step);
  const totalQuestions = quizData.filter(s => s.type === 'choice').length;
  const currentQuestionIndex = quizData.filter(s => s.step <= step && s.type === 'choice').length;

  useEffect(() => {
    if (currentStep?.type === 'loader') {
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 600);
            return 100;
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, currentStep]);

  const handleChoice = (label: string) => {
    setAnswers({ ...answers, [step]: label });
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Name: leadName,
      Phone: leadPhone ? `'+${leadPhone.replace(/\D/g, '')}` : "",
      Email: leadEmail,
      Answear: Object.entries(answers).map(([s, a]) => `Q${s}: ${a}`).join(" | "),
      Lead_type: "LP_Google_Quiz_V3",
      URL: window.location.href
    };

    const qp = new URLSearchParams(payload as any).toString();
    fetch(`${GOOGLE_SHEETS_WEBHOOK_URL}?${qp}`, { method: "GET", mode: "no-cors" });

    alert("Дякуємо! Ваша заявка прийнята.");
    setStep(1);
    setAnswers({});
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
  };

  const IconComponent = currentStep?.icon ? icons[currentStep.icon] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col items-center overflow-x-hidden selection:bg-orange-100">
      <header className="w-full max-w-4xl px-4 py-3 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50 h-[60px]">
        <div className="w-10">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-base">J</div>
          <span className="font-black text-xl tracking-tighter">JustSchool</span>
        </div>
        <div className="text-[11px] font-black text-slate-400 min-w-[40px] text-right">
            {currentStep?.type === 'choice' || currentStep?.type === 'testimonials_interstitial' ? `${currentQuestionIndex} / ${totalQuestions}` : ''}
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg flex flex-col p-5 justify-start min-h-[calc(100vh-60px)]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="w-full pt-8 md:pt-12">
            {IconComponent && (
                <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-in fade-in zoom-in-75 duration-500">
                    <IconComponent size={48} strokeWidth={2.5}/>
                </div>
            )}
            {currentStep?.type === 'hero' && (
              <div className="text-center py-2 flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">{currentStep.question}</h1>
                <div className="w-full space-y-3 text-left mb-8">
                    <div className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm"><Sparkles size={18} className="text-orange-500 mt-1 shrink-0"/> <span className="text-sm font-bold text-slate-700">Почни говорити з перших хвилин</span></div>
                    <div className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm"><CheckCircle2 size={18} className="text-orange-500 mt-1 shrink-0"/> <span className="text-sm font-bold text-slate-700">Навчайся на інтерактивній платформі</span></div>
                    <div className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm"><UserCheck size={18} className="text-orange-500 mt-1 shrink-0"/> <span className="text-sm font-bold text-slate-700">Отримай персональний план навчання</span></div>
                </div>
                <div className="w-full p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-tighter">{currentStep.pre_cta}</p>
                  <button onClick={() => setStep(step + 1)} className="w-full bg-orange-500 text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                    {currentStep.cta} <ChevronRight size={20} />
                  </button>
                </div>
                <p className="mt-6 text-[11px] font-black text-slate-300 uppercase tracking-widest">{currentStep.social_proof}</p>
              </div>
            )}
            {(currentStep?.type === 'choice' || currentStep?.type === 'testimonials_interstitial') && (
              <div className="py-2 text-center">
                <h2 className="text-2xl font-black mb-3 leading-tight">{currentStep.question}</h2>
                {currentStep.subtext && <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed max-w-xs mx-auto">{currentStep.subtext}</p>}
                
                {currentStep.type === 'testimonials_interstitial' && currentStep.reviews && (
                  <div className="flex overflow-x-auto gap-3 pb-6 custom-scrollbar -mx-5 px-5 mb-4">
                    {currentStep.reviews.map(rev => (
                       <div key={rev.name} className="bg-white p-4 rounded-2xl border border-slate-100 text-left shrink-0 w-[80%] shadow-sm">
                         <p className="text-xs text-slate-600 font-medium leading-snug italic mb-3">"{rev.text}"</p>
                         <div className="font-black text-[10px] text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                           <div className="w-4 h-0.5 bg-orange-500 rounded-full" /> {rev.name}
                         </div>
                       </div>
                    ))}
                  </div>
                )}
                <div className="grid gap-3">
                  {currentStep.options?.map(opt => {
                    const OptIcon = icons[opt.icon];
                    return (
                        <button key={opt.value} onClick={() => handleChoice(opt.label)} className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-orange-500 active:bg-orange-50 transition-all font-bold text-base flex items-center gap-4 group shadow-sm">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors"><OptIcon size={24} /></div>
                            <span>{opt.label}</span>
                        </button>
                    );
                  })}
                </div>
              </div>
            )}
             {(currentStep?.type === 'lead_name' || currentStep?.type === 'lead_contacts') && (
                <div className="py-2 text-center">
                    <h2 className="text-2xl font-black mb-2 text-slate-900 leading-tight uppercase tracking-tighter">{currentStep.question}</h2>
                    <p className="text-base text-slate-400 mb-8 font-bold leading-tight">{currentStep.subtext}</p>
                    {currentStep.type === 'lead_contacts' && (
                        <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-center text-left">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shrink-0 text-sm">🎁</div>
                            <p className="text-orange-700 font-black text-[10px] uppercase tracking-tight leading-tight">Безкоштовне пробне заняття з методистом у подарунок!</p>
                        </div>
                    )}
                    {currentStep.type === 'lead_name' ? (
                       <div className="space-y-3">
                         <input type="text" placeholder="Ваше ім'я" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-xl font-black text-slate-900 bg-slate-50" value={leadName} onChange={e => setLeadName(e.target.value)} />
                         <button onClick={() => leadName.trim().length >= 2 && setStep(step + 1)} disabled={leadName.trim().length < 2} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest">{currentStep.cta}</button>
                       </div>
                    ) : (
                       <form onSubmit={handleSubmit} className="space-y-3">
                         <input type="tel" placeholder="+380 (XX) XXX-XX-XX" required className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-black text-slate-900 bg-slate-50" value={leadPhone} onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} maxLength={19} />
                         <input type="email" placeholder="Ваш e-mail" required className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-black text-slate-900 bg-slate-50" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                         <button type="submit" disabled={leadPhone.replace(/\D/g, "").length !== 12} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest">{currentStep.cta}</button>
                       </form>
                    )}
                </div>
            )}
             {currentStep?.type === 'loader' && (
                <div className="text-center py-8 px-4 flex flex-col justify-center flex-1">
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Loader2 className="animate-spin" size={40}/></div>
                    <h2 className="text-xl font-black mb-6 text-slate-900 leading-tight uppercase tracking-tight">{currentStep.question}</h2>
                    <div className="w-full max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-orange-500" style={{ width: `${loaderProgress}%` }} />
                    </div>
                    <div className="text-orange-500 font-black font-mono text-lg mb-8">{loaderProgress}%</div>
                    <div className="grid gap-2 max-w-xs mx-auto text-left">
                        {currentStep.points?.map((p, i) => (
                            <div key={p} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-wider transition-opacity duration-500 ${loaderProgress > (i * 25) ? 'text-slate-900' : 'text-slate-200'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${loaderProgress > (i * 25) ? 'bg-orange-500' : 'bg-slate-200'}`} />
                                {p}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        body { overflow-x: hidden; width: 100%; position: relative; }
        input::placeholder { color: #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
      `}</style>
    </div>
  );
}
