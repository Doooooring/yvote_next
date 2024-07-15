import { MouseEvent, useRef, useState } from 'react';

export const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDrag(true);
    setStart(event.pageX + scrollRef.current!.scrollLeft);
  };

  const onMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    setIsDrag(false);
  };

  const onDragMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isDrag) {
      scrollRef.current!.scrollLeft = start - event.pageX;
    }
  };

  return {
    scrollRef,
    onMouseDown,
    onMouseUp,
    onDragMove,
  };
};
