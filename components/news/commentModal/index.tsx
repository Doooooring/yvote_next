import ImageFallback from '@components/common/imageFallback';
import LoadingCommon from '@components/common/loading';
import Modal from '@components/common/modal';
import closeButton from '@images/close_icon.png';
import arrowLeft from '@images/grey_arrow_left.png';
import arrowRight from '@images/grey_arrow_right.png';
import NewsRepository from '@repositories/news';
import indexStore from '@store/indexStore';
import { commentType } from '@utils/interface/news';

import { observer, useObserver } from 'mobx-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { typeExplain, typeToShow } from './commentModal.resource';
import useForceUpdate from '@utils/hook/userForceUpdate';

const CommentModal = observer(({
  id,
}: {
  id: string;
}) => {
  const { currentStore } = indexStore;
  // 코멘트 모달 상태 전역으로 관리
  const { isCommentModalUp, curComment : comment, closeCommentModal} = currentStore;
  // 현재 보여지고 있는 평론들 ()
  const [curComments, setCurComments] = useState<
    Array<{
      title: string;
      comment: string;
    }>
  >([]);

  const [curComment, setCurComment] = useState<{ title: string; comment: string } | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const curPage = useRef(0);

  async function fetchNewsComment(id: string, type: commentType, page: number) {
    try {
      setIsRequesting(true);
      const response = await NewsRepository.getNewsComment(id, type, page);
      if (response.comments === null || response.comments.length == 0) {
      } else {
        setCurComments(response.comments);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsRequesting(false);
    }
  }

  useEffect(() => {
    if (comment === null) {
      setCurComments([]);
      curPage.current = 0;
      return;
    }
    fetchNewsComment(id, comment!, curPage.current);
  }, [comment]);

  const getPageBefore = async () => {
    if (curPage.current === 0) return;
    curPage.current -= 10;
    await fetchNewsComment(id, comment!, curPage.current);
    
  };
  const getPageAfter = async () => {
    await fetchNewsComment(id, comment!, curPage.current);
    curPage.current += 10;
  };

  return <Modal
      state={isCommentModalUp}
      outClickAction={() => {
        closeCommentModal();
      }}
    >
      {comment ? (
        <Wrapper>
          <div
            className="close-button"
            onClick={() => {
              closeCommentModal();
            }}
          >
            <Image src={closeButton} width={16} height={16} alt="" />
          </div>
          <div className="modal-head">
            <div className="image-wrapper">
              <div className="image-box">
                <ImageFallback src={`/assets/img/${comment}.png`} fill={true} />
              </div>
            </div>

            <div className="head-body">
              <div className="head-title">
                <p className="type-name">{typeToShow(comment)}</p>
              </div>
              <div className="type-explain">{typeExplain[comment]}</div>
            </div>
          </div>
          {curComment === null ? (
            <div className="modal-body">
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
                        setCurComment(comment);
                      }}
                    >
                      <span>{comment.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="page-button-wrapper">
                <div
                  className="page-button button-left"
                  onClick={async () => {
                    await getPageBefore();
                  }}
                >
                  <Image src={arrowLeft} width={16} height={16} alt="" />
                </div>
                <div
                  className="page-button button-right"
                  onClick={async () => {
                    await getPageAfter();
                  }}
                >
                  <Image src={arrowRight} width={16} height={16} alt="" />
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-body">
              <div className="content-wrapper">
                <p className="content-title">{curComment.title}</p>
                <div className="content-body">
                  {curComment.comment.split('$').map((comment, idx) => {
                    return <p key={idx}>{comment}</p>;
                  })}
                </div>
              </div>
              <div className="back-button-wrapper">
                <div
                  className="back-button"
                  onClick={() => {
                    setCurComment(null);
                  }}
                >
                  목록으로
                </div>
              </div>
            </div>
          )}
        </Wrapper>
      ) : (
        <></>
      )}
    </Modal>
})

export default CommentModal;

const Wrapper = styled.div`
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
  background-color: white;
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
      color: #666;
      text-align: left;
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      box-sizing: inherit;
      display: flex;
      flex-direction: row;

      @media screen and (max-width: 768px) {
        display: block;
      }
      div.image-wrapper {
        display: flex;
        position: relative;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 140px;
        height: 140px;
        flex: 0 0 auto;
        padding: 1.75rem;
        background-color: white;
        box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
        border-radius: 200px;
        overflow: hidden;
        box-sizing: border-box;
        @media screen and (max-width: 768px) {
          width: 100px;
          height: 100px;
          min-width: 0px;
          float: left;
          margin-left: 10px;
          margin-right: 20px;
        }
        .image-box {
          width: 50%;
          height: 50%;
          position: absolute;
        }
      }
      div.head-body {
        padding-left: 2rem;
        @media screen and (max-width: 768px) {
          padding-left: 0;
        }
        p.type-name {
          font-weight: 600;
          font-size: 18px;
          @media screen and (max-width: 768px) {
            font-size: 16px;
          }
        }
        div.type-explain {
          color: #a1a1a1;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.7;
          @media screen and (max-width: 768px) {
            padding-left: 4%;
            font-size: 14px;
          }
        }
      }
    }
    div.modal-body {
      padding-top: 1rem;
      div.modal-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        div.body-block {
          height: 60px;
          padding-left: 2rem;
          box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
          border-radius: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          box-sizing: border-box;
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
            color: #a1a1a1;
          }
        }
      }
      div.page-button-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: end;
        gap: 12px;
        padding-top: 0.5rem;

        div.page-button {
          display: flex;
          flex-direction: row;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 30px;
          box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
      }

      div.content-wrapper {
        padding: 1.25rem 4%;
        box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
        color: rgb(102, 102, 102);
        p.content-title {
          color: #7e7e7e;
          font-weight: 600;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        div.content-body {
          p {
            margin-bottom: 0.5rem;
            min-height: 10px;
          }
        }
      }

      div.back-button-wrapper {
        padding-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: end;
        div.back-button {
          box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-weight: 400;
        }
      }
    }
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
