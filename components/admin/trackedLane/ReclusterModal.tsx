import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

interface CommentIndexEntry {
  ref: string;
  news_id: number;
  commentType: string;
  comment_id: string;
  title: string;
  date: string;
  body_head: string;
}

interface ClusterFromServer {
  label: string;
  rationale?: string;
  suggested_action?: 'keep_in' | 'move_to' | 'create_new' | 'to_weekly';
  suggested_target_news_id?: number | null;
  suggested_new_title?: string;
  suggested_new_news_type?: string;
  comment_refs: string[];
}

interface SelectedNewsEntry {
  id: number;
  title: string;
  newsType: string;
}

interface ServerReport {
  ok: boolean;
  selected_news: SelectedNewsEntry[];
  clusters: ClusterFromServer[];
  outliers?: string[];
  comment_index: Record<string, CommentIndexEntry>;
  note?: string;
  error?: string;
}

interface Props {
  newsIds: number[];
  onClose: () => void;
}

type ActionPick = 'keep_in' | 'move_to' | 'create_new' | 'to_weekly';

interface ClusterDecision {
  action: ActionPick;
  target_news_id?: number;
  new_title?: string;
  new_news_type?: string;
}

export default function ReclusterModal({ newsIds, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ServerReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<ClusterDecision[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/adminjae2/recluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news_ids: newsIds }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setError(data.error || 'recluster failed');
          setReport(null);
        } else {
          const r: ServerReport = data.report;
          setReport(r);
          // Initialize decisions from LLM suggestions.
          setDecisions(
            (r.clusters || []).map((c) => ({
              action: c.suggested_action || 'keep_in',
              target_news_id: c.suggested_target_news_id || undefined,
              new_title: c.suggested_new_title || '',
              new_news_type: c.suggested_new_news_type || 'debate',
            })),
          );
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [newsIds]);

  const selectedNewsOptions = useMemo(() => report?.selected_news || [], [report]);

  const updateDecision = (i: number, patch: Partial<ClusterDecision>) => {
    setDecisions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  };

  const submit = async () => {
    if (!report) return;
    setSubmitting(true);
    setSubmitResult(null);
    const payload = {
      decisions: report.clusters.map((c, i) => {
        const d = decisions[i] || { action: 'keep_in' };
        const base: Record<string, unknown> = {
          action: d.action,
          refs: c.comment_refs,
          cluster_label: c.label,
        };
        if (d.action === 'move_to') {
          base.target_news_id = d.target_news_id;
        }
        if (d.action === 'create_new') {
          base.title = (d.new_title || c.label || '').trim() || c.label;
          base.newsType = d.new_news_type || 'debate';
        }
        return base;
      }),
    };
    try {
      const r = await fetch('/api/adminjae2/recluster-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!data.success) {
        setSubmitResult(`실패: ${JSON.stringify(data.report || data.error)}`);
      } else {
        setSubmitResult(`완료: ${data.report.results?.length || 0}개 결정 적용됨`);
      }
    } catch (e: unknown) {
      setSubmitResult(`에러: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>재배분 — selected news: {newsIds.join(', ')}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Body>
          {loading && <Status>클러스터링 중… (LLM 호출, 수십 초)</Status>}
          {error && <ErrorBlock>에러: {error}</ErrorBlock>}
          {report && (
            <>
              {report.note && <Status>{report.note}</Status>}
              {report.clusters.map((c, i) => {
                const d = decisions[i] || { action: 'keep_in' };
                return (
                  <Cluster key={i}>
                    <ClusterHeader>
                      <ClusterLabel>{c.label}</ClusterLabel>
                      <ClusterMeta>{c.comment_refs.length}개 댓글</ClusterMeta>
                    </ClusterHeader>
                    {c.rationale && <Rationale>{c.rationale}</Rationale>}
                    <CommentList>
                      {c.comment_refs.slice(0, 12).map((ref) => {
                        const e = report.comment_index[ref];
                        if (!e) return <li key={ref}>{ref}</li>;
                        return (
                          <li key={ref}>
                            <CommentSrc>[news {e.news_id} / {e.commentType}]</CommentSrc>{' '}
                            {e.title || '(no title)'}
                          </li>
                        );
                      })}
                      {c.comment_refs.length > 12 && (
                        <li>… +{c.comment_refs.length - 12}개</li>
                      )}
                    </CommentList>
                    <ActionRow>
                      <Picker>
                        <label>
                          <input
                            type="radio"
                            checked={d.action === 'keep_in'}
                            onChange={() => updateDecision(i, { action: 'keep_in' })}
                          />{' '}
                          유지
                        </label>
                        <label>
                          <input
                            type="radio"
                            checked={d.action === 'move_to'}
                            onChange={() => updateDecision(i, { action: 'move_to' })}
                          />{' '}
                          이동 →
                        </label>
                        <select
                          disabled={d.action !== 'move_to'}
                          value={d.target_news_id || ''}
                          onChange={(e) =>
                            updateDecision(i, { target_news_id: Number(e.target.value) || undefined })
                          }
                        >
                          <option value="">(news id)</option>
                          {selectedNewsOptions.map((n) => (
                            <option key={n.id} value={n.id}>
                              {n.id} — {n.title.slice(0, 30)}
                            </option>
                          ))}
                        </select>
                        <label>
                          <input
                            type="radio"
                            checked={d.action === 'create_new'}
                            onChange={() => updateDecision(i, { action: 'create_new' })}
                          />{' '}
                          새 뉴스 생성
                        </label>
                        <input
                          type="text"
                          placeholder="새 뉴스 제목"
                          value={d.new_title || ''}
                          disabled={d.action !== 'create_new'}
                          onChange={(e) => updateDecision(i, { new_title: e.target.value })}
                        />
                        <select
                          disabled={d.action !== 'create_new'}
                          value={d.new_news_type || 'debate'}
                          onChange={(e) => updateDecision(i, { new_news_type: e.target.value })}
                        >
                          <option value="debate">debate</option>
                          <option value="executive">executive</option>
                          <option value="diplomat">diplomat</option>
                          <option value="others">others</option>
                        </select>
                        <label>
                          <input
                            type="radio"
                            checked={d.action === 'to_weekly'}
                            onChange={() => updateDecision(i, { action: 'to_weekly' })}
                          />{' '}
                          weekly로 보내기
                        </label>
                      </Picker>
                    </ActionRow>
                  </Cluster>
                );
              })}
              {report.outliers && report.outliers.length > 0 && (
                <Cluster>
                  <ClusterHeader>
                    <ClusterLabel>(outliers)</ClusterLabel>
                    <ClusterMeta>{report.outliers.length}개</ClusterMeta>
                  </ClusterHeader>
                  <CommentList>
                    {report.outliers.slice(0, 12).map((ref) => {
                      const e = report.comment_index[ref];
                      if (!e) return <li key={ref}>{ref}</li>;
                      return (
                        <li key={ref}>
                          <CommentSrc>[news {e.news_id} / {e.commentType}]</CommentSrc>{' '}
                          {e.title || '(no title)'}
                        </li>
                      );
                    })}
                  </CommentList>
                  <Hint>* outliers는 자동 처리되지 않음. 필요하면 별도로 조치하세요.</Hint>
                </Cluster>
              )}
            </>
          )}
        </Body>
        <Footer>
          {submitResult && <SubmitStatus>{submitResult}</SubmitStatus>}
          <FooterButtons>
            <SecondaryButton onClick={onClose}>취소</SecondaryButton>
            <PrimaryButton onClick={submit} disabled={submitting || !report}>
              {submitting ? '적용 중…' : '적용'}
            </PrimaryButton>
          </FooterButtons>
        </Footer>
      </Panel>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Panel = styled.div`
  background: white;
  width: min(900px, 95vw);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;
const Title = styled.h3`
  margin: 0;
  flex: 1;
  font-size: 16px;
`;
const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #555;
`;
const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
`;
const Status = styled.div`
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 8px;
`;
const ErrorBlock = styled.div`
  padding: 8px;
  background: #ffe9ec;
  color: #b00020;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 8px;
`;
const Cluster = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 10px;
`;
const ClusterHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;
const ClusterLabel = styled.h4`
  margin: 0;
  font-size: 14px;
`;
const ClusterMeta = styled.span`
  font-size: 12px;
  color: #666;
`;
const Rationale = styled.p`
  margin: 4px 0;
  font-size: 12px;
  color: #555;
`;
const CommentList = styled.ul`
  margin: 6px 0;
  padding-left: 18px;
  font-size: 12px;
`;
const CommentSrc = styled.span`
  color: #888;
  font-size: 11px;
`;
const ActionRow = styled.div`
  margin-top: 6px;
`;
const Picker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  select, input[type='text'] {
    font-size: 12px;
    padding: 2px 4px;
  }
`;
const Hint = styled.div`
  font-size: 11px;
  color: #888;
  margin-top: 4px;
`;
const Footer = styled.div`
  border-top: 1px solid #eee;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FooterButtons = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;
const SubmitStatus = styled.span`
  font-size: 12px;
  color: #444;
`;
const PrimaryButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const SecondaryButton = styled.button`
  background: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
`;
