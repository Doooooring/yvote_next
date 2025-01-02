import HeadMeta from '@components/common/HeadMeta';
import { CommonLayoutBox } from '@components/common/commonStyles';
import CategoryGrid from '@components/keywords/categoryGrid';
import SearchBox from '@components/keywords/searchBox';
import { getKeywordsGroupByCategoryAndRecent } from '@controller';
import { KeywordCategory, KeywordToView } from '@utils/interface/keywords';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';

interface pageProps {
  data: Array<{
    category: KeywordCategory | 'recent';
    data: KeywordToView[];
  }>;
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const response = await getKeywordsGroupByCategoryAndRecent(20);
  console.log(response);
  return {
    props: {
      data: response,
    },
  };
};

export default function KeywordsPage({ data }: pageProps) {
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
        {data.map(({ category, data }) => {
          return <CategoryGrid category={category} keywords={data} />;
        })}
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
