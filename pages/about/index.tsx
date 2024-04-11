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
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const BlockElement = styled.div`
  background-color: transparent;
  padding-top: 40px;
  width: 70%;
  min-width: 980px;
  @media screen and (max-width: 1080px) {
    width: 800px;
    max-width: 90%;
    min-width: 300px;
  }
  margin: auto;
  text-align: start;
`;
