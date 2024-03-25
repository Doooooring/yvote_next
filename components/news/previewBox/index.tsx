import Image from 'next/image';
import styled from 'styled-components';

import ImageFallback from '@components/common/imageFallback';
import icoNew from '@images/ico_new.png';
import KeywordRepository from '@repositories/keywords';
import { HOST_URL } from '@url';
import { News, Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';

type curClicked = undefined | News['_id'];

interface PreviewBoxProps {
  preview: Preview;
  curClicked: curClicked;
  click: (id: string) => void;
}

export default function PreviewBox({ preview, curClicked, click }: PreviewBoxProps) {
  const navigate = useRouter();
  const { _id, order, title, summary, keywords, state } = preview;

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
      state={curClicked === _id}
      onClick={() => {
        click(_id);
      }}
    >
      <div className="img-wrapper">
        <ImageFallback
          src={`${HOST_URL}/images/news/${_id}`}
          width="100%"
          height="100%"
          fill={true}
        />
      </div>
      <div className="body-wrapper">
        <div className="head-wrapper">
          <p>{title}</p>
          <Image
            src={icoNew}
            alt="2weeks"
            height="16"
            style={{
              display: state ? 'auto' : 'none',
            }}
          />
        </div>
        <div className="summary">{summary.replace(/\$/g, '')}</div>
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

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
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
  padding: 10px;

  background-color: ${({ state }) => (state ? 'rgb(200, 200, 200)' : 'white')};
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
    font: inherit;
    flex-shrink: 0;
  }

  .head-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
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
      color: #666;
      text-align: left;
      padding: 0;
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
    -webkit-text-size-adjust: none;
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
      color: #626060;
      margin: 0;
      padding-top: 5px;
      font-size: 13px;
      min-height: 45px;
      line-height: 1.65;
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
      color: #3a84e5;
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
