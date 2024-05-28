import styled from 'styled-components';
import React, { useState } from 'react';
import Questionnaire from '@components/analyze/questionnaire';
import Result, { ResultAnswers } from '@components/analyze/result';

export default function Analyze() {
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<ResultAnswers | null>(null);

  const handleComplete = (finalAnswers: ResultAnswers) => {
    setAnswers(finalAnswers);
    setCompleted(true);
  };

  return (
    <Wrapper>
      <MainContents>
        {!completed ? (
          <Questionnaire onComplete={handleComplete} />
        ) : (
          answers && <Result answers={answers} />
        )}
      </MainContents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MainContents = styled.div`
  width: 70%;
  min-width: 800px;
  padding-bottom: 100px;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0;
  }
`;
