import styled from 'styled-components';

interface SpeechBubbleProps {
  width: number;
  height: number;
}

export function SpeechBubble() {
  return <Bubble>{'간편하게 해시태그로 검색해보세요.'}</Bubble>;
}

interface BrickBarProps {
  num: number;
}

export function BrickBar({ num }: BrickBarProps) {
  const iterationBlock = new Array(num).fill(0);
  return (
    <Bar
      style={{
        gridTemplateRows: `repeat(${num}, 1fr))`,
      }}
    >
      {iterationBlock.map(() => {
        return <Brick key={iterationBlock.indexOf(num)} className="brick"></Brick>;
      })}
    </Bar>
  );
}

const Bubble = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  background: linear-gradient(90deg, rgb(115, 180, 242), rgb(14, 123, 252));
  color: white;
  font-weight: 600;
  border-radius: 5px;
  font-size: 13px;
  &::before {
    content: '';
    display: block;
    width: 2px;
    height: 2px;
    border-bottom: 7px solid rgb(61, 152, 247);
    border-top: 7px solid rgba(0, 0, 0, 0);
    border-left: 7px solid rgba(0, 0, 0, 0);
    border-right: 7px solid rgba(0, 0, 0, 0);
    position: absolute;
    top: -15px;
    left: 50%;
  }
`;

const Bar = styled.div`
  display: grid;
  align-items: center;
  width: 4px;
  background-color: rgb(221, 227, 235);
  margin-right: 20px;
`;

const Brick = styled.div`
  height: 3px;
  width: 16px;
  background-color: rgb(121, 159, 196);
  position: relative;
  left: -6px;
`;
