import NewsRepository from '@repositories/news';
import { useCallback, useState } from 'react';

import { NewsInView } from '@utils/interface/news';

type AnswerState = 'left' | 'right' | 'none' | null;

export const useFetchNewsContent = () => {
  const [newsContent, setNewsContent] = useState<NewsInView | null>(null);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  const showNewsContent = async (id: number) => {
    const news: NewsInView = await NewsRepository.getNewsContent(id, null);

    if (news === null) {
      Error('news content error');
      return;
    }
    setNewsContent(news);
    setVoteHistory(null);
  };

  const hideNewsContent = useCallback(() => {
    setNewsContent(null);
    setVoteHistory(null);
  }, []);

  return {
    newsContent,
    voteHistory,
    showNewsContent,
    hideNewsContent,
  };
};
