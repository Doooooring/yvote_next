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

export interface NewsSummary {
  id?: number | null;
  summary: string;
  commentType: commentType;
  newsId: number;
}

export enum NewsState {
  Published = '0',
  Pending = '1',
  NotPublished = '2',
}

export const NewsStateKor = (state: NewsState) => {
  switch (state) {
    case NewsState.Published:
      return '발행 완료';
    case NewsState.Pending:
      return '발행 대기';
    case NewsState.NotPublished:
      return '발행 전';
  }
};

export interface Comment {
  id: number;
  order: number;
  commentType: commentType;
  title: string;
  comment: string;
  url?: string;
  date: Date;
  news: Partial<News>;
}

export interface Article
  extends Pick<Comment, 'id' | 'commentType' | 'title' | 'comment' | 'date'> {
  news: {
    id: number;
    state: NewsState;
  };
}

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  summary: string;
  summaries: Array<NewsSummary>;
  date?: Date;
  keywords: Array<Keyword>;
  newsImage: string;
  isPublished: boolean;
  state: NewsState;
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
    'id' | 'order' | 'newsImage' | 'title' | 'subTitle' | 'summary' | 'date' | 'keywords' | 'state'
  > {
  comments: Array<commentType>;
}
