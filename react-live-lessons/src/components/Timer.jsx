import React from 'react';
import PropTypes from 'prop-types';

const Timer = ({ seconds, label }) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getColorClass = (timeLeft) => {
    if (timeLeft <= 10) return 'timer-critical';
    if (timeLeft <= 30) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div className="timer-container">
      <div className="timer-label">{label}</div>
      <div className={`timer-value ${getColorClass(seconds)}`}>
        {formatTime(seconds)}
      </div>
    </div>
  );
};

Timer.propTypes = {
  seconds: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

export default Timer;