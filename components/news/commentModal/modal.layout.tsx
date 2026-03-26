import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { CommonLayoutBox, Row } from '../../common/commonStyles';

interface ModalBodyLayoutProps extends HTMLAttributes<HTMLDivElement> {
  headView: ReactNode;
  bodyView: ReactNode;
  footerView: ReactNode;
  close: () => void;
}

export default function ModalLayout({
  close,
  headView,
  bodyView,
  footerView,
}: ModalBodyLayoutProps) {
  return (
    <Wrapper>
      <div className="close-button" onClick={close}>
        &times;
      </div>
      <ModalHead>{headView}</ModalHead>
      <ModalBody>{bodyView}</ModalBody>
      <ModalFooter>{footerView}</ModalFooter>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.75rem 1.25rem;
  flex: 0 0 auto;
  letter-spacing: -0.3px;
  background-color: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote03};
  border-radius: 4px;

  @media screen and (max-width: 768px) {
    padding: 0.75rem 0.75rem;
  }

  div.close-button {
    position: absolute;
    top: 6px;
    right: 10px;
    cursor: pointer;
    text-indent: 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.yvote06};
    &:hover {
      color: ${({ theme }) => theme.colors.yvote08};
    }
    @media screen and (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`;

const ModalHead = styled.div`
  padding: 0;
`;

const ModalBody = styled.div`
  flex: 0 1 auto;

  height: 580px;
  margin-top: 0.4rem;
  padding-top: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote03};
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote03};
  position: relative;

  @media screen and (max-width: 768px) {
    height: calc(0.65 * 100vh);
  }
`;

const ModalFooter = styled(Row)`
  justify-content: end;
  gap: 8px;
  padding-top: 0.4rem;
`;
