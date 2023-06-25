export enum Press {
  조선 = '조선',
  중앙 = '동아',
  한겨레 = '한겨레',
  한경 = '한경',
  매경 = '매경',
  동아 = '동아',
}

export interface Timeline {
  date: string;
  title: string;
}

export interface News {
  _id: string;
  order: number;
  title: string;
  summary: string;
  keywords: Array<string>;
  state: boolean;
  timeline: Array<Timeline>;
  opinions: {
    left: string;
    right: string;
  };
  votes: {
    left: number;
    right: number;
    none: number;
  };
}

export interface Preview
  extends Pick<News, '_id' | 'order' | 'title' | 'summary' | 'keywords' | 'state'> {}
