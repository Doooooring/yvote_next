import { Backdrop } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import commentRepository from '@repositories/comment';
import openAIRepository from '@repositories/openai';
import { useKoreanDateFormat } from '@utils/tools/date';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface CommentBodyExplainProps {
  id: number;
  title: string;
  explain: string;
  date: Date;
}

export default function CommentBodyExplain({ id, title, explain, date }: CommentBodyExplainProps) {
  const { summary, fetchSummary, isLoading } = useAISummary(explain);

  const _explain = useMemo(() => {
    if (summary !== null) {
      return summary
        .split('\n')
        .map((paragraph, idx) => <ContentLine key={idx}>{paragraph}</ContentLine>);
    } else {
      return explain
        .split('$')
        .map((paragraph, idx) => <ContentLine key={idx}>{paragraph}</ContentLine>);
    }
  }, [summary, explain]);

  return (
    <Wrapper>
      <ContentTitle>
        {title}
        <DateButtonWrapper>
          <IsShow state={date != null}>
            <DateText>{useKoreanDateFormat(date)}</DateText>
          </IsShow>
          <GrokButton onClick={fetchSummary} disabled={isLoading}>
            요약하기
          </GrokButton>
        </DateButtonWrapper>
      </ContentTitle>
      <ContentBody>
        {_explain}
        <IsShow state={isLoading}>
          <IsFetching />
        </IsShow>
      </ContentBody>
    </Wrapper>
  );
}

function useAISummary(explain: string) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await openAIRepository.getAIResult([
        {
          role: 'system',
          content:
            '글에서 뉴스 독자들이 읽을만한 부분을 쉽고 짧게 요약해 줘. 내용과 관계 없는 쓸데 없는 말은 빼고.',
        },
        { role: 'user', content: explain },
      ]);
      setSummary(response);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, setSummary]);
  return { summary, fetchSummary, isLoading };
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
  position: relative;
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
  position: relative;
  padding: 0.2rem 0.5rem;
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.yvote05};
  /* background: linear-gradient(-90deg, #5ab8e7 0%, #0463c2 100%), #fff; */

  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IsFetching = styled(Backdrop)`
  backdrop-filter: opacity(100%);
`;
