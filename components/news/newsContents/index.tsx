import Image from 'next/image';
import styled from 'styled-components';

import { CommonLayoutBox } from '@components/common/commonStyles';
import HorizontalScroll from '@components/common/horizontalScroll/horizontalScroll';
import ImageFallback from '@components/common/imageFallback';
import VoteBox from '@components/news/newsContents/voteBox';
import icoNew from '@images/ico_new_2x.png';
import currentStore from '@store/currentStore';
import { useBool } from '@utils/hook/useBool';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { NewsInView } from '@utils/interface/news';
import { getDotDateForm } from '@utils/tools/date';
import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState } from 'react';
import { commentTypeColor } from '../../../utils/interface/news/commen';
import CommentModal from '../commentModal/modal_newsDetailPage';
import { sortComment } from './newsContents.util';

interface NewsContentProps {
  newsContent: NewsInView;
  voteHistory: 'left' | 'right' | 'none' | null;
  hide: () => void;
}

const SuspenseImage = dynamic(() => import('@components/common/suspenseImage'), { ssr: false });

export default function NewsContent({ newsContent, voteHistory, hide }: NewsContentProps) {
  const {
    id,
    title,
    order,
    summary,
    newsImage,
    keywords,
    state,
    timeline,
    opinionLeft,
    opinionRight,
    subTitle,
    votes,
  } = newsContent;
  const { router } = useRouter();
  const { openCommentModal } = currentStore;

  const [isLeft, showLeft, showRight] = useBool(true);
  const [activeWriter, setActiveWriter] = useState(0);
  const dummySummaries = [
    summary,
    'summary[1]',
    'summary[2]',
    'summary[3]',
    'summary[4]',
    'summary[5]',
    'summary[6]',
  ];
  const dummybuttonImages = [
    '/assets/img/와이보트.png',
    '/assets/img/국민의힘.png',
    '/assets/img/더불어민주당.png',
    '/assets/img/대통령실.png',
    '/assets/img/행정부.png',
    '/assets/img/헌법재판소.png',
    '/assets/img/기타.png',
  ]; // 순서는 기존 논평 순서, 자료 'or' 본문 있는 것만

  const commentToShow = useMemo(() => {
    return sortComment(newsContent?.comments ?? []);
  }, [newsContent]);

  return (
    <Wrapper>
      {/* <TabWrapper state={isLeft} className="fa-flex">
        <span
          onClick={(e) => {
            isLeft ? hide() : showLeft();
          }}
        >
          뒤로
        </span>
        <span onClick={showRight} className="show-next">
          다음
        </span>
      </TabWrapper> */}
      <Body>
        <BodyLeft state={isLeft}>
          <div className="contents-body">
            <div className="right">
              <div className="main-image-wrapper">
                <Suspense fallback={<></>}>
                  <SuspenseImage
                    src={newsImage}
                    alt={title}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  >
                    <p className="img-head">
                      <span>{title}</span>
                    </p>
                  </SuspenseImage>
                </Suspense>
              </div>
              <div className="summary content">
                <h1 className="head">
                  <span>
                    {subTitle} {state ? <Image src={icoNew} alt="new" height="16" /> : <></>}
                  </span>
                </h1>

                <TimelineWrapper className="timeline_wrapper">
                  <CommonHeadLine>타임라인 살펴보기</CommonHeadLine>
                  {timeline.map((timeline, idx) => {
                    return (
                      <div className="timeline">
                        <div className="timeline_sentence">
                          <p className="timeline_date">
                            {timeline.date ? getDotDateForm(timeline.date) : ''}
                          </p>
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
                <SelectionContainer>
                  <SummaryButtons>
                    {commentToShow?.map((comment, index) => (
                      <SummaryButton
                        key={index}
                        active={index === activeWriter}
                        image={`/assets/img/${comment}.png`}
                        onClick={() => setActiveWriter(index)}
                      />
                    ))}
                  </SummaryButtons>
                  <CommentBox>
                    <div className="comment_box_footer">
                      <div className="selected_comment">
                        <small>{commentToShow[activeWriter]}</small>
                      </div>
                      <div
                        className="comment_box_footer_text"
                        onClick={() => {
                          openCommentModal(commentToShow[activeWriter]);
                        }}
                      >
                        자료 보기
                      </div>
                    </div>
                  </CommentBox>
                </SelectionContainer>
                <div
                  className="writer"
                  dangerouslySetInnerHTML={{ __html: dummySummaries[activeWriter] }}
                />
                <div className="keyword-wrapper content">
                  {keywords?.map(({ id, keyword }) => {
                    return (
                      <p
                        className="keyword"
                        key={keyword}
                        onClick={() => {
                          router.push(`/keywords/${id}`);
                        }}
                      >
                        {`# ${keyword}`}
                      </p>
                    );
                  })}
                </div>
                <VoteBox
                  id={id}
                  state={state}
                  opinions={{ left: opinionLeft, right: opinionRight }}
                  votes={votes}
                  voteHistory={voteHistory}
                />
              </div>
            </div>
          </div>
        </BodyLeft>
        {/* <BodyRight state={!isLeft}>
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
                          backgroundColor: commentTypeColor(comment),
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
            {timeline.map((timeline, idx) => {
              return (
                <div className="timeline">
                  <div className="timeline_sentence">
                    <p className="timeline_date">
                      {timeline.date ? getDotDateForm(timeline.date) : ''}
                    </p>
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
          <VoteBox
            id={id}
            state={state}
            opinions={{ left: opinionLeft, right: opinionRight }}
            votes={votes}
            voteHistory={voteHistory}
          />
        </BodyRight> */}
      </Body>
      <CommentModal id={id} />
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
    min-width: 0px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  span {
    color: #666;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgba(200, 200, 200, 0.5);
    box-shadow: 0px 0px 35px -30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #f0f0f0;
    }

    &.show-next {
      display: none;
      @media screen and (max-width: 768px) {
        display: ${({ state }) => (state ? 'inline' : 'none')};
      }
    }
  }
`;

const LeftButton = styled(CommonLayoutBox)``;

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

interface BodyProps {
  state: boolean;
}

const BodyLeft = styled(CommonLayoutBox)<BodyProps>`
  width: 100%;
  min-height: 1000px;
  position: relative;
  padding-bottom: 80px;
  overflow-x: visible;
  letter-spacing: -0.5px;
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
      @media screen and (max-width: 760px) {
        height: 160px;
        width: 95%;
      }
      .img-head {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        backdrop-filter: brightness(0.3);
        font-size: 24px !important;
        font-weight: 600;
        color: rgb(220, 220, 220);
        text-align: center;
        position: relative;
        z-index: 2;
        span {
          padding: 1rem;
          line-height: 1.2;
          @media screen and (max-width: 760px) {
            font-size: 20px;
          }
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
          img {
            margin: 0.1em 0 -0.1em 0;
          }
        }
      }
      .content {
        padding-left: 1.5rem;
      }

      .summary {
        display: inline-block;
        padding-right: 1.5rem;
        padding-bottom: 1.5rem;
        width: 100%;
        font-size: 16px;
        line-height: 1.8;
        color: rgb(30, 30, 30);
        font-weight: 400;
        word-break: break-all;
        font-family: Noto Sans KR, Helvetica, sans-serif;
        h1 > span {
          margin: 10px 0 0 0;
          font-size: 16px;
          font-weight: 400;
          color: rgb(150, 150, 150);
        }
        .writer {
          & {
            p {
              margin: 16px 0 0 0;
              min-height: 0px;
              &:has(br:only-child) {
                margin: 0;
              }
              &:has(strong) {
                margin-top: 26px;
                + p {
                  margin-top: 8px;
                }
              }
              &:first-child {
                margin-top: 20px;
              }
              em {
                font-style: normal;
                color: rgb(100, 100, 100) !important;
              }
              &:has(em) {
                line-height: 1.7;
                padding: 0 8px;
                margin-top: 12px;
              }
              u {
                text-decoration-thickness: 0.8px;
                text-underline-offset: 4px;
                font-weight: 500;
              }
            }
            ul {
              margin: 0 0 0 0;
              margin-top: 50px;
              padding-left: 14px;
              &:first-child {
                margin-top: 20px;
              }
              + p {
                margin-top: 12px;
              }
              li {
                margin-bottom: -4px;
                ::marker {
                  font-size: 12px;
                }
              }
              &[data-checked='false'] {
                margin-top: 30px;
                list-style: none;
                padding-left: 2px;
                li {
                  text-indent: -5px;
                }
              }
              + ul[data-checked='false'] {
                margin-top: 20px;
              }
            }
          }
        }
        @media screen and (max-width: 1480px) {
          padding-left: 1rem;
          padding-right: 1rem;
          h1 > span {
            font-size: 15px;
          }
        }
      }

      .keyword-wrapper {
        line-height: 1;
        padding: 20px 0 40px;
        .keyword {
          display: inline-block;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: rgb(120, 120, 120);
          margin: 0;
          margin-left: 3px;
          margin-right: 6px;
          margin-bottom: 6px;
          padding: 0.25rem 0.25rem;
          background-color: #f1f2f5;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }
`;

const BodyRight = styled.div<BodyProps>`
  width: 45%;
  flex: 1 0 auto;
  padding-left: 1.2rem;
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
  margin-top: 16px;
  border: 1.5px solid rgb(240, 240, 240);
  border-radius: 12px;
  overflow: hidden;

  .comment_box_footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 12px;

    .selected_comment {
      font-size: 14px;
      color: rgb(80, 80, 80);
    }

    .comment_box_footer_text {
      font-size: 12px;
      font-weight: 500;
      color: rgb(30, 30, 30);
      padding: 6px 12px;
      border: 1px solid rgb(225, 225, 225);
      border-radius: 6px;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #f0f0f0;
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
    font-weight: 400;
    align-items: start;

    div.timeline_sentence {
      display: flex;
      flex-direction: row;
      gap: 8px;
      .timeline_date {
        color: black;
        flex-shrink: 0;
      }
    }
  }
`;

const SummaryButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const SummaryButton = styled.button<{ active: boolean; image: string }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: ${({ active, theme }) =>
    active ? `2px solid ${theme.colors.gray700}` : `2px solid ${theme.colors.gray400}`};
  background-color: transparent;
  background-image: url(${({ image }) => image});
  background-size: 20px 20px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
`;

const SelectionContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.gray50 || '#f9f9f9'};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 20px;
`;