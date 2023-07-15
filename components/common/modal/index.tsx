import { ReactNode } from 'react';
import styled from 'styled-components';

interface ModalProps {
  children: ReactNode;
  state: boolean;
}

export default function Modal({ children, state }: ModalProps) {
  if (!state) return <></>;

  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 200px;
  padding-bottom: 200px;
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
