import { Row } from '@components/common/commonStyles';
import ImageFallback from '@components/common/imageFallback';
import { useCommentModal } from '@utils/hook/news/useCommentModal';
import { Link } from '@utils/hook/useRouter';
import { commentType, NewsState, Preview } from '@utils/interface/news';
import { commentTypeImg } from '@utils/interface/news/comment';
import { getDateDiff, getTimeDiffBeforeToday, getToday } from '@utils/tools/date';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { PreviewBoxLayout_Pending, PreviewBoxLayout_Published } from './previewBox.style';

interface PreviewBoxProps {
  preview: Preview;
  click?: (id: number) => void;
  img?: string;
}
function PreviewBox({ preview, img, click = () => {} }: PreviewBoxProps) {
  const { id, title, subTitle, summary, date, newsImage, keywords, comments, state } = preview;
  const { showCommentModal } = useCommentModal();

  const openComments = useCallback(
    (commentType: commentType) => {
      showCommentModal(id, commentType);
    },
    [id, showCommentModal],
  );

  switch (state) {
    case NewsState.Published:
    case NewsState.NotPublished:
      return (
        <PreviewWrapper
          href={`/news/${id}`}
          onClick={() => {
            click(id);
            return;
          }}
        >
          <PreviewBoxLayout_Published
            imgView={<ImageFallback src={img ?? ``} alt={title} fill={true} suspense={true} />}
            headView={<_NewsTitle title={title} />}
            contentView={
              <>
                <_NewsSubTitle summary={summary} subTitle={subTitle} />
                <RowWrapper>
                  <_NewsDate date={date} />
                  <_CommentButtons
                    comments={comments}
                    openComments={(commentType) => {
                      openComments(commentType);
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
            click(id);
          }}
        >
          <PreviewBoxLayout_Pending
            bodyView={
              <>
                <_NewsTitle title={title} />
                <_CommentButtons
                  comments={comments}
                  openComments={(commentType) => {
                    openComments(commentType);
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
  return (
    <SummaryButtons>
      {comments.map((commentType, index) => (
        <SummaryButton
          key={index}
          image={commentTypeImg(commentType)}
          onClick={(e) => {
            e.stopPropagation();
            openComments(commentType);
          }}
        />
      ))}
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
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <>
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault();
          console.log(e.target);
          console.log(e.currentTarget);
          onClick();
        }}
      >
        <Wrapper>{children}</Wrapper>
      </Link>
    </>
  );
};

const Prefetch = styled(Link)`
  width: '0.1px';
  height: '0.1px';
`;

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

const SummaryButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 0px;
`;

const SummaryButton = styled.button<{ image: string }>`
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
