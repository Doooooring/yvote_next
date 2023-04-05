import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import icoClose from '@assets/img/ico_close.png';
import defaultImg from '@assets/img/img_thumb@2x.png';
import { HOST_URL } from '@assets/url';
import { Keyword } from '@interfaces/keywords';

interface KeywordBoxProps {
  keyword: Keyword['keyword'] | undefined;
  tail: boolean;
}

export default function KeywordBox({ keyword, tail }: KeywordBoxProps) {
  const onErrorImg = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.src = defaultImg;
  }, []);

  return (
    <LinkWrapper
      to={`/keywords/${keyword}`}
      state={tail}
      onClick={(e) => {
        if (tail) {
          e.preventDefault();
        }
      }}
    >
      <Wrapper state={tail}>
        <ImageWrapper>
          <CloseImg
            src={`${HOST_URL}/images/keyword/${keyword}.png`}
            alt="hmm"
            width="85px"
            height="85px"
            onError={(e) => {
              onErrorImg(e);
            }}
            style={{
              borderRadius: '5px',
            }}
            state={tail}
          />
        </ImageWrapper>
        <KeywordWrapper>
          <KeywordTitle>{keyword}</KeywordTitle>
        </KeywordWrapper>
        <KeywordBoxTail state={tail}>
          <Link to="/keywords">
            <img src={icoClose} alt="hmm" />
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
  text-decoration: none;
  &:hover {
    cursor: ${({ state }) => (state ? 'default' : 'pointer')};
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
  overflow: hidden; ;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  padding-left: 5px;
`;

const KeywordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 95px;
`;

const KeywordTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: rgb(50, 50, 50);
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

interface CloseImgProps {
  state: boolean;
}

const CloseImg = styled.img<CloseImgProps>`
  &:hover {
    cursor: ${({ state }) => (state ? 'pointer' : 'default')};
  }
`;
