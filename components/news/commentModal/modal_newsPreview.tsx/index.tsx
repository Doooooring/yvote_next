import { CommonIconButton } from '@components/common/commonStyles';
import { CommonModalLayout } from '@components/common/modal/component';
import { commentType } from '@utils/interface/news';
import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { sortComment } from '@utils/interface/news/comment';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import CommentBodyCommon from '../commentBodyCommon';
import { ModalBodyWrapper } from '../figure';

interface Modal_NewsPreviewProp {
  id: number;
  commentTypes: Array<commentType>;
  close: () => void;
  initialCommentId?: number;
  newsTitle?: string;
  disableCategorize?: boolean;
}

export function CommentModal_NewsPreview({ id, commentTypes, close, initialCommentId, newsTitle, disableCategorize }: Modal_NewsPreviewProp) {
  const commentTypesSorted = useMemo(() => {
    return sortComment(commentTypes);
  }, [commentTypes]);
  const [commentSelected, setCommentSelected] = useState<commentType>(commentTypesSorted[0]);

  return (
    <CommonModalLayout onOutClick={close}>
      <ModalBodyWrapper onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) close(); }}>
        {commentTypes.length > 0 && (
          <>
            <CommentButtons>
              {commentTypesSorted.map((commentType) => {
                return (
                  <CommentButton
                    key={commentType}
                    $selected={commentType === commentSelected}
                    onClick={() => {
                      setCommentSelected(commentType);
                    }}
                  >
                    <CommentTypeIcon type={commentType} size={16} />
                  </CommentButton>
                );
              })}
            </CommentButtons>
            <CommentBodyCommon id={id} commentType={commentSelected} close={close} initialCommentId={initialCommentId} newsTitle={newsTitle} disableCategorize={disableCategorize} />
          </>
        )}
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

const CommentButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  padding: 0.3rem 0 0.5rem;
`;

const CommentButton = styled(CommonIconButton)<{ $selected: boolean }>`
  padding: 0.25rem;
  border-radius: 4px;
  background-color: ${({ $selected, theme }) => ($selected ? theme.colors.yvote02 : theme.colors.yvote01)} !important;
  border: ${({ $selected, theme }) =>
    $selected ? `1px solid ${theme.colors.yvote06}` : `1px solid ${theme.colors.yvote04}`};
  filter: ${({ $selected }) => ($selected ? 'grayscale(0)' : 'grayscale(0.6)')};
  transition: all 0.15s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote02} !important;
    border-color: ${({ theme }) => theme.colors.yvote06};
  }
`;
