import { CommonModalLayout } from '@components/common/modal/component';
import { commentType } from '@utils/interface/news';
import { MouseEvent } from 'react';
import styled from 'styled-components';
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
    <CommonModalLayout
      onOutClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <ModalBodyWrapper>
        <CommentBodyCommon id={id} commentType={commentType} close={close} />
      </ModalBodyWrapper>
    </CommonModalLayout>
  );
}

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
