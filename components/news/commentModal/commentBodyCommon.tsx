import { useDevice } from '@/utils/hook/useDevice';
import { RowSwipeCature } from '@/utils/hook/useSwipe';
import { Device } from '@/utils/interface/common';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
// import { TextButton } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import LoadingCommon from '@components/common/loading';
import { CommonMessageBox, DefaultMessageBox } from '@components/common/messageBox';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { useNewsAI } from '@/utils/context/newsAIContext';
import { Comment, commentType } from '@utils/interface/news';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import styled from 'styled-components';
import CommentBodyExplain from './commentBodyExplain';
import CommentBodyList from './commentBodyList';
import CommentHead from './commentHead';
import { useFetchNewsComment, useListScrollheight, useScrollInfo } from './commentModal.hook';
// import CommentProgressBar from './commentProgressBar';
import { ScrollWrapper } from './figure';
import ModalLayout from './modal.layout';

export default function CommentBodyCommon({
  id,
  commentType,
  close,
  initialCommentId,
}: {
  id: number;
  commentType: commentType;
  close: () => void;
  initialCommentId?: number;
}) {
  const device = useDevice();
  const { setModalCommentTitles, setModalActiveComment } = useNewsAI();

  const { show: showToastMessage } = useToastMessage();

  const { page, curComments, isRequesting, hasMore, getPageBefore, getPageAfter } = useFetchNewsComment(
    id,
    commentType,
  );
  const [curComment, setCurComment] = useState<Comment | null>(null);
  const initialApplied = useRef(false);
  const commentIndex = curComment ? curComments.findIndex((c) => c.id === curComment.id) : null;

  const {
    target: targetRef,
    saveScrollHeight,
    moveToScrollHeight,
    reloadScrollHeight,
  } = useListScrollheight();
  const { scrollHeight, maxScrollHeight } = useScrollInfo(targetRef);

  const getPrevComment = async () => {
    if (commentIndex === null) return;

    if (commentIndex > 0) {
      setCurComment(curComments[commentIndex - 1]);
      moveToScrollHeight(0);
    } else {
      const newComments = await getPageBefore();
      if (newComments) {
        setCurComment(newComments[newComments.length - 1]);
        moveToScrollHeight(0);
      } else {
        showToastMessage(
          <DefaultMessageBox>
            <p>가장 최신 논평입니다!</p>
          </DefaultMessageBox>,
          2000,
        );
      }
    }
  };

  const getNextComment = async () => {
    if (commentIndex === null) return;

    if (commentIndex < curComments.length - 1) {
      setCurComment(curComments[commentIndex + 1]);
      moveToScrollHeight(0);
    } else {
      const newComments = await getPageAfter();
      if (newComments) {
        setCurComment(newComments[0]);
        moveToScrollHeight(0);
      } else {
        showToastMessage(
          <DefaultMessageBox>
            <p>준비된 평론들을 모두 확인했어요</p>
          </DefaultMessageBox>,
          2000,
        );
      }
    }
  };

  useEffect(() => {
    if (curComments.length > 0) {
      setModalCommentTitles(curComments.map(c => ({ commentType: c.commentType, title: c.title })));
      if (initialCommentId && !initialApplied.current) {
        const match = curComments.find(c => c.id === initialCommentId);
        if (match) {
          initialApplied.current = true;
          setCurComment(match);
          moveToScrollHeight(0);
        }
      }
    }
  }, [curComments]);

  useEffect(() => {
    if (curComment) {
      setModalActiveComment({ commentType: curComment.commentType, title: curComment.title, body: curComment.comment });
    } else {
      setModalActiveComment(null);
    }
  }, [curComment]);

  useEffect(() => {
    return () => {
      setModalCommentTitles([]);
      setModalActiveComment(null);
    };
  }, []);

  // === Refs for history/popstate ===
  const curCommentRef = useRef(curComment);
  curCommentRef.current = curComment;
  const closeRef = useRef(close);
  closeRef.current = close;
  const historyCount = useRef(0);
  // When we programmatically call history.back(), skip the next popstate
  const skipPopState = useRef(0);

  // Save the history state before we push anything, so we can restore on cleanup
  const originalHistoryLength = useRef(0);

  const pushState = () => {
    historyCount.current++;
    window.history.pushState({ commentModal: historyCount.current }, '');
  };

  const popOwnStateSilently = () => {
    if (historyCount.current > 0) {
      historyCount.current--;
      skipPopState.current++;
      window.history.back();
    }
  };

  // On mount: push 1 state. On unmount: use go(-N) to pop all at once.
  useEffect(() => {
    originalHistoryLength.current = window.history.length;
    pushState();

    const handlePopState = () => {
      if (skipPopState.current > 0) {
        skipPopState.current--;
        return; // This was a programmatic pop, ignore
      }

      historyCount.current--;

      if (curCommentRef.current !== null) {
        // Detail → list via back button. Browser already popped one state.
        // Mark so useEffect[curComment] doesn't also pop.
        backCausedExit.current = true;
        curCommentRef.current = null;
        setCurComment(null);
        reloadScrollHeight();
      } else {
        // List → close
        closeRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      // Clean up pushed states on unmount.
      // Use stopImmediatePropagation to prevent Next.js router from seeing the popstate.
      const count = historyCount.current;
      historyCount.current = 0;
      if (count > 0) {
        // history.go(-N) fires exactly 1 popstate event regardless of N.
        // Block it at capture phase to prevent Next.js router from reacting.
        const blocker = (e: PopStateEvent) => {
          e.stopImmediatePropagation();
          window.removeEventListener('popstate', blocker, true);
        };
        window.addEventListener('popstate', blocker, true);
        window.history.go(-count);
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Track detail enter/leave for history push/pop
  // Track whether back-button caused the detail→list transition
  const backCausedExit = useRef(false);
  const wasInDetail = useRef(false);
  useEffect(() => {
    const nowInDetail = curComment !== null;
    if (!wasInDetail.current && nowInDetail) {
      // List → detail (user clicked a comment): push state
      pushState();
    } else if (wasInDetail.current && !nowInDetail && !backCausedExit.current) {
      // Detail → list via programmatic nav (not back button): pop state
      popOwnStateSilently();
    }
    backCausedExit.current = false;
    wasInDetail.current = nowInDetail;
  }, [curComment]);

  // Keyboard: ArrowLeft/Right for nav, Escape/Alt+Left for back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key === 'ArrowLeft') || e.key === 'Escape') {
        e.preventDefault();
        if (curCommentRef.current !== null) {
          setCurComment(null);
          reloadScrollHeight();
        } else {
          close();
        }
        return;
      }

      if (curCommentRef.current !== null) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); getPrevComment(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); getNextComment(); }
      } else {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          getPageBefore().then((res) => { if (res) moveToScrollHeight(0); });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (hasMore) getPageAfter().then((res) => { if (res) moveToScrollHeight(0); });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [curComment, commentIndex, curComments, hasMore, page]);

  // Reset curComment and scroll when switching comment type
  useEffect(() => {
    moveToScrollHeight(0);
    return () => {
      setCurComment(null);
    };
  }, [id, commentType, setCurComment]);

  return (
    <ModalLayout
      close={close}
      headView={<CommentHead comment={commentType} />}
      bodyView={
        <>
          <ScrollWrapper ref={targetRef} className="common-scroll-style">
            {curComment === null ? (
              <CommentBodyList
                commentType={commentType}
                comments={curComments}
                clickComment={(comment: Comment) => {
                  saveScrollHeight();
                  setCurComment(comment);
                  moveToScrollHeight(0);

                  if (device === Device.mobile) {
                    const item = getSessionItem('commentSwipeToast');

                    if (item) return;
                    saveSessionItem('commentSwipeToast', 'true');

                    showToastMessage(
                      <CommonMessageBox>좌우로 밀어서 논평을 넘겨볼 수 있어요.</CommonMessageBox>,
                      2500,
                      {
                        direction: 'bottom',
                      },
                    );
                  }
                }}
              />
            ) : (
              <>
                <RowSwipeCature
                  threshold={20}
                  onLeftSwipe={getPrevComment}
                  onRightSwipe={getNextComment}
                >
                  <Blink key={curComment.id}>
                    <CommentBodyExplain
                      id={curComment.id}
                      title={curComment.title}
                      explain={curComment.comment}
                      date={curComment.date}
                    />
                  </Blink>
                </RowSwipeCature>
              </>
            )}
          </ScrollWrapper>
          <IsShow state={isRequesting}>
            <LoadingWrapper
              $solid={curComments.length === 0}
            >
              <LoadingCommon comment="" fontColor="${({ theme }) => theme.colors.yvote08}" />
            </LoadingWrapper>
          </IsShow>
        </>
      }
      footerView={
        curComment === null ? (
          <PaginationFooter>
            <PaginationButton
              disabled={page === 0}
              onClick={async () => {
                await getPageBefore();
                moveToScrollHeight(0);
              }}
            >
              <AiOutlineLeft size="12px" />
            </PaginationButton>
            <PageIndicator>{Math.floor(page / 20) + 1}</PageIndicator>
            <PaginationButton
              disabled={!hasMore}
              onClick={async () => {
                if (!hasMore) return;
                const response = await getPageAfter();
                if (response) {
                  moveToScrollHeight(0);
                }
              }}
            >
              <AiOutlineRight size="12px" />
            </PaginationButton>
          </PaginationFooter>
        ) : (
          <CommentExplainFooter>
            <ArrowButtonsWrapper>
              <ButtonWrapper disabled={page === 0 && commentIndex === 0} onClick={getPrevComment}>
                <AiOutlineLeft size="14px" />
              </ButtonWrapper>
              <ButtonWrapper disabled={!hasMore && commentIndex === curComments.length - 1} onClick={getNextComment}>
                <AiOutlineRight size="14px" />
              </ButtonWrapper>
            </ArrowButtonsWrapper>

            <BackToListButton
              onClick={() => {
                setCurComment(null);
                reloadScrollHeight();
              }}
            >
              목록
            </BackToListButton>
          </CommentExplainFooter>
        )
      }
    />
  );
}

const LoadingWrapper = styled.div<{ $solid?: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  background-color: ${({ $solid, theme }) => $solid ? theme.colors.yvote01 : `${theme.colors.yvote01}cc`};
`;

const Blink = styled.div`
  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  animation: back-blink 0.4s ease-in-out forwards;
`;

const CommentExplainFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ArrowButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex: 0 1 auto;
`;

const ButtonWrapper = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: transparent;
  color: ${({ disabled, theme }) => (!disabled ? theme.colors.yvote08 : theme.colors.yvote04)};
  z-index: 99;
  cursor: pointer;
  transition: background-color 0.15s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote02};
  }
`;

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const PaginationButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  color: ${({ disabled, theme }) => (!disabled ? theme.colors.yvote08 : theme.colors.yvote04)};
  cursor: pointer;
  transition: background-color 0.15s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.yvote02};
  }
  &:disabled {
    cursor: default;
    border-color: ${({ theme }) => theme.colors.yvote03};
  }
`;

const PageIndicator = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.yvote06};
  min-width: 16px;
  text-align: center;
`;

const BackToListButton = styled.button`
  padding: 2px 8px;
  font-size: 10px;
  letter-spacing: 0.05em;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote06};
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  outline: none;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote05};
    color: ${({ theme }) => theme.colors.yvote01};
  }
`;
