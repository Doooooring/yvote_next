const assert = require('assert');
const { parseProposedActionListResponse } = require('./parseListResponse');

assert.deepStrictEqual(
  parseProposedActionListResponse([{ id: 28 }]),
  [{ id: 28 }],
  'returns bare array responses',
);

assert.deepStrictEqual(
  parseProposedActionListResponse({ success: true, result: [{ id: 28 }] }),
  [{ id: 28 }],
  'returns wrapped array responses',
);

assert.throws(
  () =>
    parseProposedActionListResponse({
      success: false,
      result: { message: 'Internal server error' },
    }),
  /proposed-action list failed: Internal server error/,
  'throws on server error envelopes instead of returning []',
);

assert.throws(
  () => parseProposedActionListResponse({ success: true, result: null }),
  /unexpected proposed-action list response/,
  'throws on malformed success envelopes instead of returning []',
);
