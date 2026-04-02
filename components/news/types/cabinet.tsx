import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';

import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';
import TimelineList, { CommentTypeIcon } from '@components/news/timeline';

export default function CabinetNewsLayout({ news }: NewsTypeLayoutProps) {
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

  // Dummy data for fallback (match real timeline item shape: { title, type })
  const dummyTimeline = [
    ['2020.02.01', [{ title: '국무회의 타임라인 없음', type: commentType.기타 }]],
  ] as [string, { title: string; type: commentType }[]][];
  const dummyAgenda: AgendaGroupShape[] = [
    { title: '법률공포안', items: ['법률공포안1', '법률공포안2'] },
    { title: '대통령령안', items: ['시행령1', '시행령2'] },
  ];
  const dummySpeechGroups: AgendaGroupShape[] = [
    {
      title: '총리 발언',
      items: [
        '국무회의의 중요성을 강조하며, 각 부처의 협력을 요청했습니다.',
        '경제 활성화 방안에 대해 논의하였습니다.'
      ]
    },
    {
      title: '장관 발언',
      items: [
        '교육 정책의 변화와 미래 방향에 대해 설명했습니다.',
        '환경 보호를 위한 새로운 정책을 제안하였습니다.'
      ]
    }
  ];

  return (
    <CabinetWrapper>
      <CabinetContent>
        <CabinetHeader>
          <div className="header-text">
            <h1>{news.title}</h1>
            {news.subTitle ? <p className="subtitle">{news.subTitle}</p> : null}
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
        </CabinetHeader>

        <CabinetGrid>
          <CabinetCard>
            <SectionTitle>타임라인</SectionTitle>
            <TimelineList timeline={timelineGroups.length ? timelineGroups : dummyTimeline} flat />
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>안건 목록</SectionTitle>
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
            )}
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>주요 발언 내용</SectionTitle>
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
              <SpeechGroupsLayout>
                {dummySpeechGroups.map((group, gidx) => (
                  <SpeechGroup key={group.title + gidx}>
                    <SpeechGroupTitle>{group.title}</SpeechGroupTitle>
                    {group.items.map((item, idx) => (
                      <SpeechQuote key={idx}>{item}</SpeechQuote>
                    ))}
                  </SpeechGroup>
                ))}
              </SpeechGroupsLayout>
            )}
          </CabinetCard>

          <CabinetCard>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
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
  background-color: ${({ theme }) => theme.colors.yvote02};
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const CabinetContent = styled.div`
  width: 98%;
  max-width: 1120px;
  color: ${({ theme }) => theme.colors.yvote13};

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const CabinetHeader = styled.section`
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  padding: 22px;
  display: block;
  box-shadow: 0 10px 30px rgba(21, 21, 21, 0.08);

  .header-text h1 {
    margin: 8px 0 6px;
    font-size: 1.6rem;
    line-height: 1.4;
  }

  .subtitle {
    color: ${({ theme }) => theme.colors.yvote09};
    line-height: 1.6;
    margin: 0 0 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: ${({ theme }) => theme.colors.yvote08};
    font-size: 0.9rem;
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
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  background-color: ${({ theme }) => theme.colors.yvote01};
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
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(21, 21, 21, 0.06);
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.yvote13};
`;

const Paragraph = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.yvote09};
  line-height: 1.7;
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
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};

  &:first-child {
    border-top: none;
    padding-top: 24px;
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
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  background-color: ${({ theme }) => theme.colors.yvote01};
  background-image: url(${({ image }) => image});
  background-size: 16px 16px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  padding: 0;

  &[data-active='true'] {
    border-color: ${({ theme }) => theme.colors.yvote13};
    box-shadow: 0 0 0 2px rgba(21, 21, 21, 0.12);
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
    color: ${({ theme }) => theme.colors.yvote13};
    background: ${({ theme }) => theme.colors.yvote04};
    padding: 4px 8px;
    border-radius: 999px;
    margin-bottom: 8px;
    margin-bottom: 6px;
  }

  .summary-html {
    color: ${({ theme }) => theme.colors.yvote09};
    line-height: 1.6;
    font-size: 1rem;

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
      font-weight: 400;
      color: ${({ theme }) => theme.colors.yvote12};
    }

    em {
      font-style: normal;
    }

    a {
      color: ${({ theme }) => theme.colors.yvote12};
      text-decoration: underline;
    }
  }
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