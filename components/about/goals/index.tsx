import styled from 'styled-components';
import Image from 'next/image';
import { EachGoal } from '@components/about/goals/eachgoal';

export function Goals() {
  return (
    <Wrapper>
      <Header>
        <h2>목표</h2>
        <hr />
      </Header>
      <Body>
        <EachGoal />
        <EachGoal />
        <EachGoal />
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-bottom: 60px;
`;

const Header = styled.div`
  display: block;
  align-items: center;
  font-size: 0.8em;
  padding: 30px 40px 0 40px;
  h2 {
    margin: 0 0 0 0;
  }
  hr {
    margin: 20px 0 0 0;
  }
`;

const Body = styled.div`
  display: block;
`;
