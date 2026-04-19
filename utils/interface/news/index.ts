import { Keyword } from '../keywords';

export enum commentType {
  와이보트 = '와이보트',
  입법부 = '입법부',
  행정부 = '행정부',
  청와대 = '청와대',
  국민의힘 = '국민의힘',
  더불어민주당 = '더불어민주당',
  기타 = '기타',
  헌법재판소 = '헌법재판소',
}

export enum NewsType {
  bill = 'bill',
  specialcounsel = 'specialcounsel',
  northkorea = 'northkorea',
  constitution = 'constitution',
  executive = 'executive',
  cabinet = 'cabinet',
  diplomat = 'diplomat',
  govern = 'govern',
  debate = 'debate',
  election = 'election',
  weekly = 'weekly',
  investigation = 'investigation',
  budget = 'budget',
  others = 'others',
  //헌재 종류별 만들 것
}

export const newsTypesToKor = (newsType: NewsType) => {
  switch (newsType) {
    case NewsType.bill:
      return '법률';
    case NewsType.constitution:
      return '헌재';
    case NewsType.executive:
      return '시행령';
    case NewsType.cabinet:
      return '국무';
    case NewsType.diplomat:
      return '외교';
    case NewsType.govern:
      return '행정';
    case NewsType.debate:
      return '논평';
    case NewsType.election:
      return '선거';
    case NewsType.weekly:
      return '주간';
    case NewsType.specialcounsel:
      return '특검';
    case NewsType.northkorea:
      return '북한';
    case NewsType.investigation:
      return '조사';
    case NewsType.budget:
      return '예산';
    case NewsType.others:
      return '기타';
    default:
      return '기타';
  }
};

export const newsTypesToKorFull = (newsType: NewsType) => {
  switch (newsType) {
    case NewsType.cabinet:
      return '국무회의';
    case NewsType.diplomat:
      return '정상외교';
    case NewsType.investigation:
      return '국정조사';
    case NewsType.constitution:
      return '헌법재판소';
    case NewsType.specialcounsel:
      return '특별검사';
    default:
      return newsTypesToKor(newsType);
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
  date: string;
  title: string;
  commentType: commentType;
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
  date: string;
  news: Partial<News>;
}

export interface Article
  extends Pick<Comment, 'id' | 'commentType' | 'title' | 'date'> {
  comment?: string;
  news: {
    id: number;
    title?: string;
    state: NewsState;
  };
}

export type recentArticleType = '전체' | commentType;

export interface PartyVote {
  party: string;
  for: number;
  against: number;
  abstain: number;
  absent: number;
}

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  newsType: NewsType;
  summary: string;
  summaries: Array<NewsSummary>;
  agendaList?: string;
  speechContent?: string;
  proDebate?: string;
  conDebate?: string;
  billAmendment?: string;
  billSummary?: string;
  billDetail?: string;
  billVoteResult?: string;
  billVoteTotal?: number;
  billVoteByParty?: PartyVote[];
  date?: string;
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
