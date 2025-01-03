import Link from 'next/link';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import ImageFallback from '@components/common/imageFallback';
import { HOST_URL } from '@url';
import { Article, commentType } from '@utils/interface/news';
import Modal from '@components/common/modal';
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
  const { id, commentType, title, comment, date } = article;

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
    return `(${year} / ${month} / ${day})`;
  };

  const formattedTitle = `${title} ${formatDate(date)}`;

  return (
    <>
      <LinkWrapper onClick={openModal}>
        <div className="wrapper">
          <div className="text-wrapper">
            <p className="title-wrapper">- {title}</p>
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
            <Image src={closeButton} width={16} height={16} alt="Close" />
          </div>
          <div className="modal-header">
            <div className="image-wrapper">
              <div className="image-box">
                <ImageFallback
                  src={`/assets/img/${commentType}.png`}
                  alt={commentType}
                  fill={true}
                />
              </div>
            </div>
            <div className="head-title">
              <p className="type-name">{formattedTitle}</p>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="modal-content">
              <div className="paragraph">
                {comment.split('$').map((comment, idx) => (
                  <p key={comment}>{comment}</p>
                ))}
              </div>
            </div>
          </div>
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

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  min-width: 680px;
  max-height: 85vh;
  overflow: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  flex: 0 0 auto;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
    padding: 3rem 1rem;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 14px;
    cursor: pointer;
  }
  .modal-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    @media screen and (max-width: 768px) {
      display: flex;
      align-items: center;
    }
    div.image-wrapper {
      display: flex;
      position: relative;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      flex: 0 0 auto;
      padding: 1.75rem;
      background-color: white;
      box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-radius: 100px;
      overflow: hidden;
      box-sizing: border-box;
      @media screen and (max-width: 768px) {
        width: 80px;
        height: 80px;
        min-width: 0px;
        float: left;
        margin-left: 10px;
      }
      .image-box {
        width: 50%;
        height: 50%;
        position: absolute;
      }
    }
    .head-title {
      font-weight: 600;
      font-size: 16px;
      padding: 0 2rem;
      @media screen and (max-width: 768px) {
        font-size: 16px;
      }
    }
  }
  div.content-wrapper {
    padding: 1.25rem 4%;
    box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.25);
    color: rgb(102, 102, 102);
    .modal-content {
      .paragraph {
        font-size : 13px;
        p {
          margin-bottom: 0.5rem;
          min-height: 10px;
        }
        @media screen and (max-width: 768px) {
          padding-left: 4%;
          font-size: 14px;
        }
      }
  }
`;
