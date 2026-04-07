import { CommonLayoutBox } from '@/components/common/commonStyles';
import LoadingCommon from '@/components/common/loading';
import { DefaultMessageBox } from '@/components/common/messageBox';
import { useToastMessage } from '@/utils/hook/useToastMessage';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import NewsListFallback from '../newsListFallback';
import PreviewBox from '../previewBox';
import { NewsState, Preview } from '@/utils/interface/news';
import { newsRepository } from '@/repositories/news';

export const PREVIEWS_PAGES_LIMIT = 18;

export default function NewsListSection({
  keywordFilter,
  clickPreviews,
  newsTypeFilter = 'all',
  titleSearch = '',
  dateFilter = '',
  isAdmin = false,
  showId,
}: {
  keywordFilter: string;
  clickPreviews: (id: number) => void;
  newsTypeFilter?: 'all' | string;
  titleSearch?: string;
  dateFilter?: string;
  isAdmin?: boolean;
  showId?: boolean;
}) {
  const router = useRouter();
  const { page } = getCachedInfo();
  const { show: showToastMessage } = useToastMessage();
  const [pageIndex, setPageIndex] = useState(page);
  const normalizedTitleSearch = titleSearch.trim().toLowerCase();

  const { data = { items: [], hasNextPage: false }, isFetching } = useQuery({
    queryKey: [
      'getNewsPreviewsFilled',
      keywordFilter,
      isAdmin,
      newsTypeFilter,
      normalizedTitleSearch,
      dateFilter,
      pageIndex,
    ],
    queryFn: async () => {
      const start = pageIndex * PREVIEWS_PAGES_LIMIT;
      const serverNewsType = newsTypeFilter !== 'all' ? newsTypeFilter : undefined;
      const serverEndDate = dateFilter || undefined;
      const serverTitle = normalizedTitleSearch || undefined;
      // Only need client-side loop when admin filtering (to hide pending items across pages)
      const needsClientFilter = isAdmin;

      // Fast path: no client-side filtering needed → single API call at exact offset
      if (!needsClientFilter) {
        const previews = await newsRepository.getPreviews(
          start,
          PREVIEWS_PAGES_LIMIT,
          keywordFilter,
          NewsState.Published,
          undefined,
          serverEndDate,
          serverNewsType,
          serverTitle,
        );

        return {
          items: previews,
          hasNextPage: previews.length >= PREVIEWS_PAGES_LIMIT,
        };
      }

      // Slow path: admin client-side filtering (hide pending items) → loop until page is filled
      const end = start + PREVIEWS_PAGES_LIMIT;
      const aggregated: Array<Preview> = [];
      let offset = 0;
      let reachedEnd = false;
      let safety = 0;
      let hitSafetyLimit = false;

      const shouldInclude = (preview: Preview) => {
        if (isAdmin && preview.state === NewsState.Pending) return false;
        return true;
      };

      while (aggregated.length < end && !reachedEnd) {
        if (safety >= 50) {
          hitSafetyLimit = true;
          break;
        }

        const previews = await newsRepository.getPreviewsAdmin(
          offset,
          PREVIEWS_PAGES_LIMIT,
          keywordFilter,
          undefined,
          undefined,
          serverEndDate,
          serverNewsType,
          serverTitle,
        );

        const filtered = previews.filter(shouldInclude);
        aggregated.push(...filtered);

        if (previews.length < PREVIEWS_PAGES_LIMIT) {
          reachedEnd = true;
        } else {
          offset += PREVIEWS_PAGES_LIMIT;
        }

        safety += 1;
      }

      const items = aggregated.slice(start, end);
      const hasNextPage = hitSafetyLimit ? true : !reachedEnd;

      return { items, hasNextPage };
    },
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      saveCachedInfo({
        page: pageIndex,
        scroll: window.scrollY,
      });
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [pageIndex]);

  useEffect(() => {
    const { scroll } = getCachedInfo();

    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: scroll,
      });
    }, 100);
  }, []);

  useEffect(() => {
    setPageIndex(0);
  }, [keywordFilter, isAdmin, newsTypeFilter, titleSearch, dateFilter]);

  const hasNextPage = data.hasNextPage;
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (data.items.length === 0 && isFetching) {
    return (
      <LoadingWrapper>
        <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Grid>
        {data.items.map((item) => (
          <PreviewBox key={item.id} preview={item} click={clickPreviews} expanded showId={showId} />
        ))}
      </Grid>

      {/* {isFetching && <NewsListFallback length={PREVIEWS_PAGES_LIMIT} />} */}

      <PaginationBar>
        <div />
        <PaginationCenter>
          <PageButton
            disabled={pageIndex === 0}
            onClick={() => {
              if (pageIndex === 0) return;
              setPageIndex((prev) => Math.max(prev - 1, 0));
            }}
          >
            이전
          </PageButton>
          <PageIndicator>{pageIndex + 1}</PageIndicator>
          <PageButton
            disabled={!hasNextPage}
            onClick={() => {
              if (!hasNextPage) {
                showToastMessage(
                  <DefaultMessageBox>
                    <p>{'와이보트가 준비한 소식을 모두 받아왔어요'}</p>
                  </DefaultMessageBox>,
                  2000,
                );
                return;
              }
              setPageIndex((prev) => prev + 1);
            }}
          >
            다음
          </PageButton>
        </PaginationCenter>
        <ScrollTopButton onClick={() => {
            const el = wrapperRef.current?.closest('[data-section]');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}>
          맨 위로
        </ScrollTopButton>
      </PaginationBar>
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

const Wrapper = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 10px;
  width: 100%;
  align-items: start;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const PaginationBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-top: 16px;
`;

const PageButton = styled.button`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote12};
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote12};
  padding: 4px 10px;
  border-radius: 0;
  font-size: 0.85rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    border-bottom-color: ${({ theme }) => theme.colors.yvote07};
  }
`;

const PageIndicator = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const PaginationCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const ScrollTopButton = styled.button`
  justify-self: end;
  border: 1px solid ${({ theme }) => theme.colors.yvote07};
  border-radius: 2px;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 12px;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 4px 10px;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote07};
    color: ${({ theme }) => theme.colors.yvote01};
  }
`;

const LoadingWrapper = styled.div`
  background-color: transparent;
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
