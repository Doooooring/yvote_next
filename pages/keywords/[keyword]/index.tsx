import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import ExplanationComp from '@components/keywords/explainBox';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import PreviewBox from '@components/news/previewBox';
import icoNews from '@images/ico_news.png';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import NewsRepository, { NewsDetail } from '@repositories/news';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { News, Preview } from '@utils/interface/news';

import { useOnScreen } from '@utils/hook/useOnScreen';
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
  const [curNewsContent, setCurNewsContent] = useState<NewsDetail | undefined>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>([]);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  const curPage = useRef<number>(10);
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setCurKeyword(data.keyword);
      setCurPreviews(data.previews);
    }
  }, [data]);

  //뷰에 들어옴이 감지될 때 요청 보내기
  const getNewsContent = useCallback(async () => {
    setIsRequesting(true);
    try {
      const Previews: Array<Preview> = await NewsRepository.getPreviews(
        curPage.current,
        curKeyword?.keyword,
      );
      if (Previews.length === 0) {
        curPage.current = -1;
        return;
      }
      curPage.current += 10;
      const newPreviews = curPreviews.concat(Previews);
      setCurPreviews(newPreviews);
      return;
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  }, [curPreviews]);

  useEffect(() => {
    //요청 중이라면 보내지 않기
    const toAsync = async () => {
      await getNewsContent();
    };
    if (curPage.current != -1 && isOnScreen === true && isRequesting === false) {
      toAsync();
    } else {
      return;
    }
  }, [isOnScreen]);

  return (
    <Wrapper>
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
        {curClicked ? (
          <MainContentsBody>
            <NewsContentsWrapper>
              <NewsContent
                curClicked={curClicked}
                setCurClicked={setCurClicked}
                newsContent={curNewsContent}
                voteHistory={voteHistory}
              />
            </NewsContentsWrapper>
          </MainContentsBody>
        ) : (
          <MainContentsBody>
            <NewsList>
              {curPreviews.map((preview) => (
                <PreviewBoxWrapper key={preview.order}>
                  <PreviewBox
                    Preview={preview}
                    curClicked={curClicked}
                    setCurClicked={setCurClicked}
                    setNewsContent={setCurNewsContent}
                    setVoteHistory={setVoteHistory}
                  />
                </PreviewBoxWrapper>
              ))}
              <LastLine ref={curPage.current === -1 ? null : elementRef}></LastLine>
            </NewsList>
          </MainContentsBody>
        )}
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

const NewsList = styled.div`
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 500px);
  grid-template-rows: repeat(auto-fill, 140px);
  grid-column-gap: 0px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  height: 1300px;
  position: relative;
  animation: box-sliding 0.5s linear 1;
  overflow-x: visible;
`;

const PreviewBoxWrapper = styled.div`
  display: inline-block;
  width: 470px;
`;

const LastLine = styled.div`
  width: 10px;
  height: 10px;
`;
