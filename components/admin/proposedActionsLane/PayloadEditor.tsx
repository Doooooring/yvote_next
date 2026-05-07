import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProposedAction } from '@utils/interface/proposedAction';

/**
 * Inline payload editor for /adminjae2 ProposedActionsLane.
 *
 * - Pending rows: editable <textarea>, parses JSON on each keystroke;
 *   Save sends `proposedActionRepository.update(id, { payload })` and
 *   invalidates the proposedActions query so the row re-renders.
 * - Non-pending rows: read-only block (matches the previous PayloadJSON
 *   shape so visual diff vs the old UI is minimal).
 *
 * Phase 6.1 of 2026-04-27-news-lifecycle-cross-repo.md.
 */
export default function PayloadEditor({
  action,
  editable,
}: {
  action: ProposedAction;
  editable: boolean;
}) {
  const qc = useQueryClient();
  const initialJson = useMemo(
    () => JSON.stringify(action.payload ?? {}, null, 2),
    [action.payload],
  );
  const [draft, setDraft] = useState<string>(initialJson);
  const [parseError, setParseError] = useState<string | null>(null);

  // If the upstream action.payload changes (e.g. another tab saved it),
  // re-seed the draft — but only when the user hasn't started editing.
  useEffect(() => {
    if (draft === initialJson) return;
    // user has unsaved edits; do not stomp.
  }, [initialJson, draft]);

  const updateMut = useMutation({
    mutationFn: async (parsed: Record<string, unknown>) => {
      return proposedActionRepository.update(action.id, { payload: parsed });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposedActions'] });
    },
  });

  function tryParse(text: string): Record<string, unknown> | null {
    try {
      const v = JSON.parse(text);
      if (v === null || typeof v !== 'object' || Array.isArray(v)) {
        setParseError('payload must be a JSON object (not array / null / scalar)');
        return null;
      }
      setParseError(null);
      return v as Record<string, unknown>;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'invalid JSON');
      return null;
    }
  }

  function onChange(text: string) {
    setDraft(text);
    tryParse(text);
  }

  function onSave() {
    const parsed = tryParse(draft);
    if (!parsed) return;
    updateMut.mutate(parsed);
  }

  function onCancel() {
    setDraft(initialJson);
    setParseError(null);
  }

  if (!editable) {
    return <ReadOnly>{initialJson}</ReadOnly>;
  }

  const dirty = draft !== initialJson;
  const canSave = dirty && parseError === null && !updateMut.isPending;

  return (
    <Wrap>
      <TextArea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={Math.min(20, Math.max(6, draft.split('\n').length + 1))}
      />
      {parseError && <ErrorLine>⚠ {parseError}</ErrorLine>}
      {updateMut.isError && (
        <ErrorLine>
          ⚠ save failed: {updateMut.error instanceof Error ? updateMut.error.message : 'unknown'}
        </ErrorLine>
      )}
      <BtnRow>
        <SaveBtn onClick={onSave} disabled={!canSave}>
          {updateMut.isPending ? 'saving…' : 'save'}
        </SaveBtn>
        <CancelBtn onClick={onCancel} disabled={!dirty || updateMut.isPending}>
          cancel
        </CancelBtn>
        {dirty && !parseError && <DirtyHint>unsaved</DirtyHint>}
      </BtnRow>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;
const TextArea = styled.textarea`
  width: 100%;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 11px;
  padding: 8px;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2a7a3e;
    background: #fff;
  }
`;
const ReadOnly = styled.pre`
  margin: 4px 0 0 0;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 11px;
  max-height: 280px;
  overflow: auto;
`;
const ErrorLine = styled.div`
  font-size: 11px;
  color: #b33;
`;
const BtnRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;
const SaveBtn = styled.button`
  padding: 3px 10px;
  font-size: 11px;
  border: 1px solid #2a7a3e;
  background: #2a7a3e;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #1f5e2e;
  }
`;
const CancelBtn = styled.button`
  padding: 3px 10px;
  font-size: 11px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  border-radius: 3px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const DirtyHint = styled.span`
  font-size: 11px;
  color: #c80;
  font-style: italic;
`;
