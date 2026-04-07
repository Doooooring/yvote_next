import openAIRepository from '@repositories/llm';
import { Article, NewsState } from '@utils/interface/news';
import { commentTypeColor, commentTypeImg } from '@utils/interface/news/comment';
import { RgbToRgba } from '@utils/tools';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

interface ArticleBoxProps {
  article: Article;
  showLogo?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  column?: 'left' | 'right';
}

export default function ArticleBox({ article, showLogo = true, isExpanded = false, onToggle, column }: ArticleBoxProps) {
  const { news, commentType, title, comment, date } = article;
  const { summary, fetchSummary, clearSummary, isLoading } = useAISummary(comment);

  const formatDate = (d: string): string => {
    const s = String(d).slice(0, 10);
    const parts = s.split('-');
    if (parts.length >= 3) return `${+parts[1]}/${+parts[2]}`;
    return s;
  };

  return (
    <ArticleRow>
      <LinkWrapper onClick={onToggle}>
        <div className="wrapper">
          <div className="text-wrapper">
            <div className={`writer-wrapper ${showLogo ? '' : 'hidden'}`}>
              <p
                style={{
                  color: commentTypeColor(commentType),
                  backgroundColor: `${RgbToRgba(commentTypeColor(commentType)!, 0.1)}`,
                }}
              >
                <span
                  className="logo"
                  style={{
                    backgroundImage: `url(${commentTypeImg(commentType)})`,
                  }}
                />
              </p>
            </div>
            <LinkTitleWrapper>
              <p className="title">{title}</p>
              <p className="date">{formatDate(date)}</p>
            </LinkTitleWrapper>
          </div>
        </div>
      </LinkWrapper>
      {isExpanded && comment && (
        <Dropdown $column={column}>
          <DropdownHeader>
            <DropdownTitle>{title}</DropdownTitle>
          </DropdownHeader>
          <SummaryButtonRow>
            <SummarizeButton onClick={summary !== null ? clearSummary : fetchSummary} disabled={isLoading}>
              {isLoading ? '요약 중...' : summary !== null ? '원문보기' : '요약하기'}
            </SummarizeButton>
          </SummaryButtonRow>
          <DropdownContent>
            {summary !== null
              ? (typeof summary === 'string' ? summary : JSON.stringify(summary ?? '', null, 2))
                  .split('\n')
                  .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
              : comment.split('$').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
          </DropdownContent>
          {news?.state === NewsState.Published && (
            <DropdownFooter>
              <Link href={`/news/${news.id}`}>뉴스보기 →</Link>
            </DropdownFooter>
          )}
        </Dropdown>
      )}
    </ArticleRow>
  );
}

const ArticleRow = styled.div`
  position: relative;
`;

const Dropdown = styled.div<{ $column?: 'left' | 'right' }>`
  background-color: ${({ theme }) => theme.colors.yvote02};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-top: none;
  padding: 12px 14px;
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (min-width: 769px) {
    width: 180%;
    ${({ $column }) => $column === 'right' ? 'margin-left: -80%;' : ''}
  }
`;

const DropdownHeader = styled.div`
  margin-bottom: 4px;
`;

const SummaryButtonRow = styled.div`
  margin-bottom: 8px;
`;

const DropdownTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  word-break: break-word;
`;

const SummarizeButton = styled.button`
  flex-shrink: 0;
  padding: 2px 7px;
  font-size: 10px;
  letter-spacing: 0.05em;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote08};
  border: 1px solid ${({ theme }) => theme.colors.yvote07};
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote07};
    color: ${({ theme }) => theme.colors.yvote01};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownContent = styled.div`
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.yvote12};

  p {
    margin: 0 0 6px;
    min-height: 4px;
  }
`;

const DropdownFooter = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 0.5px solid ${({ theme }) => theme.colors.yvote04};

  a {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.yvote08};
    text-decoration: none;
    letter-spacing: 0.02em;

    &:hover {
      color: ${({ theme }) => theme.colors.yvote11};
    }
  }
`;

const LinkWrapper = styled.div`
  display: block;
  text-decoration: none;
  width: 100%;
  cursor: pointer;

  .text {
    transition: color 0.3s ease;
  }

  &:hover {
    .title {
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: auto;
    touch-action: pan-y;
  }

  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  .text-wrapper {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    justify-content: start;
    align-items: center;
    color: rgb(50, 50, 50);
    vertical-align: baseline;
    display: flex;
    animation: back-blink 0.4s ease-in-out forwards;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    .writer-wrapper {
      width: 40px;
      flex-shrink: 0;
      text-align: center;
      &.hidden {
        width: 0;
        padding: 0;
        margin: 0;
        display: none;
      }
      p {
        width: 32px;
        height: 32px;
        font-size: 11px;
        line-height: 1;
        font-weight: 500;
        padding: 0;
        flex-shrink: 0;
        flex-grow: 0;
        color: grey;
        text-align: center;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo {
        width: 18px;
        height: 18px;
        background-size: 14px 14px;
        background-position: center;
        background-repeat: no-repeat;
        display: inline-block;
      }
      @media screen and (max-width: 768px) {
        width: 36px;
        p {
          font-size: 10px;
          width: 28px;
          height: 28px;
        }
        .logo {
          width: 16px;
          height: 16px;
          background-size: 12px 12px;
        }
      }
    }
  }
`;

const LinkTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  flex: 1 1 0;
  min-width: 0;

  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: rgb(120, 120, 120);

  @media screen and (max-width: 768px) {
    font-size: 13px;
  }

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .date {
    font-weight: 400;
    font-size: 11px;
    color: rgb(120, 120, 120);
    white-space: nowrap;
  }
`;

function useAISummary(explain: string) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (isLoading) return;
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
  }, [isLoading, explain]);

  const clearSummary = useCallback(() => setSummary(null), []);

  return { summary, fetchSummary, clearSummary, isLoading };
}
