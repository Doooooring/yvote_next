import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import styled from 'styled-components';

interface LeftButtonProps {
  curView: number;
  viewToLeft: () => unknown;
}

interface RightButtonProps {
  curView: number;
  viewToRight: () => unknown;
  lastPage: number;
}

export function LeftButton({ curView, viewToLeft }: LeftButtonProps) {
  return (
    <LeftButtonWrapper
      curView={curView}
      onClick={() => {
        viewToLeft();
      }}
    >
      <AiOutlineLeft size="30px" />
    </LeftButtonWrapper>
  );
}

export function RightButton({ curView, viewToRight, lastPage }: RightButtonProps) {
  return (
    <RightButtonWrapper
      curView={curView}
      lastPage={lastPage}
      onClick={() => {
        viewToRight();
      }}
    >
      <AiOutlineRight size="30px" />
    </RightButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 0;
  box-shadow: 0 0 30px -15px;
  background-color: rgba(255, 255, 255, 0);
  z-index: 99;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

interface LeftButtonWrapperProps {
  curView: number;
}
const LeftButtonWrapper = styled(ButtonWrapper)<LeftButtonWrapperProps>`
  display: ${({ curView }) => (curView === 0 ? 'none' : 'flex')};
  left: -30px;
`;

interface RightButtonWrapperProps {
  curView: number;
  lastPage: number;
}
const RightButtonWrapper = styled(ButtonWrapper)<RightButtonWrapperProps>`
  display: ${({ curView, lastPage }) => (curView === lastPage ? 'none' : 'flex')};
  right: -30px;
`;
