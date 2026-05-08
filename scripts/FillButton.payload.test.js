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

assert.match(
  source,
  /export default function FillButton\(\{\s*newsId,\s*newsType\s*\}/s,
  'FillButton must accept newsType so manual fill can dispatch the type-specific pipeline',
);

assert.match(
  source,
  /payload:\s*\{\s*newsId,\s*newsType\s*\}/s,
  'FillButton must include newsType in fill_news payload',
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
