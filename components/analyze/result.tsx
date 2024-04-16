import React from 'react';

export type ResultAnswers = number[];

const Result = ({ answers }: { answers: ResultAnswers }) => {
  return (
    <div>
      {answers.slice(0, 12).map((answer, index) => (
        <p key={index}>
          Question {index + 1}: {answer}
        </p>
      ))}
      <h2>Result: {'Eder'}</h2>
    </div>
  );
};

export default Result;
