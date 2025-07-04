import { MouseEvent, PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';

import { getRandomNumString } from '@utils/tools/crypto';
import { useRouter } from 'next/router';
import { getRenderingEnvironment, RenderingEnvironment } from '../../tools';
import { getSessionItem, saveSessionItem } from '../../tools/session';
import { pageHistory } from './router.types';
import { RouterContext } from './useRouter';

export interface NextRouterPopState {
  url: string; // Next 코드 상 매칭 path ex) /news/[news]
  as: string; // 실제 이동 url ex) /news/386
  key: string; // 자체 생성 해시값
}

export enum RouteState {
  push = 'push',
  back = 'back',
  forward = 'forward',
  replace = 'replace',
}

export enum navigationState {
  reload = 'reload',
  navigate = 'navigate',
  move = 'move',
}

export const getNavigationType = () => {
  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

  if (entries.length > 0) {
    return entries[0].type;
  }
  return null;
};

export function RouterProvider({ children, ...others }: PropsWithChildren) {
  const navigateType = useRef<navigationState>(navigationState.move);
  const originalRouter = useRouter();
  const pagePointer = useRef<number>(-1);
  const pageHistoryStack = useRef<Array<pageHistory>>([]);

  const router = useMemo(() => {
    return new Proxy(originalRouter, {
      get(target, prop, receiver) {
        if (getRenderingEnvironment() === RenderingEnvironment.client) {
          const path = originalRouter.pathname;
          switch (prop) {
            case RouteState.push:
              return (url: string, as?: string, options?: any) => {
                const currentPath = target.pathname;
                const nextPath = url;

                if (currentPath === nextPath) {
                  window.location.reload();
                } else {
                  return target.push(url, as, options);
                }
              };
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }, [originalRouter]);

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

  const hydratePageHistory = useCallback(() => {
    while (pagePointer.current < pageHistoryStack.current.length - 1) {
      pageHistoryStack.current.pop();
    }
  }, []);

  const getCurrentPageIndex = useCallback(() => {
    return pagePointer.current;
  }, []);

  const getPageInfoByIndex = useCallback((index: number) => {
    return pageHistoryStack.current[index];
  }, []);

  const getCurrentPageInfo = useCallback(() => {
    return pageHistoryStack.current[pagePointer.current] ?? null;
  }, []);

  const getPageInfoById = useCallback(
    (id: string) => {
      return pageHistoryStack.current.filter((page) => page.pageId === id)[0];
    },
    [pageHistoryStack],
  );

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    const searchParams = currentUrl.searchParams;
    const navigationType = getNavigationType();

    const historyCached = getSessionItem('routeHistory') as {
      pagePointer: number;
      historyStack: Array<pageHistory>;
    } | null;

    if (historyCached) {
      pagePointer.current = historyCached.pagePointer;
      historyCached.historyStack.forEach((e, i) => {
        pageHistoryStack.current.push(e);
      });
    }

    if (navigationType === 'navigate') {
      navigateType.current = navigationState.navigate;
    } else if (navigationType === 'reload') {
      navigateType.current = navigationState.reload;
    }
  }, []);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    if (navigateType.current === navigationState.navigate) {
      const pageId = getRandomNumString(6);
      pageHistoryStack.current.push({ pageId: pageId, path: router.asPath });
      pagePointer.current++;
      searchParams.set('pageId', pageId);
      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`, undefined, {
        shallow: true,
      });
    } else if (navigateType.current === navigationState.reload) {
      const pageId = getRandomNumString(6);
      pageHistoryStack.current[pagePointer.current].pageId = pageId;
      searchParams.set('pageId', pageId);
      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`, undefined, {
        shallow: true,
      });
    } else if (!searchParams.get('pageId')) {
      const curId = pageHistoryStack.current[pagePointer.current];
      if (curId) {
        const pointer = pageHistoryStack.current?.reduce((res: number | null, cur, i) => {
          if (!res && cur.pageId === curId.pageId) {
            res = i;
          }
          return res;
        }, null);

        if (pointer) {
          hydratePageHistory();
          pagePointer.current = pointer;
        }
      }
      const pageId = getRandomNumString(6);

      searchParams.set('pageId', pageId);
      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`, undefined, {
        shallow: true,
      });

      pagePointer.current++;
      pageHistoryStack.current.push({ pageId: pageId, path: router.asPath });
    } else {
      const pageId = searchParams.get('pageId')!;
      const pointer = pageHistoryStack.current?.reduce((res: number | null, cur, i) => {
        if (!res && cur.pageId === pageId) {
          res = i;
        }
        return res;
      }, null);

      pagePointer.current = pointer!;
    }
    saveSessionItem('routeHistory', {
      pagePointer: pagePointer.current,
      historyStack: pageHistoryStack.current,
    });

    navigateType.current = navigationState.move;
  }, [router.pathname]);

  return (
    <RouterContext.Provider
      value={{
        router: router,
        routeWithMouseEvent,
        getCurrentPageIndex,
        getPageInfoByIndex,
        getCurrentPageInfo,
        getPageInfoById,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
