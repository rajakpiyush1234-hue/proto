import React from 'react';
import PropTypes from 'prop-types';

const QuestionCard = ({ question, selectedOption, onAnswerSelect }) => {
  return (
    <div className="question-card">
      <h3 className="question-text">{question.questionText}</h3>
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`option-button ${selectedOption === index ? 'selected' : ''}`}
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="question-meta">
        <span className="difficulty">Difficulty: {question.difficulty}</span>
        <span className="points">Points: {question.points}</span>
      </div>
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    questionText: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired
      })
    ).isRequired,
    difficulty: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired
  }).isRequired,
  selectedOption: PropTypes.number,
  onAnswerSelect: PropTypes.func.isRequired
};

export default QuestionCard;