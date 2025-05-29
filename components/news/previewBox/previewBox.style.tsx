import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface PreviewBoxLayout_PublishedProps extends HTMLAttributes<HTMLDivElement> {
  imgView: ReactNode;
  headView: ReactNode;
  contentView: ReactNode;
}

export function PreviewBoxLayout_Published({
  imgView,
  headView,
  contentView,
  ...rest
}: PreviewBoxLayout_PublishedProps) {
  return (
    <Wrapper {...rest}>
      <ImgWrapper>{imgView}</ImgWrapper>
      <BodyWrapper>
        <HeadWrapper>{headView}</HeadWrapper>
        <ContentWrapper>{contentView}</ContentWrapper>
      </BodyWrapper>
    </Wrapper>
  );
}

interface PreviewBoxLayout_PendingProps extends HTMLAttributes<HTMLDivElement> {
  bodyView: ReactNode;
}

export function PreviewBoxLayout_Pending({ bodyView, ...rest }: PreviewBoxLayout_PendingProps) {
  return (
    <Wrapper {...rest}>
      <HeadWrapper>{bodyView}</HeadWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 99%;
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
  text-align: left;
  padding: 7px 10px;
  position: relative;
  @media screen and (max-width: 768px) {
    padding: 5px 5px;
  }

  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const ImgWrapper = styled.div`
  display: inline-block;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  color: #666;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  align-self: center;
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
  padding-left: 15px;
`;

const HeadWrapper = styled.div`
  width: 100%;
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

const ContentWrapper = styled.div`
  align-self: center;
`;
