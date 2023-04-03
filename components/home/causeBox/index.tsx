import styled from 'styled-components';

import { useCause } from '@entities/hook/useCause';
import { useNumberIncreasing } from '@entities/hook/useNumberIncreasing';

interface CauseBoxProps {
  cause:
    | 'covid'
    | 'avoid_arguments'
    | 'excessive_news'
    | 'negative_mood'
    | 'unessential'
    | 'untrustworthy';
}

interface TitleHighlightProps extends CauseBoxProps {
  title: string;
  color: string;
}

function Highlight({ color, str }: { color: string; str: string }) {
  return (
    <span
      style={{
        color: color,
      }}
    >
      {str}
    </span>
  );
}

function TitleHighlight({ cause, title, color }: TitleHighlightProps) {
  if (cause === 'covid') {
    const titleSplited = title.split(/정치/);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'정치'} />
        {titleSplited[1]}
      </Title>
    );
  } else if (cause === 'avoid_arguments') {
    const titleSplited = title.split(/싸움/);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'싸움'} />
        {titleSplited[1]}
      </Title>
    );
  } else if (cause === 'excessive_news') {
    const titleSplited = title.split(/너무 많아요../);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'너무 많아요..'} />
        {titleSplited[1]}
      </Title>
    );
  } else if (cause === 'negative_mood') {
    const titleSplited = title.split(/부정적 기사/);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'부정적 기사'} />
        {titleSplited[1]}
      </Title>
    );
  } else if (cause === 'unessential') {
    const titleSplited = title.split(/뭐가 달라지나요/);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'뭐가 달라지나요'} />
        {titleSplited[1]}
      </Title>
    );
  } else {
    const titleSplited = title.split(/어느 쪽 말이 맞는지/);
    return (
      <Title>
        {titleSplited[0]}
        <Highlight color={color} str={'어느 쪽 말이 맞는지'} />
        {titleSplited[1]}
      </Title>
    );
  }
}

export default function CauseBox({ cause }: CauseBoxProps) {
  const [percent, curImage, curTitle, curColor] = useCause(cause);
  const curPercent = useNumberIncreasing(percent);

  return (
    <Wrapper>
      <PercentWrapper fontColor={`${curColor}`}>{`${curPercent}%`}</PercentWrapper>
      <BodyWrapper>
        <ImageWrapper />
        <Expanded>
          <Image src={curImage} width="70px" height="70px" />
          <ContentsWrapper>
            <TitleWrapper>
              <TitleHighlight cause={cause} title={curTitle} color={curColor} />
            </TitleWrapper>
          </ContentsWrapper>
        </Expanded>
      </BodyWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 800px;
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding-left: 10px;
`;

interface PercentWrapperProps {
  fontColor: string;
}
const PercentWrapper = styled.div<PercentWrapperProps>`
  width: 100px;
  font-size: 50px;
  font-weight: 600;
  margin-right: 10px;
  color: ${({ fontColor }) => {
    return fontColor;
  }};
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  border-radius: 20px;
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255);
  box-shadow: 0 0 20px -15px black;
  border-radius: 50px;
  position: relative;
  z-index: 1;
`;

const Expanded = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const Image = styled.img`
  background-color: white;
  position: absolute;
  border-radius: 20px;
  left: -85px;
  z-index: 4;
`;

const ContentsWrapper = styled.div`
  display: inline-block;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255);
  box-shadow: 0 0 20px -15px black;
  position: relative;
  z-index: 3;
  left: -40px;
  padding-left: 40px;
  padding-right: 20px;
  border-radius: 0 20px 20px 0;
  font-size: 18px;
`;

const TitleWrapper = styled.div`
  font-family: var(--font-cafe);
`;

const Title = styled.p`
  display: inline;
`;
