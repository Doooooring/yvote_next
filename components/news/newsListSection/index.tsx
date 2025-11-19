import { Column, CommonLayoutBox } from '@/components/common/commonStyles';
import { DefaultMessageBox } from '@/components/common/messageBox';
import { getNewsPreviewsQueryOption } from '@/queryOption/getNewsPreviews';
import { useToastMessage } from '@/utils/hook/useToastMessage';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso/dist';
import styled from 'styled-components';
import NewsListFallback from '../newsListFallback';
import PreviewBox from '../previewBox';
import { NewsState } from '@/utils/interface/news';

export const PREVIEWS_PAGES_LIMIT = 16;

export default function NewsListSection({
  keywordFilter,
  clickPreviews,
  isAdmin = false,
}: {
  keywordFilter: string;
  clickPreviews: (id: number) => void;
  isAdmin?: boolean;
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
    ...getNewsPreviewsQueryOption({
      offset: page,
      limit: PREVIEWS_PAGES_LIMIT,
      filter: keywordFilter,
      isAdmin,
    }),
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

  const previews = pages
    .reduce((acc, cur) => [...acc, ...cur], [])
    .filter((preview) => {
      // Filter out pending news in admin mode to avoid duplicates with AdminPreNewsList
      if (isAdmin && preview.state === NewsState.Pending) {
        return false;
      }
      return true;
    });

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
                <DefaultMessageBox>
                  <p>{'와이보트가 준비한 소식을 모두 받아왔어요'}</p>
                </DefaultMessageBox>,
                2000,
              );
            }
          } catch (e) {
            showToastMessage(
              <DefaultMessageBox>
                <p>{'다시 시도해 주세요.'}</p>
              </DefaultMessageBox>,
              2000,
            );
          }
        }}
        itemContent={(_, item) => {
          return (
            <PreviewBox key={item.id} preview={item} click={clickPreviews} />
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
  if (typeof window === 'undefined') return defaultCacheInfo;
  const key = (history?.state?.key as string) ?? null;
  if (!key) return defaultCacheInfo;
  const item = getSessionItem(key);
  if (!isCacheInfo(item)) return defaultCacheInfo;

  return item;
}

function saveCachedInfo(cacheInfo: CacheInfo) {
  if (typeof window === 'undefined') return;
  const key = (history?.state?.key as string) ?? null;
  if (!key) return;
  saveSessionItem(key, cacheInfo);
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
