import { PropsWithChildren, ReactNode, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { OverlayContext } from './useOverlay';

let id = 0;

interface Node {
  id: number;
  element: ReactNode;
}

export function OverlayProvider({ children, ...others }: PropsWithChildren) {
  const [overlays, setOverlays] = useState<Node[]>([]);

  const show = (ele: ReactNode) => {
    console.log('is here??');
    id += 1;
    setOverlays([...overlays, { id: id, element: ele }]);
    return id;
  };

  const close = (id: number) => {
    setOverlays((prev) => [...prev.filter((node) => node.id != id)]);
  };

  return (
    <OverlayContext.Provider value={{ show, close }} {...others}>
      {children}
      {overlays.map((node) => (
        <Overlay key={node.id}>{node.element}</Overlay>
      ))}
    </OverlayContext.Provider>
  );
}

function Overlay({ children }: PropsWithChildren) {
  return <OverlayWrapper>{children}</OverlayWrapper>;
}

const animation = keyframes`
  0% {
    opacity  :1 ;
  }
  100% {
    opacity:  0;
  }
`;

const OverlayWrapper = styled.div`
  position: fixed;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 99999;

  animation: blink 0.5s ease-in-out 1;

  @keyframes blink {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
