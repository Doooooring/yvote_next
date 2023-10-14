import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { GetServerSideProps } from 'next';

import { SpeechBubble } from '@components/common/figure';
import NewsContent from '@components/news/newsContents';
import NewsList from '@components/news/newsLIst';
import SearchBox from '@components/news/searchBox';
import icoNews from '@images/ico_news.png';
import NewsRepository, { NewsDetail } from '@repositories/news';
import indexStore from '@store/indexStore';
import { News, Preview } from '@utils/interface/news';
import Image from 'next/image';
import { useRouter } from 'next/router';

type curPreviewsList = Preview[];
type newsContent = undefined | NewsDetail;
type curClicked = undefined | News['_id'];
type AnswerState = 'left' | 'right' | 'none' | null;
type setCurClicked = (curClicked: curClicked) => void;

interface pageProps {
  data: Array<Preview>;
}

interface getNewsContentResponse {
  response: AnswerState;
  news: NewsDetail | null;
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const data: Array<Preview> = await NewsRepository.getPreviews(0, '');
  return {
    props: { data },
  };
};

// export async function getServerSideProps(): Promise<{ props: NewsProps }> {
//   const data: Array<Preview> = await NewsRepository.getPreviews(0, "");
//   return {
//     props: { data },
//   };
// }

export default function NewsPage(props: pageProps) {
  const router = useRouter();

  const { currentStore } = indexStore;
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;

  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  const [submitWord, setSubmitWord] = useState<string>('');
  const [newsContent, setNewsContent] = useState<newsContent>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>(props.data);
  const [voteHistory, setVoteHistory] = useState<'left' | 'right' | 'none' | null>(null);

  const curPage = useRef<number>(20);

  const newsWrapper = useRef<HTMLDivElement>(null);
  const [scrollMem, setScrollMem] = useState<number | null>(null);

  const fetchNewsContent = useCallback(async () => {
    const Previews: Array<Preview> = await NewsRepository.getPreviews(curPage.current, submitWord);
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
        hideNewsContent();
      } else {
        showNewsContent(id);
      }
    },
    [curClicked],
  );

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      if (curClicked) {
        window.history.pushState('', '');
        router.push(router.asPath);
        setCurClicked(undefined);
        return false;
      }

      return true;
    });
  }, [curClicked]);

  return (
    <Wrapper ref={newsWrapper}>
      <div className="search-wrapper">
        <SearchBox
          curPage={curPage}
          setSubmitWord={setSubmitWord}
          setCurPreviews={setCurPreviews}
        />
        <SpeechBubble />
      </div>
      <div className="main-contents">
        {curClicked ? (
          <></>
        ) : (
          <div className="main-header-wrapper">
            <div className="main-header">
              <Image src={icoNews} alt="hmm" height="18" />
              <div className="category-name">{'최신 뉴스'}</div>
            </div>
          </div>
        )}
        <div className="main-contents-body">
          {curClicked ? (
            <div className="news-contents-wrapper">
              <NewsContent
                curClicked={curClicked}
                newsContent={newsContent}
                voteHistory={voteHistory}
                hide={hideNewsContent}
              />
            </div>
          ) : (
            <NewsList
              page={curPage.current ?? 0}
              previews={curPreviews}
              curClicked={curClicked}
              fetchNewsContent={fetchNewsContent}
              toggleNewsContentView={toggleNewsContentView}
            />
          )}
        </div>
      </div>
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
  .search-wrapper {
    width: 1000px;
    height: 50px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 30px -20px;
    margin-bottom: 40px;
    position: relative;
  }

  .main-header-wrapper {
    height: 30px;
    .main-header {
      width: 1000px;
      text-align: left;
      padding-left: 10px;
      .category-name {
        display: inline;
        width: 1000px;
        margin-left: 10px;
        font-weight: 700;
        font-size: 18px;
      }
    }
  }

  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 1000px;
      height: 800px;
      font-size: 13px;
    }
  }
`;
