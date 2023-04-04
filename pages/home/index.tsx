import styled from 'styled-components';

import Answer from '@components/home/answer';
import HomeBody from '@components/home/body';
import Intent from '@components/home/intent';
import IntroductionComp from '@components/home/introduction';

export default function Home() {
  return (
    <Wrapper>
      <IntroductionComp />
      <HomeBody />
      <Answer />
      <Intent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow: scroll;
  padding-top: 110px;
  padding-bottom: 100px;
`;
