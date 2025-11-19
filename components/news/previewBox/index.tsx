import { CommonIconButton, CommonLayoutBox, Row } from '@components/common/commonStyles';
import ImageFallback from '@components/common/imageFallback';
import { useCommentModal_Preview } from '@utils/hook/news/useCommentModal_NewsPreview';
import Link from 'next/link';
import { commentType, NewsState, Preview } from '@utils/interface/news';
import { commentTypeImg } from '@utils/interface/news/comment';
import { getDateDiff, getTimeDiffBeforeToday, getToday } from '@utils/tools/date';
import React, { MouseEvent, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';
import { PreviewBoxLayout_Pending, PreviewBoxLayout_Published } from './previewBox.style';

interface PreviewBoxProps {
  preview: Preview;
  click?: (id: number, e?: MouseEvent) => void;
}
function PreviewBox({ preview, click = () => {} }: PreviewBoxProps) {
  const { id, title, subTitle, summary, date, newsImage, keywords, comments = [], state } = preview;
  const { showCommentModal } = useCommentModal_Preview();

  const openComments = useCallback(() => {
    showCommentModal(id, comments);
  }, [id, comments]);

  switch (state) {
    case NewsState.Published:
    case NewsState.NotPublished:
      return (
        <PreviewWrapper
          href={`/news/${id}`}
          onClick={(e?: MouseEvent<HTMLDivElement>) => {
            click(id, e);
            return;
          }}
        >
          <PreviewBoxLayout_Published
            headView={<_NewsTitle title={title} />}
            contentView={
              <>
                <_NewsSubTitle summary={summary} subTitle={subTitle} />
                <RowWrapper>
                  <_NewsDate date={date} />
                  <_CommentButtons
                    comments={comments}
                    openComments={(commentType) => {
                      openComments();
                    }}
                  />
                </RowWrapper>
              </>
            }
          />
        </PreviewWrapper>
      );
    case NewsState.Pending:
      return (
        <PreviewWrapper
          href={`/news/${id}`}
          onClick={() => {
            openComments();
            return;
          }}
        >
          <PreviewBoxLayout_Pending
            bodyView={
              <>
                <_NewsTitle title={title} />
                <_CommentButtons
                  comments={comments}
                  openComments={(commentType) => {
                    openComments();
                  }}
                />
              </>
            }
          />
        </PreviewWrapper>
      );
  }
}

const _NewsTitle = ({ title }: { title: Preview['title'] }) => {
  return (
    <Title>
      <div className="title">{title}</div>
    </Title>
  );
};

const _NewsSubTitle = ({
  summary,
  subTitle,
}: {
  summary: Preview['summary'];
  subTitle: Preview['subTitle'];
}) => {
  return <SubTitle>{subTitle == '' ? summary : subTitle}</SubTitle>;
};

const _NewsDate = ({ date }: { date: Preview['date'] }) => {
  return (
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
  );
};

const _CommentButtons = ({
  comments,
  openComments,
}: {
  comments: Preview['comments'];
  openComments: (commentType: commentType) => void;
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <SummaryButtons>
      {comments.slice(0, 3).map((commentType, index) => (
        <SummaryButton
          key={index}
          zindex={10 - index}
          image={commentTypeImg(commentType)}
          onClick={(e) => {
            e.stopPropagation();
            (e.nativeEvent as any).stopImmediatePropagation?.();
            openComments(commentType);
          }}
        />
      ))}
      <span style={{ fontSize: '12px' }}>{comments.length > 3 && `+${comments.length - 3}`}</span>
    </SummaryButtons>
  );
};

export default React.memo(PreviewBox, (prevProps, nextProps) => {
  return prevProps.preview.id === nextProps.preview.id;
});

const PreviewWrapper = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: (e?: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}) => {
  return (
    <>
      <Wrapper
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        <Link href={href}>
          <></>
        </Link>
      </Wrapper>
    </>
  );
};

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

const SummaryButtonWrapper = styled(Row)`
  gap: 6px;
`;

const PendingHead = styled(CommonLayoutBox)`
  width: 16px;
  height: 16px;
  font-size: 12px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.gray600};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SummaryButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
`;

const SummaryButton = styled(CommonIconButton)<{
  image: string;
  zindex: number;
}>`
  margin-left: -8px;

  &:first-child {
    margin-left: 0px;
  }
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: white !important;
  background-image: url(${({ image }) => image});
  background-size: 16px 16px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  z-index: ${({ zindex }) => zindex};
`; // 여기선 이거 클릭해도 그냥 프리뷰 클릭한 것처럼 뉴스 디테일로 이동
