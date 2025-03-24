import LoadingCommon from '@components/common/loading';
import Modal from '@components/common/modal';
import indexStore from '@store/indexStore';

import IsShow from '@components/common/isShow';
import { PositiveMessageBox } from '@components/common/messageBox';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { Comment } from '@utils/interface/news';
import { observer } from 'mobx-react';
import { useCallback } from 'react';
import styled from 'styled-components';
import CommentBodyExplain from '../commentBodyExplain';
import CommentBodyList from '../commentBodyList';
import CommentHead from '../commentHead';
import {
  useCurComment,
  useFetchNewsComment,
  useListScrollheight,
  useScrollInfo,
} from '../commentModal.hook';
import CommentProgressBar from '../commentProgressBar';
import { ScrollWrapper, TextButton } from '../figure';
import ModalLayout from '../modal.layout';

const CommentModal = observer(({ id }: { id: number }) => {
  const { show: showCommentEndMessage } = useToastMessage();
  const { isCommentModalUp, curComment: comment, closeCommentModal } = indexStore.currentStore;
  const { page, curComments, isRequesting, getPageBefore, getPageAfter } = useFetchNewsComment(
    id,
    comment,
  );

  const { curComment, showCurComment, closeCurComment } = useCurComment();

  const {
    target: targetRef,
    saveScrollHeight,
    moveToScrollHeight,
    reloadScrollHeight,
  } = useListScrollheight();

  const { scrollHeight, maxScrollHeight } = useScrollInfo(targetRef);

  const clickComment = useCallback(
    (comment: Comment) => {
      saveScrollHeight();
      showCurComment(comment);
      moveToScrollHeight(0);
    },
    [saveScrollHeight, showCurComment, moveToScrollHeight],
  );

  const clickLeftButton = useCallback(async () => {
    await getPageBefore();
    moveToScrollHeight(0);
  }, [getPageBefore, moveToScrollHeight]);

  const getPageAfterWithMessage = useCallback(async () => {
    const response = await getPageAfter();
    if (!response) {
      showCommentEndMessage(
        <PositiveMessageBox>
          <p>준비된 평론들을 모두 확인했어요</p>
        </PositiveMessageBox>,
        2000,
      );
      return false;
    }
    return true;
  }, [getPageAfter]);

  const clickRightButton = useCallback(async () => {
    const state = await getPageAfterWithMessage();
    if (state) moveToScrollHeight(0);
  }, [getPageAfterWithMessage, moveToScrollHeight]);

  const clickToListButton = useCallback(() => {
    closeCurComment();
    reloadScrollHeight();
  }, [closeCurComment, reloadScrollHeight]);

  const close = useCallback(() => {
    closeCurComment();
    closeCommentModal();
  }, [closeCommentModal, closeCurComment]);

  return (
    <Modal
      state={isCommentModalUp}
      outClickAction={() => {
        close();
      }}
    >
      <IsShow state={comment != null}>
        <ModalLayout
          close={close}
          headView={<CommentHead comment={comment!} />}
          bodyView={
            <>
              <ScrollWrapper ref={targetRef} className="common-scroll-style">
                {curComment === null ? (
                  <CommentBodyList comments={curComments} clickComment={clickComment} />
                ) : (
                  <>
                    <CommentProgressBar
                      scrollHeight={scrollHeight}
                      maxScrollHeight={maxScrollHeight}
                      moveToScrollHeight={moveToScrollHeight}
                    />
                    <CommentBodyExplain title={curComment.title} explain={curComment.comment} />
                  </>
                )}
              </ScrollWrapper>
              <IsShow state={isRequesting}>
                <LoadingWrapper>
                  <LoadingCommon comment="" fontColor="black" />
                </LoadingWrapper>
              </IsShow>
            </>
          }
          footerView={
            curComment === null ? (
              <>
                <TextButton
                  style={{ display: page != 0 ? 'block' : 'none' }}
                  onClick={clickLeftButton}
                >
                  이전
                </TextButton>
                <TextButton onClick={clickRightButton}>다음</TextButton>
              </>
            ) : (
              <TextButton
                onClick={() => {
                  clickToListButton();
                }}
              >
                목록으로
              </TextButton>
            )
          }
        />
      </IsShow>
    </Modal>
  );
});

export default CommentModal;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(3px);
`;
