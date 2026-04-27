import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { incidentRepository } from '@repositories/incident';
import { IncidentStatus } from '@utils/interface/incident';
import IncidentRow from './Row';

const LIMIT = 100;

/**
 * /adminjae2 IncidentsLane.
 *
 * Reads from yvote-api `GET /incident`. Default filter: `status=open`.
 * Toggle in header opens to "all" (open + dismissed + resolved).
 *
 * Phase 6.3 of 2026-04-27-news-lifecycle-cross-repo.md.
 */
export default function IncidentsLane() {
  const [showAll, setShowAll] = useState(false);

  const { data: incidents = [], isFetching } = useQuery({
    queryKey: ['incidents', showAll ? 'all' : 'open'],
    queryFn: () =>
      incidentRepository.list({
        status: showAll ? undefined : IncidentStatus.Open,
        limit: LIMIT,
      }),
    staleTime: 30_000,
  });

  return (
    <Wrapper>
      <Heading>
        인시던트 (Incidents) <span className="count">{incidents.length}</span>
        {isFetching && <span className="loading">...</span>}
        <FilterToggle onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'open만 보기' : '전체 보기'}
        </FilterToggle>
      </Heading>
      {incidents.length === 0 ? (
        <EmptyHint>
          {showAll
            ? '인시던트가 없습니다.'
            : 'open 상태인 인시던트가 없습니다. 새 파싱·스크랩·apply 오류가 발생하면 이 레인에 표시됩니다.'}
        </EmptyHint>
      ) : (
        <List>
          {incidents.map((inc) => (
            <IncidentRow key={inc.id} incident={inc} />
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

const FilterToggle = styled.button`
  margin-left: auto;
  padding: 3px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: #fff;
  color: #555;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 400;
  &:hover {
    background: #f5f5f5;
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
