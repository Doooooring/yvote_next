import defaultImg from '@images/img_thumb@2x.png';
import { HOST_URL } from '@public/assets/url';
import { category } from '@utils/interface/keywords';

import icoClose from '@images/ico_close.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

export default function ExplanationComp({
  id,
  explain,
  category,
  keyword,
}: {
  id: string;
  category: category;
  explain: string | undefined;
  keyword: string;
}) {
  const navigation = useRouter();

  const [keywordTagLoadError, setKeywordTagLoadError] = useState<boolean>(false);
  const [keywordImgLoadError, setKeywordImgLoadError] = useState<boolean>(false);
  if (explain === undefined) {
    return <div></div>;
  }
  return (
    <ExplanationWrapper>
      <div className="news-box-close">
        <input
          type="button"
          style={{ display: 'none' }}
          id="close-button"
          onClick={() => {
            navigation.back();
          }}
        ></input>
        <label className="close-button" htmlFor="close-button">
          <Image src={icoClose} alt="hmm" />
        </label>
      </div>
      <div className="explanation-header">
        <p>{keyword}</p>
        <Image
          src={keywordTagLoadError ? defaultImg : `${HOST_URL}/images/${category}`}
          alt="hmm"
          width="20"
          height="20"
          onError={() => {
            setKeywordTagLoadError(true);
          }}
        />
      </div>
      <div className="body-wrapper">
        <div className="explanation-list">
          <div className="keyword-img">
            <Image
              src={keywordImgLoadError ? defaultImg : `${HOST_URL}/images/keyword/${id}`}
              alt="hmm"
              fill
              onError={() => {
                setKeywordImgLoadError(true);
              }}
            />
          </div>
          {explain.split('$').map((s, idx) => {
            return (
              <p className="explanation" key={idx}>
                {s}
              </p>
            );
          })}
        </div>
      </div>
    </ExplanationWrapper>
  );
}

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  background-color: white;
  padding: 2rem 3rem;
  box-shadow: 0 8px 35px -25px;
  position: relative;
  @media screen and (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .news-box-close {
    padding-right: 10px;
    text-align: right;
    position: absolute;
    top: 0px;
    right: 0px;
    label.close-button {
      padding-top: 10px;

      text-align: right;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .explanation-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;

    p {
      margin: 0;
      padding: 0;
    }
    & {
      img {
        flex: 0 0 auto;
        object-fit: contain;
      }
    }
  }
  .body-wrapper {
    .explanation-list {
      padding-left: 0.25rem;

      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
      .keyword-img {
        float: right;
        margin-left: 16px;
        width: 140px;
        height: 140px;
        position: relative;
        @media screen and (max-width: 768px) {
          width: 90px;
          height: 90px;
        }
      }
    }
    .explanation {
      font-family: var(--font-pretendard);
      font-size: 16px;
      font-weight: 600;
      color: #a1a1a1;
      line-height: 1.5;
      text-align: left;
      margin-bottom: 20px;
    }
  }
`;
