import { ReactNode, createContext } from 'react';

export interface OverlayContextProp {
  show: (comp: ReactNode) => void;
  close: (comp: ReactNode) => void;
}

export const OverlayContext = createContext<OverlayContextProp | null>(null);
