import Link from 'next/link';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Article, commentType } from '@utils/interface/news';
import Modal from '@components/common/modal';
import {
  typeCheckImg,
  typeExplain,
  typeToShow,
} from '../../../news/commentModal/commentModal.resource';
import closeButton from '@images/close_icon.png';
import { CommonLayoutBox } from '@components/common/commonStyles';

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
    return `(${month}/${day})`;
  };

  const formattedTitle = `${title} ${formatDate(date)}`;

  return (
    <>
      <LinkWrapper onClick={openModal}>
        <div className="wrapper">
          <div className="text-wrapper">
            <p className="title-wrapper">- {formattedTitle}</p>
            <p className="writer-wrapper">{commentType}</p>
          </div>
        </div>
      </LinkWrapper>
      <Modal state={isModalOpen} outClickAction={closeModal}>
        <ModalWrapper>
          <div
            className="close-button"
            onClick={() => {
              closeModal();
            }}
          >
            &times;
          </div>
          <HeadBody>
            <HeadTitle>
              <CommentImageWrapper>
                <div className="image-box">
                  <ImageFallback src={`/assets/img/${commentType}.png`} alt={comment} fill={true} />
                </div>
              </CommentImageWrapper>
              <p className="type-name">{typeToShow(commentType)}</p>
              <ImageFallback
                src={typeCheckImg(commentType)}
                alt="check-img"
                width="10"
                height="10"
              />
              <a className="news-button" href={`/news/${news.id}`}>
                뉴스 보기
              </a>
            </HeadTitle>
          </HeadBody>
          <ModalBody>
            <div className="content-wrapper">
              <p className="content-title">{article.title}</p>
              {/* <p className="content-title">
                  {article?.date ? getDotDateForm(article.date) : ''}
                </p> */}
              <div className="content-body">
                {article.comment.split('$').map((comment, idx) => {
                  return (
                    <p key={idx} className="content_line">
                      {comment}
                    </p>
                  );
                })}
              </div>
            </div>
          </ModalBody>
        </ModalWrapper>
      </Modal>
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
    overflow: hidden;
    width: 100%;
  }
  .text-wrapper {
    justify-content: start;
    align-items: center;
    height: 100%;
    color: rgb(50, 50, 50);
    padding-top: 0.1rem;
    padding-left: 10px;
    vertical-align: baseline;
    display: flex;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    .title-wrapper {
      text-align: left;
      font-size: 0.9rem;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .writer-wrapper {
      text-align: left;
      font-size: 0.8rem;
      font-weight: 500;
      margin-left: 10px;
      width: 80px;
      flex-shrink: 0;
      flex-grow: 0;
      color: grey;
    }
  }
`;

const ModalWrapper = styled(CommonLayoutBox)`
  color: black;
  text-align: left;
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 680px;
  max-height: 80vh;
  overflow: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 3rem 3rem;
  flex: 0 0 auto;
  letter-spacing: -0.5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
    max-height: 70vh;
    padding: 3rem 1rem;
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
  .news-button {
    display: inline-block;
    text-decoration: none;
    background-color: transparent;
    color: #333;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 15px;
  }
`;

const HeadBody = styled.div`
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
  margin-top: 1rem;
  border-top: 1.5px solid rgb(225, 225, 225);
  div.modal-list {
    display: flex;
    flex-direction: column;
    position: relative;
    div.body-block {
      height: 60px;
      padding-left: 1rem;
      padding-right: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      box-sizing: border-box;
      border-bottom: 1.5px solid #ddd;
      span {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 500;
        color: rgb(50, 50, 50);
      }
    }
  }
  div.page-button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 12px;
    padding-top: 0.5rem;
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
