import ExplanationComp from '@components/keywords/explainBox';
import SearchBox from '@components/keywords/searchBox';
import NewsContent from '@components/news/newsContents';
import { HOST_URL } from '@public/assets/url';
import keywordRepository, { getKeywordDetailResponse } from '@repositories/keywords';
import newsRepository from '@repositories/news';
import { KeywordOnDetail } from '@utils/interface/keywords';
import { Preview } from '@utils/interface/news';
import { Suspense } from 'react';
import styled from 'styled-components';
import HeadMeta from '@components/common/HeadMeta';
import ExplainFallback from '@components/keywords/explainFallback';
import NewsList from '@components/news/newsLIst';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useFetchNewsContent } from '@utils/hook/useFetchNewsContent';
import { useMount } from '@utils/hook/useMount';
import { GetStaticPaths, GetStaticProps } from 'next';

import { CommonLayoutBox } from '@components/common/commonStyles';
import { getTextContentFromHtmlText } from '@utils/tools';

interface pageProps {
  data: {
    keyword: KeywordOnDetail;
    previews: Array<Preview>;
    description: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const keywords = await keywordRepository.getKeywordsKeyList();
  const paths = keywords.map(({ id }) => {
    return {
      params: { id: String(id) },
    };
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const key = context.params!.keyword as string;
  if (!key) throw Error('KEYWORD NOT EXIST');
  const pm1 = keywordRepository.getKeywordById(Number(key));

  const resolves = await Promise.all([pm1]);

  const keyword = resolves[0];
  console.log('keyword : ', keyword);

  const description = getTextContentFromHtmlText(keyword?.explain ?? '')?.split('.')[0] ?? '';

  return {
    props: {
      data: {
        keyword,
        previews: [],
        description,
      },
    },
    revalidate: 3600,
  };
};

export default function KeyExplanation({ data }: pageProps) {
  const { keyword = {}, previews: initialPreviews } = data;
  console.log(data);
  console.log('================================');
  console.log(keyword);
  const { page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews } =
    useFetchNewsPreviews(16);
  const { newsContent, voteHistory, showNewsContent, hideNewsContent } = useFetchNewsContent();

  useMount(() => {
    fetchPreviews({ filter: keyword.keyword });
  });

  const metaTagsProps = {
    title: `키워드 - ${keyword.keyword}`,
    description: keyword.explain || '',
    image: keyword.keywordImage,
    url: `https://yvoting.com/keywords/${keyword.keyword}`,
    type: 'article',
  };

  return (
    <Wrapper>
      <HeadMeta {...metaTagsProps} />
      <SearchWrapper>
        <SearchBox />
      </SearchWrapper>
      <KeywordWrapper>
        <ExplanationComp
          id={keyword.id!}
          category={keyword.category!}
          keywordImage={keyword.keywordImage ?? ''}
          keyword={keyword?.keyword!}
          explain={keyword?.explain!}
        />
      </KeywordWrapper>
      <div className="main-contents">
        <div className="main-contents-body">
          {newsContent ? (
            <div className="news-contents-wrapper">
              <NewsContent
                newsContent={newsContent}
                voteHistory={voteHistory}
                hide={hideNewsContent}
              />
            </div>
          ) : (
            <NewsList
              page={page}
              previews={previews.length == 0 ? initialPreviews : previews}
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

  .main-contents {
    width: 70%;
    min-width: 800px;
    text-align: left;
    @media screen and (max-width: 768px) {
      width: 98%;
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
    width: 98%;
    min-width: 0px;
  }
`;

const SearchWrapper = styled(CommonLayoutBox)`
  display: flex;
  width: 70%;
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
    width: 90%;
    min-width: 0px;
  }
`;
