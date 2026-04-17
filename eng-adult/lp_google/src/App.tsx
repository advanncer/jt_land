import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, Sparkles, Users, Cake, Target, BarChart3, Heart, Frown, Clock, Coffee, Smartphone, UserCheck, TrendingUp, Calendar, Group, Trophy, Gift, Wand2, User, Mail, Globe2, Briefcase, BookOpen, MessageSquare, TrendingDown, Zap, Rocket, Shuffle, ThumbsUp, ThumbsDown, Check, FileText, Globe, Mic, Edit, Headphones, Award, Film, Shield, PlaySquare, HelpCircle, XCircle, LayoutGrid, CalendarDays, Monitor, HeartHandshake, Timer, Plane, Quote } from 'lucide-react';
import { quizData } from './data';

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjHz2H9Am5CfJ6dtrvu82h9Vr0bi_lc6eb6Ljm-jEuqHcz-UIdEXHcx4lhL-uDVjTmZA/exec";

const icons: { [key: string]: React.FC<any> } = {
  Users, Cake, Target, BarChart3, Heart, Frown, Clock, Coffee, Smartphone, UserCheck, TrendingUp, Calendar, Group, Trophy, Gift, Wand2, User, Mail, Sparkles, Globe2, Briefcase, BookOpen, MessageSquare, TrendingDown, Zap, Rocket, Shuffle, ThumbsUp, ThumbsDown, Check, FileText, Globe, Mic, Edit, Headphones, Award, Film, Shield, PlaySquare, HelpCircle, XCircle, LayoutGrid, CalendarDays, Monitor, HeartHandshake, Timer, Plane
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
  const totalQuestions = quizData.filter(s => s.type === 'choice' || s.type === 'testimonials_interstitial').length;
  const currentQuestionIndex = quizData.filter(s => s.step <= step && (s.type === 'choice' || s.type === 'testimonials_interstitial')).length;

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
      Lead_type: "LP_Google_Quiz_Final",
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
    window.scrollTo(0, 0);
  };

  const IconComponent = currentStep?.icon ? icons[currentStep.icon] : null;

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 font-sans flex flex-col items-center overflow-x-hidden selection:bg-orange-100 relative">
      <header className="w-full max-w-4xl px-4 py-3 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 h-[60px] shrink-0">
        <div className="w-10">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-slate-300 hover:text-slate-900 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">J</div>
          <span className="font-black text-lg tracking-tighter">JustSchool</span>
        </div>

        <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest min-w-[40px] text-right">
            {(currentStep?.type === 'choice' || currentStep?.type === 'testimonials_interstitial') ? `${currentQuestionIndex} / ${totalQuestions}` : ''}
        </div>
      </header>

      {step > 1 && currentStep?.type !== 'loader' && currentStep?.type !== 'program_ready' && currentStep?.type !== 'lead_name' && currentStep?.type !== 'lead_contacts' && (
          <div className="absolute top-[60px] left-0 w-full h-1 bg-slate-100 z-40">
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }} />
          </div>
      )}

      <main className="flex-1 w-full max-w-lg flex flex-col p-4 justify-start overflow-y-auto custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-full flex flex-col pt-2">
            
            {IconComponent && currentStep?.type !== 'hero' && currentStep?.type !== 'loader' && currentStep?.type !== 'program_ready' && currentStep?.type !== 'lead_name' && currentStep?.type !== 'lead_contacts' && (
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 shrink-0 shadow-sm border border-orange-200/50">
                    <IconComponent size={32} strokeWidth={2.5}/>
                </div>
            )}
            
            {currentStep?.type === 'hero' && (
              <div className="text-center flex flex-col items-center h-full">
                <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight pt-2">{currentStep.question || currentStep.title}</h1>
                <p className="text-sm md:text-base text-slate-500 mb-8 leading-relaxed font-medium">{currentStep.subtext || currentStep.subtitle}</p>
                
                <div className="w-full mt-auto">
                  <div className="p-5 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-tighter">{currentStep.pre_cta}</p>
                    <button onClick={() => setStep(step + 1)} className="w-full bg-orange-500 text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                      {currentStep.cta} <ChevronRight size={20} />
                    </button>
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-orange-600 font-bold text-[9px] uppercase tracking-widest bg-orange-50 w-fit mx-auto px-3 py-1 rounded-full border border-orange-100">
                      <Sparkles size={10} /> <span>{currentStep.meta}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-2">{currentStep.social_proof}</p>
                </div>
              </div>
            )}

            {(currentStep?.type === 'choice' || currentStep?.type === 'testimonials_interstitial') && (
              <div className="text-center flex flex-col h-full">
                <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">{currentStep.question || currentStep.title}</h2>
                {currentStep.subtext && <p className="text-sm md:text-base text-slate-500 mb-6 font-medium leading-relaxed max-w-sm mx-auto px-2">{currentStep.subtext || currentStep.subtitle}</p>}
                
                {currentStep.type === 'testimonials_interstitial' && currentStep.reviews && (
                  <div className="mb-6 flex-1 flex flex-col min-h-0">
                      <div className="flex overflow-x-auto gap-4 pb-6 custom-scrollbar -mx-4 px-4 snap-x snap-mandatory flex-1 items-center">
                        {currentStep.reviews.map(rev => (
                           <div key={rev.name} className="bg-white p-5 rounded-3xl border border-slate-100 text-left shrink-0 w-[85%] max-w-[280px] shadow-sm snap-center relative flex flex-col h-full">
                              <div className="flex items-center gap-3 mb-3">
                                <img src={rev.photoUrl} className="w-10 h-10 rounded-full object-cover" />
                                <div className="font-black text-sm text-slate-900">{rev.name}</div>
                              </div>
                             <p className="text-xs text-slate-600 font-medium leading-relaxed italic relative z-10 flex-1">"{rev.text}"</p>
                           </div>
                        ))}
                      </div>
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 mt-2">
                          <ArrowLeft size={10}/> свайп відгуки <ChevronRight size={10}/>
                      </div>
                  </div>
                )}

                <div className={`grid gap-2.5 w-full ${currentStep.type === 'choice' ? 'mt-auto' : ''} pb-4`}>
                  {currentStep.options?.map(opt => {
                    const OptIcon = opt.icon ? icons[opt.icon] : null;
                    return (
                        <button key={opt.value} onClick={() => handleChoice(opt.label)} className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-100 bg-white hover:border-orange-500 active:bg-orange-50 transition-all font-bold text-sm flex items-center gap-4 group shadow-sm active:scale-[0.98]">
                            {OptIcon && (
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors shrink-0">
                                    <OptIcon size={20} strokeWidth={2}/>
                                </div>
                            )}
                            <span className="flex-1 leading-snug">{opt.label}</span>
                        </button>
                    );
                  })}
                </div>
                {currentStep.type === 'testimonials_interstitial' && (
                     <button onClick={() => setStep(step + 1)} className="w-full mt-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">{currentStep.cta}</button>
                )}
              </div>
            )}

             {currentStep?.type === 'program_ready' && (
                <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col text-center flex-1 my-4">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full" />
                   
                   <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shrink-0">
                        <Sparkles size={32} strokeWidth={2.5}/>
                   </div>

                   <h2 className="text-2xl font-black mb-3 leading-tight relative z-10">{currentStep.title}</h2>
                   <p className="text-slate-400 text-xs md:text-sm mb-8 relative z-10 font-bold leading-relaxed">{currentStep.subtitle}</p>
                   
                   <ul className="space-y-3 mb-8 relative z-10 text-left mt-auto">
                     {currentStep.points?.map(p => (
                       <li key={p} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                         <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
                         <span className="text-sm text-slate-200 font-bold leading-tight">{p}</span>
                       </li>
                     ))}
                   </ul>
                   <button onClick={() => setStep(step + 1)} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/40 active:scale-95 relative z-10 mt-auto">{currentStep.cta}</button>
                </div>
            )}

            {(currentStep?.type === 'lead_name' || currentStep?.type === 'lead_contacts') && (
                <div className="text-center flex flex-col h-full py-4">
                    {currentStep.type === 'lead_name' && (
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shrink-0 shadow-inner border border-orange-200/50">
                            <User size={32} strokeWidth={2.5}/>
                        </div>
                    )}
                    {currentStep.type === 'lead_contacts' && (
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shrink-0 shadow-inner border border-orange-200/50">
                            <Mail size={32} strokeWidth={2.5}/>
                        </div>
                    )}

                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 leading-tight uppercase tracking-tighter px-2">{currentStep.title}</h2>
                    <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed max-w-sm mx-auto px-4">{currentStep.subtitle}</p>
                    
                    <div className="mt-auto w-full">
                        {currentStep.type === 'lead_contacts' && (
                            <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-center text-left">
                                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0 text-lg">🎁</div>
                                <p className="text-orange-700 font-black text-[10px] uppercase tracking-tight leading-tight">Безкоштовне пробне заняття з методистом у подарунок! Отримай також персональні воркбуки для пропрацювання англійської.</p>
                            </div>
                        )}

                        {currentStep.type === 'lead_name' ? (
                           <div className="space-y-4 w-full">
                             <input 
                                type="text" 
                                placeholder={currentStep.form?.name_placeholder || "Ваше ім'я"} 
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-xl font-black text-slate-900 bg-white shadow-sm text-center" 
                                value={leadName} 
                                onChange={e => setLeadName(e.target.value)} 
                             />
                             <button onClick={() => leadName.trim().length >= 2 && setStep(step + 1)} disabled={leadName.trim().length < 2} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest">{currentStep.cta}</button>
                           </div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-4 w-full">
                             <input 
                                type="email" 
                                placeholder={currentStep.form?.email_placeholder || "Ваш e-mail"} 
                                required 
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-black text-slate-900 bg-white shadow-sm text-center" 
                                value={leadEmail} 
                                onChange={e => setLeadEmail(e.target.value)} 
                             />
                             <input 
                                type="tel" 
                                placeholder={currentStep.form?.phone_placeholder || "Твій номер телефону"} 
                                required 
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all text-lg font-black text-slate-900 bg-white shadow-sm text-center" 
                                value={leadPhone} 
                                onChange={e => setLeadPhone(formatPhoneNumber(e.target.value))} 
                                maxLength={19} 
                             />
                             <button type="submit" disabled={leadPhone.replace(/\D/g, "").length !== 12} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest">{currentStep.cta}</button>
                             {currentStep.guarantee_text && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">{currentStep.guarantee_text}</p>}
                           </form>
                        )}
                    </div>
                </div>
            )}

             {currentStep?.type === 'loader' && (
                <div className="text-center py-8 px-4 flex flex-col justify-center flex-1 h-full">
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shrink-0 shadow-inner border border-orange-200/50"><Loader2 className="animate-spin" size={40} strokeWidth={2.5}/></div>
                    <h2 className="text-2xl font-black mb-10 text-slate-900 leading-tight uppercase tracking-tight">{currentStep.question || currentStep.title}</h2>
                    
                    <div className="w-full max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-orange-500" style={{ width: `${loaderProgress}%` }} />
                    </div>
                    <div className="text-orange-500 font-black font-mono text-2xl mb-12">{loaderProgress}%</div>
                    
                    <div className="grid gap-3 max-w-[280px] mx-auto text-left w-full mt-auto mb-10">
                        {currentStep.points?.map((p, i) => (
                            <div key={p} className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-wider transition-opacity duration-500 ${loaderProgress > (i * 25) ? 'text-slate-900' : 'text-slate-200'}`}>
                                <div className={`w-2 h-2 rounded-full shrink-0 ${loaderProgress > (i * 25) ? 'bg-orange-500' : 'bg-slate-200'}`} />
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
        body { overflow-x: hidden; width: 100%; position: relative; background: #f8fafc; }
        input::placeholder { color: #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; text-align: center; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
      `}</style>
    </div>
  );
}
