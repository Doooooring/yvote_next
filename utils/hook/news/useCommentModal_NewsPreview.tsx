import { useCallback } from 'react';

import { CommentModal_NewsPreview } from '@components/news/commentModal/modal_newsPreview.tsx';
import { useModal } from '@utils/hook/useModal';
import { commentType } from '@utils/interface/news';

export function useCommentModal_Preview() {
  const { show, close } = useModal();

  const showCommentModal = useCallback(
    (
      newsId: number,
      commentTypes: Array<commentType>,
      initialCommentId?: number,
      newsTitle?: string,
      opts?: { disableCategorize?: boolean },
    ) => {
      show(
        <CommentModal_NewsPreview
          id={newsId}
          commentTypes={commentTypes}
          close={close}
          initialCommentId={initialCommentId}
          newsTitle={newsTitle}
          disableCategorize={opts?.disableCategorize}
        />,
      );
    },
    [show],
  );

  return { showCommentModal, close };
}
