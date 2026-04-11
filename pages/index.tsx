import HeadMeta from '@components/common/HeadMeta';
import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { commentType } from '@utils/interface/news';

import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

/* ===== Dummy Data ===== */

const onAirNews = [
  { id: 959, title: '4월 2주차', tag: '자료 수집' },
  { id: 914, title: '26년 추가경정예산', tag: '국회 심의' },
  { id: 1136, title: '제14회 국무회의', tag: '진행 중' },
  { id: 950, title: '중대범죄수사청법', tag: '법안 공포' },
  { id: 915, title: '공소청 설치법안', tag: '법안 공포' },
  { id: 958, title: '도서관법 개정안', tag: '본회의 가결' },
  { id: 906, title: '인도네시아 국빈 방한', tag: '진행 중' },
];

const dbUpdates = {
  date: '4월 9일',
  summary: '자료 3건 추가',
  details: [
    { action: '자료 추가', items: [
      '#959 4월 2주차 — 청와대 +1, 행정부 +2',
    ]},
  ],
};

const todayNews = [
  { summary: '대통령 주재 수석·보좌관 회의 관련 전은수 대변인 브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '외교부 대변인 정례브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '국방부 일일 정례 브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '이시바 시게루 전 일본 총리 오찬 관련 수석대변인 서면 브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '화물운송·물류업계 종사자와의 대화 관련 대변인 서면 브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '에이치디씨(주)의 부당지원행위 제재', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '중동전쟁 관련 기자간담회 강훈식 비서실장 모두발언', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '보건복지부 의료제품 수급대응 관계부처 합동브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '이주노동자 에어건 인권침해 관련 홍보소통수석 서면브리핑', newsTitle: '4월 2주차', newsId: 959 },
  { summary: '제14회 국무회의 모두말씀', newsTitle: '제14회 국무회의', newsId: 1136 },
];

const partyPositions = [
  {
    party: '국민의힘',
    summary: '정부의 중동 전쟁 대응이 허둥대며 국민 불안을 키운다고 비판. 10배 강력해진 북핵 위협은 이재명 정부 굴종 외교의 결과라 지적. 의료 소모품 대란에 정부 총력 대응을 촉구.',
  },
  {
    party: '더불어민주당',
    summary: '국민의힘의 안보장사를 비판하며 한반도 평화에 초당적 협력을 요구. 추경 관련 지방 부담 증가 주장은 사실 왜곡을 넘어선 정치 선동이라 반박. 식목일에 탄소중립 실천 강조.',
  },
];

const partyConversation = [
  { party: '국민의힘', text: '정부가 허둥댈수록 전쟁 충격에 따른 국민 불안은 더욱 커집니다.' },
  { party: '더불어민주당', text: '선거 앞두고 또 안보장사입니까? 초당적으로 협력해야 합니다.' },
  { party: '국민의힘', text: '물약통도 주사기도 없다, 의료 소모품 대란에 정부는 총력 대응에 나서야 합니다.' },
  { party: '더불어민주당', text: '지방 부담 증가 주장은 사실 왜곡을 넘어선 정치 선동입니다.' },
];

const revivedNews = [
  { id: 902, title: '윤석열 임기 검찰 기소 관련 국정조사', lastUpdate: '2026-04-05', originalDate: '2026-03-05',
    added: [{ type: '국민의힘', count: 3 }, { type: '더불어민주당', count: 6 }] },
  { id: 749, title: '정부 도심 주택공급 확대 및 다주택자 규제', lastUpdate: '2026-04-05', originalDate: '2026-01-29',
    added: [{ type: '국민의힘', count: 3 }, { type: '더불어민주당', count: 1 }] },
  { id: 531, title: '제22대 국회 노란봉투법 (노조법 2, 3조 개정안)', lastUpdate: '2026-04-04', originalDate: '2025-08-24',
    added: [{ type: '국민의힘', count: 2 }, { type: '더불어민주당', count: 1 }] },
];



const ongoingVotes = [
  { id: 887, title: '3차 상법개정안', status: '필리버스터 진행', chamber: '국회', date: '2026-03-06' },
  { id: 665, title: '재판소원제도', status: '필리버스터 진행', chamber: '국회', date: '2026-03-12' },
];

const nextElection = {
  name: '제9회 전국동시지방선거',
  date: '2026-06-03',
  dday: 54,
};

const upcomingNews = [
  { id: 959, type: 'weekly', typeLabel: '주간', title: '4월 2주차', date: '2026-04-12', status: '자료 수집' },
  { id: 1136, type: 'cabinet', typeLabel: '국무회의', title: '제14회 국무회의', date: '2026-04-06', status: '작성 중' },
  { id: 956, type: 'original', typeLabel: '기타', title: '2026년도 1분기 경제지표', date: '2026-04-01', status: '작성 중' },
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
            <path d="M4 1h8l4 4v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M12 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <DeltaSymbol>Δ</DeltaSymbol>
        </DbUpdateIcon>
        <DbUpdateSummaryText ref={containerRef}>
          <MarqueeInner ref={textRef} $animate={overflow}>
            {summaryText}{overflow && `\u00A0\u00A0\u00A0\u00A0\u00A0${summaryText}`}
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
      <PartySummary ref={ref} $expanded={expanded}>{party.summary}</PartySummary>
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
  2: [[4.5, 4.5], [10.5, 10.5]],
  3: [[4.5, 4.5], [7.5, 7.5], [10.5, 10.5]],
  4: [[4.5, 4.5], [10.5, 4.5], [4.5, 10.5], [10.5, 10.5]],
  5: [[4.5, 4.5], [10.5, 4.5], [7.5, 7.5], [4.5, 10.5], [10.5, 10.5]],
  6: [[4.5, 4], [10.5, 4], [4.5, 7.5], [10.5, 7.5], [4.5, 11], [10.5, 11]],
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

const todaySummaryText = '이재명 대통령이 국회에서 중동 에너지 위기 대응을 위한 추가경정예산안 시정연설을 실시했다. 정부는 공공부문 차량 5부제와 에너지 절약 대책을 본격 시행하며, 프랑스 대통령 국빈방한 친교 만찬이 이어졌다. 교육부는 라이즈(RISE) 재구조화 방안을, 국토부는 광명 신안산선 터널 붕괴 조사결과를 발표했다. 트럼프 대국민 담화에 대한 청와대 브리핑이 있었고, 3월 소비자물가동향과 4월 시행법령도 공개됐다.';

function TodayNewsSection() {
  const [mode, setMode] = useState<'list' | 'summary'>('list');
  const [page, setPage] = useState(0);
  const [shuffled, setShuffled] = useState(todayNews);
  const [dice, setDice] = useState(() => Math.floor(Math.random() * 6) + 1);
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
          <RefreshBtn onClick={() => {
            if (mode === 'list') {
              setShuffled([...todayNews].sort(() => Math.random() - 0.5));
              setPage(0);
            }
            setDice(Math.floor(Math.random() * 6) + 1);
          }} title="새로고침">
            <DiceIcon face={dice} />
          </RefreshBtn>
        </TodayTitleRow>
        <ModeToggle>
          <ModeBtn $active={mode === 'list'} onClick={() => setMode('list')} title="목록">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="1.5" cy="2" r="1.5" fill="currentColor"/><rect x="5" y="1" width="9" height="2" rx="1" fill="currentColor"/><circle cx="1.5" cy="7" r="1.5" fill="currentColor"/><rect x="5" y="6" width="9" height="2" rx="1" fill="currentColor"/><circle cx="1.5" cy="12" r="1.5" fill="currentColor"/><rect x="5" y="11" width="9" height="2" rx="1" fill="currentColor"/></svg>
          </ModeBtn>
          <ModeBtn $active={mode === 'summary'} onClick={() => setMode('summary')} title="요약">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="0" y="1" width="14" height="5" rx="1" fill="currentColor"/><rect x="0" y="8" width="9" height="2" rx="1" fill="currentColor" opacity="0.6"/><rect x="0" y="12" width="6" height="2" rx="1" fill="currentColor" opacity="0.4"/></svg>
          </ModeBtn>
        </ModeToggle>
      </TodayHeader>
      <Divider />
      {mode === 'list' ? (
        <>
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <TodayList>
              {visible.map((item, i) => (
                <TodayItem key={page * TODAY_PER_PAGE + i} $read={read.has(page * TODAY_PER_PAGE + i)}>
                  <TodayItemContent>
                    <TodaySummary>{item.summary}</TodaySummary>
                    <TodayNewsLink href={`/news/${item.newsId}`}>
                      {item.newsTitle} →
                    </TodayNewsLink>
                  </TodayItemContent>
                  <ReadCheck
                    $checked={read.has(page * TODAY_PER_PAGE + i)}
                    onClick={() => {
                      const idx = page * TODAY_PER_PAGE + i;
                      setRead(prev => {
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="0.5" y="0.5" width="5.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1"/><rect x="8" y="0.5" width="5.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1"/></svg>
          </ModeBtn>
          <ModeBtn $active={mode === 'conversation'} onClick={() => setMode('conversation')} title="대화">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4l-2 2V2z" stroke="currentColor" strokeWidth="1"/><path d="M5 8v1a1 1 0 0 0 1 1h4l2 2V6a1 1 0 0 0-1-1h-1" stroke="currentColor" strokeWidth="1"/></svg>
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

function ChatAssistant({ screenContext }: { screenContext: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '같은 화면 보는 중이에요. 편하게 물어보세요.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiModel, setAiModel] = useState<'grok' | 'gpt'>('grok');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        fabRef.current && !fabRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/proxy-api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.role !== 'ai' || messages.indexOf(m) > 0).map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            text: m.text,
          })), { role: 'user', text: q }],
          model: aiModel,
          context: screenContext,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data?.result || '응답을 받지 못했습니다.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: '서버에 연결할 수 없습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChatFab ref={fabRef} onClick={() => setOpen(!open)} $open={open}>
        {open ? '✕' : 'AI'}
      </ChatFab>
      {open && (
        <ChatPanel ref={panelRef}>
          <ChatHeader>
            <ChatHeaderTitle>yVote AI</ChatHeaderTitle>
            <ChatHeaderRight>
              <ModelSelect>
                <ModelBtn $active={aiModel === 'grok'} onClick={() => setAiModel('grok')} title="Grok">
                  <ModelIcon src="/icons/grok.svg" alt="Grok" width={14} height={14} />
                </ModelBtn>
                <ModelBtn $active={aiModel === 'gpt'} onClick={() => setAiModel('gpt')} title="GPT">
                  <ModelIcon src="/icons/openai.svg" alt="GPT" width={14} height={14} />
                </ModelBtn>
              </ModelSelect>
              <ChatCloseBtn onClick={() => setOpen(false)}>✕</ChatCloseBtn>
            </ChatHeaderRight>
          </ChatHeader>
          <ChatMessages>
            {messages.map((m, i) => (
              <ChatBubble key={i} $role={m.role}>{m.text}</ChatBubble>
            ))}
            {loading && <ChatBubble $role="ai">...</ChatBubble>}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInputRow>
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="질문을 입력하세요"
            />
            <ChatSendBtn onClick={handleSend} disabled={loading || !input.trim()}>→</ChatSendBtn>
          </ChatInputRow>
        </ChatPanel>
      )}
    </>
  );
}

const PAGE_CONTEXT = [
  `주요 진행 뉴스: ${onAirNews.map(n => `${n.title}(${n.tag})`).join(', ')}`,
  `오늘의 소식: ${todayNews.map(n => n.summary).join('; ')}`,
  `정당 입장 — ${partyPositions.map(p => `${p.party}: ${p.summary}`).join(' / ')}`,
  `끌올뉴스: ${revivedNews.map(n => n.title).join(', ')}`,
  `진행중 표결: ${ongoingVotes.map(v => `${v.title}(${v.status})`).join(', ')}`,
  `예정된 뉴스: ${upcomingNews.map(n => n.title).join(', ')}`,
].join('\n');

export default function Home() {
  return (
    <>
      <HeadMeta />
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
      <ChatAssistant screenContext={PAGE_CONTEXT} />
    </>
  );
}

/* ===== Styles ===== */

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
  animation: ${({ $animate }) => $animate ? `${marquee} 12s linear infinite` : 'none'};
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
  background: ${({ $active, theme }) => $active ? theme.colors.yvote04 : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.yvote12 : theme.colors.yvote06};
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
  border: 1.5px solid ${({ $checked, theme }) => $checked ? theme.colors.yvote11 : theme.colors.yvote05};
  background: ${({ $checked, theme }) => $checked ? theme.colors.yvote11 : 'transparent'};
  flex-shrink: 0;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.15s;

  &::after {
    content: '';
    display: ${({ $checked }) => $checked ? 'block' : 'none'};
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
  background: ${({ $active, theme }) => $active ? theme.colors.yvote09 : theme.colors.yvote04};
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
  ${({ $expanded }) => !$expanded && `
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
  align-self: ${({ $party }) => $party === '국민의힘' ? 'flex-end' : 'flex-start'};
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
    gap: 0px;
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

/* ===== Chat Assistant ===== */

const ChatFab = styled.button<{ $open: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.yvote12};
  color: ${({ theme }) => theme.colors.yvote01};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: transform 0.2s;
  font-size: ${({ $open }) => $open ? '18px' : '13px'};
  font-weight: 700;
  letter-spacing: 1.5px;
  font-family: 'Courier New', monospace;

  &:hover {
    transform: scale(1.08);
  }
`;

const ChatPanel = styled.div`
  position: fixed;
  bottom: 84px;
  right: 24px;
  width: 320px;
  max-height: 420px;
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 80px;
    max-height: 60vh;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatHeaderTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModelSelect = styled.div`
  display: flex;
  gap: 2px;
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 6px;
  padding: 2px;
`;

const ModelBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active, theme }) => $active ? theme.colors.yvote01 : 'transparent'};
  opacity: ${({ $active }) => $active ? 1 : 0.35};
  transition: all 0.15s;
`;

const ModelIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const ChatCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote07};
  padding: 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 200px;
`;

const ChatBubble = styled.div<{ $role: 'user' | 'ai' }>`
  max-width: 80%;
  align-self: ${({ $role }) => $role === 'user' ? 'flex-end' : 'flex-start'};
  background: ${({ $role, theme }) => $role === 'user' ? theme.colors.yvote12 : theme.colors.yvote03};
  color: ${({ $role, theme }) => $role === 'user' ? theme.colors.yvote01 : theme.colors.yvote12};
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.45;
`;

const ChatInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 13px;
  background: ${({ theme }) => theme.colors.yvote02};
  color: ${({ theme }) => theme.colors.yvote12};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.yvote06};
  }
`;

const ChatSendBtn = styled.button`
  background: ${({ theme }) => theme.colors.yvote12};
  color: ${({ theme }) => theme.colors.yvote01};
  border: none;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
