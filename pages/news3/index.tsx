import HeadMeta from '@components/common/HeadMeta';
import LoadingCommon from '@/components/common/loading';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { useCommentModal_Preview } from '@utils/hook/news/useCommentModal_NewsPreview';
import { NewsType, NewsState, Preview, newsTypesToKorFull, commentType } from '@utils/interface/news';
import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { newsRepository } from '@/repositories/news';
import { GetServerSideProps } from 'next';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import styled from 'styled-components';

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: CURRENT_YEAR - 2021 }, (_, i) => CURRENT_YEAR - i);

interface pageProps {
  origin: string;
}

export const getServerSideProps: GetServerSideProps<pageProps> = async (context) => {
  const proto = (context.req.headers['x-forwarded-proto'] as string) || 'https';
  const host = context.req.headers.host || 'yvoting.com';
  return { props: { origin: `${proto}://${host}` } };
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function News3Page(props: pageProps) {
  const showNewsContent = useNewsNavigate();
  const { showCommentModal } = useCommentModal_Preview();
  const [year, setYear] = useState(CURRENT_YEAR);

  const { data: previews, isFetching } = useQuery({
    queryKey: ['news3-frontpage', year],
    queryFn: () => newsRepository.getPreviews(
      0, 9999, '', NewsState.Published,
      `${year}-01-01`, `${year}-12-31`,
    ),
  });

  const sorted = useMemo(() => {
    if (!previews) return [];
    return [...previews].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  }, [previews]);

  const hero = sorted[0];
  const secondary = sorted.slice(1, 4);
  const tertiary = sorted.slice(4, 10);
  const rest = sorted.slice(10);

  const grouped = useMemo(() => {
    const map = new Map<NewsType, Preview[]>();
    for (const p of rest) {
      const list = map.get(p.newsType) || [];
      list.push(p);
      map.set(p.newsType, list);
    }
    return map;
  }, [rest]);

  const onIcons = (e: React.MouseEvent, item: Preview) => {
    e.stopPropagation();
    if (item.comments?.length) {
      showCommentModal(item.id, item.comments as commentType[], undefined, item.title);
    }
  };

  return (
    <>
      <HeadMeta title="뉴스 프론트" url={`${props.origin}/news3`} image="/assets/img/og_trump.jpg" />
      <Wrapper>
        <Masthead>
          <MastheadInner>
            <MastheadTitle>yVote 뉴스</MastheadTitle>
            <MastheadRight>
              <YearSelect value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {AVAILABLE_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </YearSelect>
            </MastheadRight>
          </MastheadInner>
          <MastheadRule />
        </Masthead>

        {isFetching && !sorted.length && (
          <LoadingWrapper><LoadingCommon comment="" fontColor="black" /></LoadingWrapper>
        )}

        {hero && (
          <Content>
            <HeroSection>
              <HeroArticle onClick={() => showNewsContent(hero.id)}>
                <HeroCategory>{newsTypesToKorFull(hero.newsType)}</HeroCategory>
                <HeroTitle>{hero.title}</HeroTitle>
                {hero.subTitle && <HeroSub>{hero.subTitle}</HeroSub>}
                <HeroMeta>
                  <span>{formatDate(hero.date)}</span>
                  {hero.comments && hero.comments.length > 0 && (
                    <IconRow onClick={(e) => onIcons(e, hero)}>
                      {hero.comments.map((c, i) => (
                        <CommentTypeIcon key={i} type={c as commentType} size={14} />
                      ))}
                    </IconRow>
                  )}
                </HeroMeta>
              </HeroArticle>

              <SecondaryColumn>
                {secondary.map((item) => (
                  <SecondaryArticle key={item.id} onClick={() => showNewsContent(item.id)}>
                    <SecCategory>{newsTypesToKorFull(item.newsType)}</SecCategory>
                    <SecTitle>{item.title}</SecTitle>
                    <SecMeta>
                      <span>{formatDate(item.date)}</span>
                      {item.comments && item.comments.length > 0 && (
                        <IconRow onClick={(e) => onIcons(e, item)}>
                          {item.comments.map((c, i) => (
                            <CommentTypeIcon key={i} type={c as commentType} size={12} />
                          ))}
                        </IconRow>
                      )}
                    </SecMeta>
                  </SecondaryArticle>
                ))}
              </SecondaryColumn>
            </HeroSection>

            <Rule />

            {tertiary.length > 0 && (
              <>
                <TertiaryGrid>
                  {tertiary.map((item) => (
                    <TertiaryArticle key={item.id} onClick={() => showNewsContent(item.id)}>
                      <TerCategory>{newsTypesToKorFull(item.newsType)}</TerCategory>
                      <TerTitle>{item.title}</TerTitle>
                      {item.subTitle && <TerSub>{item.subTitle}</TerSub>}
                      <TerMeta>
                        <span>{formatDate(item.date)}</span>
                        {item.comments && item.comments.length > 0 && (
                          <IconRow onClick={(e) => onIcons(e, item)}>
                            {item.comments.map((c, i) => (
                              <CommentTypeIcon key={i} type={c as commentType} size={12} />
                            ))}
                          </IconRow>
                        )}
                      </TerMeta>
                    </TertiaryArticle>
                  ))}
                </TertiaryGrid>
                <Rule />
              </>
            )}

            {Array.from(grouped.entries()).map(([type, items]) => (
              <SectionBlock key={type}>
                <SectionTitle>{newsTypesToKorFull(type)}</SectionTitle>
                <SectionGrid>
                  {items.map((item) => (
                    <CompactArticle key={item.id} onClick={() => showNewsContent(item.id)}>
                      <CompactTitle>{item.title}</CompactTitle>
                      <CompactMeta>
                        <span>{formatDate(item.date)}</span>
                        {item.comments && item.comments.length > 0 && (
                          <IconRow onClick={(e) => onIcons(e, item)}>
                            {item.comments.map((c, i) => (
                              <CommentTypeIcon key={i} type={c as commentType} size={11} />
                            ))}
                          </IconRow>
                        )}
                      </CompactMeta>
                    </CompactArticle>
                  ))}
                </SectionGrid>
                <Rule />
              </SectionBlock>
            ))}
          </Content>
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.yvote01};
`;

const Masthead = styled.header`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 24px 0;

  @media (max-width: 768px) {
    padding: 16px 16px 0;
  }
`;

const MastheadInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const MastheadTitle = styled.h1`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.yvote12};
  letter-spacing: -0.04em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const MastheadRight = styled.div`
  display: flex;
  align-items: center;
`;

const YearSelect = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  background: ${({ theme }) => theme.colors.yvote01};
  color: ${({ theme }) => theme.colors.yvote12};
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const MastheadRule = styled.div`
  height: 3px;
  background: ${({ theme }) => theme.colors.yvote12};
`;

const LoadingWrapper = styled.div`
  padding: 60px 0;
`;

const Content = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 24px 80px;

  @media (max-width: 768px) {
    padding: 16px 16px 80px;
  }
`;

const Rule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 16px 0;
  }
`;

const IconRow = styled.div`
  display: inline-flex;
  gap: 3px;
  align-items: center;
  filter: saturate(0.3) brightness(1.15);
  cursor: pointer;
`;

/* ===== Hero ===== */

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const HeroArticle = styled.article`
  cursor: pointer;
  padding-right: 24px;
  border-right: 1px solid ${({ theme }) => theme.colors.yvote04};

  @media (max-width: 768px) {
    padding-right: 0;
    border-right: none;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  }
`;

const HeroCategory = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const HeroTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.3;
  margin: 6px 0 10px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 21px;
  }
`;

const HeroSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote08};
  line-height: 1.55;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

/* ===== Secondary ===== */

const SecondaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

const SecondaryArticle = styled.article`
  cursor: pointer;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:last-child {
    border-bottom: none;
  }
`;

const SecCategory = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const SecTitle = styled.h3`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 3px 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const SecMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

/* ===== Tertiary ===== */

const TertiaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TertiaryArticle = styled.article`
  cursor: pointer;
  padding: 0 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:first-child {
    padding-left: 0;
  }

  &:last-child,
  &:nth-child(3n) {
    border-right: none;
    padding-right: 0;
  }

  @media (max-width: 768px) {
    &:nth-child(3n) {
      border-right: 1px solid ${({ theme }) => theme.colors.yvote04};
      padding-right: 16px;
    }
    &:nth-child(2n) {
      border-right: none;
      padding-right: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 10px 0;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
    &:last-child { border-bottom: none; }
  }
`;

const TerCategory = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const TerTitle = styled.h3`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 3px 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TerSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
  line-height: 1.4;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

/* ===== Section blocks ===== */

const SectionBlock = styled.section``;

const SectionTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.yvote12};
  display: inline-block;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px 16px;
  margin-bottom: 8px;
`;

const CompactArticle = styled.article`
  cursor: pointer;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const CompactTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CompactMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
  margin-top: 3px;
`;
