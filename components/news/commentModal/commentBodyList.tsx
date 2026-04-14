import { ErrorComment } from '@components/common/commonErrorBounbdary/commonErrorView';
import IsShow from '@components/common/isShow';
import { Comment, commentType } from '@utils/interface/news';
import { commentTypeColor } from '@utils/interface/news/comment';
import { getDateHidingCurrentYear, getDotDateForm } from '@utils/tools/date';
import { useMemo, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import styled from 'styled-components';

const BRIEFING_PATTERN = /정례\s?(e-)?브리핑|주간\s?홍보계획\s?브리핑/;

interface CommentBodyListProps {
  commentType: commentType;
  comments: Comment[];
  clickComment: (comment: Comment) => void;
}

function isBriefing(title: string) {
  return BRIEFING_PATTERN.test(title);
}

export default function CommentBodyList({
  commentType,
  comments,
  clickComment,
}: CommentBodyListProps) {
  const [openDates, setOpenDates] = useState<Record<string, boolean>>({});

  const groupedByDate = useMemo(() => {
    const dateMap: Record<string, { briefing: Comment[]; others: Comment[] }> = {};
    comments.forEach((c) => {
      const dateKey = c.date ? getDotDateForm(c.date) : '날짜 미상';
      if (!dateMap[dateKey]) dateMap[dateKey] = { briefing: [], others: [] };
      if (isBriefing(c.title)) {
        dateMap[dateKey].briefing.push(c);
      } else {
        dateMap[dateKey].others.push(c);
      }
    });
    return Object.entries(dateMap);
  }, [comments]);

  const toggleDate = (dateKey: string) => {
    setOpenDates((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  if (comments.length === 0) {
    return (
      <VacantWrapper>
        <ErrorComment>
          <span style={{ color: commentTypeColor(commentType) }}>
            {commentType}
          </span>{' '}
          관련 최신 자료가 존재하지 않습니다.
        </ErrorComment>
      </VacantWrapper>
    );
  }

  return (
    <ModalList>
      {groupedByDate.map(([dateKey, { briefing, others }]) => (
        <div key={dateKey}>
          {briefing.length > 0 && (
            <>
              <BodyBlock onClick={() => toggleDate(dateKey)}>
                <BriefingTitle>
                  <span>정례브리핑 ({briefing.length}건)</span>
                  <DropdownArrow $open={!!openDates[dateKey]}>
                    <AiOutlineDown size="11px" />
                  </DropdownArrow>
                </BriefingTitle>
                <span className="date">{getDateHidingCurrentYear(briefing[0].date)}</span>
              </BodyBlock>
              {openDates[dateKey] && (
                <BriefingChildren>
                  {briefing.map((comment, idx) => (
                    <BodyBlock
                      key={comment.comment + idx}
                      onClick={() => clickComment(comment)}
                    >
                      <span>{comment.title}</span>
                    </BodyBlock>
                  ))}
                </BriefingChildren>
              )}
            </>
          )}
          {others.map((comment, idx) => (
            <BodyBlock
              key={comment.comment + idx}
              onClick={() => clickComment(comment)}
            >
              <span>{comment.title}</span>
              <IsShow state={comment.date != null}>
                <span className="date">{getDateHidingCurrentYear(comment.date)}</span>
              </IsShow>
            </BodyBlock>
          ))}
        </div>
      ))}
    </ModalList>
  );
}

const ModalList = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyBlock = styled.div`
  height: auto;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote03};
  justify-content: space-between;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote02};
  }

  span:first-child {
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13.5px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
    margin-right: 8px;
  }

  .date {
    flex: 0 0 auto;
    font-size: 11px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.yvote06};
  }
`;

const BriefingTitle = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  > span {
    font-size: 13.5px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
  }
`;

const DropdownArrow = styled.span<{ $open: boolean }>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin-left: 4px;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  color: ${({ theme }) => theme.colors.yvote06};
`;

const BriefingChildren = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors.yvote03};
  margin-left: 8px;
`;

const VacantWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
