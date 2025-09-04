import { useCallback, useRef } from 'react';
import styled from 'styled-components';

export type Axis = 'x' | 'y';
export type Direction = 'left' | 'right' | 'up' | 'down';

export type Options = {
  threshold?: number;
  axis: Axis;
  onStart?: (e: React.PointerEvent) => void;
  onEnd?: (dir: Direction | null, dx: number, dy: number) => void;
};

export function useSwipe(opts: Options = { axis: 'x' }) {
  const { threshold = 16, axis = 'x', onStart, onEnd } = opts;

  const idRef = useRef<number | null>(null);

  const isSwiping = useRef(false);

  const startX = useRef<number | null>(0);
  const startY = useRef<number | null>(0);

  const lastX = useRef<number | null>(0);
  const lastY = useRef<number | null>(0);

  const passed = (dx: number, dy: number) => {
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (axis === 'x') return adx >= threshold;
    if (axis === 'y') return ady >= threshold;
    return Math.max(adx, ady) >= threshold;
  };

  const dir = (dx: number, dy: number): Direction | null => {
    if (axis === 'x') return dx < 0 ? 'right' : 'left';
    if (axis === 'y') return dy < 0 ? 'down' : 'up';
    return null;
  };

  const initialize = () => {
    idRef.current = null;
    isSwiping.current = false;
    startX.current = null;
    startY.current = null;
    lastX.current = null;
    lastY.current = null;
  };

  const onPointerDown: React.PointerEventHandler = (e) => {
    if (!e.isPrimary) return;

    // @fix pc에서 스와이프 로직 추가 필요 ( 스와이프와 드래그 액션 구분 불가)
    if (e.pointerType === 'mouse') return;

    isSwiping.current = true;
    idRef.current = e.pointerId;
    startX.current = e.clientX;
    startY.current = e.clientY;

    onStart?.(e);
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove: React.PointerEventHandler = (e) => {
    if (idRef.current !== e.pointerId || !isSwiping.current) return;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const finish = useCallback(
    (e: React.PointerEvent) => {
      if (
        idRef.current !== e.pointerId ||
        startX.current === null ||
        startY.current === null ||
        !isSwiping.current
      )
        return;

      const dx = (lastX.current ?? e.clientX) - startX.current;
      const dy = (lastY.current ?? e.clientY) - startY.current;
      const d = passed(dx, dy) ? dir(dx, dy) : null;

      isSwiping.current = false;
      onEnd?.(d, dx, dy);
      initialize();
      idRef.current = null;
    },
    [onEnd],
  );

  return {
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
  } as const;
}

type RowSwipeCaptureProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  threshold?: number;
  onLeftSwipe: () => void;
  onRightSwipe: () => void;
};

export function RowSwipeCature({
  children,
  threshold = 10,
  onLeftSwipe,
  onRightSwipe,
  ...others
}: RowSwipeCaptureProps) {
  const { bind } = useSwipe({
    axis: 'x',
    threshold,
    onEnd: (dir) => {
      if (dir === 'left') onLeftSwipe();
      if (dir === 'right') onRightSwipe();
    },
  });

  return (
    <SwipeWrapper {...others} {...bind}>
      {children}
    </SwipeWrapper>
  );
}

const SwipeWrapper = styled.div`
  min-height: 100%;

  touch-action: pan-y;
  &:hover {
    cursor: grab;
  }
`;
