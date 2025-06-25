import Modal from '@components/common/modal';
import { Link, useRouter } from '@utils/hook/useRouter';
import { commentType, News, NewsState } from '@utils/interface/news';
import { MouseEvent, useCallback } from 'react';
import { useToastMessage } from '../../../../utils/hook/useToastMessage';
import { TextButton } from '../../../common/commonStyles';
import { CommonMessageBox } from '../../../common/messageBox';
import CommentBodyExplain from '../commentBodyExplain';
import CommentHead from '../commentHead';
import { useListScrollheight, useScrollInfo } from '../commentModal.hook';
import CommentProgressBar from '../commentProgressBar';
import { ModalBodyWrapper, ScrollWrapper } from '../figure';
import ModalLayout from '../modal.layout';

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
  const { router, routeWithMouseEvent } = useRouter();
  const onRouteNews = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (news.state !== NewsState.Published) {
        show(<CommonMessageBox>준비 중인 뉴스입니다.</CommonMessageBox>, 2000);
        return;
      }
      routeWithMouseEvent(`/news/${news.id}`, e);
    },
    [router],
  );

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
            <>
              <a href={`/news/${news.id}`} onClick={onRouteNews}>
                <TextButton>뉴스보기</TextButton>
              </a>
              <Link href={`/news/${news.id}`}>
                <></>
              </Link>
            </>
          }
        />
      </ModalBodyWrapper>
    </Modal>
  );
}
