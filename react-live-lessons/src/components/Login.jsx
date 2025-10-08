import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server response was not JSON');
      }

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success message and redirect
      alert('Login successful!');
      navigate('/live');
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="container">
        <h2>Login to VidyaVatika</h2>
        <p>Welcome back! Please enter your credentials to continue</p>
        
        <form onSubmit={handleSubmit} className="register-form login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="auth-switch">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;