export const getLongUUID = () => {
  return crypto.randomUUID();
};

export const getShortUUID = (length: number) => {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  return uuid.substring(0, length);
};
