import { CommonLayoutBox } from '@/components/common/commonStyles';
import { DefaultMessageBox } from '@/components/common/messageBox';
import { useToastMessage } from '@/utils/hook/useToastMessage';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

  const { data, isFetching } = useSuspenseQuery({
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
      const end = start + PREVIEWS_PAGES_LIMIT;
      const aggregated: Array<Preview> = [];
      let offset = 0;
      let reachedEnd = false;
      let safety = 0;
      let hitSafetyLimit = false;

      const shouldInclude = (preview: Preview) => {
        if (isAdmin && preview.state === NewsState.Pending) return false;
        if (newsTypeFilter !== 'all' && preview.newsType !== newsTypeFilter) return false;
        if (normalizedTitleSearch) {
          const title = preview.title?.toLowerCase() ?? '';
          if (!title.includes(normalizedTitleSearch)) return false;
        }
        if (dateFilter && preview.date && preview.date > dateFilter) return false;
        return true;
      };

      while (aggregated.length < end && !reachedEnd) {
        if (safety >= 50) {
          hitSafetyLimit = true;
          break;
        }

        const previews = isAdmin
          ? await newsRepository.getPreviewsAdmin(offset, PREVIEWS_PAGES_LIMIT, keywordFilter)
          : await newsRepository.getPreviews(
              offset,
              PREVIEWS_PAGES_LIMIT,
              keywordFilter,
              NewsState.Published,
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

  return (
    <Wrapper>
      <Grid>
        {data.items.map((item) => (
          <PreviewBox key={item.id} preview={item} click={clickPreviews} expanded showId={showId} />
        ))}
      </Grid>

      {/* {isFetching && <NewsListFallback length={PREVIEWS_PAGES_LIMIT} />} */}

      <PaginationBar>
        <PageButton
          disabled={pageIndex === 0}
          onClick={() => {
            if (pageIndex === 0) return;
            setPageIndex((prev) => Math.max(prev - 1, 0));
            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
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
            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
          }}
        >
          다음
        </PageButton>
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
  gap: 10px;
  width: 100%;
  align-items: start;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const PageButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.gray800};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageIndicator = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
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
