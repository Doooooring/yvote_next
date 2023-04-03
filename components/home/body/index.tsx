import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@assets/img/yvote.png';
import { useAnimationEnd } from '@entities/hook/useAnimationEnd';
import { useOnScreen } from '@entities/hook/useOnScreen';

export default function InitialBody() {
  const navigation = useNavigate();

  const firstComp = useRef(null);
  const firstCompOn = useOnScreen(firstComp);
  const firstCompImgEnd = useAnimationEnd(firstCompOn, 0);
  const firstHeaderEnd = useAnimationEnd(firstCompImgEnd, 100);
  const firstBodyEnd = useAnimationEnd(firstHeaderEnd, 100);
  const firstButtonEnd = useAnimationEnd(firstBodyEnd);

  return (
    <Wrapper>
      <FirstComp>
        <ImgWrapper>
          <LogoImg src={Logo} alt={'hmm'} width="450px" height="450px" state={firstCompImgEnd} />
        </ImgWrapper>
        <FirstBodyWrapper>
          <FirstBody state={firstBodyEnd}>
            {' '}
            <p>
              뉴스 큐레이팅 서비스 <Highlight>Y보트</Highlight>는
            </p>
            <p>
              <Highlight ref={firstComp}>나</Highlight>의 생각이 다듬어지는 경험을 제공합니다
            </p>
          </FirstBody>
          <ButtonWrapper state={firstButtonEnd}>
            <NewsButton
              onClick={() => {
                navigation('/news');
              }}
            >
              뉴스 모아보기
            </NewsButton>
            <KeywordButton
              onClick={() => {
                navigation('/keywords');
              }}
            >
              키워드 모아보기
            </KeywordButton>
          </ButtonWrapper>
        </FirstBodyWrapper>
      </FirstComp>
    </Wrapper>
  );
}

const Highlight = styled.span`
  font-size: 26px;
  color: rgb(61, 152, 247);
  transition-duration: 0.5s;
  font-family: var(--font-ibm-bold);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled(Column)`
  align-items: center;
  justify-content: center;
  height: 550px;
  gap: 20px;
`;

const FirstComp = styled(Row)`
  background: transparent;
  align-items: center;
`;

const ImgWrapper = styled(Column)`
  align-items: center;
  justify-content: center;
`;

interface LogoImgProps {
  state: boolean;
}

const LogoImg = styled.img<LogoImgProps>`
  width: ${({ width, state }) => (state ? `${width}px` : 0)};
  height: ${({ height, state }) => (state ? `${height}px` : 0)};
  opacity: ${({ state }) => (state ? 1 : 0)};
  transition-duration: 2s;
`;

const FirstBodyWrapper = styled(Column)`
  height: 300px;
  width: 500px;
  padding-top: 100px;
`;

interface FirstHeader {
  state: boolean;
}

const FirstHeader = styled.h1<FirstHeader>`
  display: inline;
  width: 400px;
  opacity: ${({ state }) => (state ? 1 : 0)};
  border-bottom: 3px solid rgb(61, 152, 247);
  transition-duration: 1s;
`;

interface FirstBody {
  state: boolean;
}

const FirstBody = styled.div<FirstBody>`
  font-family: var(--font-ibm);
  font-size: 25px;
  line-height: 35px;
  margin-bottom: 40px;
  color: rgb(109, 154, 196);
  opacity: ${({ state }) => (state ? 1 : 0)};
  transition-duration: 1s;
`;

interface ButtonWrapperProps {
  state: boolean;
}

const ButtonWrapper = styled(Row)<ButtonWrapperProps>`
  opacity: ${({ state }) => (state ? 1 : 0)};
  gap: 30px;
  transition-duration: 1s;
`;

const NavigationButton = styled.button`
  width: 150px;
  height: 55px;
  border: 0;
  border-radius: 20px;
  box-shadow: 0 0 20px -10px black;
  color: white;
  font-size: 18px;
  font-weight: 700;
  background-color: rgba(61, 152, 247);
  opacity: 0.5;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const NewsButton = styled(NavigationButton)``;

const KeywordButton = styled(NavigationButton)``;
