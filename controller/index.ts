import keywordRepository from '@repositories/keywords';
import { KeywordCategory } from '@utils/interface/keywords';

export const getKeywordsGroupByCategoryAndRecent = async (batchSize: number) => {
  const promises = (Object.keys(KeywordCategory) as KeywordCategory[]).map(async (category) => {
    const response = await keywordRepository.getKeywordsShort(0, batchSize, { category });
    return { category, data: response };
  });

  const recentPromise = (async function () {
    return {
      category: 'recent',
      data: await keywordRepository.getKeywordsShort(0, batchSize, { isRecent: true }),
    };
  })();

  const response = await Promise.all( [...promises, recentPromise]);
  return response;
};
