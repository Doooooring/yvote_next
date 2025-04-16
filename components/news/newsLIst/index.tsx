import { Column, CommonLayoutBox } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import LoadingCommon from '@components/common/loading';
import { PositiveMessageBox } from '@components/common/messageBox';
import { Virtuoso } from '@node_modules/react-virtuoso/dist';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { Preview } from '@utils/interface/news';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useGlobalLoading } from '../../../utils/hook/useGlobalLoading/useGlobalLoading';
import NewsListFallback from '../newsListFallback';
import PreviewBox from '../previewBox';
import PreviewBox2 from '../previewBox2';

interface NewsListProps {
  page: number;
  previews: Preview[];
  isRequesting: boolean;
  isFetchingImages?: boolean;
  fetchPreviews: () => Promise<boolean>;
  showNewsContent: (id: number) => void;
}

const dummyPreview: Preview = {
  id: 999,
  order: 1,
  title: '최상목 탄핵소추안 (법제사법위원회)',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};

const dummyPreview2: Preview = {
  id: 999,
  order: 1,
  title: '반도체특별법 (아직 말 밖에 안 나옴)',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};


const dummyPreview3: Preview = {
  id: 999,
  order: 1,
  title: '추가경정예산안 (제출 예정)',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};

const dummyPreview4: Preview = {
  id: 999,
  order: 1,
  title: '고발사주 검사(손준성) 탄핵소추안(헌법재판소 심리 중)',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};

const dummyPreview5: Preview = {
  id: 999,
  order: 1,
  title: '대통령 권한대행의 헌법재판관 임명 (가처분 인용)',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};

const dummyPreview6: Preview = {
  id: 999,
  order: 1,
  title: '2025년 1분기 경제지표',
  subTitle: 'Dummy Subtitle',
  summary: 'This is a dummy news summary for testing purposes.',
  date: new Date('2025-03-31'),
  keywords: [],
  newsImage: '',
  state: true,
};

export default function NewsList({
  page,
  previews,
  isRequesting,
  isFetchingImages = false,
  fetchPreviews,
  showNewsContent,
}: NewsListProps) {
  const { isLoading: isGlobalLoading } = useGlobalLoading();
  const { show: showToastMessage } = useToastMessage();
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

  return (
    <>
      <Wrapper>
        <PreviewBox2 preview={dummyPreview}></PreviewBox2>
        <PreviewBox2 preview={dummyPreview2}></PreviewBox2>
        <PreviewBox2 preview={dummyPreview3}></PreviewBox2>
        <PreviewBox2 preview={dummyPreview4}></PreviewBox2>
        <PreviewBox2 preview={dummyPreview5}></PreviewBox2>
        <PreviewBox2 preview={dummyPreview6}></PreviewBox2>
        <Virtuoso
          style={{
            width: '100%',
            marginBottom: '2px',
          }}
          useWindowScroll
          totalCount={previews.length}
          data={previews}
          increaseViewportBy={800}
          endReached={() => {
            fetChPreviewsWithVal();
          }}
          itemContent={(_, item) => {
            return (
              <PreviewBox
                key={item.id}
                preview={item}
                img={item.newsImage}
                click={showNewsContent}
              />
            );
          }}
        />
        <IsShow state={isFetchingImages}>
          <NewsListFallback length={previews.length % 16 == 0 ? 16 : previews.length % 16} />
        </IsShow>
      </Wrapper>
      <IsShow state={isRequesting && !isFetchingImages && !isGlobalLoading}>
        <LoadingWrapper>
          <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
        </LoadingWrapper>
      </IsShow>
      {/* <IsShow state={page != -1 && isShowFetchButton}>
        <Center style={{ width: '100%' }}>
          <FetchButton onClick={clickFetchButton}>더 보기</FetchButton>
        </Center>
      </IsShow> */}
    </>
  );
}

const Wrapper = styled(Column)`
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
