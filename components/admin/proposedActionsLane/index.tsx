import { useMemo } from 'react';
import styled from 'styled-components';

import { newsRepository } from '@repositories/news';
import { proposedActionRepository } from '@repositories/proposedAction';
import { useQuery } from '@tanstack/react-query';
import { ProposedActionStatus } from '@utils/interface/proposedAction';

import CommentMoveGroup from './CommentMoveGroup';
import { groupProposedActionsForReview, ProposedActionReviewGroup } from './reviewGroups';
import ProposedActionRow from './Row';
import { extractActionComments } from './rowDisplay';

function ReviewGroup({ group }: { group: ProposedActionReviewGroup }) {
  const targetQuery = useQuery({
    queryKey: ['adminjae2TargetNews', group.targetNewsId],
    queryFn: () => newsRepository.getNewsContent(group.targetNewsId as number, null),
    enabled: group.targetNewsId != null,
    staleTime: 60_000,
  });
  const commentCount = group.actions.reduce(
    (sum, action) => sum + extractActionComments(action).length,
    0,
  );
  const targetLabel =
    targetQuery.data?.title ??
    group.title ??
    (group.targetNewsId != null ? `news #${group.targetNewsId}` : 'new draft');
  const label =
    group.kind === 'comments_to_existing'
      ? `comments to ${targetLabel}`
      : `new news from extracted comments: ${targetLabel}`;

  return (
    <Group>
      <GroupHead>
        <GroupTitle>{label}</GroupTitle>
        <GroupMeta>
          {group.actions.length} actions · {commentCount} target comments
        </GroupMeta>
      </GroupHead>
      <GroupList>
        {group.actions.map((action) => (
          <ProposedActionRow key={action.id} action={action} />
        ))}
      </GroupList>
    </Group>
  );
}

export default function ProposedActionsLane() {
  const {
    data: waiting = [],
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['proposedActions', 'waiting'],
    queryFn: () =>
      proposedActionRepository.list({
        status: ProposedActionStatus.Waiting,
        limit: 100,
      }),
    staleTime: 10_000,
    refetchInterval: 20_000,
  });
  const groups = useMemo(() => groupProposedActionsForReview(waiting), [waiting]);

  return (
    <Wrapper>
      <Heading>
        제안 중인 작업
        <span className="count">{waiting.length}</span>
        {isFetching && <span className="loading">...</span>}
      </Heading>
      <SectionRule />
      {isError ? (
        <ErrorHint>
          Proposed Actions API를 불러오지 못했습니다. 큐가 비어있는 것이 아니라 관리자 API/proxy
          오류일 수 있습니다.
          <code>{error instanceof Error ? error.message : 'unknown error'}</code>
        </ErrorHint>
      ) : waiting.length === 0 ? (
        <EmptyHint>
          대기 중인 제안이 없습니다. conductor가 새 queue 파일을 처리하거나 tracked news의 finished
          여부를 감지하면 여기에 나타납니다.
        </EmptyHint>
      ) : (
        <List>
          {groups.map((group) =>
            group.kind === 'single' ? (
              <ProposedActionRow key={group.key} action={group.actions[0]} />
            ) : group.kind === 'comments_to_existing' ? (
              <CommentMoveGroup key={group.key} group={group} />
            ) : (
              <ReviewGroup key={group.key} group={group} />
            ),
          )}
        </List>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  background: transparent;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  padding: 12px 0;
  margin-bottom: 24px;
`;

const Heading = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  .count {
    color: ${({ theme }) => theme.colors.yvote08};
    font-weight: 400;
    font-family: Helvetica, sans-serif;
    font-size: 14px;
  }
  .loading {
    color: ${({ theme }) => theme.colors.yvote07};
    font-size: 12px;
  }

  @media screen and (max-width: 768px) {
    font-size: 17px;
  }
`;

const SectionRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 6px 0 0;
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 13px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
`;

const ErrorHint = styled.p`
  color: #8a2d1d;
  font-size: 13px;
  padding: 12px 16px;
  background: #fff4ef;
  border: 1px solid #f0c7b8;
  border-radius: 6px;
  code {
    display: block;
    margin-top: 6px;
    color: #5f1d12;
    background: #ffe8df;
    padding: 4px 6px;
    border-radius: 3px;
    font-family: monospace;
    white-space: pre-wrap;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Group = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  padding: 10px 0 0;

  &:first-child {
    border-top: none;
  }
`;

const GroupHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 0 0 4px;
`;

const GroupTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.yvote12};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
`;

const GroupMeta = styled.span`
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 12px;
`;

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  border-left: 2px solid ${({ theme }) => theme.colors.yvote04};
`;
