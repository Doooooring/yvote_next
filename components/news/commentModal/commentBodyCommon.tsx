import { useDevice } from '@/utils/hook/useDevice';
import { RowSwipeCature } from '@/utils/hook/useSwipe';
import { Device } from '@/utils/interface/common';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { TextButton } from '@components/common/commonStyles';
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
import CommentProgressBar from './commentProgressBar';
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

  const { page, curComments, isRequesting, getPageBefore, getPageAfter } = useFetchNewsComment(
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
                <CommentProgressBar
                  scrollHeight={scrollHeight}
                  maxScrollHeight={maxScrollHeight}
                  moveToScrollHeight={moveToScrollHeight}
                />
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
              style={{
                backgroundColor: curComments.length === 0 ? 'white' : '',
              }}
            >
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
              onClick={async () => {
                await getPageBefore();
                moveToScrollHeight(0);
              }}
            >
              이전
            </TextButton>
            <TextButton
              onClick={async () => {
                const response = await getPageAfter();
                if (response) {
                  moveToScrollHeight(0);
                } else {
                  showToastMessage(
                    <DefaultMessageBox>
                      <p>준비된 평론들을 모두 확인했어요</p>
                    </DefaultMessageBox>,
                    2000,
                  );
                }
              }}
            >
              다음
            </TextButton>
          </>
        ) : (
          <CommentExplainFooter>
            <ArrowButtonsWrapper>
              <ButtonWrapper disabled={page === 0 && commentIndex === 0} onClick={getPrevComment}>
                <AiOutlineLeft size="20px" />
              </ButtonWrapper>
              <ButtonWrapper onClick={getNextComment}>
                <AiOutlineRight size="20px" />
              </ButtonWrapper>
            </ArrowButtonsWrapper>

            <TextButton
              onClick={() => {
                setCurComment(null);
                reloadScrollHeight();
              }}
            >
              목록으로
            </TextButton>
          </CommentExplainFooter>
        )
      }
    />
  );
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(3px);
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
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  box-shadow: 0 0 20px -10px;
  background-color: rgba(255, 255, 255, 0);
  color: ${({ disabled, theme }) => (!disabled ? theme.colors.yvote07 : theme.colors.gray400)};
  z-index: 99;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;
