import { useModal } from '@utils/hook/useModal';
import { commentType } from '@utils/interface/news';
import { CommentModal_NewsPreview } from '../commentModal/modal_newsPreview.tsx';

export function useCommentModal_Preview() {
  const { show, close } = useModal();

  const showCommentModal = (newsId: number, commentTypes: Array<commentType>) => {
    show(<CommentModal_NewsPreview id={newsId} commentTypes={commentTypes} close={close} />);
  };

  return { showCommentModal, close };
}
