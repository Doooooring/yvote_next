import { newsRepository } from '@repositories/news';

import { useRouterUtils } from '@/utils/hook/router/useRouterUtils';
import HeadMeta from '@components/common/HeadMeta';
import { NewsInView, NewsState, NewsType } from '@utils/interface/news';
import { getTextContentFromHtmlText } from '@utils/tools';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  CommonErrorView,
  ErrorComment,
  ErrorHead,
} from '../../../components/common/commonErrorBounbdary/commonErrorView';
import { Row, TextButton } from '../../../components/common/commonStyles';
import DefaultNewsLayout from '@components/news/types/default';
import BillNewsLayout from '@components/news/types/bill';
import ConstitutionNewsLayout from '@components/news/types/constitution';
import ExecutiveNewsLayout from '@components/news/types/executive';
import CabinetNewsLayout from '@components/news/types/cabinet';
import DiplomatNewsLayout from '@components/news/types/diplomat';
import GovernNewsLayout from '@components/news/types/govern';
import DebateNewsLayout from '@components/news/types/debate';
import ElectionNewsLayout from '@components/news/types/election';
import WeeklyNewsLayout from '@components/news/types/weekly';
import OthersNewsLayout from '@components/news/types/others';

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
  const router = useRouter();
  const {} = useRouterUtils();
  const { id, news, description } = data;

  const renderByType = () => {
    if (news.newsType === NewsType.bill) return <BillNewsLayout news={news} />;
    if (news.newsType === NewsType.constitution) return <ConstitutionNewsLayout news={news} />;
    if (news.newsType === NewsType.executive) return <ExecutiveNewsLayout news={news} />;
    if (news.newsType === NewsType.cabinet) return <CabinetNewsLayout news={news} />;
    if (news.newsType === NewsType.diplomat) return <DiplomatNewsLayout news={news} />;
    if (news.newsType === NewsType.govern) return <GovernNewsLayout news={news} />;
    if (news.newsType === NewsType.debate) return <DebateNewsLayout news={news} />;
    if (news.newsType === NewsType.election) return <ElectionNewsLayout news={news} />;
    if (news.newsType === NewsType.weekly) return <WeeklyNewsLayout news={news} />;
    if (news.newsType === NewsType.others) return <OthersNewsLayout news={news} />;
    return <DefaultNewsLayout news={news} />;
  };

  return (
    <>
      <HeadMeta
        {...{
          title: news?.title || '',
          description: news?.subTitle || '',
          image: news.newsImage,
          url: `https://yvoting.com/news/${news.id}`,
          type: 'article',
        }}
      />
      {news.state === NewsState.Published ? (
        renderByType()
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
