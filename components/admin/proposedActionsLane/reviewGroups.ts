import type { ProposedAction } from '@utils/interface/proposedAction';

import { groupProposedActionsForReview as groupProposedActionsForReviewCore } from './reviewGroupsCore';

export type ProposedActionReviewGroupKind =
  | 'comments_to_existing'
  | 'create_with_extractions'
  | 'single';

export type ProposedActionReviewGroup = {
  key: string;
  kind: ProposedActionReviewGroupKind;
  actions: ProposedAction[];
  targetNewsId?: number;
  title?: string;
};

export function groupProposedActionsForReview(
  actions: ProposedAction[],
): ProposedActionReviewGroup[] {
  return groupProposedActionsForReviewCore(actions) as ProposedActionReviewGroup[];
}
