import newsRepository from '@repositories/news';
import { useSuspense } from './useSuspense';

export const useRecentArticles = () => {
  const read = useSuspense('recentArticles', async () => {
    const response = await newsRepository.getRecentUpdatedComments(0, 100);
    return response;
  });
  return read();
};
