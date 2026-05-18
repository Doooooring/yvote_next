import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { CommonIconButton } from '@components/common/commonStyles';
import { CommonModalLayout } from '@components/common/modal/component';
import { commentType } from '@utils/interface/news';
import { sortComment } from '@utils/interface/news/comment';

import CommentBodyCommon from '../commentBodyCommon';
import { ModalBodyWrapper } from '../figure';

export function CommentModal({
  id,
  commentType,
  commentTypes,
  close,
  newsTitle,
  disableCategorize,
}: {
  id: number;
  commentType: commentType;
  commentTypes?: Array<commentType>;
  close: () => void;
  newsTitle?: string;
  disableCategorize?: boolean;
}) {
  const commentTypesSorted = useMemo(() => {
    return sortComment(Array.from(new Set([commentType, ...(commentTypes ?? [])])));
  }, [commentType, commentTypes]);
  const [commentSelected, setCommentSelected] = useState<commentType>(commentType);

  useEffect(() => {
    setCommentSelected(commentType);
  }, [id, commentType]);

  return (
    <CommonModalLayout onOutClick={close}>
      <ModalBodyWrapper
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {commentTypesSorted.length > 1 && (
          <CommentButtons>
            {commentTypesSorted.map((type) => (
              <CommentButton
                key={type}
                $selected={type === commentSelected}
                onClick={() => setCommentSelected(type)}
              >
                <CommentTypeIcon type={type} size={16} />
              </CommentButton>
            ))}
          </CommentButtons>
        )}
        <CommentBodyCommon
          id={id}
          commentType={commentSelected}
          close={close}
          newsTitle={newsTitle}
          disableCategorize={disableCategorize}
        />
      </ModalBodyWrapper>
    </CommonModalLayout>
  );
}

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
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.yvote02 : theme.colors.yvote01} !important;
  border: ${({ $selected, theme }) =>
    $selected ? `1px solid ${theme.colors.yvote06}` : `1px solid ${theme.colors.yvote04}`};
  filter: ${({ $selected }) => ($selected ? 'grayscale(0)' : 'grayscale(0.6)')};
  transition: all 0.15s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote02} !important;
    border-color: ${({ theme }) => theme.colors.yvote06};
  }
`;
