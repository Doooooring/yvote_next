import ImageFallback from '@components/common/imageFallback';
import Modal from '@components/common/modal';
import NewsRepository from '@repositories/news';
import indexStore from '@store/indexStore';
import { commentType } from '@utils/interface/news';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export default function CommentModal({ id, comment }: { id: string; comment: commentType | null }) {
  const { currentStore } = indexStore;
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;
  const [curComments, setCurComments] = useState<
    Array<{
      title: string;
      comment: string;
    }>
  >([]);
  const [curComment, setCurComment] = useState<{ title: string; comment: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const typeExplain = useMemo(() => {
    return {
      전략가: '',
      지도자: '',
      예술가: '',
      감시자: '',
      운영자: '',
      공화주의자: '',
      관찰자: '',
      개혁가: '',
      이론가: '',
      자유주의자: '',
      민주당: '',
      국민의힘: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      청와대: '',
    };
  }, []);

  const curPage = useRef(0);

  useEffect(() => {
    if (comment === null) {
      setCurComments([]);
      return;
    }
    async function toAsync() {
      const response = await NewsRepository.getNewsComment(id, comment!, curPage.current);
      setCurComments(response.comments);
      curPage.current += 1;
    }
    toAsync();
  }, [comment]);

  const getPageBefore = async () => {
    if (curPage.current === 0) return;
    const response = await NewsRepository.getNewsComment(id, comment!, curPage.current - 1);
    setCurComments(response.comments);
    curPage.current -= 1;
  };
  const getPageAfter = async () => {
    const response = await NewsRepository.getNewsComment(id, comment!, curPage.current + 1);
    if (response.comments === null || response.comments.length == 0) {
    } else {
      setCurComments(response.comments);
      curPage.current += 1;
    }
  };

  return (
    <Modal state={isCommentModalUp}>
      {comment ? (
        <Wrapper>
          <div className="modal-head">
            <div className="type-image">
              <div className="image-wrapper">
                <ImageFallback src={`assets/img/${comment}.png`} width={80} height={80} />
              </div>
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
                {curComments.map((comment) => {
                  return (
                    <div className="body-block" onClick={() => {}}>
                      {comment.title}
                    </div>
                  );
                })}
              </div>
              <div className="page-button-wrapper">
                <div
                  className="button-left"
                  onClick={() => {
                    getPageBefore();
                  }}
                ></div>
                <div
                  className="button-right"
                  onClick={() => {
                    getPageAfter();
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="modal-body">
              <div className="content-wrapper">
                <p className="content-title">{curComment.title}</p>
                <div className="content-body">
                  {curComment.comment.split('$').map((comment) => {
                    return <p>{comment}</p>;
                  })}
                </div>
              </div>
              <div className="back-button-wrapper">
                <button
                  className="back-button"
                  onClick={() => {
                    setCurComment(null);
                  }}
                >
                  목록으로
                </button>
              </div>
            </div>
          )}
        </Wrapper>
      ) : (
        <></>
      )}
    </Modal>
  );
}

const Wrapper = styled.div`
  width: 40%;
  padding-top: 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;
