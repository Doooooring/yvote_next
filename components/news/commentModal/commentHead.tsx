import ImageFallback from '@components/common/imageFallback';
import { commentType } from '@utils/interface/news';
import { typeCheckImg } from '@utils/interface/news/commen';
import styled from 'styled-components';


interface HeadTitleProps {
  comment: commentType;
}

export default function CommentHead({ comment }: HeadTitleProps) {
  return (
    <HeadTitle>
      <CommentImageWrapper>
        <div className="image-box">
          <ImageFallback src={`/assets/img/${comment}.png`} alt={comment!} fill={true} />
        </div>
      </CommentImageWrapper>
      <p className="type-name">{comment}</p>
      <ImageFallback src={typeCheckImg(comment!)} alt="check-img" width="10" height="10" />
    </HeadTitle>
  );
}

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
