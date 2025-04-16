import { Row } from '@components/common/commonStyles';
import ImageFallback from '@components/common/imageFallback';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { Preview } from '@utils/interface/news';
import { getDateDiff, getTimeDiffBeforeToday, getToday } from '@utils/tools/date';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Link } from '../../../utils/hook/useRouter';
import PreviewBox2Layout from './previewBox2.style';

interface PreviewBox2Props {
  preview: Preview;
}
function PreviewBox2({ preview }: PreviewBox2Props) {
  const { router } = useRouter();
  const { id, title, subTitle, summary, date, newsImage, keywords, state } = preview;

 const [activeSummary, setActiveSummary] = useState(0);
  const dummySummaries = [
    summary,
    "summary[1]",
    "summary[2]",
    "summary[3]",
    "summary[4]",
    "summary[5]",
    "summary[6]",
  ];
  const dummybuttonImages = [
    '/assets/img/와이보트.png',
    '/assets/img/국민의힘.png',
    '/assets/img/더불어민주당.png',
    '/assets/img/대통령실.png',
    '/assets/img/행정부.png',
    '/assets/img/헌법재판소.png',
    '/assets/img/기타.png',
  ]; // 순서는 기존 논평 순서, 자료 'or' 본문 있는 것만

  return (
    <Wrapper>
      <PreviewBox2Layout
        headView={
          <Title>
            <div className="title">{title}</div>
            <SummaryButtons>
          {dummySummaries.map((_, index) => (
            <SummaryButton
              key={index}
              active={index === activeSummary}
              image={dummybuttonImages[index]}
              onClick={() => setActiveSummary(index)}
            />
          ))}
        </SummaryButtons>
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
    padding-right: 6px;
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

const SummaryButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 0px;
  align-items : center;
`;

const SummaryButton = styled.button<{ active: boolean; image: string }>`
  width: 12px;
  height: 12px;
  border-radius: 0;
  border: none;
  background-color: transparent;
  background-image: url(${({ image }) => image});
  background-size: 12px 12px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
`; // 여기선 이거 클릭하면 논평리스트 뜨기