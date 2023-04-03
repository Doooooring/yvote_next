import styled from 'styled-components';

interface SpeechBubbleProps {
  width: number;
  height: number;
  top: number;
  left: number;
  comp: JSX.Element;
}

export function SpeechBubble({ width, height, top, left, comp }: SpeechBubbleProps) {
  return (
    <Bubble width={`${width}px`} height={`${height}px`} top={`${top}px`} left={`${left}px`}>
      {comp}
    </Bubble>
  );
}

interface BubbleProps {
  width: string;
  height: string;
  top: string;
  left: string;
}

const Bubble = styled.div<BubbleProps>`
  position: relative;
  background: white;
  margin-left: auto;
  margin-right: auto;
  padding-top: 8px;
  font-weight: 600;
  border-radius: 5px;
  font-size: 13px;
  &::before {
    content: '';
    display: block;
    width: 2px;
    height: 2px;
    border-bottom: 7px solid white;
    border-top: 7px solid rgba(0, 0, 0, 0);
    border-left: 7px solid rgba(0, 0, 0, 0);
    border-right: 7px solid rgba(0, 0, 0, 0);
    position: absolute;
    top: -15px;
    left: 93px;
  }
`;
