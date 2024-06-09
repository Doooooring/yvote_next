import styled from 'styled-components';
import ImageFallback from '@components/common/imageFallback';
import { LeftButton, RightButton } from '@components/keywords/categoryGrid/buttons';
import { useSlide } from '@utils/hook/useSlide';
import { Article } from '@utils/interface/news';
import ArticleBox from '@components/news/recentarticles/articleBox';
import React from 'react';
import { Dispatch, SetStateAction, useRef } from 'react';

interface ArticleListProps {
  list: Array<Article>;
}

export default function NewArticles({ list }: ArticleListProps) {
  const page = useRef(1);
  const [curView, onSlideLeft, onSlideRight] = useSlide();

  // const getKeywords = async () => {
  //   if (category === 'recent') {
  //     return;
  //   }
  //   try {
  //     const response = await keywordRepository.getKeywordsByCategory(category, page.current);
  //     if (response.length === 0) {
  //     } else {
  //       setKeywords([...keywords, ...response]);
  //       page.current += 1;
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <Wrapper>
      <div className="header-wrapper">
        <div className="category-head">지난 뉴스 업데이트 (5)</div>
      </div>
      <div className="body-wrapper">
        {/* <LeftButton curView={curView} viewToLeft={onSlideLeft} /> */}
        <div className="grid-wrapper">
          <GridContainer curView={curView}>
            {list.map((article) => {
              return (
                <ArticleBox
                  writer={article.writer}
                  title={article.title}
                  content={article.content}
                  date={article.date}
                  newsTitle={article.newsTitle}
                  news_id={article.news_id}
                />
              );
            })}
          </GridContainer>
        </div>
        {/* <RightButton
          curView={curView}
          viewToRight={() => {}}
          lastPage={Math.floor(list.length / 5)}
        /> */}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 30px -20px;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  padding: 15px 10px;
  border: 0;
  font: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 5px 0 20px;
  width: 100%;
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
      color: rgb(64, 64, 64);
      margin-left: 7px;
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
  grid-template-rows: repeat(5, 2rem);
  grid-template-columns: repeat(1, 100%);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 15px;
  @media screen and (max-width: 768px) {
    overflow-x: scroll;
    overflow-y: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
