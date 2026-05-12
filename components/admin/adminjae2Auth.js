const ADMINJAE2_PASSWORD = 'eder';
const ADMINJAE2_STORAGE_KEY = 'adminjae2:authenticated';

function isAdminJae2Password(value) {
  return value === ADMINJAE2_PASSWORD;
}

module.exports = {
  ADMINJAE2_STORAGE_KEY,
  isAdminJae2Password,
};
