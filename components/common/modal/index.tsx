import { ReactNode } from 'react';
import styled from 'styled-components';

interface ModalProps {
  children: ReactNode;
  state: boolean;
  outClickAction?: () => any;
}

export default function Modal({ children, state, outClickAction }: ModalProps) {
  if (!state) return <></>;

  return (
    <Wrapper
      onClick={(e) => {
        if (e.target === e.currentTarget && outClickAction) {
          outClickAction();
        }
      }}
    >
      {children}
    </Wrapper>
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
  background-color: rgba(0, 0, 0, 0.5);
  /* display: flex;
  flex-direction: row;
  justify-content: center; */
`;

// const ContentsWrapper = styled.div`
//   width: 100vw;
//   position: absolute;
//   top: 0;
//   left: 0;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// `;
