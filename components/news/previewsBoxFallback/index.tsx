import { Backdrop, FallbackBox, Row, backgroundSlide } from '@components/common/commonStyles';
import { memo } from 'react';
import styled from 'styled-components';
import { PreviewBoxLayout_Published } from '../previewBox/previewBox.style';

function PreviewBoxFallback() {
  return (
    <Wrapper>
      <PreviewBoxLayout_Published
        headView={<HeadView />}
        contentView={
          <>
            <ContentView />
            <ContentView />
            <KeywordsView>
              <KeywordView />
              <KeywordView />
              <KeywordView />
            </KeywordsView>
            <Backdrop />
          </>
        }
      />
    </Wrapper>
  );
}

export default memo(PreviewBoxFallback);

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  color: #666;
  text-align: center;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  display: inline-block;
`;

const ImgView = styled(FallbackBox)`
  width: 100%;
  height: 100%;
`;

const HeadView = styled(FallbackBox)`
  width: 100%;
  height: 24px;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const ContentView = styled.p`
  background-color: ${({ theme }) => theme.colors.fallback};
  background-size: 300% auto;

  animation: ${backgroundSlide} 1s ease-in-out infinite;
  height: 16px;
  margin-bottom: 4px;
  border-radius: 4px;
`;

const KeywordsView = styled(Row)`
  gap: 6px;
  padding-top: 2px;
`;

const KeywordView = styled(FallbackBox)`
  width: 40px;
  height: 14px;
`;
