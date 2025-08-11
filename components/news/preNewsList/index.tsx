import { INF } from '@/public/assets/resource';
import { newsRepository } from '@/repositories/news';
import { NewsState } from '@/utils/interface/news';
import PreviewBox from '@components/news/previewBox';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';

export function PreNewsList() {
  const { data: preNewsList } = useSuspenseQuery({
    ...getPreNewsListQueryOption,
  });

  return (
    <Wrapper>
      {preNewsList.map((item) => {
        return <PreviewBox key={item.id} preview={item} img={item.newsImage} click={() => {}} />;
      })}
    </Wrapper>
  );
}

const getPreNewsListQueryOption = queryOptions({
  queryKey: ['getPreNewsList'],
  queryFn: () => {
    return newsRepository.getPreviews(0, INF, null, NewsState.Pending);
  },
});

const Wrapper = styled.div``;
