import { useCallback, useEffect, useState } from 'react';

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

export const useNewsInfiniteScroll = (
  isOnScreen: boolean,
  fetch: () => Promise<void>,
  state: boolean = true,
) => {
  const [trigger, setTrigger] = useState<boolean>(false);

  useEffect(() => {
    setTrigger(isOnScreen);
  }, [isOnScreen]);

  useEffect(() => {
    if (trigger && state) {
      fetch();
      setTrigger(false);
    }
  }, [trigger, fetch]);

  return trigger;
};
