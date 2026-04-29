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
 * Flow:
 *   1. window.confirm()
 *   2. proposedActionRepository.create({ Untrack, source=User, payload:{} })
 *   3. proposedActionRepository.approve(returnedId) — approves and
 *      immediately calls the local Python apply entrypoint.
 *   4. invalidate ['trackedNews']; the news drops out of TrackedLane
 *      on next refresh.
 *
 * Phase 6.2 of 2026-04-27-news-lifecycle-cross-repo.md.
 *
 * Mirrors the Telegram `untrack <id>` command (Phase 7).
 */
export default function UntrackButton({ newsId }: { newsId: number }) {
  const qc = useQueryClient();
  const [stage, setStage] = useState<'idle' | 'untracking'>('idle');

  const mutation = useMutation({
    mutationFn: async () => {
      const created = await proposedActionRepository.create({
        actionType: ProposedActionType.Untrack,
        newsId,
        payload: {},
        source: ProposedActionSource.User,
      });
      if (typeof created?.id !== 'number') {
        throw new Error('proposed_action create returned no id');
      }
      await proposedActionRepository.approve(created.id);
      return created.id;
    },
    onSuccess: () => {
      setStage('untracking');
      qc.invalidateQueries({ queryKey: ['trackedNews'] });
      qc.invalidateQueries({ queryKey: ['proposedActions'] });
    },
    onError: () => {
      setStage('idle');
    },
  });

  function onClick() {
    if (mutation.isPending || stage === 'untracking') return;
    const ok = window.confirm(
      `Untrack news ${newsId}? New comments will stop routing here.`,
    );
    if (!ok) return;
    mutation.mutate();
  }

  if (stage === 'untracking') {
    return <Btn disabled>untracking…</Btn>;
  }
  if (mutation.isPending) {
    return <Btn disabled>requesting…</Btn>;
  }
  return (
    <Btn onClick={onClick} title="Untrack this news (fires immediately)">
      🚪 untrack
    </Btn>
  );
}

const Btn = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #b33;
  background: #fff;
  color: #b33;
  border-radius: 4px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #fee;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
