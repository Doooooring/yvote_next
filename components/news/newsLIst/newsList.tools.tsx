import { useCallback, useState } from 'react';

export const useUpdateNewsPreviews = (fetchNewsPreviews: () => Promise<void>) => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const getNewsPreviews = useCallback(async () => {
    setIsRequesting(true);
    try {
      await fetchNewsPreviews();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  }, [setIsRequesting, fetchNewsPreviews]);

  return [isRequesting, getNewsPreviews] as [boolean, () => Promise<void>];
};
