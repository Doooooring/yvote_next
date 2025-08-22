import HeadMeta from '@components/common/HeadMeta';
import { CommonLayoutBox } from '@components/common/commonStyles';

import LoadingCommon from '@/components/common/loading';
import { KeywordFiltersHeadTab, KeywordFiltersSideTab } from '@/components/news/keywordFilters';
import NewsListSection from '@/components/news/newsListSection';
import { PreNewsList } from '@/components/news/preNewsList';
import { useCustomSearchParams } from '@/utils/hook/router/useCustomSearchParams';
import NewsArticlesSection from '@components/news/recentarticles';
import useNewsKeywordFilter from '@utils/hook/news/keywordFilter/useNewsKeywordFilter';
import useEditNewsKeywordFilters from '@utils/hook/news/useEditNewsKeywordFilter';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { Preview } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import { Suspense, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { KeyTitle } from '../../utils/interface/keywords';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  //const data: Array<Preview> = await newsRepository.getPreviews(0, '');
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

export default function NewsPage(props: pageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const searchParams = useCustomSearchParams();
  const keywordFilter = searchParams.get('keyword') ?? null;

  const showNewsContent = useNewsNavigate();
  const { showEditNewsKeywordTopSheet } = useEditNewsKeywordFilters();

  const { customKeywords, randomKeywords, setCustomKeywords, reloadRandomKeywords, totalKeywords } =
    useNewsKeywordFilter();
  const keywordSelected = totalKeywords.find((value) => value.keyword === keywordFilter) ?? null;
  const keywordsToShow = unshiftKeywordToKeywords(
    customKeywords.length > 0 ? customKeywords : randomKeywords,
    totalKeywords,
    keywordFilter ?? '',
  );
  const toggleKeywordFilter = useCallback(
    async (keyword: KeyTitle) => {
      if (keyword.keyword === keywordFilter) {
        searchParams.remove('keyword');
      } else {
        searchParams.set('keyword', keyword.keyword);
      }
      setTimeout(() => {
        if (ref.current)
          window.scrollTo({ left: 0, top: ref.current!.offsetTop - 160, behavior: 'smooth' });
      }, 100);
    },
    [keywordFilter],
  );

  return (
    <>
      <HeadMeta
        {...{
          title: '뉴스 모아보기',
          url: `https://yvoting.com/news`,
        }}
      />
      <Wrapper>
        <ArticlesWrapper>
          <NewsArticlesSection />
        </ArticlesWrapper>
        <KeywordFiltersHeadTab
          keywords={keywordsToShow}
          openEditKeywordsTopSheet={() => {
            showEditNewsKeywordTopSheet(
              customKeywords,
              totalKeywords,
              randomKeywords,
              setCustomKeywords,
            );
          }}
          keywordSelected={keywordSelected}
          reload={reloadRandomKeywords}
          clickKeyword={toggleKeywordFilter}
        />
        <div className="main-contents">
          <div className="main-contents-body" ref={ref}>
            <Suspense fallback={<></>}>
              <PreNewsList keywordFilter={keywordFilter ?? ''} />
            </Suspense>
            <Suspense
              fallback={
                <LoadingWrapper>
                  <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
                </LoadingWrapper>
              }
            >
              <NewsListSection
                keywordFilter={keywordFilter ?? ''}
                clickPreviews={showNewsContent}
              />
            </Suspense>
          </div>
          <KeywordFiltersSideTab
            keywords={keywordsToShow}
            openEditKeywordsTopSheet={() => {
              showEditNewsKeywordTopSheet(
                customKeywords,
                totalKeywords,
                randomKeywords,
                setCustomKeywords,
              );
            }}
            keywordSelected={keywordSelected}
            reload={reloadRandomKeywords}
            clickKeyword={toggleKeywordFilter}
          />
        </div>
      </Wrapper>
    </>
  );
}

const unshiftKeywordToKeywords = (
  targetKeywords: Array<KeyTitle>,
  totalKeywords: Array<KeyTitle>,
  keyword: string,
) => {
  const keywordToAdd = totalKeywords.find((v) => v.keyword === keyword);
  if (!keywordToAdd || targetKeywords.map((v) => v.keyword).includes(keyword)) {
    return targetKeywords;
  }
  return [keywordToAdd, ...targetKeywords];
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Helvetica, sans-serif;
  box-sizing: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 50px;
  background-color: rgb(242, 242, 242);
  overflow: clip visible;

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
    max-width: 1000px;
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

const Header = styled(CommonLayoutBox)`
  flex-shrink: 0;
  text-align: center;
  padding: 12px 10px;

  .head {
    display: inline;
    color: ${({ theme }) => theme.colors.gray800};
    font-weight: 700;
    font-size: 1rem;
  }

  .sub-head {
    display: inline;
    color: ${({ theme }) => theme.colors.gray600};
    font-weight: 500;
    font-size: 0.9rem;
  }
`;

const ArticlesWrapper = styled.div`
  width: 70%;
  max-width: 1000px;
  min-width: 800px;
  position: relative;
  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0px;
  }
`;

const LoadingWrapper = styled(CommonLayoutBox)`
  background-color: white;
`;
