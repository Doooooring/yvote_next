import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { GetServerSideProps } from 'next';

import { SpeechBubble } from '@components/common/figure';
import NewsContent from '@components/news/newsContents';
import NewsList from '@components/news/newsLIst';
import SearchBox from '@components/news/searchBox';
import NewsRepository, { NewsDetail } from '@repositories/news';
import { News, Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';

type curPreviewsList = Preview[];
type newsContent = undefined | NewsDetail;
type curClicked = undefined | News['_id'];
type AnswerState = 'left' | 'right' | 'none' | null;

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

export default function NewsPage(props: pageProps) {
  const router = useRouter();

  // 현재 선택된 뉴스
  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  // 검색어 바인딩
  const [submitWord, setSubmitWord] = useState<string>('');
  // 뉴스 블록 선택시 보여질 뉴스 상세 내용
  const [newsContent, setNewsContent] = useState<newsContent>(undefined);
  // 현재 보여지고 있는 뉴스 블록 리스트
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>(props.data);
  // 현재 보여지고 있는 뉴스 컨텐츠에 대한 투표 기록 (블록 클릭 시 API 조회를 통해 받아옴)
  const [voteHistory, setVoteHistory] = useState<'left' | 'right' | 'none' | null>(null);
  // 현재 보여지고 잇는 뉴스 블록 개수 (api 조회시 다음 목록을 불러올 때 사용)
  const curPage = useRef<number>(20);

  // 뉴스 상세 화면을 보던 상태에서 뒤로가기시 스크롤을 기억하기 위한 ref 및 state
  const newsWrapper = useRef<HTMLDivElement>(null);
  const [scrollMem, setScrollMem] = useState<number | null>(null);

  /**
   * 뉴스 블록들 조회 및 현재 페이지 업데이트
   */
  const fetchNewsPreviews = useCallback(async () => {
    const Previews: Array<Preview> = await NewsRepository.getPreviews(curPage.current, submitWord);
    if (Previews.length === 0) {
      curPage.current = -1;
      return;
    }
    curPage.current += 20;
    const newPreviews = curPreviews.concat(Previews);
    setCurPreviews(newPreviews);
  }, [curPage, curPreviews]);

  /**
   * 뉴스 블록 클릭시 해당 뉴스 상세 내용 조회 및 업데이트
   */
  const showNewsContent = async (id: string) => {
    const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(id);
    const { response, news } = newsInfo;
    if (news === null) {
      return;
    }
    // 이전 스크롤 위치 기억
    setScrollMem(newsWrapper.current!.scrollTop);
    // 상세 화면이 보여질 때 스크롤 위치를 최상단으로
    newsWrapper.current!.scrollTo(0, 0);
    setNewsContent(news);
    setCurClicked(id);
    setVoteHistory(response);
  };

  /**
   * 뉴스 상세 내용 페이지 뒤로가기
   */
  const hideNewsContent = useCallback(() => {
    // 이전 스크롤 위치로 되돌아감
    newsWrapper.current!.scrollTo(0, scrollMem!);
    // 이전 스크롤 위치 초기화
    setScrollMem(null);
    setCurClicked(undefined);
    setVoteHistory(null);
  }, [scrollMem]);

  /**
   * 뉴스 상세 내용 토글
   * 기존에는 블록 클릭시 화면에 남아 있어서, 다시 클릭시 토글이 되는 형태였음
   */
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

  /**
   * 뉴스 상세화면이 보이는 상태에서 브라우저 뒤로가기 클릭시
   * 상세페이지가 닫히고 블록화면이 보이게 만듬
   */
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
              fetchNewsPreviews={fetchNewsPreviews}
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
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
  .search-wrapper {
    width: 70%;
    min-width: 800px;
    height: 50px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 30px -20px;
    margin-bottom: 40px;
    position: relative;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
      margin-bottom: 20px;
    }
  }

  .main-header-wrapper {
    height: 30px;
    .main-header {
      width: 70%;
      min-width: 800px;
      text-align: left;
      padding-left: 10px;
      .category-name {
        display: inline;
        width: 70%;
        margin-left: 10px;
        font-weight: 700;
        font-size: 18px;
        @media screen and (max-width: 768px) {
          width: 90%;
          min-width: 0px;
        }
      }
    }
  }

  .main-contents {
    width: 70%;
    min-width: 800px;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      height: 800px;
      font-size: 13px;
    }
  }
`;
