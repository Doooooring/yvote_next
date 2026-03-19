import { useDevice } from '@/utils/hook/useDevice';
import { RowSwipeCature } from '@/utils/hook/useSwipe';
import { Device } from '@/utils/interface/common';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
// import { TextButton } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import LoadingCommon from '@components/common/loading';
import { CommonMessageBox, DefaultMessageBox } from '@components/common/messageBox';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { Comment, commentType } from '@utils/interface/news';
import { useEffect, useState } from 'react';
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
}: {
  id: number;
  commentType: commentType;
  close: () => void;
}) {
  const device = useDevice();

  const { show: showToastMessage } = useToastMessage();

  const { page, curComments, isRequesting, hasMore, getPageBefore, getPageAfter } = useFetchNewsComment(
    id,
    commentType,
  );
  const [curComment, setCurComment] = useState<Comment | null>(null);
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
      const prevComment = curComments[commentIndex - 1];
      setCurComment(prevComment);
      moveToScrollHeight(0);
    } else {
      const is = await getPageBefore();
      if (is) {
        const lastIndex = curComments.length - 1;
        setCurComment(curComments[lastIndex]);
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
      const nextComment = curComments[commentIndex + 1];
      setCurComment(nextComment);
      moveToScrollHeight(0);
    } else {
      const is = await getPageAfter();
      if (is) {
        const firstIndex = 0;
        setCurComment(curComments[firstIndex]);
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
              <LoadingCommon comment="" fontColor="#8a8178" />
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
              <ButtonWrapper onClick={getNextComment}>
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
