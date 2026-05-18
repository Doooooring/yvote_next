import { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { newsRepository } from '@repositories/news';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCommentModal_Preview } from '@utils/hook/news/useCommentModal_NewsPreview';
import { commentType, NewsState, newsTypesToKor, Preview } from '@utils/interface/news';
import { sortComment } from '@utils/interface/news/comment';

import FillButton from './FillButton';
import PublishButton from './PublishButton';
import ReclusterModal from './ReclusterModal';
import UntrackButton from './UntrackButton';

const PREVIEW_LIMIT = 100;

export default function TrackedLane() {
  // No state filter: tracked rows stay visible after Publish (state 1→0).
  // Publishing is not the same as untracking — we want long-running tracked
  // topics (debate threads, ongoing budgets) to remain in this lane until
  // the owner explicitly clicks Untrack.
  const qc = useQueryClient();
  const { data: tracked = [], isFetching } = useQuery({
    queryKey: ['trackedNews'],
    queryFn: () =>
      newsRepository.getPreviews(
        0,
        PREVIEW_LIMIT,
        '',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ),
    staleTime: 30_000,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showRecluster, setShowRecluster] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitEditMode = () => {
    setIsEditing(false);
    setSelected(new Set());
  };

  const closeReclusterModal = () => {
    setShowRecluster(false);
    qc.invalidateQueries({ queryKey: ['trackedNews'] });
  };

  const selectedIds = Array.from(selected);

  const pending = tracked.filter(
    (t) => t.state === NewsState.Pending || t.state === NewsState.NotPublished,
  );
  const published = tracked.filter((t) => t.state === NewsState.Published);

  return (
    <Wrapper>
      <Heading>
        추적 중<span className="count">{tracked.length}</span>
        {isFetching && <span className="loading">...</span>}
        <HeaderActions>
          {isEditing ? (
            <>
              {selectedIds.length > 0 && (
                <RedistributeButton onClick={() => setShowRecluster(true)}>
                  재배분 ({selectedIds.length})
                </RedistributeButton>
              )}
              <EditToggle onClick={exitEditMode}>편집 종료</EditToggle>
            </>
          ) : (
            <EditToggle onClick={() => setIsEditing(true)}>편집</EditToggle>
          )}
        </HeaderActions>
      </Heading>
      <SectionRule />
      {tracked.length === 0 ? (
        <EmptyHint>
          추적 중인 뉴스가 없습니다. conductor가 새로 스크랩한 항목을 기존 뉴스에 붙이거나 새로
          생성할 때 <code>track</code> proposed_action을 통해 이 레인이 채워집니다.
        </EmptyHint>
      ) : (
        <>
          <SubSection
            label="대기"
            count={pending.length}
            items={pending}
            isEditing={isEditing}
            selected={selected}
            expanded={expanded}
            onToggleSelect={toggleSelect}
            onToggleExpand={toggleExpand}
            emptyHint="대기 중인 뉴스가 없습니다."
          />
          <SubSection
            label="발행"
            count={published.length}
            items={published}
            isEditing={isEditing}
            selected={selected}
            expanded={expanded}
            onToggleSelect={toggleSelect}
            onToggleExpand={toggleExpand}
            emptyHint="발행 완료된 뉴스가 없습니다."
          />
        </>
      )}
      {showRecluster && <ReclusterModal newsIds={selectedIds} onClose={closeReclusterModal} />}
    </Wrapper>
  );
}

function SubSection({
  label,
  count,
  items,
  isEditing,
  selected,
  expanded,
  onToggleSelect,
  onToggleExpand,
  emptyHint,
}: {
  label: string;
  count: number;
  items: Preview[];
  isEditing: boolean;
  selected: Set<number>;
  expanded: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleExpand: (id: number) => void;
  emptyHint: string;
}) {
  return (
    <Section>
      <SectionHead>
        {label}
        <span className="cnt">{count}</span>
      </SectionHead>
      {items.length === 0 ? (
        <SectionEmpty>{emptyHint}</SectionEmpty>
      ) : (
        <List>
          {items.map((item) => (
            <TrackedRow
              key={item.id}
              item={item}
              isEditing={isEditing}
              isSelected={selected.has(item.id)}
              isExpanded={expanded.has(item.id)}
              onToggleSelect={() => onToggleSelect(item.id)}
              onToggleExpand={() => onToggleExpand(item.id)}
            />
          ))}
        </List>
      )}
    </Section>
  );
}

function TrackedRow({
  item,
  isEditing,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
}: {
  item: Preview;
  isEditing: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
}) {
  const typeLabel = item.newsType ? newsTypesToKor(item.newsType) : '';
  const subBody = item.subTitle || item.summary || '';
  const { showCommentModal } = useCommentModal_Preview();
  const handleRowClick = isEditing
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input')) return;
        onToggleSelect();
      }
    : undefined;
  const openComments = () => {
    if (!item.comments?.length) return;
    showCommentModal(item.id, item.comments as commentType[], undefined, item.title, {
      disableCategorize: item.newsType === 'budget',
    });
  };

  return (
    <Row $editing={isEditing} $selected={isSelected} onClick={handleRowClick}>
      {isEditing && (
        <SelectCheckbox
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          aria-label={`select news ${item.id}`}
        />
      )}
      <RowTop>
        {typeLabel && <TypeBadge>{typeLabel}</TypeBadge>}
        <TitleText
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) onToggleSelect();
            else onToggleExpand();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (isEditing) onToggleSelect();
              else onToggleExpand();
            }
          }}
        >
          {item.title}
        </TitleText>
        <IdTag href={`/adminjae/${item.id}`} onClick={(e) => e.stopPropagation()}>
          [{item.id}]
        </IdTag>
        {item.comments && item.comments.length > 0 && (
          <CommentIcons aria-label={`comments for news ${item.id}`}>
            {sortComment([...item.comments]).map((ct, index) => (
              <CommentTypeIcon
                key={`${ct}-${index}`}
                type={ct as commentType}
                size={14}
                onClick={openComments}
              />
            ))}
          </CommentIcons>
        )}
        <Chevron $open={isExpanded} aria-hidden>
          <AiOutlineDown size={11} />
        </Chevron>
        <Actions onClick={(e) => e.stopPropagation()}>
          <FillButton newsId={item.id} newsType={item.newsType} />
          <PublishButton newsId={item.id} state={item.state} />
          <UntrackButton newsId={item.id} />
        </Actions>
      </RowTop>
      {isExpanded && (
        <RowExpanded>
          {item.trackedNote && <Note>📌 {item.trackedNote}</Note>}
          {subBody ? <SubBody>{subBody}</SubBody> : <SubEmpty>(no subtitle/summary)</SubEmpty>}
        </RowExpanded>
      )}
    </Row>
  );
}

const Wrapper = styled.section`
  background: transparent;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  padding: 12px 0;
  margin-bottom: 24px;
`;

const Heading = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  .count {
    color: ${({ theme }) => theme.colors.yvote08};
    font-weight: 400;
    font-family: Helvetica, sans-serif;
    font-size: 14px;
  }
  .loading {
    color: ${({ theme }) => theme.colors.yvote07};
    font-size: 12px;
  }

  @media screen and (max-width: 768px) {
    font-size: 17px;
  }
`;

const HeaderActions = styled.span`
  margin-left: auto;
  display: flex;
  gap: 6px;
`;

const EditToggle = styled.button`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #888;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
  &:hover {
    background: #f5f5f5;
  }
`;

const RedistributeButton = styled.button`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  padding: 4px 10px;
  background: #333;
  color: white;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #111;
  }
`;

const SectionRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 6px 0 12px;
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 13px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  code {
    background: #eee;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
`;

const Section = styled.div`
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHead = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.yvote10};
  text-transform: uppercase;
  margin: 0 0 6px;
  padding: 0 2px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  display: flex;
  align-items: baseline;
  gap: 6px;
  .cnt {
    color: ${({ theme }) => theme.colors.yvote07};
    font-weight: 400;
    font-size: 11px;
  }
`;

const SectionEmpty = styled.div`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 12px;
  padding: 8px 4px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div<{ $editing?: boolean; $selected?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px 6px ${({ $editing }) => ($editing ? '28px' : '4px')};
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.yvote04};
  ${({ $editing }) => ($editing ? 'cursor: pointer;' : '')}
  ${({ $editing, $selected, theme }) =>
    $editing && $selected
      ? `
        background: ${theme.colors.yvote02 || '#eef4ff'};
        outline: 2px solid ${theme.colors.yvote12};
        outline-offset: -2px;
        border-radius: 4px;
      `
      : ''}

  &:last-child {
    border-bottom: none;
  }
`;

const SelectCheckbox = styled.input`
  position: absolute;
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  z-index: 2;
  cursor: pointer;
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;

  @media screen and (max-width: 768px) {
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 4px;
  }
`;

const TypeBadge = styled.span`
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote08};
  background: ${({ theme }) => theme.colors.yvote03};
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  line-height: 1.3;
`;

const TitleText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: rgb(20, 20, 20);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:focus {
    outline: 1px dashed ${({ theme }) => theme.colors.yvote08};
    outline-offset: 2px;
  }

  @media screen and (max-width: 768px) {
    display: -webkit-box;
    line-height: 1.35;
    white-space: normal;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

const IdTag = styled.a`
  flex-shrink: 0;
  color: #3b82f6;
  font-weight: 500;
  font-size: 13px;
  font-family: Helvetica, sans-serif;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentIcons = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 2px;
`;

const Chevron = styled.span<{ $open?: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.yvote07};
  transition: transform 0.15s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

const Actions = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: 4px;

  @media screen and (max-width: 768px) {
    flex-basis: 100%;
    justify-content: flex-end;
    margin-left: 0;
    padding-top: 2px;
  }
`;

const RowExpanded = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 4px 4px 4px;
  margin-top: 2px;
`;

const Note = styled.div`
  font-size: 12px;
  color: #555;
  padding: 4px 8px;
  background: #fffcf0;
  border-left: 3px solid #e8c547;
  border-radius: 2px;
`;

const SubBody = styled.div`
  font-size: 13px;
  line-height: 1.5;
  color: rgb(60, 60, 60);
  background: ${({ theme }) => theme.colors.yvote02 || '#f8f9fb'};
  padding: 8px 10px;
  border-radius: 4px;
  white-space: pre-wrap;
`;

const SubEmpty = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote07};
  font-style: italic;
  padding: 4px 0;
`;
