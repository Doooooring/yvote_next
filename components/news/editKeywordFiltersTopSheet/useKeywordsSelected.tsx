import { useCallback, useEffect, useState } from 'react';
import { KeyTitle } from '../../../utils/interface/keywords';

export default function useKeywordsSelected(keywordsSelected: KeyTitle[]) {
  const [curKeywords, setCurKeywords] = useState<KeyTitle[]>([]);

  const addKeyword = useCallback(
    (keyword: KeyTitle) => {
      setCurKeywords([...curKeywords, keyword]);
    },
    [curKeywords, setCurKeywords],
  );

  const dropKeyword = useCallback(
    (keyword: KeyTitle) => {
      setCurKeywords(curKeywords.filter((c) => c.id !== keyword.id));
    },
    [curKeywords, setCurKeywords],
  );

  useEffect(() => {
    setCurKeywords(keywordsSelected);
  }, [keywordsSelected, setCurKeywords]);

  return {
    curKeywords,
    addKeyword,
    dropKeyword,
  };
}
