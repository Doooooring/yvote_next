import styled from 'styled-components';
import Image from 'next/image';

export function EachGoal() {
  return (
    <Wrapper>
      <Header></Header>
      <Body />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: pink;
  height: 100px;
  display: flex;
  padding: 0 40px;
`;

const Header = styled.div`
  width: 18%;
  background-color: blue;
`;

const Body = styled.div`
  flex-grow: 1;
  background-color: yellow;
`;
