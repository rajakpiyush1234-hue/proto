import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Assessment() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📐',
      description: 'Test your mathematical skills from basic arithmetic to advanced calculus',
      difficulty: 'Medium',
      duration: '45 mins',
      questions: 25,
      topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus']
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      description: 'Evaluate your understanding of physics, chemistry, and biology concepts',
      difficulty: 'Hard',
      duration: '60 mins',
      questions: 30,
      topics: ['Physics', 'Chemistry', 'Biology', 'Environmental Science']
    },
    {
      id: 'english',
      name: 'English',
      icon: '📚',
      description: 'Assess your language proficiency in grammar, vocabulary, and comprehension',
      difficulty: 'Easy',
      duration: '40 mins',
      questions: 20,
      topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing']
    },
    {
      id: 'coding',
      name: 'Programming',
      icon: '💻',
      description: 'Test your coding skills and problem-solving abilities',
      difficulty: 'Medium',
      duration: '90 mins',
      questions: 15,
      topics: ['Python', 'JavaScript', 'Data Structures', 'Algorithms']
    }
  ];

  const handleStartAssessment = (subject) => {
    // Here you would typically navigate to the actual assessment
    alert(`Starting ${subject.name} assessment. This will be a ${subject.duration} test with ${subject.questions} questions.`);
  };

  return (
    <div className="assessment-page">
      <section className="assessment-hero">
        <div className="container">
          <h1>Skill Assessments</h1>
          <p>Test your knowledge and track your progress with our comprehensive assessments</p>
        </div>
      </section>

      <section className="assessment-content">
        <div className="container">
          <div className="assessment-grid">
            {subjects.map(subject => (
              <div 
                key={subject.id} 
                className={`assessment-card ${selectedSubject?.id === subject.id ? 'selected' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="assessment-card-header">
                  <span className="subject-icon">{subject.icon}</span>
                  <h2>{subject.name}</h2>
                </div>

                <div className="assessment-card-body">
                  <p className="description">{subject.description}</p>
                  
                  <div className="assessment-meta">
                    <div className="meta-item">
                      <span className="label">Difficulty:</span>
                      <span className={`value difficulty-${subject.difficulty.toLowerCase()}`}>
                        {subject.difficulty}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Duration:</span>
                      <span className="value">{subject.duration}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Questions:</span>
                      <span className="value">{subject.questions}</span>
                    </div>
                  </div>

                  <div className="topics-list">
                    <h3>Topics Covered:</h3>
                    <div className="topics-grid">
                      {subject.topics.map((topic, index) => (
                        <span key={index} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="assessment-card-footer">
                  <button 
                    className="start-assessment-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartAssessment(subject);
                    }}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Assessment;