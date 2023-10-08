import Image from 'next/image';
import { useRef, useState } from 'react';
import styled from 'styled-components';

import ImageFallback from '@components/common/imageFallback';
import icoNew from '@images/ico_new.png';
import KeywordRepository from '@repositories/keywords';
import NewsRepository, { NewsDetail } from '@repositories/news';
import { HOST_URL } from '@url';
import { News, Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';

type newsContent = undefined | News;
type setNewsContent = (newsContent: NewsDetail) => void;
type curClicked = undefined | News['_id'];
type setCurClicked = (curClicked: curClicked) => void;
type AnswerState = 'left' | 'right' | 'none' | null;

interface PreviewBoxProps {
  Preview: Preview;
  curClicked: curClicked;
  click: (id: string) => void;
  // setCurClicked: setCurClicked;
  // setNewsContent: setNewsContent;
  // setVoteHistory: (voteHistory: AnswerState) => void;
}

interface getNewsContentResponse {
  response: AnswerState;
  news: NewsDetail | null;
}

export default function PreviewBox({
  Preview,
  curClicked,
  click,
}: // setCurClicked,
// setNewsContent,
// setVoteHistory,
PreviewBoxProps) {
  const navigate = useRouter();
  const { _id, order, title, summary, keywords, state } = Preview;

  const [loadError, setLoadError] = useState<boolean>(false);
  const myRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = () => {
    myRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNewsContent = async () => {
    const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(_id);
    const { response, news } = newsInfo;
    if (news === null) {
      Error('news content error');
      return;
    }
    // setNewsContent(news);
    // setCurClicked(order);
    // setVoteHistory(response);
  };

  const routeToKeyword = async (key: string) => {
    const keyword = await KeywordRepository.getKeywordByKey(key);
    if (!keyword) {
      alert('다시 검색해주세요!');
      return;
    }
    const { _id } = keyword!;
    navigate.push(`/keywords/${_id}`);
  };

  return (
    <Wrapper
      ref={myRef}
      state={curClicked === _id}
      onClick={() => {
        click(_id);
        // if (curClicked === order) {
      //   setCurClicked(undefined);
        //   setVoteHistory(null);
        //   return;
        // }
        // showNewsContent();
        // scrollToElement();
      }}
    >
      <ImgWrapper>
        <ImageFallback src={`${HOST_URL}/images/news/${_id}`} width={100} height={100} />
      </ImgWrapper>
      <BodyWrapper>
        <HeadWrapper>
          <Header>{title}</Header>
          <New state={state}>
            <Image src={icoNew} alt="hmm" height="16" />
          </New>
        </HeadWrapper>
        <Summary>{summary.replace(/\$/g, '')}</Summary>
        <KeywordsWrapper>
          {keywords?.map((keyword) => {
            return (
              // <Keyword key={keyword} href={`/keywords/${keyword}`}>
              //   {`#${keyword}`}
              // </Keyword>
              <p className="keyword" key={keyword} onClick={() => routeToKeyword(keyword)}>
                {`#${keyword}`}
              </p>
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
  width: 490px;

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
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const KeywordsWrapper = styled.div`
  .keyword {
    display: inline;
    text-decoration: none;
    font-size: 12px;
    margin: 0;
    margin-right: 6px;
    color: #3a84e5;
  }
`;
// const Keyword = styled(Link)`
//   display: inline;
//   text-decoration: none;
//   font-size: 12px;
//   margin-right: 6px;
//   color: #3a84e5;
// `;
