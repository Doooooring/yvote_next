import IsShow from '@components/common/isShow';
import { useKoreanDateFormat } from '@utils/tools/date';
import styled from 'styled-components';
import { useState } from 'react';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'xai-sYSzFtJmqRSFJtDrLyMzdMTdVMpqaM8gOlhlzvFMjLdEr9311J91yzUcIQ8b3zd7h26FdyvIIBtGSMrK',
  baseURL: 'https://api.x.ai/v1',
  dangerouslyAllowBrowser: true,
});

interface CommentBodyExplainProps {
  title: string;
  explain: string;
  date: Date;
}

export default function CommentBodyExplain({ title, explain, date }: CommentBodyExplainProps) {
  const [summary, setSummary] = useState<string | null>(null); // State to store the summary
  const [loading, setLoading] = useState(false); // State to handle loading status

  const fetchSummary = async () => {
    setLoading(true);
    console.log('Button clicked, fetching for:', explain);
    try {
      const completion = await client.chat.completions.create({
        model: 'grok-2', // Ensure this is a valid model for xAI
        messages: [
          {
            role: 'system',
            content:
              '너는 내가 주는 글의 내용을 쉽고 가능한 짧게, ~요 체의 글로 정리해주는 중립적인 기자야.',
          },
          { role: 'user', content: title + explain },
        ],
      });
      console.log('Full response:', completion); // Log the response
      // Safely access the summary
      const ContentLine =
        completion.choices?.[0]?.message?.content
        'No summary in response';
      console.log('Setting summary to:', ContentLine);
      setSummary(ContentLine);
    } catch (error) {
      console.error('Error:', error);
      setSummary('Failed to fetch summary.');
      console.log('Summary state after error:', 'Failed to fetch summary.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <ContentTitle>
        {title}
        <DateButtonWrapper>
          <IsShow state={date != null}>
            <DateText>{useKoreanDateFormat(date)}</DateText>
          </IsShow>
          <GrokButton onClick={fetchSummary} disabled={loading}>
            {loading ? 'Loading...' : 'grok2'}
          </GrokButton>
        </DateButtonWrapper>
      </ContentTitle>
      <ContentBody>
        {summary === null
          ? // Show the original explain content if no summary yet
            explain.split('$').map((li, idx) => <ContentLine key={idx}>{li}</ContentLine>)
          : // Show the summary (or error message) if summary is set
            summary
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
