import { useHorizontalScroll } from '@utils/hook/useHorizontalScroll';
import { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

export default function HorizontalScroll({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { scrollRef, onMouseDown, onMouseUp, onDragMove } = useHorizontalScroll();

  return (
    <Wrapper
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onDragMove}
      style={style}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  cursor: grab;
`;
