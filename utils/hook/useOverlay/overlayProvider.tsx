import { PropsWithChildren, ReactNode, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { OverlayContext } from './useOverlay';

let id = 0;

interface Node {
  id: number;
  element: ReactNode;
  is: boolean;
}

export function OverlayProvider({ children, ...others }: PropsWithChildren) {
  const [overlays, setOverlays] = useState<Node[]>([]);

  const show = (ele: ReactNode) => {
    let nodeId = (id += 1);
    setOverlays([...overlays, { id: nodeId, element: ele, is: true }]);
    setTimeout(() => {
      close(nodeId);
    }, 2000);
    return nodeId;
  };

  const unMount = (id: number) => {
    setOverlays((prev) => [...prev.filter((node) => node.id != id)]);
  };

  const close = (id: number) => {
    setOverlays((prev) => [
      ...prev.map((node) => {
        if (node.id === id) {
          node.is = false;
        }
        return node;
      }),
    ]);
    setTimeout(() => {
      unMount(id);
    }, 1000);
  };

  return (
    <OverlayContext.Provider value={{ show, close }} {...others}>
      {children}
      {overlays.map((node) => (
        <Overlay key={node.id} is={node.is}>
          {node.element}
        </Overlay>
      ))}
    </OverlayContext.Provider>
  );
}

interface OverlayProps extends PropsWithChildren {
  is: boolean;
}

function Overlay({ children, is }: OverlayProps) {
  return <OverlayWrapper $isShow={is}>{children}</OverlayWrapper>;
}

interface OverlayWrapperProps {
  $isShow: boolean;
}

const OverlayWrapper = styled.div<OverlayWrapperProps>`
  position: fixed;

  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 99999;
  animation: ${({ $isShow }) =>
    $isShow
      ? 'showAnimation 0.3s ease-in-out forwards'
      : 'closeAnimation 0.3s ease-in-out forwards'};

  @keyframes showAnimation {
    0% {
      opacity: 0;
      top: 9%;
    }
    100% {
      opacity: 1;
      top: 12%;
    }
  }

  @keyframes closeAnimation {
    0% {
      opacity: 1;
      top: 12%;
    }
    100% {
      top: 9%;
      opacity: 0;
    }
  }
`;
