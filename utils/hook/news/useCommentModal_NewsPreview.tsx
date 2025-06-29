import { CommentModal_NewsPreview } from '@components/news/commentModal/modal_newsPreview.tsx';
import { useModal } from '@utils/hook/useModal';
import { commentType } from '@utils/interface/news';
import { useCallback } from 'react';

export function useCommentModal_Preview() {
  const { show, close } = useModal();

  const showCommentModal = useCallback(
    (newsId: number, commentTypes: Array<commentType>) => {
      show(<CommentModal_NewsPreview id={newsId} commentTypes={commentTypes} close={close} />);
    },
    [show],
  );

  return { showCommentModal, close };
}
