import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import PreviewBox from '@components/news/previewBox';
import { newsRepository } from '@repositories/news';
import { NewsState } from '@utils/interface/news';
import PublishButton from './PublishButton';
import UntrackButton from './UntrackButton';
import FillButton from './FillButton';

const PREVIEW_LIMIT = 100;

export default function TrackedLane() {
  const { data: tracked = [], isFetching } = useQuery({
    queryKey: ['trackedNews'],
    queryFn: () =>
      newsRepository.getPreviews(
        0,
        PREVIEW_LIMIT,
        '',
        NewsState.Pending,
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
        추적 중 (Tracked) <span className="count">{tracked.length}</span>
        {isFetching && <span className="loading">...</span>}
      </Heading>
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
                <FillButton newsId={item.id} />
                <PublishButton newsId={item.id} />
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
