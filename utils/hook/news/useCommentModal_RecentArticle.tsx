import CommentModal_NewsPage from '@components/news/commentModal/modal_newspage';
import { Article } from '@utils/interface/news';
import { useCallback } from 'react';
import { useModal } from '../useModal';

export function useCommentModal_RecentArticle() {
  const { show, close } = useModal();

  const showCommentModal = useCallback(
    (article: Article) => {
      show(<CommentModal_NewsPage close={close} article={article} />);
    },
    [close],
  );

  return { showCommentModal, close };
}
