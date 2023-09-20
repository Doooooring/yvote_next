import { useEffect, useMemo, useState } from 'react';

export function useTypeEffect(
  text: string,
  duration: number,
  state: boolean,
): [number, string, boolean] {
  const textLength = useMemo(() => {
    return text.length;
  }, []);

  const [curInd, setCurInd] = useState<number>(0);
  const [curText, setCurText] = useState<string>('');
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    if (state === false) {
      return;
    }

    setTimeout(() => {
      if (curInd <= textLength) {
        setCurText(text.slice(0, curInd));
        setCurInd(curInd + 1);
      }
    }, duration);
  }, [curInd, state]);

  useEffect(() => {
    if (curInd === textLength) {
      setIsEnd(true);
    }
  }, [curInd]);

  return [curInd, curText, isEnd];
}
