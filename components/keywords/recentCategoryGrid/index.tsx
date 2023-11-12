import { Dispatch, SetStateAction, useRef } from 'react';
import styled from 'styled-components';

import Image from 'next/image';

import icoNews from '@images/ico_news.png';
import { useSlide } from '@utils/hook/useSlide';
import { KeywordToView } from '@utils/interface/keywords';
import { LeftButton, RightButton } from '../categoryGrid/buttons';
import KeywordBox from '../categoryGrid/keywordBox';

interface RecentCategoryGridProps {
  keywords: Array<KeywordToView>;
  setKeywords: Dispatch<SetStateAction<Array<KeywordToView>>>;
}

export default function RecentCategoryGrid({ keywords, setKeywords }: RecentCategoryGridProps) {
  const page = useRef(1);
  const [curView, onSlideLeft, onSlideRight] = useSlide();
  return (
    <Wrapper>
      <HeaderWrapper>
        <Image src={icoNews} alt="hmm" width="18" height="18" />
        <CategoryHead>최신 업데이트</CategoryHead>
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
              return;
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
  height: 220px;
  grid-template-rows: repeat(2, 95px);
  grid-template-columns: repeat(auto-fill, 235px);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
  transform: ${({ curView }) => `translateX(-${curView * 1020}px)`};
  transition-duration: 0.5s;
`;
