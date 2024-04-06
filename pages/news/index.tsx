import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { GetStaticProps } from 'next';

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

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  const data: Array<Preview> = await NewsRepository.getPreviews(0, '');
  return {
    props: { data },
    revalidate: 10,
  };
};

export default function NewsPage(props: pageProps) {
  const router = useRouter();

  // 검색어 바인딩
  const [submitWord, setSubmitWord] = useState<string>('');
  // 현재 보여지고 있는 뉴스 블록 리스트
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>(props.data);
  // 현재 보여지고 있는 뉴스 컨텐츠에 대한 투표 기록 (블록 클릭 시 API 조회를 통해 받아옴)
  const curPage = useRef<number>(20);

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
        {/* <SpeechBubble /> */}
      </div>
      <div className="main-contents">
        <div className="main-header-wrapper"></div>
        <div className="main-contents-body">
          <NewsList
            page={curPage.current ?? 0}
            previews={curPreviews}
            curClicked={undefined}
            fetchNewsPreviews={fetchNewsPreviews}
            showNewsContent={showNewsContent}
          />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Helvetica, sans-serif;
  box-sizing: inherit;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 50px;
  background-color: rgb(242, 242, 242);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .search-wrapper {
    display: flex;
    width: 70%;
    min-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 30px -20px;
    position: relative;
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0 0 20px 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-header-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
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
    -webkit-text-size-adjust: none;
    width: 70%;
    min-width: 800px;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;

    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      height: 800px;
      font-size: 13px;
    }
  }
`;
