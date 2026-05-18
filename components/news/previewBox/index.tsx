import React, { MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AiFillBell, AiOutlineBell } from 'react-icons/ai';
import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { CommonLayoutBox, Row } from '@components/common/commonStyles';
import { useCommentModal_Preview } from '@utils/hook/news/useCommentModal_NewsPreview';
import { commentType, NewsState, NewsType, newsTypesToKor, Preview } from '@utils/interface/news';
import { sortComment } from '@utils/interface/news/comment';
import { getDotDateForm } from '@utils/tools/date';

import { PreviewBoxLayout_Pending, PreviewBoxLayout_Published } from './previewBox.style';
// Custom Y-vote icon: peace symbol with left branch removed (Y in circle)
const YVoteIcon = ({ size = 14, filled = false }: { size?: number; filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
    />
    {filled ? (
      <g stroke="${({ theme }) => theme.colors.yvote01}" strokeWidth={2}>
        <line x1="12" y1="2" x2="12" y2="12" />
        <line x1="12" y1="12" x2="12" y2="22" />
        <line x1="12" y1="12" x2="19" y2="19" />
      </g>
    ) : (
      <g>
        <line x1="12" y1="2" x2="12" y2="12" />
        <line x1="12" y1="12" x2="12" y2="22" />
        <line x1="12" y1="12" x2="19" y2="19" />
      </g>
    )}
  </svg>
);

interface PreviewBoxProps {
  preview: Preview;
  click?: (id: number, e?: MouseEvent) => void;
  expanded?: boolean;
  showId?: boolean;
  openModalOnClick?: boolean;
}

const noopClick = () => undefined;

function PreviewBox({
  preview,
  click = noopClick,
  expanded = false,
  showId = false,
  openModalOnClick = false,
}: PreviewBoxProps) {
  const { id, title, subTitle, summary, date, comments = [], state, newsType } = preview;
  const { showCommentModal } = useCommentModal_Preview();

  const openComments = useCallback(() => {
    showCommentModal(id, comments, undefined, title, { disableCategorize: newsType === 'budget' });
  }, [id, comments, title, newsType]);

  switch (state) {
    case NewsState.Published:
      return (
        <PreviewWrapper
          href={`/news/${id}`}
          navigable={!openModalOnClick}
          onClick={(e?: MouseEvent<HTMLElement>) => {
            if (openModalOnClick) {
              openComments();
              return;
            }
            click(id, e);
            return;
          }}
        >
          <PreviewBoxLayout_Published
            expanded={expanded}
            headView={<_NewsTitle title={title} id={id} showId={showId} newsType={newsType} />}
            contentView={
              <>
                <_NewsSubTitle summary={summary} subTitle={subTitle} expanded={expanded} />
                <RowWrapper>
                  <_NewsDate date={date} />
                  <_CommentButtons
                    comments={comments}
                    openComments={(commentType) => {
                      openComments();
                    }}
                  />
                  <BottomButtonRow>
                    <_AlarmButton />
                    <_VoteButton />
                  </BottomButtonRow>
                </RowWrapper>
              </>
            }
            sideView={
              <MobileSideButtonStack>
                <_AlarmButton />
                <_VoteButton />
              </MobileSideButtonStack>
            }
          />
        </PreviewWrapper>
      );
    case NewsState.NotPublished:
    case NewsState.Pending:
      return (
        <PreviewWrapper
          href={`/adminjae/${id}`}
          navigable={!openModalOnClick}
          onClick={(e?: MouseEvent<HTMLElement>) => {
            if (openModalOnClick) {
              openComments();
              return;
            }
            click(id, e);
            return;
          }}
        >
          <PreviewBoxLayout_Pending
            expanded={expanded}
            bodyView={
              <>
                <_NewsTitle title={title} id={id} showId={showId} />
                <_CommentButtons
                  comments={comments}
                  openComments={(commentType) => {
                    openComments();
                  }}
                />
              </>
            }
            sideView={<_AlarmButton />}
          />
        </PreviewWrapper>
      );
  }
}

const _NewsTitle = ({
  title,
  id,
  showId,
  newsType,
}: {
  title: Preview['title'];
  id?: number;
  showId?: boolean;
  newsType?: NewsType;
}) => {
  const typeLabel = newsType ? newsTypesToKor(newsType) : '';
  return (
    <Title>
      {typeLabel && <TypeBadge>{typeLabel}</TypeBadge>}
      <div className="title">{title}</div>
      {showId && id !== undefined && <IdSpan>[{id}]</IdSpan>}
    </Title>
  );
};

const _NewsSubTitle = ({
  summary,
  subTitle,
  expanded = false,
}: {
  summary: Preview['summary'];
  subTitle: Preview['subTitle'];
  expanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 2);
    }
  }, [subTitle]);

  return (
    <SubTitle $expanded={expanded}>
      <span
        className="subtitle-text"
        ref={textRef}
        style={isExpanded ? { WebkitLineClamp: 'unset' } : undefined}
      >
        {subTitle || ''}
      </span>
      {isClamped && !isExpanded && (
        <MoreButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          더보기
        </MoreButton>
      )}
    </SubTitle>
  );
};

const _NewsDate = ({ date }: { date: Preview['date'] }) => {
  return <Date>{date ? <span>{getDotDateForm(date)}</span> : ''}</Date>;
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
      {sortComment([...comments]).map((ct, index) => (
        <CommentTypeIcon
          key={index}
          type={ct as commentType}
          size={14}
          onClick={() => {
            openComments(ct);
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
  navigable = true,
}: {
  href: string;
  onClick: (e?: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  navigable?: boolean;
}) => {
  if (navigable) {
    return (
      <Wrapper
        as="a"
        href={href}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </Wrapper>
    );
  }
  return (
    <Wrapper
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  text-decoration: none;
  font-family: Noto Sans KR, Helvetica, sans-serif;
  margin-bottom: 1px;
  img {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    img {
      transform: scale(1.1);
    }
  }
`;

const BottomButtonRow = styled.div`
  display: none;
  @media screen and (min-width: 769px) {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
`;

const MobileSideButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-left: 0.5px solid ${({ theme }) => theme.colors.yvote04};

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const _VoteButton = () => {
  const [active, setActive] = useState(false);
  return (
    <VoteToggle
      $active={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive((prev) => !prev);
      }}
    >
      {active ? <YVoteIcon size={14} /> : <YVoteIcon size={14} />}
    </VoteToggle>
  );
};

const VoteToggle = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-top: 0.5px solid ${({ theme }) => theme.colors.yvote04};
  padding: 0;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? '#c0392b' : theme.colors.yvote06)};

  @media screen and (max-width: 768px) {
    height: auto;
    flex: 1;
    border-top: 0.5px solid ${({ theme }) => theme.colors.yvote04};
  }

  @media screen and (min-width: 769px) {
    border-top: none;
  }
`;

const _AlarmButton = () => {
  const [active, setActive] = useState(false);
  return (
    <AlarmToggle
      $active={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive((prev) => !prev);
      }}
    >
      {active ? <AiFillBell size="14px" /> : <AiOutlineBell size="14px" />}
    </AlarmToggle>
  );
};

const AlarmToggle = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote11 : theme.colors.yvote06)};

  @media screen and (max-width: 768px) {
    height: auto;
    flex: 1;
  }
`;

const TypeBadge = styled.span`
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote08};
  background: ${({ theme }) => theme.colors.yvote03};
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 6px;
  white-space: nowrap;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 10px;
    padding: 1px 4px;
    margin-right: 4px;
  }
`;

const IdSpan = styled.span`
  flex-shrink: 0;
  margin-left: 6px;
  color: #3b82f6;
  font-weight: 500;
  font-size: 13px;
  font-family: Helvetica, sans-serif;
  white-space: nowrap;
`;

const Title = styled(Row)`
  border: 0;
  margin: 0;
  line-height: 1;
  align-items: center;

  .title {
    flex: 0 1 auto;
    width: 100%;

    color: rgb(20, 20, 20);
    text-align: left;
    padding: 0;
    padding-right: 2px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-text-size-adjust: none;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    @media screen and (max-width: 768px) {
      font-size: 14px;
      -webkit-line-clamp: 2;
    }
  }
`;

const MoreButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;
  border: none;
  background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.yvote02} 30%);
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 12px;
  padding: 0 0 0 24px;
  margin: 0;
  cursor: pointer;
  line-height: 24px;
  white-space: nowrap;

  @media screen and (max-width: 768px) {
    line-height: 20px;
    font-size: 11px;
  }
`;

const SubTitle = styled.div<{ $expanded?: boolean }>`
  -webkit-text-size-adjust: none;
  text-align: left;
  padding: 0;
  border: 0;
  font: inherit;
  font-weight: 400;
  vertical-align: baseline;
  color: rgb(80, 80, 80);
  margin: 8px 0;
  font-size: 15px;
  line-height: 24px;
  height: auto;
  min-height: 48px;
  position: relative;

  .subtitle-text {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media screen and (max-width: 768px) {
    font-size: 13px;
    line-height: 20px;
    min-height: 40px;
    color: rgb(100, 100, 100);
    font-size: 13.5px;
  }
`;

const Date = styled.div`
  flex: 0 1 auto;
  margin: 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray600};
  white-space: nowrap;
  font-weight: 400;
  line-height: 1;
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
  margin: 0;
  line-height: 1;
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
