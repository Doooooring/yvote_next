import { useCallback, useMemo, useState } from 'react';
import { KeyTitle } from '../../../utils/interface/keywords';
import { formatWord, searchWordIncluded } from '../../../utils/tools/korean';

export default function useSearchKeyword(totalKeywords: KeyTitle[]) {
  const [searchWord, setSearchWord] = useState<string>('');
  const [relatedKeywords, setRelatedWords] = useState<KeyTitle[]>([]);

  const totalsFormatted = useMemo(() => {
    const wordMap = {} as { [key: string]: KeyTitle };
    const keywordFormatted = totalKeywords.map((keyword) => {
      wordMap[keyword.keyword] = keyword;
      return formatWord(keyword.keyword);
    });

    return {
      wordMap,
      keywordFormatted,
    };
  }, [totalKeywords]);

  const handleSearchBoxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const { keywordFormatted, wordMap } = totalsFormatted;
      const v = e.currentTarget.value;
      setSearchWord(v);

      const findRelatedWords: KeyTitle[] = searchWordIncluded(
        v,
        keywordFormatted,
        keywordFormatted.length,
        true,
      ).map((str) => {
        return wordMap[str];
      });

      if (findRelatedWords.length === 0) {
        setRelatedWords([]);
      } else {
        setRelatedWords(findRelatedWords);
      }
    },
    [totalsFormatted, totalKeywords],
  );

  return {
    searchWord,
    relatedKeywords,
    handleSearchBoxChange,
  };
}
