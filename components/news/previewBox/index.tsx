import { Row } from '@components/common/commonStyles';
import ImageFallback from '@components/common/imageFallback';
import { useRouter } from '@utils/hook/useRouter/useRouter';
import { Preview } from '@utils/interface/news';
import { getDateDiff, getTimeDiffBeforeToday, getToday } from '@utils/tools/date';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Link } from '../../../utils/hook/useRouter';
import PreviewBoxLayout from './previewBox.style';

interface PreviewBoxProps {
  preview: Preview;
  click: (id: number) => void;
  img?: string;
}
function PreviewBox({ preview, img, click }: PreviewBoxProps) {
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
    <Wrapper
      href={`/news/${id}`}
      onClick={(e) => {
        e.preventDefault();
        click(id);
      }}
    >
      <PreviewBoxLayout
        onClick={() => {}}
        imgView={<ImageFallback src={img ?? ``} alt={title} fill={true} suspense={true} />}
        headView={
          <Title>
            <div className="title">{title}</div>
          </Title>
        }
        contentView={
          <>
            <SubTitle>{subTitle == '' ? summary : subTitle}</SubTitle>
            <RowWrapper>
              <Date>
                {date ? (
                  <>
                    <span className={getDateDiff(getToday(), date) < 7 ? 'diff' : ''}>
                      {getTimeDiffBeforeToday(date)}
                    </span>
                  </>
                ) : (
                  ''
                )}
              </Date>
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
            </RowWrapper>
            {/* <Keywords>
              {keywords?.map(({ id, keyword }) => {
                return (
                  <Keyword
                    key={keyword}
                    onClick={() => {
                      router.push(`/keywords/${String(id)}`);
                    }}
                  >
                    {`#${keyword}`}
                  </Keyword>
                );
              })}
              <p className="keyword"></p>
            </Keywords> */}
          </>
        }
      />
    </Wrapper>
  );
}

export default React.memo(PreviewBox, (prevProps, nextProps) => {
  return prevProps.preview.id === nextProps.preview.id;
});

const Wrapper = styled(Link)`
  filter: saturate(80%);
  width: 100%;
  text-decoration: none;
  font-family: Noto Sans KR, Helvetica, sans-serif;
  transition: filter 0.2s ease;
  margin-bottom: 1px;
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
    font-size: 15px;
    font-weight: 500;
    display: -webkit-box;
    -webkit-text-size-adjust: none;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SubTitle = styled.div`
  -webkit-text-size-adjust: none;
  text-align: left;
  padding: 0;
  border: 0;
  font: inherit;
  font-weight: 400;
  vertical-align: baseline;
  color: rgb(80, 80, 80);
  margin: 0;
  margin-bottom: 6px;
  font-size: 15px;
  line-height: 20px;
  height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ::after {
    content: '';
    display: block;
    height: 20px;
    background-color: white;
  }
  @media screen and (max-width: 768px) {
    color: rgb(100, 100, 100);
    font-size: 13.5px;
  }
`;

const Date = styled.div`
  flex: 0 1 auto;
  margin-bottom: 5px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray600};
  white-space: nowrap;
  font-weight: 400;
  line-height: 1;
  align-self: center;

  .diff {
    color: ${({ theme }) => theme.colors.yvote05};
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

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const SummaryButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 0px;
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
`; // 여기선 이거 클릭해도 그냥 프리뷰 클릭한 것처럼 뉴스 디테일로 이동