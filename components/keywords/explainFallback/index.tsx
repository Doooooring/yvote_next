import {
  Backdrop,
  Column,
  CommonLayoutBox,
  FallbackBox,
  Row,
} from '@components/common/commonStyles';
import styled from 'styled-components';

export default function ExplainFallback() {
  return (
    <Wrapper>
      <HeaderFallback />
      <ContentWrapper>
        <ContentColumn>
          <ContentFallback />
          <ContentFallback />
          <ContentFallback />
        </ContentColumn>
        <ImageFallback />
        <Backdrop />
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  width: 70%;
  min-width: 800px;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
  }
`;

const HeaderFallback = styled(FallbackBox)`
  width: 20%;
  height: 20px;
  margin-bottom: 20px;
`;

const ContentWrapper = styled(Row)`
  width: 100%;
  gap: 20px;
  flex: 0 1 auto;
`;

const ContentColumn = styled(Column)`
  width: 100%;
`;

const ContentFallback = styled(FallbackBox)`
  width: 100%;
  height: 20px;

  margin-right: 10px;
  margin-bottom: 10px;
`;

const ImageFallback = styled(FallbackBox)`
  width: 100px;
  height: 100px;

  flex: 1 0 auto;
`;
