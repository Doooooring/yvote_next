import styled from 'styled-components';
import { CommonLayoutBox } from '../../common/commonStyles';
import { HTMLAttributes, ReactNode } from 'react';

interface ModalBodyLayoutProps extends HTMLAttributes<HTMLDivElement> {
  headView: ReactNode;
  bodyView: ReactNode;
}

export default function ModalBodyLayout({ headView, bodyView }: ModalBodyLayoutProps) {
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
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 680px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem 2rem;
  flex: 0 0 auto;
  letter-spacing: -0.5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 768px) {
    width: 99%;
    min-width: 0px;
    padding: 1.5rem 1rem;
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
