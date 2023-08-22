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
  const [relatedWords, setRelatedWords] = useState<string[]>(['키워드를 검색해 봅시다.']);
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
      setRelatedWords(['키워드를 검색해 봅시다']);
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
        setRelatedWords(['그런건 없어용 :)']);
      } else {
        setRelatedWords(findRelatedWords);
      }
    }
  }
  async function handleArrowKey(e: React.KeyboardEvent<HTMLInputElement>, searchWord: string) {
    e.preventDefault();
    if (e.key === 'Enter') {
      if (!keylist.includes(searchWord)) {
        alert('알맞은 키워드를 입력해주세요!');
      } else {
        navigate.push(`/keywords/${searchWord}`);
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
          placeholder="궁금한 뉴스의 키워드, 인물을 검색하시오"
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
  display: inline-block;
  width: 300px;
  height: 40px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
  text-align: center;
`;

const InputWrapper = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 90%;
  overflow: hidden;
  &:focus-within {
    overflow: visible;
  }
`;
const InputBox = styled.input`
  display: inline-block;
  border: 0;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: rgb(170, 170, 170);
  font-weight: 600;
  padding-left: 40px;
  padding-top: 4px;
  padding-bottom: 3px;
  background-image: url('@assets/img/ico_search.png');
  background-repeat: no-repeat;
  background-position: 6px 6px;
  &::placeholder {
    color: rgb(170, 170, 170);
    font-size: 13px;
    font-weight: 800;
  }
  &:focus {
    outline: 2px solid rgb(104, 156, 209);
  }
`;
const RelatedBox = styled.div`
  min-height: 100px;
  background-color: rgb(104, 156, 209);
  width: 100%;
  border-style: solid;
  border-width: 2px;
  border-color: rgb(104, 156, 209);
  border-radius: 0px 0px 10px 10px;
  position: absolute;
  top: 100%;
  text-align: left;
  z-index: 3;
  padding-top: 5px;
`;

interface RelatedWordProps {
  isFocused: boolean;
}

const RelatedWord = styled.p<RelatedWordProps>`
  color: white;
  font-weight: 700;
  padding-left: 5px;
  margin-bottom: 5px;
  border-width: 3px;
  font-size: 15px;
  border-style: solid;
  z-index: 5;
  background-color: ${({ isFocused }) => (isFocused ? 'rgb(120, 120, 120)' : 'rgba(0,0,0,0)')};
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
