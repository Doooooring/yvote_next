import NewsContent from '@components/news/newsContents';
import NewsRepository from '@repositories/news';

import HeadMeta from '@components/common/HeadMeta';
import { HOST_URL } from '@public/assets/url';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import LoadingCommon from '@components/common/loading';
import { useMount } from '@utils/hook/useMount';
import { NewsInView } from '@utils/interface/news';

type AnswerState = 'left' | 'right' | 'none' | null;

interface pageProps {
  data: {
    id: number;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIdArr: Array<{ id: number }> = await NewsRepository.getNewsIds();
  const paths = newsIdArr.map((item: { id: number }) => {
    return {
      params: { news: String(item['id']) },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.news as string;

  return {
    props: {
      data: {
        id,
      },
    },
    revalidate: 20,
  };
};

export default function NewsDetailPage({ data }: pageProps) {
  const [news, setNews] = useState<NewsInView | null>(null);
  const router = useRouter();
  const { id } = data;

  const hideNewsContent = useCallback(() => {
    router.push('/adminjae');
  }, []);

  useMount(async () => {
    const news = await NewsRepository.getNewsContent(Number(id), null);
    setNews(news);
  });

  return (
    <>
      <Wrapper>
        <div className="main-contents">
          <div className="main-contents-body">
            <div className="news-contents-wrapper">
              {news ? (
                <NewsContent newsContent={news!} voteHistory={null} hide={hideNewsContent} />
              ) : (
                <LoadingCommon comment={'기다려주세요~'} />
              )}
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
      width: 90%;
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
