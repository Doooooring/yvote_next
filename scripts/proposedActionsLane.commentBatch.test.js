const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  excludeCommentFromPayload,
  getEditableCommentBatch,
} = require('../components/admin/proposedActionsLane/commentBatchCore');
const {
  extractActionComments,
  getProposedActionMainTitle,
} = require('../components/admin/proposedActionsLane/rowDisplayCore');
const {
  groupProposedActionsForReview,
} = require('../components/admin/proposedActionsLane/reviewGroupsCore');

const routePayload = {
  targetNewsId: 1232,
  commentPayloads: [
    { commentType: '입법부', title: 'keep first' },
    { commentType: '입법부', title: 'remove this' },
    { commentType: '민주당', title: 'keep last' },
  ],
  note: 'preserve me',
};

const batch = getEditableCommentBatch(routePayload);
assert.strictEqual(
  batch.key,
  'commentPayloads',
  'route_comment batches must expose commentPayloads as editable comments',
);
assert.strictEqual(batch.comments, routePayload.commentPayloads);

const trimmedRoutePayload = excludeCommentFromPayload(routePayload, 'commentPayloads', 1);
assert.deepStrictEqual(
  trimmedRoutePayload.commentPayloads.map((comment) => comment.title),
  ['keep first', 'keep last'],
  'excluding one route comment must remove only that payload entry',
);
assert.strictEqual(trimmedRoutePayload.note, 'preserve me');
assert.strictEqual(
  routePayload.commentPayloads.length,
  3,
  'excluding must not mutate the original action payload',
);

const createPayload = {
  title: 'new bill news',
  initialComments: [
    { commentType: '한나라당', title: 'keep' },
    { commentType: '민주당', title: 'exclude' },
  ],
};
const trimmedCreatePayload = excludeCommentFromPayload(createPayload, 'initialComments', 1);
assert.deepStrictEqual(
  trimmedCreatePayload.initialComments,
  [{ commentType: '한나라당', title: 'keep' }],
  'create_news batches must support excluding initialComments entries',
);

const splitBatchPayload = {
  destinations: [
    {
      targetNewsId: 1245,
      commentPayloads: [
        { commentType: '한나라당', title: 'keep target' },
        { commentType: '한나라당', title: 'exclude target' },
      ],
    },
  ],
  sourceReplacements: [
    { sourceCommentId: 45290, sourceRemainders: [{ title: 'keep remainder' }] },
    { sourceCommentId: 45291, sourceRemainders: [{ title: 'exclude remainder' }] },
  ],
};
const splitBatch = getEditableCommentBatch(splitBatchPayload);
assert.strictEqual(
  splitBatch.key,
  'destinations',
  'split_comment batches must expose destination comments as editable comments',
);
assert.deepStrictEqual(
  splitBatch.comments.map((comment) => comment.title),
  ['keep target', 'exclude target'],
);
const trimmedSplitBatch = excludeCommentFromPayload(splitBatchPayload, 'destinations', 1);
assert.deepStrictEqual(
  trimmedSplitBatch.destinations[0].commentPayloads,
  [{ commentType: '한나라당', title: 'keep target' }],
  'excluding a split target comment must remove that destination payload',
);
assert.deepStrictEqual(
  trimmedSplitBatch.sourceReplacements,
  [{ sourceCommentId: 45290, sourceRemainders: [{ title: 'keep remainder' }] }],
  'excluding a split target comment must remove the corresponding source replacement',
);

assert.strictEqual(
  getEditableCommentBatch({ commentPayloadsSummary: { previews: [{}] } }),
  null,
  'compacted previews are not editable because they are not the approval payload',
);

const rowSource = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'proposedActionsLane', 'Row.tsx'),
  'utf8',
);
const laneSource = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'proposedActionsLane', 'index.tsx'),
  'utf8',
);
const commentMoveGroupSource = fs.readFileSync(
  path.join(
    __dirname,
    '..',
    'components',
    'admin',
    'proposedActionsLane',
    'CommentMoveGroup.tsx',
  ),
  'utf8',
);
const proposedActionRepositorySource = fs.readFileSync(
  path.join(__dirname, '..', 'repositories', 'proposedAction', 'index.ts'),
  'utf8',
);
const adminApiDir = path.join(__dirname, '..', 'pages', 'api', 'adminjae2');
const adminApiSources = fs.existsSync(adminApiDir)
  ? fs
      .readdirSync(adminApiDir)
      .filter((name) => name.endsWith('.ts') || name.endsWith('.tsx'))
      .map((name) => fs.readFileSync(path.join(adminApiDir, name), 'utf8'))
      .join('\n')
  : '';
assert.doesNotMatch(
  rowSource,
  /comments\.slice\(\s*0\s*,\s*4\s*\)/,
  'ProposedActionsLane must not hide batched comments behind the old four-comment preview limit',
);
assert.match(
  rowSource,
  /comments\.map\(\(comment,\s*index\)/,
  'ProposedActionsLane should render the full extracted comment list',
);
assert.match(
  rowSource,
  /excludeMut\.mutate/,
  'ProposedActionsLane should expose a per-comment exclude action for editable batches',
);
assert.match(
  rowSource,
  /const showBody = !!expandedBodies\[bodyKey\]/,
  'Comment rows should keep bodies hidden by default so batched proposals stay compact',
);
assert.match(
  rowSource,
  /showBody && comment\.body/,
  'Comment body text should render only after the row is expanded',
);
assert.match(
  rowSource,
  /showBody \? 'hide body' : 'show body'/,
  'Comment rows should expose a compact show/hide body toggle',
);
assert.match(
  laneSource,
  /group\.kind === 'comments_to_existing'[\s\S]*<CommentMoveGroup/,
  'same-target comment moves should render through one merged review group, not repeated rows',
);
assert.match(
  commentMoveGroupSource,
  /approve \+ apply all/,
  'merged comment move group should expose one approve-and-apply-all action',
);
assert.match(
  commentMoveGroupSource,
  /approveAndApplyManyInBackground/,
  'merged comment move group should start one background grouped apply instead of blocking on every action',
);
assert.match(
  commentMoveGroupSource,
  /batchStarted/,
  'merged comment move group should keep approval disabled after the background worker starts',
);
assert.match(
  commentMoveGroupSource,
  /setBatchStarted\(true\)/,
  'merged comment move group should latch started background approvals to avoid duplicate workers',
);
assert.match(
  proposedActionRepositorySource,
  /\/api\/adminjae2\/apply-approved/,
  'approve buttons should use the local admin immediate-apply endpoint',
);
assert.match(
  proposedActionRepositorySource,
  /approveAndApply\(id: number\)/,
  'single approve helper should make immediate apply explicit in its name',
);
assert.match(
  adminApiSources,
  /workflow\.s06_apply_recovery_stage\.p03_apply_approved_actions\.apply_approved_now/,
  'adminjae2 immediate apply endpoint must call the current workflow apply module',
);
assert.doesNotMatch(
  adminApiSources,
  /manual\./,
  'adminjae2 API endpoints must not call the stale manual.* automation path',
);
assert.match(
  proposedActionRepositorySource,
  /\/api\/adminjae2\/apply-approved-many/,
  'batch approve should start the current grouped immediate-apply worker',
);
assert.doesNotMatch(
  commentMoveGroupSource,
  /for \(const action of group\.actions\)[\s\S]*proposedActionRepository\.approve\(action\.id\)/,
  'merged comment move group should not synchronously approve/apply every action in the browser request',
);
assert.match(
  commentMoveGroupSource,
  /reject all/,
  'merged comment move group should expose one reject-all action',
);
assert.match(
  commentMoveGroupSource,
  /excludeMut\.mutate/,
  'merged comment move group should keep per-comment exclusions possible',
);

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const splitPayloadForDisplay = {
  destinations: [
    {
      targetNewsId: 1245,
      commentPayloads: [{ commentType: '민주당', title: '세종시 extracted', body: 'target body' }],
    },
  ],
  sourceRemainders: [{ commentType: '민주당', title: 'weekly remainder', body: 'left in weekly' }],
};
assert.deepStrictEqual(
  plain(extractActionComments({ actionType: 'split_comment', payload: splitPayloadForDisplay })),
  [{ commentType: '민주당', title: '세종시 extracted', body: 'target body' }],
  'split_comment review should show only the destination-bound extracted comment, not the weekly remainder',
);

const grouped = groupProposedActionsForReview([
  {
    id: 1,
    actionType: 'route_comment',
    payload: {
      targetNewsId: 1245,
      commentPayloads: [{ title: 'whole 세종시 route' }],
    },
  },
  {
    id: 2,
    actionType: 'split_comment',
    payload: splitPayloadForDisplay,
  },
  {
    id: 3,
    actionType: 'publish',
    payload: { newsId: 1254 },
    newsId: 1254,
  },
]);
assert.strictEqual(
  grouped.length,
  2,
  'comment moves to the same target should collapse into one review category',
);
assert.strictEqual(grouped[0].kind, 'comments_to_existing');
assert.strictEqual(grouped[0].targetNewsId, 1245);
assert.deepStrictEqual(
  plain(grouped[0].actions.map((action) => action.id)),
  [1, 2],
  'route_comment and split_comment rows for the same target should be reviewed together',
);
assert.strictEqual(grouped[1].kind, 'single');
assert.strictEqual(grouped[1].actions[0].id, 3);
const splitAction = {
  actionType: 'split_comment',
  payload: { destinations: [{ targetNewsId: 1245 }] },
  newsId: null,
};
assert.strictEqual(
  getProposedActionMainTitle(
    splitAction,
    [{ title: 'split part should not headline the row' }],
    undefined,
  ),
  'news #1245',
  'split_comment rows should fall back to their first destination news id',
);

const routeAction = {
  actionType: 'route_comment',
  payload: { targetNewsId: 1232 },
  newsId: null,
};
assert.strictEqual(
  getProposedActionMainTitle(
    routeAction,
    [{ title: 'comment title should not headline the row' }],
    'Target bill news title',
  ),
  'Target bill news title',
  'route_comment rows should headline the destination news, not the first comment title',
);
assert.strictEqual(
  getProposedActionMainTitle(
    routeAction,
    [{ title: 'comment title should not headline the row' }],
    undefined,
  ),
  'news #1232',
  'route_comment rows should fall back to the target news id while the target title loads',
);
