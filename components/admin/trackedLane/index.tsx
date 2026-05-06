import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import PreviewBox from '@components/news/previewBox';
import { newsRepository } from '@repositories/news';
import PublishButton from './PublishButton';
import UntrackButton from './UntrackButton';
import FillButton from './FillButton';

const PREVIEW_LIMIT = 100;

export default function TrackedLane() {
  // No state filter: tracked rows stay visible after Publish (state 1→0).
  // Publishing is not the same as untracking — we want long-running tracked
  // topics (debate threads, ongoing budgets) to remain in this lane until
  // the owner explicitly clicks Untrack.
  const { data: tracked = [], isFetching } = useQuery({
    queryKey: ['trackedNews'],
    queryFn: () =>
      newsRepository.getPreviews(
        0,
        PREVIEW_LIMIT,
        '',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ),
    staleTime: 30_000,
  });

  return (
    <Wrapper>
      <Heading>
        추적 중
        <span className="count">{tracked.length}</span>
        {isFetching && <span className="loading">...</span>}
      </Heading>
      <SectionRule />
      {tracked.length === 0 ? (
        <EmptyHint>
          추적 중인 뉴스가 없습니다. conductor가 새로 스크랩한 항목을 기존
          뉴스에 붙이거나 새로 생성할 때 <code>track</code> proposed_action을
          통해 이 레인이 채워집니다.
        </EmptyHint>
      ) : (
        <Grid>
          {tracked.map((item) => (
            <TrackedRow key={item.id}>
              <PreviewBox preview={item} />
              {item.trackedNote && <Note>📌 {item.trackedNote}</Note>}
              <ButtonRow>
                <FillButton newsId={item.id} newsType={item.newsType} />
                <PublishButton newsId={item.id} state={item.state} />
                <UntrackButton newsId={item.id} />
              </ButtonRow>
            </TrackedRow>
          ))}
        </Grid>
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
  margin: 6px 0 12px;
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 13px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  code {
    background: #eee;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TrackedRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Note = styled.div`
  font-size: 12px;
  color: #555;
  padding: 4px 8px;
  background: #fffcf0;
  border-left: 3px solid #e8c547;
  border-radius: 2px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 4px;
`;
