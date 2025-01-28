import HeadMeta from '@components/common/HeadMeta';
import { CommonLayoutBox } from '@components/common/commonStyles';
import NewsList from '@components/news/newsLIst';

import SuspenseNewsArticles from '@components/news/recentarticles';

import SearchBox from '@components/news/searchBox';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useMount } from '@utils/hook/useMount';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { useRecentKeywords } from '@utils/hook/useRecentKeywords';
import { Preview } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  //const data: Array<Preview> = await NewsRepository.getPreviews(0, '');
  console.log('is get static props');
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

const metaTagsProps = {
  title: '뉴스 모아보기',
  url: `https://yvoting.com/news`,
};

export default function NewsPage(props: pageProps) {
  const { page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews } =
    useFetchNewsPreviews(16);
  const recentKeywords = useRecentKeywords();
  useMount(() => {
    fetchPreviews({ limit: 16 });
  });
  const [keywordClicked, setKeywordClicked] = useState<string | null>(null);
  const showNewsContent = useNewsNavigate();

  const clickKeyword = useCallback(
    (keyword: string | null) => {
      if (keyword == keywordClicked) {
        setKeywordClicked(null);
        fetchPreviews({ filter: null, limit: 16 });
      } else {
        setKeywordClicked(keyword);
        fetchPreviews({ filter: keyword, limit: 16 });
      }
    },
    [keywordClicked, setKeywordClicked],
  );

  return (
    <>
      <HeadMeta {...metaTagsProps} />
      <Wrapper>
        <ArticlesWrapper>
          <SuspenseNewsArticles />
        </ArticlesWrapper>

        <SearchWrapper>
          <SearchBox page={page} fetchPreviews={fetchPreviews} />
        </SearchWrapper>
        <div className="main-contents">
          <div className="main-contents-body">
            <NewsList
              page={page}
              previews={previews.length == 0 ? props.data : previews}
              isRequesting={isRequesting}
              fetchPreviews={fetchNextPreviews}
              showNewsContent={showNewsContent}
            />
          </div>
          <TagWrapper>
            <KeywordsWrapper>
              <KeywordTitle>최신 키워드</KeywordTitle>
              <KeywordContents>
                {recentKeywords.map((keyword) => {
                  return (
                    <Keyword
                      $clicked={keywordClicked === keyword.keyword}
                      onClick={() => {
                        clickKeyword(keyword.keyword);
                      }}
                    >
                      {keyword.keyword}
                    </Keyword>
                  );
                })}
              </KeywordContents>
            </KeywordsWrapper>
          </TagWrapper>
        </div>
      </Wrapper>
    </>
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
  overflow-x: hidden;
  overflow-y: scroll;
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

  .main-header-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    height: 15px;
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
    display: flex;
    flex-direction: row;

    -webkit-text-size-adjust: none;
    width: 70%;
    max-width: 1300px;
    min-width: 800px;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;

    @media screen and (max-width: 768px) {
      width: 98%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    width: 100%;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;

    border: 0;

    font: inherit;
    vertical-align: baseline;
    position: relative;
  }
`;

const ArticlesWrapper = styled.div`
  display: flex;
  width: 70%;
  max-width: 1000px;
  min-width: 800px;
  position: relative;
  @media screen and (max-width: 768px) {
    width: 98%;
    min-width: 0px;
  }
`;

const SearchWrapper = styled(CommonLayoutBox)`
  display: flex;
  width: 10%;
  min-width: 800px;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  text-align: center;
  margin: 0 0 20px 0;
  padding: 0;
  font: inherit;
  box-sizing: inherit;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 60%;
    min-width: 0px;
  }
`;

const TagWrapper = styled.div`
  flex: 1 0 auto;

  width: 300px;
  height: 100%;
  padding-left: 10px;

  @media screen and (max-width: 1196px) {
    display: none;
  }
`;

const KeywordsWrapper = styled(CommonLayoutBox)`
  padding: 1rem;
  position: sticky;
  top: 0%;
`;

const KeywordTitle = styled.div`
  color: ${({ theme }) => theme.colors.gray800};

  font-weight: 700;
  font-size: 1.1rem;
  text-align: left;
`;

const KeywordContents = styled.div`
  padding-top: 10px;
  text-align: left;
`;

interface KeywordProps {
  $clicked: boolean;
}

const Keyword = styled.div<KeywordProps>`
  box-sizing: border-box;
  display: inline-block;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $clicked, theme }) => ($clicked ? theme.colors.yvote02 : 'rgb(120, 120, 120)')};
  margin: 0;
  margin-left: 3px;
  margin-right: 6px;
  margin-bottom: 6px;
  padding: 2px 8px;
  background-color: ${({ $clicked }) => ($clicked ? 'white !important' : '#f1f2f5')};
  border: 1px solid #f1f2f5;
  border-color: ${({ $clicked, theme }) =>
    $clicked ? theme.colors.yvote01 + ' !important' : '#f1f2f5'};
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;
