import React from 'react';

function Tabs({ subjects, activeTab, onTabClick }) {
  return (
    <div className="tabs">
      {subjects.map(subject => (
        <button
          key={subject.id}
          className={`tab-button${activeTab === subject.id ? ' active' : ''}`}
          onClick={() => onTabClick(subject.id)}
        >
          {subject.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
