import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';

import icoNews from '@assets/img/ico_news.png';
import { SpeechBubble } from '@components/common/figure';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import PreviewBox from '@components/news/previewBox';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { News, Preview } from '@utils/interface/news';

import { NewsDetail } from '@repositories/news';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

type curPreviewsList = Preview[];
type newsContent = undefined | News;
type curClicked = undefined | News['order'];
type AnswerState = 'left' | 'right' | 'none' | null;

interface IParams extends ParsedUrlQuery {
  keyName: string;
}

interface pageProps {
  data: {
    keyName: string;
    keyword: KeywordOnDetail;
    previews: Array<Preview>;
  };
}

function ExplanationComp({ explain }: { explain: string | undefined }) {
  if (explain === undefined) {
    return <div></div>;
  }
  return (
    <ExplanationWrapper>
      {explain.split('$').map((s, idx) => {
        return <Explanation key={idx}>{s}</Explanation>;
      })}
    </ExplanationWrapper>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const keywords: string[] = await keywordRepository.getKeywordList();
  const paths = keywords.map((keyName: string) => {
    return {
      params: { keyName },
    };
  });
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { keyName } = context.params as IParams;
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
  const [curNewsContent, setCurNewsContent] = useState<NewsDetail | undefined>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>([]);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  // const getKeywordData = async () => {
  //   interface KeywordDetail {
  //     keyword: KeywordOnDetail;
  //     previews: Array<Preview>;
  //   }
  //   if (!keyName) {
  //     return 0;
  //   }
  //   const { keyword, previews }: KeywordDetail = await KeywordsServices.getKeywordDetail(
  //     keyName,
  //     0,
  //   );
  //   setCurKeyword(keyword);
  //   setCurPreviews(previews);
  // };

  // useEffect(() => {
  //   getKeywordData();
  // }, [keyName]);

  return !curKeyword ? (
    <div></div>
  ) : (
    <Wrapper>
      <SearchWrapper>
        <SearchBox />
        <SpeechBubble />
      </SearchWrapper>
      <MainContents>
        <MainContentsLeft curClicked={curClicked}>
          {/* <KeywordWrapper>
            <KeywordBoxWrapper>
              <KeywordBox id={'adsfsaf'} keyword={data.keyName} tail={true} />
            </KeywordBoxWrapper>
            <ExplanationComp explain={curKeyword.explain} />
          </KeywordWrapper> */}
          <NewsListWrapper>
            <NewsHeaderWrapper>
              <Image src={icoNews} alt="hmm" height="18" />
              <NewsListHeader>최신 뉴스</NewsListHeader>
            </NewsHeaderWrapper>
            <NewsList curClicked={curClicked}>
              {curPreviews.map((preview) => {
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

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 480px;
  background-color: white;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  box-shadow: 0 0 30px -25px;
`;

const Explanation = styled.p`
  font-family: var(--font-pretendard);
  font-size: 18px;
  color: rgb(90, 90, 90);
  line-height: 1.5;
  text-align: left;
  text-indent: 1em;
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
