import { INF } from '@/public/assets/resource';
import { newsRepository } from '@/repositories/news';
import { NewsState, Preview } from '@/utils/interface/news';
import LoadingCommon from '@/components/common/loading';
import { CommonLayoutBox } from '@/components/common/commonStyles';
import PreviewBox from '@components/news/previewBox';
import { queryOptions, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

export function PreNewsList({
  keywordFilter,
  newsTypeFilter = 'all',
  titleSearch = '',
  state,
  showId = false,
  openModalOnClick = false,
}: {
  keywordFilter: string;
  newsTypeFilter?: 'all' | string;
  titleSearch?: string;
  state?: NewsState;
  showId?: boolean;
  openModalOnClick?: boolean;
}) {
  const router = useRouter();
  const { data: preNewsList = [], isFetching } = useQuery({
    ...getPreNewsListQueryOption({ keyword: keywordFilter, state }),
  });

  const handleClick = useCallback((id: number) => {
    router.push(`/adminjae/${id}`);
  }, [router]);

  const normalizedTitleSearch = titleSearch.trim().toLowerCase();

  const filteredPreNewsList = useMemo(() => preNewsList.filter((item: Preview) => {
    if (newsTypeFilter !== 'all' && item.newsType !== newsTypeFilter) {
      return false;
    }
    if (normalizedTitleSearch) {
      const title = item.title?.toLowerCase() ?? '';
      if (!title.includes(normalizedTitleSearch)) {
        return false;
      }
    }
    return true;
  }), [preNewsList, newsTypeFilter, normalizedTitleSearch]);

  if (preNewsList.length === 0 && isFetching) {
    return (
      <LoadingWrapper>
        <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      {filteredPreNewsList.map((item) => {
        return (
          <PreviewBox
            key={item.id}
            preview={item}
            click={() => handleClick(item.id)}
            expanded={false}
            showId={showId}
            openModalOnClick={openModalOnClick}
          />
        );
      })}
    </Wrapper>
  );
}

const getPreNewsListQueryOption = ({ keyword, state }: { keyword: string; state?: NewsState }) =>
  queryOptions({
    queryKey: ['getPreNewsList', keyword, state],
    queryFn: () => {
      return newsRepository.getPreviews(0, INF, keyword, state ?? NewsState.Pending);
    },
  });

const LoadingWrapper = styled.div`
  background-color: transparent;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;
