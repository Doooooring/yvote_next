import { useMemo, useState } from 'react';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import TimelineList from '@components/news/timeline';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { commentType } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { NewsTypeLayoutProps } from './default';

export default function WeeklyNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();
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
  const [summaryViewMode, setSummaryViewMode] = useState<'type' | 'date'>('type');
  const [mobileSelectedType, setMobileSelectedType] = useState<number>(0);
  const [mobileSelectedDate, setMobileSelectedDate] = useState<number>(0);

  // Parse summaries as JSON (date/summary entries per commentType)
  const parsedSummaries = useMemo(() => {
    type DateEntry = { date: string; summary: string };
    type ParsedSummary = {
      commentType: commentType;
      entries: DateEntry[];
    };

    const SUMMARY_ORDER: string[] = [
      commentType.와이보트,
      commentType.헌법재판소,
      commentType.청와대,
      commentType.대통령실,
      commentType.행정부,
      // Conservative lineage (oldest → newest)
      commentType.한나라당,
      commentType.새누리당,
      commentType.자유한국당,
      commentType.미래통합당,
      commentType.국민의힘,
      // Progressive lineage (oldest → newest)
      commentType.통합민주당,
      commentType.민주당,
      commentType.민주통합당,
      commentType.새정치민주연합,
      commentType.더불어민주당,
      commentType.기타,
    ];

    return (news.summaries ?? [])
      .map((s): ParsedSummary | null => {
        try {
          const parsed = JSON.parse(s.summary);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].date && parsed[0].summary) {
            return { commentType: s.commentType, entries: parsed };
          }
        } catch {
          return null;
        }
        return null;
      })
      .filter((ps): ps is ParsedSummary => ps !== null && ps.entries.length > 0)
      .sort((a, b) => {
        const ai = SUMMARY_ORDER.indexOf(a.commentType);
        const bi = SUMMARY_ORDER.indexOf(b.commentType);
        return (ai === -1 ? SUMMARY_ORDER.length : ai) - (bi === -1 ? SUMMARY_ORDER.length : bi);
      });
  }, [news.summaries]);

  // Group by date for the date view (merge all commentTypes under each date)
  const summariesByDate = useMemo(() => {
    if (parsedSummaries.length === 0) return null;
    const dateMap: Record<string, Array<{ commentType: commentType; summary: string }>> = {};

    for (const ps of parsedSummaries) {
      for (const entry of ps.entries) {
        if (!dateMap[entry.date]) dateMap[entry.date] = [];
        dateMap[entry.date].push({ commentType: ps.commentType, summary: entry.summary });
      }
    }

    // Items within each date are already in correct order since parsedSummaries is sorted
    return Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b));
  }, [parsedSummaries]);

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
                  onClick={() => showCommentModal(news.id, type as commentType, news.title)}
                />
              ))}
            </CommentIcons>
          ) : null}
        </div>
      </Header>

      <Section>
        <SectionTitle>타임라인</SectionTitle>
        <SectionBody>
          <TimelineList timeline={timelineGroups} />
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle>브리핑 및 기타 반응</SectionTitle>
        <SectionBody>
          <ViewToggle>
            <ViewToggleButton
              data-active={summaryViewMode === 'type'}
              onClick={() => setSummaryViewMode('type')}
            >
              유형별
            </ViewToggleButton>
            <ViewToggleButton
              data-active={summaryViewMode === 'date'}
              onClick={() => setSummaryViewMode('date')}
            >
              날짜별
            </ViewToggleButton>
          </ViewToggle>

          {/* Desktop layout */}
          <DesktopOnly>
            {summaryViewMode === 'type' ? (
              <SummaryList>
                {parsedSummaries.map((ps, idx) => (
                  <SummaryListItem key={ps.commentType + idx}>
                    <CommentTypeIcon type={ps.commentType} />
                    <SummaryByType>
                      {ps.entries.map((e, i) => (
                        <div key={i}>
                          <DateLabel>{formatSummaryDate(e.date)}</DateLabel>
                          <SummaryHtml dangerouslySetInnerHTML={{ __html: e.summary }} />
                        </div>
                      ))}
                    </SummaryByType>
                  </SummaryListItem>
                ))}
              </SummaryList>
            ) : summariesByDate ? (
              <SummaryList>
                {summariesByDate.map(([date, items]) => (
                  <DateGroup key={date}>
                    <DateHeader>{formatSummaryDate(date)}</DateHeader>
                    {items.map((item, idx) => (
                      <SummaryListItem key={item.commentType + idx}>
                        <CommentTypeIcon type={item.commentType} />
                        <SummaryHtml dangerouslySetInnerHTML={{ __html: item.summary }} />
                      </SummaryListItem>
                    ))}
                  </DateGroup>
                ))}
              </SummaryList>
            ) : (
              <PlaceholderText>날짜별 보기를 지원하지 않는 뉴스입니다</PlaceholderText>
            )}
          </DesktopOnly>

          {/* Mobile layout */}
          <MobileOnly>
            {summaryViewMode === 'type' ? (
              <>
                <MobileTypeTabs>
                  {parsedSummaries.map((ps, idx) => (
                    <MobileTypeTab
                      key={ps.commentType + idx}
                      $active={mobileSelectedType === idx}
                      onClick={() => setMobileSelectedType(idx)}
                    >
                      <CommentTypeIcon type={ps.commentType} size={12} />
                      <span>{ps.commentType}</span>
                    </MobileTypeTab>
                  ))}
                </MobileTypeTabs>
                {parsedSummaries[mobileSelectedType] && (
                  <MobileSummaryEntries>
                    {parsedSummaries[mobileSelectedType].entries.map((e, i) => (
                      <MobileSummaryEntry key={i}>
                        <DateLabel>{formatSummaryDate(e.date)}</DateLabel>
                        <SummaryHtml dangerouslySetInnerHTML={{ __html: e.summary }} />
                      </MobileSummaryEntry>
                    ))}
                  </MobileSummaryEntries>
                )}
              </>
            ) : summariesByDate ? (
              <>
                <MobileTypeTabs>
                  {summariesByDate.map(([date], idx) => (
                    <MobileTypeTab
                      key={date}
                      $active={mobileSelectedDate === idx}
                      onClick={() => setMobileSelectedDate(idx)}
                    >
                      <span>{formatSummaryDate(date, true)}</span>
                    </MobileTypeTab>
                  ))}
                </MobileTypeTabs>
                {summariesByDate[mobileSelectedDate] && (
                  <MobileSummaryEntries>
                    {summariesByDate[mobileSelectedDate][1].map((item, idx) => (
                      <MobileDateItem key={item.commentType + idx}>
                        <CommentTypeIcon type={item.commentType} size={12} />
                        <SummaryHtml dangerouslySetInnerHTML={{ __html: item.summary }} />
                      </MobileDateItem>
                    ))}
                  </MobileSummaryEntries>
                )}
              </>
            ) : (
              <PlaceholderText>날짜별 보기를 지원하지 않는 뉴스입니다</PlaceholderText>
            )}
          </MobileOnly>
        </SectionBody>
      </Section>
    </Wrapper>
  );
}

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

const SectionBody = styled.div`
  padding: 0 6px;

  @media (max-width: 768px) {
    padding: 0 10px;
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

const ViewToggle = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

const ViewToggleButton = styled.button`
  padding: 5px 12px;
  font-size: 0.82rem;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  border-radius: 2px;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote08};
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s, border-color 0.15s;

  &[data-active='true'] {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote13};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote13};
  }
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileTypeTabs = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MobileTypeTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.yvote13 : theme.colors.yvote05)};
  border-radius: 2px;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote13 : theme.colors.yvote08)};
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s, border-color 0.15s;

  img {
    border-radius: 4px;
    flex-shrink: 0;
  }
`;

const MobileSummaryEntries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MobileSummaryEntry = styled.div`
  padding: 8px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote05};

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.yvote07};
  text-align: center;
  padding: 2rem 0;
  font-size: 0.95rem;
`;

const SummaryByType = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const DateLabel = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote08};
  margin-bottom: 2px;
`;

const DateGroup = styled.div`
  padding: 8px 0 4px;
`;

const DateHeader = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  padding: 8px 0 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote05};
  margin-bottom: 4px;
`;

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function formatSummaryDate(date: string, withDay = false) {
  const match = date.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!match) return date;
  const [, year, month, day] = match;
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  const dayOfWeek = withDay
    ? ` (${DAY_NAMES[new Date(parseInt(year, 10), m - 1, d).getDay()]})`
    : '';
  const currentYear = new Date().getFullYear().toString();
  if (year !== currentYear) {
    return `${year}년 ${m}월 ${d}일${dayOfWeek}`;
  }
  return `${m}월 ${d}일${dayOfWeek}`;
}

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
  font-size: 0.9rem;

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

const MobileDateItem = styled.div`
  padding: 6px 0;
  overflow: hidden;

  img {
    float: left;
    margin-right: 6px;
    margin-top: 3px;
  }

  ${SummaryHtml} {
    display: block;
    margin-left: 0;
  }
`;
