import { Row } from '@components/common/commonStyles';
import { useCommentModal_RecentArticle } from '@utils/hook/news/useCommentModal_RecentArticle';
import { Article, commentType } from '@utils/interface/news';
import { RgbToRgba } from '@utils/tools';
import { useCallback } from 'react';
import styled from 'styled-components';
import { commentTypeColor, commentTypeImg } from '../../../../utils/interface/news/comment';

interface ArticlePartial extends Partial<Article> {
  id: number;
  commentType: commentType;
}

interface ArticleBoxProps {
  article: Article;
  showLogo?: boolean;
}

export default function ArticleBox({ article, showLogo = true }: ArticleBoxProps) {
  const { news, id, commentType, title, comment, date } = article;

  const { showCommentModal } = useCommentModal_RecentArticle();

  const openModal = useCallback(() => {
    showCommentModal(article);
  }, [showCommentModal, article]);

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
            <div className={`writer-wrapper ${showLogo ? '' : 'hidden'}`}>
              <p
                style={{
                  color: commentTypeColor(commentType),
                  backgroundColor: `${RgbToRgba(commentTypeColor(commentType)!, 0.1)}`,
                }}
              >
                <span
                  className="logo"
                  style={{
                    backgroundImage: `url(${commentTypeImg(commentType)})`,
                  }}
                />
              </p>
            </div>
            <LinkTitleWrapper>
              <p className="title">{title}</p>
              <p className="date">{formatDate(date)}</p>
            </LinkTitleWrapper>
          </div>
        </div>
      </LinkWrapper>
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
    .title {
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
      width: 40px;
      flex-shrink: 0;
      text-align: center;
      &.hidden {
        width: 0;
        padding: 0;
        margin: 0;
        display: none;
      }
      p {
        width: 32px;
        height: 32px;
        font-size: 11px;
        line-height: 1;
        font-weight: 500;
        padding: 0;
        flex-shrink: 0;
        flex-grow: 0;
        color: grey;
        text-align: center;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo {
        width: 18px;
        height: 18px;
        background-size: 14px 14px;
        background-position: center;
        background-repeat: no-repeat;
        display: inline-block;
      }
      @media screen and (max-width: 768px) {
        width: 36px;
        p {
          font-size: 10px;
          width: 28px;
          height: 28px;
        }
        .logo {
          width: 16px;
          height: 16px;
          background-size: 12px 12px;
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
