import { useRouter } from 'next/router';
import { MouseEvent, useCallback } from 'react';

export function useRouterUtils() {
  const router = useRouter();

  const routeWithMouseEvent = useCallback(
    (url: string, e?: MouseEvent<HTMLAnchorElement>) => {
      if (e && (e.altKey || e.metaKey)) {
        window.open(url, '_blank');
        return;
      } else {
        router.push(url);
      }
    },
    [router],
  );

  return { routeWithMouseEvent };
}
