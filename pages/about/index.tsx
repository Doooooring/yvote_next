import styled from 'styled-components';
import { Criteria } from '@components/about/criteria';
import { Values } from '@components/about/values';
import { ContactBox } from '@components/about/contactBox';

export default function About() {
  return (
    <Wrapper>
      <BlockElement>
        <Criteria />
        <Values />
        <ContactBox />
      </BlockElement>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  background-color: transparent;
  height: 100%;
  display: block;
`;

const BlockElement = styled.div`
  background-color: transparent;
  padding-top: 50px;
  width: 70%;
  min-width: 700px;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
  }
  margin: auto;
  text-align: start;
`;
