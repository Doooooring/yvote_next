import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled, { CSSProp, CSSProperties } from 'styled-components';

interface ModalProps {
  children: ReactNode;
  state: boolean;
  outClickAction?: () => any;
  backgroundColor?: string;
  style?: CSSProperties;
}

export default function Modal({
  children,
  state,
  outClickAction,
  backgroundColor = 'rgba(0,0,0,0.5)',
  style = {},
}: ModalProps) {
  if (!state) return <></>;

  return createPortal(
    <Wrapper
      onClick={(e) => {
        if (e.target === e.currentTarget && outClickAction) {
          outClickAction();
        }
      }}
      style={{
        ...style,
        backgroundColor: backgroundColor,
      }}
    >
      {children}
    </Wrapper>,
    document.getElementById('portal-root') as HTMLElement,
  );
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 9999;
  /* display: flex;
  flex-direction: row;
  justify-content: center; */
`;
