import { category } from '@utils/interface/keywords';

export const categoryImgUrl = (c: 'recent' | category) => {
  return `/assets/img/${c}.png`;
};

export const categoryKoreanName = (c: 'recent' | category) => {
  switch (c) {
    case 'recent':
      return '최근 업데이트';
    case 'politics':
      return '정치 / 이념';
    case 'economics':
      return '경제';
    case 'social':
      return '사회 / 가치관';
    case 'organization':
      return '기관 / 단체';
    default:
      return '...';
  }
};
