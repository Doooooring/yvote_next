import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useKeywordNavigate = () => {
  const navigate = useRouter();

  const moveToKeywordDetail = useCallback((id: string) => {
    navigate.push(`/keywords/${id}`);
  }, []);

  return moveToKeywordDetail;
};
