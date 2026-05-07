import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { newsRepository } from '@repositories/news';
import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProposedAction, ProposedActionStatus } from '@utils/interface/proposedAction';

import {
  EditableCommentBatchKey,
  excludeCommentFromPayload,
  getEditableCommentBatch,
} from './commentBatch';
import { ProposedActionReviewGroup } from './reviewGroups';
import { CommentPreview, extractActionComments } from './rowDisplay';

type MoveEntry = {
  action: ProposedAction;
  comment: CommentPreview;
  indexInAction: number;
};

function formatCommentBody(body: string) {
  return body.replace(/\s*\$\s*/g, '\n\n').trim();
}

function moveEntries(actions: ProposedAction[]): MoveEntry[] {
  return actions.flatMap((action) =>
    extractActionComments(action).map((comment, indexInAction) => ({
      action,
      comment,
      indexInAction,
    })),
  );
}

function editableBatchForEntry(entry: MoveEntry) {
  const editable = getEditableCommentBatch(entry.action.payload ?? {});
  if (!editable) return null;
  const comments = extractActionComments(entry.action);
  if (comments.length !== editable.comments.length) return null;
  if (entry.indexInAction < 0 || entry.indexInAction >= editable.comments.length) return null;
  return editable;
}

function actionIdsLabel(actions: ProposedAction[]) {
  const ids = actions.map((action) => `#${action.id}`);
  if (ids.length <= 8) return ids.join(', ');
  return `${ids.slice(0, 8).join(', ')} +${ids.length - 8}`;
}

export default function CommentMoveGroup({ group }: { group: ProposedActionReviewGroup }) {
  const qc = useQueryClient();
  const [expandedBodies, setExpandedBodies] = useState<Record<string, boolean>>({});
  const [batchStarted, setBatchStarted] = useState(false);
  const targetQuery = useQuery({
    queryKey: ['adminjae2TargetNews', group.targetNewsId],
    queryFn: () => newsRepository.getNewsContent(group.targetNewsId as number, null),
    enabled: group.targetNewsId != null,
    staleTime: 60_000,
  });
  const entries = useMemo(() => moveEntries(group.actions), [group.actions]);
  const targetLabel =
    targetQuery.data?.title ??
    group.title ??
    (group.targetNewsId != null ? `news #${group.targetNewsId}` : 'target news');
  const actionTypes = Array.from(new Set(group.actions.map((action) => action.actionType)));

  const approveAllMut = useMutation({
    mutationFn: () =>
      proposedActionRepository.approveManyInBackground(group.actions.map((action) => action.id)),
    onSuccess: () => setBatchStarted(true),
    onSettled: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const rejectAllMut = useMutation({
    mutationFn: async () => {
      for (const action of group.actions) {
        await proposedActionRepository.reject(action.id);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });
  const excludeMut = useMutation({
    mutationFn: async (entry: MoveEntry) => {
      const editable = editableBatchForEntry(entry);
      if (editable && editable.comments.length > 1) {
        await proposedActionRepository.update(entry.action.id, {
          payload: excludeCommentFromPayload(
            entry.action.payload ?? {},
            editable.key as EditableCommentBatchKey,
            entry.indexInAction,
          ),
        });
        return;
      }
      await proposedActionRepository.reject(entry.action.id);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['proposedActions'] }),
  });

  const isPending =
    batchStarted || approveAllMut.isPending || rejectAllMut.isPending || excludeMut.isPending;
  const canMutate =
    !batchStarted &&
    group.actions.every((action) => action.status === ProposedActionStatus.Waiting);

  return (
    <MergedRow>
      <Main>
        <HeaderLine>
          <TypeTag>comment moves</TypeTag>
          <Source>{actionTypes.join(', ')}</Source>
          <Created>{actionIdsLabel(group.actions)}</Created>
        </HeaderLine>
        <TitleLine>comments to {targetLabel}</TitleLine>
        <InfoLine>
          <InfoItem>
            <InfoLabel>target news</InfoLabel>
            <InfoValue>{targetLabel}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>actions</InfoLabel>
            <InfoValue>{group.actions.length}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>comments</InfoLabel>
            <InfoValue>{entries.length}</InfoValue>
          </InfoItem>
        </InfoLine>
        {entries.length > 0 && (
          <CommentList>
            {entries.map((entry, index) => {
              const comment = entry.comment;
              const bodyKey = `${entry.action.id}-${comment.title ?? 'comment'}-${index}`;
              const showBody = !!expandedBodies[bodyKey];
              return (
                <CommentBlock key={bodyKey}>
                  <CommentHead>
                    <CommentIndex>#{index + 1}</CommentIndex>
                    {comment.commentType && <CommentType>{comment.commentType}</CommentType>}
                    {comment.date && <CommentDate>{comment.date}</CommentDate>}
                    <CommentDate>PA #{entry.action.id}</CommentDate>
                    {canMutate && (
                      <ExcludeBtn
                        type="button"
                        disabled={isPending}
                        title="Leave this comment move out of the grouped approval."
                        onClick={() => excludeMut.mutate(entry)}
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
        {approveAllMut.isError && (
          <ErrorNote>
            {approveAllMut.error instanceof Error ? approveAllMut.error.message : 'approve failed'}
          </ErrorNote>
        )}
        {rejectAllMut.isError && (
          <ErrorNote>
            {rejectAllMut.error instanceof Error ? rejectAllMut.error.message : 'reject failed'}
          </ErrorNote>
        )}
        {excludeMut.isError && (
          <ErrorNote>
            {excludeMut.error instanceof Error ? excludeMut.error.message : 'exclude failed'}
          </ErrorNote>
        )}
      </Main>
      <Actions>
        <ApproveBtn
          type="button"
          disabled={isPending || !canMutate}
          onClick={() => {
            if (!isPending && canMutate) approveAllMut.mutate();
          }}
        >
          {approveAllMut.isPending ? '...' : batchStarted ? 'queued' : '✓ approve all'}
        </ApproveBtn>
        <RejectBtn
          type="button"
          disabled={isPending || !canMutate}
          onClick={() => {
            if (!isPending && canMutate) rejectAllMut.mutate();
          }}
        >
          {rejectAllMut.isPending ? '...' : '✗ reject all'}
        </RejectBtn>
      </Actions>
    </MergedRow>
  );
}

const MergedRow = styled.div`
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

const CommentIndex = styled.span`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 11px;
  font-variant-numeric: tabular-nums;
`;

const CommentType = styled.span`
  color: ${({ theme }) => theme.colors.yvote12};
  font-size: 11px;
  font-weight: 600;
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

const ErrorNote = styled.div`
  font-size: 12px;
  color: #8a2d1d;
  background: #fff4ef;
  border: 1px solid #f0c7b8;
  border-radius: 4px;
  padding: 4px 6px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 116px;

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
