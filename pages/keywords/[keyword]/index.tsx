import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import ExplanationComp from '@components/keywords/explainBox';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import icoNews from '@images/ico_news.png';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import NewsRepository, { NewsDetail } from '@repositories/news';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { News, Preview } from '@utils/interface/news';

import NewsList from '@components/news/newsLIst';
import { GetStaticPaths, GetStaticProps } from 'next';

type curPreviewsList = Preview[];
type newsContent = undefined | News;
type curClicked = undefined | News['_id'];
type AnswerState = 'left' | 'right' | 'none' | null;

interface pageProps {
  data: {
    id: string;
    keyword: KeywordOnDetail;
    previews: Array<Preview>;
  };
}

interface getNewsContentResponse {
  response: AnswerState;
  news: NewsDetail | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const keywords: string[] = await keywordRepository.getKeywordIdList();
  const paths = keywords.map((keyword: string) => {
    return {
      params: { keyword },
    };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.keyword as string;
  const { keyword, previews }: getKeywordDetailResponse = await keywordRepository.getKeywordDetail(
    id,
    0,
  );
  return {
    props: {
      data: {
        id,
        keyword,
        previews,
      },
    },
  };
};

export default function KeyExplanation({ data }: pageProps) {
  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  const [curKeyword, setCurKeyword] = useState<KeywordOnDetail>();
  const [newsContent, setNewsContent] = useState<NewsDetail | undefined>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>([]);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  const newsWrapper = useRef<HTMLDivElement>(null);
  const [scrollMem, setScrollMem] = useState<number | null>(null);

  const curPage = useRef<number>(10);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setCurKeyword(data.keyword);
      setCurPreviews(data.previews);
    }
  }, [data]);

  const fetchNewsContent = useCallback(async () => {
    const Previews: Array<Preview> = await NewsRepository.getPreviews(
      curPage.current,
      curKeyword?.keyword,
    );
    if (Previews.length === 0) {
      curPage.current = -1;
      return;
    }
    curPage.current += 20;
    const newPreviews = curPreviews.concat(Previews);
    setCurPreviews(newPreviews);
  }, [curPage, curPreviews]);

  const showNewsContent = async (id: string) => {
    const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(id);
    const { response, news } = newsInfo;
    if (news === null) {
      Error('news content error');
      return;
    }
    setScrollMem(newsWrapper.current!.scrollTop);
    newsWrapper.current!.scrollTo(0, 0);
    setNewsContent(news);
    setCurClicked(id);
    setVoteHistory(response);
  };

  const hideNewsContent = useCallback(() => {
    newsWrapper.current!.scrollTo(0, scrollMem!);
    setScrollMem(null);
    setCurClicked(undefined);
    setVoteHistory(null);
  }, [scrollMem]);

  const toggleNewsContentView = useCallback(
    (id: string) => {
      if (curClicked === id) {
        setCurClicked(undefined);
        setVoteHistory(null);
      } else {
        showNewsContent(id);
      }
    },
    [curClicked],
  );

  return (
    <Wrapper ref={newsWrapper}>
      <SearchWrapper>
        <SearchBox />
        <SpeechBubble />
      </SearchWrapper>
      <KeywordWrapper>
        <ExplanationComp
          id={curKeyword?._id! ?? ''}
          category={curKeyword?.category ?? 'etc'}
          keyword={curKeyword?.keyword! ?? ''}
          explain={curKeyword?.explain ?? ''}
        />
      </KeywordWrapper>
      <MainContents>
        <MainHeaderWrapper>
          <MainHeader>
            <Image src={icoNews} alt="hmm" height="18" />
            <CategoryName>{'최신 뉴스'}</CategoryName>
          </MainHeader>
        </MainHeaderWrapper>
        <MainContentsBody>
          {curClicked ? (
            <NewsContentsWrapper>
              <NewsContent
                curClicked={curClicked}
                newsContent={newsContent}
                voteHistory={voteHistory}
                hide={hideNewsContent}
              />
            </NewsContentsWrapper>
          ) : (
            <NewsList
              page={curPage.current ?? 0}
              previews={curPreviews}
              curClicked={curClicked}
              fetchNewsContent={fetchNewsContent}
              toggleNewsContentView={toggleNewsContentView}
            />
          )}
        </MainContentsBody>
      </MainContents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 1000px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 30px -20px;
  margin-bottom: 60px;
`;

const MainContents = styled.div`
  width: 1000px;
`;

const MainHeaderWrapper = styled.div`
  height: 30px;
`;
const CategoryName = styled.p`
  display: inline;
  width: 1000px;
  margin-left: 10px;
  font-weight: 700;
  font-size: 18px;
`;

const MainContentsBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 495px);
  grid-column-gap: 10px;
  position: relative;
`;

const MainHeader = styled.div`
  width: 1000px;
  text-align: left;
  padding-left: 10px;
`;

interface MainContentsLeftProps {
  curClicked: curClicked;
}

const NewsContentsWrapper = styled.div`
  width: 1000px;
  height: 800px;
`;

const KeywordWrapper = styled.div`
  width: 1000px;
  margin-bottom: 30px;
`;

const PreviewBoxWrapper = styled.div`
  display: inline-block;
  width: 470px;
`;

const LastLine = styled.div`
  width: 10px;
  height: 10px;
`;
