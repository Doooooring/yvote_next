import { useMemo } from 'react';
import styled from 'styled-components';

import AnswerLabel from './answerLabel';

type cause =
  | 'covid'
  | 'avoid_arguments'
  | 'excessive_news'
  | 'negative_mood'
  | 'unessential'
  | 'untrustworthy';

export default function Answer() {
  const causes: cause[] = useMemo(() => {
    return [
      'covid',
      'negative_mood',
      'excessive_news',
      'avoid_arguments',
      'untrustworthy',
      'unessential',
    ];
  }, []);
  return (
    <Wrapper>
      {causes.map((cause, idx) => {
        return <AnswerLabel key={idx} cause={cause} left={idx % 2 === 0} />;
      })}
    </Wrapper>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled(Column)`
  flex-direction: center;
`;
