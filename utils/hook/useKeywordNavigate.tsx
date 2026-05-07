import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const useKeywordNavigate = () => {
  const router = useRouter();

  const moveToKeywordDetail = useCallback((id: string) => {
    router.push(`/keywords/${id}`);
  }, []);

  return moveToKeywordDetail;
};
