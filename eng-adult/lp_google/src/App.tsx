import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, Quote, Sparkles } from 'lucide-react';
import { quizData } from './data';

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";

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
  const totalSteps = quizData.length;

  useEffect(() => {
    if (currentStep?.type === 'loader') {
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 600);
            return 100;
          }
          return prev + 2;
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
      Lead_type: "LP_Google_Quiz",
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center overflow-x-hidden selection:bg-orange-100">
      <header className="w-full max-w-4xl px-4 py-3 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">J</div>
          <span className="font-black text-lg tracking-tighter">JustSchool</span>
        </div>
        {step > 1 && step < totalSteps && (
          <div className="flex items-center gap-3">
             <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step} / {totalSteps}</span>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-lg flex flex-col p-5 justify-center min-h-[calc(100vh-60px)]">
        <AnimatePresence mode="wait">
          {currentStep?.type === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full text-orange-600 font-bold text-[10px] uppercase mb-6 tracking-widest border border-orange-100">
                <Sparkles size={12} /> <span>{currentStep.meta}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">{currentStep.question}</h1>
              <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium">{currentStep.subtext}</p>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-tighter">{currentStep.pre_cta}</p>
                <button onClick={() => setStep(step + 1)} className="w-full bg-orange-500 text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                  {currentStep.cta} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'choice' && (
            <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-2">
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-slate-300 mb-6 hover:text-slate-500 transition-colors font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={14}/> Назад</button>
              <h2 className="text-2xl font-black mb-2 leading-tight">{currentStep.question}</h2>
              {currentStep.subtext && <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">{currentStep.subtext}</p>}
              <div className="grid gap-3">
                {currentStep.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleChoice(opt.label)} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 bg-white hover:border-orange-500 active:bg-orange-50 transition-all font-bold text-lg flex justify-between items-center group shadow-sm">
                    {opt.label} <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'testimonials' && (
            <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <h2 className="text-2xl font-black mb-8 leading-tight uppercase tracking-tight">{currentStep.question}</h2>
              <div className="space-y-4 mb-8">
                {currentStep.reviews?.map(rev => (
                   <div key={rev.name} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left relative overflow-hidden">
                     <Quote className="text-orange-500/10 absolute -top-2 -right-2" size={80} />
                     <p className="text-base text-slate-600 font-medium mb-4 relative z-10 leading-relaxed italic">"{rev.text}"</p>
                     <div className="font-black text-sm text-slate-900 relative z-10 flex items-center gap-2">
                       <div className="w-6 h-1 bg-orange-500 rounded-full" /> {rev.name}
                     </div>
                   </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(step - 1)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-400 active:scale-95 transition-all">Назад</button>
                <button onClick={() => setStep(step + 1)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-200">Далі</button>
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'value' && (
            <motion.div key={step} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
               <h2 className="text-2xl font-black mb-8 leading-tight relative z-10 uppercase tracking-tight">{currentStep.question}</h2>
               <ul className="space-y-4 mb-10 relative z-10">
                 {currentStep.points?.map(p => (
                   <li key={p} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                     <CheckCircle2 className="text-orange-500 shrink-0 mt-0.5" size={18} />
                     <span className="text-base text-slate-300 font-bold leading-tight">{p}</span>
                   </li>
                 ))}
               </ul>
               <div className="flex gap-3 relative z-10 mt-auto">
                 <button onClick={() => setStep(step - 1)} className="flex-1 py-4 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">Назад</button>
                 <button onClick={() => setStep(step + 1)} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/40 active:scale-95">Далі</button>
               </div>
            </motion.div>
          )}

          {currentStep?.type === 'loader' && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 px-4">
              <Loader2 className="w-14 h-14 text-orange-500 animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-black mb-8 text-slate-900 leading-tight uppercase tracking-tight">{currentStep.question}</h2>
              <div className="w-full max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <motion.div className="h-full bg-orange-500" animate={{ width: `${loaderProgress}%` }} transition={{ ease: "linear" }} />
              </div>
              <div className="text-orange-500 font-black font-mono text-xl mb-12">{loaderProgress}%</div>
              <div className="grid gap-3 max-w-xs mx-auto text-left">
                 {currentStep.points?.map((p, i) => (
                    <div key={p} className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-wider transition-opacity duration-500 ${loaderProgress > (i * 25) ? 'text-slate-900' : 'text-slate-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${loaderProgress > (i * 25) ? 'bg-orange-500' : 'bg-slate-200'}`} />
                        {p}
                    </div>
                 ))}
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'lead_name' && (
            <motion.div key="lead_name" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
               <h2 className="text-3xl font-black mb-2 text-slate-900 leading-tight uppercase tracking-tighter">{currentStep.question}</h2>
               <p className="text-lg text-slate-400 mb-10 font-bold leading-tight">{currentStep.subtext}</p>
               <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Ваше ім'я" 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-xl font-black text-slate-900 bg-slate-50" 
                    value={leadName} 
                    onChange={e => setLeadName(e.target.value)} 
                 />
                 <button 
                    onClick={() => leadName.trim().length >= 2 && setStep(step + 1)}
                    disabled={leadName.trim().length < 2}
                    className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest"
                 >
                    {currentStep.cta}
                 </button>
               </div>
               <button onClick={() => setStep(step - 1)} className="w-full mt-8 text-slate-300 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 leading-none"><ArrowLeft size={12}/> Назад</button>
            </motion.div>
          )}

          {currentStep?.type === 'lead_contacts' && (
            <motion.div key="lead_contacts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
               <h2 className="text-3xl font-black mb-2 text-slate-900 leading-tight uppercase tracking-tighter">{currentStep.question}</h2>
               <p className="text-lg text-slate-400 mb-8 font-bold leading-tight">{currentStep.subtext}</p>
               
               <div className="mb-8 p-5 bg-orange-50 rounded-3xl border border-orange-100 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0">🎁</div>
                  <p className="text-orange-700 font-black text-xs uppercase tracking-tight leading-tight">Спеціальна пропозиція: безкоштовне пробне заняття з методистом!</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 <input 
                    type="tel" 
                    placeholder="+380 (XX) XXX-XX-XX" 
                    required 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-xl font-black text-slate-900 bg-slate-50" 
                    value={leadPhone} 
                    onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} 
                    maxLength={19}
                 />
                 <input 
                    type="email" 
                    placeholder="Ваш e-mail" 
                    required 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-xl font-black text-slate-900 bg-slate-50" 
                    value={leadEmail} 
                    onChange={e => setLeadEmail(e.target.value)} 
                 />
                 <button type="submit" disabled={leadPhone.replace(/\D/g, "").length !== 12} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest">
                    {currentStep.cta}
                 </button>
               </form>
               <button onClick={() => setStep(step - 1)} className="w-full mt-8 text-slate-300 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 leading-none"><ArrowLeft size={12}/> Назад</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl p-6 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-4">
        &copy; 2024 JustSchool English.
      </footer>

      <style>{`
        body { overflow-x: hidden; width: 100%; position: relative; }
        input::placeholder { color: #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 14px; letter-spacing: 0.05em; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
      `}</style>
    </div>
  );
}
