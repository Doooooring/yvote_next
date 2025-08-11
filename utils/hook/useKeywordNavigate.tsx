import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useKeywordNavigate = () => {
  const router = useRouter();

  const moveToKeywordDetail = useCallback((id: string) => {
    router.push(`/keywords/${id}`);
  }, []);

  return moveToKeywordDetail;
};
