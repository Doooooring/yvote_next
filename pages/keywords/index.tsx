import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import CategoryGrid from '@components/keywords/categoryGrid';
import RecentCategoryGrid from '@components/keywords/recentCategoryGrid';
import SearchBox from '@components/keywords/searchBox';
import KeywordRepository, { getKeywordsResponse, otherObject } from '@repositories/keywords';
import { KeywordToView } from '@utils/interface/keywords';
import { GetServerSideProps } from 'next';

interface pageProps {
  data: {
    recent: KeywordToView[];
    other: otherObject[];
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const response: getKeywordsResponse = await KeywordRepository.getKeywords();
  const { recent, other } = response.keywords;
  const data = { recent, other };
  return {
    props: {
      data,
    },
  };
};

export default function KeywordsPage({ data }: pageProps) {
  const [recentKeywords, setRecentKeywords] = useState<Array<KeywordToView>>(data.recent);
  const [keywordInHuman, setKeywordInHuman] = useState<Array<KeywordToView>>([]);
  const [keywordInEconomy, setKeywordInEconomy] = useState<Array<KeywordToView>>([]);
  const [keywordInOrganization, setkeywordInOrganization] = useState<Array<KeywordToView>>([]);
  const [keywordInPolicy, setKeywordInPolicy] = useState<Array<KeywordToView>>([]);
  const [keywordInPolitics, setKeywordInPolitics] = useState<Array<KeywordToView>>([]);
  const [keywordInSocial, setKeywordInSocial] = useState<Array<KeywordToView>>([]);
  const [keywordInEtc, setKeywordInEtc] = useState<Array<KeywordToView>>([]);

  const setStateMap = useMemo(() => {
    return {
      human: setKeywordInHuman,
      economics: setKeywordInEconomy,
      organization: setkeywordInOrganization,
      policy: setKeywordInPolicy,
      politics: setKeywordInPolitics,
      social: setKeywordInSocial,
      etc: setKeywordInEtc,
    };
  }, []);

  useEffect(() => {
    data.other.forEach((comp) => {
      const { _id, keywords } = comp;
      const setState: Dispatch<SetStateAction<KeywordToView[]>> = setStateMap[_id];
      setState(keywords);
    });
  }, []);

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBox />
        <SpeechBubble />
      </SearchWrapper>
      <GridContainer>
        <RecentCategoryGrid keywords={recentKeywords} setKeywords={setRecentKeywords} />
        <CategoryGrid
          category={'economics'}
          keywords={keywordInEconomy}
          setKeywords={setKeywordInEconomy}
        />
        <CategoryGrid
          category={'organization'}
          keywords={keywordInOrganization}
          setKeywords={setkeywordInOrganization}
        />
        <CategoryGrid
          category={'policy'}
          keywords={keywordInPolicy}
          setKeywords={setKeywordInPolicy}
        />
        <CategoryGrid
          category={'politics'}
          keywords={keywordInPolitics}
          setKeywords={setKeywordInPolitics}
        />
        <CategoryGrid
          category={'social'}
          keywords={keywordInSocial}
          setKeywords={setKeywordInSocial}
        />
        <CategoryGrid
          category={'human'}
          keywords={keywordInHuman}
          setKeywords={setKeywordInHuman}
        />
        <CategoryGrid category={'etc'} keywords={keywordInEtc} setKeywords={setKeywordInEtc} />
      </GridContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
`;

const SearchWrapper = styled.div`
  position: relative;
  z-index: 999;
  width: 1000px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 30px -20px;
  margin-bottom: 40px;
  text-align: center;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
