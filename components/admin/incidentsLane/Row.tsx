import { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from '@utils/interface/incident';
import { incidentRepository } from '@repositories/incident';

const SEVERITY_LABEL: Record<IncidentSeverity, string> = {
  [IncidentSeverity.Info]: 'ℹ️ info',
  [IncidentSeverity.Warning]: '⚠️ warning',
  [IncidentSeverity.Error]: '🛑 error',
};

const SEVERITY_COLOR: Record<IncidentSeverity, string> = {
  [IncidentSeverity.Info]: '#3b82a0',
  [IncidentSeverity.Warning]: '#c80',
  [IncidentSeverity.Error]: '#b33',
};

export default function IncidentRow({ incident }: { incident: Incident }) {
  const qc = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);

  const dismissMut = useMutation({
    mutationFn: () => incidentRepository.dismiss(incident.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }),
  });
  const resolveMut = useMutation({
    mutationFn: () => incidentRepository.resolve(incident.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }),
  });

  const isOpen = incident.status === IncidentStatus.Open;

  return (
    <Row>
      <Main>
        <HeaderRow>
          <SeverityTag color={SEVERITY_COLOR[incident.severity]}>
            {SEVERITY_LABEL[incident.severity]}
          </SeverityTag>
          <SourceTag>{incident.source}</SourceTag>
          {incident.status !== IncidentStatus.Open && (
            <StatusTag status={incident.status}>{incident.status}</StatusTag>
          )}
          {incident.newsId != null && (
            <RefTag>news #{incident.newsId}</RefTag>
          )}
          {incident.proposedActionId != null && (
            <RefTag>pa #{incident.proposedActionId}</RefTag>
          )}
        </HeaderRow>
        <Message>{incident.message}</Message>
        {incident.details && (
          <SmallBtns>
            <SmallBtn onClick={() => setShowDetails((s) => !s)}>
              {showDetails ? 'hide details' : 'details'}
            </SmallBtn>
            <Created>{new Date(incident.createdAt).toLocaleString()}</Created>
          </SmallBtns>
        )}
        {!incident.details && (
          <SmallBtns>
            <Created>{new Date(incident.createdAt).toLocaleString()}</Created>
          </SmallBtns>
        )}
        {showDetails && incident.details && (
          <DetailsBox>
            {JSON.stringify(incident.details, null, 2)}
          </DetailsBox>
        )}
      </Main>
      {isOpen && (
        <Actions>
          <ResolveBtn
            onClick={() => resolveMut.mutate()}
            disabled={resolveMut.isPending || dismissMut.isPending}
          >
            {resolveMut.isPending ? '...' : '✓ resolve'}
          </ResolveBtn>
          <DismissBtn
            onClick={() => dismissMut.mutate()}
            disabled={dismissMut.isPending || resolveMut.isPending}
          >
            {dismissMut.isPending ? '...' : '✗ dismiss'}
          </DismissBtn>
        </Actions>
      )}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
  align-items: flex-start;
`;
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;
const HeaderRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
`;
const SeverityTag = styled.span<{ color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.color};
`;
const SourceTag = styled.span`
  font-size: 11px;
  font-family: monospace;
  padding: 1px 6px;
  background: #eef;
  border-radius: 3px;
  color: #336;
`;
const StatusTag = styled.span<{ status: IncidentStatus }>`
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  background: ${(p) =>
    p.status === IncidentStatus.Resolved ? '#e0f5e0' : '#eee'};
  color: ${(p) =>
    p.status === IncidentStatus.Resolved ? '#2a7a3e' : '#666'};
`;
const RefTag = styled.span`
  font-size: 11px;
  padding: 1px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  color: #555;
`;
const Message = styled.div`
  font-size: 13px;
  color: #333;
  word-break: break-word;
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
  padding: 1px 6px;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;
const Created = styled.span``;
const DetailsBox = styled.pre`
  margin: 4px 0 0 0;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 11px;
  max-height: 280px;
  overflow: auto;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
`;
const ResolveBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid #2a7a3e;
  background: #2a7a3e;
  color: #fff;
  border-radius: 4px;
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
const DismissBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid #888;
  background: #fff;
  color: #555;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
