import Image from 'next/image';
import styled from 'styled-components';

import ImageFallback from '@components/common/imageFallback';
import VoteBox from '@components/news/newsContents/voteBox';
import blueCheck from '@images/blue_check.svg';
import icoClose from '@images/ico_close.png';
import icoNew from '@images/ico_new_2x.png';
import { HOST_URL } from '@public/assets/url';
import { NewsDetail } from '@repositories/news';
import currentStore from '@store/currentStore';
import { useBool } from '@utils/hook/useBool';
import { useMemo } from 'react';
import CommentModal from '../commentModal';
import { useRouteToKeyword } from './newsContents.hook';
import { sortComment } from './newsContents.util';
import { loadingImg } from '@public/assets/resource';
import { typeColor } from '../commentModal/commentModal.resource';
import { useHorizontalScroll } from '@utils/hook/useHorizontalScroll';

interface NewsContentProps {
  newsContent: NewsDetail;
  voteHistory: 'left' | 'right' | 'none' | null;
  hide: () => void;
}

export default function NewsContent({ newsContent, voteHistory, hide }: NewsContentProps) {
  const { openCommentModal } = currentStore;

  const [isLeft, showLeft, showRight] = useBool(true);
  const { scrollRef, onMouseDown, onMouseUp, onDragMove } = useHorizontalScroll();

  const routeToKeywordPage = useRouteToKeyword();

  const commentToShow = useMemo(() => {
    return sortComment(newsContent?.comments ?? []);
  }, [newsContent]);

  return (
    <Wrapper>
      <TabWrapper state={isLeft} className="fa-flex">
        <span
          onClick={(e) => {
            e.preventDefault();
            isLeft ? hide() : showLeft();
          }}
        >
          뒤로
        </span>
        <span onClick={showRight} className="show-next">
          다음
        </span>
      </TabWrapper>
      <Body>
        <BodyLeft state={isLeft}>
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
            <div className="right">
              <div className="summary">
                <div className="main-image-wrapper">
                  <ImageFallback
                    src={`${HOST_URL}/images/news/${newsContent._id}`}
                    alt={newsContent.title}
                    blurImg={loadingImg}
                    width={100}
                    height={100}
                  />
                </div>
                <h2 className="head">
                  <span>
                    {newsContent.title}{' '}
                    {newsContent.state ? <Image src={icoNew} alt="new" height="16" /> : <div></div>}
                  </span>
                </h2>
                {newsContent.summary.split('$').map((sentence) => {
                  return <p>{sentence}</p>;
                })}
              </div>
              <div className="keyword-wrapper">
                {newsContent.keywords?.map((keyword) => {
                  return (
                    <p
                      className="keyword"
                      key={keyword}
                      onClick={() => routeToKeywordPage(keyword)}
                    >
                      {`# ${keyword}`}
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
                    <ImageFallback src={blueCheck} alt="bluecheck" fill />
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
        <BodyRight state={!isLeft}>
          <div className="comment_wrapper">
            <h4 className="comment_header">관련 자료 체크하기</h4>
            <div
              className="comment_body"
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onMouseMove={onDragMove}
            >
              <div className="comment_scroll_wrapper">
                {commentToShow!.map((comment) => {
                  return (
                    <CommentBox>
                      <div
                        className="comment_box_header"
                        style={{
                          backgroundColor: typeColor(comment),
                        }}
                      >
                        <div className="img-wrapper">
                          <ImageFallback
                            src={`/assets/img/${comment}.png`}
                            alt={comment}
                            width={'30'}
                            height={'30'}
                          />
                        </div>
                      </div>
                      <div className="comment_box_footer">
                        <div
                          className="comment_box_footer_text"
                          onClick={() => {
                            openCommentModal(comment);
                          }}
                        >
                          자료 보기
                        </div>
                      </div>
                    </CommentBox>
                  );
                })}
              </div>
            </div>
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
      <CommentModal id={newsContent._id} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  border-width: 0px;
  border-color: #000000;
  border-style: solid;
  padding-top: 30px;
  padding-bottom: 160px;
  text-align: left;
  position: absolute;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  @media screen and (max-width: 300px) {
    overflow-x: scroll;
  }
`;

interface TabWrapperProps {
  state: boolean;
}

const TabWrapper = styled.div<TabWrapperProps>`
  display: none;
  margin-bottom: 12px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: flex;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0px;
  }

  span {
    color: #666;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgba(200, 200, 200, 0.5);
    box-shadow: 0px 0px 35px -30px;

    &.show-next {
      display: ${({ state }) => (state ? 'inline' : 'none')};
    }
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
  padding-top: 1rem;
  @media screen and (max-width: 768px) {
    padding-top: 0;
  }
`;

interface BodyProps {
  state: boolean;
}

const BodyLeft = styled.div<BodyProps>`
  width: 55%;
  min-height: 1000px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  box-shadow: 0 0 35px -30px;
  position: relative;
  padding-bottom: 80px;
  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    width: 100%;
    min-width: 0px;
  }
  .close-wrapper {
    padding-top: 5px;
    padding-right: 5px;
    text-align: right;
    position: absolute;
    top: 0px;
    right: 0px;
    .close-button {
      text-align: right;
      img {
        width: 25px;
        height: 25px;
      }
      &:hover {
        cursor: pointer;
      }
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .contents-body {
    padding: 1rem;
    padding-right: 2.5em;
    .main-image-wrapper {
      width: 100px;
      height: 100px;
      margin-top: 1px;
      margin-right: 12px;
      margin-bottom: 0px;
      border: 1px solid rgb(230, 230, 230);
      border-radius: 10px;
      overflow: hidden;
      float: left;
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
          color: rgb(6, 6, 6);
          min-height: 20.25px;
          max-height: 48px;
          img {
            margin: 0.1em 0 -0.1em 0;
          }
        }
        span:hover {
          cursor: pointer;
        }
      }

      .summary {
        display: inline-block;
        font-size: 14px;
        line-height: 2;
        color: #747272;
        font-weight: 450;
        word-break: break-all;
        & {
          p {
            margin: 0 0 1em 0.5em;
            min-height: 10px;
            font-family: Helvetica, sans-serif;
          }
        }
      }

      .keyword-wrapper {
        line-height: 1;
        .keyword {
          display: inline-block;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
          color: rgb(120, 120, 120);
          margin: 0;
          margin-left: 3px;
          margin-right: 6px;
          margin-bottom: 6px;
          padding: 0.25rem 0.25rem;
          background-color: #f1f2f5;
          border-radius: 2px;
          cursor: pointer;
        }
      }
    }
    @media screen and (max-width: 768px) {
      padding-right: 1.5rem;
    }
  }
  .timeline-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    color: #a1a1a1;

    .timeline {
      display: flex;
      padding-bottom: 0.4rem;
      flex-direction: row;
      font-size: 14px;
      font-weight: 500;
      align-items: start;

      div.timeline-sentence {
        margin-left: 10px;
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
  position: relative;
  height: 20px;
  aspect-ratio: 1 / 1;
  opacity: ${({ opacity }) => opacity};
`;

const BodyRight = styled.div<BodyProps>`
  width: 45%;
  padding: 0 1.2rem;
  max-width: 500px;
  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    min-width: 270px;
    max-width: 768px;
    padding: 0;
    width: 100%;
  }

  div.comment_wrapper {
    padding: 0.5rem;
    padding-bottom: 1rem;

    margin-bottom: 1rem;

    background-color: white;
    border: 1px solid rgba(200, 200, 200, 0.5);
    border-radius: 5px;
    box-shadow: 0 0 35px -30px;
  }

  h4.comment_header {
    font-size: 14px;
    font-weight: 600;
    color: black;

    padding: 0.5rem;
  }

  div.comment_body {
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  div.comment_scroll_wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-right: 4px;

    &:hover {
      cursor: pointer;
    }

    div.comment {
      background-color: white;
      box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-radius: 200px;
      cursor: pointer;
      overflow: hidden;
      aspect-ratio: 1 / 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const CommentBox = styled.div`
  flex: 0 0 auto;

  display: flex;
  flex-direction: column;

  border: 1.5px solid rgb(240, 240, 240);
  border-radius: 12px;
  overflow: hidden;

  .comment_box_header {
    width: 100%;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgb(225, 225, 225);
  }

  .img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 60px;
    height: 60px;
    background-color: white;
    border-radius: 40px;
  }

  .comment_box_footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    background-color: white;

    padding: 0.5rem;

    .comment_box_footer_text {
      font-size: 12px;
      font-weight: 600;
      color: rgb(30, 30, 30);

      padding: 0.25rem 1.5rem;
      border: 1px solid rgb(225, 225, 225);
      border-radius: 6px;

      &:hover {
        color: rgb(50, 50, 50);
      }
    }
  }
`;
