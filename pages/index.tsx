import HeadMeta from '@components/common/HeadMeta';
import { commentTypeImg } from '@utils/interface/news/comment';
import Image from 'next/image';
import styled from 'styled-components';

/* ===== Dummy Data ===== */

const todayNews = [
  { summary: '제12회 임시국무회의에서 2027년도 예산안 편성지침 심의·의결, 전세사기 피해자 지원금 사업 추경 반영 예정', newsTitle: '제12회 임시국무회의', newsId: 942 },
  { summary: '중동 사태 장기화에 공공부문 차량 5부제 시행, 전 국민 에너지 절약 실천 요청', newsTitle: '2026년 4월 1주차', newsId: 953 },
  { summary: '이재명 대통령 부부 제주 4·3 평화공원 참배, 국가폭력 범죄 소멸시효 배제 입법 재추진', newsTitle: '2026년 4월 1주차', newsId: 953 },
  { summary: '국세청, 강남3구 포함 5호 이상 다주택 임대업자 세무조사 착수', newsTitle: '다주택자 규제', newsId: 749 },
  { summary: '통일부, 벨라루스 대통령 방북 통해 북-러-벨 3각 반서방 연대 강화 평가', newsTitle: '2026년 4월 1주차', newsId: 953 },
];

const partyPositions = [
  {
    party: '국민의힘',
    summary: '민주당의 상임위 100% 독식 선언을 일당 독재로 규탄하며, 중동 에너지 위기 대응을 단기 처방으로 비판하고 원전 재가동을 촉구. 천안함 유가족 사과 요구에 대한 대통령의 면박 발언을 굴종적 안보관으로 지적.',
  },
  {
    party: '더불어민주당',
    summary: '국민의힘 대구시장 공천 갈등에서 장동혁 대표의 탈당 방지 의혹 제기. 오세훈 서울시장의 한강버스 사업 반복 사고에 즉시 중단 요구. 조정훈 의원의 지방의원 돈 상납·책 강매 의혹에 수사 촉구.',
  },
];

const revivedNews = [
  { id: 749, title: '정부 도심 주택공급 확대 및 다주택자 규제', lastUpdate: '2026-03-30', originalDate: '2023-01-29',
    added: [{ type: '행정부', count: 1 }] },
  { id: 944, title: '중대재해처벌법', lastUpdate: '2026-03-30', originalDate: '2022-11-20',
    added: [{ type: '행정부', count: 1 }] },
  { id: 462, title: '화물연대 총파업', lastUpdate: '2026-03-30', originalDate: '2022-12-09',
    added: [{ type: '청와대', count: 1 }, { type: '국민의힘', count: 9 }, { type: '더불어민주당', count: 10 }] },
];



const ongoingVotes = [
  { id: 501, title: '간호법 재의결', status: '본회의 표결 예정', chamber: '국회', date: '2026-04-02' },
  { id: 502, title: '전세사기 특별법 개정안', status: '법사위 심사 중', chamber: '국회', date: '2026-04-01' },
];

const nextElection = {
  name: '제9회 전국동시지방선거',
  date: '2026-06-03',
  dday: 64,
};

const upcomingNews = [
  { id: 940, type: 'weekly', typeLabel: '주간', title: '2026년 3월 4주차', date: '2026-03-29', status: '작성 중' },
  { id: 615, type: 'weekly', typeLabel: '주간', title: '2022년 11월 5주차', date: '2022-12-04', status: '작성 중' },
  { id: 483, type: 'constitution', typeLabel: '헌재', title: '낙태죄 헌법불합치 결정', date: '2019-04-11', status: '작성 중' },
];

/* ===== Page ===== */

export default function Home() {
  return (
    <>
      <HeadMeta />
      <Wrapper>
        {/* 어제의 소식 */}
        <Section>
          <SectionTitle>어제의 소식 (내일 지움)</SectionTitle>
          <SectionSubtitle>2026년 3월 29일</SectionSubtitle>
          <Divider />
          <YesterdaySummary>
            서해수호의 날 기념식에서 55인 추모 및 보훈 확대 발표 · 전군주요지휘관회의에서 전작권 회복 주문 · 한강 작가 전미도서비평가협회상 수상 · 과기정통부, 물의 액체-액체 임계점 세계 최초 관측
          </YesterdaySummary>
        </Section>

        {/* 오늘의 소식 */}
        <Section>
          <SectionTitle>오늘의 소식 (내일 요약함)</SectionTitle>
          <SectionSubtitle>2026년 3월 30일</SectionSubtitle>
          <Divider />
          <TodayList>
            {todayNews.map((item, i) => (
              <TodayItem key={i}>
                <TodaySummary>{item.summary}</TodaySummary>
                <TodayNewsLink href={`/news/${item.newsId}`}>
                  {item.newsTitle} →
                </TodayNewsLink>
              </TodayItem>
            ))}
          </TodayList>
        </Section>

        {/* 정당별 최신 입장 */}
        <Section>
          <SectionTitle>정당별 요즘 하는 소리</SectionTitle>
          <Divider />
          <PartyGrid>
            {partyPositions.map((party) => (
              <PartyColumn key={party.party}>
                <PartyHeader>
                  <PartyIcon src={commentTypeImg(party.party as any)} alt={party.party} width={16} height={16} />
                  <PartyName>{party.party}</PartyName>
                </PartyHeader>
                <PartySummary>{party.summary}</PartySummary>
              </PartyColumn>
            ))}
          </PartyGrid>
        </Section>

        {/* 끌올뉴스 */}
        <Section>
          <SectionTitle>뒷북...이라 하면 안 되겠죠?</SectionTitle>
          <SectionSubtitle>오래된 뉴스에 새 코멘트가 추가되었습니다</SectionSubtitle>
          <Divider />
          <ListTable>
            {revivedNews.map((item) => (
              <ListRow key={item.id}>
                <ListTitle>{item.title}</ListTitle>
                <ListMeta>
                  <CommentTypeBadges>
                    {item.added.map((a, i) => (
                      <CommentTypeBadge key={i}>
                        <CommentTypeIconImg src={commentTypeImg(a.type as any)} alt={a.type} width={14} height={14} />
                        <span>+{a.count}</span>
                      </CommentTypeBadge>
                    ))}
                  </CommentTypeBadges>
                  <span>{item.originalDate}</span>
                </ListMeta>
              </ListRow>
            ))}
          </ListTable>
        </Section>

        {/* 진행중 표결 + 다음 선거 */}
        <TwoColumn>
          <Section style={{ flex: 2 }}>
            <SectionTitle>국회의원들 뭐하나...</SectionTitle>
            <Divider />
            <ListTable>
              {ongoingVotes.map((item) => (
                <ListRow key={item.id}>
                  <ListTitle>{item.title}</ListTitle>
                  <ListMeta>
                    <StatusBadge>{item.status}</StatusBadge>
                    <span>{item.date}</span>
                  </ListMeta>
                </ListRow>
              ))}
            </ListTable>
          </Section>

          <ElectionCard>
            <ElectionLabel>다음 선거</ElectionLabel>
            <ElectionName>{nextElection.name}</ElectionName>
            <ElectionDate>{nextElection.date}</ElectionDate>
            <ElectionDday>D-{nextElection.dday}</ElectionDday>
          </ElectionCard>
        </TwoColumn>

        {/* 예정된 뉴스 */}
        <Section>
          <SectionTitle>곧 올림...</SectionTitle>
          <SectionSubtitle>현재 작성 중인 뉴스입니다</SectionSubtitle>
          <Divider />
          <ListTable>
            {upcomingNews.map((item) => (
              <ListRow key={item.id}>
                <ListTitle>
                  <TypeTag>{item.typeLabel}</TypeTag>
                  {item.title}
                </ListTitle>
                <ListMeta>
                  <PendingBadge>{item.status}</PendingBadge>
                  <span>{item.date}</span>
                </ListMeta>
              </ListRow>
            ))}
          </ListTable>
        </Section>
      </Wrapper>
    </>
  );
}

/* ===== Styles ===== */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 60px;
  background-color: ${({ theme }) => theme.colors.yvote02};

  @media (max-width: 768px) {
    padding: 12px 0 40px;
  }
`;

const Section = styled.section`
  width: 92%;
  max-width: 1200px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    width: 96%;
    margin-bottom: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  letter-spacing: -0.02em;
  margin: 0 0 2px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SectionTitleSub = styled.span`
  font-family: inherit;
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.yvote07};
  margin-left: 6px;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote08};
  margin: 0 0 4px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid ${({ theme }) => theme.colors.yvote12};
  margin: 6px 0 10px;
`;

/* Today's news */

const YesterdaySummary = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote08};
  margin: 0;
  line-height: 1.6;
`;

const TodayList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TodayItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const TodaySummary = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.6;
  flex: 1;
`;

const TodayNewsLink = styled.a`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote07};
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
    text-decoration: underline;
  }
`;

/* Party */

const PartyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const PartyColumn = styled.div``;

const PartyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const PartyIcon = styled(Image)`
  object-fit: contain;
`;

const PartyName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const PartySummary = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.6;
`;

/* List rows */

const ListTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hovergray};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

const ListTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.yvote12};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ListMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote08};
  white-space: nowrap;
`;

const CommentTypeBadges = styled.span`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const CommentTypeBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote10};
  white-space: nowrap;
`;

const CommentTypeIconImg = styled(Image)`
  object-fit: contain;
`;

const StatusBadge = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const PendingBadge = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const TypeTag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote08};
`;

/* Two column layout */

const TwoColumn = styled.div`
  width: 92%;
  max-width: 1200px;
  display: flex;
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    width: 96%;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

/* Election card */

const ElectionCard = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.yvote12};
  color: white;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const ElectionLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ElectionName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 6px 0 2px;
`;

const ElectionDate = styled.span`
  font-size: 13px;
  opacity: 0.7;
`;

const ElectionDday = styled.span`
  font-size: 26px;
  font-weight: 800;
  margin-top: 8px;
  letter-spacing: -0.02em;
`;
