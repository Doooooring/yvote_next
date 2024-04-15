import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import KeywordsRepository from '@repositories/keywords';
import NewsRepository from '@repositories/news';
import { Keyword } from '@utils/interface/keywords';
import { Preview } from '@utils/interface/news';
import { getConstantVowel } from '@utils/tools';

type curPreviews = Array<Preview>;
type setCurPreviews = (curPreviews: curPreviews) => void;
type KeyName = Keyword['keyword'];

interface SearchBoxProps {
  curPage: MutableRefObject<number>;
  setSubmitWord: (submitWord: string) => void;
  setCurPreviews: setCurPreviews;
}

export default function SearchBox({ curPage, setSubmitWord, setCurPreviews }: SearchBoxProps) {
  // 현재 검색어
  const [searchWord, setSearchWord] = useState<string>('');
  // 현재 검색어 기반 연관 검색어 목록
  const [relatedWords, setRelatedWords] = useState<string[]>(['키워드를 검색해 봅시다']);
  // 전체 키워드 리스트
  const [keylist, setKeyList] = useState<KeyName[]>([]);
  // 방향키에 맞춰서 포커스된 단어 업데이트
  const [curFocusOnWord, setCurFocusOnWord] = useState<number>(-1);
  // 위,아래 방향키 입력시 최상단 및 최하단 (더 이상 방향키 액션이 발생하지 못하는 때) 감지
  const [arrowKeyActive, setArrowKeyActive] = useState<boolean>(false);

  /**
   * 검색 가능한 키워드들을 보여주기 위한 전체 키워드 리스트 fetch
   */
  const getKeys = useCallback(async () => {
    try {
      const response: KeyName[] = await KeywordsRepository.getKeywordList();
      setKeyList(response);
    } catch {
      Error();
    }
  }, []);

  /**
   * 현재 검색어 기반 뉴스 블록들 조회
   */
  const submit = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>, searchWord: string) => {
      e.preventDefault();
      if (curFocusOnWord !== -1) {
        setSearchWord(relatedWords[curFocusOnWord]);
      }
      // 새로운 검색어로 조회하기에 기존 페이지 초기화
      const newsList = await NewsRepository.getPreviews(0, searchWord);
      curPage.current = 20;
      if (newsList.length !== 0) {
        setSubmitWord(searchWord);
        setCurPreviews(newsList);
      } else {
        alert('키워드가 존재하지 않습니다');
      }
    },
    [],
  );

  useEffect(() => {
    getKeys();
  }, []);

  /**
   * 인풋 내용 변화에 따른 변수 바인딩
   * 현재 검색어 업데이트 & 연관 검색어 리스트 업데이트
   *
   */
  // @FIXME "키워드를 검색해 봅시다"와 같이 특별한 상황에 값을 보이기 위해 relatedWords가
  // 순수한 형태가 아닌채로 남아있음. 리팩토링이 필요
  function handleSearchBoxChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (arrowKeyActive) {
      setArrowKeyActive(false);
      return;
    }
    const preValue = e.currentTarget.value;
    setSearchWord(preValue);
    if (preValue === '') {
      setCurFocusOnWord(-1);
      setRelatedWords(['정확한 키워드를 입력해주세요']);
    } else {
      if (curFocusOnWord !== -1) {
        setCurFocusOnWord(-1);
      }
      const findRelatedWords: string[] = [];
      const preValueToChars = getConstantVowel(preValue, true) as string[];
      for (const key of keylist) {
        const keyToChar = getConstantVowel(key, false) as string;
        preValueToChars.forEach((preValueToChar) => {
          if (keyToChar.includes(preValueToChar)) {
            findRelatedWords.push(key);
          }
        });
        if (findRelatedWords.length === 10) {
          break;
        }
      }
      if (findRelatedWords.length === 0) {
        setRelatedWords(['']);
      } else {
        setRelatedWords(findRelatedWords);
      }
    }
  }
  /**
   * 입력이 아닌 화살표 및 엔터에 대한 이벤트 관리 함수
   */
  async function handleArrowKey(e: React.KeyboardEvent<HTMLInputElement>, searchWord: string) {
    if (e.key === 'Enter') {
      submit(e, searchWord);
    } else if (
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft'
    ) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || searchWord === '') {
        return 0;
      } else {
        if (e.key === 'ArrowUp') {
          if (curFocusOnWord === -1) {
            return 0;
          } else {
            setArrowKeyActive(true);
            setSearchWord(relatedWords[curFocusOnWord - 1]);
            setCurFocusOnWord(curFocusOnWord - 1);
          }
        } else if (e.key === 'ArrowDown') {
          if (curFocusOnWord === relatedWords.length - 1) {
            setArrowKeyActive(true);
            setSearchWord(relatedWords[0]);
            setCurFocusOnWord(0);
            return 0;
          } else {
            setArrowKeyActive(true);
            setSearchWord(relatedWords[curFocusOnWord + 1]);
            setCurFocusOnWord(curFocusOnWord + 1);
          }
        }
      }
    } else {
      return 0;
    }
  }

  return (
    <Wrapper>
      <div className="input-wrapper">
        <input
          className="input-box"
          type="text"
          placeholder="키워드로 뉴스 필터링"
          value={searchWord}
          onChange={(e) => {
            handleSearchBoxChange(e);
          }}
          onKeyDown={(e) => {
            handleArrowKey(e, searchWord);
          }}
        />
        <div className="related-box">
          {relatedWords.map((word) => (
            <RelatedWord
              className={'word'}
              key={word}
              id={`${relatedWords.indexOf(word)}`}
              isFocused={word === relatedWords[curFocusOnWord]}
            >
              {`# ${word}`}
            </RelatedWord>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  position: relative;
  display: inline-flex;
  width: 300px;
  height: 45px;
  font-weight: bold;
  text-align: center;
  align-items: center;
  .input-wrapper {
    position: absolute;
    width: 100%;
    height: 90%;
    display: flex;
    align-items: center;
    overflow: hidden;
    &:focus-within {
      overflow: visible;
    }
    .input-box {
      display: inline-flex;
      border: 0;
      border-radius: 5px;
      width: 100%;
      height: auto;
      color: rgb(170, 170, 170);
      font-weight: 600;
      padding: 0;
      margin: 0;
      font: inherit;
      font-size: 13px;
      text-align: center;

      &::placeholder {
        color: rgb(170, 170, 170);
        font-size: 13px;
        font-weight: 800;
      }
      &:focus {
        outline: 2px solid rgb(133, 200, 224);
        font-size: 13px;
      }
    }
    .related-box {
      min-height: 100px;
      background-color: rgb(133, 200, 224);
      width: 100%;
      border-style: solid;
      border-width: 2px;
      border-color: rgb(133, 200, 224);
      border-radius: 5px;
      position: absolute;
      top: 100%;
      text-align: left;
      z-index: 3;
      opacity: 0.7;
    }
  }
`;

interface RelatedWordProps {
  isFocused: boolean;
}

const RelatedWord = styled.p<RelatedWordProps>`
  -webkit-text-size-adjust: none;
  text-align: left;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  font: inherit;
  box-sizing: inherit;
  color: white;
  font-weight: 700;
  padding-left: 5px;
  margin-bottom: 5px;
  border-width: 1px;
  font-size: 13px;
  border-style: solid;
  z-index: 1;
  background-color: ${({ isFocused }) => (isFocused ? 'rgb(101, 177, 205)' : 'rgba(0,0,0,0)')};
`;
