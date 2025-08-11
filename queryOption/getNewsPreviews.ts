import { newsRepository } from '@/repositories/news';
import { NewsState, Preview } from '@/utils/interface/news';
import { fetchImg } from '@/utils/tools/async';
import { infiniteQueryOptions } from '@tanstack/react-query';

async function getNewsPreviews({
  page,
  limit,
  filter,
  isAdmin,
}: {
  page: number;
  limit: number;
  filter: string;
  isAdmin: boolean;
  newsState?: NewsState;
}) {
  const datas: Array<Preview> = isAdmin
    ? await newsRepository.getPreviewsAdmin(page, limit, filter)
    : await newsRepository.getPreviews(page, limit, filter, NewsState.Published);

  await Promise.all(
    datas.map(async (data) => {
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

export const getNewsPreviewsQueryOption = ({
  filter,
  offset,
  limit,
  isAdmin = false,
}: {
  filter: string;
  offset: number;
  limit: number;
  isAdmin?: boolean;
}) =>
  infiniteQueryOptions({
    queryKey: ['getNewsPreviews', filter, isAdmin],
    queryFn: (context) => {
      const pageParam = context.pageParam;
      return getNewsPreviews({
        page: pageParam,
        limit,
        filter,
        isAdmin,
      });
    },
    initialPageParam: offset,

    getNextPageParam: (prevPageData, __, lastPageParam) => {
      return prevPageData.length === 0 ? undefined : lastPageParam + prevPageData.length;
    },
  });
