import Modal from '@components/common/modal';
import { Link } from '@utils/hook/useRouter';
import { commentType } from '@utils/interface/news';
import CommentBodyExplain from '../commentBodyExplain';
import CommentHead from '../commentHead';
import { useListScrollheight, useScrollInfo } from '../commentModal.hook';
import CommentProgressBar from '../commentProgressBar';
import { ScrollWrapper, TextButton } from '../figure';
import ModalLayout from '../modal.layout';

interface CommentModalProps {
  state: boolean;
  close: () => void;
  newsId: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: Date;
}

export default function CommentModal({
  state,
  close,
  newsId,
  commentType,
  title,
  comment,
  date,
}: CommentModalProps) {
  const {
    target: targetRef,
    saveScrollHeight,
    moveToScrollHeight,
    reloadScrollHeight,
  } = useListScrollheight();
  const { scrollHeight, maxScrollHeight } = useScrollInfo(targetRef);

  return (
    <Modal state={state} outClickAction={close}>
      <ModalLayout
        close={close}
        headView={<CommentHead comment={commentType} />}
        bodyView={
          <ScrollWrapper ref={targetRef} className="common-scroll-style">
            <CommentProgressBar
              scrollHeight={scrollHeight}
              maxScrollHeight={maxScrollHeight}
              moveToScrollHeight={moveToScrollHeight}
            />
            <CommentBodyExplain title={title} explain={comment} date={date} />
          </ScrollWrapper>
        }
        footerView={
          <Link href={`/news/${newsId}`}>
            <TextButton>뉴스보기</TextButton>
          </Link>
        }
      />
    </Modal>
  );
}
