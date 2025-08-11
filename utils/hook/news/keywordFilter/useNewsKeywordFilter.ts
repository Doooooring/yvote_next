import KeywordsRepository from '@repositories/keywords';
import { KeyTitle } from '@utils/interface/keywords';
import { getRenderingEnvironment } from '@utils/tools';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const CUSTOM_KEYWORDS_KEY = 'CUSTOM_KEYWORDS';

export default function useNewsKeywordFilter() {
  const router = useRouter();

  const [customKeywords, setCustomKeywords] = useState<KeyTitle[]>([]);
  const [randomKeywords, setRandomKeywords] = useState<KeyTitle[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<KeyTitle[]>([]);

  const reload = useCallback(() => {
    const arr = selectRandomItems(totalKeywords, 20);
    setCustomKeywords([]);
    setRandomKeywords(arr);
  }, [totalKeywords, selectRandomItems, setRandomKeywords]);

  useEffect(() => {
    async function async() {
      const response: KeyTitle[] = await KeywordsRepository.getKeywordsKeyList();
      setTotalKeywords(response);
      setRandomKeywords(selectRandomItems(response, 10));
    }
    async();
  }, [selectRandomItems, setRandomKeywords, setTotalKeywords]);

  useEffect(() => {
    if (getRenderingEnvironment() === 'server') return;

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
    const keywords = window.localStorage.getItem(CUSTOM_KEYWORDS_KEY);
    if (keywords) {
      setCustomKeywords(JSON.parse(keywords));
    }
  }, [setCustomKeywords]);

  return {
    customKeywords,
    setCustomKeywords,
    randomKeywords,
    reloadRandomKeywords: reload,
    totalKeywords,
  };
}

function selectRandomItems<T>(items: Array<T>, length: number) {
  const arr = [] as T[];
  const mem = new Set();

  const maxLen = Math.min(items.length, length);
  for (let tmp = 0; tmp < maxLen; tmp++) {
    const rand = Math.floor(Math.random() * items.length);
    const target = items[rand];
    if (!mem.has(target)) {
      arr.push(target);
      mem.add(target);
    }
  }

  return arr;
}
