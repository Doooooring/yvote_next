import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

import Image from 'next/image';

import icoClose from '@images/ico_close.png';

import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Keyword } from '@utils/interface/keywords';

interface KeywordBoxProps {
  id: Keyword['_id'] | undefined;
  keyword: Keyword['keyword'] | undefined;
  tail: boolean;
}

export default function KeywordBox({ id, keyword, tail }: KeywordBoxProps) {
  const [loadError, setLoadError] = useState<boolean>(false);

  return (
    <LinkWrapper
      href={`/keywords/${id}`}
      state={tail}
      onClick={(e) => {
        if (tail) {
          e.preventDefault();
        }
        return;
      }}
    >
      <Wrapper state={tail}>
        <ImageWrapper state={tail}>
          <ImageFallback src={`${HOST_URL}/images/keyword/${id}`} width={'100%'} height={'100%'} />
        </ImageWrapper>
        <KeywordWrapper>
          <KeywordTitle>{keyword}</KeywordTitle>
        </KeywordWrapper>
        <KeywordBoxTail state={tail}>
          <Link href="/keywords">
            <Image src={icoClose} alt="hmm" />
          </Link>
        </KeywordBoxTail>
      </Wrapper>
    </LinkWrapper>
  );
}

interface LinkWrapperProps {
  state: boolean;
}

const LinkWrapper = styled(Link)<LinkWrapperProps>`
  display: block;
  width: ${({ state }) => (state ? '255px' : '235px')};

  &:hover {
    cursor: ${({ state }) => (state ? 'default' : 'pointer')};
  }
  text-decoration: none;
  @media screen and (max-width: 768px) {
    width: 150px;
    height: 60px;
  }
`;

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: ${({ state }) => (state ? '255px' : '235px')};
  display: flex;
  justify-content: row;
  align-items: center;
  height: 95px;
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  background-color: white;
  box-shadow: 0px 0px 30px -25px;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    width: 150px;
    height: 60px;
    padding: 0 0.25rem;
  }
`;

interface ImageWrapperProps {
  state: boolean;
}

const ImageWrapper = styled.div<ImageWrapperProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  padding-left: 5px;
  width: 85px;
  height: 85px;

  &:hover {
    cursor: ${({ state }) => (state ? 'pointer' : 'default')};
  }
  & > img {
    border-radius: '5px';
  }
  @media screen and (max-width: 768px) {
    width: 60px;
    height: 60px;
    flex: 0 0 auto;
  }
`;

const KeywordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 95px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const KeywordTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: rgb(50, 50, 50);
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

interface KeywordBoxTailProps {
  state: boolean;
}

const KeywordBoxTail = styled.div<KeywordBoxTailProps>`
  display: ${({ state }) => (state ? 'flex' : 'none')};
  width: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgb(200, 200, 200);
`;
