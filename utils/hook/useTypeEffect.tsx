import { useEffect, useMemo, useState } from 'react';

export function useTypeEffect({
  text,
  duration,
  isStart = true,
  isInfinite = false,
  period,
}: {
  text: string;
  duration: number;
  isStart?: boolean;
  isInfinite?: boolean;
  period?: number;
}): {
  curInd: number;
  curText: string;
  isEnd: boolean;
} {
  const textLength = useMemo(() => {
    return text.length;
  }, []);

  const [curInd, setCurInd] = useState<number>(0);
  const [curText, setCurText] = useState<string>(' ');
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    if (isStart === false) {
      return;
    }
    setTimeout(() => {
      if (curInd <= textLength) {
        setCurText(text.slice(0, curInd));
        setCurInd(curInd + 1);
      }
    }, duration);
  }, [curInd, isStart]);

  useEffect(() => {
    if (curInd === textLength) {
      if (isInfinite && period) {
        setTimeout(() => {
          setCurInd(0);
          setCurText(' ');
        }, period);
      } else {
        setIsEnd(true);
      }
    }
  }, [curInd]);

  return {
    curInd,
    curText,
    isEnd,
  };
}
