import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';

const Quiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [questionTimers, setQuestionTimers] = useState({});

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('/api/quiz/start');
        setQuizData(response.data.data);
        setTimeLeft(response.data.data.totalTime);
        setQuestionTimeLeft(response.data.data.questions[0].timeLimit);
        setQuizStartTime(new Date());
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading quiz');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  // Handle quiz timer
  useEffect(() => {
    if (!timeLeft || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizData]);

  // Handle question timer
  useEffect(() => {
    if (!questionTimeLeft || !quizData) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentQuestion < quizData.questions.length - 1) {
            handleNextQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimeLeft, currentQuestion, quizData]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    const now = new Date();
    const timeTaken = Math.round((now - (questionTimers[questionId] || now)) / 1000);

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOption,
        timeTaken
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextQuestion = quizData.questions[currentQuestion + 1];
      setQuestionTimeLeft(nextQuestion.timeLimit);
      setQuestionTimers(prev => ({
        ...prev,
        [nextQuestion._id]: new Date()
      }));
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevQuestion = quizData.questions[currentQuestion - 1];
      setQuestionTimeLeft(prevQuestion.timeLimit);
    }
  };

  const handleQuizSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, data]) => ({
        questionId,
        selectedOption: data.selectedOption,
        timeTaken: data.timeTaken
      }));

      const response = await axios.post('/api/quiz/submit', {
        subject: quizData.subject,
        answers: formattedAnswers,
        quizStartTime,
        quizEndTime: new Date(),
        difficulty: quizData.difficulty
      });

      setQuizResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryQuiz = () => {
    window.location.reload();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!quizData) return null;

  if (quizResult) {
    return (
      <div className="quiz-result">
        <ResultCard result={quizResult} />
        
        <div className="statistics-chart">
          <h3>Quiz Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: 'Correct',
                  value: quizResult.stats.correctAnswers,
                  fill: '#4CAF50'
                },
                {
                  name: 'Wrong',
                  value: quizResult.stats.wrongAnswers,
                  fill: '#F44336'
                },
                {
                  name: 'Skipped',
                  value: quizResult.stats.skippedQuestions,
                  fill: '#FFC107'
                }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button 
          onClick={handleRetryQuiz}
          className="retry-button"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Timer seconds={timeLeft} label="Quiz Time Remaining" />
        <Timer seconds={questionTimeLeft} label="Question Time" />
      </div>

      <div className="quiz-progress">
        Question {currentQuestion + 1} of {quizData.questions.length}
      </div>

      <QuestionCard
        question={question}
        selectedOption={userAnswers[question._id]?.selectedOption}
        onAnswerSelect={(option) => handleAnswerSelect(question._id, option)}
      />

      <div className="quiz-navigation">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          className="nav-button"
        >
          Previous
        </button>

        {currentQuestion === quizData.questions.length - 1 ? (
          <button
            onClick={() => handleQuizSubmit(false)}
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="nav-button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;