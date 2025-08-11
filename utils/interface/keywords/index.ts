export enum KeywordCategory {
  // human = 'human',
  organization = 'organization',
  politics = 'politics',
  policy = 'policy',
  social = 'social',
  economics = 'economics',
  // etc = 'etc',
}

export interface Keyword {
  id: number;
  keyword: string;
  explain: string;
  category: KeywordCategory;
  recent: boolean;
  keywordImage: string;
}

export interface KeyTitle extends Pick<Keyword, 'id' | 'keyword'> {}

export interface KeywordToView
  extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'recent' | 'keywordImage'> {}

export interface KeywordOnDetail
  extends Pick<Keyword, 'id' | 'keyword' | 'explain' | 'category' | 'keywordImage'> {}
