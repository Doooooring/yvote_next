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
    if (maxScrollHeight === 0) return '100%';
    let sh = Math.max(scrollHeight, 0);
    const rate = Math.min((sh / maxScrollHeight) * 100, 100);
    const rateFixed = rate >= 99 ? 100 : rate;
    return rateFixed + '%';
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
  height: 4px;
  border-radius: 8px;
  position: absolute;
  top: -2px;
  left: 0;
`;

const ProgressWrapper = styled.div`
  border-radius: 8px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray400};
`;

const ProgressBar = styled.div`
  border-radius: 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.yvote02};

  transition: width 0.3s;
`;
