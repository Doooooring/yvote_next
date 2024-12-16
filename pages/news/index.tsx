import HeadMeta from '@components/common/HeadMeta';
import { CommonLayoutBox } from '@components/common/commonStyles';
import NewsList from '@components/news/newsLIst';
import SearchBox from '@components/news/searchBox';
import NewsRepository from '@repositories/news';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useMount } from '@utils/hook/useMount';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { Preview, commentType } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

type curPreviewsList = Preview[];

interface pageProps {
  data: Array<Preview>;
}

interface Article {
  writer: commentType;
  title: string;
  content: string;
  date: string;
  newsTitle: string;
  news_id: string;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  //const data: Array<Preview> = await NewsRepository.getPreviews(0, '');
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

const metaTagsProps = {
  title: '뉴스 모아보기',
  url: `https://yvoting.com/news`,
};

export default function NewsPage(props: pageProps) {
  const { page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews } =
    useFetchNewsPreviews(12);

  useMount(() => {
    fetchPreviews({ limit: 20 });
  });

  const showNewsContent = useNewsNavigate();

  return (
    <>
      <HeadMeta {...metaTagsProps} />
      <Wrapper>
        {/* <div className="articles-wrapper">
        <NewArticles list={} />
      </div> */}
        <SearchWrapper>
          <SearchBox page={page} fetchPreviews={fetchPreviews} />
        </SearchWrapper>
        <div className="main-contents">
          <div className="main-contents-body">
            <NewsList
              page={page}
              previews={previews.length == 0 ? props.data : previews}
              isRequesting={isRequesting}
              fetchPreviews={fetchNextPreviews}
              showNewsContent={showNewsContent}
            />
          </div>
        </div>
      </Wrapper>
    </>
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
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 50px;
  background-color: rgb(242, 242, 242);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .articles-wrapper {
    display: flex;
    width: 70%;
    min-width: 800px;
    position: relative;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-header-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    height: 15px;
    .main-header {
      width: 70%;
      min-width: 800px;
      text-align: left;
      padding-left: 10px;
      .category-name {
        display: inline;
        width: 70%;
        margin-left: 10px;
        font-weight: 700;
        font-size: 18px;
        @media screen and (max-width: 768px) {
          width: 90%;
          min-width: 0px;
        }
      }
    }
  }

  .main-contents {
    -webkit-text-size-adjust: none;
    width: 70%;
    min-width: 800px;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;

    @media screen and (max-width: 768px) {
      width: 98%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      height: 800px;
      font-size: 13px;
    }
  }
`;

const SearchWrapper = styled(CommonLayoutBox)`
  display: flex;
  width: 70%;
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
    width: 90%;
    min-width: 0px;
  }
`;
