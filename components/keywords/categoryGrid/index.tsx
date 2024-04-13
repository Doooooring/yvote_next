import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import ImageFallback from '@components/common/imageFallback';
import { LeftButton, RightButton } from '@components/keywords/categoryGrid/buttons';
import KeywordBox from '@components/keywords/categoryGrid/keywordBox';
import keywordRepository from '@repositories/keywords';
import { useSlide } from '@utils/hook/useSlide';
import { KeywordToView } from '@utils/interface/keywords';
import { useRef } from 'react';

interface CategoryGridProps {
  category: KeywordToView['category'] | 'recent';
  keywords: Array<KeywordToView>;
  setKeywords: Dispatch<SetStateAction<KeywordToView[]>>;
  koreanname: string;
  imageurl: string;
}

export default function CategoryGrid({
  category,
  keywords,
  setKeywords,
  koreanname,
  imageurl,
}: CategoryGridProps) {
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
          <ImageFallback src={imageurl} width="100%" height="100%" />
        </div>
        <div className="category-head">{koreanname}</div>
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
  min-width: 868px;
  @media screen and (max-width: 768px) {
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
      display: inline-flex;
      height: 60%;
      padding-left: 5px;
      align-items: center;
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
    justify-content: center; /* This centers the children vertically */
    align-items: center; /* This centers the children horizontally */
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
  grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 15px;
  transform: ${({ curView }) => `translateX(calc(-${curView * 75}px - ${curView * 50}rem))`};
  transition-duration: 0.5s;
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
