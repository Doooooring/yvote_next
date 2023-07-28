import axios from 'axios';

import { HOST_URL } from '@url';
import { category, KeywordOnDetail, KeywordToView } from '@utils/interface/keywords';
import { Preview } from '@utils/interface/news';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

export interface otherObject {
  _id: category;
  keywords: Array<KeywordToView>;
}

export interface getKeywordsResponse {
  recent: Array<KeywordToView>;
  other: Array<otherObject>;
}

export interface getKeywordsByCategoryResponse {
  keywords: KeywordToView[];
}

export interface getKeywordDetailResponse {
  keyword: KeywordOnDetail | null;
  previews: Array<Preview>;
}

class KeywordsRepository {
  async getKeywords() {
    try {
      const response: Response<getKeywordsResponse> = await axios.get(`${HOST_URL}/keywords`);
      const keywords = response.data.result;
      return keywords;
    } catch (e) {
      console.log(e);
      return {
        recent: [],
        other: [],
      };
    }
  }

  async getKeywordList() {
    try {
      const response: Response<{ keywords: string[] }> = await axios.get(
        `${HOST_URL}/keywords/keyword`,
      );
      const keylist: string[] = response.data.result.keywords;
      return keylist;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getKeywordsByCategory(category: category, page: number) {
    try {
      const response: Response<getKeywordsByCategoryResponse> = await axios.get(
        `${HOST_URL}/keywords/${category}?page=${page}`,
      );

      return response.data.result.keywords;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getKeywordDetail(keyword: string, curNum: number) {
    try {
      const response: Response<getKeywordDetailResponse> = await axios.get(
        `${HOST_URL}/keywords/detail?keyword=${keyword}&page=${curNum}`,
      );
      const keywordDetail = response.data.result;
      return keywordDetail;
    } catch (e) {
      console.log(e);
      return {
        keyword: {
          _id: '',
          keyword: '',
          category: 'etc',
          recent: false,
          news: [],
        },
        previews: [] as Preview[],
      } as getKeywordDetailResponse;
    }
  }
}

export default new KeywordsRepository();
