const assert = require('assert');

const { resolveAchievementBody } = require('../components/news/types/diplomatCore');

const bilateralHero = {
  kind: 'bilateral',
  countries: [{ code: 'UZB', nameKo: '우즈베키스탄', nameEn: 'Uzbekistan' }],
};

assert.strictEqual(
  resolveAchievementBody(bilateralHero, 'UZB', { default: '성과 본문' }),
  '성과 본문',
  'bilateral diplomat achievements should use the default pipeline key for the selected country',
);

const multilateralHero = {
  kind: 'multilateral',
  orgName: 'G20',
  countries: [{ code: 'USA', nameKo: '미국', nameEn: 'United States' }],
};

assert.strictEqual(
  resolveAchievementBody(multilateralHero, 'G20', { default: '포럼 성과' }),
  '포럼 성과',
  'multilateral org selection should use the default pipeline key',
);

assert.strictEqual(
  resolveAchievementBody(multilateralHero, 'USA', { default: '포럼 성과' }),
  null,
  'side-bilateral selection should not show generic forum achievements when no side key exists',
);

assert.strictEqual(
  resolveAchievementBody(multilateralHero, 'USA', { default: '포럼 성과', USA: '미국 성과' }),
  '미국 성과',
  'side-bilateral selection should prefer its direct achievement key',
);
