import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, Star, Quote } from 'lucide-react';
import { quizData } from './data';

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";

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
            setTimeout(() => setStep(step + 1), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, currentStep]);

  const handleChoice = (value: string) => {
    setAnswers({ ...answers, [step]: value });
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Name: leadName,
      Phone: leadPhone,
      Answear: Object.entries(answers).map(([s, a]) => `Step ${s}: ${a}`).join(" | "),
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
      <header className="w-full max-w-4xl p-4 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="font-bold text-xl tracking-tight">JustSchool</span>
        </div>
        {step > 1 && (
          <div className="text-sm font-medium text-slate-400">Крок {step} / {quizData.length}</div>
        )}
      </header>

      <main className="flex-1 w-full max-w-2xl flex flex-col p-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep?.type === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{currentStep.question}</h1>
              <p className="text-xl text-slate-600 mb-10">{currentStep.subtext}</p>
              <button onClick={() => setStep(step + 1)} className="bg-orange-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto">
                Пройти тест <ChevronRight />
              </button>
            </motion.div>
          )}

          {currentStep?.type === 'choice' && (
            <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-slate-400 mb-6 hover:text-slate-600 transition-colors"><ArrowLeft size={16}/> Назад</button>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentStep.question}</h2>
              {currentStep.subtext && <p className="text-slate-500 mb-8">{currentStep.subtext}</p>}
              <div className="grid gap-3">
                {currentStep.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleChoice(opt.label)} className="w-full text-left p-5 rounded-xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all font-semibold text-lg flex justify-between items-center group">
                    {opt.label} <ChevronRight className="text-slate-300 group-hover:text-orange-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'testimonials' && (
            <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="text-3xl font-bold mb-8">Нам довіряють 100 тис. користувачів</h2>
              <div className="grid gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
                  <Quote className="text-orange-200 mb-4" size={32} />
                  <p className="text-slate-700 italic mb-4">Всім рекомендую AntiSchool для навчання англійської, приємно здивував індивідуальний підхід.</p>
                  <div className="font-bold">Іванна Шевцова</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(step - 1)} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Назад</button>
                <button onClick={() => setStep(step + 1)} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold">Далі</button>
              </div>
            </motion.div>
          )}

          {currentStep?.type === 'value' && (
            <motion.div key="value" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
               <h2 className="text-3xl font-bold mb-8 leading-tight">{currentStep.question}</h2>
               <ul className="space-y-4 mb-10">
                 {currentStep.points?.map(p => (
                   <li key={p} className="flex items-start gap-3">
                     <CheckCircle2 className="text-orange-500 shrink-0 mt-1" size={20} />
                     <span className="text-lg text-slate-300">{p}</span>
                   </li>
                 ))}
               </ul>
               <div className="flex gap-4">
                 <button onClick={() => setStep(step - 1)} className="flex-1 py-4 border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-all">Назад</button>
                 <button onClick={() => setStep(step + 1)} className="flex-1 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all">Далі</button>
               </div>
            </motion.div>
          )}

          {currentStep?.type === 'loader' && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-6">{currentStep.question}</h2>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full bg-orange-500" animate={{ width: `${loaderProgress}%` }} />
              </div>
              <div className="text-orange-500 font-bold font-mono">{loaderProgress}%</div>
            </motion.div>
          )}

          {currentStep?.type === 'lead' && (
            <motion.div key="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
               <h2 className="text-3xl font-bold mb-4 text-center">{currentStep.question}</h2>
               <p className="text-slate-500 mb-8 text-center">{currentStep.subtext}</p>
               <form onSubmit={handleSubmit} className="space-y-4">
                 <input type="text" placeholder="Твоє ім'я" required className="w-full p-4 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all" value={leadName} onChange={e => setLeadName(e.target.value)} />
                 <input type="tel" placeholder="+380..." required className="w-full p-4 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} />
                 <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-xl font-bold text-xl shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all">Відправити</button>
               </form>
               <button onClick={() => setStep(step - 1)} className="w-full mt-6 text-slate-400 text-sm hover:text-slate-600 transition-all">Назад до тесту</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl p-8 text-center text-slate-400 text-sm">
        &copy; 2024 JustSchool English Online. Всі права захищені.
      </footer>
    </div>
  );
}
