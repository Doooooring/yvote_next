export type EditableCommentBatchKey = 'commentPayloads' | 'initialComments';

export type EditableCommentBatch = {
  key: EditableCommentBatchKey;
  comments: unknown[];
};

const EDITABLE_COMMENT_BATCH_KEYS: EditableCommentBatchKey[] = [
  'commentPayloads',
  'initialComments',
];

export function getEditableCommentBatch(
  payload: Record<string, unknown>,
): EditableCommentBatch | null {
  for (const key of EDITABLE_COMMENT_BATCH_KEYS) {
    const comments = payload[key];
    if (Array.isArray(comments) && comments.length > 0) {
      return { key, comments };
    }
  }
  return null;
}

export function excludeCommentFromPayload(
  payload: Record<string, unknown>,
  key: EditableCommentBatchKey,
  index: number,
): Record<string, unknown> {
  const comments = payload[key];
  if (!Array.isArray(comments) || index < 0 || index >= comments.length) {
    return { ...payload };
  }
  return {
    ...payload,
    [key]: comments.filter((_, i) => i !== index),
  };
}
