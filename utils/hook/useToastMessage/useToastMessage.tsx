import { ReactNode, createContext, useContext } from 'react';

export interface ToastMessageContextProp {
  show: (comp: ReactNode) => number;
  close: (id: number) => void;
}

export const ToastMessageContext = createContext<ToastMessageContextProp | null>(null);

export const useToastMessage = () => {
  const { show, close } = useContext(ToastMessageContext)!;
  return { show, close };
};
