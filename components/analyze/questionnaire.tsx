import { ResultAnswers } from '@components/analyze/result';
import React, { useState } from 'react';
import styled from 'styled-components';
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
  정부신뢰도: string;
}

type Category = keyof CategoryColors;

const questions: Question[] = typedquestions as Question[];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const batchSize = 3;
  const [currentBatchStartIndex, setCurrentBatchStartIndex] = useState(0);
  const [answers, setAnswers] = useState<ResultAnswers>([...Array(120)].map(() => -1));

  const handleAnswer = (index: number, answer: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const areAllAnswered = () => {
    const end = Math.min(currentBatchStartIndex + batchSize, questions.length);
    return answers.slice(currentBatchStartIndex, end).every((answer) => answer !== -1);
  };

  const handleNext = () => {
    const nextBatchStartIndex = currentBatchStartIndex + batchSize;
    if (nextBatchStartIndex < questions.length) {
      setCurrentBatchStartIndex(nextBatchStartIndex);
    } else {
      onComplete(answers);
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
    정부신뢰도: '#666666',
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
            {Array.from({ length: 6 }, (_, i) => (
              <button
                key={i}
                className={answers[currentBatchStartIndex + index] === i ? 'button-selected' : ''}
                onClick={() => handleAnswer(currentBatchStartIndex + index, i)}
                style={{
                  backgroundColor:
                    answers[currentBatchStartIndex + index] === i
                      ? getColorByCategory(question.category)
                      : 'white',
                  color: answers[currentBatchStartIndex + index] === i ? 'white' : '#666',
                  borderColor: getColorByCategory(question.category),
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = getColorByCategory(question.category);
                  event.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor =
                    answers[currentBatchStartIndex + index] === i
                      ? getColorByCategory(question.category)
                      : 'white';
                  event.currentTarget.style.color =
                    answers[currentBatchStartIndex + index] === i ? 'white' : '#666';
                }}
              >
                {i}
              </button>
            ))}
            <span>긍정적</span>
          </div>
        </div>
      ))}
      <button onClick={handlePrev} disabled={currentBatchStartIndex === 0}>
        Previous
      </button>
      <button onClick={handleNext} disabled={!areAllAnswered()}>
        {currentBatchStartIndex + batchSize >= questions.length ? 'Finish' : 'Next'}
      </button>
    </Wrapper>
  );
};

export default Questionnaire;

const Wrapper = styled.div`
  padding-bottom: 200px;

  font-size: 15px;
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }

  .category-label {
    display: inline-block;
    padding: 0.1rem 0.6rem;
    line-height: 1.8rem;
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
      span {
        text-align: center;
      }
    }
  }

  button {
    color: #777;
    padding: 8px 16px;
    margin: 5px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: white;
    &:hover {
      color: black;
    }
    &:disabled {
      background-color: #ccc;
      color: #666;
      cursor: default;
      opacity: 0.5;
    }
  }
`;
