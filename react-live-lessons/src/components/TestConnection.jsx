import React, { useState, useEffect } from 'react';

function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(data => {
        setStatus('Server connected! ' + data.message);
        setError(null);
      })
      .catch(err => {
        setError('Connection failed: ' + err.message);
        setStatus('Failed');
      });
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Server Connection Test</h2>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Status:</strong> {status}</p>
        {error && (
          <p style={{ color: 'red' }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <h3>Debugging Steps:</h3>
        <ol>
          <li>Make sure MongoDB is running (mongod command)</li>
          <li>Check if server is running on port 5000</li>
          <li>Verify no other application is using port 5000</li>
          <li>Check server console for any error messages</li>
        </ol>
      </div>
    </div>
  );
}

export default TestConnection;