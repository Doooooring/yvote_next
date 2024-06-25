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
          blurImg='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIxUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/3+tTr8s3o8Or1+f7+/+bz+Of0+Pf7/f7///3+/vv9/uXz97bd6YrI3HnA13i/14/K3ofH25bO4Lfd6d7w9fz9/s/p8bje6rHa6J/S4ofG24LE2pTN36/Z58fl7sXk7uHx9oDD2Xe/1qPU5N3v9fP5+9Lq8sHi7cTj7cnm73rA13jA177h7Pr9/vT6/He/13vB1/z+/n3C2NDp8cvm73/D2ZrQ4fj8/YPF2sDh7H7C2N7v9fL5+67Z53vB2IDE2ePy95rP4Y3J3fH4+8jl7qrX5uv1+anX5XzB2HrB14TF2qnW5b3g68/o8dvu9ODw9szn8JDL3tjt887o8I7K3Xa/1oXG27Xc6dHq8ej0+Nbs8/b7/On1+K3Y5/n8/fX7/Lvf68rm7+73+sjl75XN35fO4Lre6tzu9PP6/PD4+9/w9pvQ4YvJ3Lbc6cbk7sPj7eLx9s3n8J7R4na+1tHp8bne6qHT44HE2YvI3Lzg66XV5JHL3tfs88Di7KjW5ZPM34zJ3bTc6HW+1rLb6Lzf67Da56fW5aLT46DS46/a55X8NXIAAAAwdFJOUwAAF0yKvd/y+00YAS+EzvQwJpHn6CcGYdoS+KmSYijbApMx6YcZ0FD1jsHA4v2NT1D/9y8AAAABYktHRAH/Ai3eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYZADcoMSDWNAAAAqlJREFUOMtjYIACRhBgYmZhZWPn4GBnY2Xh5AILMaABoBA3Dy8fvwEc8PPxCnCjqwRpFRQSNkADIkKiqIYCOWLiEgZYgIS4GJJKIFNSSMoAK5ASkoSrBDK4pA1wAmkumEqgeXjUAVVKQhQC3SdjgBfIiIFUAs2VRXWfoZGxiamZuQXCnbIgyxkZ5eShApZWBgbWNrZ29g6OJkZOzi6u1lAJeTmQQgVFmE43dw9PL28fXz//gECboODgoJBQS4iMogJQoZIy3I6w8IhII4idUdH29jHBPrFxYAllJaBCFWzuj3dOsAeCmESPJDBfhZFBVQ2LOlMPewiISU4BC6ipMqhrYFGYmhYDVRmcngES0FBn0MRUZpnqA1NnH5NpDhbTZNDCUGedFQRXZ2+fnQMW1GbQQVeXm5ePpM6+oBAsqsOA7sTAImRl9g7FJWBhDQZdFGVxpU7BIJclBAdHJwelRccEl5mCJXRRFZZXVDrEBAdXVfvW1NbVBzY0NiU3G0AVIllt3dLa1hbdXtTR2WUBjbvuMmB8W/ZYAK1GeKa3Ij+5qc+4qx/JigldhvWREydNBnpGGypkMWXqtOkzZiIH06zZUZ5znObOs0kCBQ8kwC3L5y8IzICrScpduKhj8dw0+yX5NTZgET1oFFrPgqmyirdZumx56wr74GAH+4SVLZA0qaGPnCgse7qMVq1e41MFUgMKQ4d0G6gUMFFAkpllRvnades3VOcnBDsAAzzGITg4JnujSwnMDBVIwrUK3TStOnrz5s1twUDgEJ3d3uS1pTQUrgyScEFZIb6hceu27Tt2Lg9Zv2tZZEqoSby1ATIAZwV45rK0SkqyssSSOqGZCyO7YgBIdiW6ACC+SCG+kCK62CO+IMVZNAsLCTJiKcUxC3sebuzVAt7qAwBN8zGkBWxmvAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0yNVQwMDo1NTozMCswMDowMHp109UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMjVUMDA6NTU6MzArMDA6MDALKGtpAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTA2LTI1VDAwOjU1OjQwKzAwOjAwVvhDrwAAAABJRU5ErkJggg=='
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
