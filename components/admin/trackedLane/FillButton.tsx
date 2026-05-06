import { useState } from 'react';
import styled from 'styled-components';

import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProposedActionSource, ProposedActionType } from '@utils/interface/proposedAction';

/**
 * /adminjae2 TrackedLane row button — fires immediately on click.
 *
 * Click = order (no second-step approval). Owner-confirmed 2026-04-28
 * (mirrors PublishButton / UntrackButton pattern).
 *
 * "Fill" runs the type-specific content (re)generation pipeline for
 * this news. It DOES NOT change `state` — a draft (state=1) stays
 * draft, an already-published (state=0) row stays published. Use the
 * Publish button to flip state.
 *
 * Per-row idempotent: clicking Fill multiple times re-runs the
 * pipeline, overwriting the type-specific generated fields each time.
 * The user explicitly wants this behavior so they can re-roll content
 * when the underlying scrape data changes.
 *
 * NOTE: this manual button does NOT carry `generatedContent`. The
 * conductor's apply path runs the full type-specific pipeline,
 * fetching upstream sources fresh and rewriting fields. If a worker
 * has already pre-baked field content, it should emit its own
 * `fill_news` proposed_action with `generatedContent` in the payload
 * (fast-path) — that one shows up in the ProposedActionsLane.
 *
 * Flow:
 *   1. window.confirm()
 *   2. proposedActionRepository.create({ FillNews, source=User,
 *        payload:{ newsId, newsType } })
 *   3. proposedActionRepository.approve(returnedId) — approves and
 *      immediately calls the local Python apply entrypoint.
 *   4. invalidate ['trackedNews', 'proposedActions']. The TrackedLane
 *      row stays put (Fill doesn't move it) — the user sees the
 *      refreshed PreviewBox after react-query refetch.
 *
 * Phase 8.5 of 2026-04-27-news-lifecycle-cross-repo.md.
 *
 * Mirrors the Telegram `fill <id>` command (Phase 7).
 */
export default function FillButton({ newsId, newsType }: { newsId: number; newsType: string }) {
  const qc = useQueryClient();
  const [stage, setStage] = useState<'idle' | 'filling'>('idle');

  const mutation = useMutation({
    mutationFn: async () => {
      const created = await proposedActionRepository.create({
        actionType: ProposedActionType.FillNews,
        newsId,
        payload: { newsId, newsType },
        source: ProposedActionSource.User,
      });
      if (typeof created?.id !== 'number') {
        throw new Error('proposed_action create returned no id');
      }
      await proposedActionRepository.approve(created.id);
      return created.id;
    },
    onSuccess: () => {
      setStage('filling');
      qc.invalidateQueries({ queryKey: ['trackedNews'] });
      qc.invalidateQueries({ queryKey: ['proposedActions'] });
    },
    onError: () => {
      setStage('idle');
    },
  });

  function onClick() {
    if (mutation.isPending || stage === 'filling') return;
    const ok = window.confirm(
      `Re-fill news ${newsId}? This re-runs the type-specific pipeline ` +
        `and overwrites generated content fields. State is preserved.`,
    );
    if (!ok) return;
    mutation.mutate();
  }

  if (stage === 'filling') {
    return <Btn disabled>filling…</Btn>;
  }
  if (mutation.isPending) {
    return <Btn disabled>requesting…</Btn>;
  }
  return (
    <Btn onClick={onClick} title="Re-run the fill pipeline (state preserved)">
      ✨ fill
    </Btn>
  );
}

const Btn = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #5a4ab0;
  background: #5a4ab0;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #45378a;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
