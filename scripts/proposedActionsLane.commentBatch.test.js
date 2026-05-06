const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');

const sourcePath = path.join(
  __dirname,
  '..',
  'components',
  'admin',
  'proposedActionsLane',
  'commentBatch.ts',
);

const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
}).outputText;

const sandbox = { module: { exports: {} }, require };
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(compiled, sandbox, { filename: sourcePath });

const { excludeCommentFromPayload, getEditableCommentBatch } = sandbox.module.exports;

function loadTsModule(filePath, requireOverrides = {}) {
  const moduleSource = fs.readFileSync(filePath, 'utf8');
  const moduleCompiled = ts.transpileModule(moduleSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  }).outputText;
  const moduleSandbox = {
    module: { exports: {} },
    require: (name) => requireOverrides[name] ?? require(name),
  };
  moduleSandbox.exports = moduleSandbox.module.exports;
  vm.runInNewContext(moduleCompiled, moduleSandbox, { filename: filePath });
  return moduleSandbox.module.exports;
}

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

assert.strictEqual(
  getEditableCommentBatch({ commentPayloadsSummary: { previews: [{}] } }),
  null,
  'compacted previews are not editable because they are not the approval payload',
);

const rowSource = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'proposedActionsLane', 'Row.tsx'),
  'utf8',
);
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

const {
  getProposedActionMainTitle,
} = loadTsModule(
  path.join(__dirname, '..', 'components', 'admin', 'proposedActionsLane', 'rowDisplay.ts'),
  {
    '@utils/interface/proposedAction': {
      ProposedActionType: {
        CreateNews: 'create_news',
        RouteComment: 'route_comment',
        SplitComment: 'split_comment',
        PromoteType: 'promote_type',
        Publish: 'publish',
        Track: 'track',
        Untrack: 'untrack',
        EditComment: 'edit_comment',
        FillNews: 'fill_news',
      },
    },
  },
);
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
