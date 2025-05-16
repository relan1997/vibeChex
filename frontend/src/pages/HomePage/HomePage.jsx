import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const timestamp = Date.now(); // current time in ms
    navigate(`/${timestamp}/questions`);
  };

  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={handleNavigate}>Go to Questions</button>
    </div>
  );
};

export default HomePage;
