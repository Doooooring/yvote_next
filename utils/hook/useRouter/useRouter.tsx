import { NextRouter } from 'next/router';
import { createContext, useContext } from 'react';
import { pageHistory } from './router.types';

export interface RouteContextProp {
  router: NextRouter;
  getCurrentPageId: () => number;
  getPageInfoById: (id: number) => pageHistory;
}

export const RouterContext = createContext<RouteContextProp | null>(null);

export const useRouter = () => {
  return useContext(RouterContext)!;
};
