function resolveAchievementBody(hero, selectedHeroKey, achievementsByKey) {
  if (selectedHeroKey && achievementsByKey && achievementsByKey[selectedHeroKey]) {
    return achievementsByKey[selectedHeroKey];
  }

  const defaultBody = achievementsByKey && achievementsByKey.default;
  if (!defaultBody) return null;
  if (!hero) return defaultBody;
  if (hero.kind === 'bilateral') return defaultBody;
  if (hero.kind === 'multilateral' && selectedHeroKey === hero.orgName) return defaultBody;

  return null;
}

module.exports = {
  resolveAchievementBody,
};
