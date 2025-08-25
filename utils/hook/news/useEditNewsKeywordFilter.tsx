import EditKeywordFiltersTopSheet from '@components/news/editKeywordFiltersTopSheet';
import { KeyTitle } from '@utils/interface/keywords';
import { useCallback } from 'react';
import { useModal } from '../useModal';

export default function useEditNewsKeywordFilters() {
  const { show, close } = useModal();

  const showEditNewsKeywordTopSheet = useCallback(
    ({
      keywordsToEdit,
      randomKeywords,
      totalKeywords,
      saveKeywordFilteres,
    }: {
      keywordsToEdit: KeyTitle[];
      randomKeywords: KeyTitle[];
      totalKeywords: KeyTitle[];
      saveKeywordFilteres: (keywords: KeyTitle[]) => void;
    }) => {
      show(
        <EditKeywordFiltersTopSheet
          close={close}
          keywordsToEdit={keywordsToEdit}
          randomKeywords={randomKeywords}
          totalKeywords={totalKeywords}
          saveKeywordFilteres={saveKeywordFilteres}
        />,
      );
    },
    [show, close],
  );
  return {
    showEditNewsKeywordTopSheet,
    close,
  };
}
