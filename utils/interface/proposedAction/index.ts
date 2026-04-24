export enum ProposedActionType {
  CreateNews = 'create_news',
  RouteComment = 'route_comment',
  FinishNews = 'finish_news',
  Publish = 'publish',
  Track = 'track',
  Untrack = 'untrack',
}

export enum ProposedActionStatus {
  Pending = 'pending',
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
