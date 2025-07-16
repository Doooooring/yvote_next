import { commentType } from '@utils/interface/news';

export type getRecentUpdatedCommentsQueryOption = {
  limit: number;
  offset: number;
  type?: commentType;
};
