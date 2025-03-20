import IsShow from '@components/common/isShow';
import newsRepository from '@repositories/news';
import { useKoreanDateFormat } from '@utils/tools/date';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

interface CommentBodyExplainProps {
  id: number;
  title: string;
  explain: string;
  date: Date;
}

export default function CommentBodyExplain({ id, title, explain, date }: CommentBodyExplainProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await newsRepository.getNewsCommentSummary(id);
      setSummary(response);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [id, isLoading, setIsLoading, setSummary]);

  return (
    <Wrapper>
      <ContentTitle>
        {title}
        <DateButtonWrapper>
          <IsShow state={date != null}>
            <DateText>{useKoreanDateFormat(date)}</DateText>
          </IsShow>
          <GrokButton onClick={fetchSummary} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'grok2'}
          </GrokButton>
        </DateButtonWrapper>
      </ContentTitle>
      <ContentBody>
        {summary === null
          ? explain.split('$').map((li, idx) => <ContentLine key={idx}>{li}</ContentLine>)
          : summary
              .split('\n')
              .map((paragraph, idx) => <ContentLine key={idx}>{paragraph}</ContentLine>)}
      </ContentBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem 0;
  color: black;
`;

const ContentTitle = styled.div`
  color: black;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 1rem;
  @media screen and (max-width: 768px) {
    font-weight: 600;
  }
  p {
    font-weight: 400;
    font-size: 13.5px;
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const ContentBody = styled.div`
  font-weight: 400;
  font-size: 15px;
`;

const ContentLine = styled.div`
  color: black;
  margin-bottom: 0.5rem;
  min-height: 10px;
`;

const DateButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateText = styled.p`
  font-weight: 400;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.gray600};
  margin: 0;
`;

const GrokButton = styled.button`
  padding: 0.2rem 0.5rem;
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.gray200 || '#f0f0f0'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: black;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray300 || '#e0e0e0'};
  }
`;
