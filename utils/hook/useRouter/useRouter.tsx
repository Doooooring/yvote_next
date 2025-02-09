import { NextRouter } from 'next/router';
import { createContext, useContext } from 'react';

export interface RouteContextProp {
  router: NextRouter;
  getCurrentPageId: () => number;
}

export const RouterContext = createContext<RouteContextProp | null>(null);

export const useRouter = () => {
  return useContext(RouterContext)!;
};
