import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to VidyaVatika</h1>
            <p className="hero-subtitle">Empowering minds through interactive online education</p>
            <Link to="/register" className="cta-button">Start Learning Today</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            <div className="category-card digital-skills">
              <div className="category-icon">💻</div>
              <h3>Digital Skills</h3>
              <ul>
                <li>Web Development</li>
                <li>Digital Marketing</li>
                <li>Data Science</li>
                <li>Graphic Design</li>
              </ul>
              <Link to="/register" className="category-button">Explore Digital Skills</Link>
            </div>

            <div className="category-card languages">
              <div className="category-icon">🌎</div>
              <h3>Languages</h3>
              <ul>
                <li>English</li>
                <li>Spanish</li>
                <li>French</li>
                <li>German</li>
              </ul>
              <Link to="/register" className="category-button">Learn Languages</Link>
            </div>

            <div className="category-card assessment">
              <div className="category-icon">📝</div>
              <h3>Assessment</h3>
              <ul>
                <li>Skill Evaluation</li>
                <li>Progress Tracking</li>
                <li>Performance Analysis</li>
                <li>Certification Tests</li>
              </ul>
              <Link to="/assessment" className="category-button">Take Assessment</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose VidyaVatika?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Expert Teachers</h3>
              <p>Learn from experienced educators passionate about student success</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Interactive Learning</h3>
              <p>Engage in dynamic, interactive online sessions that make learning fun</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Personalized Attention</h3>
              <p>Get individual attention and support in small group sessions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Flexible Schedule</h3>
              <p>Choose from multiple time slots that suit your schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section">
        <div className="container">
          <h2 className="section-title">Our Subjects</h2>
          <div className="subjects-grid">
            <Link to="/live" className="subject-card math">
              <h3>Mathematics</h3>
              <p>Algebra, Geometry, Trigonometry</p>
            </Link>
            <Link to="/live" className="subject-card science">
              <h3>Science</h3>
              <p>Physics, Chemistry, Biology</p>
            </Link>
            <Link to="/live" className="subject-card english">
              <h3>English</h3>
              <p>Grammar, Literature, Writing</p>
            </Link>
            <Link to="/live" className="subject-card history">
              <h3>History</h3>
              <p>World History, Civilizations</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students already learning with VidyaVatika</p>
            <Link to="/register" className="cta-button">Register Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;