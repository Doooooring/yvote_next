import { Keyword } from '../keywords';

export enum commentType {
  와이보트 = '와이보트',
  입법부 = '입법부',
  행정부 = '행정부',
  대통령실 = '대통령실',
  국민의힘 = '국민의힘',
  더불어민주당 = '더불어민주당',
  기타 = '기타',
  헌법재판소 = '헌법재판소',
}

export enum NewsType {
  bill = 'bill',
  constitution = 'constitution',
  executive = 'executive',
  cabinet = 'cabinet',
  diplomat = 'diplomat',
  govern = 'govern',
  debate = 'debate',
  election = 'election',
  original = 'original',
  others = 'others',
}

export const newsTypesToKor = (newsType: NewsType) => {
  switch (newsType) {
    case NewsType.bill:
      return '법률';
    case NewsType.constitution:
      return '헌법재판소';
    case NewsType.executive:
      return '시행령';
    case NewsType.cabinet:
      return '국무회의';
    case NewsType.diplomat:
      return '정상외교';
    case NewsType.govern:
      return '행정';
    case NewsType.debate:
      return '논평';
    case NewsType.election:
      return '선거';
    case NewsType.original:
      return '자체제작';
    case NewsType.others:
      return '기타';
    default:
      return '기타';
  }
};

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

export type recentArticleType = '전체' | commentType;

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  newsType: NewsType;
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
    | 'id'
    | 'order'
    | 'newsImage'
    | 'title'
    | 'subTitle'
    | 'newsType'
    | 'summary'
    | 'date'
    | 'keywords'
    | 'state'
  > {
  comments: Array<commentType>;
}
