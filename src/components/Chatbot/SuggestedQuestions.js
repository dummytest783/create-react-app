import React from 'react';

const SUGGESTED_QUESTIONS = [
  "What is P/E ratio?",
  "Explain return on equity (ROE)",
  "How do you calculate profit margin?",
  "What's the difference between revenue and profit?",
  "What is market capitalization?",
  "Explain debt-to-equity ratio",
  "What is free cash flow?",
  "How to read a balance sheet?"
];

const SuggestedQuestions = ({ onQuestionClick, limit = 4 }) => {
  const questions = SUGGESTED_QUESTIONS.slice(0, limit);

  return (
    <div className="suggested-questions">
      <div className="suggested-questions__label">Quick questions:</div>
      <div className="suggested-questions__grid">
        {questions.map((question, index) => (
          <button
            key={index}
            className="suggested-questions__chip"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
