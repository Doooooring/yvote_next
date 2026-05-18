import styled from 'styled-components';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { runTrackedAction } from './trackedActionApi';

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
 * NOTE: this manual button does NOT add a waiting row to the
 * ProposedActionsLane. It calls the owner-command bridge, which records
 * the audit proposed_action and approves it immediately inside the
 * automation process.
 *
 * Flow:
 *   1. window.confirm()
 *   2. POST /api/adminjae2/tracked-action { action:"fill", background:true }
 *   3. The local Python owner-command bridge creates + approves + applies
 *      the fill_news PA out of band. fill_news may call LLM pipelines and
 *      can outlive a single HTTP request.
 *   4. invalidate ['trackedNews', 'proposedActions']. The TrackedLane
 *      row stays put (Fill doesn't move it) — the user sees the
 *      refreshed row after react-query refetch / manual refresh.
 *
 * Phase 8.5 of 2026-04-27-news-lifecycle-cross-repo.md.
 *
 * Mirrors the Telegram `fill <id>` command (Phase 7).
 */
export default function FillButton({ newsId, newsType }: { newsId: number; newsType: string }) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return runTrackedAction('fill', newsId, { background: true });
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['trackedNews'] }),
        qc.invalidateQueries({ queryKey: ['proposedActions'] }),
      ]);
    },
  });

  function onClick() {
    if (mutation.isPending) return;
    const ok = window.confirm(
      `Re-fill ${newsType} news ${newsId}? This re-runs the type-specific pipeline ` +
        `and overwrites generated content fields. State is preserved.`,
    );
    if (!ok) return;
    mutation.mutate();
  }

  if (mutation.isPending) {
    return <Btn disabled>starting…</Btn>;
  }
  return (
    <Btn onClick={onClick} title="Queue the fill pipeline in the background (state preserved)">
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
