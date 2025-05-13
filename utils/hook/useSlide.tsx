import { useCallback, useState } from 'react';

/**
 * 슬라이드 페이지 넘버링 훅
 * @returns [curView : 현재페이지, onSlideLeft : 왼쪽 이동, onslideRight : 오른쪽이동]
 */
export const useSlide = (): [number, () => void, () => void, React.Dispatch<React.SetStateAction<number>>] => {
  const [curView, setCurView] = useState<number>(0);

  const onSlideLeft = useCallback(() => {
    setCurView(curView - 1);
  }, [curView]);

  const onSlideRight = useCallback(() => {
    setCurView(curView + 1);
  }, [curView]);

  return [curView, onSlideLeft, onSlideRight, setCurView];
};
