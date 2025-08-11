import { useRouter } from 'next/router';
import { MouseEvent, useCallback } from 'react';
import { useRouterUtils } from './router/useRouterUtils';

export const useNewsNavigate = () => {
  const router = useRouter();
  const { routeWithMouseEvent } = useRouterUtils();

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
