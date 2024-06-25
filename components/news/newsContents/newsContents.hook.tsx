import KeywordRepository from '@repositories/keywords';
import { useKeywordNavigate } from '@utils/hook/useKeywordNavigate';

export const useRouteToKeyword = () => {
  const moveToKeywordDetail = useKeywordNavigate();

  const routeToKeywordPage = async (key: string) => {
    const id = await KeywordRepository.getIdByKeyword(key);
    if (!id) {
      alert('다시 시도해주세요!');
      return;
    }
    moveToKeywordDetail(id);
  };

  return routeToKeywordPage;
};
