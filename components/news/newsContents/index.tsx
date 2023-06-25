import styled from 'styled-components';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import VoteBox from '@components/news/newsContents/voteBox';

import blueCheck from '@images/blue_check.svg';
import icoClose from '@images/ico_close.png';
import icoNew from '@images/ico_new.png';
import defaultImg from '@images/img_thumb@2x.png';
import { HOST_URL } from '@public/assets/url';
import { News } from '@utils/interface/news';

type newsContent = undefined | News;
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

  if (curClicked === undefined || newsContent === undefined) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
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
        <Body>
          <BodyLeft>
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
                      <p>{timeline.title}</p>
                    </div>
                  </Timeline>
                );
              })}
            </TimelineBody>
          </BodyLeft>
          <BodyRight>
            <VoteBox
              _id={newsContent._id}
              state={newsContent.state}
              opinions={newsContent.opinions}
              votes={newsContent.votes}
              voteHistory={voteHistory}
            />
          </BodyRight>
        </Body>
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
  padding-top: 10px;
  padding-right: 20px;
  text-align: right;
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
  width: 100%;
  min-height: 1000px;
  background-color: white;
  box-shadow: 0 0 35px -30px;
`;

const BodyRight = styled.div`
  width: 100%;
  padding: 0 2rem;
`;
const ContentHead = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
`;
const ContentBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  gap: 20px;
  padding: 1rem;
`;
const Summary = styled.div`
  display: inline-block;
  font-size: 16px;
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
  font-size: 16px;
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
  font-size: 13px;
  margin-right: 6px;
  color: #3a84e5;
`;
