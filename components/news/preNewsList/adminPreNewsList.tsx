import { Column } from '@/components/common/commonStyles';
import { INF } from '@/public/assets/resource';
import { newsRepository } from '@/repositories/news';
import { NewsState } from '@/utils/interface/news';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import AdminPreviewBox from '@/components/news/previewBox/adminPreviewBox';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function AdminPreNewsList({ keywordFilter }: { keywordFilter: string }) {
  const router = useRouter();
  const { data: preNewsList } = useSuspenseQuery({
    ...getPreNewsListQueryOption({ keyword: keywordFilter }),
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
        return <AdminPreviewBox key={item.id} preview={item} click={handleClick} showId={true} />;
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

const Wrapper = styled(Column)`
  gap: 6px;
`;
