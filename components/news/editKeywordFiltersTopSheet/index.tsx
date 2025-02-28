import { CommonLayoutBox, CommonTagBox, Row } from '@components/common/commonStyles';
import Modal from '@components/common/modal';
import { KeyTitle } from '@utils/interface/keywords';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getConstantVowel } from '../../../utils/tools';
import HorizontalScroll from '../../common/horizontalScroll/horizontalScroll';

interface EditKeywordFiltersTopSheetProps {
  state: boolean;
  close: () => void;
  keywordsToEdit: KeyTitle[];
  totalKeywords: KeyTitle[];
  saveKeywordFilteres: (keywords: KeyTitle[]) => void;
}

const isCharIncluded = (target: string, cur: string) => {
  const curToChar = getConstantVowel(cur, false) as string;
  const targetTochar = getConstantVowel(target, true) as string[];
  let result = false;
  targetTochar.forEach((char) => {
    if (curToChar.includes(char)) {
      result = true;
    }
  });
  return result;
};

export default function EditKeywordFiltersTopSheet({
  state,
  close,
  keywordsToEdit,
  totalKeywords,
  saveKeywordFilteres,
}: EditKeywordFiltersTopSheetProps) {
  const [isTopSheetDown, setIsTopSheetDown] = useState(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [curKeywords, setCurKeywords] = useState<KeyTitle[]>([]);
  const [relatedKeywords, setRelatedWords] = useState<KeyTitle[]>([]);

  useEffect(() => {
    if (state) {
      setIsTopSheetDown(true);
      setCurKeywords(keywordsToEdit);
    } else {
    }
  }, [state, keywordsToEdit]);

  const closeTopSheet = useCallback(() => {
    setIsTopSheetDown(false);
    setTimeout(() => {
      close();
    }, 100);
  }, []);

  const addKeyword = useCallback(
    (keyword: KeyTitle) => {
      setCurKeywords([...curKeywords, keyword]);
      setRelatedWords([...relatedKeywords.filter((r) => r.id !== keyword.id)]);
    },
    [curKeywords, relatedKeywords, setCurKeywords],
  );

  const dropKeyword = useCallback(
    (keyword: KeyTitle) => {
      setCurKeywords(curKeywords.filter((c) => c.id !== keyword.id));
      if (isCharIncluded(searchWord, keyword.keyword)) {
        setRelatedWords([...relatedKeywords, keyword].sort((a, b) => a.id - b.id));
      }
    },
    [curKeywords, setCurKeywords, setRelatedWords],
  );

  const handleSearchBoxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const v = e.currentTarget.value;
      setSearchWord(v);
      const findRelatedWords: KeyTitle[] = [];

      for (const key of totalKeywords) {
        if (
          isCharIncluded(v, key.keyword) &&
          curKeywords.filter((c) => c.id === key.id).length === 0
        ) {
          findRelatedWords.push(key);
        }

        if (findRelatedWords.length === 10) {
          break;
        }
      }
      if (findRelatedWords.length === 0) {
        setRelatedWords([]);
      } else {
        setRelatedWords(findRelatedWords);
      }
    },
    [totalKeywords],
  );

  return (
    <Modal state={state} backgroundColor="rgba(0,0,0,0)" outClickAction={closeTopSheet}>
      <TopSheet $isOpen={isTopSheetDown}>
        <Title>관심있는 키워드를 클릭해주세요!</Title>
        <SubTitle>키워드를 기반으로 뉴스를 골라볼 수 있어요!</SubTitle>
        <TopSheetHead>
          <SearchWrapper>
            <InputWrapper>
              <SearchInput
                type="text"
                placeholder="키워드로 검색"
                value={searchWord}
                onChange={(e) => {
                  handleSearchBoxChange(e);
                }}
              />
            </InputWrapper>
          </SearchWrapper>
          <KeywordWrapper>
            <KeywordScrollWrapper>
              {curKeywords.map((keyword, index) => {
                return (
                  <Keyword
                    key={keyword.id}
                    $state={true}
                    onClick={() => {
                      dropKeyword(keyword);
                    }}
                  >
                    {keyword.keyword}
                  </Keyword>
                );
              })}
            </KeywordScrollWrapper>
          </KeywordWrapper>
        </TopSheetHead>
        <TopSheetBody>
          <TopSheetKeywordWrapper>
            {relatedKeywords.map((keyword, index) => {
              return (
                <Keyword
                  key={keyword.id}
                  $state={false}
                  onClick={() => {
                    addKeyword(keyword);
                  }}
                >
                  {keyword.keyword}
                </Keyword>
              );
            })}
          </TopSheetKeywordWrapper>
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

    padding: 0.6rem;

    background-color: white;

    transition: top 0.2s ease-in-out;
  }
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.gray800};
  font-weight: 700;
  font-size: 1.1rem;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: 700;
  font-size: 0.9rem;
`;

const TopSheetHead = styled(Row)`
  padding: 6px;
`;

const SearchWrapper = styled.div``;

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  &:focus-within {
    overflow: visible;
  }
`;

const SearchInput = styled.input`
  background-color: transparent;
  display: inline-flex;
  border: 0;
  border-radius: 9px;
  width: 100%;
  height: 100%;
  color: rgb(170, 170, 170);
  font-weight: 400;
  padding: 0;
  margin: 0;
  font: inherit;
  font-size: 12px;
  text-align: center;
  &::placeholder {
    color: rgb(170, 170, 170);
    font-size: 12px;
    font-weight: 400;
  }
  &:focus {
    outline: 0px solid rgb(133, 200, 224);
    font-size: 12px;
    font-weight: 400;
  }
`;

const KeywordScrollWrapper = styled(Row)`
  flex: 0 1 auto;
`;

const KeywordWrapper = styled(HorizontalScroll)`
  flex: 0 1 auto;
  width: 100%;
  padding: 0 10px;
`;

const TopSheetBody = styled.div``;

const TopSheetKeywordWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

const TopSheetFotter = styled(Row)``;
interface KeywordProps {
  $state: boolean;
}

const Keyword = styled(CommonTagBox)<KeywordProps>`
  flex: 1 0 auto;

  margin-left: 3px;
  margin-right: 6px;
  color: ${({ $state, theme }) => ($state ? theme.colors.yvote02 : 'rgb(120, 120, 120)')};
  background-color: ${({ $state }) => ($state ? 'white !important' : '#f1f2f5')};
  border: 1px solid #f1f2f5;
  border-color: ${({ $state, theme }) =>
    $state ? theme.colors.yvote01 + ' !important' : '#f1f2f5'};
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;
