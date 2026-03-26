import ImageFallback from '@components/common/imageFallback';
import { commentType } from '@utils/interface/news';
import { commentTypeImg } from '@utils/interface/news/comment';
import styled from 'styled-components';

interface HeadTitleProps {
  comment: commentType;
}

export default function CommentHead({ comment }: HeadTitleProps) {
  return (
    <HeadTitle>
      <CommentImageWrapper>
        <div className="image-box">
          <ImageFallback src={commentTypeImg(comment)} alt={comment!} fill={true} />
        </div>
      </CommentImageWrapper>
      <p className="type-name">{comment}</p>
    </HeadTitle>
  );
}

const HeadTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;

  p.type-name {
    padding-left: 0.4rem;
    padding-right: 0.3rem;
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    @media screen and (max-width: 768px) {
      font-size: 13px;
      font-weight: 600;
    }
  }
`;

const CommentImageWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  background-color: ${({ theme }) => theme.colors.yvote01};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.yvote03};
  overflow: hidden;
  box-sizing: border-box;

  .image-box {
    width: 60%;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
