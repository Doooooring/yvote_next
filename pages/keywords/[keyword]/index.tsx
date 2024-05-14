import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ExplanationComp from '@components/keywords/explainBox';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import NewsRepository, { NewsDetail } from '@repositories/news';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { News, Preview } from '@utils/interface/news';

import NewsList from '@components/news/newsLIst';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';

type curPreviewsList = Preview[];
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
    revalidate: 10,
  };
};

export default function KeyExplanation({ data }: pageProps) {
  // 현재 클릭된 뉴스
  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  const [newsContent, setNewsContent] = useState<NewsDetail | undefined>(undefined);
  const [voteHistory, setVoteHistory] = useState<AnswerState>(null);

  const newsWrapper = useRef<HTMLDivElement>(null);

  const {page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews} = useFetchNewsPreviews(20);

  useEffect(() => {
    fetchPreviews(data.keyword.keyword);
  }, [])


  const showNewsContent = async (id: string) => {
    const newsInfo: getNewsContentResponse = await NewsRepository.getNewsContent(id, null);
    const { news } = newsInfo;
    if (news === null) {
      Error('news content error');
      return;
    }
    setNewsContent(news);
    setCurClicked(id);
    setVoteHistory(null);
  };

  const hideNewsContent = useCallback(() => {
    setCurClicked(undefined);
    setVoteHistory(null);
  }, []);

  return (
    <Wrapper ref={newsWrapper}>
      <div className="search-wrapper">
        <SearchBox />
      </div>
      <KeywordWrapper>
        <ExplanationComp
          id={data.keyword?._id! ?? ''}
          category={data.keyword?.category ?? 'etc'}
          keyword={data.keyword?.keyword! ?? ''}
          explain={data.keyword?.explain ?? ''}
        />
      </KeywordWrapper>
      <div className="main-contents">
        {/* {curClicked ? (
          <></>
        ) : (
          <div className="main-header-wrapper">
            <div className="main-header">
              <Image src={icoNews} alt="hmm" height="18" />
              <div className="category-name">{'관련 뉴스'}</div>
            </div>
          </div>
        )} */}
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
            page={page}
            previews={previews.length == 0 ? data.previews : previews}
            isRequesting={isRequesting}
            fetchPreviews={fetchNextPreviews}
            showNewsContent={showNewsContent}
          />
          )}
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
  overflow: hidden scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
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

  .main-contents {
    width: 70%;
    min-width: 800px;
    text-align: left;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
  }

  .category-name {
    display: inline-flex;
    margin-left: 10px;
    font-weight: 700;
    font-size: 18px;
    line-height: 3em;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      margin-left: 8px;
    }
  }
  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      font-size: 13px;
    }
  }
`;

const KeywordWrapper = styled.div`
  width: 70%;
  min-width: 800px;
  margin-bottom: 30px;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
  }
`;

const PreviewBoxWrapper = styled.div`
  display: inline-block;
  width: 470px;
`;

const LastLine = styled.div`
  width: 10px;
  height: 10px;
`;
