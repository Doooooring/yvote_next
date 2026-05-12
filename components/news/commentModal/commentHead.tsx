import styled from 'styled-components';

import CommentTypeIcon from '@components/common/CommentTypeIcon';
import { commentType } from '@utils/interface/news';

interface HeadTitleProps {
  comment: commentType;
}

export default function CommentHead({ comment }: HeadTitleProps) {
  return (
    <HeadTitle>
      <CommentTypeIcon type={comment} size={16} />
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
