import { ReactNode, createContext, useContext } from 'react';

export interface OverlayContextProp {
  show: (comp: ReactNode) => number;
  close: (id: number) => void;
}

export const OverlayContext = createContext<OverlayContextProp | null>(null);

export const useOverlay = () => {
  const { show, close } = useContext(OverlayContext)!;
  return { show, close };
};
