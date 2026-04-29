import { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProposedActionSource,
  ProposedActionType,
} from '@utils/interface/proposedAction';
import { proposedActionRepository } from '@repositories/proposedAction';

/**
 * /adminjae2 TrackedLane row button — fires immediately on click.
 *
 * Click = order (no second-step approval). Owner-confirmed 2026-04-27.
 *
 * NOTE: this manual button does NOT carry `generatedContent`. If a
 * news needs auto-filled content (cabinet/plenary/bill/...), the
 * scan_finished worker creates a pending PUBLISH proposed_action on
 * the ProposedActionsLane carrying `generatedContent` — owner approves
 * THAT one instead of clicking this manual button.
 *
 * Flow:
 *   1. window.confirm()
 *   2. proposedActionRepository.create({ Publish, source=User,
 *        payload:{ newsId } })
 *   3. proposedActionRepository.approve(returnedId) — approves and
 *      immediately calls the local Python apply entrypoint.
 *   4. invalidate ['trackedNews']; news state flips '1' → '0' and the
 *      row drops out of TrackedLane
 *      (TrackedLane only shows state='1').
 *
 * Phase 6.2 of 2026-04-27-news-lifecycle-cross-repo.md.
 *
 * Mirrors the Telegram `publish <id>` command (Phase 7).
 */
export default function PublishButton({ newsId }: { newsId: number }) {
  const qc = useQueryClient();
  const [stage, setStage] = useState<'idle' | 'publishing'>('idle');

  const mutation = useMutation({
    mutationFn: async () => {
      const created = await proposedActionRepository.create({
        actionType: ProposedActionType.Publish,
        newsId,
        payload: { newsId },
        source: ProposedActionSource.User,
      });
      if (typeof created?.id !== 'number') {
        throw new Error('proposed_action create returned no id');
      }
      await proposedActionRepository.approve(created.id);
      return created.id;
    },
    onSuccess: () => {
      setStage('publishing');
      qc.invalidateQueries({ queryKey: ['trackedNews'] });
      qc.invalidateQueries({ queryKey: ['proposedActions'] });
    },
    onError: () => {
      setStage('idle');
    },
  });

  function onClick() {
    if (mutation.isPending || stage === 'publishing') return;
    const ok = window.confirm(
      `Publish news ${newsId}? It will become visible on the live site.`,
    );
    if (!ok) return;
    mutation.mutate();
  }

  if (stage === 'publishing') {
    return <Btn disabled>publishing…</Btn>;
  }
  if (mutation.isPending) {
    return <Btn disabled>requesting…</Btn>;
  }
  return (
    <Btn onClick={onClick} title="Publish this news (fires immediately)">
      🚀 publish
    </Btn>
  );
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
