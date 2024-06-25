import ImageFallback from '@components/common/imageFallback';
import yVoting from '@images/와이보트.png';
import KeywordRepository from '@repositories/keywords';
import { HOST_URL } from '@url';
import { Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface PreviewBoxProps {
  preview: Preview;
  click: (id: string) => void;
}

export default function PreviewBox({ preview, click }: PreviewBoxProps) {
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
      onClick={() => {
        click(_id);
      }}
    >
      <div className="img-wrapper">
        <ImageFallback
          src={`${HOST_URL}/images/news/${_id}`}
          blurImg='data:image/png;base64,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'
          width="100%"
          height="100%"
          fill={true}
        />
      </div>
      <div className="body-wrapper">
        <div className="head-wrapper">
          <p>{title}</p>
          {state && <ImageFallback src="/assets/img/ico_new_2x.png" height="16" width="32" />}
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
