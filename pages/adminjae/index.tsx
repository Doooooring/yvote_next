import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import NewsList from '@components/news/newsLIst';
import SearchBox from '@components/news/searchBox';
import NewsRepository from '@repositories/news';
import { Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';

type curPreviewsList = Preview[];

interface pageProps {
  data: Array<Preview>;
}

export default function NewsPage(props: pageProps) {
  const router = useRouter();

  // 검색어 바인딩
  const [submitWord, setSubmitWord] = useState<string>('');
  // 현재 보여지고 있는 뉴스 블록 리스트
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>([]);
  // 현재 보여지고 있는 뉴스 컨텐츠에 대한 투표 기록 (블록 클릭 시 API 조회를 통해 받아옴)
  const curPage = useRef<number>(0);

  /**
   * 뉴스 블록들 조회 및 현재 페이지 업데이트
   */
  const fetchNewsPreviews = useCallback(async () => {
    const Previews: Array<Preview> = await NewsRepository.getPreviewsAdmin(
      curPage.current,
      submitWord,
    );
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
    router.push(`/news/${id}`);
  };

  return (
    <Wrapper>
      <div className="search-wrapper">
        <SearchBox
          curPage={curPage}
          setSubmitWord={setSubmitWord}
          setCurPreviews={setCurPreviews}
        />
        <SpeechBubble />
      </div>
      <div className="main-contents">
        <div className="main-header-wrapper"></div>
        <div className="main-contents-body">
          <NewsList
            page={curPage.current ?? 0}
            previews={curPreviews}
            fetchNewsPreviews={fetchNewsPreviews}
            showNewsContent={showNewsContent}
          />
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
