import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const ResultCard = ({ result }) => {
  const { stats, rank } = result;
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const pieData = [
    { name: 'Correct', value: stats.correctAnswers, color: '#4CAF50' },
    { name: 'Wrong', value: stats.wrongAnswers, color: '#F44336' },
    { name: 'Skipped', value: stats.skippedQuestions, color: '#FFC107' }
  ];

  return (
    <div className="result-card">
      <h2>Quiz Results</h2>

      <div className="score-section">
        <div className="score-item">
          <h3>Final Score</h3>
          <div className="score-value">{stats.totalScore}</div>
        </div>
        <div className="score-item">
          <h3>Rank</h3>
          <div className="rank-value">#{rank}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <label>Total Questions</label>
          <value>{stats.totalQuestions}</value>
        </div>
        <div className="stat-item">
          <label>Attempted</label>
          <value>{stats.attemptedQuestions}</value>
        </div>
        <div className="stat-item">
          <label>Correct Answers</label>
          <value>{stats.correctAnswers}</value>
        </div>
        <div className="stat-item">
          <label>Wrong Answers</label>
          <value>{stats.wrongAnswers}</value>
        </div>
        <div className="stat-item">
          <label>Skipped</label>
          <value>{stats.skippedQuestions}</value>
        </div>
        <div className="stat-item">
          <label>Accuracy</label>
          <value>{stats.accuracy.toFixed(1)}%</value>
        </div>
        <div className="stat-item">
          <label>Time Taken</label>
          <value>{formatTime(result.totalTimeTaken)}</value>
        </div>
      </div>

      <div className="result-chart">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ResultCard.propTypes = {
  result: PropTypes.shape({
    stats: PropTypes.shape({
      totalQuestions: PropTypes.number.isRequired,
      attemptedQuestions: PropTypes.number.isRequired,
      correctAnswers: PropTypes.number.isRequired,
      wrongAnswers: PropTypes.number.isRequired,
      skippedQuestions: PropTypes.number.isRequired,
      accuracy: PropTypes.number.isRequired,
      totalScore: PropTypes.number.isRequired
    }).isRequired,
    totalTimeTaken: PropTypes.number.isRequired,
    rank: PropTypes.number.isRequired
  }).isRequired
};

export default ResultCard;