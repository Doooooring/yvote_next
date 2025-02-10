import NewsContent from '@components/news/newsContents';
import NewsRepository from '@repositories/news';

import HeadMeta from '@components/common/HeadMeta';
import { NewsInView } from '@utils/interface/news';
import { getTextContentFromHtmlText } from '@utils/tools';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useRouter } from '@utils/hook/useRouter/useRouter';

type AnswerState = 'left' | 'right' | 'none' | null;

interface pageProps {
  data: {
    id: string;
    news: NewsInView;
    description: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIdArr = await NewsRepository.getNewsIds();
  const paths = newsIdArr.map((item) => {
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
  const id = context.params!.news;
  if (!id) throw Error('static props null');
  const news = await NewsRepository.getNewsContent(Number(id), null);
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
  const { router, getCurrentPageId } = useRouter();
  const { id, news, description } = data;

  const hideNewsContent = useCallback(() => {
    if (getCurrentPageId() === 0) {
      router.push('/news');
    } else {
      router.back();
    }
  }, [router]);

  const metaTagsProps = useMemo(() => {
    return {
      title: news?.title || '',
      description: description,
      image: news.newsImage,
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
      font-size: 13px;
    }
  }
`;
