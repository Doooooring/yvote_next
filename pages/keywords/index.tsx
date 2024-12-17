import HeadMeta from '@components/common/HeadMeta';
import { CommonLayoutBox } from '@components/common/commonStyles';
import CategoryGrid from '@components/keywords/categoryGrid';
import SearchBox from '@components/keywords/searchBox';
import KeywordRepository, { getKeywordsResponse } from '@repositories/keywords';
import { KeywordToView } from '@utils/interface/keywords';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import styled from 'styled-components';

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

  const metaTagsProps = {
    title: '키워드 모아보기',
    url: `https://yvoting.com/keywords`,
  };

  return (
    <Wrapper>
      <HeadMeta {...metaTagsProps} />
      <SearchWrapper>
        <SearchBox />
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
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: 'Noto Sans KR', Helvetica, sans-serif;
  box-sizing: inherit;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SearchWrapper = styled(CommonLayoutBox)`
  display: flex;
  width: 10%;
  min-width: 800px;
  position: relative;
  -webkit-text-size-adjust: none;
  color: #666;
  text-align: center;
  margin: 0 0 20px 0;
  padding: 0;
  font: inherit;
  box-sizing: inherit;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 60%;
    min-width: 0px;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  height: auto;
  margin-bottom: 150px;
  min-width: 800px;
  @media screen and (max-width: 768px) {
    width: 98%;
    min-width: 0;
  }
`;
