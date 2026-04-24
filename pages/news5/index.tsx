import HeadMeta from '@components/common/HeadMeta';
import styled from 'styled-components';

/* news5 — Timeline Magazine (renamed from news9)
 * Editorial layout: hero cover + 2-column card grid below. Dummy data.
 */

const COVER = {
  id: 960,
  type: '예산',
  date: '4월 23일',
  title: '2026년 2차 추가경정예산 편성안',
  excerpt:
    '정부가 민생 지원을 위한 15조 원 규모의 추가경정예산안을 편성해 국회에 제출했다. 여야는 증액 규모와 세부 집행 계획을 놓고 이견을 보이고 있어 본회의 통과까지 진통이 예상된다.',
  camps: ['행정부', '국민의힘', '더불어민주당'],
};

const GRID = [
  { id: 958, type: '본회의', date: '4월 23일', title: '제410회 국회 임시회 제3차 본회의', excerpt: '형사소송법 개정안 등 8건의 법률안이 본회의에서 처리됐다.' },
  { id: 963, type: '법률', date: '4월 23일', title: '형사소송법 일부개정법률안(대안)', excerpt: '수사권 조정에 따른 보완 입법이 본회의를 통과했다.' },
  { id: 964, type: '국무회의', date: '4월 23일', title: '제16회 국무회의', excerpt: '시행령 개정안 5건, 법률공포안 12건이 의결됐다.' },
  { id: 962, type: '행정', date: '4월 23일', title: '정부 조직 개편안', excerpt: '부처 통폐합 관련 대통령령 개정안이 공개됐다.' },
  { id: 961, type: '북한', date: '4월 22일', title: '북한 탄도미사일 발사', excerpt: '평안북도 일대에서 단거리 탄도미사일 2발이 발사됐다.' },
  { id: 959, type: '시행령', date: '4월 22일', title: '개인정보 보호법 시행령 개정', excerpt: '자동 의사결정 대응권 도입과 관련된 세부 기준이 마련됐다.' },
];

export default function News5Page() {
  return (
    <>
      <HeadMeta title="와이보트 매거진" image="/assets/img/og_trump.jpg" />
      <Wrapper>
        <Masthead>
          <Brand>YVOTE</Brand>
          <Edition>2026년 4월 24일 · 어제까지의 정치 뉴스</Edition>
        </Masthead>

        <Cover>
          <CoverType>{COVER.type} · {COVER.date}</CoverType>
          <CoverTitle>{COVER.title}</CoverTitle>
          <CoverExcerpt>{COVER.excerpt}</CoverExcerpt>
          <CoverFooter>
            {COVER.camps.map((c) => (<CampChip key={c}>{c}</CampChip>))}
          </CoverFooter>
        </Cover>

        <GridSection>
          <GridLabel>더 읽기</GridLabel>
          <Grid>
            {GRID.map((item) => (
              <ArticleCard key={item.id}>
                <ArticleType>{item.type} · {item.date}</ArticleType>
                <ArticleTitle>{item.title}</ArticleTitle>
                <ArticleExcerpt>{item.excerpt}</ArticleExcerpt>
              </ArticleCard>
            ))}
          </Grid>
        </GridSection>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #faf8f3;
  padding: 40px 0 80px;
`;
const Masthead = styled.header`
  max-width: 1100px; margin: 0 auto;
  padding: 20px 32px;
  border-bottom: 2px solid #111;
  display: flex; align-items: baseline; justify-content: space-between;
  @media (max-width: 768px) { padding: 16px; flex-direction: column; align-items: flex-start; gap: 4px; }
`;
const Brand = styled.div`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 32px; font-weight: 900; letter-spacing: -0.05em;
  color: #111;
`;
const Edition = styled.div`
  font-family: Georgia, serif; font-style: italic;
  font-size: 13px; color: #555;
`;
const Cover = styled.section`
  max-width: 1100px; margin: 36px auto 40px;
  padding: 0 32px;
  @media (max-width: 768px) { padding: 0 16px; margin: 24px auto; }
`;
const CoverType = styled.div`
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: #b22234; font-weight: 700;
  margin-bottom: 12px;
`;
const CoverTitle = styled.h1`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 48px; font-weight: 800;
  color: #111; margin: 0 0 16px;
  letter-spacing: -0.04em; line-height: 1.1;
  @media (max-width: 768px) { font-size: 30px; }
`;
const CoverExcerpt = styled.p`
  font-family: Georgia, serif;
  font-size: 18px; line-height: 1.55;
  color: #333; margin: 0 0 20px;
  max-width: 780px;
  @media (max-width: 768px) { font-size: 15px; }
`;
const CoverFooter = styled.div` display: flex; gap: 8px; `;
const CampChip = styled.span`
  font-size: 12px;
  background: #111; color: #fff;
  padding: 4px 10px; border-radius: 3px;
`;
const GridSection = styled.section`
  max-width: 1100px; margin: 0 auto;
  padding: 0 32px;
  border-top: 1px solid #111;
  @media (max-width: 768px) { padding: 0 16px; }
`;
const GridLabel = styled.h2`
  font-family: Georgia, serif; font-style: italic;
  font-size: 14px; color: #555;
  margin: 20px 0 16px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 16px; }
`;
const ArticleCard = styled.article`
  border-top: 1px solid #111;
  padding-top: 14px;
  cursor: pointer;
  &:hover h3 { color: #b22234; }
`;
const ArticleType = styled.div`
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: #888; margin-bottom: 6px;
`;
const ArticleTitle = styled.h3`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 20px; font-weight: 700;
  color: #111; margin: 0 0 8px;
  letter-spacing: -0.02em; line-height: 1.25;
  transition: color 0.15s;
`;
const ArticleExcerpt = styled.p`
  font-family: Georgia, serif;
  font-size: 14px; line-height: 1.5;
  color: #444; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`;
