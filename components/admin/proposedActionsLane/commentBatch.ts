import {
  excludeCommentFromPayload as excludeCommentFromPayloadCore,
  getEditableCommentBatch as getEditableCommentBatchCore,
} from './commentBatchCore';

export type EditableCommentBatchKey = 'commentPayloads' | 'initialComments' | 'destinations';

export type EditableCommentBatch = {
  key: EditableCommentBatchKey;
  comments: unknown[];
};

export function getEditableCommentBatch(
  payload: Record<string, unknown>,
): EditableCommentBatch | null {
  return getEditableCommentBatchCore(payload) as EditableCommentBatch | null;
}

export function excludeCommentFromPayload(
  payload: Record<string, unknown>,
  key: EditableCommentBatchKey,
  index: number,
): Record<string, unknown> {
  return excludeCommentFromPayloadCore(payload, key, index) as Record<string, unknown>;
}
