import React, { useState } from "react";
import Quiz from "./Quiz";
import { quizData } from "./data";
import "./App.css";

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [_answers, setAnswers] = useState<Record<number, string[]>>({});

  const totalSteps = quizData.length;
  // Progress starts counting from step 2 for the UI
  const progress = step === 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;

  const handleNextStep = (stepAnswers?: string[]) => {
    if (stepAnswers) {
      setAnswers((prev) => ({ ...prev, [step]: stepAnswers }));
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-x-hidden bg-brand-black">
      {/* Fixed Progress Bar */}
      {step > 1 && (
        <div className="absolute top-0 left-0 w-full h-[6px] bg-brand-input z-50">
          <div 
            className="h-full bg-brand-orange transition-all duration-500 ease-out shadow-[0_0_15px_rgba(241,102,0,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Background Abstraction */}
      <div className="bg-abstraction"></div>
      
      <div className="w-full max-w-[600px] mx-auto z-10 animate-fade-in-up pt-8">
        {step > 1 && (
          <div className="w-full mb-8 text-right">
             <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Крок {step - 1} / {totalSteps - 1}</span>
          </div>
        )}
        
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
