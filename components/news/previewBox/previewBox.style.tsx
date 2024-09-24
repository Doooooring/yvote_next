import { ReactNode } from 'react';
import styled from 'styled-components';

interface PreviewBoxLayoutProps {
  imgView: ReactNode;
  headView: ReactNode;
  contentView: ReactNode;
}

export default function PreviewBoxLayout({
  imgView,
  headView,
  contentView,
}: PreviewBoxLayoutProps) {
  return (
    <Wrapper>
      <ImgWrapper>{imgView}</ImgWrapper>
      <BodyWrapper>
        <HeadWrapper>{headView}</HeadWrapper>
        {contentView}
      </BodyWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  font: inherit;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: start;
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  box-shadow: 0px 0px 35px -30px;
  margin-bottom: 10px;
  text-align: left;
  padding: 7px 10px;
  position: relative;
  @media screen and (max-width: 768px) {
    padding: 10px 10px;
  }

  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const ImgWrapper = styled.div`
  display: inline-block;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  color: #666;
  text-align: left;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
`;

const BodyWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  flex: 0 1 auto;
  color: #666;
  text-align: left;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  padding-left: 20px;
`;

const HeadWrapper = styled.div`
  widht: 100%;
  -webkit-text-size-adjust: none;
  text-align: left;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  gap: 4px;
  > Img {
    padding-right: 8px;
  }
`;

const ContentWrapper = styled.div``;
