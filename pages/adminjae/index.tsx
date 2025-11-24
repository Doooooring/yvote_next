import HeadMeta from '@components/common/HeadMeta';
import { CommonIconButton, CommonLayoutBox } from '@components/common/commonStyles';

import LoadingCommon from '@/components/common/loading';
import { KeywordFiltersHeadTab, KeywordFiltersSideTab } from '@/components/news/keywordFilters';
import NewsListSection from '@/components/news/newsListSection';
import { AdminPreNewsList } from '@/components/news/preNewsList/adminPreNewsList';
import { useCustomSearchParams } from '@/utils/hook/router/useCustomSearchParams';
import NewsArticlesSection from '@components/news/recentarticles';
import useNewsKeywordFilter from '@utils/hook/news/keywordFilter/useNewsKeywordFilter';
import useEditNewsKeywordFilters from '@utils/hook/news/useEditNewsKeywordFilter';
import { Preview } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import { ReactNode, Suspense, useCallback, useRef, useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import styled from 'styled-components';
import { KeyTitle } from '../../utils/interface/keywords';
import { useRouter } from 'next/router';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

export default function AdminJaePage(props: pageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const searchParams = useCustomSearchParams();
  const keywordFilter = searchParams.get('keyword') ?? null;

  const showNewsContent = useCallback(
    (id: number) => {
      router.push(`/adminjae/${id}`);
    },
    [router],
  );
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
    [keywordFilter, searchParams],
  );

  return (
    <>
      <HeadMeta
        {...{
          title: '관리자 페이지 : 어드민재 ㄷㄷ',
          url: `https://yvoting.com/adminjae`,
        }}
      />
      <Wrapper>
        <KeywordFiltersHeadTab
          keywords={keywordsToShow}
          openEditKeywordsTopSheet={() => {
            showEditNewsKeywordTopSheet({
              keywordsToEdit: customKeywords,
              totalKeywords,
              randomKeywords,
              saveKeywordFilteres: setCustomKeywords,
            });
          }}
          keywordSelected={keywordSelected}
          reload={reloadRandomKeywords}
          clickKeyword={toggleKeywordFilter}
        />

        <div className="main-contents">
          <div className="main-contents-body" ref={ref}>
            <ToggleContainer initialHeight={200}>
              {(isOpen: boolean, initialHeight: number) => (
                <>
                  <SectionTitle>작성 중 뉴스[newsId]</SectionTitle>
                  <SectionDescription></SectionDescription>
                  <ScrollableContent $isOpen={isOpen} initialHeight={initialHeight}>
                    <Suspense fallback={<></>}>
                      <AdminPreNewsList keywordFilter={keywordFilter ?? ''} />
                    </Suspense>
                  </ScrollableContent>
                </>
              )}
            </ToggleContainer>
            <SectionContainer>
              <SectionTitle>전체 뉴스(관리자용)</SectionTitle>
              <SectionDescription></SectionDescription>
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
                  isAdmin={true}
                />
              </Suspense>
            </SectionContainer>
          </div>
          <KeywordFiltersSideTab
            keywords={keywordsToShow}
            openEditKeywordsTopSheet={() => {
              showEditNewsKeywordTopSheet({
                keywordsToEdit: customKeywords,
                totalKeywords,
                randomKeywords,
                saveKeywordFilteres: setCustomKeywords,
              });
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

function ToggleContainer({
  children,
  initialHeight = 200,
}: {
  children: (isOpen: boolean, initialHeight: number) => ReactNode;
  initialHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <SectionContainer ref={ref} style={{}}>
      <ContentContainer $isOpen={isOpen} initialHeight={initialHeight}>
        {children(isOpen, initialHeight)}
      </ContentContainer>
      <OpenToggleButton
        onClick={() => {
          if (isOpen && ref.current) {
            ref.current?.scrollIntoView({ block: 'start' });
          }
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <>
            <AiOutlineUp size="20px" />
          </>
        ) : (
          <>
            <AiOutlineDown size="20px" />
          </>
        )}
      </OpenToggleButton>
    </SectionContainer>
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
    width: 98%;
    min-width: 0px;
  }
`;

const SectionContainer = styled(CommonLayoutBox)`
  padding: 20px;
  margin-bottom: 16px;
  position: relative;

  @media screen and (max-width: 768px) {
    padding: 16px 7px;
    margin-bottom: 12px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0 0 8px 0;
  text-align: left;
  position: relative;
  padding-left: 12px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }

  @media screen and (max-width: 768px) {
    font-size: 16px;
    margin: 0 0 6px 0;
    padding-left: 10px;

    &::before {
      width: 3px;
      height: 16px;
    }
  }
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray600};
  margin: 0 0 16px 0;
  text-align: left;
  line-height: 1.5;

  @media screen and (max-width: 768px) {
    font-size: 13px;
    margin: 0 0 12px 0;
  }
`;

const ContentContainer = styled.div<{ $isOpen: boolean; initialHeight: number }>`
  width: 100%;
  position: relative;
`;

const ScrollableContent = styled.div<{ $isOpen?: boolean; initialHeight?: number }>`
  width: 100%;
  max-height: ${({ $isOpen, initialHeight }) => ($isOpen ? '500px' : `${initialHeight || 200}px`)};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* transition: max-height 0.8s ease; */

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: radial-gradient(
      ellipse at center bottom,
      rgba(117, 116, 116, 0.15) 0%,
      rgba(169, 168, 168, 0.08) 40%,
      transparent 70%
    );
    pointer-events: none;
    display: ${({ $isOpen }) => ($isOpen ? 'none' : 'block')};
  }
`;

const OpenToggleButton = styled(CommonIconButton)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
`;

const LoadingWrapper = styled(CommonLayoutBox)`
  background-color: white;
`;
