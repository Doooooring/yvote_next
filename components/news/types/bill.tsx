import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import SharedTimelineList from '@components/news/timeline';
import { customTheme } from '@public/assets/theme';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { BillItem, commentType } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { NewsTypeLayoutProps } from './default';

type BillArticle = { title: string; contentHtml: string };

const CIRCLED_NUM = /^[\u2460-\u2473\u3251-\u325F\u32B1-\u32BF]/;
const NUMBERED = /^\d+(?:의\d+)?\.\s?/;
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
      const title = el.querySelector('li')?.innerHTML?.trim() || '';
      current = { title, contentHtml: '' };
    } else if (current) {
      if (el.tagName === 'P') classifyParagraph(el);
      current.contentHtml += el.outerHTML;
    }
  });
  if (current && (current as BillArticle).contentHtml) articles.push(current);
  return articles;
}

function toEffectiveBills(news: NewsTypeLayoutProps['news']): BillItem[] {
  const d = news.detail;
  if (d?.bills && d.bills.length > 0) return d.bills;
  // Legacy single-bill fallback — wrap flat fields into one pseudo-item.
  const hasAny =
    !!(d?.billDetail ?? '').trim() ||
    !!(d?.billVoteResult ?? '') ||
    !!(d?.billVoteTotal ?? 0) ||
    (d?.billVoteByParty ?? []).length > 0;
  if (!hasAny) return [];
  return [
    {
      billNo: '',
      billName: '',
      detail: d?.billDetail,
      voteResult: d?.billVoteResult,
      voteTotal: d?.billVoteTotal,
      voteByParty: d?.billVoteByParty,
    },
  ];
}

export default function BillNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();

  const effectiveBills = useMemo(() => toEffectiveBills(news), [news]);
  const [billIndex, setBillIndex] = useState(0);
  useEffect(() => {
    setBillIndex((i) => (i >= effectiveBills.length ? 0 : i));
  }, [effectiveBills.length]);

  const currentBill: BillItem | null = effectiveBills[billIndex] ?? null;
  const hasMultipleBills = effectiveBills.length > 1;

  const gotoPrev = useCallback(() => {
    setBillIndex((i) => (i <= 0 ? effectiveBills.length - 1 : i - 1));
  }, [effectiveBills.length]);
  const gotoNext = useCallback(() => {
    setBillIndex((i) => (i >= effectiveBills.length - 1 ? 0 : i + 1));
  }, [effectiveBills.length]);

  // Keyboard: left/right arrows navigate between bills.
  // Ignored when focus is in a form field or contenteditable area.
  useEffect(() => {
    if (!hasMultipleBills) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        gotoPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        gotoNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasMultipleBills, gotoPrev, gotoNext]);

  // Touch swipe handlers (mobile).
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultipleBills) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    },
    [hasMultipleBills],
  );
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null || touchStartY.current == null) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - touchStartX.current;
      const dy = endY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;
      // Require mostly-horizontal swipe >60px to avoid false positives during scroll.
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) gotoNext();
        else gotoPrev();
      }
    },
    [gotoPrev, gotoNext],
  );

  const [billArticles, setBillArticles] = useState<BillArticle[]>([]);
  useEffect(() => {
    setBillArticles(parseBillArticles(currentBill?.detail ?? ''));
  }, [currentBill?.detail]);

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
      titles.forEach((title) => {
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

  // Vote summary — per-bill, derived from currentBill.voteByParty
  const partyVotes = currentBill?.voteByParty ?? [];
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
  const totalVotes = currentBill?.voteTotal ?? 0;

  // Vote detail toggle
  const [showVoteDetail, setShowVoteDetail] = useState(false);

  // Mobile tab state
  const [activeTab, setActiveTab] = useState(0);

  const debateSlides = useMemo(() => {
    return [
      { label: '찬성', content: news.proDebate ?? '' },
      { label: '반대', content: news.conDebate ?? '' },
    ];
  }, [news.proDebate, news.conDebate]);

  return (
    <Wrapper>
      <Header>
        <h1>{news.title}</h1>
        {news.subTitle ? <p className="subtitle">{news.subTitle}</p> : null}
        <div className="meta">
          {news.date ? <span>{getDotDateForm(news.date)}</span> : null}
          {commentTypes.length ? (
            <CommentIcons>
              {commentTypes.map((type, index) => (
                <CommentTypeIcon
                  key={`${type}-${index}`}
                  type={type as commentType}
                  size={12}
                  onClick={() =>
                    showCommentModal(news.id, type as commentType, news.title, { commentTypes })
                  }
                />
              ))}
            </CommentIcons>
          ) : null}
        </div>
      </Header>

      <Section>
        <SectionTitle>타임라인</SectionTitle>
        <SectionBody>
          <SharedTimelineList timeline={timelineGroups} flat />
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle>법안 요약</SectionTitle>
        <SectionBody>
          <SummaryHtml
            style={{ display: 'block', marginLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: news.detail?.billSummary ?? '' }}
          />
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle>본회의 표결 및 토론</SectionTitle>
        <SectionBody>
          {totalVotes > 0 && (
            <BillSwipeBlock onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {hasMultipleBills && (
                <BillNav>
                  <NavButton onClick={gotoPrev} aria-label="이전 법안">
                    ◀
                  </NavButton>
                  <BillNavLabel>
                    <span className="index">
                      {billIndex + 1} / {effectiveBills.length}
                    </span>
                    <span className="name">{currentBill?.billName ?? ''}</span>
                  </BillNavLabel>
                  <NavButton onClick={gotoNext} aria-label="다음 법안">
                    ▶
                  </NavButton>
                </BillNav>
              )}
              <VoteSummarySection>
                {currentBill?.voteResult && (
                  <VoteResultBadge>{currentBill.voteResult}</VoteResultBadge>
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
                  <VoteBarSegment
                    $width={(voteTotals.for / totalVotes) * 100}
                    $color={customTheme.colors.yvote12}
                  />
                  <VoteBarSegment
                    $width={(voteTotals.against / totalVotes) * 100}
                    $color={customTheme.colors.yvote08}
                  />
                  <VoteBarSegment
                    $width={(voteTotals.abstain / totalVotes) * 100}
                    $color={customTheme.colors.yvote07}
                  />
                  <VoteBarSegment
                    $width={(voteTotals.absent / totalVotes) * 100}
                    $color={customTheme.colors.yvote04}
                  />
                </VoteBar>
                {partyVotes.length > 0 && (
                  <>
                    <VoteDetailToggle onClick={() => setShowVoteDetail(!showVoteDetail)}>
                      상세보기 {showVoteDetail ? '▴' : '▾'}
                    </VoteDetailToggle>
                    {showVoteDetail &&
                      (() => {
                        const sorted = [...partyVotes].sort((a, b) => {
                          const denomA = a.for + a.against + a.abstain + a.absent;
                          const denomB = b.for + b.against + b.abstain + b.absent;
                          const ratioA = denomA > 0 ? a.for / denomA : 0;
                          const ratioB = denomB > 0 ? b.for / denomB : 0;
                          return ratioB - ratioA;
                        });
                        return (
                          <VoteDetailTable>
                            <thead>
                              <tr>
                                <th />
                                {sorted.map((pv, idx) => (
                                  <th key={idx}>{pv.party}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>찬성</td>
                                {sorted.map((pv, i) => (
                                  <td key={i}>{pv.for}</td>
                                ))}
                              </tr>
                              <tr>
                                <td>반대</td>
                                {sorted.map((pv, i) => (
                                  <td key={i}>{pv.against}</td>
                                ))}
                              </tr>
                              <tr>
                                <td>기권</td>
                                {sorted.map((pv, i) => (
                                  <td key={i}>{pv.abstain}</td>
                                ))}
                              </tr>
                              <tr>
                                <td>불참</td>
                                {sorted.map((pv, i) => (
                                  <td key={i}>{pv.absent}</td>
                                ))}
                              </tr>
                            </tbody>
                          </VoteDetailTable>
                        );
                      })()}
                  </>
                )}
              </VoteSummarySection>
            </BillSwipeBlock>
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

          {/* Mobile: toggle tabs */}
          <MobileDebateWrapper>
            <DebateTabs>
              {debateSlides.map((slide, i) => (
                <DebateTab key={i} $active={i === activeTab} onClick={() => setActiveTab(i)}>
                  {slide.label}
                </DebateTab>
              ))}
            </DebateTabs>
            <DebateTabContent
              dangerouslySetInnerHTML={{ __html: debateSlides[activeTab]?.content ?? '' }}
            />
          </MobileDebateWrapper>
        </SectionBody>
      </Section>

      {effectiveBills.length > 0 && (
        <Section>
          <SectionTitle>법안 상세보기</SectionTitle>
          <SectionBody>
            <BillSwipeBlock onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {hasMultipleBills && (
                <BillNav>
                  <NavButton onClick={gotoPrev} aria-label="이전 법안">
                    ◀
                  </NavButton>
                  <BillNavLabel>
                    <span className="index">
                      {billIndex + 1} / {effectiveBills.length}
                    </span>
                    <span className="name">{currentBill?.billName ?? ''}</span>
                  </BillNavLabel>
                  <NavButton onClick={gotoNext} aria-label="다음 법안">
                    ▶
                  </NavButton>
                </BillNav>
              )}
              {billArticles.length > 0 ? (
                <BillArticleGroups>
                  {billArticles.map((article, idx) => (
                    <BillArticleGroup key={idx}>
                      <summary>
                        <span dangerouslySetInnerHTML={{ __html: article.title }} />
                      </summary>
                      <BillArticleContent
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                      />
                    </BillArticleGroup>
                  ))}
                </BillArticleGroups>
              ) : (
                <EmptyBillDetail>상세 내용이 등록되지 않았습니다.</EmptyBillDetail>
              )}
            </BillSwipeBlock>
          </SectionBody>
        </Section>
      )}

      <Section>
        <SectionTitle>브리핑 및 기타 반응</SectionTitle>
        <SectionBody>
          <SummaryList>
            {(news.summaries ?? [])
              .filter((s) => s.summary?.replace(/<[^>]*>/g, '').trim())
              .map((summary, idx) => (
                <SummaryListItem key={summary.commentType + idx}>
                  <CommentTypeIcon type={summary.commentType} />
                  <SummaryHtml dangerouslySetInnerHTML={{ __html: summary.summary }} />
                </SummaryListItem>
              ))}
          </SummaryList>
        </SectionBody>
      </Section>
    </Wrapper>
  );
}

// --- Styled Components ---

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.yvote02};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 60px;

  @media (max-width: 768px) {
    padding: 12px 0 40px;
  }
`;

const Header = styled.header`
  width: 92%;
  max-width: 1200px;
  padding: 0 0 16px;

  @media (max-width: 768px) {
    width: 96%;
  }

  h1 {
    font-family: 'Noto Serif KR', Georgia, serif;
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .subtitle {
    color: ${({ theme }) => theme.colors.yvote09};
    line-height: 1.6;
    margin: 0 0 8px;
    font-size: 14px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: ${({ theme }) => theme.colors.yvote08};
    font-size: 13px;
  }
`;

const CommentIcons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Section = styled.section`
  width: 92%;
  max-width: 1200px;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  padding: 12px 0 0;
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
  margin: 0 0 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SectionBody = styled.div`
  padding: 0 6px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

// Per-bill swipe navigation

const BillSwipeBlock = styled.div`
  touch-action: pan-y;
`;

const BillNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 4px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin-bottom: 12px;
`;

const NavButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  color: ${({ theme }) => theme.colors.yvote12};
  border-radius: 999px;
  width: 32px;
  height: 32px;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.yvote03};
  }
`;

const BillNavLabel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;

  .index {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.yvote08};
    letter-spacing: 0.04em;
  }

  .name {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.yvote12};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .name {
      font-size: 13px;
    }
  }
`;

const EmptyBillDetail = styled.div`
  padding: 16px 0;
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 0.9rem;
  text-align: center;
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
    color: ${({ theme }) => theme.colors.yvote12};
    padding: 6px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '▾';
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.yvote08};
    margin-left: 4px;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }
`;

const BillArticleContent = styled.div`
  padding: 8px 0 0;
  color: ${({ theme }) => theme.colors.yvote12};
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
  padding: 14px 0;
`;

const DebateLabel = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.yvote05};
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

const DebateContent = styled.div`
  color: ${({ theme }) => theme.colors.yvote12};
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
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote05};
`;

const VoteResultBadge = styled.div`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote11};
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
  color: ${({ theme }) => theme.colors.yvote13};
`;

const VoteCountLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const VoteBar = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.yvote01};
`;

const VoteBarSegment = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  min-width: ${({ $width }) => ($width > 0 ? '2px' : '0')};
`;

const VoteDetailToggle = styled.button`
  display: block;
  margin: 12px auto 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
  }
`;

const VoteDetailTable = styled.table`
  width: 100%;
  margin-top: 12px;
  border-collapse: collapse;
  font-size: 0.85rem;

  th {
    padding: 6px 8px;
    text-align: center;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.yvote12};
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  }

  td {
    padding: 6px 8px;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote01};
  }

  td:first-child {
    text-align: left;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.yvote08};
  }
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
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.yvote13 : theme.colors.yvote05)};
  border-radius: 2px;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote13 : theme.colors.yvote08)};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
`;

const DebateTabContent = styled.div`
  padding: 14px 0;
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.6;
  font-size: 0.95rem;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }
`;

// Timeline styles

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
  border-top: 1px solid ${({ theme }) => theme.colors.yvote05};

  &:first-child {
    border-top: none;
    padding-top: 8px;
  }
`;

const SummaryHtml = styled.div`
  display: inline;
  margin-left: 6px;
  color: ${({ theme }) => theme.colors.yvote12};
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
