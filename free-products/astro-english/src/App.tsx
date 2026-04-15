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
  Droplets
} from 'lucide-react';
import { ZODIAC_SIGNS, QUESTIONS } from './constants';
import { ZodiacSign, QuizResult } from './types';
import { getAstroResult } from './services/resultService';
import ReactMarkdown from 'react-markdown';

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

  // Loading animation logic
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
      // Don't change step here, just trigger result generation
      processResult();
      setStep('loading');
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
    <div className="h-[100dvh] w-full bg-[#050505] relative overflow-hidden flex flex-col items-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-just-blue/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-just-orange/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl text-center z-10 w-full"
          >
            <div className="mb-4 md:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative inline-block"
              >
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-just-orange" />
                <div className="absolute inset-0 blur-lg bg-just-orange/30" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-7xl font-display font-bold mb-4 md:mb-6 tracking-tight leading-tight">
              Хто твоє мовне <span className="text-just-orange text-glow-orange">альтер-его</span> за зодіаком?
            </h1>
            <p className="text-base md:text-xl text-white/60 mb-8 md:mb-10 max-w-lg mx-auto">
              Дізнайся свій зірковий діагноз та отримай персоналізований рознос від нашого AI-астролога.
            </p>
            <button
              onClick={handleStart}
              className="group relative px-6 py-4 md:px-8 md:py-4 bg-just-orange text-white font-bold rounded-full text-lg md:text-xl transition-all hover:scale-105 active:scale-95 neon-glow-orange shadow-lg shadow-just-orange/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Запитати у зірок <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
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
            className="flex-1 flex flex-col w-full max-w-5xl z-10 pt-4 pb-8"
          >
            <div className="text-center mb-6 shrink-0">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">Обери свій знак</h2>
              <p className="text-white/50 text-sm">Зірки вже готові до твого розносу</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 pb-4">
                {ZODIAC_SIGNS.map((zodiac) => (
                  <motion.button
                    key={zodiac.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleZodiacSelect(zodiac.id)}
                    className="glass p-4 md:p-6 rounded-2xl flex flex-col items-center gap-2 md:gap-3 transition-all hover:bg-white/20 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-just-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{zodiac.icon}</span>
                    <div className="text-center">
                      <div className="font-bold text-xs md:text-sm whitespace-nowrap uppercase tracking-wider">{zodiac.label}</div>
                    </div>
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
            className="flex-1 flex flex-col justify-center max-w-xl w-full z-10 pt-4"
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

            <div className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden max-h-[80vh] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10 shrink-0">
                <motion.div
                  className="h-full bg-just-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-snug shrink-0">
                {QUESTIONS[currentQuestionIndex].question}
              </h3>

              <div className="space-y-2 md:space-y-3 overflow-y-auto pr-1 custom-scrollbar">
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
            className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-md w-full"
          >
            <div className="mb-6 md:mb-8 relative inline-block">
              <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-just-orange animate-spin" />
              <div className="absolute inset-0 blur-xl bg-just-orange/20" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Аналізуємо твій шлях...</h2>
            <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-just-orange to-just-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white/60 italic text-sm md:text-base px-4">
              {loadingProgress < 30 && "Зіставляємо твої Меркурії з рівнем Grammar..."}
              {loadingProgress >= 30 && loadingProgress < 70 && "Аналізуємо твій мовний потенціал."}
              {loadingProgress >= 70 && "Фіналізуємо твій мовний діагноз..."}
            </p>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col w-full max-w-3xl z-10 overflow-y-auto custom-scrollbar pt-4 pb-20"
          >
            <div className="text-center mb-4 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-just-yellow font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] mb-1"
              >
                Astro-English Identity
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                {result.persona}
              </h2>
            </div>

            <div className="glass p-5 md:p-6 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-just-orange/5 blur-[80px] -mr-24 -mt-24" />

              <div className="relative space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-dark p-3 rounded-2xl border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-just-purple/20 flex items-center justify-center text-just-purple shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-white/40 truncate">Управитель</div>
                      <div className="text-xs md:text-sm font-bold text-white truncate">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.ruler}</div>
                    </div>
                  </div>
                  <div className="glass-dark p-3 rounded-2xl border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-just-orange/20 flex items-center justify-center text-just-orange shrink-0">
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Вогонь' && <Flame className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Земля' && <Mountain className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Повітря' && <Wind className="w-4 h-4" />}
                      {selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element === 'Вода' && <Droplets className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-white/40 truncate">Стихія</div>
                      <div className="text-xs md:text-sm font-bold text-white truncate">{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.element}</div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed prose-p:mb-3 last:prose-p:mb-0">
                  <div className="text-just-orange font-bold italic mb-4 text-[10px] md:text-xs border-l-2 border-just-orange pl-3 py-1 uppercase tracking-tight">
                    «{selectedZodiac && ZODIAC_SIGNS.find(z => z.id === selectedZodiac)?.metaphor}»
                  </div>
                  <div className="text-sm md:text-base">
                    <ReactMarkdown>{result.roast}</ReactMarkdown>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-just-yellow font-bold italic mb-2 text-xs md:text-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Твій план навчання:</span>
                  </div>
                  <div className="prose prose-invert prose-yellow prose-xs sm:prose-sm max-w-none text-white/80 prose-li:my-1">
                    <ReactMarkdown>{result.advice}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-just-orange via-just-purple to-just-yellow opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={result.imageUrl}
                    alt={result.persona}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm px-4">
                <button className="flex-1 px-6 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm">
                  <Share2 className="w-4 h-4" /> Поділитися
                </button>
                <button
                  onClick={reset}
                  className="flex-1 px-6 py-4 border border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Ще раз
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
            className="flex-1 flex flex-col justify-center max-w-md w-full z-10 py-4"
          >
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-just-orange/30 relative overflow-hidden flex flex-col overflow-y-auto max-h-full custom-scrollbar">
              <div className="absolute top-0 right-0 w-32 h-32 bg-just-orange/10 blur-3xl rounded-full -mr-16 -mt-16" />

              <div className="text-center mb-6 shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-just-orange/20 rounded-2xl mb-4">
                  <Sparkles className="w-6 h-6 md:w-8 h-8 text-just-orange" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Майже готово! ✨</h2>
                <p className="text-white/60 text-sm">Залиш контакти, щоб отримати свій зірковий розбір</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-3 md:space-y-4 shrink-0">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Ім'я</label>
                  <input
                    type="text"
                    placeholder="Твоє ім'я"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange focus:bg-white/10 outline-none transition-all text-base md:text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+380..."
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange focus:bg-white/10 outline-none transition-all text-base md:text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email</label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 focus:border-just-orange focus:bg-white/10 outline-none transition-all text-base md:text-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 px-6 py-4 md:px-8 md:py-5 bg-just-orange text-white font-bold rounded-xl md:rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-lg md:text-xl neon-glow-orange shadow-lg shadow-just-orange/20"
                >
                  Дізнатися тип <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </form>

              <button
                onClick={() => setStep('quiz')}
                className="w-full mt-4 text-center text-white/30 hover:text-white transition-colors text-xs flex items-center justify-center gap-2 shrink-0"
              >
                <ArrowLeft className="w-3 h-3" /> Назад до тесту
              </button>
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
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
