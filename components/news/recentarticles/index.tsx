//////////////////////////////////////////////////////////*import ArticleBox from '@components/news/recentarticles/articleBox';
import { CommonLayoutBox } from '@components/common/commonStyles';
import { LeftButton, RightButton } from '@components/common/figure/buttons';
import { useRecentArticles } from '@utils/hook/useRecentComments';
import { useSlide } from '@utils/hook/useSlide';
import { Suspense, useRef } from 'react';
import styled from 'styled-components';
import ArticleBox from './articleBox';
import { NewArticlesFallback } from './index.fallback';

function NewArticles() {
  const numToShow = useRef(5);
  const recentArticles = useRecentArticles();

  const [curView, onSlideLeft, onSlideRight] = useSlide();

  return (
    <>
      <div className="header-wrapper">
        <div className="category-head">
          관련 자료 업데이트 ({Math.min(numToShow.current * (curView + 1), recentArticles.length)} /{' '}
          {recentArticles.length})
        </div>
      </div>
      <div className="body-wrapper">
        <LeftButton curView={curView} viewToLeft={onSlideLeft} />
        <div className="grid-wrapper">
          <GridContainer curView={curView}>
            {recentArticles
              .slice(curView * numToShow.current, (curView + 1) * numToShow.current)
              .map((article) => {
                return <ArticleBox key={article.id} article={article} />;
              })}
          </GridContainer>
        </div>
        <RightButton
          curView={curView}
          viewToRight={onSlideRight}
          lastPage={
            recentArticles.length > 0 ? Math.ceil(recentArticles.length / numToShow.current) - 1 : 0
          }
        />
      </div>
    </>
  );
}

export default function SuspenseNewsArticles() {
  return (
    <Wrapper>
      <Suspense fallback={<NewArticlesFallback />}>
        <NewArticles />
      </Suspense>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  background-color: white;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  padding: 15px 20px;
  font: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 10px;
  width: 100%;
  height: 270px;
  @media screen and (max-width: 768px) {
    width: 98%;
    height: 220px;
    padding: 15px 10px;
    margin-left: auto;
    margin-right: auto;
  }

  .header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 30px;
    text-align: left;
    margin-bottom: 10px;
    .category-head {
      display: inline;
      color: ${({ theme }) => theme.colors.gray800};
      font-weight: 700;
      font-size: 1.1rem;
    }
  }

  .body-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    .grid-wrapper {
      width: 100%;
      border: 0px solid black;
      overflow: hidden;
    }
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
