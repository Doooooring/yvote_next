import { useState } from 'react';
import styled from 'styled-components';

import PreviewBox from '@components/news/previewBox';
import { newsRepository } from '@repositories/news';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const [showRecluster, setShowRecluster] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
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
    // Refresh tracked list — reclustering creates/moves rows that
    // change what shows here.
    qc.invalidateQueries({ queryKey: ['trackedNews'] });
  };

  const selectedIds = Array.from(selected);

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
        <Grid>
          {tracked.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <TrackedRow
                key={item.id}
                $editing={isEditing}
                $selected={isSelected}
                onClick={
                  isEditing
                    ? (e) => {
                        // Clicking anywhere on the row toggles selection while in
                        // edit mode, except on the action buttons / links.
                        const target = e.target as HTMLElement;
                        if (target.closest('button, a, input')) return;
                        toggleSelect(item.id);
                      }
                    : undefined
                }
              >
                {isEditing && (
                  <SelectCheckbox
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`select news ${item.id}`}
                  />
                )}
                <PreviewBox preview={item} />
                {item.trackedNote && <Note>📌 {item.trackedNote}</Note>}
                <ButtonRow>
                  <FillButton newsId={item.id} newsType={item.newsType} />
                  <PublishButton newsId={item.id} state={item.state} />
                  <UntrackButton newsId={item.id} />
                </ButtonRow>
              </TrackedRow>
            );
          })}
        </Grid>
      )}
      {showRecluster && (
        <ReclusterModal newsIds={selectedIds} onClose={closeReclusterModal} />
      )}
    </Wrapper>
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TrackedRow = styled.div<{ $editing?: boolean; $selected?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ $editing }) => ($editing ? 'cursor: pointer;' : '')}
  ${({ $editing, $selected, theme }) =>
    $editing && $selected
      ? `
        background: ${theme.colors.yvote02 || '#eef4ff'};
        outline: 2px solid ${theme.colors.yvote12};
        outline-offset: 2px;
        border-radius: 4px;
      `
      : ''}
`;

const SelectCheckbox = styled.input`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  z-index: 2;
  cursor: pointer;
`;

const Note = styled.div`
  font-size: 12px;
  color: #555;
  padding: 4px 8px;
  background: #fffcf0;
  border-left: 3px solid #e8c547;
  border-radius: 2px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 4px;
`;
