import { useEffect, useState } from 'react';

import { useAnimation } from './useAnimation';

export function usePopAnimation(num: number, duration: number) {
  const curNum = useAnimation(num, duration);
  const [stateArray, setStateArray] = useState<Array<boolean>>(Array(num).fill(false));

  useEffect(() => {
    const newArray: Array<boolean> = stateArray.map((cur, idx): boolean => {
      return curNum < idx ? false : true;
    });
    console.log(newArray);
    setStateArray(newArray);
  }, [curNum]);

  return stateArray;
}
