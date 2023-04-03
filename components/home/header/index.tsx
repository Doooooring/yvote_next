import { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

import { useAnimationEnd } from '@entities/hook/useAnimationEnd';
import { useOnScreen } from '@entities/hook/useOnScreen';
import { useTypeEffect } from '@entities/hook/useTypeEffect';

export default function InitialHeader() {
  const viewer = useRef(null);
  const onScreen = useOnScreen(viewer);
  const typeStart = useAnimationEnd(onScreen);
  const [curInd, curText, isEnd] = useTypeEffect(
    '어려운 뉴스 읽기 Y보트와 함께 시작해보세요!.',
    40,
    typeStart,
  );

  return (
    <Wrapper>
      <TitleWrapper state={onScreen}>
        <Highlight>{curText}</Highlight>
        <Cursor curInd={curInd % 2 === 0} isEnd={isEnd} />
      </TitleWrapper>
      <Viewer ref={viewer} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 500px;
`;

interface TitleWrapper {
  state: boolean;
}

const TitleWrapper = styled.div<TitleWrapper>`
  width: 700px;
  height: 140px;
  text-align: center;
  opacity: ${({ state }) => (state ? 1 : 0)};
  transform: ${({ state }) => (state ? `translateY(0)` : `translateY(30px)`)};
  transition-duration: 1s;
  display: inline-block;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 0 30px -15px rgb(0, 115, 239);
  margin-bottom: 30px;
  font-size: 32px;
`;

const Highlight = styled.span`
  color: rgb(61, 152, 247);
  font-weight: 700;
  transition-duration: 0.5s;
`;

interface Cursor {
  curInd: boolean;
  isEnd: boolean;
}

const Cursor = styled.div<Cursor>`
  display: inline-block;
  margin-left: 3px;
  width: 5px;
  height: 25px;
  background-color: ${({ curInd }) => (curInd ? 'rgb(61, 152, 247)' : 'rgba(61, 162, 274, 0.8)')};
  opacity: ${({ isEnd }) => (isEnd ? 0 : 1)};
`;

const Viewer = styled.div`
  height: 5px;
`;
