import { useCallback, useEffect, useState } from '@node_modules/@types/react';
import KeywordsRepository from '@repositories/keywords';
import { Keyword } from '@utils/interface/keywords';
interface KeyTitle extends Pick<Keyword, 'id' | 'keyword'> {}

export default function useNewsKeywordFilter() {
  const [keywordsSelected, setKeywordSelected] = useState<KeyTitle | null>(null);
  const [customKeywords, setCustomKeywords] = useState<KeyTitle[]>([]);
  const [randomKeywords, setRandomKeywords] = useState<KeyTitle[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<KeyTitle[]>([]);

  useEffect(() => {
    async function async() {
      const response: KeyTitle[] = await KeywordsRepository.getKeywordsKeyList();
      setTotalKeywords(response);
    }
    async();
  }, [setTotalKeywords]);

  const reload = useCallback(() => {
    const maxLen = totalKeywords.length;

    const arr = [] as KeyTitle[];

    for (let tmp = 0; tmp < 10; tmp++) {
      const rand = Math.floor(Math.random() * maxLen);
      arr.push(totalKeywords[rand]);
    }
    setRandomKeywords(arr);
  }, [keywordsSelected, totalKeywords, setRandomKeywords]);

  //   const getRelatedKeywords = useCallback((input : string) => {
  //     const arr = [];
  //     const inputToChars = getConstantVowel(input, true) as string[];
  //     totalKeywords.forEach((keyword) => {
  //         if (inputToChars.length == 10) return;
  //         const keyToChar = getConstantVowel(keyword.keyword, false) as string;
  //         inputToChars.
  //     })

  //   }, [totalKeywords])

  return {
    keywordsSelected,
    setKeywordSelected,
    customKeywords,
    setCustomKeywords,
    randomKeywords,
    reloadRandomKeywords: reload,
    totalKeywords,
  };
}
