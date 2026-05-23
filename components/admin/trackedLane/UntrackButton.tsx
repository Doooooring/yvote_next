import { useState } from 'react';
import styled from 'styled-components';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { runTrackedAction } from './trackedActionApi';

/**
 * /adminjae2 TrackedLane row button.
 *
 * Click = order (no second-step approval). Owner-confirmed 2026-04-27.
 * Flow:
 *   1. window.confirm()
 *   2. create + approve + apply an untrack proposed action.
 */
export default function UntrackButton({ newsId }: { newsId: number }) {
  const qc = useQueryClient();
  const [stage, setStage] = useState<'idle' | 'untracking'>('idle');

  const mutation = useMutation({
    mutationFn: () => runTrackedAction('untrack', newsId),
    onSuccess: async () => {
      setStage('untracking');
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['trackedNews'] }),
        qc.invalidateQueries({ queryKey: ['proposedActions'] }),
      ]);
    },
    onError: (error) => {
      setStage('idle');
      window.alert(`Untrack failed for news ${newsId}: ${formatActionError(error)}`);
    },
  });

  function onClick() {
    if (mutation.isPending || stage === 'untracking') return;
    const ok = window.confirm(`Untrack news ${newsId}? New comments will stop routing here.`);
    if (!ok) return;
    mutation.mutate();
  }

  if (stage === 'untracking') {
    return <Btn disabled>untracking…</Btn>;
  }
  if (mutation.isPending) {
    return <Btn disabled>applying...</Btn>;
  }
  return (
    <Btn onClick={onClick} title="Apply untrack action">
      untrack
    </Btn>
  );
}

function formatActionError(error: unknown) {
  const responseData =
    error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { data?: unknown } }).response?.data
      : null;
  if (responseData && typeof responseData === 'object') {
    const detail = (responseData as { error?: unknown; result?: { detail?: unknown } }).error;
    if (typeof detail === 'string' && detail) return detail;
    const resultDetail = (responseData as { result?: { detail?: unknown } }).result?.detail;
    if (typeof resultDetail === 'string' && resultDetail) return resultDetail;
  }
  if (error instanceof Error) return error.message;
  return String(error);
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
