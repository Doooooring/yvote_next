import { commentType } from '@utils/interface/news';

export const getOrder = (comment: commentType) => {
  switch (comment) {
    case commentType.와이보트:
      return 7;
    case commentType.헌법재판소:
      return 6;
    case commentType.대통령실:
      return 5;
    case commentType.국민의힘:
      return 4;
    case commentType.더불어민주당:
      return 3;
    case commentType.행정부:
      return 2;
    case commentType.기타:
      return 1;
    default:
      return 0;
  }
};

// 코멘트 순서 정렬
export const sortComment = (comments: commentType[]) => {
  return comments.sort((a, b) => {
    const aOrder = getOrder(a);
    const bOrder = getOrder(b);
    return bOrder - aOrder;
  });
};
