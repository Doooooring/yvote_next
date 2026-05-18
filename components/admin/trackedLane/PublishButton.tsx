import styled from 'styled-components';

import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsState } from '@utils/interface/news';
import { ProposedActionSource, ProposedActionType } from '@utils/interface/proposedAction';

/**
 * /adminjae2 TrackedLane row button — fires immediately on click.
 *
 * Renders Publish on draft rows (state=1) and Unpublish on already-
 * published rows (state=0). Both are owner-initiated, no auto-approve,
 * and use the same single-tier PA flow (create + approve + apply).
 *
 * Publish:   state '1' → '0' (visible on live site)
 * Unpublish: state '0' → '1' (hidden from live site, comments preserved)
 *
 * After success, invalidates ['trackedNews'] so the row re-renders into
 * the other section. Row stays in the lane until Untrack.
 */
export default function PublishButton({
  newsId,
  state,
}: {
  newsId: number;
  state?: NewsState | string;
}) {
  const qc = useQueryClient();
  const isPublished = state === NewsState.Published;

  const publishMutation = useMutation({
    mutationFn: () => emitAndApprove(ProposedActionType.Publish, newsId),
    onSuccess: invalidate(qc),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => emitAndApprove(ProposedActionType.Unpublish, newsId),
    onSuccess: invalidate(qc),
  });

  if (isPublished) {
    const onClick = () => {
      if (unpublishMutation.isPending) return;
      const ok = window.confirm(
        `Unpublish news ${newsId}? It will be hidden from the live site (comments preserved).`,
      );
      if (!ok) return;
      unpublishMutation.mutate();
    };
    if (unpublishMutation.isPending) return <Btn disabled>requesting…</Btn>;
    return (
      <Btn onClick={onClick} title="Unpublish: flip state 0 → 1 (hides from live site)">
        ↩ unpublish
      </Btn>
    );
  }

  const onClick = () => {
    if (publishMutation.isPending) return;
    const ok = window.confirm(`Publish news ${newsId}? It will become visible on the live site.`);
    if (!ok) return;
    publishMutation.mutate();
  };
  if (publishMutation.isPending) return <Btn disabled>requesting…</Btn>;
  return (
    <Btn onClick={onClick} title="Publish this news (fires immediately)">
      🚀 publish
    </Btn>
  );
}

async function emitAndApprove(actionType: ProposedActionType, newsId: number) {
  const created = await proposedActionRepository.create({
    actionType,
    newsId,
    payload: { newsId },
    source: ProposedActionSource.User,
  });
  if (typeof created?.id !== 'number') {
    throw new Error('proposed_action create returned no id');
  }
  await proposedActionRepository.approve(created.id);
  return created.id;
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  return async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['trackedNews'] }),
      qc.invalidateQueries({ queryKey: ['proposedActions'] }),
    ]);
  };
}

const Btn = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #2a7a3e;
  background: #2a7a3e;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #1f5e2e;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
