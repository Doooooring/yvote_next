const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'trackedLane', 'FillButton.tsx'),
  'utf8',
);
const publishSource = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'trackedLane', 'PublishButton.tsx'),
  'utf8',
);
const untrackSource = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'trackedLane', 'UntrackButton.tsx'),
  'utf8',
);
const endpointSource = fs.readFileSync(
  path.join(__dirname, '..', 'pages', 'api', 'adminjae2', 'tracked-action.ts'),
  'utf8',
);
const runtimeSource = fs.readFileSync(
  path.join(__dirname, '..', 'utils', 'server', 'automationRuntime.ts'),
  'utf8',
);

assert.match(
  source,
  /export default function FillButton\(\{\s*newsId,\s*newsType\s*\}/s,
  'FillButton must accept newsType so manual fill can dispatch the type-specific pipeline',
);

assert.match(
  source,
  /runTrackedAction\(\s*'fill'\s*,\s*newsId\s*,\s*\{\s*background:\s*true\s*\}\s*\)/s,
  'FillButton must dispatch through the direct owner-command bridge in background mode',
);

assert.match(
  endpointSource,
  /company\.ceo\.adminjae2_direct_action/,
  'TrackedLane direct actions must call the automation owner-command bridge',
);

assert.match(
  endpointSource,
  /automationPython\(\)/,
  'TrackedLane direct actions must use the platform-aware Python executable resolver',
);

assert.match(
  runtimeSource,
  /process\.platform === 'win32' \? 'python' : 'python3'/,
  'Automation routes must use python on Windows because python3 is an App Execution Alias here',
);

assert.doesNotMatch(
  source,
  /proposedActionRepository\.create/,
  'FillButton must not create a waiting proposed_action in the browser',
);

assert.doesNotMatch(
  source,
  /approveManyInBackground/,
  'FillButton must not create first and rely on a later batch worker to approve',
);

assert.match(
  publishSource,
  /runTrackedAction\(\s*'publish'\s*,\s*newsId\s*\)/,
  'PublishButton must dispatch publish through the direct owner-command bridge',
);

assert.match(
  publishSource,
  /runTrackedAction\(\s*'unpublish'\s*,\s*newsId\s*\)/,
  'PublishButton must dispatch unpublish through the direct owner-command bridge',
);

assert.doesNotMatch(
  publishSource,
  /proposedActionRepository\.create/,
  'PublishButton must not create a waiting proposed_action in the browser',
);

assert.match(
  untrackSource,
  /runTrackedAction\(\s*'untrack'\s*,\s*newsId\s*\)/,
  'UntrackButton should share the direct owner-command bridge semantics',
);

assert.doesNotMatch(
  source,
  /setStage\('filling'\)/,
  'FillButton must reset after success instead of staying on filling',
);

assert.doesNotMatch(
  publishSource,
  /setStage\('publishing'\)/,
  'PublishButton must reset after success instead of staying on publishing',
);
