import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import KeywordBox from '@components/keywords/categoryGrid/keywordBox';
import ExplanationComp from '@components/keywords/explainBox';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import PreviewBox from '@components/news/previewBox';
import icoNews from '@images/ico_news.png';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { News, Preview } from '@utils/interface/news';

import { GetStaticPaths, GetStaticProps } from 'next';

type curPreviewsList = Preview[];
type newsContent = undefined | News;
type curClicked = undefined | News['order'];
type AnswerState = 'left' | 'right' | 'none' | null;

interface pageProps {
  data: {
    keyName: string;
    keyword: KeywordOnDetail;
    previews: Array<Preview>;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const keywords: string[] = await keywordRepository.getKeywordList();
  const paths = keywords.map((keyword: string) => {
    return {
      params: { keyword },
    };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const keyName = context.params!.keyword as string;
  const { keyword, previews }: getKeywordDetailResponse = await keywordRepository.getKeywordDetail(
    keyName,
    0,
  );
  return {
    props: {
      data: {
        keyName,
        keyword,
        previews,
      },
    },
  };
};

export default function KeyExplanation({ data }: pageProps) {
  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  const [curKeyword, setCurKeyword] = useState<KeywordOnDetail>();
  const [curNewsContent, setCurNewsContent] = useState<newsContent>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>([]);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  useEffect(() => {
    setCurKeyword(data.keyword);
    setCurPreviews(data.previews);
  }, []);

  if (curKeyword === undefined) {
    return <div></div>;
  }

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBox />
        <SpeechBubble width={200} height={30} />
      </SearchWrapper>
      <MainContents>
        <MainContentsLeft curClicked={curClicked}>
          <KeywordWrapper>
            <KeywordBoxWrapper>
              <KeywordBox keyword={data.keyName} tail={true} />
            </KeywordBoxWrapper>
            <ExplanationComp explain={curKeyword.explain} />
          </KeywordWrapper>
          <NewsListWrapper>
            <NewsHeaderWrapper>
              <Image src={icoNews} alt="hmm" height="18" />
              <NewsListHeader>최신 뉴스</NewsListHeader>
            </NewsHeaderWrapper>
            <NewsList curClicked={curClicked}>
              {data.previews.map((preview) => {
                return (
                  <PreviewBox
                    key={preview._id}
                    Preview={preview}
                    curClicked={curClicked}
                    setCurClicked={setCurClicked}
                    setNewsContent={setCurNewsContent}
                    setVoteHistory={setVoteHistory}
                  />
                );
              })}
            </NewsList>
          </NewsListWrapper>
        </MainContentsLeft>
        <MainContentsRight>
          <NewsContent
            curClicked={curClicked}
            setCurClicked={setCurClicked}
            newsContent={curNewsContent}
            voteHistory={voteHistory}
          />
        </MainContentsRight>
      </MainContents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 1200px;
  margin-top: 100px;
`;

const SearchWrapper = styled.div`
  width: 1000px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 30px -20px;
  margin-bottom: 60px;
`;

const MainContents = styled.div`
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(2, 495px);
  grid-column-gap: 10px;
  position: relative;
`;

interface MainContentsLeftProps {
  curClicked: curClicked;
}

const MainContentsLeft = styled.div<MainContentsLeftProps>`
  width: ${({ curClicked }) => {
    return curClicked ? '500px' : '1000px';
  }};
`;

const KeywordWrapper = styled.div`
  margin-bottom: 30px;
`;

const KeywordBoxWrapper = styled.div`
  margin-bottom: 20px;
`;

const NewsListWrapper = styled.div``;

const NewsHeaderWrapper = styled.div`
  width: 500px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 20px;
`;

const NewsListHeader = styled.p`
  display: inline;
  margin-left: 10px;
  font-weight: 700;
  font-size: 18px;
`;

interface NewsListProps {
  curClicked: curClicked;
}

const NewsList = styled.div<NewsListProps>`
  width: ${({ curClicked }) => {
    return curClicked ? '500px' : '1000px';
  }};
  display: grid;
  grid-template-columns: repeat(auto-fill, 490px);
  grid-template-rows: repeat(auto-fill, 120px);
  grid-column-gap: 0px;
  grid-row-gap: 20px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  height: 900px;
  position: relative;
  overflow: scroll;
  animation: box-sliding 0.5s linear 1;
`;

const MainContentsRight = styled.div``;
