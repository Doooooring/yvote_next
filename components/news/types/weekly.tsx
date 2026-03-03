import styled from 'styled-components';
import { useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
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
  const [summaryViewMode, setSummaryViewMode] = useState<'type' | 'date'>('type');

  // Parse summaries as JSON (date/summary entries per commentType)
  const parsedSummaries = useMemo(() => {
    type DateEntry = { date: string; summary: string };
    type ParsedSummary = {
      commentType: commentType;
      entries: DateEntry[];
    };

    const SUMMARY_ORDER: string[] = [
      commentType.와이보트, commentType.헌법재판소, commentType.청와대,
      commentType.행정부, commentType.국민의힘, commentType.더불어민주당, commentType.기타,
    ];

    return (news.summaries ?? [])
      .map((s): ParsedSummary | null => {
        try {
          const parsed = JSON.parse(s.summary);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].date && parsed[0].summary) {
            return { commentType: s.commentType, entries: parsed };
          }
        } catch {}
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
    <CabinetWrapper>
      <CabinetContent>
        <CabinetHeader>
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
        </CabinetHeader>

        <CabinetGrid>
          <CabinetCard>
            <SectionTitle>타임라인</SectionTitle>
            <TimelineList timeline={timelineGroups} />
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
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
          </CabinetCard>
        </CabinetGrid>
      </CabinetContent>
    </CabinetWrapper>
  );
}


const CabinetWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const CabinetContent = styled.div`
  width: 98%;
  max-width: 1120px;
  color: #0f172a;

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const CabinetHeader = styled.section`
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

const CabinetGrid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const CabinetCard = styled.section`
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

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
`;

const ViewToggleButton = styled.button`
  padding: 4px 12px;
  font-size: 0.82rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;

  &[data-active='true'] {
    background: #0f172a;
    color: #fff;
    border-color: #0f172a;
  }
`;

const PlaceholderText = styled.p`
  color: #94a3b8;
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
  color: #64748b;
  margin-bottom: 2px;
`;

const DateGroup = styled.div`
  padding: 8px 0 4px;
`;

const DateHeader = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  padding: 8px 0 2px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 4px;
`;

function formatSummaryDate(date: string) {
  // Accepts 'YYYY.MM.DD' → '1월 12일' (or 'YYYY년 M월 D일' if different year)
  const match = date.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!match) return date;
  const [, year, month, day] = match;
  const currentYear = new Date().getFullYear().toString();
  if (year !== currentYear) {
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  }
  return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
}


// --- TimelineList: compact, expandable, grouped by date, icons with count, expandable by icon click, default to 기타(others) ---


const CommentTypeIcon = ({ type }: { type: commentType }) => (
  <CommentTypeIconWrapper>
    <img
      src={commentTypeImg(type)}
      alt={type}
      style={{ width: 16, height: 16, verticalAlign: 'middle' }}
    />
  </CommentTypeIconWrapper>
);

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

type TimelineItem = { title: string; type: commentType };
type TimelineListProps = {
  timeline: [string, TimelineItem[]][];
};

const TimelineList = ({ timeline }: TimelineListProps) => {
  if (!timeline || timeline.length === 0) return <TimelineEmpty>타임라인이 없습니다.</TimelineEmpty>;
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // Extract years from all dates (assuming format 'YYYY.MM.DD' or 'YYYY-MM-DD')
  const currentYear = new Date().getFullYear().toString();

  // Helper to format date string to Korean style
  function formatKoreanDate(date: string) {
    // Accepts 'YYYY.MM.DD' or 'YYYY-MM-DD' or 'MM.DD' or 'MM-DD'
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


const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SummaryListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0 16px;
  border-top: 1px solid #e2e8f0;

  &:first-child {
    border-top: none;
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

