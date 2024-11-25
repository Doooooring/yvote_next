import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useNewsNavigate = () => {
  const navigate = useRouter();

  const moveToNewsDetail = useCallback((id: number) => {
    navigate.push(`/news/${id}`);
  }, []);

  return moveToNewsDetail;
};
