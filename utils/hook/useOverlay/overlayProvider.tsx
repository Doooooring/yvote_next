import { PropsWithChildren, ReactNode, useState } from 'react';
import { OverlayContext } from './useOverlay';

export default function OverlayProvider({ children, ...others }: PropsWithChildren) {
  const [overlays, setOverlays] = useState<ReactNode[]>([]);

  const show = (ele: ReactNode) => {};

  const close = (ele: ReactNode) => {};

  return (
    <OverlayContext.Provider value={{ show, close }} {...others}>
      {children}
    </OverlayContext.Provider>
  );
}
