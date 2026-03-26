import { useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg } from '@utils/interface/news/comment';
import styled from 'styled-components';

// --- Types ---
export type TimelineItem = { title: string; type: commentType };
export type TimelineGroup = [string, TimelineItem[]];
export type TimelineListProps = {
  timeline: TimelineGroup[];
};

// --- CommentTypeIcon ---
export const CommentTypeIcon = ({ type }: { type: commentType }) => (
  <CommentTypeIconWrapper>
    <img
      src={commentTypeImg(type)}
      alt={type}
      style={{ width: 16, height: 16, verticalAlign: 'middle' }}
    />
  </CommentTypeIconWrapper>
);

// --- TimelineList ---
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

export default TimelineList;

// --- Styled Components ---

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
  border: 1.5px solid ${({ theme }) => theme.colors.yvote04};
  background: ${({ theme }) => theme.colors.yvote01};
  box-sizing: border-box;
`;

const TimelineListLayout = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TimelineListItem = styled.li`
  padding: 0 0 0.25rem;
`;

const TimelineDate = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.yvote12};
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
  padding: 4px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
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
  color: ${({ theme }) => theme.colors.yvote12};

  &::after {
    content: '▾';
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.yvote08};
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
  color: ${({ theme }) => theme.colors.yvote08};
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
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.4;
  margin-bottom: 0.25rem;
  padding: 3px 0;

  @media screen and (max-width: 768px) {
    margin-bottom: 0;
    padding: 2px 0;
    font-size: 0.8rem;
  }
  border-left: 2px solid ${({ theme }) => theme.colors.yvote04};
  background: transparent;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const TimelineEmpty = styled.div`
  color: ${({ theme }) => theme.colors.yvote07};
  text-align: center;
  padding: 1.5rem 0;
`;
