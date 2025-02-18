export const getRandomNumber = (length: number) => {
  return Math.floor(Math.random() * 10 ** length);
};

export const getRandomNumString = (length: number) => {
  return String(getRandomNumber(length)).padStart(length, '0');
};
