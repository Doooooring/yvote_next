import Modal from '@components/common/modal';
import { Link, useRouter } from '@utils/hook/useRouter';
import { commentType, News, NewsState } from '@utils/interface/news';
import { TextButton } from '../../../common/commonStyles';
import CommentBodyExplain from '../commentBodyExplain';
import CommentHead from '../commentHead';
import { useListScrollheight, useScrollInfo } from '../commentModal.hook';
import CommentProgressBar from '../commentProgressBar';
import { ModalBodyWrapper, ScrollWrapper } from '../figure';
import ModalLayout from '../modal.layout';
import { useToastMessage } from '../../../../utils/hook/useToastMessage';
import { useCallback } from 'react';
import { PositiveMessageBox } from '../../../common/messageBox';

interface CommentModalProps {
  state: boolean;
  close: () => void;
  news: Pick<News, 'id' | 'state'>;
  commentType: commentType;
  title: string;
  comment: string;
  date: Date;
}

export default function CommentModal({
  state,
  close,
  news,
  commentType,
  title,
  comment,
  date,
}: CommentModalProps) {
  const { show } = useToastMessage();
  const { target: targetRef, moveToScrollHeight } = useListScrollheight();
  const { scrollHeight, maxScrollHeight } = useScrollInfo(targetRef);
  const { router } = useRouter();
  const onRouteNews = useCallback(() => {
    if (news.state !== NewsState.Published) {
      show(<PositiveMessageBox>준비 중인 뉴스입니다.</PositiveMessageBox>, 2000);
      return;
    }
  }, []);

  return (
    <Modal state={state} outClickAction={close}>
      <ModalBodyWrapper>
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
              <CommentBodyExplain id={news.id} title={title} explain={comment} date={date} />
            </ScrollWrapper>
          }
          footerView={
            <Link href={`/news/${news.id}`}>
              <TextButton>뉴스보기</TextButton>
            </Link>
          }
        />
      </ModalBodyWrapper>
    </Modal>
  );
}
