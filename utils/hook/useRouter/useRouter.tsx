import { NextRouter } from 'next/router';
import { createContext, MouseEvent, useContext } from 'react';
import { pageHistory } from './router.types';

export interface RouteContextProp {
  router: NextRouter;
  routeWithMouseEvent: (url: string, e?: MouseEvent<HTMLAnchorElement>) => void;
  getCurrentPageIndex: () => number;
  getPageInfoByIndex: (n: number) => pageHistory;
  getCurrentPageInfo: () => pageHistory;
  getPageInfoById: (id: string) => pageHistory;
}

export const RouterContext = createContext<RouteContextProp | null>(null);

export const useRouter = () => {
  return useContext(RouterContext)!;
};
