import styled from 'styled-components';
import { useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';
import TimelineList, { CommentTypeIcon } from '@components/news/timeline';

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
  background-color: ${({ theme }) => theme.colors.yvote02};
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const CabinetContent = styled.div`
  width: 98%;
  max-width: 1120px;
  color: ${({ theme }) => theme.colors.yvote13};

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const CabinetHeader = styled.section`
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  padding: 22px;
  display: block;
  box-shadow: 0 10px 30px rgba(21, 21, 21, 0.08);

  .header-text h1 {
    margin: 8px 0 6px;
    font-size: 1.6rem;
    line-height: 1.4;
  }

  .subtitle {
    color: ${({ theme }) => theme.colors.yvote09};
    line-height: 1.6;
    margin: 0 0 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: ${({ theme }) => theme.colors.yvote08};
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
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  background-color: ${({ theme }) => theme.colors.yvote01};
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
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(21, 21, 21, 0.06);
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.yvote13};
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
`;

const ViewToggleButton = styled.button`
  padding: 4px 12px;
  font-size: 0.82rem;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.yvote01};
  color: ${({ theme }) => theme.colors.yvote08};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;

  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.yvote13};
    color: ${({ theme }) => theme.colors.yvote01};
    border-color: ${({ theme }) => theme.colors.yvote13};
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
  padding: 8px 0 2px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
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
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:first-child {
    border-top: none;
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

