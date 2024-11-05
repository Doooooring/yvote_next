import ImageFallback from '@components/common/imageFallback';
import LoadingCommon from '@components/common/loading';
import Modal from '@components/common/modal';
import closeButton from '@images/close_icon.png';
import arrowLeft from '@images/grey_arrow_left.png';
import arrowRight from '@images/grey_arrow_right.png';
import indexStore from '@store/indexStore';

import { CommonLayoutBox } from '@components/common/commonStyles';
import { PositiveMessageBox } from '@components/common/messageBox';
import { useToastMessage } from '@utils/hook/useToastMessage';
import { observer } from 'mobx-react';
import Image from 'next/image';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useCurComment, useFetchNewsComment } from './commentModal.hook';
import { typeCheckImg, typeExplain, typeToShow } from './commentModal.resource';

const CommentModal = observer(({ id }: { id: string }) => {
  const { show: showCommentEndMessage } = useToastMessage();
  // 코멘트 모달 상태 전역으로 관리
  const { isCommentModalUp, curComment: comment, closeCommentModal } = indexStore.currentStore;
  // 현재 보여지고 있는 평론들 ()
  const { page, curComments, isRequesting, getPageBefore, getPageAfter } = useFetchNewsComment(
    id,
    comment,
  );
  const { curComment, showCurComment, closeCurComment } = useCurComment();

  const getPageAfterWithMessage = useCallback(async () => {
    const response = await getPageAfter();
    if (!response) {
      showCommentEndMessage(
        <PositiveMessageBox>
          <p>준비된 평론들을 모두 확인했어요</p>
        </PositiveMessageBox>,
        2000,
      );
    }
  }, [getPageAfter]);

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
      {comment ? (
        <Wrapper>
          <div
            className="close-button"
            onClick={() => {
              close();
            }}
          >
            <Image src={closeButton} width={16} height={16} alt="" />
          </div>
          <HeadBody>
            <HeadTitle>
              <CommentImageWrapper>
                <div className="image-box">
                  <ImageFallback src={`/assets/img/${comment}.png`} alt={comment} fill={true} />
                </div>
              </CommentImageWrapper>
              <p className="type-name">{typeToShow(comment)}</p>
              <ImageFallback src={typeCheckImg(comment)} alt="check-img" width="10" height="10" />
            </HeadTitle>
            <div className="head-body">
              <div className="type-explain">{typeExplain[comment]}</div>
            </div>
          </HeadBody>
          {curComment === null ? (
            <ModalBody>
              <div className="modal-list">
                {isRequesting ? (
                  <LoadingWrapper>
                    <LoadingCommon comment="" fontColor="black" />
                  </LoadingWrapper>
                ) : (
                  <></>
                )}
                {curComments.map((comment, idx) => {
                  return (
                    <div
                      key={comment.comment + idx}
                      className="body-block"
                      onClick={() => {
                        showCurComment(comment);
                      }}
                    >
                      <span>{comment.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="page-button-wrapper">
                <PageButton
                  className="button-left"
                  $state={page != 0}
                  onClick={async () => {
                    await getPageBefore();
                  }}
                >
                  <Image src={arrowLeft} width={16} height={16} alt="" />
                </PageButton>
                <PageButton
                  className="button-right"
                  $state={true}
                  onClick={async () => {
                    await getPageAfterWithMessage();
                  }}
                >
                  <Image src={arrowRight} width={16} height={16} alt="" />
                </PageButton>
              </div>
            </ModalBody>
          ) : (
            <ModalBody>
              <div className="content-wrapper">
                <p className="content-title">{curComment.title}</p>
                <div className="content-body">
                  {curComment.comment.split('$').map((comment, idx) => {
                    return (
                      <p key={idx} className="content_line">
                        {comment}
                      </p>
                    );
                  })}
                </div>
              </div>
              <BackButtonWrapper>
                <BackButton
                  onClick={() => {
                    closeCurComment();
                  }}
                >
                  목록으로
                </BackButton>
              </BackButtonWrapper>
            </ModalBody>
          )}
        </Wrapper>
      ) : (
        <></>
      )}
    </Modal>
  );
});

export default CommentModal;

const Wrapper = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 680px;
  max-height: 80vh; /* make sure modal does not exceed screen height */
  overflow: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 3rem 3rem;
  flex: 0 0 auto;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media screen and (max-width: 768px) {
    width: 80%;
    min-width: 0px;
    max-height: 70vh;
    padding: 3rem 1rem;
  }
  & {
    div.close-button {
      position: absolute;
      top: 10px;
      right: 14px;
      cursor: pointer;
    }
    div.modal-head {
      -webkit-text-size-adjust: none;
      text-align: left;
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      box-sizing: inherit;
    }
  }
`;

const HeadTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5rem;

  p.type-name {
    padding-left: 0.5rem;
    padding-right: 0.25rem;
    font-weight: 600;
    font-size: 18px;
    @media screen and (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const HeadBody = styled.div`
  @media screen and (max-width: 768px) {
    padding-left: 0;
  }

  div.type-explain {
    color: black;
    font-weight: 500;
    font-size: 15px;
    line-height: 1.7;
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const CommentImageWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  background-color: white;
  border-radius: 200px;
  border: 1px solid rgb(225, 225, 225);
  overflow: hidden;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
  }
  .image-box {
    width: 60%;
    height: 60%;
    position: absolute;
  }
`;

const ModalBody = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1.5px solid rgb(225, 225, 225);

  div.modal-list {
    display: flex;
    flex-direction: column;
    position: relative;
    div.body-block {
      height: 60px;
      padding-left: 1rem;
      padding-right: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      box-sizing: border-box;

      border-bottom: 1.5px solid #ddd;

      @media screen and (max-width: 768px) {
        padding: 0rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      span {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
        font-weight: 500;
        color: black;
      }
    }
  }
  div.page-button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 12px;
    padding-top: 0.5rem;
  }

  div.content-wrapper {
    padding: 1rem 0;
    color: black;
    p.content-title {
      color: black;
      font-size: 14px;
      font-weight: 600;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    div.content-body {
      font-weight: 500;
    }

    p.content_line {
      color: black;
      margin-bottom: 0.5rem;
      min-height: 10px;
    }
  }
`;

interface PageButtonProps {
  $state: boolean;
}

const PageButton = styled.div<PageButtonProps>`
  display: ${({ $state }) => ($state ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 30px;
  box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;

  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(3px);
`;

const BackButtonWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: end;
  border-top: 1.5px solid rgb(225, 225, 225);
`;

const BackButton = styled(CommonLayoutBox)`
  padding: 0.5rem 1.5rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;
