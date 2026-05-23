import { proposedActionRepository } from '@repositories/proposedAction';
import { ProposedActionSource, ProposedActionType } from '@utils/interface/proposedAction';

export type TrackedLaneAction = 'publish' | 'unpublish' | 'untrack';

export type TrackedLaneActionResult = {
  ok?: boolean;
  pa_id?: number | null;
  detail?: string;
  action?: TrackedLaneAction;
  news_id?: number;
};

const ACTION_TYPE: Record<TrackedLaneAction, ProposedActionType> = {
  publish: ProposedActionType.Publish,
  unpublish: ProposedActionType.Unpublish,
  untrack: ProposedActionType.Untrack,
};

export async function runTrackedAction(
  action: TrackedLaneAction,
  newsId: number,
): Promise<TrackedLaneActionResult> {
  const created = await proposedActionRepository.create({
    actionType: ACTION_TYPE[action],
    newsId,
    payload: { newsId },
    source: ProposedActionSource.User,
    note: `adminjae2 ${action} button`,
  });
  const approved = await proposedActionRepository.approveAndApply(created.id);
  return {
    ok: approved.ok,
    pa_id: approved.pa_id ?? created.id,
    detail: approved.detail ?? `${action} applied`,
    action,
    news_id: newsId,
  };
}
