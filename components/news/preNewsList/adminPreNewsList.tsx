import { INF } from '@/public/assets/resource';
import { newsRepository } from '@/repositories/news';
import { NewsState } from '@/utils/interface/news';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import PreviewBox from '@/components/news/previewBox';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function AdminPreNewsList({ keywordFilter }: { keywordFilter: string }) {
  const router = useRouter();
  const { data: preNewsList } = useSuspenseQuery({
    queryKey: ['getPreNewsListAdmin', keywordFilter],
    queryFn: async () => {
      // fetch admin previews (all states) then filter to Pending + NotPublished
      const items = await newsRepository.getPreviewsAdmin(0, INF, keywordFilter ?? '');
      return items.filter((p) => p.state === NewsState.Pending || p.state === NewsState.NotPublished);
    },
  });

  const handleClick = useCallback(
    (id: number) => {
      router.push(`/adminjae/${id}`);
    },
    [router],
  );

  return (
    <Wrapper>
      {preNewsList.map((item) => {
        return (
          <PreviewBox key={item.id} preview={item} click={() => handleClick(item.id)} expanded={false} showId={true} />
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
