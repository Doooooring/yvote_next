import { useCallback, useRef, useState } from 'react';

export type Axis = 'x' | 'y' | 'both';
export type Direction = 'left' | 'right' | 'up' | 'down' | null;

export type Options = {
  threshold?: number;
  axis?: Axis;
  onStart?: (e: React.PointerEvent) => void;
  onEnd?: (dir: Direction, dx: number, dy: number) => void;
};

export function useSwipe(opts: Options = {}) {
  const { threshold = 16, axis = 'both', onStart, onEnd } = opts;

  const idRef = useRef<number | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  const lastX = useRef(0);
  const lastY = useRef(0);

  const [state, setState] = useState({
    isSwiping: false,
    dx: 0,
    dy: 0,
    direction: null as Direction,
  });

  const passed = (dx: number, dy: number) => {
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (axis === 'x') return adx >= threshold;
    if (axis === 'y') return ady >= threshold;
    return Math.max(adx, ady) >= threshold;
  };

  const dir = (dx: number, dy: number): Direction => {
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (axis === 'x') return dx < 0 ? 'left' : 'right';
    if (axis === 'y') return dy < 0 ? 'up' : 'down';
    return adx >= ady ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
  };
  const onPointerMove: React.PointerEventHandler = (e) => {
    if (idRef.current !== e.pointerId) return;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };
  const onPointerDown: React.PointerEventHandler = (e) => {
    if (!e.isPrimary) return;
    idRef.current = e.pointerId;
    startX.current = e.clientX;
    startY.current = e.clientY;

    setState({ isSwiping: true, dx: 0, dy: 0, direction: null });
    onStart?.(e);
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const finish = useCallback(
    (e: React.PointerEvent) => {
      if (idRef.current !== e.pointerId) return;

      const dx = (lastX.current ?? e.clientX) - startX.current;
      const dy = (lastY.current ?? e.clientY) - startY.current;
      const d = passed(dx, dy) ? dir(dx, dy) : null;
      setState({ isSwiping: false, dx, dy, direction: d });
      onEnd?.(d, dx, dy);
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
    state,
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
    <div {...others} {...bind}>
      {children}
    </div>
  );
}
