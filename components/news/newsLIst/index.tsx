import { Center, Column, CommonLayoutBox } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import LoadingCommon from '@components/common/loading';
import { PositiveMessageBox } from '@components/common/messageBox';
import useLazyLoad from '@utils/hook/useLazyLoad';
import { useOnScreen } from '@utils/hook/useOnScreen';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { Preview } from '@utils/interface/news';
import { arrBatch } from '@utils/tools';
import { Suspense, useCallback, useRef } from 'react';
import styled from 'styled-components';
import NewsBlock from '../newsBlock';
import NewsListFallback from '../newsListFallback';
import { useNewsInfiniteScroll } from './newsList.tools';

interface NewsListProps {
  page: number;
  previews: Preview[];
  isRequesting: boolean;
  fetchPreviews: () => Promise<boolean>;
  showNewsContent: (id: number) => void;
}

export default function NewsList({
  page,
  previews,
  isRequesting,
  fetchPreviews,
  showNewsContent,
}: NewsListProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { show: showToastMessage } = useToastMessage();
  const isOnScreen = useOnScreen(elementRef);
  const fetChPreviewsWithVal = useCallback(async () => {
    const res = await fetchPreviews();
    if (!res) {
      showToastMessage(
        <PositiveMessageBox>
          <p>{'와이보트가 준비한 소식을 모두 받아왔어요'}</p>
        </PositiveMessageBox>,
        2000,
      );
    }
  }, [fetchPreviews, showToastMessage]);

  useNewsInfiniteScroll(isOnScreen, fetChPreviewsWithVal, page >= 0 && !isRequesting);
  const { isShow: isShowFetchButton, close: closeFetchButton } = useLazyLoad(isOnScreen, 3000);

  const clickFetchButton = useCallback(() => {
    fetChPreviewsWithVal();
    closeFetchButton();
  }, [fetChPreviewsWithVal, closeFetchButton]);

  return (
    <>
      <Wrapper>
        {arrBatch(previews, 16).map((previews) => (
          <Suspense fallback={<NewsListFallback length={previews.length} />}>
            <NewsBlock previews={previews} onPreviewClick={showNewsContent} />
          </Suspense>
        ))}
      </Wrapper>
      <IsShow state={isRequesting}>
        <LoadingWrapper>
          <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
        </LoadingWrapper>
      </IsShow>
      <IsShow state={page != -1 && isShowFetchButton}>
        <Center style={{ width: '100%' }}>
          <FetchButton onClick={clickFetchButton}>더 보기</FetchButton>
        </Center>
      </IsShow>
      <LastLine ref={elementRef} />
    </>
  );
}

const Wrapper = styled(Column)`
  gap: 2px;

  -webkit-text-size-adjust: none;
  color: #666;
  text-align: center;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  box-sizing: inherit;
  width: 100%;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  position: relative;
  animation: 0.5s linear 0s 1 normal none running box-sliding;
  overflow-x: visible;

  div.preview-wrapper {
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
  }
`;

const LoadingWrapper = styled(CommonLayoutBox)`
  background-color: white;
`;

const FetchButton = styled(CommonLayoutBox)`
  background-color: white;
  padding: 0.5rem 3rem;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.gray900};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.hovergray};
  }
`;

const LastLine = styled.div`
  width: 10px;
  height: 240px;
`;

const Block = styled.div`
  background-color: red;
`;
