import { useCallback } from 'react';
import { useRouter } from '@utils/hook/useRouter/useRouter';

export const useNewsNavigate = () => {
  const { router } = useRouter();

  const moveToNewsDetail = useCallback((id: number, e?: MouseEvent) => {
    if (e?.altKey) {
      window.open(`/news/${id}`, '_blank');
      return;
    }
    router.push(`/news/${id}`);
  }, []);

  return moveToNewsDetail;
};
