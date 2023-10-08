import { RefObject, useEffect, useRef, useState } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement>) {
  // 화면이 노출되었음이 감지될 대상
  const observerRef = useRef<IntersectionObserver | null>(null);
  // 대상이 화면 감지될 시 해당 state 를 변경
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      // 화면 노출 상태를 state로 저장
      setIsOnScreen(entry.isIntersecting),
    );
  }, [ref]);

  useEffect(() => {
    if (observerRef.current === null || ref.current === null) {
      return;
    }
    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current === null) {
        return;
      }
      // unmount시 옵저버 제거
      observerRef.current.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
