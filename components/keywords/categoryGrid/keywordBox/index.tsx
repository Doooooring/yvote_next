import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Keyword } from '@utils/interface/keywords';

interface KeywordBoxProps {
  id: Keyword['_id'] | undefined;
  keyword: Keyword['keyword'] | undefined;
}

export default function KeywordBox({ id, keyword }: KeywordBoxProps) {
  const [loadError, setLoadError] = useState<boolean>(false);

  return (
    <LinkWrapper
      href={`/keywords/${id}`}
      onClick={(e) => {
        return;
      }}
    >
      <div className="wrapper">
        <div className="image-wrapper">
          <ImageFallback src={`${HOST_URL}/images/keyword/${id}`} width={'75%'} height={'75%'} />
        </div>
        <div className="keyword-wrapper">
          <p className="keyword-title">{keyword}</p>
        </div>
      </div>
    </LinkWrapper>
  );
}

const LinkWrapper = styled(Link)`
  display: block;
  width: 9rem;
  text-decoration: none;

  .wrapper {
    width: 9rem;
    display: flex;
    justify-content: row;
    align-items: center;
    height: 100%;
    border-radius: 10px;
    border: 1px solid rgba(200, 200, 200, 0.5);
    background-color: white;
    box-shadow: 0px 0px 30px -25px;
    overflow: hidden;
  }
  .image-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    aspect-ratio: 1;
    height: 100%;

    & > img {
      border-radius: '5px';
    }
  }
  .keyword-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6rem;
    height: 100%;
    .keyword-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgb(50, 50, 50);
      margin: 0;
      @media screen and (max-width: 768px) {
        font-size: 0.8rem;
      }
    }
  }
`;
