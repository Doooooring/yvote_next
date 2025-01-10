import ImageFallback from '@components/common/imageFallback';
import { loadingImg } from '@public/assets/resource';
import KeywordRepository from '@repositories/keywords';
import { HOST_URL } from '@url';
import { Preview } from '@utils/interface/news';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Suspense, useCallback } from 'react';
import styled from 'styled-components';
import PreviewBoxLayout from './previewBox.style';
import { getTextContentFromHtmlText } from '@utils/tools';

interface PreviewBoxProps {
  preview: Preview;
  click: (id: number) => void;
  img?: string;
}
function PreviewBox({ preview, img, click }: PreviewBoxProps) {
  const navigate = useRouter();
  const { id, title, summary, newsImage, keywords, state } = preview;

  return (
    <Wrapper>
      <PreviewBoxLayout
        onClick={() => {
          click(id);
        }}
        imgView={<ImageFallback src={img ?? ``} alt={title} fill={true} suspense={true} />}
        headView={
          <>
            <Title className="title">{title}</Title>
            {state && (
              <ImageFallback
                src="/assets/img/ico_new_2x.png"
                alt="new_ico"
                height="16"
                width="32"
              />
            )}
          </>
        }
        contentView={
          <>
            <Summary>
              <p>{summary}</p>
            </Summary>
            <Keywords>
              {keywords?.map(({ id, keyword }) => {
                return (
                  <Keyword
                    key={keyword}
                    onClick={() => {
                      navigate.push(`/keywords/${String(id)}`);
                    }}
                  >
                    {`#${keyword}`}
                  </Keyword>
                );
              })}
              <p className="keyword"></p>
            </Keywords>
          </>
        }
      />
    </Wrapper>
  );
}

export default React.memo(PreviewBox, (prevProps, nextProps) => {
  return prevProps.preview.id === nextProps.preview.id && prevProps.click === nextProps.click;
});

const Wrapper = styled.div`
  filter: saturate(80%);
  font-family: Noto Sans KR, Helvetica, sans-serif;
  transition: filter 0.2s ease;

  img {
    transition: transform 0.3s ease-in-out;
  }

  .title {
    transition: color 0.3s ease;
  }

  &:hover {
    filter: saturate(130%);

    img {
      transform: scale(1.1);
    }
    .title {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Title = styled.p`
  -webkit-text-size-adjust: none;
  color: rgb(20, 20, 20);
  text-align: left;
  padding: 0;
  padding-right: 2px;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  font-size: 15.5px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const Summary = styled.div`
  -webkit-text-size-adjust: none;
  text-align: left;
  padding: 0;
  border: 0;
  font: inherit;
  font-weight: 400;
  vertical-align: baseline;
  color: rgb(80, 80, 80);
  margin: 0;
  font-size: 14.5px;
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
  @media screen and (max-width: 768px) {
    color: rgb(100, 100, 100);
    font-size: 13.5px;
  }
`;

const Keywords = styled.div`
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
`;

const Keyword = styled.p`
  -webkit-text-size-adjust: none;
  text-align: left;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  display: inline;
  text-decoration: none;
  height: 14px;
  font-size: 13px;
  font-weight: 400;
  margin: 0;
  margin-right: 6px;
  color: #3a84e5;
  @media screen and (max-width: 768px) {
    font-weight: 400;
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
