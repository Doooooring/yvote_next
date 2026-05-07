import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Backdrop } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import openAIRepository from '@repositories/llm';
import { useKoreanDateFormat } from '@utils/tools/date';

import { useToastMessage } from '../../../utils/hook/useToastMessage';
import { DefaultMessageBox } from '../../common/messageBox';

interface CommentBodyExplainProps {
  id: number;
  title: string;
  explain: string;
  date: string;
}

export default function CommentBodyExplain({ id, title, explain, date }: CommentBodyExplainProps) {
  const { summary, fetchSummary, isLoading } = useAISummary(explain);
  const [showSummary, setShowSummary] = useState(true);

  useEffect(() => {
    if (summary !== null) setShowSummary(true);
  }, [summary]);

  const _explain = useMemo(() => {
    if (summary !== null && showSummary) {
      const summaryText =
        typeof summary === 'string' ? summary : JSON.stringify(summary ?? '', null, 2);
      return summaryText
        .split('\n')
        .map((paragraph, idx) => <ContentLine key={idx}>{paragraph}</ContentLine>);
    } else {
      // `$$` is a section break (cabinet 의사일정 categories etc.) —
      // the first paragraph after it gets a slightly larger top margin
      // so sections feel separated without inserting a full blank row.
      // Single `$` and newlines are regular paragraph breaks.
      const blocks = explain.split(/\$\$/);
      const out: { text: string; sectionStart: boolean }[] = [];
      blocks.forEach((block, blockIdx) => {
        const inner = block
          .split(/\n+|\$/)
          .map((p) => p.trim())
          .filter(Boolean);
        inner.forEach((p, i) => {
          out.push({ text: p, sectionStart: blockIdx > 0 && i === 0 });
        });
      });
      return out.map(({ text, sectionStart }, idx) => (
        <ContentLine key={idx} $sectionStart={sectionStart}>
          {text}
        </ContentLine>
      ));
    }
  }, [summary, showSummary, explain]);

  return (
    <Wrapper>
      <ContentTitle>
        {title}
        <DateButtonWrapper>
          <IsShow state={date != null}>
            <DateText>{useKoreanDateFormat(date)}</DateText>
          </IsShow>
          {summary === null ? (
            <GrokButton onClick={fetchSummary} disabled={isLoading}>
              {isLoading ? '요약 중...' : '요약하기'}
            </GrokButton>
          ) : (
            <>
              <GrokButton onClick={() => setShowSummary(!showSummary)}>
                {showSummary ? '원문보기' : '요약보기'}
              </GrokButton>
              <GrokButton onClick={fetchSummary} disabled={isLoading}>
                {isLoading ? '요약 중...' : '다시 요약하기'}
              </GrokButton>
            </>
          )}
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
  const { show } = useToastMessage();

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await openAIRepository.summarize(explain);
      setSummary(response);
    } catch (e) {
      console.error('Failed to summarize comment', e);
      setSummary('요약에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, setSummary]);

  const clearSummary = useCallback(() => setSummary(null), []);

  return { summary, fetchSummary, clearSummary, isLoading };
}

const Wrapper = styled.div`
  padding: 1rem 0;
  color: black;
`;

const ContentTitle = styled.div`
  color: black;
  font-size: 15px;
  font-weight: 600;
  padding-bottom: 0.75rem;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    font-weight: 600;
  }
  p {
    font-weight: 400;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const ContentBody = styled.div`
  position: relative;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.7;
`;

const ContentLine = styled.p<{ $sectionStart?: boolean }>`
  margin: 0;
  padding: 0;

  color: black;
  margin-bottom: 0.5rem;
  margin-top: ${({ $sectionStart }) => ($sectionStart ? '1.4rem' : '0')};
  min-height: 10px;
  cursor: text;
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
  padding: 2px 7px;
  font-size: 10px;
  letter-spacing: 0.05em;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote06};
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote05};
    color: ${({ theme }) => theme.colors.yvote01};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IsFetching = styled(Backdrop)`
  backdrop-filter: opacity(100%);
`;

const Blink = styled.div`
  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  animation: back-blink 0.4s ease-in-out forwards;
`;
