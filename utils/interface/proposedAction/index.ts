export enum ProposedActionType {
  CreateNews = 'create_news',
  RouteComment = 'route_comment',
  SplitComment = 'split_comment',
  PromoteType = 'promote_type',
  Publish = 'publish',
  Unpublish = 'unpublish',
  Track = 'track',
  Untrack = 'untrack',
  EditNews = 'edit_news',
  EditComment = 'edit_comment',
}

// Note: `finish_news` was removed 2026-04-27 (Phase 8.3 of the
// 2026-04-27-news-lifecycle-cross-repo plan). The yvote-api enum
// dropped it in the same release; yvote_automation's apply.py shim
// rewrites legacy `finish_news` rows to `publish` at apply-time.

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
