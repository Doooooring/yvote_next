import { useState } from 'react';
import styled from 'styled-components';

import { incidentRepository } from '@repositories/incident';
import { useQuery } from '@tanstack/react-query';
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
        인시던트
        <span className="count">{incidents.length}</span>
        {isFetching && <span className="loading">...</span>}
        <FilterToggle onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'open만 보기' : '전체 보기'}
        </FilterToggle>
      </Heading>
      <SectionRule />
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
    flex-wrap: wrap;
  }
`;

const SectionRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 6px 0 0;
`;

const FilterToggle = styled.button`
  margin-left: auto;
  padding: 5px 10px;
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote09};
  border-radius: 2px;
  cursor: pointer;
  font-weight: 400;
  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote12};
  }

  @media screen and (max-width: 768px) {
    margin-left: 0;
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
`;
