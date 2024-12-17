import { Backdrop, CommonLayoutBox, FallbackBox, Row } from '@components/common/commonStyles';
import styled from 'styled-components';

export default function NewsContentFallback() {
  return (
    <Wrapper>
      <Left>
        <Backdrop />
        <ImageFallback />
        <HeadFallback />
        <ContentFallback />
        <ContentFallback />
        <ContentFallback />
      </Left>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  justify-content: flex-start;
  width: 100%;
  padding-top: 45px;
`;

const Left = styled(CommonLayoutBox)`
  width: 55%;
  min-height: 1000px;
  padding: 1rem;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0px;
  }
`;

const ImageFallback = styled(FallbackBox)`
  width: 95%;
  height: 250px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
`;

const HeadFallback = styled(FallbackBox)`
  width: 60%;
  height: 16px;
  margin-bottom: 1rem;
`;

const ContentFallback = styled(FallbackBox)`
  width: 80%;
  height: 14px;
  margin-bottom: 0.7rem;
`;
