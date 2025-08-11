// import { KeyTitle } from '@/utils/interface/keywords';
// import { ReactNode, useCallback, useMemo } from 'react';
// import { useCustomSearchParams } from '../../router/useSearchParams';
// import useNewsKeywordFilter from './useNewsKeywordFilter';

// export function KeywordFilterProvider({
//   children,
//   keywordFilter,
// }: {
//     ref :
//   children: ReactNode;
//   keywordFilter: string;
// }) {
//   const searchParams = useCustomSearchParams();
//   const { customKeywords, randomKeywords, setCustomKeywords, reloadRandomKeywords, totalKeywords } =
//     useNewsKeywordFilter();
//   const keywordSelected = totalKeywords.find((value) => value.keyword === keywordFilter) ?? null;
//   const keywordsToShow = useMemo(() => {
//     const keywordToAdd = totalKeywords.find((v) => v.keyword === keywordFilter);
//     const targetKeywords = customKeywords.length > 0 ? customKeywords : randomKeywords;
//     if (
//       !keywordFilter ||
//       !keywordToAdd ||
//       targetKeywords.map((v) => v.keyword).includes(keywordFilter ?? '')
//     ) {
//       return targetKeywords;
//     }
//     return [keywordToAdd, ...targetKeywords];
//   }, [keywordSelected, customKeywords, randomKeywords]);

//   const toggleKeywordFilter = useCallback(async (keyword: KeyTitle) => {
//     if (keyword.keyword === keywordFilter) {
//       searchParams.remove('keyword');
//     } else {
//       searchParams.set('keyword', keyword.keyword);
//     }
//     // setTimeout(() => {
//     //   if (ref.current)
//     //     window.scrollTo({ left: 0, top: ref.current!.offsetTop - 160, behavior: 'smooth' });
//     // }, 100);
//   }, []);
// }
