import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Keyword } from '@utils/interface/keywords';
import Link from 'next/link';
import styled from 'styled-components';

interface KeywordBoxProps extends Pick<Keyword, 'id' | 'keyword' | 'keywordImage'> {}

export default function KeywordBox({ id, keyword, keywordImage }: KeywordBoxProps) {
  return (
    <LinkWrapper href={`/keywords/${String(id)}`}>
      <div className="wrapper">
        <div className="image-wrapper">
          <ImageFallback
            src={keywordImage ?? ''}
            alt={keyword ?? ''}
            width="100"
            height="100"
            style={{
              width: '75%',
              height: '75%',
            }}
          />
        </div>
        <div className="keyword-wrapper">
          <p className="keyword-title title">{keyword}</p>
        </div>
      </div>
    </LinkWrapper>
  );
}

const LinkWrapper = styled(Link)`
  display: block;
  width: 10rem;
  text-decoration: none;

  filter: saturate(80%);

  transition: filter 0.2s ease;

  img {
    transition: transform 0.3s ease-in-out;
  }

  .title {
    color: rgb(50, 50, 50);

    transition: color 0.3s ease;
  }

  &:hover {
    filter: saturate(130%);

    img {
      transform: scale(1.2);
    }
    .title {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .wrapper {
    width: 10rem;
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 10px;
    border: 1px solid rgba(200, 200, 200, 0.5);
    background-color: white;
    box-shadow: 0px 0px 30px -25px;
    overflow: hidden;
    box-sizing: border-box;
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
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
`;
