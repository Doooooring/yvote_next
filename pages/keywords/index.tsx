import { useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import CategoryGrid from '@components/keywords/categoryGrid';
import SearchBox from '@components/keywords/searchBox';
import KeywordRepository, { getKeywordsResponse } from '@repositories/keywords';
import { KeywordToView } from '@utils/interface/keywords';
import { GetServerSideProps } from 'next';

interface pageProps {
  data: {
    recent: KeywordToView[];
    human: KeywordToView[];
    economics: KeywordToView[];
    organization: KeywordToView[];
    policy: KeywordToView[];
    politics: KeywordToView[];
    social: KeywordToView[];
    etc: KeywordToView[];
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const response: getKeywordsResponse = await KeywordRepository.getKeywords();
  const { recent, other } = response.keywords;
  const data = { recent } as any;
  other.forEach((o) => {
    const { _id, keywords } = o;
    data[_id] = keywords;
  });

  return {
    props: {
      data,
    },
  };
};

export default function KeywordsPage({ data }: pageProps) {
  const [recentKeywords, setRecentKeywords] = useState<Array<KeywordToView>>(data.recent);
  const [keywordInHuman, setKeywordInHuman] = useState<Array<KeywordToView>>(data.human);
  const [keywordInEconomy, setKeywordInEconomy] = useState<Array<KeywordToView>>(data.economics);
  const [keywordInOrganization, setkeywordInOrganization] = useState<Array<KeywordToView>>(
    data.organization,
  );
  const [keywordInPolicy, setKeywordInPolicy] = useState<Array<KeywordToView>>(data.policy);
  const [keywordInPolitics, setKeywordInPolitics] = useState<Array<KeywordToView>>(data.politics);
  const [keywordInSocial, setKeywordInSocial] = useState<Array<KeywordToView>>(data.social);
  const [keywordInEtc, setKeywordInEtc] = useState<Array<KeywordToView>>(data.etc);

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBox />
        <SpeechBubble />
      </SearchWrapper>
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
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 80px;
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
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
    margin-bottom: 20px;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 1rem;
  }
`;
