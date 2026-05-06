import { ProposedAction, ProposedActionType } from '@utils/interface/proposedAction';

export const TYPE_LABEL: Record<ProposedActionType, string> = {
  [ProposedActionType.CreateNews]: 'create news',
  [ProposedActionType.RouteComment]: 'route comment',
  [ProposedActionType.SplitComment]: 'split comment',
  [ProposedActionType.Publish]: 'publish',
  [ProposedActionType.PromoteType]: 'promote type',
  [ProposedActionType.Track]: 'track',
  [ProposedActionType.Untrack]: 'untrack',
  [ProposedActionType.EditComment]: 'edit comment',
  [ProposedActionType.FillNews]: 'fill news',
};

export type CommentPreview = {
  commentType?: string;
  title?: string;
  body?: string;
  date?: string;
  bytes?: number;
};

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

export function getProposedActionTargetNewsId(action: ProposedAction): number | undefined {
  const payload = action.payload ?? {};
  const destinations = Array.isArray(payload.destinations) ? payload.destinations : [];
  const firstDestination =
    destinations.length > 0 && destinations[0] && typeof destinations[0] === 'object'
      ? (destinations[0] as Record<string, unknown>)
      : undefined;
  return (
    asNumber(payload.targetNewsId) ??
    asNumber(firstDestination?.targetNewsId) ??
    asNumber(payload.newsId) ??
    asNumber(action.newsId)
  );
}

export function getProposedActionMainTitle(
  action: ProposedAction,
  comments: CommentPreview[],
  targetTitle?: string,
) {
  const payload = action.payload ?? {};
  const payloadTitle = asString(payload.title);

  if (
    action.actionType === ProposedActionType.RouteComment ||
    action.actionType === ProposedActionType.SplitComment
  ) {
    const targetNewsId = getProposedActionTargetNewsId(action);
    return (
      targetTitle ??
      (targetNewsId ? `news #${targetNewsId}` : undefined) ??
      payloadTitle ??
      comments[0]?.title ??
      TYPE_LABEL[action.actionType]
    );
  }

  return (
    payloadTitle ??
    comments[0]?.title ??
    targetTitle ??
    (action.newsId ? `news #${action.newsId}` : TYPE_LABEL[action.actionType])
  );
}
