import { commentType } from '@utils/interface/news';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { CommonModalBackground } from '../../../common/commonStyles';
import CommentBodyCommon from '../commentBodyCommon';
import { ModalBodyWrapper } from '../figure';

export function CommentModal({
  id,
  commentType,
  close,
}: {
  id: number;
  commentType: commentType;
  close: () => void;
}) {
  return (
    <_ModalWrapper close={close}>
      <ModalBodyWrapper>
        <CommentBodyCommon id={id} commentType={commentType} close={close} />
      </ModalBodyWrapper>
    </_ModalWrapper>
  );
}

const _ModalWrapper = ({ close, children }: { close: () => void; children: ReactNode }) => {
  return (
    <CommonModalBackground
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      {children}
    </CommonModalBackground>
  );
};

const _ModalBodyWrapper = styled.div`
  width: 60%;
  min-width: 680px;
  margin-left: auto;
  margin-right: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 768px) {
    width: 99%;
    min-width: 0px;
  }
`;
