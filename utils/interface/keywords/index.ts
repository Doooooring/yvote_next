export type category =
  | 'human'
  | 'politics'
  | 'policy'
  | 'economics'
  | 'social'
  | 'organization'
  | 'etc';

export interface Keyword {
  _id: string;
  keyword: string;
  explain: string;
  category: category;
  recent: boolean;
  news: Array<string>;
}

export interface KeywordToView
  extends Pick<Keyword, '_id' | 'keyword' | 'category' | 'recent'> {}

export interface KeywordOnDetail extends Pick<Keyword, '_id' | 'keyword' | 'explain'> {}

export interface KeywordInHuman extends KeywordToView {
  category: 'human';
}
export interface KeywordInPolitics extends KeywordToView {
  category: 'politics';
}
export interface KeywordInPolicy extends KeywordToView {
  category: 'policy';
}
export interface KeywordInEconomy extends KeywordToView {
  category: 'economics';
}
export interface KeywordInSocial extends KeywordToView {
  category: 'social';
}
export interface KeywordInOrganization extends KeywordToView {
  category: 'organization';
}
export interface KeywordInEtc extends KeywordToView {
  category: 'etc';
}
