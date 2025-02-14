import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';

import { getRenderingEnvironment, RenderingEnvironment } from '@utils/tools';
import { useRouter as useOriginalRouter } from 'next/router';
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

export function RouterProvider({ children, ...others }: PropsWithChildren) {
  const curRouteState = useRef<RouteState | null>(null);
  const prevPage = useRef<string | null>(null);
  const pagePointer = useRef<number>(0);
  const pageHistoryStack = useRef<Array<pageHistory>>([]);

  const originalRouter = useOriginalRouter();

  const setCurRouteState = (state: RouteState | null) => {
    return (curRouteState.current = state);
  };

  const getCurBrowserHistory = useCallback(() => {
    const state = history.state;
    const id = state.key as string;
    const path = state.as as string;
    return {
      pageId: id,
      path,
    };
  }, []);

  const addPageHistory = useCallback(() => {
    const state = history.state;
    const id = state.key as string;
    const path = state.as as string;

    console.log('add page history ...');
    console.log('state : ', state);
    console.log('id : ', id);
    console.log('path  :', path);
    console.log('+==================');

    pageHistoryStack.current.push({ pageId: id, path });
  }, []);

  const replacePageHistory = useCallback((index: number) => {
    const state = history.state;
    const id = state.key as string;
    const path = state.as as string;
    pageHistoryStack.current[index] = { pageId: id, path };
  }, []);

  const hydratePageHistory = useCallback(() => {
    while (pagePointer.current < pageHistoryStack.current.length - 1) {
      pageHistoryStack.current.pop();
    }
  }, []);

  const handlePopStateEvent = useCallback((e: PopStateEvent) => {
    const state = e.state;
    const id = state.key;
    const { pageId: prevId } = getPageInfoByIndex(pagePointer.current - 1);

    if (id == prevId) {
      console.log('isback');
      setCurRouteState(RouteState.back);
    } else {
      console.log('is forward');
      setCurRouteState(RouteState.forward);
    }
  }, []);

  const log = () => {
    console.log('========== current route info');
    console.log('current pointer : ', pagePointer.current);
    console.log('current page info', getCurrentPageInfo());
    console.log('current broswer info : ', getCurBrowserHistory());
    console.log('prev page info : ', prevPage.current);
    console.log('page stack : ', pageHistoryStack.current);
  };

  const router = useMemo(() => {
    return new Proxy(originalRouter, {
      get(target, prop, receiver) {
        if (getRenderingEnvironment() === RenderingEnvironment.client) {
          const path = originalRouter.pathname;
          switch (prop) {
            case RouteState.push:
            case RouteState.back:
            case RouteState.forward:
            case RouteState.replace:
              setCurRouteState(prop);
              break;
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }, [originalRouter]);

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

  const setRouteStart = useCallback(() => {
    const pageHistory = getCurrentPageInfo();
    prevPage.current = pageHistory.pageId;
  }, [getCurrentPageInfo]);

  const setRouteEnd = useCallback(() => {
    switch (curRouteState.current) {
      case RouteState.push:
        hydratePageHistory();
        pagePointer.current++;
        addPageHistory();
        break;
      case RouteState.forward:
        pagePointer.current++;
        break;
      case RouteState.back:
        pagePointer.current--;
        break;
      case RouteState.replace:
        replacePageHistory(pagePointer.current);
    }
    log();
    setCurRouteState(null);
  }, []);

  useEffect(() => {
    const historyCached = getSessionItem('routeHistory') as {
      pagePointer: number;
      historyStack: Array<pageHistory>;
    } | null;

    if (historyCached) {
      pagePointer.current = historyCached.pagePointer;
      historyCached.historyStack.forEach((e, i) => {
        pageHistoryStack.current.push(e);
      });

      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0 && entries[0].type === 'reload') {
        const history = getCurBrowserHistory();
        pageHistoryStack.current[pagePointer.current] = history;
      } else {
        const browserHistory = getCurBrowserHistory();
        const cachedHistory = getCurrentPageInfo();

        console.log('==================');
        console.log('browser history : ', browserHistory);
        console.log('cached History  : ', cachedHistory);
        console.log('entry : ', entries[0]);

        if (browserHistory.path != cachedHistory.path) {
          hydratePageHistory();
          pagePointer.current++;
          addPageHistory();
        }
      }
      deleteSessionItem('routeHistory');
    } else {
      addPageHistory();
    }

    console.log(pageHistoryStack.current);

    window.addEventListener('popstate', handlePopStateEvent);
    window.addEventListener('beforeunload', () => {
      saveSessionItem('routeHistory', {
        pagePointer: pagePointer.current,
        historyStack: pageHistoryStack.current,
      });
    });
    router.events.on('routeChangeStart', setRouteStart);
    router.events.on('routeChangeComplete', setRouteEnd);
    router.events.on('routeChangeError', setRouteEnd);

    return () => {
      window.removeEventListener('popstate', handlePopStateEvent);
      router.events.off('routeChangeStart', setRouteStart);
      router.events.off('routeChangeComplete', setRouteEnd);
      router.events.off('routeChangeError', setRouteEnd);
    };
  }, []);

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
