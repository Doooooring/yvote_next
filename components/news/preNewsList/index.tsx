import { INF } from '@/public/assets/resource';
import { newsRepository } from '@/repositories/news';
import { NewsState, Preview } from '@/utils/interface/news';
import PreviewBox from '@components/news/previewBox';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';

export function PreNewsList({
  keywordFilter,
  newsTypeFilter = 'all',
  titleSearch = '',
}: {
  keywordFilter: string;
  newsTypeFilter?: 'all' | string;
  titleSearch?: string;
}) {
  const { data: preNewsList } = useSuspenseQuery({
    ...getPreNewsListQueryOption({ keyword: keywordFilter }),
  });

  const normalizedTitleSearch = titleSearch.trim().toLowerCase();

  const filteredPreNewsList = preNewsList.filter((item: Preview) => {
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
  });

  return (
    <Wrapper>
      {filteredPreNewsList.map((item) => {
        return <PreviewBox key={item.id} preview={item} click={() => {}} expanded={false} />;
      })}
    </Wrapper>
  );
}

const getPreNewsListQueryOption = ({ keyword }: { keyword: string }) =>
  queryOptions({
    queryKey: ['getPreNewsList', keyword],
    queryFn: () => {
      return newsRepository.getPreviews(0, INF, keyword, NewsState.Pending);
    },
  });

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
