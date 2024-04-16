import React from 'react';

export type ResultAnswers = number[];

const Result = ({ answers }: { answers: ResultAnswers }) => {
  // Function to calculate scores based on question ranges
  const calculateScores = () => {
    let scores = [];
    for (let i = 0; i < answers.length; i += 30) {
      // Sum each set of three answers to create each score
      const score = answers.slice(i, i + 30).reduce((acc, current) => acc + current, 0);
      scores.push(score);
    }
    return scores;
  };

  const scores = calculateScores();

  return (
    <div>
      {scores.map((score, index) => (
        <p key={index}>
          Score {index + 1}: {score}
        </p>
      ))}
      <h2>Result: {'Eder'}</h2>{' '}
      {/* Assuming 'Eder' is a placeholder for some calculated result or title */}
    </div>
  );
};

export default Result;
