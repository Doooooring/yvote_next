import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import styled from 'styled-components';

import KeywordRepository from '@repositories/keywords';
import { Keyword } from '@utils/interface/keywords';
import { getConstantVowel } from '@utils/tools';

type KeyName = Keyword['keyword'];

export default function SearchBox() {
  const navigate = useRouter();
  const [searchWord, setSearchWord] = useState<string>('');
  const [relatedWords, setRelatedWords] = useState<string[]>([
    '국무회의',
    '법률',
    '행정부',
    '헌법재판소',
  ]);
  const [keylist, setKeyList] = useState<KeyName[]>([]);
  const [curFocusOnWord, setCurFocusOnWord] = useState<number>(-1);
  const [arrowKeyActive, setArrowKeyActive] = useState<boolean>(false);

  const getKeys = useCallback(async () => {
    try {
      const response = await KeywordRepository.getKeywordList();
      setKeyList(response);
    } catch (e) {
      console.log(e);
    }
  }, []);

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
      setRelatedWords(['']);
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
      e.preventDefault();
      if (!keylist.includes(searchWord)) {
        alert('키워드가 존재하지 않습니다');
      } else {
        const id = await KeywordRepository.getIdByKeyword(searchWord);
        if (!id) {
          alert('키워드가 존재하지 않습니다');
          return;
        }
        navigate.push(`/keywords/${id}`);
      }
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
      <InputWrapper>
        <InputBox
          type="text"
          placeholder="키워드 검색"
          value={searchWord}
          onChange={(e) => {
            handleSearchBoxChange(e);
          }}
          onKeyDown={(e) => {
            handleArrowKey(e, searchWord);
          }}
        ></InputBox>
        <RelatedBox>
          {relatedWords.map((word) => (
            <RelatedWord
              key={word}
              className={'word'}
              id={`${relatedWords.indexOf(word)}`}
              isFocused={word === relatedWords[curFocusOnWord]}
            >
              {`# ${word}`}
            </RelatedWord>
          ))}
        </RelatedBox>
      </InputWrapper>
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
`;

const InputWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 90%;
  overflow: hidden;
  display: flex;
  align-items: center;
  &:focus-within {
    overflow: visible;
  }
`;
const InputBox = styled.input`
  display: inline-block;
  border: 0;
  border-radius: 5px;
  width: 100%;
  height: auto;
  color: rgb(170, 170, 170);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
  margin: 0;
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
`;

const RelatedBox = styled.div`
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
`;

interface RelatedWordProps {
  isFocused: boolean;
}

const RelatedWord = styled.p<RelatedWordProps>`
  -webkit-text-size-adjust: none;
  text-align: left;
  margin: 0;
  padding: 0;
  font: inherit;
  box-sizing: inherit;
  color: white;
  font-weight: 700;
  padding-left: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  border-width: 1px;
  font-size: 13px;
  border-style: solid;
  z-index: 1;
  background-color: ${({ isFocused }) => (isFocused ? 'rgb(101, 177, 205)' : 'rgba(0,0,0,0)')};
`;

const SubmitButton = styled.button`
  display: none;
  position: absolute;
  height: 80%;
  width: 12%;
  top: 0;
  right: 0px;
  color: black;
`;
