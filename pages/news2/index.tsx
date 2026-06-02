import { useState } from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import LoadingCommon from '@/components/common/loading';
import { newsRepository } from '@/repositories/news';
import CommentTypeIcon from '@components/common/CommentTypeIcon';
import HeadMeta from '@components/common/HeadMeta';
import { useQuery } from '@tanstack/react-query';
import { useCommentModal_Preview } from '@utils/hook/news/useCommentModal_NewsPreview';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import {
  commentType,
  NewsState,
  NewsType,
  newsTypesToKor,
  newsTypesToKorFull,
  Preview,
} from '@utils/interface/news';

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: CURRENT_YEAR - 2021 }, (_, i) => CURRENT_YEAR - i);

const TYPE_ORDER: NewsType[] = [
  NewsType.weekly,
  NewsType.govern,
  NewsType.bill,
  NewsType.cabinet,
  NewsType.plenary,
  NewsType.diplomat,
  NewsType.debate,
  NewsType.executive,
  NewsType.election,
  NewsType.budget,
  NewsType.economics,
  NewsType.specialcounsel,
  NewsType.northkorea,
  NewsType.investigation,
  NewsType.constitution,
  NewsType.others,
];

interface pageProps {
  origin: string;
}

export const getServerSideProps: GetServerSideProps<pageProps> = async (context) => {
  const proto = (context.req.headers['x-forwarded-proto'] as string) || 'https';
  const host = context.req.headers.host || 'yvoting.com';
  return { props: { origin: `${proto}://${host}` } };
};

export default function News2Page(props: pageProps) {
  const showNewsContent = useNewsNavigate();
  const { showCommentModal } = useCommentModal_Preview();
  const [year, setYear] = useState(CURRENT_YEAR);

  const { data: grouped, isFetching } = useQuery({
    queryKey: ['news2-spotlight', year],
    queryFn: async () => {
      const previews = await newsRepository.getPreviews(
        0,
        9999,
        NewsState.Published,
        `${year}-01-01`,
        `${year}-12-31`,
      );
      const map = new Map<NewsType, Preview[]>();
      for (const p of previews) {
        const list = map.get(p.newsType) || [];
        list.push(p);
        map.set(p.newsType, list);
      }
      return map;
    },
  });

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate(),
    ).padStart(2, '0')}`;
  };

  const activeTypes = TYPE_ORDER.filter((t) => grouped?.has(t));

  return (
    <>
      <HeadMeta title="뉴스 목록" url={`${props.origin}/news2`} image="/assets/img/og_trump.jpg" />
      <Wrapper>
        <PageHeader>
          <HeaderRow>
            <PageTitle>뉴스</PageTitle>
            <YearSelect value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </YearSelect>
          </HeaderRow>
        </PageHeader>

        {isFetching && !grouped && (
          <LoadingWrapper>
            <LoadingCommon comment="" fontColor="black" />
          </LoadingWrapper>
        )}

        {activeTypes.map((type) => {
          const items = grouped!.get(type) || [];
          return (
            <TypeRow key={type}>
              <RowHeader>
                <RowTitle>{newsTypesToKorFull(type)}</RowTitle>
                <RowCount>{items.length}</RowCount>
              </RowHeader>
              <Carousel>
                <CarouselTrack $single={items.length === 1}>
                  {items.map((item) => (
                    <SpotlightCard key={item.id} onClick={() => showNewsContent(item.id)}>
                      <CardTitle>{item.title}</CardTitle>
                      {item.subTitle && <CardSub>{item.subTitle}</CardSub>}
                      <CardFooter>
                        <CardDate>{formatDate(item.date)}</CardDate>
                        {item.comments && item.comments.length > 0 && (
                          <CardIcons
                            onClick={(e) => {
                              e.stopPropagation();
                              showCommentModal(
                                item.id,
                                item.comments as commentType[],
                                undefined,
                                item.title,
                                { disableCategorize: item.newsType === 'budget' },
                              );
                            }}
                          >
                            {item.comments.map((c, ci) => (
                              <CommentTypeIcon key={ci} type={c as commentType} size={13} />
                            ))}
                          </CardIcons>
                        )}
                      </CardFooter>
                    </SpotlightCard>
                  ))}
                </CarouselTrack>
              </Carousel>
            </TypeRow>
          );
        })}
      </Wrapper>
    </>
  );
}

/* ===== Layout ===== */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px 0 80px;
  background-color: ${({ theme }) => theme.colors.yvote02};

  @media (max-width: 768px) {
    padding: 0 0 80px;
  }
`;

const PageHeader = styled.header`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 24px;

  @media (max-width: 768px) {
    padding: 20px 16px 16px;
  }
`;

const PageTitle = styled.h1`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
  letter-spacing: -0.03em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const YearSelect = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  background: ${({ theme }) => theme.colors.yvote02};
  color: ${({ theme }) => theme.colors.yvote12};
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const LoadingWrapper = styled.div`
  padding: 60px 0;
`;

/* ===== Type Row ===== */

const TypeRow = styled.section`
  margin-bottom: 28px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const RowHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 10px;

  @media (max-width: 768px) {
    padding: 0 16px 8px;
  }
`;

const RowTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const RowCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
`;

/* ===== Carousel ===== */

const Carousel = styled.div`
  overflow: hidden;
`;

const CarouselTrack = styled.div<{ $single?: boolean }>`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 0 24px 4px;
  ${({ $single }) => $single && 'padding-left: 0;'}
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 10px;
    padding: 0 16px 4px;
    ${({ $single }) => $single && 'padding-left: 0;'}
  }
`;

/* ===== Spotlight Card ===== */

const SpotlightCard = styled.article`
  flex-shrink: 0;
  width: 260px;
  min-height: 140px;
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.yvote08};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 768px) {
    width: 220px;
    min-height: 120px;
    padding: 14px;
  }
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.45;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CardSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
  line-height: 1.4;
  margin: 6px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const CardDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

const CardIcons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  filter: saturate(0.3) brightness(1.15);
`;
