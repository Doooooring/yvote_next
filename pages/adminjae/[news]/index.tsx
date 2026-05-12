import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import LoadingCommon from '@components/common/loading';
import { renderNewsByType } from '@components/news/types';
import { newsRepository } from '@repositories/news';
import { useMount } from '@utils/hook/useMount';
import { NewsInView } from '@utils/interface/news';

interface pageProps {
  data: {
    id: number;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIdArr: Array<{ id: number }> = await newsRepository.getNewsIds();
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
  const { id } = data;

  useMount(async () => {
    const news = await newsRepository.getNewsContent(Number(id), null);
    setNews(news);
  });

  if (!news) return <LoadingCommon comment={'기다려주세요~'} />;
  return renderNewsByType(news);
}
