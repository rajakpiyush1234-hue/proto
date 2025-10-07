import React, { useState } from 'react';
import Tabs from './Tabs';

const subjects = [
  { id: 'math', label: 'Math' },
  { id: 'science', label: 'Science' },
  { id: 'english', label: 'English' },
  { id: 'history', label: 'History' },
];

const lessons = {
  math: (
    <div className="tab-content">
      <h3>Math Lessons</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=1XlT3Y2oyAU&list=PLU6SqdYcYsfI7Ebw_j-Vy8YKHdbHKP9am" target="_blank" rel="noopener noreferrer">Algebra Basics</a></li>
        <li><a href="https://www.youtube.com/watch?v=61v3B4_Pl-s&list=PLoMiZRRlvbStZ0GjUaV3-IsSIYgP14RWS" target="_blank" rel="noopener noreferrer">Geometry Fundamentals</a></li>
        <li><a href="https://www.youtube.com/watch?v=kcSMOgFRp6w&pp=ygUUdHJpZ25vbWV0cnkgY2xhc3MgMTE%3D" target="_blank" rel="noopener noreferrer">Trigonometry</a></li>
      </ul>
    </div>
  ),
  science: (
    <div className="tab-content">
      <h3>Science Lessons</h3>
      <ul>
        <li>Physics: Motion</li>
        <li>Chemistry: Periodic Table</li>
        <li>Biology: Human Anatomy</li>
      </ul>
    </div>
  ),
  english: (
    <div className="tab-content">
      <h3>English Lessons</h3>
      <ul>
        <li>Grammar Basics</li>
        <li>Vocabulary Building</li>
        <li>Essay Writing</li>
      </ul>
    </div>
  ),
  history: (
    <div className="tab-content">
      <h3>History Lessons</h3>
      <ul>
        <li>Ancient Civilizations</li>
        <li>Medieval History</li>
        <li>Modern History</li>
      </ul>
    </div>
  ),
};

function LiveLessons() {
  const [activeTab, setActiveTab] = useState('math');

  return (
    <section className="live-section">
      <div className="container">
        <h2>Live Lessons</h2>
        <p>Select a subject to view available lessons</p>
        <Tabs subjects={subjects} activeTab={activeTab} onTabClick={setActiveTab} />
        {lessons[activeTab]}
      </div>
    </section>
  );
}

export default LiveLessons;
