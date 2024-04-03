import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import CategoryGrid from '@components/keywords/categoryGrid';
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
      <div className="search-wrapper">
        <SearchBox />
      </div>
      <GridContainer>
        <CategoryGrid
          category={'recent'}
          keywords={recentKeywords}
          setKeywords={setRecentKeywords}
        />
        <CategoryGrid
          category={'organization'}
          keywords={keywordInOrganization}
          setKeywords={setkeywordInOrganization}
        />
        <CategoryGrid
          category={'politics'}
          keywords={keywordInPolitics}
          setKeywords={setKeywordInPolitics}
        />
        <CategoryGrid
          category={'economics'}
          keywords={keywordInEconomy}
          setKeywords={setKeywordInEconomy}
        />
        <CategoryGrid
          category={'social'}
          keywords={keywordInSocial}
          setKeywords={setKeywordInSocial}
        />
        {/* <CategoryGrid
          category={'policy'}
          keywords={keywordInPolicy}
          setKeywords={setKeywordInPolicy}
        /> */}
        {/* <CategoryGrid
          category={'human'}
          keywords={keywordInHuman}
          setKeywords={setKeywordInHuman}
        /> */}
        {/* <CategoryGrid category={'etc'} keywords={keywordInEtc} setKeywords={setKeywordInEtc} /> */}
      </GridContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Helvetica, sans-serif;
  box-sizing: inherit;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  margin-bottom: 50px;
  background-color: rgb(242, 242, 242);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .search-wrapper {
    display: flex;
    width: 70%;
    min-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 30px -20px;
    position: relative;
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0 0 20px 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  min-width: 800px;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0;
  }
`;
