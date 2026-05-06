import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { newsRepository } from '@repositories/news';
import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsType, newsTypesToKorFull } from '@utils/interface/news';
import { ProposedAction, ProposedActionStatus } from '@utils/interface/proposedAction';

import {
  EditableCommentBatchKey,
  excludeCommentFromPayload,
  getEditableCommentBatch,
} from './commentBatch';
import PayloadEditor from './PayloadEditor';
import {
  CommentPreview,
  getProposedActionMainTitle,
  getProposedActionTargetNewsId,
  TYPE_LABEL,
} from './rowDisplay';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function newsTypeLabel(value: unknown): string | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  if (Object.values(NewsType).includes(raw as NewsType)) {
    return newsTypesToKorFull(raw as NewsType);
  }
  return raw;
}

function commentFromRecord(value: unknown): CommentPreview | null {
  const record = asRecord(value);
  if (!record) return null;
  const title = asString(record.title) ?? asString(record.sourceCommentTitle);
  const body = asString(record.comment) ?? asString(record.commentBody) ?? asString(record.body);
  const commentType = asString(record.commentType) ?? asString(record.sourceCommentType);
  const date = asString(record.date);
  const bytes = asNumber(record.commentBytes);
  if (!title && !body && !commentType) return null;
  return { commentType, title, body, date, bytes };
}

function extractComments(payload: Record<string, unknown>): CommentPreview[] {
  const destinationComments = Array.isArray(payload.destinations)
    ? payload.destinations.flatMap((destination) => {
        const record = asRecord(destination);
        const comments = record?.commentPayloads;
        return Array.isArray(comments) ? comments : [];
      })
    : [];
  const sourceRemainders = Array.isArray(payload.sourceRemainders)
    ? payload.sourceRemainders
    : [];
  const splitComments = [...destinationComments, ...sourceRemainders]
    .map(commentFromRecord)
    .filter((c): c is CommentPreview => c !== null);
  if (splitComments.length) return splitComments;

  const arrays = [
    payload.commentPayloads,
    payload.initialComments,
    asRecord(payload.commentPayloadsSummary)?.previews,
  ];

  for (const candidate of arrays) {
    if (!Array.isArray(candidate)) continue;
    const comments = candidate
      .map(commentFromRecord)
      .filter((c): c is CommentPreview => c !== null);
    if (comments.length) return comments;
  }

  const single = commentFromRecord(payload.commentPayload) ?? commentFromRecord(payload);
  return single ? [single] : [];
}

function getTypeValue(action: ProposedAction, comments: CommentPreview[]) {
  const payload = action.payload ?? {};
  if (comments.length === 1 && comments[0].commentType) {
    return comments[0].commentType;
  }
  if (comments.length > 1) {
    const types = Array.from(
      new Set(comments.map((comment) => comment.commentType).filter(Boolean)),
    );
    if (types.length) return types.join(', ');
  }
  return (
    newsTypeLabel(payload.newsType) ??
    asString(payload.commentType) ??
    TYPE_LABEL[action.actionType]
  );
}

function getActionMeta(action: ProposedAction, comments: CommentPreview[]) {
  const payload = action.payload ?? {};
  const summary = asRecord(payload.commentPayloadsSummary);
  const count = asNumber(summary?.count) ?? comments.length;
  const meta: string[] = [];
  if (count > 1) meta.push(`${count} comments`);
  const fromType = asString(payload.fromType);
  const toType = asString(payload.toType);
  if (fromType || toType) meta.push(`${fromType ?? '?'} to ${toType ?? '?'}`);
  if (payload.generatedContent) meta.push('generated content ready');
  return meta;
}

function formatCommentBody(body: string) {
  return body.replace(/\s*\$\s*/g, '\n\n').trim();
}

export default function ProposedActionRow({ action }: { action: ProposedAction }) {
  const qc = useQueryClient();
  const [showPayload, setShowPayload] = useState(false);
  const [expandedBodies, setExpandedBodies] = useState<Record<string, boolean>>({});
  const payload = useMemo(() => action.payload ?? {}, [action.payload]);
  const targetNewsId = useMemo(() => getProposedActionTargetNewsId(action), [action]);
  const targetQuery = useQuery({
    queryKey: ['adminjae2TargetNews', targetNewsId],
    queryFn: () => newsRepository.getNewsContent(targetNewsId as number, null),
    enabled: targetNewsId != null,
    staleTime: 60_000,
  });
  const comments = useMemo(() => extractComments(payload), [payload]);
  const editableBatch = useMemo(() => getEditableCommentBatch(payload), [payload]);
  const targetTitle = targetQuery.data?.title;
  const mainTitle = getProposedActionMainTitle(action, comments, targetTitle);
  const typeValue = getTypeValue(action, comments);
  const meta = getActionMeta(action, comments);

  const approveMut = useMutation({
    mutationFn: () => proposedActionRepository.approve(action.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const rejectMut = useMutation({
    mutationFn: () => proposedActionRepository.reject(action.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const excludeMut = useMutation({
    mutationFn: ({ key, index }: { key: EditableCommentBatchKey; index: number }) =>
      proposedActionRepository.update(action.id, {
        payload: excludeCommentFromPayload(payload, key, index),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const actionPending = approveMut.isPending || rejectMut.isPending || excludeMut.isPending;
  const canEditBatch =
    action.status === ProposedActionStatus.Waiting &&
    editableBatch !== null &&
    comments.length === editableBatch.comments.length;

  return (
    <Row>
      <Main>
        <HeaderLine>
          <TypeTag>{TYPE_LABEL[action.actionType] ?? action.actionType}</TypeTag>
          <Source>{action.source}</Source>
          <Created>{new Date(action.createdAt).toLocaleString()}</Created>
        </HeaderLine>
        <TitleLine>{mainTitle}</TitleLine>
        <InfoLine>
          <InfoItem>
            <InfoLabel>type</InfoLabel>
            <InfoValue>{typeValue}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>target news</InfoLabel>
            <InfoValue>
              {targetNewsId != null ? targetTitle ?? `news #${targetNewsId}` : 'new draft'}
            </InfoValue>
          </InfoItem>
        </InfoLine>
        {meta.length > 0 && (
          <MetaLine>
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </MetaLine>
        )}
        {comments.length > 0 && (
          <CommentList>
            {comments.map((comment, index) => {
              const bodyKey = `${comment.title ?? 'comment'}-${index}`;
              const showBody = !!expandedBodies[bodyKey];
              const showExclude = canEditBatch && index < (editableBatch?.comments.length ?? 0);
              const excludeDisabled = actionPending || (editableBatch?.comments.length ?? 0) <= 1;
              return (
                <CommentBlock key={bodyKey}>
                  <CommentHead>
                    <CommentIndex>#{index + 1}</CommentIndex>
                    {comment.commentType && <CommentType>{comment.commentType}</CommentType>}
                    {comment.date && <CommentDate>{comment.date}</CommentDate>}
                    {comment.bytes != null && <CommentDate>{comment.bytes} bytes</CommentDate>}
                    {showExclude && editableBatch && (
                      <ExcludeBtn
                        type="button"
                        disabled={excludeDisabled}
                        title={
                          excludeDisabled
                            ? 'Reject the action if every comment should be excluded.'
                            : 'Remove this comment from the proposed batch before approving.'
                        }
                        onClick={() =>
                          excludeMut.mutate({
                            key: editableBatch.key,
                            index,
                          })
                        }
                      >
                        {excludeMut.isPending ? 'excluding...' : 'exclude'}
                      </ExcludeBtn>
                    )}
                  </CommentHead>
                  <CommentTitleRow>
                    {comment.title && <CommentTitle>{comment.title}</CommentTitle>}
                    {comment.body && (
                      <BodyToggle
                        type="button"
                        onClick={() =>
                          setExpandedBodies((current) => ({
                            ...current,
                            [bodyKey]: !current[bodyKey],
                          }))
                        }
                      >
                        {showBody ? 'hide body' : 'show body'}
                      </BodyToggle>
                    )}
                  </CommentTitleRow>
                  {showBody && comment.body && (
                    <CommentBody>{formatCommentBody(comment.body)}</CommentBody>
                  )}
                </CommentBlock>
              );
            })}
          </CommentList>
        )}
        {action.note && <Note>{action.note}</Note>}
        {approveMut.isError && (
          <ErrorNote>
            {approveMut.error instanceof Error ? approveMut.error.message : 'approve failed'}
          </ErrorNote>
        )}
        {rejectMut.isError && (
          <ErrorNote>
            {rejectMut.error instanceof Error ? rejectMut.error.message : 'reject failed'}
          </ErrorNote>
        )}
        {excludeMut.isError && (
          <ErrorNote>
            {excludeMut.error instanceof Error ? excludeMut.error.message : 'exclude failed'}
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
            {showPayload ? 'hide JSON' : 'edit JSON'}
          </SmallBtn>
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
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  background: transparent;
  align-items: flex-start;

  &:first-child {
    border-top: none;
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
`;
const HeaderLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
`;
const TypeTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yvote01};
  background: ${({ theme }) => theme.colors.yvote12};
  border: 1px solid ${({ theme }) => theme.colors.yvote12};
  padding: 3px 7px;
  border-radius: 2px;
`;
const TitleLine = styled.div`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.yvote12};
  word-break: keep-all;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    word-break: break-word;
  }
`;
const InfoLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  border-left: 2px solid ${({ theme }) => theme.colors.yvote05};
  padding-left: 8px;
`;
const InfoItem = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
`;
const InfoLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.yvote07};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
`;
const InfoValue = styled.span`
  font-size: 13px;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.yvote11};
  word-break: keep-all;

  @media screen and (max-width: 768px) {
    word-break: break-word;
  }
`;
const MetaLine = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  span {
    border: 1px solid ${({ theme }) => theme.colors.yvote05};
    color: ${({ theme }) => theme.colors.yvote08};
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 11px;
  }
`;
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const CommentBlock = styled.div`
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 4px;
  padding: 6px 8px;
`;
const CommentHead = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2px;
`;
const CommentType = styled.span`
  color: ${({ theme }) => theme.colors.yvote12};
  font-size: 11px;
  font-weight: 600;
`;
const CommentIndex = styled.span`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 11px;
  font-variant-numeric: tabular-nums;
`;
const CommentDate = styled.span`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 11px;
`;
const ExcludeBtn = styled.button`
  margin-left: auto;
  padding: 1px 7px;
  border: 1px solid #b65b45;
  border-radius: 2px;
  background: #fff;
  color: #9a412d;
  font-size: 11px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fff4ef;
  }

  &:disabled {
    opacity: 0.45;
    cursor: wait;
  }
`;
const CommentTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
`;
const CommentTitle = styled.div`
  color: ${({ theme }) => theme.colors.yvote12};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  word-break: keep-all;

  @media screen and (max-width: 768px) {
    word-break: break-word;
  }
`;
const CommentBody = styled.div`
  color: ${({ theme }) => theme.colors.yvote09};
  font-size: 12px;
  line-height: 1.55;
  margin-top: 5px;
  white-space: pre-wrap;
  word-break: keep-all;

  @media screen and (max-width: 768px) {
    word-break: break-word;
  }
`;
const BodyToggle = styled.button`
  flex: 0 0 auto;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote08};
  cursor: pointer;
  font-size: 11px;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
  }
`;
const Note = styled.div`
  font-size: 12px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.yvote08};
  border-left: 2px solid ${({ theme }) => theme.colors.yvote05};
  padding-left: 8px;
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
  padding: 3px 8px;
  font-size: 11px;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  border-radius: 2px;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote09};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote12};
  }
`;
const Source = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.yvote08};
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 2px;
`;
const Created = styled.span`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 11px;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 104px;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;
const ApproveBtn = styled.button`
  padding: 7px 10px;
  border: 1px solid #2d6a3d;
  background: #2d6a3d;
  color: #fff;
  border-radius: 2px;
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
  padding: 7px 10px;
  border: 1px solid #b33;
  background: #fff;
  color: #b33;
  border-radius: 2px;
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
