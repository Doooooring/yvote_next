import { CommentModal } from '@components/news/commentModal/modal_newsDetailPage';
import { commentType } from '@utils/interface/news';
import { useCallback } from 'react';
import { useModal } from '../useModal';

export function useCommentModal() {
  const { show, close } = useModal();

  const showCommentModal = useCallback(
    (newsId: number, commentType: commentType, newsTitle?: string, opts?: { disableCategorize?: boolean }) => {
      show(<CommentModal id={newsId} commentType={commentType} close={close} newsTitle={newsTitle} disableCategorize={opts?.disableCategorize} />);
    },
    [show, close],
  );

  return { showCommentModal, close };
}
