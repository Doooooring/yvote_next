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
    const keyword = await KeywordRepository.getKeywordByKey(key);
    if (!keyword) {
      alert('다시 검색해주세요!');
      return;
    }
    const { _id } = keyword!;
    navigate.push(`/keywords/${_id}`);
  };

  return (
    <Wrapper
      state={curClicked === _id}
      onClick={() => {
        click(_id);
      }}
    >
      <div className="img-wrapper">
        <ImageFallback src={`${HOST_URL}/images/news/${_id}`} width={100} height={100} />
      </div>
      <div className="body-wrapper">
        <div className="head-wrapper">
          <h1>{title}</h1>
          <New state={state}>
            <Image src={icoNew} alt="hmm" height="16" />
          </New>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 490px;

  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  background-color: ${({ state }) => (state ? 'rgb(200, 200, 200)' : 'white')};
  box-shadow: 0px 0px 35px -30px;
  margin-bottom: 10px;
  text-align: left;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }

  .head-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }

  h1 {
    /* display: inline; */
    font-size: 15px;
    font-weight: 700;
    margin-right: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
    margin: 0;
  }

  .img-wrapper {
    display: inline-block;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px;
    width: 100px;
    height: 100px;
    overflow: hidden;
  }

  .body-wrapper {
    display: inline-block;
    padding-left: 20px;
    width: 80%;
    height: 90%;

    .summary {
      color: rgb(120, 120, 120);
      margin: 0;
      padding-top: 5px;
      font-size: 13px;
      min-height: 45px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .keyword-wrapper {
      .keyword {
        display: inline;
        text-decoration: none;
        height: 14px;
        font-size: 12px;
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
