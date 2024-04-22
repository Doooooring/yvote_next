import React, { useState } from 'react';
import styled from 'styled-components';
import { ResultAnswers } from '@components/analyze/result';
import typedquestions from './questions.json';

interface Question {
  id: number;
  category: keyof CategoryColors;
  detail: string;
  content: string;
}

interface QuestionnaireProps {
  onComplete: (finalAnswers: ResultAnswers) => void;
}

interface CategoryColors {
  정부의존성: string;
  이념성: string;
  보수성: string;
  정부불신: string;
}

type Category = keyof CategoryColors;

const questions: Question[] = typedquestions as Question[];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const batchSize = 3;
  const [currentBatchStartIndex, setCurrentBatchStartIndex] = useState(0);
  const [answers, setAnswers] = useState<ResultAnswers>([...Array(120
  )].map(() => 0));

  const handleAnswer = (index: number, answer: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const isLastBatch = currentBatchStartIndex + batchSize >= questions.length;

  const handleNext = () => {
    const nextBatchStartIndex = currentBatchStartIndex + batchSize;
    if (nextBatchStartIndex < questions.length) {
      setCurrentBatchStartIndex(nextBatchStartIndex);
    } else {
      onComplete([...answers]);
    }
  };

  const handlePrev = () => {
    const prevBatchStartIndex = currentBatchStartIndex - batchSize;
    if (prevBatchStartIndex >= 0) {
      setCurrentBatchStartIndex(prevBatchStartIndex);
    }
  };

  const currentQuestions = questions.slice(
    currentBatchStartIndex,
    currentBatchStartIndex + batchSize,
  );

  const categoryColors: CategoryColors = {
    정부의존성: '#4CAF50',
    이념성: '#FFC107',
    보수성: '#2196F3',
    정부불신: '#143225',
  };

  const getColorByCategory = (category: Category): string => {
    return categoryColors[category] || '#757575';
  };

  return (
    <Wrapper>
      {currentQuestions.length > 0 && (
        <div
          className="category-label"
          style={{ backgroundColor: getColorByCategory(currentQuestions[0].category) }}
        >
          {currentQuestions[0].category} - {currentQuestions[0].detail}
        </div>
      )}
      {currentQuestions.map((question, index) => (
        <div
          className="each"
          key={question.id}
          style={{ borderLeft: `12px solid ${getColorByCategory(question.category)}` }}
        >
          <h4>{question.content}</h4>
          <div className="select">
            <span>부정적</span>
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i + 1}
                className={
                  answers[currentBatchStartIndex + index] === i + 1 ? 'button-selected' : ''
                }
                onClick={() => handleAnswer(currentBatchStartIndex + index, i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <span>긍정적</span>
          </div>
        </div>
      ))}
      <button onClick={handlePrev} disabled={currentBatchStartIndex === 0}>
        Previous
      </button>
      {isLastBatch ? (
        <button onClick={() => onComplete([...answers])}>Finish</button>
      ) : (
        <button onClick={handleNext}>Next</button>
      )}
    </Wrapper>
  );
};

export default Questionnaire;

const Wrapper = styled.div`
  .category-label {
    display: inline-block;
    padding: 0 8px;
    line-height : 1.8rem;
    text-align: center;
    border-radius: 4px;
    margin: 40px auto 20px;
    font-weight: 550;
  }

  .each {
    border-radius: 10px;
    border: 1px solid rgba(200, 200, 200, 0.5);
    box-shadow: 0px 0px 35px -30px;
    margin-bottom: 30px;
    text-align: left;
    padding: 15px 30px;
    background-color: white;
    > h4 {
      text-align: left;
      border: 0;
      vertical-align: baseline;
      font-size: 15px;
      font-weight: 500;
      overflow: hidden;
      margin: 0;
      line-height: 2;
      word-break: keep-all;
    }
    .select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #666;
      font-size: 15px;
      font-weight: 500;
    }
  }

  .button-selected {
    background-color: lightblue;
    color: white; /* White text */
  }

  button {
    color: #666;
    padding: 8px 16px;
    margin: 5px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: white;
    &:hover {
      background-color: lightblue;
    }
    &:disabled {
      background-color: #ccc;
      color: #666;
      cursor: default;
      opacity: 0.5;
  }
`;
