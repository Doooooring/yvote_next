import { commentType } from '@utils/interface/news';

export const getOrder = (comment: commentType) => {
  switch (comment) {
    case commentType.와이보트:
      return 7;
    case commentType.헌법재판소:
      return 6;
    case commentType.청와대:
      return 5;
    case commentType.대통령실:
      return 4.95;
    // Conservative lineage shares slot 4 (oldest era at the bottom of the slot).
    case commentType.국민의힘:
      return 4.5;
    case commentType.미래통합당:
      return 4.4;
    case commentType.자유한국당:
      return 4.3;
    case commentType.새누리당:
      return 4.2;
    case commentType.한나라당:
      return 4.1;
    // Progressive lineage shares slot 3.
    case commentType.더불어민주당:
      return 3.5;
    case commentType.새정치민주연합:
      return 3.4;
    case commentType.민주통합당:
      return 3.3;
    case commentType.민주당:
      return 3.2;
    case commentType.통합민주당:
      return 3.1;
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
