import NewsContent from '@components/news/newsContents';
import NewsRepository, { NewsDetail } from '@repositories/news';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import styled from 'styled-components';

type AnswerState = 'left' | 'right' | 'none' | null;

interface getNewsContentResponse {
  response: AnswerState;
  news: NewsDetail | null;
}

interface pageProps {
  data: {
    id: string;
    response: AnswerState;
    news: NewsDetail | null;
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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.news as string;
  const { response: voteResponse, news }: getNewsContentResponse =
    await NewsRepository.getNewsContent(id, null);

  return {
    props: {
      data: {
        id,
        response: voteResponse,
        news,
      },
    },
    revalidate: 20,
  };
};

export default function NewsDetailPage({ data }: pageProps) {
  const router = useRouter();
  const { id, response, news } = data;

  const hideNewsContent = useCallback(() => {
    router.push('/news');
  }, []);

  return (
    <Wrapper>
      <div className="main-contents">
        <div className="main-contents-body">
          <div className="news-contents-wrapper">
            <NewsContent
              curClicked={id}
              newsContent={news!}
              voteHistory={response}
              hide={hideNewsContent}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);

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
