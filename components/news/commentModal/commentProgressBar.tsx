import { CSSProperties, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { CommonIconButton } from '../../common/commonStyles';
import logoImage from '@images/logo_image.png';
import Image from 'next/image';

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
  const [progressWidth, setProgressWidth] = useState<string>('0%');

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const ratio = offsetX / rect.width;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const newScroll = clampedRatio * maxScrollHeight;
    // 상위에서 내려받은 함수로 스크롤 이동
    moveToScrollHeight(newScroll);
  };

  useEffect(() => {
    if (maxScrollHeight === 0) {
      setProgressWidth('100%');
      return;
    }
    let sh = Math.max(scrollHeight, 0);
    const rate = Math.min((sh / maxScrollHeight) * 100, 100);
    const rateFixed = rate >= 99 ? 100 : rate;
    return setProgressWidth(rateFixed + '%');
  }, [scrollHeight, maxScrollHeight]);

  return (
    <Wrapper style={style}>
      <ProgressWrapper onClick={handleBarClick}>
        <ProgressBar
          style={{
            width: progressWidth,
          }}
        >
          <IconButton>
            <Image className="pear" src={logoImage} alt="logo" width="12" height="12" />
          </IconButton>
        </ProgressBar>
      </ProgressWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 8px;
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
  position: relative;

  border-radius: 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.yvote02};

  transition: width 0.3s;
`;

const IconButton = styled(CommonIconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  &:hover {
    border-color: ${({ theme }) => theme.colors.yvote01};
    background-color: white;
  }
`;
