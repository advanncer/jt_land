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
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4 md:px-0 relative overflow-hidden font-sans selection:bg-brand-orange/30">
      
      {/* --- MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 bg-black -z-50"></div>
      
      {/* Orange Blob (Top Left) */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/20 blur-[120px] rounded-full -z-40 pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      
      {/* Purple Blob (Bottom Right) */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full -z-40 pointer-events-none mix-blend-screen"></div>

      {/* Noise Texture (Optional for extra polish) */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-30 pointer-events-none"></div>

      {/* Fixed Progress Bar (Glass Style) */}
      {step > 1 && (
        <div className="fixed top-0 left-0 w-full h-[6px] bg-white/5 backdrop-blur-md z-50 border-b border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(241,102,0,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Main Container */}
      <div className="w-full max-w-[550px] mx-auto z-10 animate-fade-in-up">
        <Quiz step={step} onNextStep={handleNextStep} />
      </div>
    </div>
  );
};

export default App;
