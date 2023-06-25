import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import styled from 'styled-components';

import icoNew from '@images/ico_new.png';
import defaultImg from '@images/img_thumb@2x.png';
import NewsRepository from '@repositories/news';
import { HOST_URL } from '@url';
import { News, Preview } from '@utils/interface/news';

type newsContent = undefined | News;
type setNewsContent = (newsContent: newsContent) => void;
type curClicked = undefined | News['order'];
type setCurClicked = (curClicked: curClicked) => void;
type AnswerState = 'left' | 'right' | 'none' | null;

interface PreviewBoxProps {
  Preview: Preview;
  curClicked: curClicked;
  setCurClicked: setCurClicked;
  setNewsContent: setNewsContent;
  setVoteHistory: (voteHistory: AnswerState) => void;
}

interface getNewsContentResponse {
  response: AnswerState;
  news: News;
}

export default function PreviewBox({
  Preview,
  curClicked,
  setCurClicked,
  setNewsContent,
  setVoteHistory,
}: PreviewBoxProps) {
  const { _id, order, title, summary, keywords, state } = Preview;

  const [loadError, setLoadError] = useState<boolean>(false);
  const myRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = () => {
    myRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNewsContent = async () => {
    try {
      const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(_id);
      const { response, news } = newsInfo;
      setNewsContent({
        _id: '12hr2oinklernklensbn',
        order: 0,
        title: 'dummy',
        summary:
          'dummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummy$dummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummy$dummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummy',
        keywords: ['dummy1', 'dummy2', 'dummy3'],
        state: true,
        timeline: [
          {
            date: '2023.06.21',
            title: '더미데이터 입니다. 확인 해주세요',
          },
          {
            date: '2023.06.21',
            title: '더미데이터 입니다. 확인 해주세요',
          },
          {
            date: '2023.06.21',
            title: '더미데이터 입니다. 확인 해주세요',
          },
          {
            date: '2023.06.21',
            title: '더미데이터 입니다. 확인 해주세요',
          },
        ],
        opinions: {
          left: 'dummy dummy dummy dummy',
          right: 'dummy dummy dummy dummy',
        },
        votes: {
          left: 1,
          right: 1,
          none: 1,
        },
      });
      setCurClicked(order);
      setVoteHistory(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Wrapper
      ref={myRef}
      state={curClicked === order}
      onClick={() => {
        if (curClicked === order) {
          setCurClicked(undefined);
          setVoteHistory(null);
          return;
        }
        showNewsContent();
        // scrollToElement();
      }}
    >
      <ImgWrapper>
        <Image
          src={loadError ? defaultImg : `${HOST_URL}/images/news/${order}.png`}
          alt="Image load error"
          width="100"
          height="100"
          onError={() => {
            setLoadError(true);
          }}
        />
      </ImgWrapper>
      <BodyWrapper>
        <HeadWrapper>
          <Header>{title}</Header>
          <New state={state}>
            <Image src={icoNew} alt="hmm" height="16" />
          </New>
        </HeadWrapper>
        <Summary>{summary}</Summary>
        <KeywordsWrapper>
          {keywords?.map((keyword) => {
            return (
              <Keyword key={keyword} href={`/keywords/${keyword}`}>
                {`#${keyword}`}
              </Keyword>
            );
          })}
        </KeywordsWrapper>
      </BodyWrapper>
    </Wrapper>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 480px;

  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  background-color: ${({ state }) => (state ? 'rgb(200, 200, 200)' : 'white')};
  box-shadow: 0px 0px 35px -30px;
  margin-bottom: 20px;
  text-align: left;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const ImgWrapper = styled.div`
  display: inline-block;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
`;

const NewsImg = styled.img``;

const BodyWrapper = styled.div`
  display: inline-block;
  padding-left: 20px;
  width: 80%;
  height: 90%;
`;
const HeadWrapper = styled.div``;
const Header = styled.h1`
  display: inline;
  font-size: 15px;
  font-weight: 700;
  margin-right: 10px;
`;

interface NewProps {
  state: boolean | undefined;
}

const New = styled.span<NewProps>`
  display: ${({ state }) => (state ? 'inline' : 'none')};
  & > img {
    position: relative;
    top: 3px;
  }
`;

const Summary = styled.p`
  color: rgb(120, 120, 120);
  margin: 0;
  padding-top: 5px;
  font-size: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const KeywordsWrapper = styled.div``;
const Keyword = styled(Link)`
  display: inline;
  text-decoration: none;
  font-size: 13px;
  margin-right: 6px;
  color: #3a84e5;
`;
