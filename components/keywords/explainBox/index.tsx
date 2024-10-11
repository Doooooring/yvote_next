import defaultImg from '@images/img_thumb@2x.png';
import { HOST_URL } from '@public/assets/url';
import { category } from '@utils/interface/keywords';
import icoClose from '@images/ico_close.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const SuspenseImage = dynamic(() => import('@components/common/suspenseImage'), { ssr: false });

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
          <Image src={icoClose} alt="close" />
        </label>
      </div>
      <div className="explanation-header">
        <h1>{keyword}</h1>
      </div>
      <div className="body-wrapper">
        <div className="explanation-list">
          <div className="keyword-img">
            <SuspenseImage src={`${HOST_URL}/images/keyword/${id}`} alt={keyword} fill />
          </div>
          <div className="explanation" dangerouslySetInnerHTML={{ __html: explain }} />
          {/* {explain.split('$').map((s, idx) => {
            return (
              <p className="explanation" key={idx}>
                {s}
              </p>
            );
          })} */}
        </div>
      </div>
    </ExplanationWrapper>
  );
}

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  background-color: white;
  padding: 1.8rem 2rem 1rem;
  box-shadow: 0 8px 35px -25px;
  position: relative;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    padding: 2rem;
  }
  .news-box-close {
    padding-top: 5px;
    padding-right: 5px;
    text-align: right;
    position: absolute;
    top: 0px;
    right: 0px;
    label.close-button {
      text-align: right;
      img {
        width: 25px;
        height: 25px;
      }
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

    h1 {
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
      text-align: left;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 2;
      color: black;
      font-weight: 500;
      word-break: keep-all;
      min-height: 10px;
      font-family: Helvetica, sans-serif;
      }
    }
  }
`;
