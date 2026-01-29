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
    <div className="min-h-screen flex flex-col justify-start items-center pt-20 pb-10 px-5 md:px-0 relative overflow-x-hidden bg-brand-black font-sans">
      
      {/* Fixed Progress Bar (Absolute Top) */}
      {step > 1 && (
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#1a1a1a] z-50">
          <div 
            className="h-full bg-brand-orange transition-all duration-300 ease-out shadow-[0_0_15px_rgba(241,102,0,0.6)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Background Abstraction */}
      <div className="bg-abstraction"></div>
      
      {/* Main Container */}
      <div className="w-full max-w-[500px] mx-auto z-10 animate-fade-in-up">
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
