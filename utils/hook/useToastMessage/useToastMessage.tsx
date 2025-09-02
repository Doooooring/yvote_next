import { ReactNode, createContext, useContext } from 'react';

export type ToastDirection = 'top' | 'bottom';

export interface ToastMessageContextProp {
  show: (
    comp: ReactNode,
    time: number,
    option?: {
      direction?: ToastDirection;
    },
  ) => number;
}

export const ToastMessageContext = createContext<ToastMessageContextProp | null>(null);

export const useToastMessage = () => {
  const { show } = useContext(ToastMessageContext)!;
  return { show };
};
