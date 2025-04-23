import KeywordsRepository from '@repositories/keywords';
import { KeyTitle } from '@utils/interface/keywords';
import { getRenderingEnvironment } from '@utils/tools';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from '../useRouter';

const CUSTOM_KEYWORDS_KEY = 'CUSTOM_KEYWORDS';

export default function useNewsKeywordFilter() {
  const { router } = useRouter();

  const [keywordSelected, setKeywordSelected] = useState<KeyTitle | null>(null);
  const [customKeywords, setCustomKeywords] = useState<KeyTitle[]>([]);
  const [randomKeywords, setRandomKeywords] = useState<KeyTitle[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<KeyTitle[]>([]);

  const keywordsToShow = useMemo(() => {
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
    const mem = new Set();

    const maxLen = Math.min(keywords.length, length);
    for (let tmp = 0; tmp < maxLen; tmp++) {
      const rand = Math.floor(Math.random() * keywords.length);
      const target = keywords[rand];
      if (!mem.has(target)) {
        arr.push(target);
        mem.add(target);
      }
    }

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

  useEffect(() => {
    if (getRenderingEnvironment() === 'server') return;

    console.log('================');
    console.log(localStorage);
    console.log(window);

    const saveCustomKeywords = () => {
      if (customKeywords.length > 0) {
        window.localStorage.setItem(CUSTOM_KEYWORDS_KEY, JSON.stringify(customKeywords));
      } else {
        window.localStorage.removeItem(CUSTOM_KEYWORDS_KEY);
      }
    };

    router.events.on('routeChangeStart', saveCustomKeywords);

    return () => {
      router.events.off('routeChangeStart', saveCustomKeywords);
    };
  }, [customKeywords, setCustomKeywords]);

  useEffect(() => {
    const getCustomKeywords = () => {
      const keywords = window.localStorage.getItem(CUSTOM_KEYWORDS_KEY);
      if (keywords) {
        setCustomKeywords(JSON.parse(keywords));
      }
    };

    getCustomKeywords();
  }, [setCustomKeywords]);

  const reload = useCallback(() => {
    const arr = getRandomKeywords(totalKeywords, 20);
    setKeywordSelected(null);
    setCustomKeywords([]);
    setRandomKeywords(arr);
  }, [keywordSelected, totalKeywords, getRandomKeywords, setRandomKeywords]);

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
