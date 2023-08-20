import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import Image from 'next/image';

import icoNews from '@images/ico_news.png';
import { KeywordToView } from '@utils/interface/keywords';
import KeywordBox from '../categoryGrid/keywordBox';

interface RecentCategoryGridProps {
  keywords: Array<KeywordToView>;
  setKeywords: Dispatch<SetStateAction<Array<KeywordToView>>>;
}

export default function RecentCategoryGrid({ keywords, setKeywords }: RecentCategoryGridProps) {
  return (
    <Wrapper>
      <Header>
        <Image src={icoNews} alt="hmm" height="18" />
        <RecentCategoryHead>최신 업데이트</RecentCategoryHead>
      </Header>
      <GridWrapper>
        {keywords.map((keyword) => {
          return (
            <KeywordBox
              key={keyword.keyword}
              id={keyword._id}
              keyword={keyword.keyword}
              tail={false}
            ></KeywordBox>
          );
        })}
      </GridWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const GridWrapper = styled.div`
  display: grid;
  height: 220px;
  grid-template-rows: repeat(2, 95px);
  grid-template-columns: repeat(auto-fill, 235px);
  grid-auto-flow: column;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
  width: 1000px;
`;

const Header = styled.div`
  height: 30px;
`;

const RecentCategoryHead = styled.h2`
  display: inline;
  width: 1000px;
  margin-left: 10px;
  font-weight: 700;
  font-size: 18px;
`;
