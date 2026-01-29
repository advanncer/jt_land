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
  const isFirstStep = step === 1;

  return (
    <div className="quiz-item">
      <h1>{currentStepData.question}</h1>
      {currentStepData.description && <p>{currentStepData.description}</p>}

      {isFirstStep && (
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              {/* Flag/Language Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <span>Навчаємо більше 8 років</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              {/* Message/Speaking Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span>15 000 активних студентів щомісяця</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              {/* Graduation Cap Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <span>Більше 100 000 студентів успішно закінчили навчання</span>
          </div>
        </div>
      )}

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
          className={isFirstStep ? "pulse-button" : ""}
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
