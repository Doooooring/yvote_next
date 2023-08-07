import styled from 'styled-components';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import ImageFallback from '@components/common/imageFallback';
import VoteBox from '@components/news/newsContents/voteBox';
import blueCheck from '@images/blue_check.svg';
import icoClose from '@images/ico_close.png';
import icoNew from '@images/ico_new.png';
import defaultImg from '@images/img_thumb@2x.png';
import { HOST_URL } from '@public/assets/url';
import { NewsDetail } from '@repositories/news';
import currentStore from '@store/currentStore';
import { News, commentType } from '@utils/interface/news';
import CommentModal from '../commentModal';

type newsContent = undefined | NewsDetail;
type curClicked = undefined | News['order'];
type setCurClicked = (curClicked: curClicked) => void;

interface NewsContentProps {
  curClicked: curClicked;
  setCurClicked: setCurClicked;
  newsContent: newsContent;
  voteHistory: 'left' | 'right' | 'none' | null;
}

export default function NewsContent({
  curClicked,
  setCurClicked,
  newsContent,
  voteHistory,
}: NewsContentProps) {
  const [loadError, setLoadError] = useState<boolean>(false);
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;
  const [curComment, setCurComment] = useState<commentType | null>(null);

  const commentOpen = useCallback((comment: commentType) => {
    setIsCommentModalUp(true);
    setCurComment(comment);
  }, []);

  const commentClose = useCallback(() => {
    setIsCommentModalUp(false);
    setCurComment(null);
  }, []);

  if (curClicked === undefined || newsContent === undefined) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
        <Body>
          <BodyLeft>
            <NewsBoxClose>
              <input
                type="button"
                style={{ display: 'none' }}
                id="close-button"
                onClick={() => {
                  setCurClicked(undefined);
                }}
              ></input>
              <CloseButton htmlFor="close-button">
                <Image src={icoClose} alt="hmm" />
              </CloseButton>
            </NewsBoxClose>
            <ContentBody>
              <div className="content-body-left">
                <Image
                  src={loadError ? defaultImg : `${HOST_URL}/images/news/${newsContent.order}.png`}
                  alt="Image load error"
                  width="100"
                  height="100"
                  onError={() => {
                    setLoadError(true);
                  }}
                />
              </div>
              <div className="content-body-right">
                <ContentHead>
                  <span>{newsContent.title}</span>
                  {newsContent.state ? <Image src={icoNew} alt="hmm" height="16" /> : <div></div>}
                </ContentHead>
                <Summary>
                  {newsContent.summary.split('$').map((sentence) => {
                    return <p>{sentence}</p>;
                  })}
                </Summary>
                <KeywordsWrapper>
                  {newsContent.keywords?.map((keyword) => {
                    return (
                      <Keyword key={keyword} href={`/keywords/${keyword}`}>
                        {`#${keyword}`}
                      </Keyword>
                    );
                  })}
                </KeywordsWrapper>
              </div>
            </ContentBody>
            <TimelineBody>
              {newsContent.timeline.map((timeline, idx) => {
                return (
                  <Timeline>
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
                  </Timeline>
                );
              })}
            </TimelineBody>
          </BodyLeft>
          <BodyRight>
            <div className="comment_body">
              {newsContent.comments.map((comment) => {
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
          comment={curComment ?? commentType.국민의힘}
          commentOpen={commentOpen}
          commentClose={commentClose}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 1000px;
  border-width: 0px;
  border-color: #000000;
  border-radius: 10px;
  border-style: solid;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: left;
  position: absolute;
  overflow: scroll;
  & {
    p {
      margin: 0;
      padding: 0;
    }
  }
`;
const NewsBoxClose = styled.div`
  padding-right: 10px;
  text-align: right;
  position: absolute;
  top: 0px;
  right: 0px;
`;
const CloseButton = styled.label`
  padding-top: 10px;

  text-align: right;
  &:hover {
    cursor: pointer;
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
`;
const BodyLeft = styled.div`
  width: 52%;
  min-height: 1000px;
  background-color: white;
  box-shadow: 0 0 35px -30px;
  position: relative;
`;

const BodyRight = styled.div`
  width: 48%;
  padding: 0 1.5rem;

  div.comment_body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 10px;
    column-gap: 10px;
    margin-bottom: 20px;

    div.comment {
      width: 100%;
      padding: 1.75rem;
      background-color: white;
      box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-radius: 200px;
      overflow: hidden;
    }
  }
`;

const ContentHead = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
`;
const ContentBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  gap: 20px;
  padding: 1rem;
  padding-right: 2em;
`;
const Summary = styled.div`
  display: inline-block;
  font-size: 13px;
  line-height: 1.5;
  color: #a1a1a1;
  font-weight: 450;
  font-family: 'summary-font';
  word-break: break-all;
  & {
    p {
      margin: 0 0 0.5em 0;
    }
  }
`;

const TimelineBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
  color: #a1a1a1;
`;

interface TimelineProps {
  index: number;
}

const Timeline = styled.p`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 500;
  & {
    div.timeline-sentence {
      display: flex;
      flex-direction: row;
      gap: 8px;
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

const KeywordsWrapper = styled.div`
  line-height: 1;
`;
const Keyword = styled(Link)`
  display: inline;
  text-decoration: none;
  font-size: 10px;
  margin-right: 6px;
  color: #3a84e5;
`;
