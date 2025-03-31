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

const ModalWrapper = styled(CommonLayoutBox)`
  color: black;
  text-align: left;
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 680px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem 2rem;
  flex: 0 0 auto;
  letter-spacing: -0.5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 768px) {
    width: 99%;
    min-width: 0px;
    padding: 1.5rem 1rem;
  }
  & {
    div.close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      text-indent: 0;
      overflow: hidden;
      white-space: nowrap;
      font-size: 2rem;
      @media screen and (max-width: 768px) {
        font-size: 1.4rem;
      }
    }
    div.modal-head {
      -webkit-text-size-adjust: none;
      text-align: left;
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      box-sizing: inherit;
    }
  }
`;

const HeadTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5rem;

  p.type-name {
    padding-left: 0.5rem;
    padding-right: 0.4rem;
    font-weight: 500;
    font-size: 20px;
    @media screen and (max-width: 768px) {
      font-size: 17px;
      font-weight: 600;
    }
  }
`;

const HeadBody = styled(Row)`
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    padding-left: 0;
  }

  div.type-explain {
    color: black;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.7;
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const CommentImageWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  background-color: white;
  border-radius: 200px;
  border: 1px solid rgb(225, 225, 225);
  overflow: hidden;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
  }
  .image-box {
    width: 60%;
    height: 60%;
    position: absolute;
  }
`;

const ModalBody = styled.div`
  flex: 0 1 auto;

  height: 500px;
  margin-top: 0.5rem;
  border-top: 1.5px solid rgb(225, 225, 225);

  border-bottom: 1.5px solid #ddd;

  @media screen and (max-width: 768px) {
    height: calc(0.7 * 100vh);
  }

  div.content-wrapper {
    padding: 1rem 0;
    color: black;
    p.content-title {
      color: black;
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 1.5rem;
      @media screen and (max-width: 768px) {
        font-weight: 600;
      }
    }
    div.content-body {
      font-weight: 400;
      font-size: 15px;
    }

    p.content_line {
      color: black;
      margin-bottom: 0.5rem;
      min-height: 10px;
    }
  }
`;

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  overflow-y: scroll;
`;

const PageButtonWrapper = styled(Row)`
  justify-content: end;
  gap: 12px;
  padding-top: 0.5rem;
`;

const TextButton = styled(CommonLayoutBox)`
  padding: 0.4rem 1.2rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;
