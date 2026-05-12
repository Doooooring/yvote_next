import { Suspense, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import VoteBox from '@components/news/newsContents/voteBox';
import icoNew from '@images/ico_new_2x.png';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { useBool } from '@utils/hook/useBool';
import { commentType, NewsInView } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { sortComment } from './newsContents.util';

interface NewsContentProps {
  newsContent: NewsInView;
  voteHistory: 'left' | 'right' | 'none' | null;
}

const SuspenseImage = dynamic(() => import('@components/common/suspenseImage'), { ssr: false });

export default function NewsContent({ newsContent, voteHistory }: NewsContentProps) {
  const {
    id,
    title,
    order,
    summary,
    summaries,
    newsImage,
    keywords,
    state,
    timeline,
    opinionLeft,
    opinionRight,
    subTitle,
    votes,
  } = newsContent;
  const router = useRouter();
  const { showCommentModal } = useCommentModal();

  const [isLeft, showLeft, showRight] = useBool(true);
  const [activeWriter, setActiveWriter] = useState<commentType | null>(
    summaries?.[0]?.commentType ?? null,
  );

  const commentToShow = useMemo(() => {
    return sortComment(newsContent?.comments ?? []);
  }, [newsContent]);

  return (
    <Wrapper>
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
                    {subTitle} {state && <Image src={icoNew} alt="new" height="16" />}
                  </span>
                </h1>

                <TimelineWrapper className="timeline_wrapper">
                  <CommonHeadLine>타임라인 살펴보기</CommonHeadLine>
                  {timeline.map((timeline, idx) => {
                    return (
                      <div className="timeline" key={`${timeline.date ?? 'timeline'}-${idx}`}>
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
                    {summaries
                      .sort((summary1, summary2) => {
                        return (
                          getCommentTypeRank(summary2.commentType) -
                          getCommentTypeRank(summary1.commentType)
                        );
                      })
                      .map((summary, index) => (
                        <CommentTypeIcon
                          key={index}
                          type={summary.commentType}
                          size={16}
                          onClick={() => setActiveWriter(summary.commentType)}
                        />
                      ))}
                  </SummaryButtons>
                  <CommentBox>
                    <div className="comment_box_footer">
                      <div className="selected_comment">
                        <small>{activeWriter}</small>
                      </div>
                      <div
                        className="comment_box_footer_text"
                        onClick={() => {
                          if (activeWriter) showCommentModal(id, activeWriter, title);
                        }}
                      >
                        자료 보기
                      </div>
                    </div>
                  </CommentBox>
                </SelectionContainer>
                <div
                  className="writer"
                  dangerouslySetInnerHTML={{
                    __html:
                      summaries.filter((s) => s.commentType === activeWriter)[0]?.summary ?? '',
                  }}
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
      </Body>
    </Wrapper>
  );
}

const CommonHeadLine = styled.h4`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  letter-spacing: -0.02em;
  margin: 0 0 8px;
`;

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  p {
    margin: 0;
    padding: 0;
  }
`;

const Body = styled.div`
  width: 100%;
  line-height: 150%;
  text-align: left;
`;

interface BodyProps {
  state: boolean;
}

const BodyLeft = styled.div<BodyProps>`
  width: 100%;
  padding-bottom: 40px;
  letter-spacing: -0.5px;
  @media screen and (max-width: 768px) {
    display: ${({ state }) => (state ? 'block' : 'none')};
  }

  .contents-body {
    .main-image-wrapper {
      width: 100%;
      height: 250px;
      position: relative;
      padding: 0;
      overflow: hidden;
      @media screen and (max-width: 760px) {
        height: 160px;
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
    }
    .right {
      .head {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-family: 'Noto Serif KR', Georgia, serif;
        font-size: 18px;
        font-weight: 600;
        margin: 0.8em 0 1rem 0;
        line-height: 1.6em;
        span {
          color: ${({ theme }) => theme.colors.yvote13};
          min-height: 20.25px;
          img {
            margin: 0.1em 0 -0.1em 0;
          }
        }
      }
      .content {
        padding-left: 0;
      }

      .summary {
        display: inline-block;
        padding-bottom: 1.5rem;
        width: 100%;
        font-size: 15px;
        line-height: 1.8;
        color: ${({ theme }) => theme.colors.yvote12};
        font-weight: 400;
        word-break: break-all;
        font-family: Noto Sans KR, Helvetica, sans-serif;
        h1 > span {
          margin: 10px 0 0 0;
          font-size: 15px;
          font-weight: 400;
          color: ${({ theme }) => theme.colors.yvote07};
        }
        .writer {
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
              color: ${({ theme }) => theme.colors.yvote08} !important;
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
            margin: 0;
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

      .keyword-wrapper {
        line-height: 1;
        padding: 20px 0 40px;
        .keyword {
          display: inline-block;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.yvote08};
          margin: 0;
          margin-left: 3px;
          margin-right: 6px;
          margin-bottom: 6px;
          padding: 0.25rem 0.25rem;
          background-color: ${({ theme }) => theme.colors.yvote02};
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;

  .comment_box_footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;

    .selected_comment {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.yvote08};
    }

    .comment_box_footer_text {
      font-size: 12px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.yvote12};
      padding: 6px 12px;
      border: 1px solid ${({ theme }) => theme.colors.yvote05};
      border-radius: 2px;
      background: transparent;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
      &:hover {
        color: ${({ theme }) => theme.colors.yvote13};
        border-color: ${({ theme }) => theme.colors.yvote13};
      }
    }
  }
`;

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
  margin-bottom: 1rem;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  color: ${({ theme }) => theme.colors.yvote08};
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
        color: ${({ theme }) => theme.colors.yvote13};
        flex-shrink: 0;
      }
    }
  }
`;

const SummaryButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const SelectionContainer = styled.div`
  padding: 12px 0;
  margin-bottom: 20px;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
`;
