import { useRouter } from '@utils/hook/useRouter/useRouter';
import { MouseEvent, useCallback } from 'react';

export const useNewsNavigate = () => {
  const { router, routeWithMouseEvent } = useRouter();

  const moveToNewsDetail = useCallback(
    (id: number, e?: MouseEvent<HTMLAnchorElement>) => {
      if (e) routeWithMouseEvent(`/news/${id}`, e);
      else {
        router.push(`/news/${id}`);
      }
    },
    [routeWithMouseEvent],
  );

  return moveToNewsDetail;
};
