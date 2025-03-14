import { CSSProperties, useMemo } from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  scrollHeight: number;
  maxScrollHeight: number;
  moveToScrollHeight: (height: number) => void;
  style?: CSSProperties;
}

export default function CommentProgressBar({
  scrollHeight,
  maxScrollHeight,
  moveToScrollHeight,
  style = {},
}: ProgressBarProps) {
  const progressWidth = useMemo(() => {
    console.log((scrollHeight / maxScrollHeight) * 100 + '%');
    return (scrollHeight / maxScrollHeight) * 100 + '%';
  }, [scrollHeight, maxScrollHeight]);

  return (
    <Wrapper style={style}>
      <ProgressWrapper>
        <ProgressBar
          style={{
            width: progressWidth,
          }}
        ></ProgressBar>
      </ProgressWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 8px;
`;

const ProgressWrapper = styled.div`
  border-radius: 8px;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const ProgressBar = styled.div`
  border-radius: 8px;
  height: 100%;
  background-color: red;

  transition: width 0.3s ease;
`;
