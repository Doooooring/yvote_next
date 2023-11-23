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
          <ImageFallback src={`${HOST_URL}/images/keyword/${id}`} width={'100%'} height={'100%'} />
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
  width: '235px';
  text-decoration: none;
  @media screen and (max-width: 768px) {
    width: 150px;
    height: 60px;
  }
  .wrapper {
    width: '235px';
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
  }
  .image-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
    padding-left: 5px;
    width: 85px;
    height: 85px;

    & > img {
      border-radius: '5px';
    }
    @media screen and (max-width: 768px) {
      width: 60px;
      height: 60px;
      flex: 0 0 auto;
    }
  }
  .keyword-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 95px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    .keyword-title {
      font-size: 20px;
      font-weight: 600;
      color: rgb(50, 50, 50);
      margin: 0;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
`;
