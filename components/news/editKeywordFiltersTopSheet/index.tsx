import closeImage from '@assets/img/ico_close@2x.png';
import {
  CommonIconButton,
  CommonLayoutBox,
  CommonTagBox,
  Row,
} from '@components/common/commonStyles';
import HorizontalScroll from '@components/common/horizontalScroll/horizontalScroll';
import { CommonModalLayout } from '@components/common/modal/component';
import { KeyTitle } from '@utils/interface/keywords';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import IsShow from '../../common/isShow';
import useKeywordsSelected from './useKeywordsSelected';
import useSearchKeyword from './useSearchKeyword.';

interface EditKeywordFiltersTopSheetProps {
  close: () => void;
  keywordsToEdit: KeyTitle[];
  randomKeywords: KeyTitle[];
  totalKeywords: KeyTitle[];
  saveKeywordFilteres: (keywords: KeyTitle[]) => void;
}

export default function EditKeywordFiltersTopSheet({
  close,
  keywordsToEdit,
  randomKeywords,
  totalKeywords,
  saveKeywordFilteres,
}: EditKeywordFiltersTopSheetProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isTopSheetDown, setIsTopSheetDown] = useState(false);
  const { searchWord, relatedKeywords, handleSearchBoxChange } = useSearchKeyword(totalKeywords);
  const { curKeywords, addKeyword, dropKeyword } = useKeywordsSelected(keywordsToEdit);

  const closeTopSheet = useCallback(() => {
    setIsTopSheetDown(false);
    setTimeout(() => {
      close();
    }, 200);
  }, [setIsTopSheetDown, close]);

  const saveKeywords = useCallback(() => {
    saveKeywordFilteres(curKeywords);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1000);
  }, [curKeywords]);

  const excludeSelectedKeywords = useCallback(
    (keywords: KeyTitle[]) => {
      return keywords.filter((keyword) => {
        return curKeywords.filter((c) => c.id === keyword.id).length === 0;
      });
    },
    [curKeywords],
  );

  useEffect(() => {
    setIsTopSheetDown(true);
  }, [setIsTopSheetDown]);

  return (
    <CommonModalLayout onOutClick={closeTopSheet}>
      <TopSheet $isOpen={isTopSheetDown}>
        <Title>관심있는 키워드를 클릭해주세요.</Title>
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
        </TopSheetHead>
        <TopSheetBody>
          <KeywordSelectedWrapper>
            <HorizontalScroll
              style={{
                width: '100%',
              }}
            >
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
            </HorizontalScroll>
          </KeywordSelectedWrapper>
          <TopSheetKeywordWrapper>
            {excludeSelectedKeywords(searchWord != '' ? relatedKeywords : totalKeywords).map(
              (keyword, index) => {
                return (
                  <Keyword
                    key={keyword.id + `${index}`}
                    $state={false}
                    onClick={() => {
                      addKeyword(keyword);
                    }}
                  >
                    {keyword.keyword}
                  </Keyword>
                );
              },
            )}
            <IsShow state={searchWord != '' && relatedKeywords.length === 0}>
              <>
                <Text>이런 키워드는 어때요?</Text>
                {excludeSelectedKeywords(randomKeywords).map((keyword, index) => {
                  return (
                    <Keyword
                      key={keyword.id + `${index}`}
                      $state={false}
                      onClick={() => {
                        addKeyword(keyword);
                      }}
                    >
                      {keyword.keyword}
                    </Keyword>
                  );
                })}
              </>
            </IsShow>
          </TopSheetKeywordWrapper>
        </TopSheetBody>
        <TopSheetFooter>
          <SaveButton
            onClick={() => {
              saveKeywords();
            }}
          >
            저장하기
          </SaveButton>
          <SaveMessage $state={isSaved}>{'저장되었습니다.'}</SaveMessage>
        </TopSheetFooter>
        <CloseButton>
          <Image src={closeImage} alt="close" onClick={closeTopSheet} width={24} />
        </CloseButton>
      </TopSheet>
    </CommonModalLayout>
  );
}

interface TopSheetProps {
  $isOpen: boolean;
}

const TopSheet = styled(CommonLayoutBox)<TopSheetProps>`
  box-sizing: border-box;
  border-top: 24px solid ${({ theme }) => theme.colors.yvote05};
  padding: 0.6rem;
  background-color: white;
  width: 1000px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0.5)};
  transition: opacity 0.2s ease-in-out;

  @media screen and (max-width: 768px) {
    opacity: 1;
    transform: translate(-50%, 0);

    top: ${({ $isOpen }) => ($isOpen ? '0px' : '-450px')};
    transition: top 0.2s ease-in-out;

    width: 100%;
    height: 450px;

    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.2);
    border-radius: '0 0 30px 30px';
  }
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.gray800};
  font-weight: 700;
  font-size: 1.1rem;
`;

const SubText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: 700;
  font-size: 0.9rem;
`;

const Title = styled(Text)``;

const SubTitle = styled(SubText)`
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: 700;
  font-size: 0.9rem;
`;

const TopSheetHead = styled(Row)`
  padding: 6px 0;
  gap: 10px;
`;

const SearchWrapper = styled(CommonLayoutBox)`
  flex: 0 0 auto;
  width: 135px;
`;

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
  border-radius: 4px;
  width: 100%;
  height: 100%;
  color: rgb(30, 30, 30);
  font-weight: 400;
  padding: 0.3rem 0.5rem;
  margin: 0;
  font: inherit;
  font-size: 12px;
  text-align: left;
  &::placeholder {
    color: rgb(170, 170, 170);
    font-size: 12px;
    font-weight: 400;
    text-align: center;
  }
  &:focus {
    outline: 0px solid rgb(133, 200, 224);
    font-size: 12px;
    font-weight: 400;
  }
`;

const KeywordSelectedWrapper = styled(CommonLayoutBox)`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 10px;
`;

const KeywordScrollWrapper = styled(Row)`
  width: 100%;
  height: 40px;
  padding-left: 4px;
`;

const TopSheetBody = styled.div`
  margin-bottom: 20px;
`;

const TopSheetKeywordWrapper = styled(CommonLayoutBox)`
  height: 150px;
  overflow-y: scroll;
  padding: 0.5rem;
`;

interface KeywordProps {
  $state: boolean;
}

const Keyword = styled(CommonTagBox)<KeywordProps>`
  flex: 0 0 auto;

  margin-left: 3px;
  margin-right: 6px;
  margin-top: 3px;
  margin-bottom: 3px;
  color: ${({ $state, theme }) => ($state ? theme.colors.yvote05 : 'rgb(120, 120, 120)')};
  background-color: ${({ $state }) => ($state ? 'white !important' : '#f1f2f5')};
  border: 1px solid #f1f2f5;
  border-color: ${({ $state, theme }) =>
    $state ? theme.colors.yvote03 + ' !important' : '#f1f2f5'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;
  animation: back-blink 0.4s ease-in-out forwards;
  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const TopSheetFooter = styled(Row)`
  align-items: center;
  gap: 10px;
`;

const SaveButton = styled.button`
  flex: 0 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.yvote05};
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote03};
  }
`;

const SaveMessage = styled(Text)<{ $state: boolean }>`
  font-size: 0.8rem;
  ${({ $state }) => ($state ? 'opacity: 0.6;' : 'opacity: 0;')}
  transition: opacity 0.4s ease-in-out;
`;

const CloseButton = styled(CommonIconButton)`
  position: absolute;
  top: calc(100% + 30px);
  left: 50%;
  transform: translate(-50%, -50%);
`;
