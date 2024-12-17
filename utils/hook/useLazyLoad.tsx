import { useCallback, useEffect, useRef, useState } from 'react';

export default function useLazyLoad(trigger: boolean, lazy: number) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const lazyTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trigger) {
      const timeout = setTimeout(() => {
        setIsShow(true);
      }, lazy);
      lazyTimeout.current = timeout;
    } else {
      if (lazyTimeout.current) {
        clearTimeout(lazyTimeout.current);
        lazyTimeout.current = null;
      }
    }
  }, [trigger]);

  const close = useCallback(() => {
    setIsShow(false);
  }, [setIsShow]);

  return {
    isShow,
    close,
  };
}
