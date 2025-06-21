import HeadMeta from '@components/common/HeadMeta';
import {
  CommonIconButton,
  CommonLayoutBox,
  CommonTagBox,
  Row,
} from '@components/common/commonStyles';
import NewsList from '@components/news/newsLIst';

import SuspenseNewsArticles from '@components/news/recentarticles';

import menuImage from '@assets/img/menu_icon.svg';
import reloadImage from '@assets/img/reload_icon.svg';
import EditKeywordFiltersTopSheet from '@components/news/editKeywordFiltersTopSheet';
import SuspensePreNewsList from '@components/news/preNewsList';
import useNewsKeywordFilter from '@utils/hook/news/useNewsKeywordFilter';
import { useDevice } from '@utils/hook/useDevice';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useGlobalLoading } from '@utils/hook/useGlobalLoading/useGlobalLoading';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { Preview } from '@utils/interface/news';
import { getSessionItem, saveSessionItem } from '@utils/tools/session';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import KeywordHeadTab from '../../components/news/keywordHeadTab';
import { KeyTitle } from '../../utils/interface/keywords';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  //const data: Array<Preview> = await NewsRepository.getPreviews(0, '');
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
  const device = useDevice();

  const [isKeywordTopSheetOpen, setIsKeywordTopSheetOpen] = useState(false);
  const showNewsContent = useNewsNavigate();
  const { router, getCurrentPageInfo } = useRouter();
  const { isLoading: isGlobalLoading, setIsLoading: setIsGlobalLoading } = useGlobalLoading();
  const [keyCached, setKeyCached] = useState<string | null>(null);
  const {
    page,
    isRequesting,
    isFetchingImages,
    previews,
    fetchPreviews,
    fetchNextPreviews,
    getCurrentMetadata,
  } = useFetchNewsPreviews(16);
  const {
    keywordsToShow,
    keywordSelected,
    customKeywords,
    randomKeywords,
    setKeywordSelected,
    setCustomKeywords,
    reloadRandomKeywords,
    totalKeywords,
  } = useNewsKeywordFilter();

  const setCachedPreviews = useCallback(
    async (page: number, limit: number, filter: string | null, scroll: number) => {
      try {
        setIsGlobalLoading(true);
        await fetchPreviews({ limit: page, filter: filter ?? '' });
        setTimeout(() => {
          window.scrollTo({ left: 0, top: scroll });
        }, 100);
        await fetchNextPreviews(limit);
      } catch (e) {
        console.log(e);
      } finally {
        setIsGlobalLoading(false);
      }
    },
    [fetchPreviews, fetchNextPreviews],
  );

  const clickKeyword = useCallback(
    async (keyword: KeyTitle) => {
      setIsGlobalLoading(true);
      try {
        if (keyword.id == keywordSelected?.id) {
          setKeywordSelected(null);
          await fetchPreviews({ filter: null, limit: 16 });
        } else {
          setKeywordSelected(keyword);
          await fetchPreviews({ filter: keyword.keyword, limit: 16 });
        }
      } catch (e) {
      } finally {
        setIsGlobalLoading(false);
      }
    },
    [setKeywordSelected, fetchPreviews, keywordSelected],
  );

  const refreshKeywordFilters = useCallback(async () => {
    const prevSelected = keywordSelected?.keyword;
    reloadRandomKeywords();
    if (prevSelected) {
      try {
        setIsGlobalLoading(true);
        await fetchPreviews({ filter: '', limit: 16 });
      } catch (e) {
      } finally {
        setIsGlobalLoading(false);
      }
    }
  }, [
    reloadRandomKeywords,
    setKeywordSelected,
    setIsGlobalLoading,
    fetchPreviews,
    keywordSelected,
  ]);

  useEffect(() => {
    const info = router.query.pageId as string;
    if (!info) return;
    const item = getSessionItem(info ?? '');
    if (item) {
      const { page, limit, filter, scroll } = item as {
        path: string;
        scroll: number;
        page: number;
        limit: number;
        filter: string;
        isAdmin: boolean;
      };
      if (filter) setKeyCached(filter);
      setCachedPreviews(page, limit, filter, scroll);
    } else {
      fetchPreviews({ limit: 16 });
    }

    const handleRouteChangeStart = () => {
      const info = getCurrentPageInfo();
      if (info) {
        saveSessionItem(info.pageId, {
          path: info.path,
          scroll: window.scrollY,
          ...getCurrentMetadata(),
        });
      }
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.query.pageId, setKeyCached, setCachedPreviews, fetchPreviews]);

  useEffect(() => {
    if (keyCached && totalKeywords.length > 0) {
      const keyword = totalKeywords.filter((v) => v.keyword === keyCached)[0];
      if (keyword) {
        setKeywordSelected(keyword);
      }
      setKeyCached(null);
    }
  }, [keyCached, totalKeywords, setKeywordSelected, setKeyCached]);

  return (
    <>
      <HeadMeta {...metaTagsProps} />
      <Wrapper>
        <ArticlesWrapper>
          <SuspenseNewsArticles />
        </ArticlesWrapper>
        <KeywordHeadTab
          keywords={keywordsToShow}
          setKeywords={setCustomKeywords}
          openEditKeywordsTopSheet={() => setIsKeywordTopSheetOpen(true)}
          keywordSelected={keywordSelected}
          reload={refreshKeywordFilters}
          totalKeywords={totalKeywords}
          clickKeyword={clickKeyword}
        />
        <div className="main-contents">
          <div className="main-contents-body">
            <SuspensePreNewsList />
            <NewsList
              page={page}
              previews={previews.length == 0 ? props.data : previews}
              isRequesting={isRequesting}
              isFetchingImages={isFetchingImages}
              fetchPreviews={fetchNextPreviews}
              showNewsContent={showNewsContent}
            />
          </div>
          <TagWrapper>
            <KeywordsWrapper>
              <Row
                style={{
                  gap: '10px',
                }}
              >
                <KeywordTitle>키워드로 골라보기</KeywordTitle>
                <ReloadButton>
                  <Image
                    src={reloadImage}
                    alt="reload"
                    width={16}
                    height={16}
                    onClick={refreshKeywordFilters}
                  />
                </ReloadButton>
                <ReloadButton>
                  <Image
                    src={menuImage}
                    alt="filter-menu"
                    width={16}
                    height={16}
                    onClick={() => setIsKeywordTopSheetOpen(true)}
                  />
                </ReloadButton>
              </Row>
              <KeywordContents>
                {keywordsToShow.map((keyword) => {
                  return (
                    <Keyword
                      key={keyword.keyword}
                      $clicked={keywordSelected != null && keywordSelected.id === keyword.id}
                      onClick={() => {
                        clickKeyword(keyword);
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
      <EditKeywordFiltersTopSheet
        state={isKeywordTopSheetOpen}
        close={() => setIsKeywordTopSheetOpen(false)}
        keywordsToEdit={customKeywords}
        totalKeywords={totalKeywords}
        randomKeywords={randomKeywords}
        saveKeywordFilteres={setCustomKeywords}
      />
    </>
  );
}

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
  display: flex;
  width: 70%;
  max-width: 1000px;
  min-width: 800px;
  position: relative;
  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0px;
    overflow: hidden;
  }
`;

const TagWrapper = styled.div`
  flex: 1 0 auto;

  width: 300px;
  padding-left: 10px;

  position: relative;

  @media screen and (max-width: 1196px) {
    display: none;
  }
`;

const KeywordsWrapper = styled(CommonLayoutBox)`
  padding: 1rem;
  position: sticky;
  top: 100px;
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

const Keyword = styled(CommonTagBox)<KeywordProps>`
  margin-left: 3px;
  margin-right: 6px;
  margin-bottom: 6px;
  color: ${({ $clicked, theme }) => ($clicked ? theme.colors.yvote05 : 'rgb(120, 120, 120)')};
  background-color: ${({ $clicked }) => ($clicked ? 'white !important' : '#f1f2f5')};
  border-color: ${({ $clicked, theme }) =>
    $clicked ? theme.colors.yvote03 + ' !important' : '#f1f2f5'};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  animation: back-blink 0.4s ease-in-out forwards;
  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ReloadButton = styled(CommonIconButton)`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
`;
