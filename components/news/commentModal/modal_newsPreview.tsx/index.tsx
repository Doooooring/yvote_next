import { CommonIconButton, CommonModalBackground } from '@components/common/commonStyles';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, sortComment } from '@utils/interface/news/comment';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import CommentBodyCommon from '../commentBodyCommon';
import { ModalBodyWrapper } from '../figure';

interface Modal_NewsPreviewProp {
  id: number;
  commentTypes: Array<commentType>;
  close: () => void;
}

export function CommentModal_NewsPreview({ id, commentTypes, close }: Modal_NewsPreviewProp) {
  const [commentSelected, setCommentSelected] = useState<commentType>(commentTypes[0]);

  return (
    <_ModalWrapper close={close}>
      <ModalBodyWrapper>
        {commentTypes.length === 0 ? (
          <></>
        ) : (
          <>
            <CommentButtons>
              {sortComment(commentTypes).map((commentType) => {
                return (
                  <CommentButton
                    key={commentType}
                    $selected={commentType === commentSelected}
                    onClick={() => {
                      setCommentSelected(commentType);
                    }}
                  >
                    <Image
                      src={commentTypeImg(commentType)}
                      alt={commentType}
                      width="20"
                      height="20"
                    />
                  </CommentButton>
                );
              })}
            </CommentButtons>
            <CommentBodyCommon id={id} commentType={commentSelected} close={close} />
          </>
        )}
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

const CommentButtons = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem;

  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const CommentButton = styled(CommonIconButton)<{ $selected: boolean }>`
  padding: 0.4rem;
  background-color: white !important;
  border: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.colors.yvote03}` : `2px solid ${theme.colors.gray400}`};
  filter: ${({ $selected }) => ($selected ? 'grayscale(0)' : 'grayscale(0.7)')};
`;
