import { useMemo } from 'react';
import styled from 'styled-components';
import { Block } from 'typescript';

interface VoteGraphProps {
  vote: number;
  totalVote: number;
  backgroundColor: string;
  submitState: 'resolve' | 'pending' | 'error';
}

export default function VoteGraph({
  vote,
  totalVote,
  backgroundColor,
  submitState,
}: VoteGraphProps) {
  if (submitState != 'resolve') {
    return <Wrapper />;
  }
  return (
    <Wrapper>
      <VoteBlock
        lengthRate={(vote / totalVote) * 100}
        backgroundColor={backgroundColor}
      ></VoteBlock>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 400px;
  height: 10px;
  padding-left: 20px;
  margin-bottom: 10px;
`;

interface BlockProps {
  lengthRate: number;
  backgroundColor: string;
}
const VoteBlock = styled.div<BlockProps>`
  width: ${({ lengthRate }) => `${lengthRate}%`};
  height: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;
