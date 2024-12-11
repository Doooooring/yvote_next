import ImageFallback from '@components/common/imageFallback';
import { loadingImg } from '@public/assets/resource';
import KeywordRepository from '@repositories/keywords';
import { HOST_URL } from '@url';
import { Preview } from '@utils/interface/news';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import PreviewBoxLayout from './previewBox.style';

interface PreviewBoxProps {
  preview: Preview;
  click: (id: number) => void;
}
const SuspenseImage = dynamic(() => import('@components/common/suspenseImage'), { ssr: false });

export default function PreviewBox({ preview, click }: PreviewBoxProps) {
  const navigate = useRouter();
  const { id, title, summary, newsImage, keywords, state } = preview;

  return (
    <Wrapper>
      <PreviewBoxLayout
        onClick={() => {
          click(id);
        }}
        imgView={<SuspenseImage src={newsImage} alt={title} fill={true} suspense={true} />}
        headView={
          <>
            <Title>{title}</Title>
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
            <Summary dangerouslySetInnerHTML={{ __html: summary }} />
            <Keywords>
              {keywords?.map(({ id, keyword }) => {
                return (
                  <Keyword
                    key={keyword}
                    onClick={() => {
                      navigate.push(`/keywords/${keyword}`);
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

const Title = styled.p`
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
`;

const Summary = styled.div`
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
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  margin-right: 6px;
  color: #3a84e5;
`;

const Wrapper = styled.div`
  filter: saturate(80%);

  transition: filter 0.2s ease;
  &:hover {
    filter: saturate(130%);
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
