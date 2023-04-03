import { useEffect, useState } from 'react';

import { useAnimation } from './useAnimation';

export function useNumberIncreasing(num: number): number {
  const curNum = useAnimation(num, 40);

  return curNum;
}
