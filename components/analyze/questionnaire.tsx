import React, { useState } from 'react';
import styled from 'styled-components';
import { ResultAnswers } from '@components/analyze/result';
import ImageFallback from '@components/common/imageFallback';

interface Question {
  id: number;
  category: string;
  content: string;
}

interface QuestionnaireProps {
  onComplete: (finalAnswers: ResultAnswers) => void;
}

const questions: Question[] = [
  {
    id: 1,
    category: 'trustgov',
    content: '정부가 개인의 무기 소지를 금지하고, 보호자의 역할을 대신했으면 좋겠다.',
  },
  {
    id: 2,
    category: 'trustgov',
    content: '정부가 국민에게 폭력에 대한 죄책감이나 부정적인 인식을 주입했으면 좋겠다.',
  },
  {
    id: 3,
    category: 'trustgov',
    content:
      '신체적 폭력은 아니지만 마음의 상처가 되는 언어적 표현이나 행동을 정부가 금지했으면 좋겠다.',
  },
  {
    id: 4,
    category: 'trustgov',
    content: '정부가 국민의 건강을 위해 의무적으로 보험에 가입시키면 좋겠다.',
  },
  {
    id: 5,
    category: 'trustgov',
    content: '정부가 국민의 안전을 걱정하여 위험한 행동을 제한해줬으면 좋겠다.',
  },
  {
    id: 6,
    category: 'political',
    content: '국민들이 삶의 의미나 의지를 찾을 수 있도록 정부가 도와줬으면 좋겠다.',
  },
  {
    id: 7,
    category: 'political',
    content: '많은 국민이 전망이 좋은 진로를 선택하도록 정부가 유도해줬으면 좋겠다.',
  },
  {
    id: 8,
    category: 'political',
    content: '민간에서 고용되지 않는 사람은 정부가 능력을 키워주거나 직접 고용해줬으면 좋겠다.',
  },
  {
    id: 9,
    category: 'political',
    content:
      '수익 창출을 직접 고민할 필요 없이 출근해서 임금을 받을 수 있는 일자리가 사라지지 않도록 정부가 지켜줬으면 좋겠다.',
  },
  {
    id: 10,
    category: 'ideology',
    content: '노동자들이 낮은 임금을 받고도 일하려는 경쟁을 정부가 나서서 제한해줬으면 좋겠다.',
  },
  {
    id: 11,
    category: 'ideology',
    content:
      '청소년들의 입시 경쟁을 완화하기 위해 공부의 시간이나 양, 평가 방식을 정부가 규제해줬으면 좋겠다.',
  },
  {
    id: 12,
    category: 'ideology',
    content:
      '특정 지역에 살고자 하는 국민들의 경쟁이 너무 심해지지 않도록 정부가 제한해줬으면 좋겠다.',
  },
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const batchSize = 3;
  const [currentBatchStartIndex, setCurrentBatchStartIndex] = useState(0);
  const [answers, setAnswers] = useState<ResultAnswers>([...Array(120)].map(() => 0));

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

  return (
    <Wrapper>
      {currentQuestions.length > 0 && (
        <div className="category-label">{currentQuestions[0].category}</div>
      )}
      {currentQuestions.map((question, index) => (
        <div className="each" key={question.id}>
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
  }
`;
