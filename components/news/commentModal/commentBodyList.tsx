import { ErrorComment } from '@components/common/commonErrorBounbdary/commonErrorView';
import IsShow from '@components/common/isShow';
import { Comment, commentType } from '@utils/interface/news';
import { commentTypeColor } from '@utils/interface/news/comment';
import { getDateHidingCurrentYear, getDotDateForm } from '@utils/tools/date';
import { Fragment, useMemo, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import styled from 'styled-components';

// Per-date collapsible categories. Order here is render order.
// Test against the comment's title; first match wins. Anything that
// matches none falls to a flat list at the bottom.
const CATEGORY_DEFS: Array<{ key: string; label: string; test: RegExp }> = [
  { key: 'briefing', label: '정례브리핑', test: /정례\s?(e-)?브리핑|주간\s?홍보계획\s?브리핑/ },
  { key: 'reports', label: '심사보고', test: /심사보고|제안설명|검토보고/ },
  { key: 'debates', label: '본회의 토론', test: /(찬성|반대)?토론(?!회)/ },
  { key: 'freespeeches', label: '자유발언', test: /자유발언/ },
];

function categorize(title: string): string {
  for (const def of CATEGORY_DEFS) if (def.test.test(title)) return def.key;
  return '__others__';
}

interface CommentBodyListProps {
  commentType: commentType;
  comments: Comment[];
  clickComment: (comment: Comment) => void;
  disableCategorize?: boolean;
}

export default function CommentBodyList({
  commentType,
  comments,
  clickComment,
  disableCategorize = false,
}: CommentBodyListProps) {
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  const groupedByDate = useMemo(() => {
    const dateMap: Record<string, Record<string, Comment[]>> = {};
    comments.forEach((c) => {
      const dateKey = c.date ? getDotDateForm(c.date) : '날짜 미상';
      const cat = disableCategorize ? '__others__' : categorize(c.title);
      if (!dateMap[dateKey]) dateMap[dateKey] = {};
      if (!dateMap[dateKey][cat]) dateMap[dateKey][cat] = [];
      dateMap[dateKey][cat].push(c);
    });
    return Object.entries(dateMap);
  }, [comments, disableCategorize]);

  const toggle = (key: string) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
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
      {groupedByDate.map(([dateKey, cats]) => (
        <div key={dateKey}>
          {CATEGORY_DEFS.map((def) => {
            const list = cats[def.key];
            if (!list?.length) return null;
            const openKey = `${dateKey}-${def.key}`;
            return (
              <Fragment key={def.key}>
                <BodyBlock onClick={() => toggle(openKey)}>
                  <BriefingTitle>
                    <span>{def.label} ({list.length}건)</span>
                    <DropdownArrow $open={!!openKeys[openKey]}>
                      <AiOutlineDown size="11px" />
                    </DropdownArrow>
                  </BriefingTitle>
                  <span className="date">{getDateHidingCurrentYear(list[0].date)}</span>
                </BodyBlock>
                {openKeys[openKey] && (
                  <BriefingChildren>
                    {list.map((comment, idx) => (
                      <BodyBlock
                        key={comment.comment + idx}
                        onClick={() => clickComment(comment)}
                      >
                        <span>{comment.title}</span>
                      </BodyBlock>
                    ))}
                  </BriefingChildren>
                )}
              </Fragment>
            );
          })}
          {(cats['__others__'] || []).map((comment, idx) => (
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
