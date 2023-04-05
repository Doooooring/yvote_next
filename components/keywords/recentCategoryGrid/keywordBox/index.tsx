import React, { useCallback } from 'react';

import { useRouter } from 'next/router';
import styled from 'styled-components';

import defaultImg from '@assets/img/img_thumb@2x.png';
import { HOST_URL } from '@url';
import { KeywordToView } from '@utils/interface/keywords';

interface RecentKeywordBoxProps {
  keyword: KeywordToView['keyword'];
}

export default function RecentKeywordBox({ keyword }: RecentKeywordBoxProps) {
  const navigation = useRouter();

  const onErrorImg = useCallback((e: React.SyntheticEvent) => {
    const target = e.target as HTMLImageElement;
    target.src = defaultImg.src;
  }, []);

  return (
    <Wrapper
      onClick={() => {
        navigation.push(`/keywords/${keyword}`);
      }}
    >
      <KeywordWrapper>
        <KeywordTitle>{keyword}</KeywordTitle>
      </KeywordWrapper>
      <ImageWrapper>
        <img
          src={`${HOST_URL}/images/keyword/${keyword}.png`}
          height="190px"
          width="190px"
          alt="hmm"
          onError={(e) => {
            onErrorImg(e);
          }}
        />
      </ImageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 190px;
  height: 190px;
  border-radius: 15px;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  width: 190px;
  height: 190px;
  top: 0;
  left: 0;
  z-index: 1;
`;

const KeywordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 190px;
  height: 190px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
`;

const KeywordTitle = styled.p`
  color: rgb(220, 220, 220);
  font-size: 32px;
  font-weight: 700;
  padding-bottom: 1px;
`;
