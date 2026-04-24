import HeadMeta from '@components/common/HeadMeta';
import styled from 'styled-components';

/* news4 — Morning Briefing
 * Hero (top-3) + per-newsType sections. Dummy data for design preview.
 */

type Item = {
  id: number;
  type: string;      // display label
  typeKey: string;   // grouping key
  date: string;
  title: string;
  subTitle?: string;
  camps: string[];
};

const HERO: Item[] = [
  { id: 960, type: '예산', typeKey: 'budget', date: '4월 23일',
    title: '2026년 2차 추가경정예산 편성안',
    subTitle: '15조 원 규모 · 여야 증액 폭 이견',
    camps: ['행정부', '국민의힘', '더불어민주당', '청와대'] },
  { id: 958, type: '본회의', typeKey: 'plenary', date: '4월 23일',
    title: '제410회 국회 임시회 제3차 본회의',
    camps: ['입법부', '국민의힘', '더불어민주당'] },
  { id: 963, type: '법률', typeKey: 'bill', date: '4월 23일',
    title: '형사소송법 일부개정법률안(대안)',
    camps: ['입법부', '국민의힘'] },
];

const BY_TYPE: { label: string; items: Item[] }[] = [
  { label: '주간', items: [
    { id: 953, type: '주간', typeKey: 'weekly', date: '4월 17일', title: '4월 3주차 대통령 일정', camps: ['청와대'] },
    { id: 946, type: '주간', typeKey: 'weekly', date: '4월 10일', title: '4월 2주차 정부 주요 동향', camps: ['청와대', '행정부'] },
  ]},
  { label: '행정', items: [
    { id: 962, type: '행정', typeKey: 'govern', date: '4월 23일', title: '정부 조직 개편안', camps: ['국민의힘', '더불어민주당'] },
  ]},
  { label: '법률', items: [
    { id: 951, type: '법률', typeKey: 'bill', date: '4월 17일', title: '반도체특별법 일부개정안 본회의 상정', camps: ['국민의힘', '더불어민주당'] },
  ]},
  { label: '국무회의', items: [
    { id: 964, type: '국무회의', typeKey: 'cabinet', date: '4월 23일', title: '제16회 국무회의', camps: ['청와대', '행정부'] },
    { id: 955, type: '국무회의', typeKey: 'cabinet', date: '4월 20일', title: '제15회 국무회의', camps: ['행정부', '국민의힘'] },
  ]},
  { label: '정상외교', items: [
    { id: 954, type: '정상외교', typeKey: 'diplomat', date: '4월 18일', title: '한·호주 정상회담 공동성명', camps: ['청와대'] },
  ]},
  { label: '논평', items: [
    { id: 957, type: '논평', typeKey: 'debate', date: '4월 20일', title: '부동산 대출 규제 강화안', camps: ['국민의힘', '더불어민주당'] },
    { id: 965, type: '논평', typeKey: 'debate', date: '4월 23일', title: '감사원 감찰 결과 보고', camps: ['국민의힘', '더불어민주당'] },
  ]},
  { label: '시행령', items: [
    { id: 959, type: '시행령', typeKey: 'executive', date: '4월 22일', title: '개인정보 보호법 시행령 개정', camps: ['청와대', '더불어민주당'] },
  ]},
  { label: '북한', items: [
    { id: 961, type: '북한', typeKey: 'northkorea', date: '4월 22일', title: '북한 탄도미사일 발사 관련', camps: ['청와대', '국민의힘'] },
  ]},
];

const CAMP_COLOR: Record<string, string> = {
  청와대: '#1a4480', 행정부: '#5b8def',
  국민의힘: '#e6123d', 더불어민주당: '#004ea2',
  입법부: '#6c757d',
};

export default function News4Page() {
  const totalCount = HERO.length + BY_TYPE.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <>
      <HeadMeta title="오늘의 브리핑" image="/assets/img/og_trump.jpg" />
      <Wrapper>
        <PageHeader>
          <PageEyebrow>어제까지의 뉴스</PageEyebrow>
          <PageTitle>오늘의 브리핑</PageTitle>
          <PageSub>4월 10일 – 4월 23일 · {totalCount}건</PageSub>
        </PageHeader>

        <HeroSection>
          <SectionLabel>주요 뉴스</SectionLabel>
          <HeroGrid>
            {HERO.map((p, i) => (
              <HeroCard key={p.id} $primary={i === 0}>
                <HeroType>{p.type}</HeroType>
                <HeroTitle $primary={i === 0}>{p.title}</HeroTitle>
                {p.subTitle && <HeroSub>{p.subTitle}</HeroSub>}
                <HeroFooter>
                  <HeroDate>{p.date}</HeroDate>
                  <HeroIcons>
                    {p.camps.map((c) => (
                      <CampDot key={c} title={c} style={{ background: CAMP_COLOR[c] || '#888' }} />
                    ))}
                  </HeroIcons>
                </HeroFooter>
              </HeroCard>
            ))}
          </HeroGrid>
        </HeroSection>

        {BY_TYPE.map((section) => (
          <TypeSection key={section.label}>
            <SectionLabel>
              {section.label} <Count>{section.items.length}</Count>
            </SectionLabel>
            <ItemList>
              {section.items.map((item) => (
                <ItemRow key={item.id}>
                  <ItemDate>{item.date}</ItemDate>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemIcons>
                    {item.camps.map((c) => (
                      <CampDotSm key={c} title={c} style={{ background: CAMP_COLOR[c] || '#888' }} />
                    ))}
                  </ItemIcons>
                </ItemRow>
              ))}
            </ItemList>
          </TypeSection>
        ))}
      </Wrapper>
    </>
  );
}

/* ===== Styles ===== */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 40px 0 80px;
  background-color: ${({ theme }) => theme.colors.yvote02};
  @media (max-width: 768px) { padding: 24px 0 80px; }
`;
const PageHeader = styled.header`
  max-width: 900px; margin: 0 auto;
  padding: 24px 24px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  @media (max-width: 768px) { padding: 16px 16px 20px; }
`;
const PageEyebrow = styled.div`
  font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yvote08};
  margin-bottom: 6px;
`;
const PageTitle = styled.h1`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 32px; font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  letter-spacing: -0.03em; margin: 0 0 8px;
  @media (max-width: 768px) { font-size: 24px; }
`;
const PageSub = styled.div`
  font-size: 13px; color: ${({ theme }) => theme.colors.yvote08};
`;
const HeroSection = styled.section`
  max-width: 900px; margin: 32px auto 20px;
  padding: 0 24px;
  @media (max-width: 768px) { padding: 0 16px; margin: 20px auto 12px; }
`;
const SectionLabel = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 18px; font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0 0 12px; letter-spacing: -0.02em;
`;
const Count = styled.span`
  font-size: 12px; font-weight: 400;
  color: ${({ theme }) => theme.colors.yvote07};
  margin-left: 6px;
`;
const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const HeroCard = styled.article<{ $primary?: boolean }>`
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 10px;
  padding: ${({ $primary }) => ($primary ? '22px' : '16px')};
  cursor: pointer;
  display: flex; flex-direction: column; gap: 8px;
  min-height: ${({ $primary }) => ($primary ? '200px' : '160px')};
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.yvote08};
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
`;
const HeroType = styled.div`
  font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yvote08};
`;
const HeroTitle = styled.h3<{ $primary?: boolean }>`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: ${({ $primary }) => ($primary ? '22px' : '16px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35; margin: 0; letter-spacing: -0.02em;
`;
const HeroSub = styled.p`
  font-size: 13px; line-height: 1.5;
  color: ${({ theme }) => theme.colors.yvote10};
  margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`;
const HeroFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; margin-top: auto;
`;
const HeroDate = styled.span`
  font-size: 12px; color: ${({ theme }) => theme.colors.yvote08};
`;
const HeroIcons = styled.div` display: flex; gap: 4px; align-items: center; `;
const CampDot = styled.span`
  width: 10px; height: 10px; border-radius: 50%; display: block;
`;
const TypeSection = styled.section`
  max-width: 900px; margin: 0 auto;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  @media (max-width: 768px) { padding: 14px 16px; }
`;
const ItemList = styled.div` display: flex; flex-direction: column; `;
const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center; gap: 12px;
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote03};
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.yvote02}; }
  @media (max-width: 768px) {
    grid-template-columns: 56px 1fr auto;
    gap: 8px;
  }
`;
const ItemDate = styled.span`
  font-size: 12px; color: ${({ theme }) => theme.colors.yvote08};
  font-variant-numeric: tabular-nums;
`;
const ItemTitle = styled.span`
  font-size: 14px; line-height: 1.4;
  color: ${({ theme }) => theme.colors.yvote13};
  @media (max-width: 768px) { font-size: 13px; }
`;
const ItemIcons = styled.div` display: flex; gap: 3px; `;
const CampDotSm = styled.span`
  width: 7px; height: 7px; border-radius: 50%; display: block;
`;
