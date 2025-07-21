import { newsRepository } from '@repositories/news';
import { commentType, recentArticleType } from '@utils/interface/news';

export const RecentArticleQueryOption = (
  category: recentArticleType,
  offset: number,
  limit: number,
) => {
  return {
    queryKey: ['recentArticles' + category, offset, limit],
    queryFn: async () => {
      const option: { type?: commentType } = {};
      if (category !== '전체') option.type = category;

      const response = await newsRepository.getRecentUpdatedComments(0, 100, option);
      return response;
    },
  };
};
