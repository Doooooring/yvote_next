import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getRenderingEnvironment, RenderingEnvironment } from '@utils/tools';
import { useRouter as useOriginalRouter } from 'next/router';
import { pageHistory } from './router.types';
import { RouterContext } from './useRouter';

export interface NextRouterPopState {
  url: string; // Next 코드 상 매칭 path ex) /news/[news]
  as: string; // 실제 이동 url ex) /news/386
  key: string; // 자체 생성 해시값
}

export function RouterProvider({ children, ...others }: PropsWithChildren) {
  const pageId = useRef(0);
  const pagePointer = useRef<number>(0);
  const pageHistoryStack = useRef<Array<pageHistory>>([]);
  const [loading, setLoading] = useState(false);

  const originalRouter = useOriginalRouter();

  const addPageHistoryStack = useCallback((path: string) => {

    while (pagePointer.current < pageHistoryStack.current.length - 1) {
      pageHistoryStack.current.pop();
    }
    pageHistoryStack.current.push({ pageId: pageId.current, path });
    pageId.current++;
    pagePointer.current++;
  }, []);

  const moveForward = useCallback(() => {
    pagePointer.current++;
  }, []);

  const moveBack = useCallback(() => {
    pagePointer.current--;
  }, []);

  const router = useMemo(() => {
    return new Proxy(originalRouter, {
      get(target, prop, receiver) {
        if (getRenderingEnvironment() === RenderingEnvironment.client) {
          const path = originalRouter.pathname;
          switch (prop) {
            case 'push':
              addPageHistoryStack(path);
              break;
            case 'back':
              moveBack();
              break;
            case 'forward':
              moveForward();
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
    return pageHistoryStack.current[pagePointer.current];
  }, []);

  const getPageInfoById = useCallback(
    (id: number) => {
      return pageHistoryStack.current.filter((page) => page.pageId === id)[0];
    },
    [pageHistoryStack],
  );

  const setRouteStart = useCallback(() => setLoading(true), [setLoading]);

  const setRouteEnd = useCallback(() => {
    setLoading(false);
    history.replaceState({ ...history.state, pageId: pageId.current }, '');
  }, [setLoading]);

  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      const state = event.state as { url: string; as: string; key: string };
      console.log('pop state : ', event);
      console.log('state : ', event.state);
      console.log('==========');
    });

    router.events.on('routeChangeStart', setRouteStart);
    router.events.on('routeChangeComplete', setRouteEnd);
    router.events.on('routeChangeError', setRouteEnd);

    return () => {
      router.events.off('routeChangeStart', setRouteStart);
      router.events.off('routeChangeComplete', setRouteEnd);
      router.events.off('routeChangeError', setRouteEnd);
    };
  }, []);

  return (
    <RouterContext.Provider
      value={{
        router: router,
        loading: loading,
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
