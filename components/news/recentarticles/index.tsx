//////////////////////////////////////////////////////////*import ArticleBox from '@components/news/recentarticles/articleBox';
import { ErrorComment } from '@components/common/commonErrorBounbdary/commonErrorView';
import { CommonLayoutBox } from '@components/common/commonStyles';
import { INF } from '@public/assets/resource';
import { RecentArticleQueryOption } from '@queryOption/recentArticleQueryOption';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSlide } from '@utils/hook/useSlide';
import { commentType, recentArticleType } from '@utils/interface/news';
import { commentTypeColor, commentTypeImg } from '@utils/interface/news/comment';
import { RgbToRgba } from '@utils/tools';
import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import ArticleBox from './articleBox';
import { NewArticlesFallback } from './index.fallback';

const categories = ['전체', ...Object.values(commentType).filter((c) => c !== commentType.와이보트)] as Array<recentArticleType>;
interface SlideContentProps {
  commentType: recentArticleType;
  filteredArticles: any[];
}

function SlideContent({ commentType, filteredArticles }: SlideContentProps) {
  const [curView, onSlideLeft, onSlideRight, setCurView] = useSlide();
  const [numToShow, setNumToShow] = useState(10);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 769px)');
    const update = () => setNumToShow(mql.matches ? 10 : 5);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setCurView(0);
    setExpandedId(null);
  }, [commentType]);
  const isAll = commentType === '전체';
  const lastPage = filteredArticles.length > 0
    ? Math.ceil(filteredArticles.length / numToShow) - 1
    : 0;

  return (
    <>
      <GridWrapper>
        {!isAll && (
          <LogoColumn
            style={{
              backgroundColor: `${RgbToRgba(commentTypeColor(commentType)!, 0.1)}`,
            }}
          >
            <span
              className="logo"
              style={{
                backgroundImage: `url(${commentTypeImg(commentType as commentType)})`,
              }}
            />
          </LogoColumn>
        )}
        {filteredArticles.length !== 0 ? (
          <GridContainer curView={curView} $offset={!isAll}>
            {filteredArticles
              .slice(curView * numToShow, (curView + 1) * numToShow)
              .map((article) => {
                return (
                  <ArticleBox
                    key={article.id}
                    article={article}
                    showLogo={isAll}
                    isExpanded={expandedId === article.id}
                    onToggle={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  />
                );
              })}
          </GridContainer>
        ) : (
          <VacantContent commentType={commentType} />
        )}
      </GridWrapper>
      {lastPage > 0 && (
        <SlideNav>
          <SlideNavButton onClick={onSlideLeft} disabled={curView === 0}>
            ‹ 이전
          </SlideNavButton>
          <SlideNavIndicator>{curView + 1} / {lastPage + 1}</SlideNavIndicator>
          <SlideNavButton onClick={onSlideRight} disabled={curView === lastPage}>
            다음 ›
          </SlideNavButton>
        </SlideNav>
      )}
    </>
  );
}

function VacantContent({ commentType }: { commentType: recentArticleType }) {
  return (
    <VacantWrapper>
      <ErrorComment>
        <span
          style={{
            color: commentType === '전체' ? 'rgb(0,0,0)' : commentTypeColor(commentType),
          }}
        >
          {commentType}
        </span>{' '}
        관련 최신 자료가 존재하지 않습니다.
      </ErrorComment>
    </VacantWrapper>
  );
}

const VacantWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function NewArticles({ category }: { category: recentArticleType }) {
  const { data: recentArticles } = useSuspenseQuery(RecentArticleQueryOption(category, 0, INF));

  return (
    <div className="body-wrapper">
      <SlideContent commentType={category} filteredArticles={recentArticles} />
    </div>
  );
}

export default function NewsArticlesSection() {
  const [activeCategory, setActiveCategory] = useState<recentArticleType>('전체');

  return (
    <Wrapper>
      <Header>
        <CategoryNavigation>
          {categories.map((category) => (
            <CategoryItem
              key={category}
              isActive={category === activeCategory}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </CategoryNavigation>
      </Header>
      <Suspense fallback={<NewArticlesFallback />}>
        <NewArticles category={activeCategory} />
      </Suspense>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  background-color: transparent;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  padding: 24px 0;
  font: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  height: auto;
  box-shadow: none;
  border-radius: 0;
  border: none;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 16px 0;
    margin: 0 auto 12px;
  }

  .body-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    margin-top: 8px;

    .grid-wrapper {
      width: 100%;
      overflow: hidden;
      padding: 4px 0;
    }
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  text-align: left;
  margin-bottom: 10px;
`;

const CategoryNavigation = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 768px) {
    gap: 12px;
  }
`;

interface CategoryItemProps {
  isActive: boolean;
}

const CategoryItem = styled.div<CategoryItemProps>`
  cursor: pointer;
  font-family: 'Noto Serif KR', Georgia, serif;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.yvote12 : theme.colors.yvote08)};
  font-size: 15px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  border-bottom: ${(props) => (props.isActive ? '2px solid ${({ theme }) => theme.colors.yvote12}' : 'none')};
  padding-bottom: 5px;
  transition: color 0.2s ease, border-bottom 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.yvote11};
  }
  @media screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const GridWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  touch-action: pan-y;
`;

interface GridContainerProps {
  curView: number;
  $offset?: boolean;
}

const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  width: 100%;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-auto-flow: row;
  grid-row-gap: 4px;
  touch-action: pan-y;
  overscroll-behavior: none;
  > :nth-child(n+6) {
    display: none;
  }
  ${({ $offset }) => ($offset ? 'padding-left: 0;' : '')}
  @media screen and (min-width: 769px) {
    > :nth-child(n+6) {
      display: unset;
    }
    grid-template-rows: repeat(5, auto);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-flow: column;
    grid-column-gap: 15px;
    touch-action: auto;
    overscroll-behavior: auto;
  }
`;

const LogoColumn = styled.div`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: rgba(148, 163, 184, 0.12);
  border-radius: 6px;
  margin-right: 8px;
  .logo {
    width: 18px;
    height: 18px;
    border-radius: 8px;
    background-size: 14px 14px;
    background-position: center;
    background-repeat: no-repeat;
  }

  @media screen and (max-width: 768px) {
    width: 28px;
    .logo {
      width: 16px;
      height: 16px;
      background-size: 12px 12px;
    }
  }
`;

const SlideNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
`;

const SlideNavButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote11};
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  letter-spacing: 0.02em;
  transition: color 0.15s;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.yvote13};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.yvote05};
    cursor: default;
  }
`;

const SlideNavIndicator = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote08};
  letter-spacing: 0.05em;
`;
