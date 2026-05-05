import { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProposedAction,
  ProposedActionStatus,
  ProposedActionType,
} from '@utils/interface/proposedAction';
import { proposedActionRepository } from '@repositories/proposedAction';
import PayloadEditor from './PayloadEditor';

const TYPE_LABEL: Record<ProposedActionType, string> = {
  [ProposedActionType.CreateNews]: '📰 create news',
  [ProposedActionType.RouteComment]: '✉️ route comment',
  [ProposedActionType.Publish]: '🚀 publish',
  [ProposedActionType.PromoteType]: '🔁 promote type',
  [ProposedActionType.Track]: '👁️ track',
  [ProposedActionType.Untrack]: '🚪 untrack',
  [ProposedActionType.EditComment]: '✏️ edit comment',
  [ProposedActionType.FillNews]: '✨ fill news',
};

function describePayload(action: ProposedAction): string {
  const p = (action.payload || {}) as Record<string, unknown>;
  switch (action.actionType) {
    case ProposedActionType.CreateNews:
      return `"${p.title as string}" (${p.newsType as string})`;
    case ProposedActionType.RouteComment: {
      const batch = p.commentPayloads;
      if (Array.isArray(batch)) {
        const types = Array.from(
          new Set(
            batch
              .map((c) =>
                c && typeof c === 'object'
                  ? (c as Record<string, unknown>).commentType
                  : null,
              )
              .filter(Boolean),
          ),
        );
        const typeText = types.length ? ` as ${types.join(', ')}` : '';
        return `→ news ${p.targetNewsId}: ${batch.length} comments${typeText}`;
      }
      return `→ news ${p.targetNewsId} as ${p.commentType}`;
    }
    case ProposedActionType.Publish:
      return `news ${action.newsId}`;
    case ProposedActionType.PromoteType:
      return `news ${action.newsId}: ${p.fromType ?? '?'} → ${p.toType ?? '?'}`;
    case ProposedActionType.Track:
    case ProposedActionType.Untrack:
      return `news ${action.newsId}${p.trackedNote ? ` — ${p.trackedNote}` : ''}`;
    case ProposedActionType.FillNews: {
      const hasFastPath = !!(p.generatedContent as Record<string, unknown> | undefined);
      return `news ${action.newsId}${hasFastPath ? ' (fast-path)' : ''}`;
    }
    case ProposedActionType.EditComment:
      return `news ${action.newsId}: ${p.commentType ?? '?'}`;
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
  const actionPending = approveMut.isPending || rejectMut.isPending;

  return (
    <Row>
      <Main>
        <TypeTag>{TYPE_LABEL[action.actionType] ?? action.actionType}</TypeTag>
        <Describe>{describePayload(action)}</Describe>
        {action.note && <Note>💬 {action.note}</Note>}
        {approveMut.isError && (
          <ErrorNote>
            {approveMut.error instanceof Error
              ? approveMut.error.message
              : 'approve failed'}
          </ErrorNote>
        )}
        {rejectMut.isError && (
          <ErrorNote>
            {rejectMut.error instanceof Error
              ? rejectMut.error.message
              : 'reject failed'}
          </ErrorNote>
        )}
        {showPayload && (
          <PayloadEditor
            action={action}
            editable={action.status === ProposedActionStatus.Waiting}
          />
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
          onClick={() => {
            if (!actionPending) approveMut.mutate();
          }}
          disabled={actionPending}
        >
          {approveMut.isPending ? '...' : '✓ approve'}
        </ApproveBtn>
        <RejectBtn
          onClick={() => {
            if (!actionPending) rejectMut.mutate();
          }}
          disabled={actionPending}
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
const ErrorNote = styled.div`
  font-size: 12px;
  color: #8a2d1d;
  background: #fff4ef;
  border: 1px solid #f0c7b8;
  border-radius: 4px;
  padding: 4px 6px;
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
