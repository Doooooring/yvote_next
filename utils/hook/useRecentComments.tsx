import newsRepository from '@repositories/news';
import { commentType, recentArticleType } from '@utils/interface/news';
import { useSuspense } from './useSuspense';

export const useRecentArticles = (category: recentArticleType) => {
  const read = useSuspense('recentArticles_' + category, async () => {
    const option: { type?: commentType } = {};
    if (category !== '전체') option.type = category;
    const response = await newsRepository.getRecentUpdatedComments(0, 100, option);
    return response;
  });
  return read();
};
