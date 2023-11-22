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
  category: KeywordToView['category'];
  keywords: Array<KeywordToView>;
  setKeywords: Dispatch<SetStateAction<KeywordToView[]>>;
}

export default function CategoryGrid({ category, keywords, setKeywords }: CategoryGridProps) {
  const page = useRef(1);
  const [curView, onSlideLeft, onSlideRight] = useSlide();

  //onClick event에 keyword 추가 콜백 wip
  const getKeywords = async () => {
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
      <HeaderWrapper>
        <ImageWrapper>
          <ImageFallback src={`/assets/img/ico_news.png`} width="100%" height="100%" />
        </ImageWrapper>
        <CategoryHead>{category}</CategoryHead>
      </HeaderWrapper>
      <BodyWrapper>
        <LeftButton curView={curView} viewToLeft={onSlideLeft} />
        <GridWrapper>
          <GridContainer curView={curView}>
            {keywords.map((keyword) => {
              return (
                <KeywordBox
                  key={keyword._id}
                  id={keyword._id}
                  keyword={keyword.keyword}
                  tail={false}
                />
              );
            })}
          </GridContainer>
        </GridWrapper>
        <RightButton
          curView={curView}
          viewToRight={async () => {
            if (curView === Math.floor(keywords.length / 8)) {
              await getKeywords();
            }
            onSlideRight();
          }}
          lastPage={Math.floor(keywords.length / 8)}
        />
      </BodyWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1000px;
  margin-top: 20px;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-y: scroll;
  }
`;

const HeaderWrapper = styled.div`
  height: 30px;
`;

const CategoryHead = styled.div`
  display: inline;
  width: 1000px;
  margin-left: 10px;
  font-weight: 700;
  font-size: 18px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin-left: 8px;
  }
`;

const ImageWrapper = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  @media screen and (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const BodyWrapper = styled.div`
  position: relative;
`;

const GridWrapper = styled.div`
  border: 0px solid black;
  overflow: hidden;
`;

interface GridContainerProps {
  curView: number;
}

const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  grid-template-rows: repeat(2, 95px);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
  transform: ${({ curView }) => `translateX(-${curView * 1020}px)`};
  transition-duration: 0.5s;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-y: scroll;
    grid-template-rows: repeat(2, 60px);
    grid-column-gap: 10px;
  }
`;
