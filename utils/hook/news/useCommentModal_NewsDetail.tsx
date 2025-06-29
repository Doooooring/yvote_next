import { CommentModal } from '@components/news/commentModal/modal_newsDetailPage';
import { commentType } from '@utils/interface/news';
import { useModal } from '../useModal';

export function useCommentModal() {
  const { show, close } = useModal();

  const showCommentModal = (newsId: number, commentType: commentType) => {
    show(<CommentModal id={newsId} commentType={commentType} close={close} />);
  };

  return { showCommentModal, close };
}
