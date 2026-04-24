import { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProposedAction,
  ProposedActionType,
} from '@utils/interface/proposedAction';
import { proposedActionRepository } from '@repositories/proposedAction';

const TYPE_LABEL: Record<ProposedActionType, string> = {
  [ProposedActionType.CreateNews]: '📰 create news',
  [ProposedActionType.RouteComment]: '✉️ route comment',
  [ProposedActionType.FinishNews]: '🏁 finish news',
  [ProposedActionType.Publish]: '🚀 publish',
  [ProposedActionType.Track]: '👁️ track',
  [ProposedActionType.Untrack]: '🚪 untrack',
};

function describePayload(action: ProposedAction): string {
  const p = (action.payload || {}) as Record<string, unknown>;
  switch (action.actionType) {
    case ProposedActionType.CreateNews:
      return `"${p.title as string}" (${p.newsType as string})`;
    case ProposedActionType.RouteComment:
      return `→ news ${p.targetNewsId} as ${p.commentType}`;
    case ProposedActionType.FinishNews:
      return `news ${action.newsId} (${(p.newsType as string) ?? 'generic'})`;
    case ProposedActionType.Publish:
      return `news ${action.newsId}`;
    case ProposedActionType.Track:
    case ProposedActionType.Untrack:
      return `news ${action.newsId}${p.trackedNote ? ` — ${p.trackedNote}` : ''}`;
    default:
      return JSON.stringify(p).slice(0, 100);
  }
}

export default function ProposedActionRow({
  action,
}: {
  action: ProposedAction;
}) {
  const qc = useQueryClient();
  const [showPayload, setShowPayload] = useState(false);

  const approveMut = useMutation({
    mutationFn: () => proposedActionRepository.approve(action.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const rejectMut = useMutation({
    mutationFn: () => proposedActionRepository.reject(action.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });

  return (
    <Row>
      <Main>
        <TypeTag>{TYPE_LABEL[action.actionType] ?? action.actionType}</TypeTag>
        <Describe>{describePayload(action)}</Describe>
        {action.note && <Note>💬 {action.note}</Note>}
        {showPayload && (
          <PayloadJSON>{JSON.stringify(action.payload, null, 2)}</PayloadJSON>
        )}
        <SmallBtns>
          <SmallBtn onClick={() => setShowPayload((s) => !s)}>
            {showPayload ? 'hide' : 'payload'}
          </SmallBtn>
          <Source>{action.source}</Source>
          <Created>{new Date(action.createdAt).toLocaleString()}</Created>
        </SmallBtns>
      </Main>
      <Actions>
        <ApproveBtn
          onClick={() => approveMut.mutate()}
          disabled={approveMut.isPending}
        >
          {approveMut.isPending ? '...' : '✓ approve'}
        </ApproveBtn>
        <RejectBtn
          onClick={() => rejectMut.mutate()}
          disabled={rejectMut.isPending}
        >
          {rejectMut.isPending ? '...' : '✗ reject'}
        </RejectBtn>
      </Actions>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
  align-items: flex-start;
`;
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TypeTag = styled.span`
  font-size: 13px;
  font-weight: 600;
`;
const Describe = styled.div`
  font-size: 13px;
  color: #333;
`;
const Note = styled.div`
  font-size: 12px;
  color: #666;
`;
const PayloadJSON = styled.pre`
  margin: 4px 0 0 0;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 11px;
  max-height: 280px;
  overflow: auto;
`;
const SmallBtns = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
`;
const SmallBtn = styled.button`
  padding: 1px 6px;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;
const Source = styled.span`
  font-family: monospace;
  padding: 0 4px;
  background: #eef;
  border-radius: 2px;
`;
const Created = styled.span``;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
`;
const ApproveBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid #2a7a3e;
  background: #2a7a3e;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #1f5e2e;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
const RejectBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid #b33;
  background: #fff;
  color: #b33;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #fee;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
