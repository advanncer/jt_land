import React, { useState } from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

const EnglishBooster: React.FC = () => {
  const boosters = [
    { icon: "🇬🇧", title: "Word of the moment", text: "Did you know? 'Eunoia' is the shortest English word that contains all five main vowels. It means 'beautiful thinking'." },
    { icon: "🔥", title: "Motivation Fact", text: "English is the official language of 67 countries. You are opening doors to the whole world!" },
    { icon: "🇬🇧", title: "Idiom of the day", text: "'Break the ice' means to start a conversation in a social situation where people are feeling shy." },
    { icon: "⚡", title: "Quick Tip", text: "Thinking in English, not translating from your native language, is the fastest way to fluency." }
  ];
  
  const randomBooster = boosters[Math.floor(Math.random() * boosters.length)];

  return (
    <div className="mt-8 p-5 glass-card animate-fade-in-up">
      <div className="flex items-start gap-4">
        <span className="text-2xl">{randomBooster.icon}</span>
        <div className="text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{randomBooster.title}</h4>
          <p className="text-sm text-white/60 leading-relaxed">{randomBooster.text}</p>
        </div>
      </div>
    </div>
  );
};

const Quiz: React.FC<QuizProps> = ({ step, onNextStep }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  if (!currentStepData) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold mb-4">You're ready!</h1>
        <p className="text-white/60">Our manager will contact you shortly.</p>
      </div>
    );
  }

  const handleAnswerClick = (answer: string) => {
    if (currentStepData.multiselect) {
      setSelectedAnswers((prev) =>
        prev.includes(answer)
          ? prev.filter((a) => a !== answer)
          : [...prev, answer]
      );
    } else {
      onNextStep([answer]);
    }
  };

  const handleNextClick = () => {
    onNextStep(selectedAnswers);
    setSelectedAnswers([]);
  };

  const isCtaStep = !currentStepData.answers && currentStepData.cta;
  const isFirstStep = step === 1;
  const isEvenStep = step % 2 === 0;

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight text-center">
        {currentStepData.question}
      </h1>
      
      {currentStepData.description && (
        <p className="text-lg text-white/70 mb-10 max-w-[500px] text-center font-medium">
          {currentStepData.description}
        </p>
      )}

      {isFirstStep && (
        <div className="flex flex-col gap-4 mb-10 w-full max-w-[450px]">
          <div className="flex items-center gap-4 p-4 glass-card">
            <div className="w-12 h-12 flex items-center justify-center bg-brand-orange/10 rounded-xl text-brand-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <span className="font-semibold text-white/90">Навчаємо більше 8 років</span>
          </div>
          <div className="flex items-center gap-4 p-4 glass-card">
            <div className="w-12 h-12 flex items-center justify-center bg-brand-orange/10 rounded-xl text-brand-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="font-semibold text-white/90">15 000 активних студентів щомісяця</span>
          </div>
          <div className="flex items-center gap-4 p-4 glass-card">
            <div className="w-12 h-12 flex items-center justify-center bg-brand-orange/10 rounded-xl text-brand-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <span className="font-semibold text-white/90 text-left">Більше 100 000 студентів успішно закінчили навчання</span>
          </div>
        </div>
      )}

      {currentStepData.answers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-10">
          {currentStepData.answers.map((answer) => (
            <button
              key={answer.text}
              className={`p-5 text-left rounded-2xl border-2 transition-all duration-300 font-bold ${
                selectedAnswers.includes(answer.text)
                  ? "bg-brand-orange border-brand-orange text-black shadow-[0_0_20px_rgba(241,102,0,0.3)]"
                  : "bg-brand-card border-white/5 text-white/80 hover:border-brand-orange/40 hover:text-white"
              }`}
              onClick={() => handleAnswerClick(answer.text)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      )}

      {currentStepData.form && (
        <div className="flex flex-col gap-4 w-full max-w-[400px] mb-10">
          <input type="text" placeholder="Імʼя" className="input-field" required />
          <input type="tel" placeholder="Телефон" className="input-field" required />
          <input type="email" placeholder="Email" className="input-field" required />
        </div>
      )}

      {currentStepData.cta && (
        <div className="w-full max-w-[320px]">
          <button
            className={`btn-primary ${isFirstStep ? "animate-pulse-slow" : ""}`}
            onClick={handleNextClick}
            disabled={currentStepData.multiselect && selectedAnswers.length === 0 && !isCtaStep}
          >
            {currentStepData.cta}
          </button>
          
          {isEvenStep && <EnglishBooster />}
        </div>
      )}
    </div>
  );
};

export default Quiz;
