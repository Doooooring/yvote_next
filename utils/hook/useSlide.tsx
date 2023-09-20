import { useCallback, useState } from 'react';

export const useSlide = (): [number, () => void, () => void] => {
  // 현재 보이는 페이지
  const [curView, setCurView] = useState<number>(0);
  // 왼쪽 방향 이동
  const onSlideLeft = useCallback(() => {
    setCurView(curView - 1);
  }, [curView]);
  // 오른쪽 방향 이동
  const onSlideRight = useCallback(() => {
    setCurView(curView + 1);
  }, [curView]);

  return [curView, onSlideLeft, onSlideRight];
};
