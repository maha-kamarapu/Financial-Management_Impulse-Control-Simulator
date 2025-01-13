import React, { useState } from 'react';

const FinancialLiteracyGame = () => {
  const [score, setScore] = useState(0);

  const handleCorrectAnswer = () => {
    setScore(score + 1);
  };

  return (
    <div>
      <h2>Financial Literacy Game</h2>
      <p>What is the best way to save for a goal?</p>
      <button onClick={handleCorrectAnswer}>Save Regularly</button>
      <p>Your Score: {score}</p>
    </div>
  );
}

export default FinancialLiteracyGame;
