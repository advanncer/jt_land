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
    <div className="min-h-screen flex flex-col justify-start items-center pt-16 pb-10 px-5 md:px-0 relative overflow-x-hidden font-sans">
      
      {/* 1. BACKGROUND LAYERS */}
      {/* Base Black */}
      <div className="fixed inset-0 bg-black -z-30"></div>
      
      {/* EdTech Gradient (Purple/Blue) */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black -z-20 pointer-events-none"></div>
      
      {/* Glow effects for depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      {/* Fixed Progress Bar (Absolute Top) */}
      {step > 1 && (
        <div className="absolute top-0 left-0 w-full h-[4px] bg-white/5 z-50">
          <div 
            className="h-full bg-brand-orange transition-all duration-300 ease-out shadow-[0_0_15px_rgba(241,102,0,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Main Container */}
      <div className="w-full max-w-[500px] mx-auto z-10 animate-fade-in-up">
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
