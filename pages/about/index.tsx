import styled from 'styled-components';
import { Criteria } from '@components/about/criteria';
import { Values } from '@components/about/values';
import { ContactBox } from '@components/about/contactBox';
import HeadMeta from '@components/common/HeadMeta';

export default function About() {
  const metaTagsProps = {
    title: 'About',
    url: `https://yvoting.com/about`,
  };

  return (
    <Wrapper>
      <HeadMeta {...metaTagsProps} />
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
  color: #747272;
  @media screen and (max-width: 1080px) {
    width: 98%;
    min-width: 300px;
  }
  margin: auto;
  text-align: start;
`;
