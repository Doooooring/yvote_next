import { newsRepository } from '@/repositories/news';
import { NewsState, Preview } from '@/utils/interface/news';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

async function getNewsPreviews({
  page,
  limit,
  filter,
  isAdmin,
  newsType,
}: {
  page: number;
  limit: number;
  filter: string;
  isAdmin: boolean;
  newsState?: NewsState;
  newsType?: string;
}) {
  const datas: Array<Preview> = isAdmin
    ? await newsRepository.getPreviewsAdmin(page, limit, filter, newsType)
    : await newsRepository.getPreviews(page, limit, filter, NewsState.Published, newsType);

  return datas;
}

export const getNewsPreviewsQueryOption = ({
  filter,
  offset,
  limit,
  isAdmin = false,
  newsType,
}: {
  filter: string;
  offset: number;
  limit: number;
  isAdmin?: boolean;
  newsType?: string;
}) =>
  infiniteQueryOptions({
    queryKey: ['getNewsPreviews', filter, isAdmin, newsType ?? 'all'],
    queryFn: (context) => {
      const pageParam = context.pageParam;
      return getNewsPreviews({
        page: pageParam,
        limit,
        filter,
        isAdmin,
        newsType,
      });
    },
    initialPageParam: offset,

    getNextPageParam: (prevPageData, __, lastPageParam) => {
      return prevPageData.length === 0 ? undefined : lastPageParam + prevPageData.length;
    },
  });

export const getNewsPreviewsPageQueryOption = ({
  filter,
  offset,
  limit,
  isAdmin = false,
  newsType,
}: {
  filter: string;
  offset: number;
  limit: number;
  isAdmin?: boolean;
  newsType?: string;
}) =>
  queryOptions({
    queryKey: ['getNewsPreviewsPage', filter, isAdmin, newsType ?? 'all', offset, limit],
    queryFn: () =>
      getNewsPreviews({
        page: offset,
        limit,
        filter,
        isAdmin,
        newsType,
      }),
  });
