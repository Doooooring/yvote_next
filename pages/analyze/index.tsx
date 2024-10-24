import Questionnaire from '@components/analyze/questionnaire';
import Result, { ResultAnswers } from '@components/analyze/result';
import HeadMeta from '@components/common/HeadMeta';
import { PositiveMessageBox } from '@components/common/messageBox';
import { useMount } from '@utils/hook/useMount';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const metaTagsProps = {
  title: '정치 성향 테스트',
  description: '120개의 질문, 13가지 유형',
  url: `https://yvoting.com/analyze`,
};

export default function Analyze() {
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<ResultAnswers | null>(null);

  const handleComplete = (finalAnswers: ResultAnswers) => {
    setAnswers(finalAnswers);
    setCompleted(true);
  };

  const { show } = useToastMessage();

  useMount(() => {
    show(<PositiveMessageBox>현재 준비 중인 서비스입니다.</PositiveMessageBox>, 2000);
  });

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
