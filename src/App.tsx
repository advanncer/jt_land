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
    <div className="quiz-container">
      {step > 1 && (
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          <div className="progress-text">Крок {step - 1} з {totalSteps - 1}</div>
        </div>
      )}
      <Quiz step={step} onNextStep={handleNextStep} />
    </div>
  );
};

export default App;
