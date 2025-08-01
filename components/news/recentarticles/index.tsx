//////////////////////////////////////////////////////////*import ArticleBox from '@components/news/recentarticles/articleBox';
import { ErrorComment } from '@components/common/commonErrorBounbdary/commonErrorView';
import { CommonLayoutBox } from '@components/common/commonStyles';
import { LeftButton, RightButton } from '@components/common/figure/buttons';
import { useRecentArticles } from '@utils/hook/useRecentComments';
import { useSlide } from '@utils/hook/useSlide';
import { commentType, recentArticleType } from '@utils/interface/news';
import { commentTypeColor } from '@utils/interface/news/comment';
import { Suspense, useState } from 'react';
import styled from 'styled-components';
import ArticleBox from './articleBox';
import { NewArticlesFallback } from './index.fallback';

const categories = ['전체', ...Object.values(commentType)] as Array<recentArticleType>;
const numToShowArticle = 5;

interface SlideContentProps {
  commentType: recentArticleType;
  filteredArticles: any[];
}

function SlideContent({ commentType, filteredArticles }: SlideContentProps) {
  const [curView, onSlideLeft, onSlideRight] = useSlide();

  return (
    <>
      <LeftButton curView={curView} viewToLeft={onSlideLeft} />
      <GridWrapper>
        {filteredArticles.length !== 0 ? (
          <GridContainer curView={curView}>
            {filteredArticles
              .slice(curView * numToShowArticle, (curView + 1) * numToShowArticle)
              .map((article) => {
                return <ArticleBox key={article.id} article={article} />;
              })}
          </GridContainer>
        ) : (
          <VacantContent commentType={commentType} />
        )}
      </GridWrapper>
      <RightButton
        curView={curView}
        viewToRight={onSlideRight}
        lastPage={
          filteredArticles.length > 0
            ? Math.ceil(filteredArticles.length / numToShowArticle) - 1
            : 0
        }
      />
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
  const recentArticles = useRecentArticles(category);

  return (
    <div className="body-wrapper">
      <SlideContent commentType={category} filteredArticles={recentArticles} />
    </div>
  );
}

export default function SuspenseNewsArticles() {
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
  background-color: white;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  padding: 24px 30px;
  font: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 16px;
  height: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 6px;

  @media screen and (max-width: 768px) {
    width: 98%;
    height: auto;
    padding: 16px 16px;
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
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${(props) =>
    props.isActive ? ({ theme }) => theme.colors.gray800 : ({ theme }) => theme.colors.gray500};
  font-size: 16px;
  white-space: nowrap;
  border-bottom: ${(props) => (props.isActive ? '2px solid currentColor' : 'none')};
  padding-bottom: 5px;
  transition: color 0.2s ease, border-bottom 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.gray700};
  }
  @media screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const GridWrapper = styled.div`
  width: 100%;
  height: 200px;
  @media screen and (max-width: 768px) {
    height: 150px;
  }
`;

interface GridContainerProps {
  curView: number;
}

const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  width: 100%;
  grid-template-rows: repeat(5, 30px);
  grid-template-columns: repeat(1, 100%);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 15px;
  @media screen and (max-width: 768px) {
    grid-template-rows: repeat(5, 20px);
    overflow-x: scroll;
    overflow-y: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
