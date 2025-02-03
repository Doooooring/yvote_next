export const fetchImg = async (src: string) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    throw e;
  }
};
