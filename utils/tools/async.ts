export const fetchImg = async (src: string) => {
  const response = await fetch(src);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
