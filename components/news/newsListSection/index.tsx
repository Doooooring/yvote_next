// useSuspenseInfiniteQuery 옵션 참조
// keyword

import { Column, CommonLayoutBox } from '@/components/common/commonStyles';
import { PositiveMessageBox } from '@/components/common/messageBox';
import { newsRepository } from '@/repositories/news';
import { useToastMessage } from '@/utils/hook/useToastMessage';
import { NewsState, Preview } from '@/utils/interface/news';
import { fetchImg } from '@/utils/tools/async';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso/dist';
import styled from 'styled-components';
import NewsListFallback from '../newsListFallback';
import PreviewBox from '../previewBox';

export const PREVIEWS_PAGES_LIMIT = 16;

export default function NewsListSection({
  keywordFilter,
  clickPreviews,
}: {
  keywordFilter: string;
  clickPreviews: (id: number) => void;
}) {
  const router = useRouter();
  const { page } = getCachedInfo();
  const { show: showToastMessage } = useToastMessage();

  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    ...getNewsPreviewsQueryOption({ offset: page, filter: keywordFilter }),
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      saveCachedInfo({
        page: pages.length,
        scroll: window.scrollY,
      });
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [pages]);

  useEffect(() => {
    const { scroll } = getCachedInfo();

    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: scroll,
      });
    }, 100);
  }, []);

  const previews = pages.reduce((acc, cur) => [...acc, ...cur], []);

  return (
    <Wrapper>
      <Virtuoso
        style={{
          width: '100%',
          marginBottom: '2px',
        }}
        useWindowScroll
        totalCount={previews.length}
        data={previews}
        increaseViewportBy={800}
        endReached={async () => {
          if (!hasNextPage || isFetchingNextPage) return;

          try {
            const { data } = await fetchNextPage();
            const lastPage = data?.pages[data.pages.length - 1];
            if (lastPage === undefined || lastPage.length === 0) {
              showToastMessage(
                <PositiveMessageBox>
                  <p>{'와이보트가 준비한 소식을 모두 받아왔어요'}</p>
                </PositiveMessageBox>,
                2000,
              );
            }
          } catch (e) {
            showToastMessage(
              <PositiveMessageBox>
                <p>{'다시 시도해 주세요.'}</p>
              </PositiveMessageBox>,
              2000,
            );
          }
        }}
        itemContent={(_, item) => {
          return (
            <PreviewBox key={item.id} preview={item} img={item.newsImage} click={clickPreviews} />
          );
        }}
      />
      {isFetchingNextPage && <NewsListFallback length={PREVIEWS_PAGES_LIMIT} />}
    </Wrapper>
  );
}

type CacheInfo = {
  scroll: number;
  page: number;
};

function isCacheInfo(item: any): item is CacheInfo {
  return typeof item === 'object' && item !== null && 'scroll' in item && 'page' in item;
}

function getCachedInfo() {
  const defaultCacheInfo: CacheInfo = {
    scroll: 0,
    page: 0,
  };
  const key = (history?.state?.key as string) ?? null;
  if (!key) return defaultCacheInfo;
  const item = getSessionItem(key);
  if (!isCacheInfo(item)) return defaultCacheInfo;

  return item;
}

function saveCachedInfo(cacheInfo: CacheInfo) {
  const key = (history?.state?.key as string) ?? null;
  if (!key) return;
  saveSessionItem(key, cacheInfo);
}

async function getNewsPreviews({
  page,
  filter,
  isAdmin,
}: {
  page: number;
  filter: string;
  isAdmin: boolean;
  newsState?: NewsState;
}) {
  const datas: Array<Preview> = isAdmin
    ? await newsRepository.getPreviewsAdmin(page, PREVIEWS_PAGES_LIMIT, filter)
    : await newsRepository.getPreviews(page, PREVIEWS_PAGES_LIMIT, filter, NewsState.Published);

  await Promise.all(
    datas.map(async (data) => {
      const newsImageId = `news-${data.id}-image`;

      try {
        const response = await fetchImg(data.newsImage as string);

        data.newsImage = response;
      } catch (e) {
        data.newsImage = '';
      }
    }),
  );

  return datas;
}

const getNewsPreviewsQueryOption = ({
  filter,
  offset,
  isAdmin = false,
}: {
  filter: string;
  offset: number;
  isAdmin?: boolean;
}) =>
  infiniteQueryOptions({
    queryKey: ['getNewsPreviews', filter, isAdmin],
    queryFn: (context) => {
      const pageParam = context.pageParam;
      return getNewsPreviews({
        page: pageParam,
        filter,
        isAdmin,
      });
    },
    initialPageParam: offset,

    getNextPageParam: (prevPageData, __, lastPageParam) => {
      return prevPageData.length === 0 ? undefined : lastPageParam + prevPageData.length;
    },
  });

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
