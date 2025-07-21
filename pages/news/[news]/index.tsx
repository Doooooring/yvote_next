import NewsContent from '@components/news/newsContents';
import { newsRepository } from '@repositories/news';

import HeadMeta from '@components/common/HeadMeta';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { NewsInView, NewsState } from '@utils/interface/news';
import { getTextContentFromHtmlText } from '@utils/tools';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  CommonErrorView,
  ErrorComment,
  ErrorHead,
} from '../../../components/common/commonErrorBounbdary/commonErrorView';
import { Row, TextButton } from '../../../components/common/commonStyles';

type AnswerState = 'left' | 'right' | 'none' | null;

interface pageProps {
  data: {
    id: string;
    news: NewsInView;
    description: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIdArr = await newsRepository.getNewsIds();
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
  const news = await newsRepository.getNewsContent(Number(id), null);
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
  const { router, getCurrentPageIndex } = useRouter();
  const { id, news, description } = data;

  const hideNewsContent = useCallback(() => {
    if (getCurrentPageIndex() === 0) {
      router.push('/news');
    } else {
      router.back();
    }
  }, [router, getCurrentPageIndex]);

  const metaTagsProps = useMemo(() => {
    return {
      title: news?.title || '',
      description: news?.subTitle || '',
      image: news.newsImage,
      url: `https://yvoting.com/news/${news.id}`,
      type: 'article',
    };
  }, [news]);

  return (
    <>
      <HeadMeta {...metaTagsProps} />
      {news.state === NewsState.Published ? (
        <Wrapper>
          <div className="main-contents">
            <div className="main-contents-body">
              <div className="news-contents-wrapper">
                <NewsContent newsContent={news!} voteHistory={null} hide={hideNewsContent} />
              </div>
            </div>
          </div>
        </Wrapper>
      ) : (
        <CommonErrorView>
          <ErrorHead>현재 준비 중인 뉴스입니다.</ErrorHead>
          <ErrorComment>정확한 사실만을 전달하고자 노력하겠습니다.</ErrorComment>
          <Row style={{ gap: '8px' }}>
            <TextButton
              onClick={() => {
                router.back();
              }}
            >
              뒤로가기
            </TextButton>
            <TextButton
              onClick={() => {
                router.push('/news');
              }}
            >
              뉴스목록
            </TextButton>
          </Row>
        </CommonErrorView>
      )}
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
    width: 50%;
    min-width: 600px;
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
