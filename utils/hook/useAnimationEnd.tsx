import { useEffect, useState } from 'react';

export function useAnimationEnd(state: boolean, duration?: number) {
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (state) {
      setTimeout(() => {
        setIsEnd(true);
      }, duration ?? 400);
    }
  }, [state]);

  return isEnd;
}
