
import { useCallback, useState } from "react";
import NewsRepository, { NewsDetail } from '@repositories/news';



import { KeywordOnDetail } from '@utils/interface/keywords';

type AnswerState = 'left' | 'right' | 'none' | null;

interface getNewsContentResponse {
    news: NewsDetail | null;
  }

export const useFetchNewsContent = () => {
    const [newsContent, setNewsContent] = useState<NewsDetail | null>(null);
    const [voteHistory, setVoteHistory] = useState<AnswerState>(null);
   
    const showNewsContent = async (id: string) => {
        const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(id, null);
        const { news } = newsInfo;
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
        hideNewsContent
      }
}