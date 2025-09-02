import { PropsWithChildren, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { ToastDirection, ToastMessageContext } from './useToastMessage';

let id = 0;

interface Node {
  id: number;
  element: ReactNode;
  is: boolean;
  direction: ToastDirection;
}

export function ToastMessageProvider({ children, ...others }: PropsWithChildren) {
  const [toastMessages, setToastMessages] = useState<Node[]>([]);

  const show = (
    ele: ReactNode,
    time: number,
    option?: {
      direction?: ToastDirection;
    },
  ) => {
    let nodeId = (id += 1);

    console.log('option : ', option);

    const direction = option?.direction ?? 'top';
    console.log(direction);
    setToastMessages([
      ...toastMessages,
      { id: nodeId, element: ele, is: true, direction: direction },
    ]);
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
    <ToastMessageContext.Provider value={{ show }} {...others}>
      {children}
      {toastMessages.map((node) => {
        if (node.direction === 'top') {
          return (
            <ToastMessageTop key={node.id} $isShow={node.is}>
              {node.element}
            </ToastMessageTop>
          );
        } else {
          return (
            <ToastMessageDown key={node.id} $isShow={node.is}>
              {node.element}
            </ToastMessageDown>
          );
        }
      })}
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
`;

const ToastMessageTop = styled(ToastMessageWrapper)`
  animation: ${({ $isShow }) =>
    $isShow
      ? 'showTopAnimation 0.3s ease-in-out forwards'
      : 'closeTopAnimation 0.3s ease-in-out forwards'};

  @keyframes showTopAnimation {
    0% {
      opacity: 0;
      top: 9%;
    }
    100% {
      opacity: 1;
      top: 12%;
    }
  }

  @keyframes closeTopAnimation {
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

const ToastMessageDown = styled(ToastMessageWrapper)`
  animation: ${({ $isShow }) =>
    $isShow
      ? 'showBottomAnimation 0.3s ease-in-out forwards'
      : 'closeBottomAnimation 0.3s ease-in-out forwards'};

  @keyframes showBottomAnimation {
    0% {
      opacity: 0;
      bottom: 9%;
    }
    100% {
      opacity: 1;
      bottom: 12%;
    }
  }

  @keyframes closeBottomAnimation {
    0% {
      opacity: 1;
      bottom: 12%;
    }
    100% {
      bottom: 9%;
      opacity: 0;
    }
  }
`;
