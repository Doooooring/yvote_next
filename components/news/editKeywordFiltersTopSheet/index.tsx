import { CommonLayoutBox, Row } from '@components/common/commonStyles';
import Modal from '@components/common/modal';
import { KeyTitle } from '@utils/interface/keywords';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface EditKeywordFiltersTopSheetProps {
  state: boolean;
  close: () => void;
  keywordsToEdit: KeyTitle[];
  totalKeywords: KeyTitle[];
  saveKeywordFilteres: (keywords: KeyTitle[]) => void;
}

export default function EditKeywordFiltersTopSheet({
  state,
  close,
  keywordsToEdit,
  totalKeywords,
  saveKeywordFilteres,
}: EditKeywordFiltersTopSheetProps) {
  const [isTopSheetDown, setIsTopSheetDown] = useState(false);
  const [curKeywords, setCurKeywords] = useState<KeyTitle[]>([]);

  useEffect(() => {
    if (state) {
      setIsTopSheetDown(true);
    }
  }, [state, keywordsToEdit]);

  const closeTopSheet = useCallback(() => {
    setIsTopSheetDown(false);
    setTimeout(() => {
      close();
    }, 100);
  }, []);

  return (
    <Modal state={state} backgroundColor="rgba(0,0,0,0)" outClickAction={closeTopSheet}>
      <TopSheet $isOpen={isTopSheetDown}>
        <TopSheetHead>
          <SearchWrapper></SearchWrapper>
          <TopSheetHeadKeywords></TopSheetHeadKeywords>
        </TopSheetHead>
        <TopSheetBody>
          <TopSheetKeywordWrapper></TopSheetKeywordWrapper>
        </TopSheetBody>
      </TopSheet>
    </Modal>
  );
}

interface TopSheetProps {
  $isOpen: boolean;
}

const TopSheet = styled(CommonLayoutBox)<TopSheetProps>`
  @media screen and (max-width: 768px) {
    position: absolute;
    top: ${({ $isOpen }) => ($isOpen ? '0px' : '-500px')};
    left: 0;
    width: 100%;
    height: 500px;
    background-color: white;

    transition: top 0.2s ease-in-out;
  }
`;

const TopSheetHead = styled(Row)`
  padding: 6px;
`;

const SearchWrapper = styled.div``;

const TopSheetHeadKeywords = styled.div``;

const TopSheetBody = styled.div``;

const TopSheetKeywordWrapper = styled.div``;
