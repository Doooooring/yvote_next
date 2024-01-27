import styled from 'styled-components';

import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ImageFallback from '@components/common/imageFallback';
import VoteBox from '@components/news/newsContents/voteBox';
import blueCheck from '@images/blue_check.svg';
import icoClose from '@images/ico_close.png';
import icoNew from '@images/ico_new.png';
import { HOST_URL } from '@public/assets/url';
import KeywordRepository from '@repositories/keywords';
import { NewsDetail } from '@repositories/news';
import currentStore from '@store/currentStore';
import { News, commentType } from '@utils/interface/news';
import { useRouter } from 'next/router';
import CommentModal from '../commentModal';

type newsContent = undefined | NewsDetail;
type curClicked = undefined | News['_id'];

interface NewsContentProps {
  curClicked: curClicked;
  newsContent: newsContent;
  voteHistory: 'left' | 'right' | 'none' | null;
  hide: () => void;
}

export default function NewsContent({
  curClicked,
  newsContent,
  voteHistory,
  hide,
}: NewsContentProps) {
  const navigate = useRouter();
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;
  const [curComment, setCurComment] = useState<commentType | null>(null);

  const [showLeft, setShowLeft] = useState<boolean>(true);

  /**
   * 반응형 페이지 상태
   */
  const toggleShowLeft = useCallback(() => {
    setShowLeft(!showLeft);
  }, [showLeft]);

  /**
   * 평론 모달 열기
   */
  const commentOpen = useCallback((comment: commentType) => {
    setIsCommentModalUp(true);
    setCurComment(comment);
  }, []);

  /**
   * 평론 모달 닫기
   */
  const commentClose = useCallback(() => {
    setIsCommentModalUp(false);
    setCurComment(null);
  }, []);

  /**
   * 키워드를 통해 키워드 아이디 조회 후 페이지 이동
   * @param key 키워드
   */
  const routeToKeyword = async (key: string) => {
    const keyword = await KeywordRepository.getKeywordByKey(key);
    if (!keyword) {
      alert('다시 검색해주세요!');
      return;
    }
    const { _id } = keyword!;
    navigate.push(`/keywords/${_id}`);
  };

  // 코멘트 순서 정렬 (와이보트 > 청와대 > 국민의힘 > 민주당 > 기타 > 그 외)
  const commentToShow = useMemo(() => {
    try {
      return newsContent?.comments.sort((a, b) => {
        const getOrder = (comment: commentType) => {
          switch (comment) {
            case commentType.와이보트:
              return 5;
            case commentType.청와대:
              return 4;
            case commentType.국민의힘:
              return 3;
            case commentType.민주당:
              return 2;
            case commentType.기타:
              return 1;
            default:
              return 0;
          }
        };
        const aOrder = getOrder(a);
        const bOrder = getOrder(b);
        return bOrder - aOrder;
      });
    } catch (e) {
      console.log('comment error');
      console.log(e);
      return [];
    }
  }, [newsContent]);

  if (curClicked === undefined || newsContent === undefined) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
        <FaWrapper state={!showLeft} style={{ textAlign: 'left' }}>
          <span onClick={toggleShowLeft}>
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> 뉴스 상세 열기
          </span>
        </FaWrapper>
        <FaWrapper state={showLeft} className="fa-flex">
          <span
            onClick={(e) => {
              e.preventDefault();
              hide();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> 목록 보기
          </span>
          <span onClick={toggleShowLeft}>
            평론 열기 <FontAwesomeIcon icon={faArrowRight} width={12} />
          </span>
        </FaWrapper>
        <Body>
          <BodyLeft state={showLeft}>
            <div className="close-wrapper">
              <input
                type="button"
                style={{ display: 'none' }}
                id="contents-close-button"
                onClick={(e) => {
                  e.preventDefault();
                  hide();
                }}
              ></input>
              <label className="close-button" htmlFor="contents-close-button">
                <Image src={icoClose} alt="hmm" />
              </label>
            </div>
            <div className="contents-body">
              <div className="left"></div>

              <div className="right">
                <div className="summary">
                  <div className="main-image-wrapper">
                    <ImageFallback
                      src={`${HOST_URL}/images/news/${newsContent._id}`}
                      width={100}
                      height={100}
                    />
                  </div>
                  <h2 className="head">
                    <span>
                      {newsContent.title}{' '}
                      {newsContent.state ? (
                        <Image src={icoNew} alt="hmm" height="16" />
                      ) : (
                        <div></div>
                      )}
                    </span>
                  </h2>
                  {newsContent.summary.split('$').map((sentence) => {
                    return <p>{sentence}</p>;
                  })}
                </div>
                <div className="keyword-wrapper">
                  {newsContent.keywords?.map((keyword) => {
                    return (
                      <p className="keyword" key={keyword} onClick={() => routeToKeyword(keyword)}>
                        {`#${keyword}`}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="timeline-wrapper">
              {newsContent.timeline.map((timeline, idx) => {
                return (
                  <div className="timeline">
                    <ImgWrapper opacity={(idx + 1) / newsContent.timeline.length}>
                      <Image src={blueCheck} alt="" />
                    </ImgWrapper>
                    <div className="timeline-sentence">
                      <p>{timeline.date}</p>
                      <div className="time-line-body">
                        {timeline.title.split('$').map((title, idx) => {
                          return <p key={idx}>{title}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </BodyLeft>
          <BodyRight state={!showLeft}>
            <div className="comment_body">
              {commentToShow!.map((comment) => {
                return (
                  <div
                    className="comment"
                    onClick={() => {
                      commentOpen(comment);
                    }}
                  >
                    <ImageFallback
                      src={`/assets/img/${comment}.png`}
                      width={'100%'}
                      height={'100%'}
                    ></ImageFallback>
                  </div>
                );
              })}
            </div>
            <VoteBox
              _id={newsContent._id}
              state={newsContent.state}
              opinions={newsContent.opinions}
              votes={newsContent.votes}
              voteHistory={voteHistory}
            />
          </BodyRight>
        </Body>
        <CommentModal
          id={newsContent._id}
          comment={curComment}
          commentOpen={commentOpen}
          commentClose={commentClose}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  border-width: 0px;
  border-color: #000000;
  border-radius: 10px;
  border-style: solid;
  padding-top: 30px;
  padding-bottom: 80px;
  text-align: left;
  position: absolute;
  overflow: scroll;
  & {
    padding-top: 0px;
    p {
      margin: 0;
      padding: 0;
    }
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0px;
  }
`;

interface FaWrapperProps {
  state: boolean;
}

const FaWrapper = styled.div<FaWrapperProps>`
  display: none;
  color: black;
  font-weight: 500;
  margin-bottom: 12px;
  &.fa-flex {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 768px) {
      display: ${({ state }) => (state ? 'flex' : 'none')};
    }
  }
  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    width: 100%;
    min-width: 0px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  line-height: 150%;
  text-align: left;
  position: relative;
  padding-top: 1.5rem;
  @media screen and (max-width: 768px) {
    padding-top: 0;
  }
`;

interface BodyProps {
  state: boolean;
}

const BodyLeft = styled.div<BodyProps>`
  width: 52%;
  min-height: 1000px;
  background-color: white;
  box-shadow: 0 0 35px -30px;
  position: relative;
  padding-bottom: 80px;
  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    width: 100%;
    min-width: 0px;
  }

  .close-wrapper {
    padding-right: 5px;
    text-align: right;
    position: absolute;
    top: 0px;
    right: 0px;
    .close-button {
      padding-top: 5px;
      text-align: right;
      img {
        width: 25px;
        height: 25px;
      }
      &:hover {
        cursor: pointer;
      }
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }
  .contents-body {
    /* display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
    gap: 20px; */
    padding: 1.3rem;
    padding-right: 2.5em;
    .main-image-wrapper {
      width: 100px;
      height: 100px;
      margin-top: 1px;
      margin-right: 12px;
      margin-bottom: 0px;
      float: left;
    }
    .left {
    }
    .right {
      .head {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        margin: 0.2em 0 1.7em 0;
        line-height: 1.6em;
        span {
          min-height: 20.25px;
          max-height: 48px;
          img {
            margin: 0.1em 0 -0.1em 0;
          }
        }
      }

      .summary {
        display: inline-block;
        font-size: 14px;
        line-height: 2;
        color: #747272;
        font-weight: 450;
        font-family: 'summary-font';
        word-break: break-all;
        & {
          p {
            margin: 0 0 1em 0.2em;
            min-height: 10px;
          }
        }
      }

      .keyword-wrapper {
        line-height: 1;
        .keyword {
          display: inline;
          text-decoration: none;
          font-size: 12px;
          margin: 0;
          margin-right: 6px;
          color: #3a84e5;
          cursor: pointer;
        }
      }
    }
  }
  .timeline-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 2rem;
    padding-right: 2rem;
    color: #a1a1a1;

    .timeline {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      font-weight: 500;

      div.timeline-sentence {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
    }
  }
`;

interface ImageWrapperProps {
  opacity: number;
}

const ImgWrapper = styled.div<ImageWrapperProps>`
  margin-right: 16px;
  opacity: ${({ opacity }) => opacity};
`;

const BodyRight = styled.div<BodyProps>`
  width: 48%;
  padding: 0 1.5rem;

  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    width: 100%;
    min-width: 0px;
    padding: 0;
  }

  div.comment_body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 10px;
    column-gap: 10px;
    margin-bottom: 20px;

    div.comment {
      width: 100%;
      padding: 2.5rem;
      background-color: white;
      box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-radius: 200px;
      cursor: pointer;
      overflow: hidden;
      @media screen and (max-width: 1440px) {
        padding: 1.75rem;
      }
    }
  }
`;
