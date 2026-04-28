const assert = require('assert');
const { isAdminJae2Password } = require('./adminjae2Auth');

assert.strictEqual(isAdminJae2Password('eder'), true);
assert.strictEqual(isAdminJae2Password('Eder'), false);
assert.strictEqual(isAdminJae2Password(' eder '), false);
assert.strictEqual(isAdminJae2Password(''), false);
