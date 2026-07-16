export enum commentType {
  와이보트 = '와이보트',
  입법부 = '입법부',
  행정부 = '행정부',
  청와대 = '청와대',
  // 윤석열 정부 시기 (2022-05-10 ~ 2025-12-29) 한정 명칭. 외부 시기는 청와대.
  대통령실 = '대통령실',
  국민의힘 = '국민의힘',
  더불어민주당 = '더불어민주당',
  // Historical lineage names — see yvote_automation party_history.py.
  // Backfill scrapes for past dates emit these instead of the modern
  // canonical names.
  한나라당 = '한나라당',
  새누리당 = '새누리당',
  자유한국당 = '자유한국당',
  미래통합당 = '미래통합당',
  통합민주당 = '통합민주당',
  민주당 = '민주당',
  민주통합당 = '민주통합당',
  새정치민주연합 = '새정치민주연합',
  기타 = '기타',
  헌법재판소 = '헌법재판소',
}

// Set of commentTypes considered "current" — used by /news recent
// articles to filter out historical-only buckets from the category
// tabs (per owner direction). Past-name commentTypes still render
// inside individual news rows where they exist as real DB rows.
export const CURRENT_COMMENT_TYPES: ReadonlySet<commentType> = new Set([
  commentType.와이보트,
  commentType.입법부,
  commentType.행정부,
  // Whichever presidential-office name is current right now (the
  // current era is 청와대 again as of 2025-12-29). 대통령실 is a
  // historical-only commentType from /news recent articles' POV.
  commentType.청와대,
  commentType.국민의힘,
  commentType.더불어민주당,
  commentType.기타,
  commentType.헌법재판소,
]);

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
  economics = 'economics',
  plenary = 'plenary',
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
    case NewsType.economics:
      return '경제';
    case NewsType.plenary:
      return '본회의';
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
    case NewsType.plenary:
      return '본회의';
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

export interface Article extends Pick<Comment, 'id' | 'commentType' | 'title' | 'date'> {
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

export interface BillItem {
  billNo: string;
  billName: string;
  detail?: string;
  proposalReason?: string;
  voteResult?: string;
  voteTotal?: number;
  voteByParty?: PartyVote[];
}

// 타입별로 있을 수도/없을 수도 한 필드들을 담는 자유 JSON (News.detail).
// 2026-07 린 리셋에서 이 필드들이 top-level 컬럼 → detail JSON 안으로 이동.
// 스키마는 채우면서 정의 — 아래는 잠정 키.
export interface NewsDetail {
  agendaList?: string;
  speechContent?: string;
  billAmendment?: string;
  billSummary?: string;
  billDetail?: string;
  billVoteResult?: string;
  billVoteTotal?: number;
  billVoteByParty?: PartyVote[];
  bills?: BillItem[];
}

export interface News {
  id: number;
  title: string;
  subTitle: string;
  newsType: NewsType;
  summary: string;
  summaries: Array<NewsSummary>;
  proDebate?: string;
  conDebate?: string;
  detail?: NewsDetail;
  date?: string;
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

export interface NewsInView extends Omit<News, 'comments' | ''> {
  comments: Array<commentType>;
}

export interface Preview
  extends Pick<News, 'id' | 'title' | 'subTitle' | 'newsType' | 'summary' | 'date' | 'state'> {
  comments: Array<commentType>;
}
