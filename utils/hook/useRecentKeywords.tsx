import { useCallback, useEffect, useState } from 'react';
import keywordRepository from '@repositories/keywords';
import { KeywordCategory, KeywordToView } from '@utils/interface/keywords';

export function useRecentKeywords() {
  const [keywords, setKeywords] = useState<Array<KeywordToView>>([]);

  const async = useCallback(async () => {
    const response = await keywordRepository.getKeywordsShort(0, 20, { isRecent: true });
    setKeywords(response);
  }, [setKeywords]);

  useEffect(() => {
    async();
  }, []);

  return keywords;
}
