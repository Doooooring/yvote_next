import { useRef } from 'react';
import styled from 'styled-components';

import newsImage from '@assets/img/news_image.png';
import CauseBox from '@components/initial/causeBox';
import { useOnScreen } from '@entities/hook/useOnScreen';
import { usePopAnimation } from '@entities/hook/usePopAnimation';

export default function IntroductionComp() {
  const stateArray = usePopAnimation(7, 150);

  const problemRef = useRef(null);
  const problemView = useOnScreen(problemRef);

  return (
    <IntroductionWrapper>
      <IntroductTitleWrapper>
        <IntroductTitle>
          <Highlight>{'Q. '}</Highlight>
          {'오늘 '}
          <Highlight>뉴스 </Highlight> {'보셨나요? '}
        </IntroductTitle>
      </IntroductTitleWrapper>
      <Introduction>
        <IntroductionBack>
          <NewsImageWrapper>
            <NewsImage src={newsImage} width="400px" />
          </NewsImageWrapper>
        </IntroductionBack>
        <IntroductionFront>
          <CompWrapper>
            <Comp1 state={stateArray[6]}>
              <CauseBox cause="covid" />
            </Comp1>
            <Comp2 state={stateArray[1]}>
              <CauseBox cause="avoid_arguments" />
            </Comp2>
            <Comp3 state={stateArray[4]}>
              <CauseBox cause="excessive_news" />
            </Comp3>
            <Comp4 state={stateArray[5]}>
              <CauseBox cause="negative_mood" />
            </Comp4>
            <Comp5 state={stateArray[2]}>
              <CauseBox cause="unessential" />
            </Comp5>
            <Comp6 state={stateArray[3]}>
              <CauseBox cause="untrustworthy" />
            </Comp6>
          </CompWrapper>
        </IntroductionFront>
      </Introduction>
      <SourceWrapper>출처 : 로이터 디지털 뉴스 리포트 2022</SourceWrapper>
    </IntroductionWrapper>
  );
}

const IntroductionWrapper = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Highlight = styled.span`
  color: rgb(61, 152, 247);
  font-weight: 700;
`;

const IntroductTitleWrapper = styled.div`
  display: block;
  width: 400px;
  margin-bottom: 30px;
`;

const IntroductTitle = styled.h2`
  display: inline-block;
  color: rgb(85, 86, 86);
  font-size: 30px;
  font-weight: 450;
  border-bottom: 3px solid rgb(61, 152, 247);
`;

const Introduction = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 100px;
`;

const IntroductionBack = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const SourceWrapper = styled.p`
  display: inline-block;
  width: 800px;
  color: grey;
  text-align: right;
`;

const IntroductionFront = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
`;

const CompWrapper = styled.div`
  width: 400px;
  position: relative;
`;

const NewsImageWrapper = styled.div`
  width: 400px;
  height: 603px;
  position: relative;
`;

const NewsImage = styled.img`
  box-shadow: 0 0 30px -15px black;
`;

interface CompProps {
  state: boolean;
}

const comp = styled.div<CompProps>`
  display: inline-block;
  position: absolute;
  opacity: ${({ state }) => {
    return state ? 1 : 0;
  }};
  transition-duration: 0.6s;
`;

const Comp1 = styled(comp)`
  top: 0;
  left: -390px;
`;
const Comp2 = styled(comp)`
  top: 80px;
  left: 200px;
`;
const Comp3 = styled(comp)`
  top: 160px;
  left: -350px;
`;
const Comp4 = styled(comp)`
  top: 240px;
  left: 300px;
`;
const Comp5 = styled(comp)`
  top: 320px;
  left: -350px;
`;
const Comp6 = styled(comp)`
  top: 430px;
  left: 100px;
`;

interface ProblemWrapperProps {
  state: boolean;
}

const ProblemWrapper = styled.div<ProblemWrapperProps>`
  height: 500px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  opacity: ${({ state }) => (state ? 1 : 0)};
  transition-duration: 1s;
`;

const ProblemBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 300px;
  height: 120px;
  border-radius: 30px;
  box-shadow: 0 0 20px -15px black;
  background-color: white;
  font-size: 20px;
  font-family: var(--font-cafe);
  z-index: 5;
  & > p {
    color: rgb(80, 80, 80);
  }
`;

const ProblemHighlight = styled.span`
  color: rgb(61, 152, 247);
  font-weight: 700;
  transition-duration: 0.5s;
`;

const LineWrapper = styled.svg`
  margin-left: 20px;
  margin-right: 20px;
`;

{
  /* <ProblemWrapper ref={problemRef} state={problemView}>
        <ProblemBox>
          <p>
            2022년 <ProblemHighlight>한국 언론 신뢰도</ProblemHighlight>
          </p>
          <p> 46개국 중 40위</p>
        </ProblemBox>
        <LineWrapper width="300px" height="510px" viewBox="300 500">
          <path
            strokeDasharray="10"
            fill="none"
            stroke="lightgrey"
            strokeWidth="3"
            d="M 0 50 H 300"
          ></path>
          <path
            strokeDasharray="10"
            fill="none"
            stroke="lightgrey"
            strokeWidth="3"
            d="M 150 50 V 520"
          ></path>
        </LineWrapper>
        <ProblemBox>
          <p>
            <ProblemHighlight>기성언론</ProblemHighlight>이 주는 피로감
          </p>
        </ProblemBox>
      </ProblemWrapper> */
}
