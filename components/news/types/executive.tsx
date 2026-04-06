import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { commentType } from '@utils/interface/news';
import { commentTypeImg, getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { NewsTypeLayoutProps } from './default';
import { customTheme } from '@public/assets/theme';
import SharedTimelineList, { CommentTypeIcon as SharedCommentTypeIcon } from '@components/news/timeline';

type BillArticle = { title: string; contentHtml: string };

const CIRCLED_NUM = /^[\u2460-\u2473\u3251-\u325F\u32B1-\u32BF]/;
const NUMBERED = /^\d+(?:의\d+)?\.\s?/;
const LETTERED = /^[가-힣]\.\s/;

function classifyParagraph(el: Element) {
  const text = el.textContent?.trim() ?? '';
  if (CIRCLED_NUM.test(text)) el.classList.add('bill-circled');
  else if (NUMBERED.test(text)) el.classList.add('bill-numbered');
  else if (LETTERED.test(text)) el.classList.add('bill-lettered');
}

function parseBillArticles(html: string): BillArticle[] {
  if (!html?.trim()) return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const articles: BillArticle[] = [];
  let current: BillArticle | null = null;

  Array.from(doc.body.children).forEach((el) => {
    if (el.tagName === 'UL') {
      if (current && current.contentHtml) articles.push(current);
      const title = el.querySelector('li')?.innerHTML?.trim() || '';
      current = { title, contentHtml: '' };
    } else if (current) {
      if (el.tagName === 'P') classifyParagraph(el);
      current.contentHtml += el.outerHTML;
    }
  });
  if (current && (current as BillArticle).contentHtml) articles.push(current);
  return articles;
}

export default function ExecutiveNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();

  const [billArticles, setBillArticles] = useState<BillArticle[]>([]);
  useEffect(() => {
    setBillArticles(parseBillArticles(news.billDetail ?? ''));
  }, [news.billDetail]);

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

  // Mobile tab state
  const [activeTab, setActiveTab] = useState(0);

  const showAmendment = !!(news.billAmendment?.replace(/<[^>]*>/g, '').trim());

  const debateSlides = useMemo(() => {
    return [
      { label: '찬성', content: news.proDebate ?? '' },
      { label: '반대', content: news.conDebate ?? '' },
    ];
  }, [news.proDebate, news.conDebate]);

  return (
    <Wrapper>
      <Content>
        <Header>
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
        </Header>

        <Grid>
          <Card>
            <SectionTitle>타임라인</SectionTitle>
            <SharedTimelineList timeline={timelineGroups} flat />
          </Card>

          <Card>
            <SectionTitle>주요 내용</SectionTitle>
            <SummaryHtml style={{ display: 'block', marginLeft: 0 }} dangerouslySetInnerHTML={{ __html: news.billSummary ?? '' }} />
          </Card>

          <Card>
            <SectionTitle>토론</SectionTitle>

            {showAmendment && (
              <AmendmentBox $show>
                <DebateLabel>수정안 내용</DebateLabel>
                <DebateContent dangerouslySetInnerHTML={{ __html: news.billAmendment ?? '' }} />
              </AmendmentBox>
            )}

            {/* PC: side by side */}
            <DebateGrid>
              <DebateSide>
                <DebateLabel>찬성</DebateLabel>
                <DebateContent dangerouslySetInnerHTML={{ __html: news.proDebate ?? '' }} />
              </DebateSide>
              <DebateSide>
                <DebateLabel>반대</DebateLabel>
                <DebateContent dangerouslySetInnerHTML={{ __html: news.conDebate ?? '' }} />
              </DebateSide>
            </DebateGrid>

            {/* Mobile: toggle tabs */}
            <MobileDebateWrapper>
              <DebateTabs>
                {debateSlides.map((slide, i) => (
                  <DebateTab
                    key={i}
                    $active={i === activeTab}
                    onClick={() => setActiveTab(i)}
                  >
                    {slide.label}
                  </DebateTab>
                ))}
              </DebateTabs>
              <DebateTabContent
                dangerouslySetInnerHTML={{ __html: debateSlides[activeTab]?.content ?? '' }}
              />
            </MobileDebateWrapper>
          </Card>

          {billArticles.length > 0 && (
            <Card>
              <SectionTitle>시행령 상세보기</SectionTitle>
              <BillArticleGroups>
                {billArticles.map((article, idx) => (
                  <BillArticleGroup key={idx}>
                    <summary>
                      <span dangerouslySetInnerHTML={{ __html: article.title }} />
                    </summary>
                    <BillArticleContent dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                  </BillArticleGroup>
                ))}
              </BillArticleGroups>
            </Card>
          )}

          <Card>
            <SectionTitle>브리핑 및 기타 반응</SectionTitle>
            <SummaryList>
              {(news.summaries ?? []).filter(s => s.summary?.replace(/<[^>]*>/g, '').trim()).map((summary, idx) => (
                <SummaryListItem key={summary.commentType + idx}>
                  <CommentTypeIcon type={summary.commentType} />
                  <SummaryHtml
                    dangerouslySetInnerHTML={{ __html: summary.summary }}
                  />
                </SummaryListItem>
              ))}
            </SummaryList>
          </Card>
        </Grid>
      </Content>
    </Wrapper>
  );
}

// --- CommentTypeIcon ---

const CommentTypeIcon = ({ type }: { type: commentType }) => (
  <CommentTypeIconWrapper>
    <img
      src={commentTypeImg(type)}
      alt={type}
      style={{ width: 16, height: 16, verticalAlign: 'middle' }}
    />
  </CommentTypeIconWrapper>
);

// --- Styled Components ---

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.yvote02};
  display: flex;
  justify-content: center;
  padding: 16px 0 40px;
`;

const Content = styled.div`
  width: 98%;
  max-width: 1120px;
  color: ${({ theme }) => theme.colors.yvote13};

  @media screen and (max-width: 768px) {
    max-width: none;
  }
`;

const Header = styled.section`
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

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const Card = styled.section`
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

const CommentTypeIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-left: 4px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.yvote04};
  background: ${({ theme }) => theme.colors.yvote01};
  box-sizing: border-box;
`;

// Bill article styles

const BillArticleGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BillArticleGroup = styled.details`
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
    color: ${({ theme }) => theme.colors.yvote12};
    padding: 6px 0;
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
`;

const BillArticleContent = styled.div`
  padding: 8px 0 0;
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.6;
  font-size: 1rem;
  word-break: break-word;

  s {
    text-decoration: line-through;
    text-decoration-thickness: 0.8px;
    color: ${customTheme.colors.gray700};
  }

  p {
    margin: 0 0 6px;
  }

  p:has(strong) {
    margin-top: 20px;
  }

  p:first-child:has(strong) {
    margin-top: 0;
  }

  p:has(> br:only-child) {
    margin: 0;
    line-height: 0.8;
  }

  p.bill-circled {
    padding-left: 1.1em;
    text-indent: -1.1em;
  }

  p.bill-numbered {
    padding-left: 3em;
    text-indent: -1.5em;
  }

  p.bill-lettered {
    padding-left: 4em;
    text-indent: -1.5em;
  }

  p.ql-align-center {
    text-align: center;
  }

`;

// Debate styles

const DebateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const DebateSide = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.yvote01};
`;

const DebateLabel = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.yvote05};
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

const AmendmentBox = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.yvote01};

  @media screen and (max-width: 768px) {
    display: ${({ $show }) => ($show ? 'block' : 'none')};
  }
`;

const DebateContent = styled.div`
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.6;
  font-size: 0.95rem;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }
`;

// Mobile debate tabs (mobile only)

const MobileDebateWrapper = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const DebateTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DebateTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.yvote12 : theme.colors.yvote05)};
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.yvote12 : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote01 : theme.colors.yvote12)};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const DebateTabContent = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.yvote01};
  color: ${({ theme }) => theme.colors.yvote12};
  line-height: 1.6;
  font-size: 0.95rem;
  word-break: break-word;

  p {
    margin: 0 0 6px;
  }
`;

// Summary styles

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
