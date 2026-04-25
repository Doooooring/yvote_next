import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';

import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';
import TimelineList from '@components/news/timeline';
import CommentTypeIcon from '@components/common/CommentTypeIcon';

export default function PlenaryNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();
  // Hydration fix: Only parse agenda/speech on client
  const [agendaGroups, setAgendaGroups] = useState<AgendaGroupShape[]>([]);
  const [speechGroups, setSpeechGroups] = useState<AgendaGroupShape[]>([]);
  useEffect(() => {
    setAgendaGroups(parseAgendaGroups(news?.agendaList ?? ''));
    setSpeechGroups(parseAgendaGroups(news?.speechContent ?? ''));
  }, [news?.agendaList, news?.speechContent]);
  const timelineGroups = useMemo(() => {
    const groups: Record<string, Array<{ title: string; type: commentType }>> = {};
    (news.timeline ?? []).forEach((tl) => {
      const dateKey = tl.date ? getDotDateForm(tl.date) : '날짜 미상';
      const titles = tl.title
        .split('$')
        .map((t) => t.trim())
        .filter(Boolean);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      titles.forEach(title => {
        groups[dateKey].push({ title, type: tl.commentType ?? commentType.기타 });
      });
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


  return (
    <Wrapper>
        <Header>
          <h1>{news.title}</h1>
          {news.subTitle ? <p className="subtitle">{news.subTitle}</p> : null}
          <div className="meta">
            {news.date ? <span>{getDotDateForm(news.date)}</span> : null}
            {commentTypes.length ? (
              <CommentIcons>
                {commentTypes.map((type, index) => (
                  <CommentTypeIcon key={`${type}-${index}`} type={type as commentType} size={12} onClick={() => showCommentModal(news.id, type as commentType, news.title)} />
                ))}
              </CommentIcons>
            ) : null}
          </div>
        </Header>

          <Section>
            <SectionTitle>타임라인</SectionTitle>
            <SectionBody>
              {timelineGroups.length ? (
                <TimelineList timeline={timelineGroups} flat />
              ) : (
                <EmptyMessage>타임라인이 없습니다.</EmptyMessage>
              )}
            </SectionBody>
          </Section>

          <Section>
            <SectionTitle>안건 목록</SectionTitle>
            <SectionBody>
              {agendaGroups.length ? (
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
                <EmptyMessage>국무회의 안건이 없습니다.</EmptyMessage>
              )}
            </SectionBody>
          </Section>

          <Section>
            <SectionTitle>주요 발언 내용</SectionTitle>
            <SectionBody>
              {speechGroups.length ? (
                <SpeechGroupsLayout>
                  {speechGroups.map((group, gidx) => (
                    <SpeechGroup key={group.title + gidx}>
                      <SpeechGroupTitle>{group.title}</SpeechGroupTitle>
                      {group.items.map((item, idx) => (
                        <SpeechQuote key={idx}>{item}</SpeechQuote>
                      ))}
                    </SpeechGroup>
                  ))}
                </SpeechGroupsLayout>
              ) : (
                <EmptyMessage>주요 발언 내용이 없습니다.</EmptyMessage>
              )}
            </SectionBody>
          </Section>

          <Section>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
            <SectionBody>
              <SummaryList>
                {(news.summaries ?? []).map((summary, idx) => (
                  <SummaryListItem key={summary.commentType + idx}>
                    <CommentTypeIcon type={summary.commentType} />
                    <SummaryHtml
                      dangerouslySetInnerHTML={{ __html: summary.summary ?? '' }}
                    />
                  </SummaryListItem>
                ))}
              </SummaryList>
            </SectionBody>
          </Section>
    </Wrapper>
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

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.yvote02};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 60px;

  @media (max-width: 768px) {
    padding: 12px 0 40px;
  }
`;

const Header = styled.header`
  width: 92%;
  max-width: 1200px;
  padding: 0 0 16px;

  @media (max-width: 768px) {
    width: 96%;
  }

  h1 {
    font-family: 'Noto Serif KR', Georgia, serif;
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .subtitle {
    color: ${({ theme }) => theme.colors.yvote09};
    line-height: 1.6;
    margin: 0 0 8px;
    font-size: 14px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: ${({ theme }) => theme.colors.yvote08};
    font-size: 13px;
  }
`;

const CommentIcons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;


const Section = styled.section`
  width: 92%;
  max-width: 1200px;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  padding: 12px 0 0;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 96%;
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  letter-spacing: -0.02em;
  margin: 0 0 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SectionBody = styled.div`
  padding: 0 6px;

  @media (max-width: 768px) {
    padding: 0 10px;
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
    font-weight: 500;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.yvote12};
    padding: 4px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '▾';
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.yvote08};
    margin-left: 4px;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }

  .count {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.yvote08};
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
    border-left: 2px solid ${({ theme }) => theme.colors.yvote04};
    background: transparent;
    width: 100%;
    align-self: start;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.yvote12};
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
`;

const SummaryListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote05};

  &:first-child {
    border-top: none;
    padding-top: 8px;
  }
`;

const SummaryHtml = styled.div`
  display: inline;
  margin-left: 6px;
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.6;
  font-size: 1rem;

  p {
    margin: 0 0 6px;
  }

  ul,
  ol {
    margin: 24px 0 6px 18px;
    padding: 0;
  }

  p:has(strong) {
    margin: 12px 0 4px;
  }
  word-break: break-word;

  ul li strong {
    font-weight: 500;
  }

  p strong {
    font-weight: 400;
  }
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 0.85rem;
  padding: 8px 0;
  margin: 0;
`;

const SpeechGroupsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SpeechGroup = styled.div`
  margin-bottom: 4px;
`;

const SpeechGroupTitle = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const SpeechQuote = styled.blockquote`
  position: relative;
  padding: 10px 14px;
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.yvote12};
  background: ${({ theme }) => theme.colors.yvote02};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 10px;
  line-height: 1.7;
  font-size: 0.9rem;
  font-style: normal;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    left: -7px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.yvote02};
    border-left: 1px solid ${({ theme }) => theme.colors.yvote04};
    border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
    transform: rotate(45deg);
  }
`;