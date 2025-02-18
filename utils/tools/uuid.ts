export const getLongUUID = () => {
  return crypto.randomUUID();
};

export const getShortUUID = (length: number) => {
  const randomNumber = Math.floor(Math.random() * 10 ** length);
  return String(randomNumber).padStart(length, '0');
};
