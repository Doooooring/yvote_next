import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { layout, prepare } from '@chenglou/pretext';
import CommentTypeIcon from '@components/common/CommentTypeIcon';
import HeadMeta from '@components/common/HeadMeta';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { commentType, NewsType, newsTypesToKorFull } from '@utils/interface/news';

/* ===== Dummy Data ===== */

const onAirNews = [
  { id: 914, title: '26년 추가경정예산', tag: '국회 심의' },
  { id: 950, title: '중대범죄수사청법', tag: '본회의 통과' },
  { id: 453, title: '대법원 증원', tag: '법사위 심사' },
  { id: 905, title: '프랑스 국빈 방한', tag: '진행 중' },
  { id: 906, title: '인도네시아 국빈 방한', tag: '진행 중' },
  { id: 665, title: '헌재법 개정', tag: '국회 심사' },
  { id: 887, title: '상법 개정', tag: '법사위' },
];

const dbUpdates = {
  date: '4월 2일',
  summary: '뉴스 2건 생성 · 발행 1건 · 자료 17건 추가',
  details: [
    { action: '뉴스 생성', items: ['#955 제13회 국무회의', '#956 2026년도 1분기 경제지표'] },
    { action: '뉴스 발행', items: ['#955 제13회 국무회의'] },
    {
      action: '자료 추가',
      items: [
        '#914 추경 — 청와대 +1',
        '#905 프랑스 국빈방한 — 청와대 +1',
        '#955 국무회의 — 행정부 +1',
        '#956 경제지표 — 행정부 +1',
        '#953 4월 1주차 — 청와대 +3, 행정부 +7',
        '#906 인도네시아 방한 — 청와대 +3',
      ],
    },
  ],
};

const todayNews = [
  {
    summary: '이재명 대통령, 국회에서 2026 추가경정예산안 시정연설',
    newsTitle: '26년 추가경정예산',
    newsId: 914,
  },
  {
    summary: '중동 사태 장기화에 공공부문 차량 5부제 시행, 전 국민 에너지 절약 실천 요청',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
  { summary: '프랑스 대통령 국빈방한 친교 만찬 개최', newsTitle: '프랑스 국빈 방한', newsId: 905 },
  {
    summary: '교육부, 라이즈(RISE) 재구조화 방안 발표',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
  {
    summary: '광명 신안산선 터널 붕괴사고 조사결과 발표',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
  {
    summary: '트럼프 대통령 대국민 담화 관련 청와대 브리핑',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
  {
    summary: '국가데이터처, 2026년 3월 소비자물가동향 발표',
    newsTitle: '2026년도 1분기 경제지표',
    newsId: 956,
  },
  { summary: '법제처, 4월의 주요 시행법령 안내', newsTitle: '제13회 국무회의', newsId: 955 },
  {
    summary: '김혜경 여사, 한복생활 유네스코 등재추진단 차담회',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
  {
    summary: '국민권익위, 다자녀주택 주차 관련 제도개선 발표',
    newsTitle: '2026년 4월 1주차',
    newsId: 953,
  },
];

const partyPositions = [
  {
    party: '국민의힘',
    summary:
      "민주당의 상임위 100% 독식 선언을 의회민주주의 파괴로 규탄. 국내 비축유 해외 반출을 '4월 에너지 대란설' 속 모럴 해저드로 비판. 유엔 북한인권결의안 불참 검토를 비굴한 유화책으로 지적.",
  },
  {
    party: '더불어민주당',
    summary:
      '중동발 경제 위기에 당정 협력으로 실행력 있는 대응 강조. 국민의힘이 일을 안 하면 다수당이 해내야 한다며 상임위 구성 정당화. 오보에도 탄압 타령하는 언론 성역론을 적반하장으로 비판.',
  },
];

const partyConversation = [
  { party: '국민의힘', text: '상임위까지 독식하겠다는 건 의회민주주의를 삼키겠다는 겁니다.' },
  {
    party: '더불어민주당',
    text: '국민의힘이 일을 하지 않으니 누군가는 해내야 합니다. 다수 의석은 민심입니다.',
  },
  {
    party: '국민의힘',
    text: '비축유를 해외에 반출하면서 에너지 대란은 누가 책임집니까? 심각한 모럴 해저드입니다.',
  },
  {
    party: '더불어민주당',
    text: '불안만 부추기지 마시고 책임 있는 대안과 협력으로 답해주시기 바랍니다.',
  },
];

const revivedNews = [
  {
    id: 749,
    title: '정부 도심 주택공급 확대 및 다주택자 규제',
    lastUpdate: '2026-03-30',
    originalDate: '2023-01-29',
    added: [{ type: '행정부', count: 1 }],
  },
  {
    id: 944,
    title: '중대재해처벌법',
    lastUpdate: '2026-03-30',
    originalDate: '2022-11-20',
    added: [{ type: '행정부', count: 1 }],
  },
  {
    id: 462,
    title: '화물연대 총파업',
    lastUpdate: '2026-03-30',
    originalDate: '2022-12-09',
    added: [
      { type: '청와대', count: 1 },
      { type: '국민의힘', count: 9 },
      { type: '더불어민주당', count: 10 },
    ],
  },
];

const ongoingVotes = [
  {
    id: 501,
    title: '간호법 재의결',
    status: '본회의 표결 예정',
    chamber: '국회',
    date: '2026-04-02',
  },
  {
    id: 502,
    title: '전세사기 특별법 개정안',
    status: '법사위 심사 중',
    chamber: '국회',
    date: '2026-04-01',
  },
];

const nextElection = {
  name: '제9회 전국동시지방선거',
  date: '2026-06-03',
  dday: 64,
};

const upcomingNews = [
  {
    id: 940,
    type: 'weekly',
    typeLabel: '주간',
    title: '2026년 3월 4주차',
    date: '2026-03-29',
    status: '작성 중',
  },
  {
    id: 615,
    type: 'weekly',
    typeLabel: '주간',
    title: '2022년 11월 5주차',
    date: '2022-12-04',
    status: '작성 중',
  },
  {
    id: 483,
    type: 'constitution',
    typeLabel: '헌재',
    title: '낙태죄 헌법불합치 결정',
    date: '2019-04-11',
    status: '작성 중',
  },
];

/* ===== Components ===== */

function DbUpdateSection() {
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const check = () => {
      if (textRef.current && containerRef.current) {
        setOverflow(textRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const summaryText = `${dbUpdates.date} — ${dbUpdates.summary}`;

  return (
    <DbUpdateBar>
      <DbUpdateHeader onClick={() => setOpen(!open)}>
        <DbUpdateIcon>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path
              d="M4 1h8l4 4v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M12 1v4h4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 9h6M6 12h4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
          <DeltaSymbol>Δ</DeltaSymbol>
        </DbUpdateIcon>
        <DbUpdateSummaryText ref={containerRef}>
          <MarqueeInner ref={textRef} $animate={overflow}>
            {summaryText}
            {overflow && `\u00A0\u00A0\u00A0\u00A0\u00A0${summaryText}`}
          </MarqueeInner>
        </DbUpdateSummaryText>
        <DbUpdateToggle>{open ? '▲' : '▼'}</DbUpdateToggle>
      </DbUpdateHeader>
      {open && (
        <DbUpdateDetails>
          {dbUpdates.details.map((group, i) => (
            <DbUpdateGroup key={i}>
              <DbUpdateAction>{group.action}</DbUpdateAction>
              <DbUpdateItemList>
                {group.items.map((item, j) => (
                  <DbUpdateItem key={j}>{item}</DbUpdateItem>
                ))}
              </DbUpdateItemList>
            </DbUpdateGroup>
          ))}
        </DbUpdateDetails>
      )}
    </DbUpdateBar>
  );
}

function PartyCard({ party }: { party: { party: string; summary: string } }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, []);

  return (
    <PartyColumn>
      <PartyHeader>
        <CommentTypeIcon type={party.party as commentType} size={14} />
        <PartyName>{party.party}</PartyName>
      </PartyHeader>
      <PartySummary ref={ref} $expanded={expanded}>
        {party.summary}
      </PartySummary>
      {clamped && (
        <PartyExpandBtn onClick={() => setExpanded(!expanded)}>
          {expanded ? '접기' : '펼쳐보기'}
        </PartyExpandBtn>
      )}
    </PartyColumn>
  );
}

const DICE_DOTS: Record<number, [number, number][]> = {
  1: [[7.5, 7.5]],
  2: [
    [4.5, 4.5],
    [10.5, 10.5],
  ],
  3: [
    [4.5, 4.5],
    [7.5, 7.5],
    [10.5, 10.5],
  ],
  4: [
    [4.5, 4.5],
    [10.5, 4.5],
    [4.5, 10.5],
    [10.5, 10.5],
  ],
  5: [
    [4.5, 4.5],
    [10.5, 4.5],
    [7.5, 7.5],
    [4.5, 10.5],
    [10.5, 10.5],
  ],
  6: [
    [4.5, 4],
    [10.5, 4],
    [4.5, 7.5],
    [10.5, 7.5],
    [4.5, 11],
    [10.5, 11],
  ],
};

function DiceIcon({ face }: { face: number }) {
  const dots = DICE_DOTS[face] || DICE_DOTS[1];
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="13" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.2" fill="currentColor" />
      ))}
    </svg>
  );
}

const TODAY_PER_PAGE = 5;

const todaySummaryText =
  '이재명 대통령이 국회에서 중동 에너지 위기 대응을 위한 추가경정예산안 시정연설을 실시했다. 정부는 공공부문 차량 5부제와 에너지 절약 대책을 본격 시행하며, 프랑스 대통령 국빈방한 친교 만찬이 이어졌다. 교육부는 라이즈(RISE) 재구조화 방안을, 국토부는 광명 신안산선 터널 붕괴 조사결과를 발표했다. 트럼프 대국민 담화에 대한 청와대 브리핑이 있었고, 3월 소비자물가동향과 4월 시행법령도 공개됐다.';

function TodayNewsSection() {
  const [mode, setMode] = useState<'list' | 'summary'>('list');
  const [page, setPage] = useState(0);
  const [shuffled, setShuffled] = useState(todayNews);
  const [dice, setDice] = useState(1);
  const [read, setRead] = useState<Set<number>>(new Set());
  const totalPages = Math.ceil(shuffled.length / TODAY_PER_PAGE);
  const touchStart = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50 && page < totalPages - 1) setPage(page + 1);
    if (diff < -50 && page > 0) setPage(page - 1);
  };

  const visible = shuffled.slice(page * TODAY_PER_PAGE, (page + 1) * TODAY_PER_PAGE);

  return (
    <Section>
      <TodayHeader>
        <TodayTitleRow>
          <SectionTitle>오늘의 소식</SectionTitle>
          <RefreshBtn
            onClick={() => {
              if (mode === 'list') {
                setShuffled([...todayNews].sort(() => Math.random() - 0.5));
                setPage(0);
              }
              setDice(Math.floor(Math.random() * 6) + 1);
            }}
            title="새로고침"
          >
            <DiceIcon face={dice} />
          </RefreshBtn>
        </TodayTitleRow>
        <ModeToggle>
          <ModeBtn $active={mode === 'list'} onClick={() => setMode('list')} title="목록">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="1.5" cy="2" r="1.5" fill="currentColor" />
              <rect x="5" y="1" width="9" height="2" rx="1" fill="currentColor" />
              <circle cx="1.5" cy="7" r="1.5" fill="currentColor" />
              <rect x="5" y="6" width="9" height="2" rx="1" fill="currentColor" />
              <circle cx="1.5" cy="12" r="1.5" fill="currentColor" />
              <rect x="5" y="11" width="9" height="2" rx="1" fill="currentColor" />
            </svg>
          </ModeBtn>
          <ModeBtn $active={mode === 'summary'} onClick={() => setMode('summary')} title="요약">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0" y="1" width="14" height="5" rx="1" fill="currentColor" />
              <rect x="0" y="8" width="9" height="2" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="0" y="12" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </ModeBtn>
        </ModeToggle>
      </TodayHeader>
      <Divider />
      {mode === 'list' ? (
        <>
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <TodayList>
              {visible.map((item, i) => (
                <TodayItem
                  key={page * TODAY_PER_PAGE + i}
                  $read={read.has(page * TODAY_PER_PAGE + i)}
                >
                  <TodayItemContent>
                    <TodaySummary>{item.summary}</TodaySummary>
                    <TodayNewsLink href={`/news/${item.newsId}`}>{item.newsTitle} →</TodayNewsLink>
                  </TodayItemContent>
                  <ReadCheck
                    $checked={read.has(page * TODAY_PER_PAGE + i)}
                    onClick={() => {
                      const idx = page * TODAY_PER_PAGE + i;
                      setRead((prev) => {
                        const next = new Set(prev);
                        next.has(idx) ? next.delete(idx) : next.add(idx);
                        return next;
                      });
                    }}
                  />
                </TodayItem>
              ))}
            </TodayList>
          </div>
          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <PageDot key={i} $active={i === page} onClick={() => setPage(i)} />
              ))}
            </Pagination>
          )}
        </>
      ) : (
        <TodaySummaryParagraph>{todaySummaryText}</TodaySummaryParagraph>
      )}
    </Section>
  );
}

function PartySectionComponent() {
  const [mode, setMode] = useState<'party' | 'conversation'>('party');

  return (
    <Section>
      <TodayHeader>
        <SectionTitle>정당별 요즘 하는 소리</SectionTitle>
        <ModeToggle>
          <ModeBtn $active={mode === 'party'} onClick={() => setMode('party')} title="정당별">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="5.5"
                height="13"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="8"
                y="0.5"
                width="5.5"
                height="13"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </ModeBtn>
          <ModeBtn
            $active={mode === 'conversation'}
            onClick={() => setMode('conversation')}
            title="대화"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4l-2 2V2z"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M5 8v1a1 1 0 0 0 1 1h4l2 2V6a1 1 0 0 0-1-1h-1"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </ModeBtn>
        </ModeToggle>
      </TodayHeader>
      <Divider />
      {mode === 'party' ? (
        <PartyGrid>
          {partyPositions.map((party) => (
            <PartyCard key={party.party} party={party} />
          ))}
        </PartyGrid>
      ) : (
        <ConversationList>
          {partyConversation.map((msg, i) => (
            <ConversationBubble key={i} $party={msg.party}>
              <BubbleParty>
                <CommentTypeIcon type={msg.party as commentType} size={12} />
                {msg.party}
              </BubbleParty>
              <BubbleText>{msg.text}</BubbleText>
            </ConversationBubble>
          ))}
        </ConversationList>
      )}
    </Section>
  );
}

/* ===== Page ===== */

const PAGE_CONTEXT = [
  `주요 진행 뉴스: ${onAirNews.map((n) => `${n.title}(${n.tag})`).join(', ')}`,
  `오늘의 소식: ${todayNews.map((n) => n.summary).join('; ')}`,
  `정당 입장 — ${partyPositions.map((p) => `${p.party}: ${p.summary}`).join(' / ')}`,
  `끌올뉴스: ${revivedNews.map((n) => n.title).join(', ')}`,
  `진행중 표결: ${ongoingVotes.map((v) => `${v.title}(${v.status})`).join(', ')}`,
  `예정된 뉴스: ${upcomingNews.map((n) => n.title).join(', ')}`,
].join('\n');

export default function Home() {
  const [mode, setMode] = useState<'classic' | 'newspaper'>('classic');

  return (
    <>
      <HeadMeta />
      <ModeToggleBar>
        <ModeToggleBtn $active={mode === 'classic'} onClick={() => setMode('classic')}>
          오리지널
        </ModeToggleBtn>
        <ModeToggleBtn $active={mode === 'newspaper'} onClick={() => setMode('newspaper')}>
          신문
        </ModeToggleBtn>
      </ModeToggleBar>
      {mode === 'newspaper' ? <NewspaperMode /> : <ClassicMode />}
    </>
  );
}

function ClassicMode() {
  return (
    <>
      <Wrapper>
        {/* DB 업데이트 */}
        <DbUpdateSection />

        {/* On Air */}
        <OnAirBar>
          <OnAirLabel>ON</OnAirLabel>
          <OnAirScroll>
            <OnAirTrack>
              {[...onAirNews, ...onAirNews].map((item, i) => (
                <OnAirChip key={`${item.id}-${i}`} href={`/news/${item.id}`}>
                  <OnAirTitle>{item.title}</OnAirTitle>
                  <OnAirTag>{item.tag}</OnAirTag>
                </OnAirChip>
              ))}
            </OnAirTrack>
          </OnAirScroll>
        </OnAirBar>

        {/* 오늘의 소식 */}
        <TodayNewsSection />

        {/* 정당별 최신 입장 */}
        <PartySectionComponent />

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
                        <CommentTypeIcon type={a.type as commentType} size={12} />
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
            <SectionTitle>국회의원들 나름 하는 중 :</SectionTitle>
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

/* ===== Newspaper Mode ===== */

type NewspaperItem = {
  id: number;
  title: string;
  subTitle?: string;
  date: string;
  newsType: NewsType;
  comments?: string[];
};

const NEWSPAPER_ITEMS: NewspaperItem[] = [
  {
    id: 1146,
    title: '2026년 4월 3주차',
    subTitle: '호르무즈 통항 국제연대 · 북 탄도미사일 도발 · 4·19 정신 · 세월호 12주기 국가책임',
    date: '2026-04-19',
    newsType: NewsType.weekly,
    comments: ['청와대', '행정부', '국민의힘', '더불어민주당'],
  },
  {
    id: 1148,
    title: '인도·베트남 국빈방문',
    subTitle: '이재명 대통령 순방 공동성명, 포괄적 전략 동반자 관계 격상',
    date: '2026-04-19',
    newsType: NewsType.diplomat,
    comments: ['청와대'],
  },
  {
    id: 914,
    title: '26년 추가경정예산',
    subTitle: '국채 없는 26조 2천억 원 추경, 민생지원금·K-패스·에너지 지원 확대',
    date: '2026-04-15',
    newsType: NewsType.govern,
    comments: ['청와대', '행정부', '국민의힘', '더불어민주당'],
  },
  {
    id: 950,
    title: '중대범죄수사청법',
    subTitle: '본회의 통과, 검찰청 해체 후속 수사권 재편 본격화',
    date: '2026-04-17',
    newsType: NewsType.bill,
    comments: ['입법부', '국민의힘', '더불어민주당'],
  },
  {
    id: 649,
    title: '공직자 조사 TF / 기강 확립',
    subTitle: '헌법존중 정부혁신 TF 출범 · 공무원 복종의무 폐지 · 서훈 취소 후속 조치',
    date: '2026-04-19',
    newsType: NewsType.govern,
    comments: ['청와대', '행정부', '국민의힘', '더불어민주당'],
  },
  {
    id: 905,
    title: '프랑스 국빈 방한',
    subTitle: '마크롱 대통령 국빈방한 공동선언, 방산·에너지 협력 합의',
    date: '2026-04-10',
    newsType: NewsType.diplomat,
    comments: ['청와대'],
  },
  {
    id: 906,
    title: '한-인도네시아 정상회담',
    subTitle: '포괄적 방산 협력 확대, 핵심광물 MOU 개정',
    date: '2026-04-01',
    newsType: NewsType.diplomat,
    comments: ['청와대'],
  },
  {
    id: 1147,
    title: '제16회 국무회의',
    subTitle: '제5차 비상경제점검회의 병행, 중동 공급망 대응 논의',
    date: '2026-04-14',
    newsType: NewsType.cabinet,
    comments: ['청와대', '행정부'],
  },
  {
    id: 955,
    title: '제13회 국무회의',
    subTitle: '추경안 심의·RISE 재구조화 보고',
    date: '2026-04-02',
    newsType: NewsType.cabinet,
    comments: ['청와대', '행정부'],
  },
  {
    id: 953,
    title: '2026년 4월 1주차',
    subTitle: '추경 시정연설 · 공공차량 5부제 · 프랑스 친교 만찬',
    date: '2026-04-05',
    newsType: NewsType.weekly,
    comments: ['청와대', '행정부', '국민의힘', '더불어민주당'],
  },
  {
    id: 665,
    title: '헌재법 개정',
    subTitle: '재판관 선출 방식 재조정, 여야 충돌',
    date: '2026-03-28',
    newsType: NewsType.bill,
    comments: ['입법부', '국민의힘', '더불어민주당'],
  },
  {
    id: 887,
    title: '상법 개정',
    subTitle: '이사 충실의무 확대, 경영계 반발',
    date: '2026-03-20',
    newsType: NewsType.bill,
    comments: ['입법부', '국민의힘'],
  },
  {
    id: 453,
    title: '대법원 증원',
    subTitle: '재판 지연 해소 위한 대법관 정원 확대 논의',
    date: '2026-03-15',
    newsType: NewsType.bill,
    comments: ['입법부'],
  },
  {
    id: 956,
    title: '2026년도 1분기 경제지표',
    subTitle: '소비자물가 상승률 확대, 고용동향 둔화',
    date: '2026-04-02',
    newsType: NewsType.govern,
    comments: ['행정부'],
  },
  {
    id: 749,
    title: '정부 도심 주택공급 확대 및 다주택자 규제',
    date: '2026-03-30',
    newsType: NewsType.govern,
    comments: ['행정부'],
  },
  {
    id: 944,
    title: '중대재해처벌법',
    subTitle: '시행 3년 평가, 개정안 발의 움직임',
    date: '2026-03-30',
    newsType: NewsType.bill,
    comments: ['행정부'],
  },
  {
    id: 462,
    title: '화물연대 총파업',
    subTitle: '안전운임제 연장 요구, 정부 업무개시명령',
    date: '2026-03-30',
    newsType: NewsType.govern,
    comments: ['청와대', '국민의힘', '더불어민주당'],
  },
  {
    id: 531,
    title: '공무원 모범사용자 책임',
    date: '2026-04-15',
    newsType: NewsType.govern,
    comments: ['더불어민주당'],
  },
  {
    id: 686,
    title: '지역인재 성장엔진',
    subTitle: '교육부·지자체 라이즈 재구조화 후속',
    date: '2026-04-15',
    newsType: NewsType.govern,
    comments: ['행정부'],
  },
  {
    id: 630,
    title: '기후·에너지 국제협력',
    date: '2026-04-17',
    newsType: NewsType.govern,
    comments: ['행정부'],
  },
  {
    id: 902,
    title: '국정조사 쌍방울·대장동',
    subTitle: '조작기소 의혹 집중 청문, 검찰 수사권 존폐 논의',
    date: '2026-04-19',
    newsType: NewsType.investigation,
    comments: ['국민의힘', '더불어민주당'],
  },
  {
    id: 348,
    title: '특검 활동 점검',
    date: '2026-04-18',
    newsType: NewsType.specialcounsel,
    comments: ['더불어민주당', '국민의힘'],
  },
  {
    id: 739,
    title: '윤석열 부부 수감 논란',
    date: '2026-04-18',
    newsType: NewsType.investigation,
    comments: ['국민의힘'],
  },
  {
    id: 713,
    title: '선거 허위사실 공표 논쟁',
    date: '2026-04-16',
    newsType: NewsType.bill,
    comments: ['국민의힘'],
  },
];

function formatNpDate(d: string) {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(
    dt.getDate(),
  ).padStart(2, '0')}`;
}

type RhythmedItem = NewspaperItem & {
  _size: 'feature' | 'medium' | 'compact';
  _tone: 'paper' | 'thick' | 'quote';
  _showSub: boolean;
  _colSpan: number;
  _rowSpan: number;
  _showImage: boolean;
  _colBody: number;
};

// Seeded pseudo-random (mulberry32) — keeps layout stable per render but feels random.
function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Korean-flavored filler so cards read like newspaper articles rather than blank cards.
// Seeded by id so the same card keeps the same filler across renders.
const FILLER_FRAGMENTS = [
  '정부 관계자는 이번 조치가 민생 안정을 위한 필수 대응이라며 후속 점검을 예고했다.',
  '여야는 각각 찬반 입장을 내며 향후 국회 논의 과정에서 세부 쟁점을 정리하기로 했다.',
  '전문가들은 중장기 영향보다 단기 변동성에 주목해야 한다는 의견을 밝혔다.',
  '관계 부처는 피해 최소화를 위해 관련 법령 개정과 지원 예산 집행을 서두를 방침이다.',
  '시장은 정책 발표 직후 단기적으로 혼조세를 보였으나 후속 성명이 이어질 경우 반등 여지가 남아있다는 분석이다.',
  '당초 예상보다 긴 협의 끝에 발표된 이번 조치는 이해관계자 간의 조율 과정을 반영한 결과라는 평가다.',
  '향후 6개월간 이행 상황을 점검하기로 하였으며, 추가 보완 조치는 다음 회의에서 논의된다.',
  '국제 동향과 연계한 대응 기조가 유지되는 가운데, 국내 현장에서도 관련 매뉴얼이 순차적으로 반영될 예정이다.',
];

function buildBodyFiller(seed: number): string {
  const rand = seededRandom(seed + 7);
  const n = 2 + Math.floor(rand() * 3); // 2-4 fragments
  const out: string[] = [];
  const used = new Set<number>();
  while (out.length < n) {
    const idx = Math.floor(rand() * FILLER_FRAGMENTS.length);
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(FILLER_FRAGMENTS[idx]);
  }
  return out.join(' ');
}

// Font strings must match the CSS in the card styled components.
// Keep these here so pretext measurements stay in sync with render output.
const TITLE_FONTS: Record<RhythmedItem['_size'], { font: string; lineHeight: number }> = {
  feature: { font: "900 22px 'Noto Serif KR', Georgia, serif", lineHeight: 22 * 1.15 },
  medium: { font: "800 15px 'Noto Serif KR', Georgia, serif", lineHeight: 15 * 1.25 },
  compact: { font: "700 12px 'Noto Serif KR', Georgia, serif", lineHeight: 12 * 1.3 },
};
const LEDE_FONT = { font: "600 12px 'Noto Serif KR', Georgia, serif", lineHeight: 12 * 1.45 };
const BODY_FONT = { font: "400 11px 'Noto Serif KR', Georgia, serif", lineHeight: 11 * 1.6 };
const META_HEIGHT = 18;
const CATEGORY_HEIGHT = 14;

function NewspaperCard({
  item,
  onNavigate,
  containerWidth,
  gridCols,
  rowHeight,
  colGap,
  rowGap,
  cardPadX,
  cardPadY,
}: {
  item: RhythmedItem;
  onNavigate: (id: number) => void;
  containerWidth: number;
  gridCols: number;
  rowHeight: number;
  colGap: number;
  rowGap: number;
  cardPadX: number;
  cardPadY: number;
}) {
  const [expanded, setExpanded] = useState(false);

  // Compute extraRows needed via pretext (pure math, no DOM reflow).
  // Memoized per-item + container dimensions, so resize re-runs layout()
  // arithmetic only, not prepare().
  const extraRows = useMemo(() => {
    if (!containerWidth) return 0;
    if (item._tone === 'quote') return 0;

    // Effective colSpan after mobile snap (3 or 6 on mobile, native on desktop).
    const effectiveSpan = gridCols === 6 ? (item._colSpan >= 5 ? 6 : 3) : item._colSpan;
    const colUnit = (containerWidth - colGap * (gridCols - 1)) / gridCols;
    const cellWidth = effectiveSpan * colUnit + (effectiveSpan - 1) * colGap;
    const contentWidth = Math.max(0, cellWidth - cardPadX * 2);
    if (contentWidth <= 0) return 0;

    const titleSpec = TITLE_FONTS[item._size];
    let needed = CATEGORY_HEIGHT;

    const titleH = layout(
      prepare(item.title, titleSpec.font),
      contentWidth,
      titleSpec.lineHeight,
    ).height;
    needed += titleH;

    if (item._showImage) {
      needed += contentWidth * (2 / 3) + 8; // aspect-ratio 3/2 image + margin
    }

    if (item._showSub && item.subTitle) {
      const ledeH = layout(
        prepare(item.subTitle, LEDE_FONT.font),
        contentWidth,
        LEDE_FONT.lineHeight,
      ).height;
      needed += ledeH + 6;
    }

    if (item._size === 'feature' || item._size === 'medium') {
      const body = buildBodyFiller(item.id);
      // Mobile forces single-column body (CSS media query); match that here
      // so predicted height stays accurate.
      const effectiveCols = gridCols === 6 ? 1 : item._colBody;
      const bodyWidth = effectiveCols > 1 ? (contentWidth - 10) / effectiveCols : contentWidth;
      const bodyH = layout(prepare(body, BODY_FONT.font), bodyWidth, BODY_FONT.lineHeight).height;
      // Multi-col text wraps into N columns, so total visual height ≈ bodyH / cols
      const visualBodyH = bodyH / effectiveCols;
      needed += visualBodyH + 6;
    }

    needed += META_HEIGHT + cardPadY * 2;
    // Safety buffer — pretext measures via canvas, which can be a couple px
    // tighter than actual browser rendering for Korean + serif. Pad to be safe
    // so dates don't clip on the edges.
    needed += 10;

    const allocated = item._rowSpan * rowHeight + (item._rowSpan - 1) * rowGap;
    if (needed <= allocated) return 0;
    const overflow = needed - allocated;
    return Math.ceil(overflow / (rowHeight + rowGap));
  }, [item, containerWidth, gridCols, rowHeight, colGap, rowGap, cardPadX, cardPadY]);

  const handleCardClick = () => setExpanded(true);

  return (
    <>
      <NpCard
        $size={item._size}
        $tone={item._tone}
        $colSpan={item._colSpan}
        $rowSpan={item._rowSpan + extraRows}
        onClick={handleCardClick}
      >
        {item._tone === 'quote' ? (
          <NpPullQuote>
            <NpQuoteMark>“</NpQuoteMark>
            <NpQuoteBody>{item.subTitle || item.title}</NpQuoteBody>
            <NpCardMeta $tone={item._tone}>
              <span>— {item.title}</span>
            </NpCardMeta>
          </NpPullQuote>
        ) : (
          <>
            <NpCardCategory $tone={item._tone}>{newsTypesToKorFull(item.newsType)}</NpCardCategory>
            <NpCardTitle $size={item._size} $tone={item._tone}>
              {item.title}
            </NpCardTitle>
            {item._showImage && <NpImagePlaceholder />}
            {item._showSub && item.subTitle && <NpCardLede>{item.subTitle}</NpCardLede>}
            {(item._size === 'feature' || item._size === 'medium') && (
              <NpCardBody $cols={item._colBody}>{buildBodyFiller(item.id)}</NpCardBody>
            )}
            <NpCardMeta $tone={item._tone}>
              <span>{formatNpDate(item.date)}</span>
              <IconRow comments={item.comments} />
            </NpCardMeta>
          </>
        )}
      </NpCard>

      {expanded && (
        <NpExpandOverlay onClick={() => setExpanded(false)} role="dialog" aria-modal="true">
          <NpExpandSheet onClick={(e) => e.stopPropagation()}>
            <NpExpandClose onClick={() => setExpanded(false)} aria-label="닫기">
              ×
            </NpExpandClose>
            <NpExpandCategory>{newsTypesToKorFull(item.newsType)}</NpExpandCategory>
            <NpExpandTitle>{item.title}</NpExpandTitle>
            {item.subTitle && <NpExpandLede>{item.subTitle}</NpExpandLede>}
            {item._showImage && <NpExpandImage />}
            <NpExpandBody>{buildBodyFiller(item.id)}</NpExpandBody>
            <NpExpandMeta>
              <span>{formatNpDate(item.date)}</span>
              <IconRow comments={item.comments} />
              <NpExpandOpenLink
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(item.id);
                }}
              >
                기사로 이동 →
              </NpExpandOpenLink>
            </NpExpandMeta>
          </NpExpandSheet>
        </NpExpandOverlay>
      )}
    </>
  );
}

// Shared icon row rendering (used both in cards and the expand overlay).
function IconRow({ comments }: { comments?: string[] }) {
  if (!comments || comments.length === 0) return null;
  return (
    <NpIconRow>
      {comments.map((c, i) => (
        <CommentTypeIcon key={i} type={c as commentType} size={12} />
      ))}
    </NpIconRow>
  );
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function NewspaperMode() {
  const showNewsContent = useNewsNavigate();
  const items = NEWSPAPER_ITEMS;
  const hero = items[0];
  const [gridRef, containerWidth] = useContainerWidth();
  const isMobile = containerWidth > 0 && containerWidth < 768;
  const gridCols = isMobile ? 6 : 12;
  const rowHeight = isMobile ? 38 : 42;
  const colGap = isMobile ? 10 : 14;
  const rowGap = isMobile ? 8 : 10;

  // Each item gets a randomized size + tone + column/row spans so the mosaic
  // has variable widths AND heights (true magazine scatter, not fixed columns).
  // Seeded by item id so the same news always looks the same across renders.
  // Idx 0 is always a feature to anchor the page.
  const rhythmedItems = useMemo(() => {
    return items.map((item, idx) => {
      const rand = seededRandom(item.id);
      const sizeRoll = rand();
      let size: 'feature' | 'medium' | 'compact';
      if (idx === 0) size = 'feature';
      else if (sizeRoll < 0.18 && item.subTitle) size = 'feature';
      else if (sizeRoll < 0.5) size = 'compact';
      else size = 'medium';

      // Only one occasional "quote" block — the rest use plain paper styling.
      const toneRoll = rand();
      let tone: 'paper' | 'thick' | 'quote';
      if (size === 'feature') {
        tone = toneRoll < 0.25 ? 'thick' : 'paper';
      } else if (size === 'medium') {
        tone = toneRoll < 0.08 ? 'quote' : 'paper';
      } else {
        tone = 'paper';
      }

      const showSub =
        size === 'feature' ? !!item.subTitle : size === 'medium' && !!item.subTitle && rand() < 0.4;

      // Col/row spans — base on size, then jitter. 12-col grid at wide, halves at mobile.
      const colJitter = rand();
      const rowJitter = rand();
      let colSpan: number;
      let rowSpan: number;
      if (size === 'feature') {
        // idx 0 gets the biggest footprint
        colSpan = idx === 0 ? 8 : colJitter < 0.5 ? 6 : 5;
        rowSpan = idx === 0 ? 5 : rowJitter < 0.5 ? 4 : 3;
      } else if (size === 'medium') {
        colSpan = colJitter < 0.3 ? 5 : colJitter < 0.7 ? 4 : 3;
        rowSpan = rowJitter < 0.5 ? 2 : rowJitter < 0.85 ? 3 : 1;
      } else {
        colSpan = colJitter < 0.4 ? 3 : colJitter < 0.8 ? 4 : 2;
        rowSpan = rowJitter < 0.7 ? 1 : 2;
      }

      // Feature articles get an image placeholder ~60% of the time.
      const showImage = size === 'feature' && rand() < 0.6;

      // Feature and some medium articles use multi-column body.
      const colBody = size === 'feature' ? 2 : size === 'medium' && colSpan >= 4 ? 2 : 1;

      return {
        ...item,
        _size: size,
        _tone: tone,
        _showSub: showSub,
        _colSpan: colSpan,
        _rowSpan: rowSpan,
        _showImage: showImage,
        _colBody: colBody,
      };
    });
  }, [items]);

  return (
    <NpWrapper>
      <NpContent>
        <NpMosaicGrid ref={gridRef}>
          {rhythmedItems.map((item) => {
            const cardPadX = item._size === 'feature' ? 10 : item._size === 'medium' ? 8 : 6;
            const cardPadY = cardPadX;
            return (
              <NewspaperCard
                key={item.id}
                item={item}
                onNavigate={showNewsContent}
                containerWidth={containerWidth}
                gridCols={gridCols}
                rowHeight={rowHeight}
                colGap={colGap}
                rowGap={rowGap}
                cardPadX={cardPadX}
                cardPadY={cardPadY}
              />
            );
          })}
        </NpMosaicGrid>
      </NpContent>
    </NpWrapper>
  );
}

/* ===== Styles ===== */

/* Mode toggle */

const ModeToggleBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 8px 0 0;
  background: ${({ theme }) => theme.colors.yvote02};
`;

const ModeToggleBtn = styled.button<{ $active: boolean }>`
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.yvote12 : theme.colors.yvote05)};
  background: ${({ theme, $active }) => ($active ? theme.colors.yvote12 : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.yvote01 : theme.colors.yvote11)};
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.colors.yvote01 : theme.colors.yvote13)};
    border-color: ${({ theme }) => theme.colors.yvote12};
  }
`;

/* Newspaper styles */

const NpWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.yvote01};
`;

const NpMasthead = styled.header`
  width: 92%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0 0;

  @media (max-width: 768px) {
    width: 96%;
    padding: 16px 0 0;
  }
`;

const NpMastheadInner = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const NpMastheadTitle = styled.h1`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -0.05em;
  margin: 0;
  line-height: 0.9;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const NpMastheadYvote = styled.span`
  color: #1f6fb5;
  font-style: italic;
  letter-spacing: -0.06em;
  margin-right: 6px;
`;

const NpMastheadWord = styled.span`
  color: ${({ theme }) => theme.colors.yvote13};
`;

const NpMastheadDate = styled.span`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote08};
  letter-spacing: 0.04em;
`;

const NpMastheadRule = styled.div`
  height: 3px;
  background: ${({ theme }) => theme.colors.yvote12};
`;

const NpContent = styled.main`
  width: 92%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0 80px;

  @media (max-width: 768px) {
    width: 96%;
    padding: 16px 0 80px;
  }
`;

const NpRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 16px 0;
  }
`;

const NpIconRow = styled.div`
  display: inline-flex;
  gap: 3px;
  align-items: center;
  filter: saturate(0.3) brightness(1.15);
`;

const NpHeroSection = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NpHeroArticle = styled.article`
  cursor: pointer;
  padding-right: 24px;
  border-right: 1px solid ${({ theme }) => theme.colors.yvote04};

  @media (max-width: 768px) {
    padding: 0 0 14px;
    border-right: none;
    border-bottom: 2px solid ${({ theme }) => theme.colors.yvote12};
    margin-bottom: 14px;
  }
`;

const NpHeroCategory = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const NpHeroTitle = styled.h2`
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

const NpHeroSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote08};
  line-height: 1.55;
  margin: 0 0 12px;
`;

const NpHeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

const NpSecondaryColumn = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-flow: dense;
    gap: 10px 12px;
  }
`;

const NpSecondaryArticle = styled.article`
  cursor: pointer;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0 0 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
    grid-column: span 3;

    &:first-child {
      grid-column: span 4;
    }
    &:nth-child(2) {
      grid-column: span 2;
    }
  }
`;

const NpSecCategory = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const NpSecTitle = styled.h3`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 3px 0 6px;
`;

const NpSecMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

const NpTertiaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-flow: dense;
    gap: 10px 12px;
  }
`;

const NpTertiaryArticle = styled.article`
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
    padding: 0 0 10px;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
    grid-column: span 3;

    &:nth-child(1) {
      grid-column: span 6;
    }
    &:nth-child(2) {
      grid-column: span 2;
    }
    &:nth-child(3) {
      grid-column: span 4;
    }
    &:nth-child(4) {
      grid-column: span 3;
    }
    &:nth-child(5) {
      grid-column: span 3;
    }
    &:nth-child(6) {
      grid-column: span 6;
      border-bottom: none;
    }
  }
`;

const NpTerCategory = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const NpTerTitle = styled.h3`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 3px 0 4px;
`;

const NpTerSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
  line-height: 1.4;
  margin: 0 0 6px;
`;

const NpTerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
`;

const NpSectionBlock = styled.section``;

const NpSectionTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.yvote12};
  display: inline-block;
`;

const NpSectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px 16px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-flow: dense;
    gap: 8px 12px;
  }
`;

const NpCompactArticle = styled.article`
  cursor: pointer;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};

  @media (max-width: 768px) {
    grid-column: span 3;

    &:nth-child(3n + 1) {
      grid-column: span 4;
    }
    &:nth-child(3n + 2) {
      grid-column: span 2;
    }
    &:nth-child(5n) {
      grid-column: span 6;
    }
  }
`;

const NpCompactTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  line-height: 1.35;
  margin: 0;
`;

const NpCompactMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote06};
  margin-top: 3px;
`;

/* Mosaic newspaper cards */

type CardSize = 'feature' | 'medium' | 'compact';
type CardTone = 'paper' | 'thick' | 'quote';

const cardSizeStyles = {
  feature: css`
    padding: 10px 10px 10px;
  `,
  medium: css`
    padding: 8px 8px 8px;
  `,
  compact: css`
    padding: 6px 6px;
  `,
};

const cardToneStyles = {
  paper: css`
    background: transparent;
    border-top: 1px solid ${({ theme }) => theme.colors.yvote12};
  `,
  thick: css`
    background: transparent;
    border-top: 4px solid ${({ theme }) => theme.colors.yvote12};
  `,
  quote: css`
    background: transparent;
    border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  `,
};

const NpMosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 42px;
  grid-auto-flow: dense;
  gap: 10px 14px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 38px;
    gap: 8px 10px;
  }
`;

/**
 * Mobile col-span snaps to either 3 (half) or 6 (full) so the 6-col grid
 * tiles cleanly (3+3 rows or full 6 rows). Desktop keeps finer 12-col spans
 * for the richer mosaic, but mobile sticks to magazine-style two-up rows
 * which prevents the stair-step gaps that appear on small screens.
 */
const mobileColSpan = (desktopSpan: number) => (desktopSpan >= 5 ? 6 : 3);

const NpCard = styled.article<{
  $size: CardSize;
  $tone: CardTone;
  $colSpan: number;
  $rowSpan: number;
}>`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  ${({ $size }) => cardSizeStyles[$size]}
  ${({ $tone }) => cardToneStyles[$tone]}
  grid-column: span ${({ $colSpan }) => $colSpan};
  grid-row: span ${({ $rowSpan }) => $rowSpan};

  @media (max-width: 768px) {
    grid-column: span ${({ $colSpan }) => mobileColSpan($colSpan)};
  }
`;

const NpCardCategory = styled.span<{ $tone: CardTone }>`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const titleSizes = {
  feature: css`
    font-family: 'Noto Serif KR', Georgia, serif;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin: 4px 0 8px;
  `,
  medium: css`
    font-family: 'Noto Serif KR', Georgia, serif;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.25;
    margin: 2px 0 5px;
  `,
  compact: css`
    font-family: 'Noto Serif KR', Georgia, serif;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  `,
};

const NpCardTitle = styled.h3<{ $size: CardSize; $tone: CardTone }>`
  color: ${({ theme }) => theme.colors.yvote13};
  ${({ $size }) => titleSizes[$size]}
`;

const NpCardLede = styled.p`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 600;
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const NpCardBody = styled.p<{ $cols: number }>`
  font-size: 11px;
  line-height: 1.6;
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.yvote09};
  column-count: ${({ $cols }) => $cols};
  column-gap: 10px;
  column-rule: ${({ $cols, theme }) => ($cols > 1 ? `1px solid ${theme.colors.yvote04}` : 'none')};
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    column-count: 1;
    column-rule: none;
  }
`;

const NpImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3/2;
  background: ${({ theme }) => theme.colors.yvote03};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 0 0 8px;
`;

const NpCardMeta = styled.div<{ $tone: CardTone }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  margin-top: auto;
  padding-top: 6px;
  color: ${({ theme }) => theme.colors.yvote06};
  flex-shrink: 0;
  min-height: 16px;
`;

const NpPullQuote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 8px 6px;
`;

const NpQuoteMark = styled.span`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 40px;
  line-height: 0.8;
  color: ${({ theme }) => theme.colors.yvote07};
  margin-bottom: 4px;
`;

const NpQuoteBody = styled.blockquote`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0 0 8px;
  max-width: 320px;
`;

/* Per-card expand ("펼쳐보기") button + overlay */

const NpExpandBtn = styled.button`
  position: absolute;
  right: 6px;
  bottom: 4px;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: ${({ theme }) => theme.colors.yvote01};
  color: ${({ theme }) => theme.colors.yvote10};
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.02em;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, border-color 0.15s;

  article:hover > &,
  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote12};
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const NpExpandOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 200;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const NpExpandSheet = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.yvote01};
  border-top: 6px solid ${({ theme }) => theme.colors.yvote12};
  max-width: 720px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  padding: 32px 28px 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);

  @media (max-width: 768px) {
    padding: 24px 18px 22px;
  }
`;

const NpExpandClose = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.yvote09};
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
  }
`;

const NpExpandCategory = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yvote07};
`;

const NpExpandTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 32px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.yvote13};
  margin: 8px 0 14px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const NpExpandLede = styled.p`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0 0 16px;
`;

const NpExpandImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.yvote03};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 0 0 16px;
`;

const NpExpandBody = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.yvote10};
  margin: 0 0 20px;
  column-count: 2;
  column-gap: 22px;
  column-rule: 1px solid ${({ theme }) => theme.colors.yvote04};

  @media (max-width: 768px) {
    column-count: 1;
  }
`;

const NpExpandMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  padding-top: 10px;
`;

const NpExpandOpenLink = styled.button`
  margin-left: auto;
  border: 1px solid ${({ theme }) => theme.colors.yvote12};
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote12};
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.yvote12};
    color: ${({ theme }) => theme.colors.yvote01};
  }
`;

/* DB Update */

const DbUpdateBar = styled.div`
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  width: 92%;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
    margin-bottom: 12px;
  }
`;

const DbUpdateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 6px;
  }
`;

const DbUpdateIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.yvote07};
  position: relative;
`;

const DeltaSymbol = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote09};
  margin-left: -6px;
  margin-top: 6px;
  align-self: flex-end;
`;

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const DbUpdateSummaryText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote09};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const MarqueeInner = styled.span<{ $animate: boolean }>`
  display: inline-block;
  white-space: nowrap;
  animation: ${({ $animate }) => ($animate ? `${marquee} 12s linear infinite` : 'none')};
  ${({ $animate }) => $animate && 'padding-right: 40px;'}
`;

const DbUpdateToggle = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.yvote07};
  flex-shrink: 0;
`;

const DbUpdateDetails = styled.div`
  padding: 0 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 0 12px 10px;
    gap: 8px;
  }
`;

const DbUpdateGroup = styled.div``;

const DbUpdateAction = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote09};
  margin-bottom: 4px;
`;

const DbUpdateItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DbUpdateItem = styled.li`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote08};
  padding: 1px 0;
  word-break: keep-all;
  &::before {
    content: '· ';
    color: ${({ theme }) => theme.colors.yvote06};
  }

  @media (max-width: 768px) {
    font-size: 10.5px;
  }
`;

/* On Air */

const OnAirBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 92%;
  max-width: 1200px;
  margin-bottom: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 12px;
    margin-bottom: 14px;
    gap: 8px;
  }
`;

const OnAirLabel = styled.span`
  font-size: 8px;
  font-weight: 800;
  color: #fff;
  background: #e53935;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const onAirScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const OnAirScroll = styled.div`
  display: flex;
  gap: 8px;
  overflow: hidden;
  flex: 1;

  &:hover > div {
    animation-play-state: paused;
  }
`;

const OnAirTrack = styled.div`
  display: flex;
  gap: 8px;
  animation: ${onAirScroll} 25s linear infinite;
`;

const OnAirChip = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 12px;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
`;

const OnAirTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const OnAirTag = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.yvote07};
`;

/* Layout */

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
  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 96%;
    margin-bottom: 32px;
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

const TodayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const TodayTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  & > h2 {
    margin: 0;
  }
`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.yvote06};
  padding: 2px;

  &:active {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 2px;
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 6px;
  padding: 2px;
  margin-bottom: 8px;
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.yvote04 : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote12 : theme.colors.yvote06)};
  transition: all 0.15s;
`;

const TodaySummaryParagraph = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const TodayList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TodayItem = styled.li<{ $read?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  ${({ $read }) => $read && `opacity: 0.35;`}
  transition: opacity 0.2s;

  &:last-child {
    border-bottom: none;
  }
`;

const TodayItemContent = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const ReadCheck = styled.button<{ $checked: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 0;
  border: 1.5px solid
    ${({ $checked, theme }) => ($checked ? theme.colors.yvote11 : theme.colors.yvote05)};
  background: ${({ $checked, theme }) => ($checked ? theme.colors.yvote11 : 'transparent')};
  flex-shrink: 0;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.15s;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    position: absolute;
    left: 3px;
    top: 0px;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  padding-top: 8px;
`;

const PageDot = styled.button<{ $active: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.yvote09 : theme.colors.yvote04)};
  transition: background 0.2s;
`;

const TodaySummary = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.55;
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

const PartyName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const PartySummary = styled.p<{ $expanded?: boolean }>`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.6;
  ${({ $expanded }) =>
    !$expanded &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ConversationBubble = styled.div<{ $party: string }>`
  max-width: 85%;
  align-self: ${({ $party }) => ($party === '국민의힘' ? 'flex-end' : 'flex-start')};
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 10px;
  padding: 6px 10px;
`;

const BubbleParty = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote09};
  margin-bottom: 4px;
`;

const BubbleText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote12};
  margin: 0;
  line-height: 1.45;
`;

const PartyExpandBtn = styled.button`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote07};
  background: none;
  border: none;
  padding: 4px 0 0;
  cursor: pointer;
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
