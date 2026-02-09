import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';
import { getTextContentFromHtmlText } from '@utils/tools';
import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';

export default function CabinetNewsLayout({ news }: NewsTypeLayoutProps) {
  const summaryText = getTextContentFromHtmlText(news?.summary ?? '') || '';
  const { showCommentModal } = useCommentModal();
  const agendaGroups = useMemo(() => parseAgendaGroups(news?.agendaList ?? ''), [news?.agendaList]);
  const speechHtml = news?.speechContent ?? '';
  const timelineGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    (news.timeline ?? []).forEach((tl) => {
      const dateKey = tl.date ? getDotDateForm(tl.date) : '날짜 미상';
      const titles = tl.title
        .split('$')
        .map((t) => t.trim())
        .filter(Boolean);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(...titles);
    });
    return Object.entries(groups);
  }, [news.timeline]);
  const commentTypes = useMemo(
    () =>
      [...(news.comments ?? [])].sort(
        (a, b) => getCommentTypeRank(b as commentType) - getCommentTypeRank(a as commentType),
      ),
    [news.comments],
  );
  const summaryTypes = useMemo(() => {
    const unique = new Set<commentType>();
    (news.summaries ?? []).forEach((summary) => unique.add(summary.commentType));
    return Array.from(unique).sort(
      (a, b) => getCommentTypeRank(b as commentType) - getCommentTypeRank(a as commentType),
    );
  }, [news.summaries]);
  const [activeSummaryType, setActiveSummaryType] = useState<commentType | null>(null);

  useEffect(() => {
    setActiveSummaryType(summaryTypes[0] ?? null);
  }, [summaryTypes]);
  const activeSummary = activeSummaryType
    ? news.summaries?.find((summary) => summary.commentType === activeSummaryType)
    : undefined;

  // Dummy data for fallback
  const dummyTimeline: [string, string[]][] = [
    ['2026.02.01', ['내각 회의 개최', '정책 발표']],
    ['2026.02.02', ['예산안 논의', '국무총리 발언']],
  ];
  const dummyAgenda: AgendaGroupShape[] = [
    { title: '경제 정책', items: ['2026년 경제 성장률 목표 설정', '중소기업 지원 방안 논의'] },
    { title: '사회 정책', items: ['복지 확대 방안', '교육 개혁안 검토'] },
  ];
  const dummySpeech = '<p>국민 여러분께 내각의 주요 정책을 설명드리며, 경제와 복지 모두를 강화하겠습니다.</p>';

  return (
    <CabinetWrapper>
      <CabinetContent>
        <CabinetHeader>
          <div className="header-text">
            <h1>{news.title}</h1>
            <p className="subtitle">{news.subTitle || summaryText}</p>
            <div className="meta">
              {news.date ? <span>{getDotDateForm(news.date)}</span> : null}
              {commentTypes.length ? (
                <CommentIcons>
                  {commentTypes.map((type, index) => (
                    <CommentIconButton
                      key={`${type}-${index}`}
                      image={commentTypeImg(type as commentType)}
                      onClick={() => showCommentModal(news.id, type as commentType)}
                      aria-label={`${type} 평론 보기`}
                    />
                  ))}
                </CommentIcons>
              ) : null}
            </div>
          </div>
          {news.newsImage ? (
            <div className="header-image">
              <Image src={news.newsImage} alt={news.title} fill style={{ objectFit: 'cover' }} />
            </div>
          ) : null}
        </CabinetHeader>

        <CabinetGrid>
          <CabinetCard>
            <SectionTitle>타임라인</SectionTitle>
            {(timelineGroups.length ? (
              <TimelineList>
                {timelineGroups.map(([dateKey, items]) => (
                  <li key={dateKey}>
                    <span className="date">{dateKey}</span>
                    <ul className="items">
                      {items.map((item, idx) => (
                        <li key={`${dateKey}-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </TimelineList>
            ) : (
              <TimelineList>
                {dummyTimeline.map(([dateKey, items]) => (
                  <li key={dateKey}>
                    <span className="date">{dateKey}</span>
                    <ul className="items">
                      {items.map((item, idx) => (
                        <li key={`${dateKey}-dummy-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </TimelineList>
            ))}
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>안건 목록</SectionTitle>
            {(agendaGroups.length ? (
              <AgendaGroups>
                {agendaGroups.map((group) => (
                  <AgendaGroup key={group.title}>
                    <summary>
                      <span>{group.title}</span>
                      <span className="count">{group.items.length}건</span>
                    </summary>
                    <AgendaItems>
                      {group.items.map((item, idx) => (
                        <li key={`${group.title}-${idx}`}>
                          <p>{item}</p>
                        </li>
                      ))}
                    </AgendaItems>
                  </AgendaGroup>
                ))}
              </AgendaGroups>
            ) : (
              <AgendaGroups>
                {dummyAgenda.map((group) => (
                  <AgendaGroup key={group.title}>
                    <summary>
                      <span>{group.title}</span>
                      <span className="count">{group.items.length}건</span>
                    </summary>
                    <AgendaItems>
                      {group.items.map((item, idx) => (
                        <li key={`${group.title}-dummy-${idx}`}>
                          <p>{item}</p>
                        </li>
                      ))}
                    </AgendaItems>
                  </AgendaGroup>
                ))}
              </AgendaGroups>
            ))}
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>주요 발언 내용</SectionTitle>
            {speechHtml ? (
              <SpeechContent
                className="speech-html"
                dangerouslySetInnerHTML={{ __html: speechHtml }}
              />
            ) : (
              <SpeechContent
                className="speech-html"
                dangerouslySetInnerHTML={{ __html: dummySpeech }}
              />
            )}
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
            {summaryTypes.length ? (
              <SummarySelector>
                <SummaryButtons>
                  {summaryTypes.map((type) => (
                    <SummaryButton
                      key={type}
                      image={commentTypeImg(type)}
                      aria-label={`${type} 요약 보기`}
                      data-active={activeSummaryType === type}
                      onClick={() => setActiveSummaryType(type)}
                    />
                  ))}
                </SummaryButtons>
                <SummaryContent>
                  <div
                    className="summary-html"
                    dangerouslySetInnerHTML={{ __html: activeSummary?.summary ?? '' }}
                  />
                </SummaryContent>
              </SummarySelector>
            ) : (
              <SummarySelector>
                <SummaryButtons />
                <SummaryContent>
                  <div className="summary-html" />
                </SummaryContent>
              </SummarySelector>
            )}
          </CabinetCard>
        </CabinetGrid>
      </CabinetContent>
    </CabinetWrapper>
  );
}

type AgendaGroupShape = {
  title: string;
  items: string[];
};

const hasAgendaItems = (group: AgendaGroupShape | null): group is AgendaGroupShape =>
  !!group && group.items.length > 0;

function parseAgendaGroups(raw: string): AgendaGroupShape[] {
  if (!raw?.trim()) return [];
  const trimmed = raw.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((group) => ({
          title: String(group?.title ?? '').trim(),
          items: Array.isArray(group?.items)
            ? group.items.map((item: unknown) => String(item)).filter((item: string) => item.trim())
            : [],
        }))
        .filter((group) => group.title && group.items.length);
    }
    if (parsed && typeof parsed === 'object') {
      return Object.entries(parsed)
        .map(([title, items]) => ({
          title: String(title).trim(),
          items: Array.isArray(items)
            ? (items as unknown[]).map((item) => String(item)).filter((item) => item.trim())
            : [],
        }))
        .filter((group) => group.title && group.items.length);
    }
  } catch {
    // fall through to text parsing
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const groups: AgendaGroupShape[] = [];
  let current: AgendaGroupShape | null = null;

  lines.forEach((line) => {
    const headerMatch = line.match(/^(.*?)(:|：)$/);
    if (headerMatch) {
      if (current && current.items.length) {
        groups.push(current);
      }
      current = { title: headerMatch[1].trim(), items: [] };
      return;
    }

    const item = line.replace(/^[-*•]\s*/, '').trim();
    if (!current) {
      current = { title: '기타', items: [] };
    }
    if (item) current.items.push(item);
  });

  if (hasAgendaItems(current)) {
    groups.push(current);
  }

  return groups;
}

const CabinetWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const CabinetContent = styled.div`
  width: 98%;
  max-width: 1120px;
  color: #0f172a;

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const CabinetHeader = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 22px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

  .header-text h1 {
    margin: 8px 0 6px;
    font-size: 1.6rem;
    line-height: 1.4;
  }

  .subtitle {
    color: #475569;
    line-height: 1.6;
    margin: 0 0 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: #64748b;
    font-size: 0.9rem;
  }


  .header-image {
    position: relative;
    width: 100%;
    min-height: 220px;
    border-radius: 14px;
    overflow: hidden;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    .header-image {
      min-height: 200px;
    }
  }
`;

const CommentIcons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const CommentIconButton = styled.button<{ image: string }>`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  background-image: url(${({ image }) => image});
  background-size: 14px 14px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  padding: 0;
`;

const CabinetGrid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const CabinetCard = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: #0f172a;
`;

const Paragraph = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.7;
`;

const TimelineList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  li {
    padding: 0 0 4px 4px;
  }

  .date {
    font-size: 0.8rem;
    color: #64748b;
  }

  .items {
    list-style: none;
    padding: 2px 0 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .items li {
    margin: 0;
    color: #1e293b;
    line-height: 1.35;
    font-size: 0.9rem;
  }
`;

const AgendaGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AgendaGroup = styled.details`
  border: none;
  background: transparent;
  padding: 0;

  summary {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    cursor: pointer;
    font-weight: 600;
    color: #1e293b;
    padding: 8px 0;
    padding: 6px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '▾';
    font-size: 0.85rem;
    color: #64748b;
    margin-left: 4px;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }

  .count {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    margin-left: 6px;
  }
`;

const AgendaItems = styled.ul`
  list-style: none;
  padding: 8px 0 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px 10px;
  width: 100%;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  li {
    padding: 3px 0 3px 8px;
    border-left: 2px solid #e2e8f0;
    background: transparent;
    width: 100%;
    align-self: start;
  }

  p {
    margin: 0;
    color: #1e293b;
    line-height: 1.4;
    font-size: 0.85rem;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .label {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #0f172a;
    background: #e2e8f0;
    padding: 4px 8px;
    border-radius: 999px;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    color: #475569;
    line-height: 1.6;
  }
`;

const SummarySelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SummaryButton = styled.button<{ image: string }>`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  background-image: url(${({ image }) => image});
  background-size: 16px 16px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  padding: 0;

  &[data-active='true'] {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.12);
  }
`;

const SummaryContent = styled.div`
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;

  .label {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #0f172a;
    background: #e2e8f0;
    padding: 4px 8px;
    border-radius: 999px;
    margin-bottom: 8px;
    margin-bottom: 6px;
  }

  .summary-html {
    color: #475569;
    line-height: 1.5;
    font-size: 0.95rem;

    p {
      margin: 4px 0 4px;
    }

    p:last-child {
      margin-bottom: 0;
    }

    ul,
    ol {
      margin: 4px 0 4px 18px;
      padding: 0;
    }

    p + ul,
    p + ol {
      margin: 20px 0 4px 18px;
    }

    p:has(strong) {
      margin: 12px 0 4px;
    }
    word-break: break-word;

    strong {
      font-weight: 500;
      color: #1e293b;
    }

    em {
      font-style: italic;
    }

    a {
      color: #0ea5e9;
      text-decoration: underline;
    }

    blockquote {
      margin: 8px 0;
      padding-left: 10px;
      border-left: 2px solid #cbd5f5;
      color: #475569;
    }
  }
`;

const SpeechContent = styled.div`
  color: #475569;
  line-height: 1.6;
  font-size: 0.95rem;

  p {
    margin: 4px 0 4px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 4px 0 4px 18px;
    padding: 0;
  }

  p + ul,
  p + ol {
    margin: 20px 0 4px 18px;
  }

  p:has(strong) {
    margin: 12px 0 4px;
  }

  strong {
    font-weight: 500;
    color: #1e293b;
  }

  em {
    font-style: italic;
  }

  a {
    color: #0ea5e9;
    text-decoration: underline;
  }

  blockquote {
    margin: 8px 0;
    padding-left: 10px;
    border-left: 2px solid #cbd5f5;
    color: #475569;
  }
`;
