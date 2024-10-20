import { PropsWithChildren, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { ToastMessageContext } from './useToastMessage';

let id = 0;

interface Node {
  id: number;
  element: ReactNode;
  is: boolean;
}

export function ToastMessageProvider({ children, ...others }: PropsWithChildren) {
  const [toastMessages, setToastMessages] = useState<Node[]>([]);

  const show = (ele: ReactNode, time: number) => {
    let nodeId = (id += 1);
    setToastMessages([...toastMessages, { id: nodeId, element: ele, is: true }]);
    setTimeout(() => {
      close(nodeId);
    }, time);
    return nodeId;
  };

  const unMount = (id: number) => {
    setToastMessages((prev) => [...prev.filter((node) => node.id != id)]);
  };

  const close = (id: number) => {
    setToastMessages((prev) => [
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
    <ToastMessageContext.Provider value={{ show, close }} {...others}>
      {children}
      {toastMessages.map((node) => (
        <ToastMessage key={node.id} is={node.is}>
          {node.element}
        </ToastMessage>
      ))}
    </ToastMessageContext.Provider>
  );
}

interface ToastMessageProps extends PropsWithChildren {
  is: boolean;
}

function ToastMessage({ children, is }: ToastMessageProps) {
  return <ToastMessageWrapper $isShow={is}>{children}</ToastMessageWrapper>;
}

interface ToastMessageWrapperProps {
  $isShow: boolean;
}

const ToastMessageWrapper = styled.div<ToastMessageWrapperProps>`
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
