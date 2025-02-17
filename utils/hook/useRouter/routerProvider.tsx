import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { getShortUUID } from '@utils/tools/uuid';
import { useRouter } from 'next/router';
import { deleteSessionItem, getSessionItem, saveSessionItem } from '../../tools/session';
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
  const router = useRouter();
  const pagePointer = useRef<number>(-1);
  const pageHistoryStack = useRef<Array<pageHistory>>([]);

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

      deleteSessionItem('routeHistory');
    }

    window.addEventListener('beforeunload', () => {
      saveSessionItem('routeHistory', {
        pagePointer: pagePointer.current,
        historyStack: pageHistoryStack.current,
      });
    });

    if (navigationType === 'navigate' && searchParams.has('pageId')) {
      searchParams.delete('pageId');
      navigateType.current = navigationState.navigate;
    } else if (navigationType === 'reload') {
      navigateType.current = navigationState.reload;
    }
  }, []);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    if (!searchParams.get('pageId')) {
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

      searchParams.set('pageId', getShortUUID(4));
      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`, undefined, {
        shallow: true,
      });
      const pageId = searchParams.get('pageId')!;

      pagePointer.current++;
      pageHistoryStack.current.push({ pageId: pageId, path: router.asPath });
    } else if (navigateType.current == navigationState.reload) {
      const pageId = getShortUUID(4);
      pageHistoryStack.current[pagePointer.current].pageId = pageId;
      searchParams.set('pageId', pageId);
      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`, undefined, {
        shallow: true,
      });
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

    navigateType.current = navigationState.move;
  }, [router.pathname]);

  return (
    <RouterContext.Provider
      value={{
        router: router,
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
