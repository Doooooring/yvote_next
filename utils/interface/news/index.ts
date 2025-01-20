// export enum Press {
//   조선 = '조선',
//   중앙 = '동아',
//   한겨레 = '한겨레',
//   한경 = '한경',
//   매경 = '매경',
//   동아 = '동아',
// }

import { Keyword } from '../keywords';

export enum commentType {
  전략가 = '전략가',
  지도자 = '지도자',
  예술가 = '예술가',
  감시자 = '감시자',
  운영자 = '운영자',
  공화주의자 = '공화주의자',
  관찰자 = '관찰자',
  개혁가 = '개혁가',
  이론가 = '이론가',
  자유주의자 = '자유주의자',
  더불어민주당 = '더불어민주당',
  국민의힘 = '국민의힘',
  대통령실 = '대통령실',
  행정부 = '행정부',
  헌법재판소 = '헌법재판소',
  와이보트 = '와이보트',
  기타 = '기타',
}

export enum CommentQualification {
  YVOTE = 0,
  YVOTETYPE = 1,
  PUBLIC = 2,
  ETC = 3,
}

export interface Timeline {
  id: number;
  date: Date;
  title: string;
}

export interface Article {
  id: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: Date;
  newsId: number;
  news: News;
}

export interface Comment {
  id: number;
  order: number;
  commentType: commentType;
  title: string;
  comment: string;
  url?: string;
  date: Date;
}

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  summary: string;
  keywords: Array<Keyword>;
  newsImage: string;
  isPublished: boolean;
  state: boolean;
  timeline: Array<Timeline>;
  opinionLeft: string;
  opinionRight: string;
  comments: Array<Comment>;
  votes: {
    left: number;
    right: number;
    none: number;
  };
}

export interface NewsInView extends Omit<News, 'keywords' | 'comments' | ''> {
  keywords: Array<{ id: number; keyword: string }>;
  comments: Array<commentType>;
}

export interface Preview
  extends Pick<
    News,
    'id' | 'order' | 'newsImage' | 'title' | 'subTitle' | 'summary' | 'keywords' | 'state'
  > {}
