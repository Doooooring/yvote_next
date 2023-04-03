import { useEffect, useState } from 'react';

export function useAnimation(num: number, duration: number): number {
  const [curNum, setCurNum] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      if (curNum < num) {
        setCurNum(curNum + 1);
      }
    }, duration);
  }, [curNum]);

  return curNum;
}
