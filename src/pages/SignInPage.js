import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setName }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (input.trim() === '') {
      setError(true);
    } else {
      setName(input);
      navigate('/suggestions');
    }
  };

  return (
    <div className="main-container">
      <h1>Welcome! Please Sign In</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>Please enter your name</p>}
      <button onClick={handleSubmit}>Give me my suggestions!</button>
    </div>
  );
};

export default SignIn;
