import Image from "next/image";
import { useRef } from "react";
import styled from "styled-components";

import quoteDown from "@images/quoteDown.png";
import quoteUpper from "@images/quoteUp.png";
import { useAnimationEnd } from "@utils/hook/useAnimationEnd";
import { useOnScreen } from "@utils/hook/useOnScreen";
import { useTypeEffect } from "@utils/hook/useTypeEffect";

export default function Intent() {
  const intentViewer = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(intentViewer);
  const mainSentencePopUpEnd = useAnimationEnd(isOnScreen, 50);
  const topLineEnd = useAnimationEnd(mainSentencePopUpEnd, 300);
  const quoteUpperEnd = useAnimationEnd(mainSentencePopUpEnd, 40);
  const rightLineEnd = useAnimationEnd(topLineEnd, 300);
  const bottomLineEnd = useAnimationEnd(rightLineEnd, 300);
  const quoteUnderEnd = useAnimationEnd(bottomLineEnd, 40);
  const leftLineEnd = useAnimationEnd(bottomLineEnd, 300);
  const [upInd, sentenceUp, sentenceUpEnd] = useTypeEffect(
    "뉴스를 읽으며 차분히 생각하기 위해서는 환경 조성이 중요하다.",
    35,
    leftLineEnd
  );
  const [downInd, sentenceDown, sentenceDownEnd] = useTypeEffect(
    "공부를 시작하기 전에 휴대폰을 끄고 책상을 정리하는 것과 같은 이치이다.",
    35,
    sentenceUpEnd
  );

  //type effect
  // const [firstInd, firstComment, firstEnd] = useTypeEffect(
  //   '감정에 휘둘리지 않고 차분히 생각하기 위해서는 환경 조성이 중요하다.',
  //   30,
  //   mainSentencePopUpEnd,
  // );

  // const [secondInd, secondComment, secondEnd] = useTypeEffect(
  //   '공부를 시작하기 전에 휴대폰을 끄고 책상을 정리하는 것과 같은 이치이다.',
  //   30,
  //   firstEnd,
  // );

  return (
    <Wrapper>
      <Column>
        <SubSentenceWrapper state={mainSentencePopUpEnd}>
          <SubSentence>{sentenceUp}</SubSentence>
          <SubSentence>{sentenceDown}</SubSentence>
          <Top state={topLineEnd}></Top>
          <Right state={rightLineEnd}></Right>
          <Bottom state={bottomLineEnd}></Bottom>
          <Left state={leftLineEnd}></Left>
          <QuoteUpper state={quoteUpperEnd}>
            <Image src={quoteUpper} width="50" height="50" alt="hmm" />
          </QuoteUpper>
          <QuoteUnder state={quoteUnderEnd}>
            <Image src={quoteDown} width="50" height="50" alt="hmm" />
          </QuoteUnder>
        </SubSentenceWrapper>
      </Column>
      <Viewer ref={intentViewer} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-width: 800px;
  height: 430px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white;
`;

const Viewer = styled.div`
  height: 30px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface SubSentenceWrapperProps {
  state: boolean;
}

const SubSentenceWrapper = styled(Column)<SubSentenceWrapperProps>`
  width: 900px;
  height: 200px;
  opacity: ${({ state }) => (state ? 1 : 0)};
  transition-duration: 1s;
  padding: 40px;
  border-radius: 50px;
  gap: 30px;
  position: relative;
`;

const SubSentence = styled.p`
  font-family: var(--font-gangwon);
  transition-duration: 1s;
  height: 30px;
  font-size: 23px;
  color: rgb(60, 60, 60);
  font-weight: 700;
`;

interface Border {
  state: boolean;
}

const Border = styled.span<Border>`
  background-color: rgb(60, 60, 60);
  position: absolute;
`;

const Horizontal = styled(Border)`
  height: 3px;
  width: ${({ state }) => (state ? "860px" : "0px")};
  transition-duration: 0.4s;
`;
const Vertical = styled(Border)`
  width: 3px;
  height: ${({ state }) => (state ? "160px" : "0px")};
  transition-duration: 0.4s;
`;

const Top = styled(Horizontal)`
  top: 0;
  left: 0;
`;
const Right = styled(Vertical)`
  top: 40px;
  right: 0;
`;
const Bottom = styled(Horizontal)`
  bottom: 0;
  right: 0;
`;
const Left = styled(Vertical)`
  bottom: 40px;
  left: 0;
`;

interface Quote {
  state: boolean;
}

const Quote = styled.div<Quote>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  text-align: center;
  width: 90px;
  height: 90px;
  background-color: white;
  opacity: ${({ state }) => (state ? 1 : 0)};
`;

const QuoteUpper = styled(Quote)`
  top: -55px;
  left: 50px;
`;

const QuoteUnder = styled(Quote)`
  bottom: -45px;
  right: 50px;
`;
