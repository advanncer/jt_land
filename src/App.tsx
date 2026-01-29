import React, { useState } from "react";
import Quiz from "./Quiz";
import { quizData } from "./data";
import "./App.css";

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [_answers, setAnswers] = useState<Record<number, string[]>>({});

  const totalSteps = quizData.length;
  const progress = step === 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;

  const handleNextStep = (stepAnswers?: string[]) => {
    if (stepAnswers) {
      setAnswers((prev) => ({ ...prev, [step]: stepAnswers }));
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-x-hidden">
      <div className="bg-abstraction"></div>
      
      <div className="w-full max-max-w-[600px] mx-auto z-10 animate-fade-in-up">
        {step > 1 && (
          <div className="w-full mb-12">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[12px] font-bold uppercase tracking-widest text-white/40">Progress</span>
              <span className="text-[12px] font-bold text-brand-orange uppercase tracking-tighter">Step {step - 1} / {totalSteps - 1}</span>
            </div>
            <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-orange transition-all duration-700 ease-out shadow-[0_0_10px_rgba(241,102,0,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
