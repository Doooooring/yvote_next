export enum ProposedActionType {
  CreateNews = 'create_news',
  RouteComment = 'route_comment',
  SplitComment = 'split_comment',
  PromoteType = 'promote_type',
  Publish = 'publish',
  Track = 'track',
  Untrack = 'untrack',
  EditComment = 'edit_comment',
  FillNews = 'fill_news',
}

// Note: `finish_news` was removed 2026-04-27 (Phase 8.3 of the
// 2026-04-27-news-lifecycle-cross-repo plan). The yvote-api enum
// dropped it in the same release; yvote_automation's apply.py shim
// rewrites legacy `finish_news` rows to `publish` at apply-time.
//
// `fill_news` was added 2026-04-28 (single-tier rule, Phase 8.5):
// per-row content (re)generation. Powers the /adminjae2 Fill button
// (TrackedLane) and the Telegram `fill <id>` command. Preserves the
// row's `state` (works on draft state=1 AND already-published state=0).

export enum ProposedActionStatus {
  // Renamed 2026-05-04: 'pending' → 'waiting' to disambiguate from
  // News.state 'pending' (= draft). Backend migration
  // RenameProposedActionPendingToWaiting1777822084423 rewrote existing
  // rows in lockstep with this rename.
  Waiting = 'waiting',
  Approved = 'approved',
  Rejected = 'rejected',
  Applied = 'applied',
  Obsolete = 'obsolete',
}

export enum ProposedActionSource {
  ClaudeTriage = 'claude_triage',
  ClaudeFinished = 'claude_finished',
  ClaudeAnticipation = 'claude_anticipation',
  User = 'user',
}

export interface ProposedAction {
  id: number;
  createdAt: string;
  actionType: ProposedActionType;
  payload: Record<string, unknown>;
  status: ProposedActionStatus;
  appliedAt?: string | null;
  newsId?: number | null;
  source: ProposedActionSource;
  note?: string | null;
}
