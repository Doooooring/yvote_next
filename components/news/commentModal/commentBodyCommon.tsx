import { RowSwipeCature } from '@/utils/hook/useSwipe';
import { getSessionItem, saveSessionItem } from '@/utils/tools/session';
import { TextButton } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import LoadingCommon from '@components/common/loading';
import { CommonMessageBox, DefaultMessageBox } from '@components/common/messageBox';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { Comment, commentType } from '@utils/interface/news';
import { useEffect, useState } from 'react';
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
  const { show: showToastMessage } = useToastMessage();
  const { page, curComments, isRequesting, getPageBefore, getPageAfter } = useFetchNewsComment(
    id,
    commentType,
  );

  const [curComment, setCurComment] = useState<Comment | null>(null);

  const {
    target: targetRef,
    saveScrollHeight,
    moveToScrollHeight,
    reloadScrollHeight,
  } = useListScrollheight();

  const { scrollHeight, maxScrollHeight } = useScrollInfo(targetRef);

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
                  onLeftSwipe={async () => {
                    const commentIndex = curComments.findIndex((c) => c.id === curComment.id);
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
                  }}
                  onRightSwipe={async () => {
                    const commentIndex = curComments.findIndex((c) => c.id === curComment.id);
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
                  }}
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
          <TextButton
            onClick={() => {
              setCurComment(null);
              reloadScrollHeight();
            }}
          >
            목록으로
          </TextButton>
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
