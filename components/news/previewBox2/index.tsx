import { Row } from '@components/common/commonStyles';
import ImageFallback from '@components/common/imageFallback';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { Preview } from '@utils/interface/news';
import { getDateDiff, getTimeDiffBeforeToday, getToday } from '@utils/tools/date';
import React from 'react';
import styled from 'styled-components';
import { Link } from '../../../utils/hook/useRouter';
import PreviewBox2Layout from './previewBox2.style';

interface PreviewBox2Props {
  preview: Preview;
}
function PreviewBox2({ preview }: PreviewBox2Props) {
  const { router } = useRouter();
  const { id, title, subTitle, summary, date, newsImage, keywords, state } = preview;

  return (
    <Wrapper>
      <PreviewBox2Layout
        headView={
          <Title>
            <div className="title">{title}</div>
          </Title>
        }
      />
    </Wrapper>
  );
}

export default React.memo(PreviewBox2, (prevProps, nextProps) => {
  return prevProps.preview.id === nextProps.preview.id;
});

const Wrapper = styled.div`
  filter: saturate(80%);
  width: 100%;
  text-decoration: none;
  font-family: Noto Sans KR, Helvetica, sans-serif;
  transition: filter 0.2s ease;
  margin-bottom: 1px;
  img {
    transition: transform 0.3s ease-in-out;
  }
`;

const Title = styled(Row)`
  border: 0;
  margin: 0;

  .title {
    flex: 0 1 auto;
    width: 100%;

    color: rgb(20, 20, 20);
    text-align: left;
    padding: 0;
    padding-right: 2px;
    font-size: 14px;
    font-weight: 400;
    display: -webkit-box;
    -webkit-text-size-adjust: none;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
