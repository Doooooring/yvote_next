import Questionnaire from '@components/analyze/questionnaire';
import Result, { ResultAnswers } from '@components/analyze/result';
import { useState } from 'react';
import HeadMeta from '@components/common/HeadMeta';
import styled from 'styled-components';

export default function Analyze() {
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<ResultAnswers | null>(null);

  const handleComplete = (finalAnswers: ResultAnswers) => {
    setAnswers(finalAnswers);
    setCompleted(true);
  };

  const metaTagsProps = {
    title: '와이보트 가치관 테스트',
    description: '120개의 질문으로 나의 정치성향을 알아보세요',
    url: `https://yvoting.com/analyze`,
  };

  return (
    <Wrapper>
      <HeadMeta {...metaTagsProps} />
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
