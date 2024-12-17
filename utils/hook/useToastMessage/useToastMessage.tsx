import { ReactNode, createContext, useContext } from 'react';

export interface ToastMessageContextProp {
  show: (comp: ReactNode, time: number) => number;
}

export const ToastMessageContext = createContext<ToastMessageContextProp | null>(null);

export const useToastMessage = () => {
  const { show } = useContext(ToastMessageContext)!;
  return { show };
};
