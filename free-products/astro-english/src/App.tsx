import { useState, useEffect, useRef } from 'react';
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
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [step]);

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
    if (selectedZodiac) {
      try {
        const data = await getAstroResult(selectedZodiac, answers);
        setResult(data);
        setStep('result');
      } catch (error) {
        console.error("Failed to generate result", error);
        setStep('hero');
      }
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone && leadEmail) {
      setStep('loading');
      processResult();
    }
  };

  const shareToPlatform = (platform: 'telegram' | 'instagram' | 'tiktok') => {
    const text = `Мій мовний тип: ${result?.persona}! Дізнайся свій тип за посиланням: ${window.location.href}`;
    const url = encodeURIComponent(window.location.href);
    
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Моє Мовне Альтер-Его',
          text: text,
          url: window.location.href,
        }).catch(console.error);
      } else {
        alert("Скопійовано посилання для шерингу!");
        navigator.clipboard.writeText(window.location.href);
      }
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
  };

  return (
    <div className="h-[100dvh] w-full bg-[#050505] relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-just-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-just-orange/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl text-center z-10 w-full px-6"
          >
            <div className="mb-6">
              <span className="text-just-orange font-mono text-[7px] md:text-[10px] uppercase tracking-[0.15em] bg-just-orange/10 px-3 py-1.5 rounded-full border border-just-orange/20 inline-block whitespace-nowrap">
                Безкоштовний психологічний тест від JustSchool
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-4 md:mb-6 tracking-tight leading-tight">
              Хто твоє <span className="text-just-orange text-glow-orange">"Мовне Альтер-Его"</span>?
            </h1>
            <p className="text-base md:text-xl text-white/60 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
              Твій знак зодіаку визначає, як ти насправді розмовляєш англійською. Дізнайся свій прихований стиль спілкування та отримай персональний план навчання на 16 тижнів.
            </p>
            <button
              onClick={handleStart}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-just-orange text-white font-bold rounded-full text-lg md:text-xl transition-all hover:scale-105 active:scale-95 neon-glow-orange shadow-lg shadow-just-orange/40"
            >
              <span className="relative z-10 flex items-center gap-3">
                Оберіть свій знак <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        )}

        {step === 'zodiac' && (
          <motion.div
            key="zodiac"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col w-full max-w-2xl z-10 pt-8 pb-8 px-4"
          >
            <div className="text-center mb-6 shrink-0">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">Обери свій знак</h2>
              <p className="text-white/50 text-xs">Зірки знають про твій English все. Готуйся до правди</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="grid grid-cols-4 gap-2 md:gap-3 pb-6">
                {ZODIAC_SIGNS.map((zodiac) => (
                  <motion.button
                    key={zodiac.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleZodiacSelect(zodiac.id)}
                    className="glass p-2 md:p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:bg-white/10 group relative border border-white/5 active:border-just-orange/50 aspect-square justify-center"
                  >
                    <span className="text-xl md:text-3xl pointer-events-none">{zodiac.icon}</span>
                    <span className="font-bold text-[7px] md:text-[10px] whitespace-nowrap uppercase tracking-tighter pointer-events-none">{zodiac.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col justify-center max-w-xl w-full z-10 pt-4 px-4"
          >
            <div className="mb-4 flex items-center justify-between shrink-0">
              <button
                onClick={() => setStep('zodiac')}
                className="text-white/50 hover:text-white flex items-center gap-1 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <div className="text-xs font-mono text-just-orange">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </div>
            </div>

            <div className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                  className="h-full bg-just-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-snug shrink-0">
                {QUESTIONS[currentQuestionIndex].question}
              </h3>

              <div className="space-y-2 md:space-y-3">
                {QUESTIONS[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-just-orange/50 transition-all flex items-center justify-between group text-sm md:text-base"
                  >
                    <span>{option.label}</span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-opacity text-just-orange" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-md w-full px-4"
          >
            <div className="mb-6 relative inline-block">
              <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-just-orange animate-spin" />
              <div className="absolute inset-0 blur-xl bg-just-orange/20" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Аналізуємо твій шлях...</h2>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-just-orange to-just-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white/60 italic text-sm px-4">
              Фіналізуємо твій мовний діагноз...
            </p>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col w-full max-w-3xl z-10 overflow-y-auto custom-scrollbar pt-10 px-4 pb-16"
          >
            <div className="text-center mb-6 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-just-yellow font-mono text-[9px] uppercase tracking-[0.3em] mb-1"
              >
                ASTRO-ENGLISH IDENTITY
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight uppercase">
                {result.persona}
              </h2>
            </div>

            {/* Content Card */}
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden mb-8 bg-black/40 backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-just-orange/10 blur-[100px] -mr-32 -mt-32" />

              <div className="relative flex flex-col gap-8">
                {/* Zodiac Markers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-dark p-3 rounded-2xl border border-white/5 flex items-center gap-3 bg-white/5">
                    <div className="w-8 h-8 rounded-xl bg-just-purple/20 flex items-center justify-center text-just-purple shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-[8px] uppercase tracking-wider text-white/40">Управитель</div>
                      <div className="text-xs font-bold text-white truncate">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.ruler}</div>
                    </div>
                  </div>
                  <div className="glass-dark p-3 rounded-2xl border border-white/5 flex items-center gap-3 bg-white/5 text-left">
                    <div className="w-8 h-8 rounded-xl bg-just-orange/20 flex items-center justify-center text-just-orange shrink-0">
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Вогонь' && <Flame className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Земля' && <Mountain className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Повітря' && <Wind className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Вода' && <Droplets className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] uppercase tracking-wider text-white/40">Стихія</div>
                      <div className="text-xs font-bold text-white truncate">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element}</div>
                    </div>
                  </div>
                </div>

                {/* Main Body Text */}
                <div className="space-y-6 text-left">
                  <div className="text-just-orange font-bold italic text-base md:text-lg border-l-4 border-just-orange pl-4 py-1 leading-relaxed">
                    «{result.motto}»
                  </div>
                  
                  <div className="text-white/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {result.roast}
                  </div>
                </div>

                {/* Audit Section */}
                <div className="pt-8 border-t border-white/10 grid grid-cols-1 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#3B82F6] font-bold text-xs uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" />
                      Сильні сторони:
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      {result.audit.strengths}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-just-orange font-bold text-xs uppercase tracking-widest">
                      <AlertCircle className="w-4 h-4" />
                      Слабкі сторони:
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      {result.audit.weaknesses}
                    </p>
                  </div>
                </div>

                {/* Plan Section */}
                <div className="pt-8 border-t border-white/10 text-left">
                  <div className="flex items-center gap-2 text-just-yellow font-bold italic mb-4 text-sm md:text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>Твій план навчання на 16 тижнів:</span>
                  </div>
                  <div className="text-white/80 text-sm space-y-4 whitespace-pre-wrap leading-relaxed">
                    {result.advice}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Identity Image */}
            <div className="flex flex-col items-center gap-10 mb-12">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-just-orange via-just-purple to-just-yellow opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={result.imageUrl}
                    alt={result.persona}
                    className="w-full h-full object-cover transform scale-105"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-md space-y-4">
                <div className="grid grid-cols-3 gap-3">
                   <button 
                    onClick={() => shareToPlatform('telegram')}
                    className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all border border-white/5 active:scale-95 bg-white/5"
                   >
                     <Send className="w-6 h-6 text-[#229ED9]" />
                     <span className="text-[10px] uppercase font-bold text-white/50">TG</span>
                   </button>
                   <button 
                    onClick={() => shareToPlatform('instagram')}
                    className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all border border-white/5 active:scale-95 bg-white/5"
                   >
                     <MessageCircle className="w-6 h-6 text-[#E4405F]" />
                     <span className="text-[10px] uppercase font-bold text-white/50">IG</span>
                   </button>
                   <button 
                    onClick={() => shareToPlatform('tiktok')}
                    className="p-5 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all border border-white/5 active:scale-95 bg-white/5"
                   >
                     <Share2 className="w-6 h-6 text-[#00f2ea]" />
                     <span className="text-[10px] uppercase font-bold text-white/50">TikTok</span>
                   </button>
                </div>
                
                <button
                  onClick={reset}
                  className="w-full py-5 glass border border-white/10 text-white font-bold rounded-[1.5rem] hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-base active:scale-95 bg-white/5"
                >
                  <RefreshCw className="w-5 h-5" /> Пройти тест ще раз
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'lead' && (
          <motion.div
            key="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-center max-w-md w-full z-10 py-4 px-4 overflow-y-auto"
          >
            <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-just-orange mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Майже готово! ✨</h2>
                <p className="text-white/60 text-sm">Залиш контакти, щоб отримати свій зірковий розбір</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Твоє ім'я"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-base md:text-lg text-white"
                />
                <input
                  type="tel"
                  placeholder="+380..."
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-base md:text-lg text-white"
                />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange outline-none transition-all text-base md:text-lg text-white"
                />
                <button
                  type="submit"
                  className="w-full py-5 bg-just-orange text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg md:text-xl neon-glow-orange shadow-lg shadow-just-orange/20"
                >
                  Дізнатися тип
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 0, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
