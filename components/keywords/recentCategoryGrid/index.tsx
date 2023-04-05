import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import Image from 'next/image';

import icoNews from '@assets/img/ico_news.png';
import RecentKeywordBox from '@components/keywords/recentCategoryGrid/keywordBox';
import { KeywordToView } from '@utils/interface/keywords';

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
            <RecentKeywordBox key={keyword.keyword} keyword={keyword.keyword}></RecentKeywordBox>
          );
        })}
      </GridWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 190px);
  grid-row-gap: 20px;
  grid-column-gap: 12.5px;
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
