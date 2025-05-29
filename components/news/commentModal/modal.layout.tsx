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
      <div
        className="close-button"
        onClick={() => {
          close();
        }}
      >
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
  padding: 1rem 2rem;
  flex: 0 0 auto;
  letter-spacing: -0.5px;
  

  @media screen and (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  div.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    text-indent: 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 2rem;
    @media screen and (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const ModalHead = styled.div`
  @media screen and (max-width: 768px) {
    padding-left: 0;
  }
`;

const ModalBody = styled.div`
  flex: 0 1 auto;

  height: 500px;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1.5px solid rgb(225, 225, 225);
  border-bottom: 1.5px solid #ddd;
  position: relative;

  @media screen and (max-width: 768px) {
    height: calc(0.63 * 100vh);
  }
`;

const ModalFooter = styled(Row)`
  justify-content: end;
  gap: 12px;
  padding-top: 0.5rem;
`;
