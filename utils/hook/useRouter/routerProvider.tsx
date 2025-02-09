import { PropsWithChildren, useCallback, useMemo, useRef } from '@node_modules/@types/react';

import { useRouter as useOriginalRouter } from '@node_modules/next/router';
import { getRenderingEnvironment, RenderingEnvironment } from '@utils/tools';
import { pageHistory } from './router.types';
import { RouterContext } from './useRouter';

export function RouterProvider({ children, ...others }: PropsWithChildren) {
  const pageId = useRef(0);

  const pagePointer = useRef<number>(0);
  const pageHistoryStack = useRef<Array<pageHistory>>([]);

  const originalRouter = useOriginalRouter();

  const addPageHistoryStack = useCallback((path: string) => {
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

  const getCurrentPageId = useCallback(() => {
    return pagePointer.current;
  }, []);

  const getPageInfoById = useCallback(
    (id: number) => {
      return pageHistoryStack.current.filter((page) => page.pageId == id)[0];
    },
    [pageHistoryStack],
  );

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

  return (
    <RouterContext.Provider
      value={{
        router: router,
        getCurrentPageId,
        getPageInfoById,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
