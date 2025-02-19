import { useCallback } from 'react';
import { useRouter } from '@utils/hook/useRouter/useRouter';

export const useNewsNavigate = () => {
  const { router } = useRouter();

  const moveToNewsDetail = useCallback((id: number) => {
    router.push(`/news/${id}`);
  }, []);

  return moveToNewsDetail;
};
