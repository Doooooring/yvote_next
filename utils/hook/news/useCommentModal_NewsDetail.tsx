import { useCallback } from 'react';

import { CommentModal } from '@components/news/commentModal/modal_newsDetailPage';
import { commentType } from '@utils/interface/news';

import { useModal } from '../useModal';

export function useCommentModal() {
  const { show, close } = useModal();

  const showCommentModal = useCallback(
    (
      newsId: number,
      commentType: commentType,
      newsTitle?: string,
      opts?: { disableCategorize?: boolean; commentTypes?: Array<commentType> },
    ) => {
      show(
        <CommentModal
          id={newsId}
          commentType={commentType}
          commentTypes={opts?.commentTypes}
          close={close}
          newsTitle={newsTitle}
          disableCategorize={opts?.disableCategorize}
        />,
      );
    },
    [show, close],
  );

  return { showCommentModal, close };
}
