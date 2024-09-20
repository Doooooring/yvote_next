import ImageFallback from '@components/common/imageFallback';
import { loadingImg } from '@public/assets/resource';
import KeywordRepository from '@repositories/keywords';
import { HOST_URL } from '@url';
import { Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';
import React, { Suspense } from 'react';
import styled from 'styled-components';

interface PreviewBoxProps {
  preview: Preview;
  click: (id: string) => void;
}
const SuspenseImage = React.lazy(() => import('@components/common/suspenseImage'));

export default function PreviewBox({ preview, click }: PreviewBoxProps) {
  const navigate = useRouter();
  const { _id, title, summary, keywords, state } = preview;

  const routeToKeyword = async (key: string) => {
    const id = await KeywordRepository.getIdByKeyword(key);
    if (!id) {
      alert('다시 검색해주세요!');
      return;
    }
    navigate.push(`/keywords/${id}`);
  };

  return (
    <Wrapper
      onClick={() => {
        click(_id);
      }}
    >
      <div className="img-wrapper">
        <Suspense fallback={<div>is fetching ...</div>}>
          <SuspenseImage
            src={`${HOST_URL}/images/news/${_id}`}
            alt={title}
            fill={true}
            suspense={true}
          />
        </Suspense>
      </div>
      <div className="body-wrapper">
        <div className="head-wrapper">
          <p>{title}</p>
          {state && (
            <ImageFallback src="/assets/img/ico_new_2x.png" alt="new_ico" height="16" width="32" />
          )}
        </div>
        <div className="summary" dangerouslySetInnerHTML={{ __html: summary }}></div>
        <div className="keyword-wrapper">
          {keywords?.map((keyword) => {
            return (
              <p className="keyword" key={keyword} onClick={() => routeToKeyword(keyword)}>
                {`#${keyword}`}
              </p>
            );
          })}
          <p className="keyword"></p>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  font: inherit;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  box-shadow: 0px 0px 35px -30px;
  margin-bottom: 10px;
  text-align: left;
  padding: 7px 10px;
  @media screen and (max-width: 768px) {
    padding: 10px 10px;
  }

  background-color: white;
  &:hover {
    cursor: pointer;
  }

  .img-wrapper {
    display: inline-block;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px;
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    color: #666;
    text-align: left;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
  }

  .head-wrapper {
    -webkit-text-size-adjust: none;
    text-align: left;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    gap: 4px;
    > Img {
      padding-right: 8px;
    }
    p {
      -webkit-text-size-adjust: none;
      color: rgb(30, 30, 30);
      text-align: left;
      padding: 0;
      padding-right: 2px;
      border: 0;
      font: inherit;
      vertical-align: baseline;
      font-size: 15px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
  }

  .body-wrapper {
    display: inline-block;
    width: auto;
    flex-grow: 1;
    color: #666;
    text-align: left;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    padding-left: 20px;
    .summary {
      -webkit-text-size-adjust: none;
      text-align: left;
      padding: 0;
      border: 0;
      font: inherit;
      font-weight: 300;
      vertical-align: baseline;
      color: rgb(30, 30, 30);
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      height: 3.4em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      ::after {
        content: '';
        display: block;
        height: 10px;
        background-color: white;
      }
    }

    .keyword-wrapper {
      -webkit-text-size-adjust: none;
      text-align: left;
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      vertical-align: baseline;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      .keyword {
        -webkit-text-size-adjust: none;
        text-align: left;
        padding: 0;
        border: 0;
        font: inherit;
        vertical-align: baseline;
        display: inline;
        text-decoration: none;
        height: 14px;
        font-size: 12px;
        font-weight: 300;
        margin: 0;
        margin-right: 6px;
        color: #3a84e5;
      }
    }
  }
`;

interface NewProps {
  state: boolean | undefined;
}

const New = styled.span<NewProps>`
  display: ${({ state }) => (state ? 'inline' : 'none')};
  & > img {
    position: relative;
    top: 3px;
  }
`;
