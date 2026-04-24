import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { proposedActionRepository } from '@repositories/proposedAction';
import { ProposedActionStatus } from '@utils/interface/proposedAction';
import ProposedActionRow from './Row';

export default function ProposedActionsLane() {
  const { data: pending = [], isFetching } = useQuery({
    queryKey: ['proposedActions', 'pending'],
    queryFn: () =>
      proposedActionRepository.list({
        status: ProposedActionStatus.Pending,
        limit: 100,
      }),
    staleTime: 10_000,
    refetchInterval: 20_000,
  });

  return (
    <Wrapper>
      <Heading>
        제안 중인 작업 (Proposed Actions)
        <span className="count">{pending.length}</span>
        {isFetching && <span className="loading">...</span>}
      </Heading>
      {pending.length === 0 ? (
        <EmptyHint>
          대기 중인 제안이 없습니다. conductor가 새 queue 파일을 처리하거나
          tracked news의 finished 여부를 감지하면 여기에 나타납니다.
        </EmptyHint>
      ) : (
        <List>
          {pending.map((action) => (
            <ProposedActionRow key={action.id} action={action} />
          ))}
        </List>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin: 16px 0;
`;

const Heading = styled.h2`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  .count {
    color: #888;
    font-weight: 400;
  }
  .loading {
    color: #aaa;
    font-size: 12px;
  }
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 13px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
