import type { ProposedAction, ProposedActionType } from '@utils/interface/proposedAction';

import {
  extractActionComments as extractActionCommentsCore,
  getProposedActionMainTitle as getProposedActionMainTitleCore,
  getProposedActionTargetNewsId as getProposedActionTargetNewsIdCore,
  TYPE_LABEL as TYPE_LABEL_CORE,
} from './rowDisplayCore';

export const TYPE_LABEL = TYPE_LABEL_CORE as Record<ProposedActionType, string>;

export type CommentPreview = {
  commentType?: string;
  title?: string;
  body?: string;
  date?: string;
  bytes?: number;
};

export function getProposedActionTargetNewsId(action: ProposedAction): number | undefined {
  return getProposedActionTargetNewsIdCore(action) as number | undefined;
}

export function extractActionComments(
  action: Pick<ProposedAction, 'actionType' | 'payload'>,
): CommentPreview[] {
  return extractActionCommentsCore(action) as CommentPreview[];
}

export function getProposedActionMainTitle(
  action: ProposedAction,
  comments: CommentPreview[],
  targetTitle?: string,
) {
  return getProposedActionMainTitleCore(action, comments, targetTitle) as string;
}
