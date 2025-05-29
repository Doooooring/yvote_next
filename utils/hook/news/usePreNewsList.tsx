import { INF } from '@public/assets/resource';
import newsRepository from '@repositories/news';
import { NewsState } from '@utils/interface/news';
import { useSuspense } from '../useSuspense';

export default function usePreNewsList() {
  const read = useSuspense('preNewsList', async () => {
    const response = await newsRepository.getPreviews(0, INF, null, NewsState.Pending);
    return response;
  });

  return read;
}
