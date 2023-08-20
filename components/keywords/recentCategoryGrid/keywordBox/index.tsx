import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

import Image from 'next/image';

import icoClose from '@images/ico_close.png';

import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Keyword } from '@utils/interface/keywords';

interface KeywordBoxProps {
  id: Keyword['keyword'] | undefined;
  keyword: Keyword['keyword'] | undefined;
  tail: boolean;
}

export default function KeywordBox({ id, keyword, tail }: KeywordBoxProps) {
  const [loadError, setLoadError] = useState<boolean>(false);

  return (
    <LinkWrapper
      href={`/keywords/${keyword}`}
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
          <ImageFallback src={`${HOST_URL}/images/keyword/${id}`} width={85} height={85} />
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
  &:hover {
    cursor: ${({ state }) => (state ? 'pointer' : 'default')};
  }
  & > img {
    border-radius: '5px';
  }
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
  margin: 0;
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

// import React, { useCallback, useState } from 'react';

// import { useRouter } from 'next/router';
// import styled from 'styled-components';

// import Image from 'next/image';

// import defaultImg from '@images/img_thumb@2x.png';
// import { HOST_URL } from '@url';
// import { KeywordToView } from '@utils/interface/keywords';

// interface RecentKeywordBoxProps {
//   id: KeywordToView['_id'];
//   keyword: KeywordToView['keyword'];
// }

// export default function RecentKeywordBox({ id, keyword }: RecentKeywordBoxProps) {
//   const navigation = useRouter();

//   const [loadError, setLoadError] = useState<boolean>(false);

//   const onErrorImg = useCallback((e: React.SyntheticEvent) => {
//     const target = e.target as HTMLImageElement;
//     target.src = defaultImg.src;
//   }, []);

//   return (
//     <Wrapper
//       onClick={() => {
//         navigation.push(`/keywords/${keyword}`);
//       }}
//     >
//       <KeywordWrapper>
//         <KeywordTitle>{keyword}</KeywordTitle>
//       </KeywordWrapper>
//       <ImageWrapper>
//         <Image
//           src={loadError ? defaultImg : `${HOST_URL}/images/keyword/${id}`}
//           height="190"
//           width="190"
//           alt="hmm"
//           onError={() => {
//             setLoadError(true);
//           }}
//         />
//       </ImageWrapper>
//     </Wrapper>
//   );
// }

// const Wrapper = styled.div`
//   position: relative;
//   width: 190px;
//   height: 190px;
//   border-radius: 15px;
//   overflow: hidden;
//   &:hover {
//     cursor: pointer;
//   }
// `;

// const ImageWrapper = styled.div`
//   position: absolute;
//   width: 190px;
//   height: 190px;
//   top: 0;
//   left: 0;
//   z-index: 1;
// `;

// const KeywordWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 190px;
//   height: 190px;
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 99;
//   background-color: rgba(0, 0, 0, 0.6);
// `;

// const KeywordTitle = styled.p`
//   color: rgb(220, 220, 220);
//   font-size: 32px;
//   font-weight: 700;
//   padding-bottom: 1px;
// `;
