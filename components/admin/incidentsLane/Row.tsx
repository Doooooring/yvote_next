import { useState } from 'react';
import styled from 'styled-components';

import { incidentRepository } from '@repositories/incident';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Incident, IncidentSeverity, IncidentStatus } from '@utils/interface/incident';

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
          {incident.newsId != null && <RefTag>news #{incident.newsId}</RefTag>}
          {incident.proposedActionId != null && <RefTag>pa #{incident.proposedActionId}</RefTag>}
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
          <DetailsBox>{JSON.stringify(incident.details, null, 2)}</DetailsBox>
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
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 2px;
  color: ${({ theme }) => theme.colors.yvote08};
`;
const StatusTag = styled.span<{ status: IncidentStatus }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;
  background: ${(p) => (p.status === IncidentStatus.Resolved ? '#e0f5e0' : '#eee')};
  color: ${(p) => (p.status === IncidentStatus.Resolved ? '#2a7a3e' : '#666')};
`;
const RefTag = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 2px;
  color: ${({ theme }) => theme.colors.yvote08};
`;
const Message = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.yvote11};
  word-break: break-word;
  line-height: 1.45;
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
const Created = styled.span`
  color: ${({ theme }) => theme.colors.yvote07};
`;
const DetailsBox = styled.pre`
  margin: 4px 0 0 0;
  padding: 8px;
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 4px;
  font-size: 11px;
  max-height: 280px;
  overflow: auto;
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
const ResolveBtn = styled.button`
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
const DismissBtn = styled.button`
  padding: 7px 10px;
  border: 1px solid #888;
  background: #fff;
  color: #555;
  border-radius: 2px;
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
