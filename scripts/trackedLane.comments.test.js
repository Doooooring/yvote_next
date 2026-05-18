const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'components', 'admin', 'trackedLane', 'index.tsx'),
  'utf8',
);

assert.match(
  source,
  /import CommentTypeIcon from ['"]@components\/common\/CommentTypeIcon['"]/,
  'TrackedLane should render comment type icons directly in each tracked row',
);

assert.match(
  source,
  /useCommentModal_Preview/,
  'TrackedLane should reuse the existing preview comment modal from adminjae/news lists',
);

assert.match(
  source,
  /item\.comments[\s\S]*\.map\(\(ct/,
  'TrackedLane should map preview comment types into clickable icons',
);

assert.match(
  source,
  /showCommentModal\(\s*item\.id,\s*item\.comments as commentType\[\]/,
  'TrackedLane icon click should open comments for the tracked news row',
);

assert.match(
  source,
  /<IdTag\s+href=\{`\/adminjae\/\$\{item\.id\}`\}/,
  'TrackedLane news id link should open the admin detail view',
);

assert.doesNotMatch(
  source,
  /<IdTag\s+href=\{`\/news\/\$\{item\.id\}`\}/,
  'TrackedLane news id link should not open the public news detail view',
);
