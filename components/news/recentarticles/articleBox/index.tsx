import { CommonLayoutBox, Row } from '@components/common/commonStyles';
import IsShow from '@components/common/isShow';
import CommentModal from '@components/news/commentModal/modal_newspage';
import { Article, commentType } from '@utils/interface/news';
import { RgbToRgba } from '@utils/tools';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { commentTypeColor } from '../../../../utils/interface/news/commen';

interface ArticlePartial extends Partial<Article> {
  id: number;
  commentType: commentType;
}

interface ArticleBoxProps {
  article: Article;
}

export default function ArticleBox({ article }: ArticleBoxProps) {
  const { news, id, commentType, title, comment, date } = article;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const formatDate = (d: Date): string => {
    const date = new Date(d);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <>
      <LinkWrapper onClick={openModal}>
        <div className="wrapper">
          <div className="text-wrapper">
            <div className="writer-wrapper">
              <p
                style={{
                  color: commentTypeColor(commentType),
                  backgroundColor: `${RgbToRgba(commentTypeColor(commentType)!, 0.1)}`,
                }}
              >
                {commentType}
              </p>
            </div>
            <LinkTitleWrapper>
              <p className="title">{title}</p>
              <p className="date">{formatDate(date)}</p>
            </LinkTitleWrapper>
          </div>
        </div>
      </LinkWrapper>
      <IsShow state={isModalOpen}>
        <CommentModal
          state={isModalOpen}
          close={closeModal}
          newsId={news.id}
          commentType={commentType}
          title={title}
          date={date}
          comment={comment}
        />
      </IsShow>
    </>
  );
}

const LinkWrapper = styled.div`
  display: block;
  text-decoration: none;
  width: 100%;
  cursor: pointer;

  .text {
    transition: color 0.3s ease;
  }

  &:hover {
    .text {
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  .text-wrapper {
    width: 100%;
    height: 100%;

    justify-content: start;
    align-items: center;
    color: rgb(50, 50, 50);
    vertical-align: baseline;
    display: flex;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    animation: back-blink 0.4s ease-in-out forwards;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    .writer-wrapper {
      width: 85px;
      flex-shrink: 0;
      text-align: left;
      p {
        width: 72px;
        font-size: 11px;
        line-height: 1;
        font-weight: 500;
        padding: 0.4rem 0rem;
        flex-shrink: 0;
        flex-grow: 0;
        color: grey;
        text-align: center;
        border-radius: 6px;
      }
      @media screen and (max-width: 768px) {
        width: 75px;
        p {
          font-size: 10px;
          width: 65px;
        }
      }
    }
  }
`;

const LinkTitleWrapper = styled(Row)`
  width: 100%;
  flex-shrink: 1;
  overflow: hidden;
  gap: 8px;

  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: rgb(120, 120, 120);

  @media screen and (max-width: 768px) {
    font-size: 13px;
  }

  .title {
    flex: 0 1 auto;
    min-width: 0;
    white-space: nowrap;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    flex: 0 0 30px;
    font-weight: 400;
    font-size: 11px;
    color: rgb(120, 120, 120);
  }
`;
