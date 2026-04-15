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
  const [loaderProgress, setLoaderProgress] = useState(0);

  const currentStep = quizData.find(s => s.step === step);

  useEffect(() => {
    if (currentStep?.type === 'loader') {
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(step + 1), 800);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, currentStep]);

  const handleChoice = (label: string) => {
    setAnswers({ ...answers, [step]: label });
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Name: leadName,
      Phone: leadPhone ? `'+${leadPhone.replace(/\D/g, '')}` : "",
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
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col items-center">
      <header className="w-full max-w-4xl p-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="font-bold text-xl tracking-tight">JustSchool</span>
        </div>
        {step > 1 && (
          <div className="text-sm font-semibold text-slate-400">Питання {step-1} / 4</div>
        )}
      </header>

      <main className="flex-1 w-full max-w-3xl flex flex-col p-6 py-10">
        <AnimatePresence mode="wait">
          {currentStep?.type === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 font-bold text-sm mb-8">
                <Sparkles size={16} /> <span>{currentStep.meta}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-slate-900">{currentStep.question}</h1>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">{currentStep.subtext}</p>
              
              <div className="p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <p className="text-slate-500 font-bold mb-6">{currentStep.pre_cta}</p>
                <button onClick={() => setStep(step + 1)} className="w-full bg-orange-500 text-white px-8 py-5 rounded-2xl text-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-3">
                  {currentStep.cta} <ChevronRight />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'choice' && (
            <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-slate-400 mb-8 hover:text-slate-600 transition-colors font-bold"><ArrowLeft size={16}/> Назад</button>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 leading-tight">{currentStep.question}</h2>
              {currentStep.subtext && <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">{currentStep.subtext}</p>}
              <div className="grid gap-4">
                {currentStep.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleChoice(opt.label)} className="w-full text-left p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all font-bold text-xl flex justify-between items-center group shadow-sm active:scale-[0.98]">
                    {opt.label} <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'testimonials' && (
            <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-12 text-slate-900">{currentStep.question}</h2>
              <div className="grid gap-6 mb-12">
                {currentStep.reviews?.map(rev => (
                   <div key={rev.name} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-left relative overflow-hidden group">
                     <Quote className="text-orange-100 absolute -top-4 -right-4 transition-transform group-hover:scale-110" size={120} />
                     <p className="text-lg text-slate-700 font-medium mb-6 relative z-10 leading-relaxed italic">"{rev.text}"</p>
                     <div className="font-black text-xl text-slate-900 relative z-10 flex items-center gap-2">
                       <div className="w-8 h-1 bg-orange-500 rounded-full" /> {rev.name}
                     </div>
                   </div>
                ))}
              </div>
              <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={() => setStep(step - 1)} className="flex-1 py-5 border-2 border-slate-200 rounded-2xl font-bold text-lg active:scale-95 transition-all">Назад</button>
                <button onClick={() => setStep(step + 1)} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all">Далі</button>
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'value' && (
            <motion.div key={step} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full" />
               <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight relative z-10">{currentStep.question}</h2>
               {currentStep.subtext && <p className="text-slate-400 text-xl mb-10 relative z-10">{currentStep.subtext}</p>}
               <ul className="w-full space-y-5 mb-12 relative z-10 text-left max-w-lg">
                 {currentStep.points?.map(p => (
                   <li key={p} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                     <CheckCircle2 className="text-orange-500 shrink-0 mt-1" size={24} />
                     <span className="text-lg text-slate-300 font-semibold leading-snug">{p}</span>
                   </li>
                 ))}
               </ul>
               <div className="flex gap-4 w-full max-w-md relative z-10">
                 <button onClick={() => setStep(step - 1)} className="flex-1 py-5 border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all active:scale-95">Назад</button>
                 <button onClick={() => setStep(step + 1)} className="flex-1 py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/50 active:scale-95">Далі</button>
               </div>
            </motion.div>
          )}

          {currentStep?.type === 'loader' && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 px-6">
              <Loader2 className="w-20 h-20 text-orange-500 animate-spin mx-auto mb-10" />
              <h2 className="text-3xl md:text-4xl font-black mb-10 text-slate-900 leading-tight">{currentStep.question}</h2>
              <div className="w-full max-w-sm mx-auto bg-slate-200 h-3 rounded-full overflow-hidden mb-6">
                <motion.div className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" animate={{ width: `${loaderProgress}%` }} transition={{ ease: "linear" }} />
              </div>
              <div className="text-orange-600 font-black font-mono text-2xl">{loaderProgress}%</div>
              
              <div className="mt-12 grid gap-3 max-w-sm mx-auto">
                 {currentStep.points?.map((p, i) => (
                    <motion.div 
                        key={p} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: loaderProgress > (i * 25) ? 1 : 0.3 }}
                        className="flex items-center gap-3 text-slate-500 font-bold"
                    >
                        <div className={`w-2 h-2 rounded-full ${loaderProgress > (i * 25) ? 'bg-orange-500' : 'bg-slate-300'}`} />
                        {p}
                    </motion.div>
                 ))}
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'lead' && (
            <motion.div key="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl" />
               <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 leading-tight">{currentStep.question}</h2>
               <p className="text-xl text-slate-500 mb-10 font-medium">{currentStep.subtext}</p>
               
               <div className="mb-10 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                  <p className="text-blue-700 font-black text-lg mb-2">🎁 Спеціальна пропозиція:</p>
                  <p className="text-blue-600 font-bold">Бажаєте отримати безкоштовне пробне заняття з методистом?</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Ваше ім'я" 
                    required 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-bold text-slate-900 bg-slate-50" 
                    value={leadName} 
                    onChange={e => setLeadName(e.target.value)} 
                 />
                 <input 
                    type="tel" 
                    placeholder="+380 (XX) XXX-XX-XX" 
                    required 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-bold text-slate-900 bg-slate-50" 
                    value={leadPhone} 
                    onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} 
                    maxLength={19}
                 />
                 <button type="submit" disabled={leadPhone.replace(/\D/g, "").length !== 12} className="w-full py-6 bg-orange-500 text-white rounded-2xl font-black text-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30">
                    {currentStep.cta}
                 </button>
               </form>
               <button onClick={() => setStep(step - 1)} className="w-full mt-8 text-slate-400 font-bold hover:text-slate-600 transition-all flex items-center justify-center gap-2"><ArrowLeft size={16}/> Назад до тесту</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl p-8 text-center text-slate-400 text-sm font-bold">
        &copy; 2024 JustSchool. Твій шлях до вільної англійської.
      </footer>
    </div>
  );
}
