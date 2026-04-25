import { newsRepository } from '@repositories/news';

import { useRouterUtils } from '@/utils/hook/router/useRouterUtils';
import { useChatContext } from '@/utils/context/chatContext';
import { useToastMessage } from '@/utils/hook/useToastMessage';
import HeadMeta from '@components/common/HeadMeta';
import { NewsInView, NewsState, NewsType, newsTypesToKorFull } from '@utils/interface/news';
import styled from 'styled-components';
import Link from 'next/link';
import { getTextContentFromHtmlText } from '@utils/tools';
import { shareLink } from '@utils/tools/share';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
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
import PlenaryNewsLayout from '@components/news/types/plenary';
import InvestigationNewsLayout from '@components/news/types/investigation';
import DiplomatNewsLayout from '@components/news/types/diplomat';
import GovernNewsLayout from '@components/news/types/govern';
import DebateNewsLayout from '@components/news/types/debate';
import ElectionNewsLayout from '@components/news/types/election';
import WeeklyNewsLayout from '@components/news/types/weekly';
import OthersNewsLayout from '@components/news/types/others';
import BudgetNewsLayout from '@components/news/types/budget';
import EconomicsNewsLayout from '@components/news/types/economics';

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

// Keep this in sync with pages/news/index.tsx (Kakao card 2-line cap).
const MAX_OG_TITLE_CHARS = 37;
function truncateTitle(s: string, max: number = MAX_OG_TITLE_CHARS): string {
  const trimmed = (s || '').trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 3).trimEnd() + '...';
}

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
  const { setActiveContent } = useChatContext();
  const { show: showToast } = useToastMessage();

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined'
      ? window.location.href
      : `https://yvoting.com/news/${id}`;
    // URL only — no title/subtitle in share payload.
    const result = await shareLink({ url });
    if (result === 'copied') {
      showToast('링크가 복사되었습니다', 2000, { direction: 'bottom' });
    } else if (result === 'failed') {
      showToast('공유에 실패했습니다', 2000, { direction: 'bottom' });
    }
  }, [id, showToast]);

  useEffect(() => {
    if (!news) return;
    const parts = [
      `[${news.title}](/news/${id}) 열람 중`,
      news.subTitle ? `부제: ${news.subTitle}` : '',
      `날짜: ${news.date} | 타입: ${news.newsType}`,
      news.summary ? `요약: ${news.summary.slice(0, 500)}` : '',
      news.comments?.length ? `코멘트 타입: ${(news.comments as any[]).join(', ')}` : '',
    ].filter(Boolean);
    setActiveContent(parts.join('\n'));
    return () => setActiveContent(null);
  }, [id, news]);

  const renderByType = () => {
    if (news.newsType === NewsType.bill) return <BillNewsLayout news={news} />;
    if (news.newsType === NewsType.constitution) return <ConstitutionNewsLayout news={news} />;
    if (news.newsType === NewsType.executive) return <ExecutiveNewsLayout news={news} />;
    if (news.newsType === NewsType.cabinet) return <CabinetNewsLayout news={news} />;
    if (news.newsType === NewsType.plenary) return <PlenaryNewsLayout news={news} />;
    if (news.newsType === NewsType.investigation) return <InvestigationNewsLayout news={news} />;
    if (news.newsType === NewsType.diplomat) return <DiplomatNewsLayout news={news} />;
    if (news.newsType === NewsType.govern) return <GovernNewsLayout news={news} />;
    if (news.newsType === NewsType.debate) return <DebateNewsLayout news={news} />;
    if (news.newsType === NewsType.election) return <ElectionNewsLayout news={news} />;
    if (news.newsType === NewsType.weekly) return <WeeklyNewsLayout news={news} />;
    if (news.newsType === NewsType.others) return <OthersNewsLayout news={news} />;
    if (news.newsType === NewsType.budget) return <BudgetNewsLayout news={news} />;
    if (news.newsType === NewsType.economics) return <EconomicsNewsLayout news={news} />;
    return <DefaultNewsLayout news={news} />;
  };

  return (
    <>
      <HeadMeta
        {...{
          title: truncateTitle(news?.title || ''),
          description: news?.subTitle || '',
          image: '/assets/img/og_trump.jpg',
          url: `https://yvoting.com/news/${news.id}`,
          type: 'article',
        }}
      />
      {news.state === NewsState.Published ? (
        <>
          <ArticleNav>
            <BackLink href="/news">← 뉴스 모아보기</BackLink>
            <NavSep aria-hidden>›</NavSep>
            <NavLabel>{newsTypesToKorFull(news.newsType)}</NavLabel>
            <ShareButton type="button" onClick={handleShare} aria-label="이 뉴스 공유">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>공유</span>
            </ShareButton>
          </ArticleNav>
          <ArticleFrame>
            {renderByType()}
          </ArticleFrame>
        </>
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

const ArticleNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 20px 4% 12px;
  font-size: 13px;

  @media (max-width: 768px) {
    padding: 14px 2% 10px;
    font-size: 12px;
  }
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.yvote08};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
  }
`;

const NavSep = styled.span`
  color: ${({ theme }) => theme.colors.yvote06};
`;

const NavLabel = styled.span`
  color: ${({ theme }) => theme.colors.yvote09};
  font-weight: 500;
`;

const ShareButton = styled.button`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote09};
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  line-height: 1;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
    background: ${({ theme }) => theme.colors.yvote02};
    border-color: ${({ theme }) => theme.colors.yvote08};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.yvote08};
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }
    padding: 6px;
  }
`;

const ArticleFrame = styled.article`
  width: 100%;
  border-top: 3px solid ${({ theme }) => theme.colors.yvote12};

  @media (max-width: 768px) {
    border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  }
`;
