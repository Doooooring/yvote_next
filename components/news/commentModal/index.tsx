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
  // 코멘트 모달 상태 전역으로 관리
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;
  // 현재 보여지고 있는 평론들 ()
  const [curComments, setCurComments] = useState<
    Array<{
      title: string;
      comment: string;
    }>
  >([]);

  //@FIXME 전역 상태 변화에 따라 종종 화면이 변경되지 않는 이슈가 있어서 강제로 바꿈
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);

  const [curComment, setCurComment] = useState<{ title: string; comment: string } | null>(null);

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
      민주당: `민주당은 대한민국의 좌익을 대표하는 정당입니다. 자주독립정신과 민주화운동 정신을 계승하며, 노동 시간, 교육, 의료 등의 영역에서 개인의 삶을 적극적으로 책임지는 큰 정부를 지향합니다. 또한, 더불어민주당은 서민과 중산층의 이해를 대변한다는 말을 직접 명시할 정도로 결과적으로 평등한 방향으로의 사회 변화를 추구합니다. 토지 공공성, 소수자 차별 금지, 식량 자급, 지방 자치의 강화 등도 더불어민주당이 추구하는 대표적인 가치입니다.`,
      국민의힘: `국민의힘은 대한민국의 우익을 대표하는 정당입니다. 선택의 자유와 기회의 평등을 중시하며, 작지만 효율적인 정부를 지향하는 것이 주요 정체성입니다. 국민의힘은 또한 공공의 선과 축적된 경험의 가치를 높게 평가한다는 점에서 공동체의 안정을 중시하는 보수적인 성향을 가지고 있습니다. 이외에도 시장의 유연성, 재정적 지속가능성, 가정과 아동 보호, 효율적인 선택적 복지, 자유민주주의와 힘에 근거한 평화 등은 국민의힘이 추구하는 대표적인 가치입니다.`,
      청와대: `정부는 매주 국무회의를 열어 국정 현안과 정책을 논의하고 입법부에서 도착한 법안의 거부 또는 공포를 결정합니다. 이외에도 대통령은 중요하다고 생각되는 사안에 대한 별도의 회의를 주재하기도 합니다. 대통령이 직접 참여하거나 관여하지 못하는 업무에 대해서는, 대통령이 임명한 국무총리와 각 부처 장관들이 그 역할을 대신합니다.`,
      헌법재판소: `헌법재판소는 9명의 법관으로 구성되며, 국회와 대법원장의 추천을 반영하여 대통령이 임명합니다. 헌법재판소에서 진행하는 결정의 종류로는 위헌적인 법률을 파기하는 위헌법률심판, 국회의 탄핵소추안을 심사하는 탄핵심판, 위헌적인 정당을 해산시키는 정당해산심판, 국가 권력기관 간의 분쟁을 중재하는 권한쟁의심판, 국가에 의해 헌법상의 권리를 침해당한 국민을 구제하고 예방하는 헌법소원심판이 있습니다.`,
      와이보트: `국민의힘은 대한민국의 보수주의 정당이다. 2020년 2월 17일, 자유한국당과 새로운보수당, 미래를향한전진4.0이 통합하여 '미래통합당'이라는 당명으로 창당되었으며, 2020년 9월 2일, 당명을 '국민의힘'으로 변경하였다. 2022년 4월 18일, 국민의당을 흡수하여 합당하였다. (구글에서 베껴온 임시 설명 실제로는 키워드 ‘국민의힘’에 직접 작성한 내용과 같을 예정)`,
      기타: `대통령의 정치적 인지도가 높은 한국에서는, 실질적으로 대통령을 배출할 가능성을 높이기 위해 당을 합치는 경우가 많습니다. 이러한 이유로 두 개의 거대한 정당이 정치를 주도하는 현상이 나타나지만, 합당에 응하지 않는 정당들도 있습니다. 또한, 총선거에 소속 정당 없이 출마하여 당선되거나, 기존의 당에서 나온 국회의원들은 무소속으로 분류됩니다.`,
    };
  }, []);

  /** 대표하는 이름이 변경되는 경우가 존재, 디비를 바꾸는 것이
   * 가장 바람직하나 일단은 아래와 같은 필터링으로 처리
   */
  const typeShow = (type: string) => {
    if (type in typeExplain) {
      if (type === '민주당') return '더불어 민주당';
      if (type === '청와대') return '정부';
      else return type;
    }
  };

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
              <div className="image-box">
                <ImageFallback src={`/assets/img/${comment}.png`} fill={true} />
              </div>
            </div>

            <div className="head-body">
              <div className="head-title">
                <p className="type-name">{typeShow(comment)}</p>
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
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
    padding: 3rem 2rem;
  }
  & {
    div.close-button {
      position: absolute;
      top: 10px;
      right: 14px;
    }
    div.modal-head {
      display: flex;
      flex-direction: row;
      @media screen and (max-width: 768px) {
        display: block;
      }
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
        @media screen and (max-width: 768px) {
          width: 80px;
          height: 80px;
          min-width: 0px;
          float: left;
          margin-right: 20px;
        }
        .image-box {
          width: 80px;
          height: 80px;
          position: absolute;
          @media screen and (max-width: 768px) {
            height: 50px;
            width: 50px;
          }
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
        div.body-block {
          height: 60px;
          padding-left: 2rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
          border-radius: 16px;
          display: flex;
          flex-direction: row;

          align-items: center;

          @media screen and (max-width: 768px) {
            padding: 0rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
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
