import React from "react";
import { quizData } from "./data";

interface QuizProps {
  step: number;
  onNextStep: (answers?: string[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ step, onNextStep }) => {
  const currentStepData = quizData.find((item) => item.step === step);
  const [selectedAnswers, setSelectedAnswers] = React.useState<string[]>([]);

  if (!currentStepData) {
    return <div>Quiz finished!</div>;
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
  };
  
  const isCtaStep = !currentStepData.answers && currentStepData.cta;

  return (
    <div className="quiz-item">
      <h1>{currentStepData.question}</h1>
      {currentStepData.description && <p>{currentStepData.description}</p>}

      {currentStepData.answers && (
        <div className="answers-wrapper">
          {currentStepData.answers.map((answer) => (
            <div
              key={answer.text}
              className={`answer-item ${
                selectedAnswers.includes(answer.text) ? "selected" : ""
              }`}
              onClick={() => handleAnswerClick(answer.text)}
            >
              {answer.text}
            </div>
          ))}
        </div>
      )}

      {currentStepData.form && (
        <div className="form-item">
            <div className="form-field">
                <label htmlFor="name">Імʼя</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className="form-field">
                <label htmlFor="phone">Телефон</label>
                <input type="tel" id="phone" name="phone" required />
            </div>
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
        </div>
      )}

      {currentStepData.cta && (
        <button
          onClick={handleNextClick}
          disabled={currentStepData.multiselect && selectedAnswers.length === 0 && !isCtaStep}
        >
          {currentStepData.cta}
        </button>
      )}
    </div>
  );
};

export default Quiz;

