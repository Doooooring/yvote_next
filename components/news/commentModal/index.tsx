import ImageFallback from '@components/common/imageFallback';
import Modal from '@components/common/modal';
import closeButton from '@images/close_icon.png';
import arrowLeft from '@images/grey_arrow_left.png';
import arrowRight from '@images/grey_arrow_right.png';
import NewsRepository from '@repositories/news';
import indexStore from '@store/indexStore';
import { commentType } from '@utils/interface/news';

import { useObserver } from 'mobx-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export default function CommentModal({
  id,
  comment,
  commentOpen,
  commentClose,
}: {
  id: string;
  comment: commentType | null;
  commentOpen: (comment: commentType) => void;
  commentClose: () => void;
}) {
  const { currentStore } = indexStore;
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;
  const [curComments, setCurComments] = useState<
    Array<{
      title: string;
      comment: string;
    }>
  >([]);
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  const [curComment, setCurComment] = useState<{ title: string; comment: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const typeExplain = useMemo(() => {
    return {
      전략가: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      지도자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      예술가: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      감시자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      운영자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      공화주의자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      관찰자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      개혁가: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      이론가: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      자유주의자: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      민주당: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      국민의힘: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      청와대: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
    };
  }, []);

  const curPage = useRef(0);

  useEffect(() => {
    if (comment === null) {
      setCurComments([]);
      curPage.current = 0;
      return;
    }
    async function toAsync() {
      const response = await NewsRepository.getNewsComment(id, comment!, curPage.current);
      setCurComments(response.comments);
    }
    toAsync();
  }, [comment]);

  const getPageBefore = async () => {
    if (curPage.current === 0) return;
    const response = await NewsRepository.getNewsComment(id, comment!, curPage.current - 10);
    setCurComments(response.comments);
    curPage.current -= 10;
  };
  const getPageAfter = async () => {
    const response = await NewsRepository.getNewsComment(id, comment!, curPage.current + 10);
    if (response.comments === null || response.comments.length == 0) {
    } else {
      setCurComments(response.comments);
      curPage.current += 10;
    }
  };

  return useObserver(() => (
    <Modal
      state={isCommentModalUp}
      outClickAction={() => {
        commentClose();
        forceUpdate();
      }}
    >
      {comment ? (
        <Wrapper>
          <div
            className="close-button"
            onClick={() => {
              commentClose();
            }}
          >
            <Image src={closeButton} width={16} height={16} alt="" />
          </div>
          <div className="modal-head">
            <div className="image-wrapper">
              <ImageFallback src={`/assets/img/${comment}.png`} width={80} height={80} />
            </div>

            <div className="head-body">
              <div className="head-title">
                <p className="type-name">{comment}</p>
              </div>
              <div className="type-explain">{typeExplain[comment]}</div>
            </div>
          </div>
          {curComment === null ? (
            <div className="modal-body">
              <div className="modal-list">
                {curComments.map((comment, idx) => {
                  return (
                    <div
                      key={comment.comment + idx}
                      className="body-block"
                      onClick={() => {
                        setCurComment(comment);
                      }}
                    >
                      {comment.title}
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
  ));
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 800px;
  max-height: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 4rem 3rem;
  overflow: scroll;
  flex: 0 0 auto;
  background-color: white;
  position: relative;
  & {
    div.close-button {
      position: absolute;
      top: 10px;
      right: 14px;
    }
    div.modal-head {
      display: flex;
      flex-direction: row;
      div.image-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 166px;
        height: 166px;
        flex: 0 0 auto;
        padding: 1.75rem;
        background-color: white;
        box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
        border-radius: 200px;
        overflow: hidden;
      }
      div.head-body {
        padding-left: 2rem;
        p.type-name {
          font-weight: 600;
          font-size: 18px;
        }
        div.type-explain {
          color: #a1a1a1;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.7;
        }
      }
    }
    div.modal-body {
      padding-top: 1rem;
      div.modal-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        div.body-block {
          padding-left: 2rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
          border-radius: 16px;
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
        }
      }

      div.content-wrapper {
        padding: 1.25rem;
        box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);

        p.content-title {
          color: #7e7e7e;
          font-weight: 500;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        div.content-body {
          p {
            margin-bottom: 0.5rem;
            min-height: 10px;
          }
          div.content-wrapper {
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
