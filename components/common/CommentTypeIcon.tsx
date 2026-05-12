import styled from 'styled-components';

import { commentType } from '@utils/interface/news';
import { commentTypeImg } from '@utils/interface/news/comment';

interface CommentTypeIconProps {
  type: commentType;
  size?: number;
  onClick?: () => void;
}

export default function CommentTypeIcon({ type, size = 16, onClick }: CommentTypeIconProps) {
  return (
    <Icon
      src={commentTypeImg(type)}
      alt={type}
      $size={size}
      $clickable={!!onClick}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              (e.nativeEvent as any).stopImmediatePropagation?.();
              onClick();
            }
          : undefined
      }
    />
  );
}

const Icon = styled.img<{ $size: number; $clickable: boolean }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  object-fit: contain;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;
