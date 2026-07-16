import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import TimelineList from '@components/news/timeline';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { commentType } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { NewsTypeLayoutProps } from './default';

type IndicatorGroup = {
  title: string;
  items: string[];
};

export default function EconomicsNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();

  const [groups, setGroups] = useState<IndicatorGroup[]>([]);
  useEffect(() => {
    setGroups(parseIndicatorGroups(news.detail?.agendaList ?? ''));
  }, [news.detail?.agendaList]);

  const timelineGroups = useMemo(() => {
    const buckets: Record<string, Array<{ title: string; type: commentType }>> = {};
    (news.timeline ?? []).forEach((tl) => {
      const dateKey = tl.date ? getDotDateForm(tl.date) : '날짜 미상';
      const titles = tl.title
        .split('$')
        .map((t) => t.trim())
        .filter(Boolean);
      if (!buckets[dateKey]) buckets[dateKey] = [];
      titles.forEach((title) => {
        buckets[dateKey].push({ title, type: tl.commentType ?? commentType.기타 });
      });
    });
    return Object.entries(buckets);
  }, [news.timeline]);

  const commentTypes = useMemo(
    () =>
      [...(news.comments ?? [])].sort(
        (a, b) => getCommentTypeRank(b as commentType) - getCommentTypeRank(a as commentType),
      ),
    [news.comments],
  );

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
                <CommentTypeIcon
                  key={`${type}-${index}`}
                  type={type as commentType}
                  size={12}
                  onClick={() =>
                    showCommentModal(news.id, type as commentType, news.title, { commentTypes })
                  }
                />
              ))}
            </CommentIcons>
          ) : null}
        </div>
      </Header>

      {timelineGroups.length ? (
        <Section>
          <SectionTitle>타임라인</SectionTitle>
          <SectionBody>
            <TimelineList timeline={timelineGroups} flat />
          </SectionBody>
        </Section>
      ) : null}

      <Section>
        <SectionTitle>지표</SectionTitle>
        <SectionBody>
          {groups.length ? (
            <GroupList>
              {groups.map((group) => (
                <Group key={group.title}>
                  <GroupTitle>{group.title}</GroupTitle>
                  <Indicators>
                    {group.items.map((item, idx) => (
                      <Indicator key={`${group.title}-${idx}`}>{renderIndicator(item)}</Indicator>
                    ))}
                  </Indicators>
                </Group>
              ))}
            </GroupList>
          ) : (
            <EmptyMessage>지표 데이터가 없습니다.</EmptyMessage>
          )}
        </SectionBody>
      </Section>

      {news.summaries?.length ? (
        <Section>
          <SectionTitle>해설</SectionTitle>
          <SectionBody>
            <SummaryList>
              {news.summaries.map((summary, idx) => (
                <SummaryListItem key={summary.commentType + idx}>
                  <CommentTypeIcon type={summary.commentType} />
                  <SummaryHtml dangerouslySetInnerHTML={{ __html: summary.summary ?? '' }} />
                </SummaryListItem>
              ))}
            </SummaryList>
          </SectionBody>
        </Section>
      ) : null}
    </Wrapper>
  );
}

function renderIndicator(raw: string) {
  const parts = raw
    .split('·')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) return <IndicatorLabel>{raw}</IndicatorLabel>;
  const [label, value, ...notes] = parts;
  return (
    <>
      <IndicatorLabel>{label}</IndicatorLabel>
      <IndicatorValue>{value}</IndicatorValue>
      {notes.length ? (
        <IndicatorNotes>
          {notes.map((n, i) => (
            <IndicatorNote key={i}>{n}</IndicatorNote>
          ))}
        </IndicatorNotes>
      ) : null}
    </>
  );
}

function parseIndicatorGroups(raw: string): IndicatorGroup[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((g) => ({
          title: String(g?.title ?? '').trim(),
          items: Array.isArray(g?.items)
            ? g.items.map((it: unknown) => String(it)).filter((s: string) => s.trim())
            : [],
        }))
        .filter((g) => g.title && g.items.length);
    }
  } catch {
    /* fall through */
  }
  return [];
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

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  padding: 4px 0;
  color: ${({ theme }) => theme.colors.yvote12};
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const Indicators = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Indicator = styled.li`
  padding: 6px 0 6px 10px;
  border-left: 2px solid ${({ theme }) => theme.colors.yvote04};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IndicatorLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.yvote09};
`;

const IndicatorValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
`;

const IndicatorNotes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin-top: 2px;
`;

const IndicatorNote = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.yvote08};
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
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.yvote07};
  font-size: 0.85rem;
  padding: 8px 0;
  margin: 0;
`;
