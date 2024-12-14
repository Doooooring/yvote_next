import NewsContent from '@components/news/newsContents';
import NewsRepository, { NewsDetail } from '@repositories/news';

import HeadMeta from '@components/common/HeadMeta';
import { HOST_URL } from '@public/assets/url';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getTextContentFromHtmlText } from '@utils/tools';

type AnswerState = 'left' | 'right' | 'none' | null;

interface getNewsContentResponse {
  news: NewsDetail | null;
}

interface pageProps {
  data: {
    id: string;
    news: NewsDetail | null;
    description: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIdArr: Array<{ _id: string }> = await NewsRepository.getNewsIds();
  const paths = newsIdArr.map((item: { _id: string }) => {
    return {
      params: { news: item['_id'] },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.news as string;
  const { news }: getNewsContentResponse = await NewsRepository.getNewsContent(id, null);
  const description = getTextContentFromHtmlText(news.summary)?.split('.')[0] ?? '';

  return {
    props: {
      data: {
        id,
        news,
        description: description,
      },
    },
    revalidate: 3600,
  };
};

export default function NewsDetailPage({ data }: pageProps) {
  const router = useRouter();
  const { id, news, description } = data;

  const hideNewsContent = useCallback(() => {
    router.push('/news');
  }, []);

  const metaTagsProps = useMemo(() => {
    return {
      title: news?.title || '',
      description: description,
      image: `${HOST_URL}/images/news/${news?._id}`,
      url: `https://yvoting.com/news/${id}`,
      type: 'article',
    };
  }, []);

  return (
    <>
      <HeadMeta {...metaTagsProps} />
      <Wrapper>
        <div className="main-contents">
          <div className="main-contents-body">
            <div className="news-contents-wrapper">
              <NewsContent newsContent={news!} voteHistory={null} hide={hideNewsContent} />
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  font-family: Helvetica, sans-serif;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .main-contents {
    width: 70%;
    min-width: 800px;
    @media screen and (max-width: 768px) {
      width: 98%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      height: 800px;
      font-size: 13px;
    }
  }
`;
