import { useCallback, useEffect, useMemo, useState } from 'react';
import KeywordsRepository from '@repositories/keywords';
import { KeyTitle, Keyword } from '@utils/interface/keywords';

export default function useNewsKeywordFilter() {
  const [keywordSelected, setKeywordSelected] = useState<KeyTitle | null>(null);
  const [customKeywords, setCustomKeywords] = useState<KeyTitle[]>([]);
  const [randomKeywords, setRandomKeywords] = useState<KeyTitle[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<KeyTitle[]>([]);

  const keywordsToShow = useMemo(() => {
    console.log('is rendered');
    const addSelectedToArr = (arr: KeyTitle[]) => {
      if (keywordSelected && arr.filter((v) => v.id === keywordSelected.id).length == 0) {
        arr.unshift(keywordSelected);
      }
      return arr;
    };

    if (customKeywords.length > 0) {
      return addSelectedToArr(customKeywords);
    } else {
      return addSelectedToArr(randomKeywords);
    }
  }, [keywordSelected, customKeywords, randomKeywords]);

  const getRandomKeywords = useCallback((keywords: KeyTitle[], length: number) => {
    const arr = [] as KeyTitle[];
    const maxLen = Math.min(keywords.length, length);
    for (let tmp = 0; tmp < maxLen; tmp++) {
      const rand = Math.floor(Math.random() * keywords.length);
      arr.push(keywords[rand]);
    }
    console.log('===============');
    console.log(arr);
    return arr;
  }, []);

  useEffect(() => {
    async function async() {
      const response: KeyTitle[] = await KeywordsRepository.getKeywordsKeyList();
      setTotalKeywords(response);
      setRandomKeywords(getRandomKeywords(response, 10));
    }
    async();
  }, [getRandomKeywords, setRandomKeywords, setTotalKeywords]);

  const reload = useCallback(() => {
    const maxLen = totalKeywords.length;

    const arr = [] as KeyTitle[];

    for (let tmp = 0; tmp < 10; tmp++) {
      const rand = Math.floor(Math.random() * maxLen);
      arr.push(totalKeywords[rand]);
    }
    setRandomKeywords(arr);
  }, [keywordSelected, totalKeywords, setRandomKeywords]);

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
    keywordsToShow,
    keywordSelected,
    setKeywordSelected,
    customKeywords,
    setCustomKeywords,
    randomKeywords,
    reloadRandomKeywords: reload,
    totalKeywords,
  };
}
