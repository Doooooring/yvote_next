import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';
import { customTheme } from '@public/assets/theme';

type BillArticle = { title: string; contentHtml: string };

const CIRCLED_NUM = /^[\u2460-\u2473\u3251-\u325F\u32B1-\u32BF]/;
const NUMBERED = /^\d+(?:의\d+)?\.\s/;
const LETTERED = /^[가-힣]\.\s/;

function classifyParagraph(el: Element) {
  const text = el.textContent?.trim() ?? '';
  if (CIRCLED_NUM.test(text)) el.classList.add('bill-circled');
  else if (NUMBERED.test(text)) el.classList.add('bill-numbered');
  else if (LETTERED.test(text)) el.classList.add('bill-lettered');
}

function parseBillArticles(html: string): BillArticle[] {
  if (!html?.trim()) return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const articles: BillArticle[] = [];
  let current: BillArticle | null = null;

  Array.from(doc.body.children).forEach((el) => {
    if (el.tagName === 'UL') {
      if (current && current.contentHtml) articles.push(current);
      const title = el.querySelector('li')?.textContent?.trim() || '';
      current = { title, contentHtml: '' };
    } else if (current) {
      if (el.tagName === 'P') classifyParagraph(el);
      current.contentHtml += el.outerHTML;
    }
  });
  if (current && (current as BillArticle).contentHtml) articles.push(current);
  return articles;
}

export default function BillNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();

  const [billArticles, setBillArticles] = useState<BillArticle[]>([]);
  useEffect(() => {
    setBillArticles(parseBillArticles(news.billSummary ?? ''));
  }, [news.billSummary]);

  const timelineGroups = useMemo(() => {
    const groups: Record<string, Array<{ title: string; type: commentType }>> = {};
    (news.timeline ?? []).forEach((tl) => {
      const dateKey = tl.date ? getDotDateForm(tl.date) : '날짜 미상';
      const titles = tl.title
        .split('$')
        .map((t) => t.trim())
        .filter(Boolean);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      titles.forEach(title => {
        groups[dateKey].push({ title, type: tl.commentType ?? commentType.기타 });
      });
    });
    return Object.entries(groups);
  }, [news.timeline]);
  const commentTypes = useMemo(
    () =>
      [...(news.comments ?? [])].sort(
        (a, b) => getCommentTypeRank(b as commentType) - getCommentTypeRank(a as commentType),
      ),
    [news.comments],
  );

  // Vote summary — computed from billVoteByParty
  const partyVotes = news.billVoteByParty ?? [];
  const voteTotals = useMemo(() => {
    const sums = { for: 0, against: 0, abstain: 0, absent: 0 };
    partyVotes.forEach((pv) => {
      sums.for += pv.for;
      sums.against += pv.against;
      sums.abstain += pv.abstain;
      sums.absent += pv.absent;
    });
    return sums;
  }, [partyVotes]);
  const totalVotes = news.billVoteTotal ?? 0;

  // Mobile tab state
  const [activeTab, setActiveTab] = useState(0);

  const debateSlides = useMemo(() => {
    const slides = [
      { label: '찬성', content: news.proDebate ?? '' },
      { label: '반대', content: news.conDebate ?? '' },
    ];
    if (news.etcDebate) slides.push({ label: '기타', content: news.etcDebate });
    return slides;
  }, [news.proDebate, news.conDebate, news.etcDebate]);

  return (
    <Wrapper>
      <Content>
        <Header>
          <div className="header-text">
            <h1>{news.title}</h1>
            {news.subTitle ? <p className="subtitle">{news.subTitle}</p> : null}
            <div className="meta">
              {news.date ? <span>{getDotDateForm(news.date)}</span> : null}
              {commentTypes.length ? (
                <CommentIcons>
                  {commentTypes.map((type, index) => (
                    <CommentIconButton
                      key={`${type}-${index}`}
                      image={commentTypeImg(type as commentType)}
                      onClick={() => showCommentModal(news.id, type as commentType)}
                      aria-label={`${type} 평론 보기`}
                    />
                  ))}
                </CommentIcons>
              ) : null}
            </div>
          </div>
        </Header>

        <Grid>
          <Card>
            <SectionTitle>타임라인</SectionTitle>
            <TimelineList timeline={timelineGroups} />
          </Card>

          {billArticles.length > 0 && (
            <Card>
              <SectionTitle>법안 요약</SectionTitle>
              <BillArticleGroups>
                {billArticles.map((article, idx) => (
                  <BillArticleGroup key={idx}>
                    <summary>
                      <span>{article.title}</span>
                    </summary>
                    <BillArticleContent dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                  </BillArticleGroup>
                ))}
              </BillArticleGroups>
            </Card>
          )}

          <Card>
            <SectionTitle>본회의 표결 및 찬반 토론</SectionTitle>

            {totalVotes > 0 && (
              <VoteSummarySection>
                {news.billVoteResult && (
                  <VoteResultBadge>{news.billVoteResult}</VoteResultBadge>
                )}
                <VoteNumbers>
                  <VoteItem>
                    <VoteCount>{voteTotals.for}</VoteCount>
                    <VoteCountLabel>찬성</VoteCountLabel>
                  </VoteItem>
                  <VoteItem>
                    <VoteCount>{voteTotals.against}</VoteCount>
                    <VoteCountLabel>반대</VoteCountLabel>
                  </VoteItem>
                  <VoteItem>
                    <VoteCount>{voteTotals.abstain}</VoteCount>
                    <VoteCountLabel>기권</VoteCountLabel>
                  </VoteItem>
                  <VoteItem>
                    <VoteCount>{voteTotals.absent}</VoteCount>
                    <VoteCountLabel>불참</VoteCountLabel>
                  </VoteItem>
                </VoteNumbers>
                <VoteBar>
                  <VoteBarSegment $width={(voteTotals.for / totalVotes) * 100} $color="#1e293b" />
                  <VoteBarSegment $width={(voteTotals.against / totalVotes) * 100} $color="#64748b" />
                  <VoteBarSegment $width={(voteTotals.abstain / totalVotes) * 100} $color="#94a3b8" />
                  <VoteBarSegment $width={(voteTotals.absent / totalVotes) * 100} $color="#e2e8f0" />
                </VoteBar>
              </VoteSummarySection>
            )}

            {/* PC: side by side */}
            <DebateGrid>
              <DebateSide>
                <DebateLabel>찬성</DebateLabel>
                <DebateContent dangerouslySetInnerHTML={{ __html: news.proDebate ?? '' }} />
              </DebateSide>
              <DebateSide>
                <DebateLabel>반대</DebateLabel>
                <DebateContent dangerouslySetInnerHTML={{ __html: news.conDebate ?? '' }} />
              </DebateSide>
            </DebateGrid>
            <EtcDebateBox $show={!!news.etcDebate}>
              <DebateLabel>기타</DebateLabel>
              <DebateContent dangerouslySetInnerHTML={{ __html: news.etcDebate ?? '' }} />
            </EtcDebateBox>

            {/* Mobile: toggle tabs */}
            <MobileDebateWrapper>
              <DebateTabs>
                {debateSlides.map((slide, i) => (
                  <DebateTab
                    key={i}
                    $active={i === activeTab}
                    onClick={() => setActiveTab(i)}
                  >
                    {slide.label}
                  </DebateTab>
                ))}
              </DebateTabs>
              <DebateTabContent
                dangerouslySetInnerHTML={{ __html: debateSlides[activeTab]?.content ?? '' }}
              />
            </MobileDebateWrapper>
          </Card>

          <Card>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
            <SummaryList>
              {(news.summaries ?? []).filter(s => s.summary?.replace(/<[^>]*>/g, '').trim()).map((summary, idx) => (
                <SummaryListItem key={summary.commentType + idx}>
                  <CommentTypeIcon type={summary.commentType} />
                  <SummaryHtml
                    dangerouslySetInnerHTML={{ __html: summary.summary }}
                  />
                </SummaryListItem>
              ))}
            </SummaryList>
          </Card>
        </Grid>
      </Content>
    </Wrapper>
  );
}

// --- CommentTypeIcon ---

const CommentTypeIcon = ({ type }: { type: commentType }) => (
  <CommentTypeIconWrapper>
    <img
      src={commentTypeImg(type)}
      alt={type}
      style={{ width: 16, height: 16, verticalAlign: 'middle' }}
    />
  </CommentTypeIconWrapper>
);

// --- TimelineList ---

type TimelineItem = { title: string; type: commentType };
type TimelineListProps = {
  timeline: [string, TimelineItem[]][];
};

const TimelineList = ({ timeline }: TimelineListProps) => {
  if (!timeline || timeline.length === 0) return <TimelineEmpty>타임라인이 없습니다.</TimelineEmpty>;
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const currentYear = new Date().getFullYear().toString();

  function formatKoreanDate(date: string) {
    const match = date.match(/^(?:(\d{4})[.\-])?(\d{1,2})[.\-](\d{1,2})/);
    if (!match) return date;
    const [, year, month, day] = match;
    if (year && year !== currentYear) {
      return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
    }
    return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  }

  return (
    <TimelineListLayout>
      {timeline.map(([date, items]) => {
        const displayDate = formatKoreanDate(date);
        const count = items.length;
        const isOpen = !!expanded[date];
        return (
          <TimelineListItem key={date}>
            <TimelineRow>
              <TimelineDate>{displayDate}</TimelineDate>
              <TimelineControls>
                <TimelineTypeRow
                  data-open={isOpen}
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded((prev) => ({ ...prev, [date]: !isOpen }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpanded((prev) => ({ ...prev, [date]: !isOpen }));
                    }
                  }}
                  aria-label={isOpen ? '접기' : '펼치기'}
                >
                  <TimelineIconButton aria-hidden="true">
                    <TimelineCountText>
                      {count}건
                    </TimelineCountText>
                  </TimelineIconButton>
                </TimelineTypeRow>
              </TimelineControls>
            </TimelineRow>
            {isOpen && (
              <TimelineExpandableGrid>
                {items.map((item, idx) => (
                  <TimelineExpandableItem key={`${date}-${idx}`}>
                    <CommentTypeIcon type={item.type} /> {item.title}
                  </TimelineExpandableItem>
                ))}
              </TimelineExpandableGrid>
            )}
          </TimelineListItem>
        );
      })}
    </TimelineListLayout>
  );
};

// --- Styled Components ---

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const Content = styled.div`
  width: 98%;
  max-width: 1120px;
  color: #0f172a;

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const Header = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 22px;
  display: block;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

  .header-text h1 {
    margin: 8px 0 6px;
    font-size: 1.6rem;
    line-height: 1.4;
  }

  .subtitle {
    color: #475569;
    line-height: 1.6;
    margin: 0 0 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const CommentIcons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const CommentIconButton = styled.button<{ image: string }>`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  background-image: url(${({ image }) => image});
  background-size: 14px 14px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  padding: 0;
`;

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const Card = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: #0f172a;
`;

const CommentTypeIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-left: 4px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  box-sizing: border-box;
`;

// Bill article styles

const BillArticleGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BillArticleGroup = styled.details`
  border: none;
  background: transparent;
  padding: 0;

  summary {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    cursor: pointer;
    font-weight: 500;
    color: #1e293b;
    padding: 6px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '▾';
    font-size: 0.85rem;
    color: #64748b;
    margin-left: 4px;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }
`;

const BillArticleContent = styled.div`
  padding: 8px 0 0;
  color: #1e293b;
  line-height: 1.6;
  font-size: 1rem;
  word-break: break-word;

  s {
    text-decoration: line-through;
    text-decoration-thickness: 0.8px;
    color: ${customTheme.colors.gray700};
  }

  p {
    margin: 0 0 6px;
  }

  p:has(strong) {
    margin-top: 20px;
  }

  p:first-child:has(strong) {
    margin-top: 0;
  }

  p:has(> br:only-child) {
    margin: 0;
    line-height: 0.8;
  }

  p.bill-circled {
    padding-left: 1.1em;
    text-indent: -1.1em;
  }

  p.bill-numbered {
    padding-left: 3em;
    text-indent: -1.5em;
  }

  p.bill-lettered {
    padding-left: 4em;
    text-indent: -1.5em;
  }

  p.ql-align-center {
    text-align: center;
  }

`;

// Debate styles

const DebateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const DebateSide = styled.div`
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: #fafafa;
`;

const DebateLabel = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  background: transparent;
  border: 1.5px solid #cbd5e1;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

const EtcDebateBox = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: #fafafa;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const DebateContent = styled.div`
  color: #1e293b;
  line-height: 1.6;
  font-size: 0.95rem;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }
`;

// Vote summary styles

const VoteSummarySection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
`;

const VoteResultBadge = styled.div`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
`;

const VoteNumbers = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 12px;
`;

const VoteItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const VoteCount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
`;

const VoteCountLabel = styled.span`
  font-size: 0.8rem;
  color: #64748b;
`;

const VoteBar = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #f1f5f9;
`;

const VoteBarSegment = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  min-width: ${({ $width }) => ($width > 0 ? '2px' : '0')};
`;

// Mobile debate tabs (mobile only)

const MobileDebateWrapper = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const DebateTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DebateTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border: 1.5px solid ${({ $active }) => ($active ? '#1e293b' : '#cbd5e1')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#1e293b' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#1e293b')};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const DebateTabContent = styled.div`
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: #fafafa;
  color: #1e293b;
  line-height: 1.6;
  font-size: 0.95rem;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }
`;

// Timeline styles

const TimelineListLayout = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TimelineListItem = styled.li`
  padding: 0 0 1rem;
`;

const TimelineDate = styled.div`
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 400;
  display: flex;
  align-self: center;
  align-items: center;
  line-height: 1.2;
`;

const TimelineRow = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e2e8f0;
`;

const TimelineControls = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;
`;

const TimelineTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #1e293b;

  &::after {
    content: '▾';
    font-size: 0.85rem;
    color: #64748b;
    margin-left: 6px;
    transition: transform 0.18s;
  }

  &[data-open='true']::after {
    transform: rotate(180deg);
  }
`;

const TimelineIconButton = styled.button`
  display: flex;
  align-items: center;
  align-self: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
`;

const TimelineCountText = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

const TimelineExpandableGrid = styled.ul`
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px 10px;
  width: 100%;
  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineExpandableItem = styled.li`
  font-size: 0.85rem;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  padding: 3px 0;
  border-left: 2px solid #e2e8f0;
  background: transparent;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const TimelineEmpty = styled.div`
  color: #aaa;
  text-align: center;
  padding: 1.5rem 0;
`;

// Summary styles

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SummaryListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 20px;
  border-top: 1px solid #e2e8f0;

  &:first-child {
    border-top: none;
    padding-top: 24px;
  }
`;

const SummaryHtml = styled.div`
  display: inline;
  margin-left: 6px;
  color: #1e293b;
  line-height: 1.6;
  font-size: 1rem;

  p {
    margin: 0 0 6px;
  }

  ul,
  ol {
    margin: 24px 0 6px 18px;
    padding: 0;
  }

  p:has(strong) {
    margin: 12px 0 4px;
  }
  word-break: break-word;

  ul li strong {
    font-weight: 500;
  }

  p strong {
    font-weight: 400;
  }
`;
