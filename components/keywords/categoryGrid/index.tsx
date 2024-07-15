import ImageFallback from '@components/common/imageFallback';
import Image from 'next/image';
import { LeftButton, RightButton } from '@components/keywords/categoryGrid/buttons';
import KeywordBox from '@components/keywords/categoryGrid/keywordBox';
import keywordRepository from '@repositories/keywords';
import { useSlide } from '@utils/hook/useSlide';
import { KeywordToView } from '@utils/interface/keywords';
import { Dispatch, SetStateAction, useRef } from 'react';
import styled from 'styled-components';
import { categoryImgUrl, categoryKoreanName } from './categoryGrid.tool';

interface CategoryGridProps {
  category: KeywordToView['category'] | 'recent';
  keywords: Array<KeywordToView>;
  setKeywords: Dispatch<SetStateAction<KeywordToView[]>>;
}

export default function CategoryGrid({ category, keywords, setKeywords }: CategoryGridProps) {
  const page = useRef(1);
  const [curView, onSlideLeft, onSlideRight] = useSlide();

  //onClick event에 keyword 추가 콜백 wip
  const getKeywords = async () => {
    if (category === 'recent') {
      return;
    }
    try {
      const response = await keywordRepository.getKeywordsByCategory(category, page.current);
      if (response.length === 0) {
      } else {
        setKeywords([...keywords, ...response]);
        page.current += 1;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <div className="header-wrapper">
        <div className="image-wrapper">
          <Image src={categoryImgUrl(category)} alt="" fill />
        </div>
        <h3 className="category-head">{categoryKoreanName(category)}</h3>
      </div>
      <div className="body-wrapper">
        <LeftButton curView={curView} viewToLeft={onSlideLeft} />
        <div className="grid-wrapper">
          <GridContainer curView={curView}>
            {keywords.map((keyword) => {
              return <KeywordBox key={keyword._id} id={keyword._id} keyword={keyword.keyword} />;
            })}
          </GridContainer>
        </div>
        <RightButton
          curView={curView}
          viewToRight={async () => {
            if (curView === Math.floor(keywords.length / 10.01)) {
              await getKeywords();
            }
            onSlideRight();
          }}
          lastPage={Math.floor(keywords.length / 10.01)}
        />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  max-width: 1210px;
  min-width: 868px;
  @media screen and (max-width: 768px) {
    overflow-x: scroll;
    min-width: 0;
  }
  .header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 30px;
    text-align: left;
    margin-bottom: 5px;

    .image-wrapper {
      position: relative;
      height: 18px;
      padding-left: 5px;
      align-items: center;
      img {
        object-fit: contain !important;
        position: relative !important;
        width: auto !important;
      }
      & > span {
        position: unset !important;
      }
    }
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
  grid-template-rows: repeat(2, 3.5rem);
  grid-template-columns: repeat(auto-fill, 10rem);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 15px;
  transform: ${({ curView }) => `translateX(calc(-${curView * 75}px - ${curView * 50}rem))`};
  transition-duration: 0.5s;
  @media screen and (max-width: 768px) {
    overflow-x: scroll;
    overflow-y: hidden;
    transform: translateX(0);
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
