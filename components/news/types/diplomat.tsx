import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import TimelineList from '@components/news/timeline';
import { useCommentModal } from '@utils/hook/news/useCommentModal_NewsDetail';
import { commentType } from '@utils/interface/news';
import { getCommentTypeRank } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { NewsTypeLayoutProps } from './default';
import { resolveAchievementBody } from './diplomatCore';

// ─── Hero data shape ───────────────────────────────────────────────
// Diplomat-specific structured metadata is stored on the News row in the
// existing `agendaList` string column (same column cabinet/budget use for
// their type-specific JSON). Schema:
//   {
//     "hero": { kind, countries, orgName?, orgNameKo? },
//     "achievementsByKey": { <key>: "<html>" }
//   }
// `kind: 'bilateral'` lists 1+ counterparties (Korea implicit).
// `kind: 'multilateral'` covers summit orgs (APEC / NATO / 유엔 / G20)
// where individual flags don't make sense — an org badge anchors instead.
type CountrySeed = { code: string; nameKo: string; nameEn: string };

type DiplomatHero =
  | {
      kind: 'bilateral';
      countries: CountrySeed[];
    }
  | {
      kind: 'multilateral';
      orgName: string;
      orgNameKo?: string;
      countries?: CountrySeed[];
    };

type DiplomatAgenda = {
  hero?: DiplomatHero;
  achievementsByKey?: Record<string, string>;
};

function parseDiplomatAgenda(raw: string | undefined | null): DiplomatAgenda | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as DiplomatAgenda;
    }
  } catch {
    return null;
  }
  return null;
}

type CountryFacts = CountrySeed & {
  flagUrl?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  currency?: string;
  languages?: string[];
};

export default function DiplomatNewsLayout({ news }: NewsTypeLayoutProps) {
  const { showCommentModal } = useCommentModal();
  const agenda = useMemo<DiplomatAgenda | null>(
    () => parseDiplomatAgenda(news.agendaList ?? null),
    [news.agendaList],
  );
  const hero = agenda?.hero ?? null;
  const achievementsByKey = agenda?.achievementsByKey;

  const seedCountries = useMemo<CountrySeed[]>(() => {
    if (!hero) return [];
    if (hero.kind === 'bilateral') return hero.countries;
    return hero.countries ?? [];
  }, [hero]);

  const [facts, setFacts] = useState<CountryFacts[]>(() => seedCountries.map((c) => ({ ...c })));

  useEffect(() => {
    if (seedCountries.length === 0) {
      setFacts([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      seedCountries.map(async (seed) => {
        try {
          const r = await fetch(`https://restcountries.com/v3.1/alpha/${seed.code}`);
          if (!r.ok) return { ...seed };
          const data = await r.json();
          const c = Array.isArray(data) ? data[0] : data;
          if (!c) return { ...seed };
          const currencies = c.currencies ? Object.values(c.currencies) : [];
          const firstCurrency = currencies[0] as { name?: string } | undefined;
          return {
            ...seed,
            flagUrl: c.flags?.svg || c.flags?.png,
            capital: Array.isArray(c.capital) ? c.capital[0] : c.capital,
            region: c.region,
            subregion: c.subregion,
            population: c.population,
            currency: firstCurrency?.name,
            languages: c.languages ? (Object.values(c.languages) as string[]) : undefined,
          } as CountryFacts;
        } catch {
          return { ...seed };
        }
      }),
    ).then((arr) => {
      if (!cancelled) setFacts(arr);
    });
    return () => {
      cancelled = true;
    };
  }, [seedCountries]);

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
      titles.forEach((title) => {
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

  // Diplomat reactions are flat: news.summaries[*].summary is a plain
  // string (no JSON wrapper, no per-date arrays). Empty strings are
  // valid — the LLM intentionally emits "" when a commentType's
  // material was already absorbed into 외교성과 (typical for 청와대
  // on a forum-attendance news). Render only the non-empty ones.
  // Order: presidential → 행정부 → conservative parties → progressive
  // parties → 입법부 → 기타.
  const reactionRows = useMemo(() => {
    const SUMMARY_ORDER: string[] = [
      commentType.청와대,
      commentType.대통령실,
      commentType.행정부,
      commentType.한나라당,
      commentType.새누리당,
      commentType.자유한국당,
      commentType.미래통합당,
      commentType.국민의힘,
      commentType.통합민주당,
      commentType.민주당,
      commentType.민주통합당,
      commentType.새정치민주연합,
      commentType.더불어민주당,
      commentType.입법부,
      commentType.기타,
    ];
    return (news.summaries ?? [])
      .filter((s) => (s.summary ?? '').trim().length > 0)
      .sort((a, b) => {
        const ai = SUMMARY_ORDER.indexOf(a.commentType);
        const bi = SUMMARY_ORDER.indexOf(b.commentType);
        return (ai === -1 ? SUMMARY_ORDER.length : ai) - (bi === -1 ? SUMMARY_ORDER.length : bi);
      });
  }, [news.summaries]);

  // 외교 성과 selection — clicking a country/org strip switches the
  // section content. Default: orgName for multilateral, first country
  // code for bilateral.
  const defaultHeroKey = useMemo<string | null>(() => {
    if (!hero) return null;
    if (hero.kind === 'multilateral') return hero.orgName;
    return hero.countries[0]?.code ?? null;
  }, [hero]);

  const [selectedHeroKey, setSelectedHeroKey] = useState<string | null>(defaultHeroKey);
  useEffect(() => {
    setSelectedHeroKey(defaultHeroKey);
  }, [defaultHeroKey]);

  const heroKeyOptions = useMemo<string[]>(() => {
    if (!hero) return [];
    if (hero.kind === 'multilateral') {
      return [hero.orgName, ...(hero.countries ?? []).map((c) => c.code)];
    }
    return hero.countries.map((c) => c.code);
  }, [hero]);

  // 외교 성과 body resolved inline in the section JSX from achievementsByKey.

  const populationKo = (n?: number) =>
    !n
      ? null
      : n >= 1e8
      ? `${(n / 1e8).toFixed(1)}억 인구`
      : n >= 1e4
      ? `${Math.round(n / 1e4).toLocaleString()}만 인구`
      : `${n.toLocaleString()} 인구`;

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
                  onClick={() => showCommentModal(news.id, type as commentType, news.title)}
                />
              ))}
            </CommentIcons>
          ) : null}
        </div>
      </Header>

      <Section>
        <SectionTitle>타임라인</SectionTitle>
        <SectionBody>
          <TimelineList timeline={timelineGroups} />
        </SectionBody>
      </Section>

      {hero && (
        <Section>
          <SectionTitle>당사국</SectionTitle>
          <SectionBody>
            {hero.kind === 'multilateral' ? (
              <MultilateralStack>
                <MultilateralOrgRow
                  $selectable={heroKeyOptions.length > 1}
                  $selected={selectedHeroKey === hero.orgName}
                  onClick={
                    heroKeyOptions.length > 1 ? () => setSelectedHeroKey(hero.orgName) : undefined
                  }
                >
                  <OrgBadge>{hero.orgName}</OrgBadge>
                  <StripBody>
                    <StripName>
                      <span className="ko">{hero.orgNameKo ?? hero.orgName}</span>
                      {hero.orgNameKo && <span className="en">{hero.orgName}</span>}
                    </StripName>
                  </StripBody>
                </MultilateralOrgRow>

                {facts.length > 0 && (
                  <>
                    <BilateralSubheader>부속 양자회담</BilateralSubheader>
                    <BilateralStack>
                      {facts.map((f) => (
                        <CountryStrip
                          key={f.code}
                          $selectable={heroKeyOptions.length > 1}
                          $selected={selectedHeroKey === f.code}
                          onClick={
                            heroKeyOptions.length > 1 ? () => setSelectedHeroKey(f.code) : undefined
                          }
                        >
                          <Flag>
                            {f.flagUrl ? (
                              <img src={f.flagUrl} alt={`${f.nameKo} 국기`} />
                            ) : (
                              <FlagPlaceholder>{f.nameKo[0]}</FlagPlaceholder>
                            )}
                          </Flag>
                          <StripBody>
                            <StripName>
                              <span className="ko">{f.nameKo}</span>
                              <span className="en">{f.nameEn}</span>
                            </StripName>
                            <StripFacts>
                              {f.capital && <Fact>수도 {f.capital}</Fact>}
                              {f.region && (
                                <Fact>
                                  {f.region}
                                  {f.subregion ? ` · ${f.subregion}` : ''}
                                </Fact>
                              )}
                              {populationKo(f.population) && (
                                <Fact>{populationKo(f.population)}</Fact>
                              )}
                              {f.currency && <Fact>{f.currency}</Fact>}
                              {f.languages && f.languages.length > 0 && (
                                <Fact>{f.languages.slice(0, 2).join(' · ')}</Fact>
                              )}
                            </StripFacts>
                          </StripBody>
                        </CountryStrip>
                      ))}
                    </BilateralStack>
                  </>
                )}
              </MultilateralStack>
            ) : (
              <BilateralStack>
                {facts.map((f) => (
                  <CountryStrip
                    key={f.code}
                    $selectable={heroKeyOptions.length > 1}
                    $selected={selectedHeroKey === f.code}
                    onClick={
                      heroKeyOptions.length > 1 ? () => setSelectedHeroKey(f.code) : undefined
                    }
                  >
                    <Flag>
                      {f.flagUrl ? (
                        <img src={f.flagUrl} alt={`${f.nameKo} 국기`} />
                      ) : (
                        <FlagPlaceholder>{f.nameKo[0]}</FlagPlaceholder>
                      )}
                    </Flag>
                    <StripBody>
                      <StripName>
                        <span className="ko">{f.nameKo}</span>
                        <span className="en">{f.nameEn}</span>
                      </StripName>
                      <StripFacts>
                        {f.capital && <Fact>수도 {f.capital}</Fact>}
                        {f.region && (
                          <Fact>
                            {f.region}
                            {f.subregion ? ` · ${f.subregion}` : ''}
                          </Fact>
                        )}
                        {populationKo(f.population) && <Fact>{populationKo(f.population)}</Fact>}
                        {f.currency && <Fact>{f.currency}</Fact>}
                        {f.languages && f.languages.length > 0 && (
                          <Fact>{f.languages.slice(0, 2).join(' · ')}</Fact>
                        )}
                      </StripFacts>
                    </StripBody>
                  </CountryStrip>
                ))}
              </BilateralStack>
            )}
          </SectionBody>
        </Section>
      )}

      {(() => {
        const body = resolveAchievementBody(hero, selectedHeroKey, achievementsByKey);
        if (!body) return null;
        return (
          <Section>
            <SectionTitle>외교 성과</SectionTitle>
            <SectionBody>
              <AchievementFeed>
                <AchievementBody dangerouslySetInnerHTML={{ __html: body }} />
              </AchievementFeed>
            </SectionBody>
          </Section>
        );
      })()}

      {reactionRows.length > 0 && (
        <Section>
          <SectionTitle>정부 및 정당 반응</SectionTitle>
          <SectionBody>
            <ReactionList>
              {reactionRows.map((s, idx) => (
                <ReactionRow key={s.commentType + idx}>
                  <ReactionType>
                    <CommentTypeIcon type={s.commentType} size={14} />
                    <span>{s.commentType}</span>
                  </ReactionType>
                  <ReactionBody dangerouslySetInnerHTML={{ __html: s.summary }} />
                </ReactionRow>
              ))}
            </ReactionList>
          </SectionBody>
        </Section>
      )}
    </Wrapper>
  );
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

const SectionBody = styled.div`
  padding: 0 6px;

  @media (max-width: 768px) {
    padding: 0 10px;
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

// ─── Bilateral country strip(s) ─────────────────────────────────────
const BilateralStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CountryStrip = styled.div<{ $selectable?: boolean; $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  ${({ $selectable }) => ($selectable ? 'cursor: pointer;' : '')}
  ${({ $selected, theme }) =>
    $selected
      ? `
        background: ${theme.colors.yvote03};
        border-color: ${theme.colors.yvote12};
      `
      : ''}

  ${({ $selectable, $selected, theme }) =>
    $selectable && !$selected
      ? `
        &:hover {
          background: ${theme.colors.yvote02};
          border-color: ${theme.colors.yvote05};
        }
      `
      : ''}

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Flag = styled.div`
  width: 48px;
  height: 32px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 27px;
  }
`;

const FlagPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote09};
  background: ${({ theme }) => theme.colors.yvote04};
`;

const StripBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const StripName = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;

  .ko {
    font-family: 'Noto Serif KR', Georgia, serif;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.yvote13};
    letter-spacing: -0.01em;
  }

  .en {
    font-family: Helvetica, sans-serif;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.yvote08};
  }
`;

const StripFacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.yvote08};
`;

const Fact = styled.span`
  white-space: nowrap;

  & + &::before {
    content: '·';
    margin-right: 12px;
    color: ${({ theme }) => theme.colors.yvote07};
  }
`;

// ─── Multilateral (org row + optional bilateral side-meeting stack) ─
const MultilateralStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MultilateralOrgRow = styled.div<{ $selectable?: boolean; $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  ${({ $selectable }) => ($selectable ? 'cursor: pointer;' : '')}
  ${({ $selected, theme }) =>
    $selected
      ? `
        background: ${theme.colors.yvote03};
        border-color: ${theme.colors.yvote12};
      `
      : ''}

  ${({ $selectable, $selected, theme }) =>
    $selectable && !$selected
      ? `
        &:hover {
          background: ${theme.colors.yvote02};
          border-color: ${theme.colors.yvote05};
        }
      `
      : ''}
`;

const OrgBadge = styled.div`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote13};
  background: ${({ theme }) => theme.colors.yvote04};
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  padding: 8px 14px;
  border-radius: 4px;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  min-width: 60px;
  text-align: center;
`;

const BilateralSubheader = styled.div`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote09};
  letter-spacing: -0.01em;
  padding: 6px 0 2px;
  border-top: 1px dashed ${({ theme }) => theme.colors.yvote05};
`;

// ─── 외교 성과 (presidential achievements, no dates) ─────────────────
const AchievementFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 3px solid ${({ theme }) => theme.colors.yvote12};
  padding-left: 16px;

  @media (max-width: 768px) {
    padding-left: 12px;
  }
`;

const AchievementBody = styled.div`
  font-size: 15px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.yvote12};
  white-space: pre-wrap;

  p {
    margin: 0 0 6px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.7;
  }
`;

// ─── 정부 및 정당 반응 (one combined block per commentType) ─────────
const ReactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReactionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote05};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ReactionType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote13};
  letter-spacing: -0.01em;
`;

const ReactionBody = styled.div`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.yvote12};
  white-space: pre-wrap;

  p {
    margin: 0 0 6px;
  }

  ul,
  ol {
    margin: 4px 0 6px 18px;
    padding: 0;
  }

  word-break: break-word;
`;
