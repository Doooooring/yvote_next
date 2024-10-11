import Image from 'next/image';
import styled from 'styled-components';

import HorizontalScroll from '@components/common/horizontalScroll/horizontalScroll';
import ImageFallback from '@components/common/imageFallback';
import VoteBox from '@components/news/newsContents/voteBox';
import blueCheck from '@images/blue_check.svg';
import icoClose from '@images/ico_close.png';
import icoNew from '@images/ico_new_2x.png';
import { loadingImg } from '@public/assets/resource';
import { HOST_URL } from '@public/assets/url';
import { NewsDetail } from '@repositories/news';
import currentStore from '@store/currentStore';
import { useBool } from '@utils/hook/useBool';
import { Suspense, useMemo } from 'react';
import CommentModal from '../commentModal';
import { typeColor } from '../commentModal/commentModal.resource';
import { useRouteToKeyword } from './newsContents.hook';
import { sortComment } from './newsContents.util';
import { useHorizontalScroll } from '@utils/hook/useHorizontalScroll';
import TimelineBox from './timelineBox';
import { CommonLayoutBox } from '@components/common/commonStyles';
import NewsContentFallback from '../newsContentFallback';
import dynamic from 'next/dynamic';

interface NewsContentProps {
  newsContent: NewsDetail;
  voteHistory: 'left' | 'right' | 'none' | null;
  hide: () => void;
}

const SuspenseImage = dynamic(() => import('@components/common/suspenseImage'), { ssr: false });

export default function NewsContent({ newsContent, voteHistory, hide }: NewsContentProps) {
  const { openCommentModal } = currentStore;

  const [isLeft, showLeft, showRight] = useBool(true);

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
          <div className="contents-body">
            <div className="right">
              <Suspense fallback={<></>}>
                <div className="main-image-wrapper">
                  <SuspenseImage
                    src={`${HOST_URL}/images/news/${newsContent._id}`}
                    alt={newsContent.title}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  >
                    <p className="img-head">
                      <span>{newsContent.title}</span>
                    </p>
                  </SuspenseImage>
                </div>
              </Suspense>
              <div className="summary content">
                <h1 className="head">
                  <span>
                    {newsContent.title}{' '}
                    {newsContent.state ? <Image src={icoNew} alt="new" height="16" /> : <div></div>}
                  </span>
                </h1>
                <div dangerouslySetInnerHTML={{ __html: newsContent.summary }} />
              </div>
              <div className="keyword-wrapper content">
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
        </BodyLeft>
        <BodyRight state={!isLeft}>
          <CommentWrapper>
            <CommentHeader>관련 자료 체크하기</CommentHeader>
            <CommentBody>
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
            </CommentBody>
          </CommentWrapper>
          <TimelineWrapper className="timeline_wrapper">
            <CommonHeadLine>타임라인 살펴보기</CommonHeadLine>
            {newsContent.timeline.map((timeline, idx) => {
              return (
                <div className="timeline">
                  <div className="timeline_sentence">
                    <p className="timeline_date">{timeline.date}</p>
                    <div className="timeline_body">
                      {timeline.title.split('$').map((title, idx) => {
                        return <p key={idx}>{title}</p>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </TimelineWrapper>
          {/* <TimelineBox timelines={newsContent.timeline} /> */}
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

const CommonHeadLine = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: black;
`;

const Wrapper = styled.div`
  width: 100%;
  border-width: 0px;
  border-color: #000000;
  border-style: solid;
  padding-top: 30px;
  padding-bottom: 160px;
  text-align: left;
  position: absolute;
  overflow-x: visible;
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
  display: flex;

  margin-bottom: 12px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

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
      display: none;
      @media screen and (max-width: 768px) {
        display: ${({ state }) => (state ? 'inline' : 'none')};
      }
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
  // padding-top: 1rem;
  overflow: visible;

  @media screen and (max-width: 768px) {
    padding-top: 0;
  }
`;

const CloseWrapper = styled.div`
  padding: 5px;
  position: absolute;
  left: 0;
  transform: translate(-50%, 0);
  z-index: 9999;
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
`;

interface BodyProps {
  state: boolean;
}

const BodyLeft = styled(CommonLayoutBox)<BodyProps>`
  width: 55%;
  min-height: 1000px;
  position: relative;
  padding-bottom: 80px;
  overflow-x: visible;

  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
    width: 100%;
    min-width: 0px;
  }

  .contents-body {
    padding-top: 1rem;
    .main-image-wrapper {
      width: 95%;
      height: 250px;
      position: relative;
      padding: 0;
      margin-left: auto;
      margin-right: auto;
      border: 1px solid rgb(230, 230, 230);
      border-radius: 10px;

      @media screen and (max-width: 432px) {
        height: 200px;
      }

      .img-head {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        backdrop-filter: brightness(0.5);
        font-size: 24px !important;
        font-weight: 600;
        color: rgb(220, 220, 220);
        text-align: center;
        position: relative;
        z-index: 2;
        span {
          padding: 1rem;
          line-height: 1.2;
        }
      }
      // overflow: hidden;
      // float: left;
    }
    .right {
      .head {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        margin: 0.2em 0 1rem 0;
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
      .content {
        padding: 1rem;
        padding-left: 1.5rem;
        @media screen and (max-width: 768px) {
          padding-right: 1.5rem;
        }
      }

      .summary {
        display: inline-block;
        padding-right: 2.5em;
        font-size: 14px;
        line-height: 2;
        color: rgb(10, 10, 10);
        font-weight: 450;
        word-break: break-all;
        & {
          p {
            margin: 0 0 1em 0;
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
`;

const CommentWrapper = styled(CommonLayoutBox)`
  padding: 0.5rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

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

const CommentHeader = styled(CommonHeadLine)`
  padding: 0.5rem;
`;

const CommentBody = styled(HorizontalScroll)``;

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

const TimelineWrapper = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 1rem;
  margin-bottom: 1rem;
  color: #717171;

  .timeline {
    display: flex;
    padding-bottom: 0.4rem;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    align-items: start;

    .timeline_date {
      color: black;
    }

    div.timeline_sentence {
      display: flex;
      flex-direction: row;
      gap: 8px;
    }
  }
`;
