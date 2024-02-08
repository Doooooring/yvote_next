import axios from 'axios';

import { HOST_URL } from '@url';
import { category, Keyword, KeywordOnDetail, KeywordToView } from '@utils/interface/keywords';
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
  keywords: {
    recent: Array<KeywordToView>;
    other: Array<otherObject>;
  };
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
        keywords: {
          recent: [] as Array<KeywordToView>,
          other: [] as Array<otherObject>,
        },
      };
    }
  }

  async getKeywordList() {
    try {
      const response: Response<{ keywords: Array<{ _id: string; keyword: string }> }> =
        await axios.get(`${HOST_URL}/keywords/keyword`);
      const keylist: Array<{ _id: string; keyword: string }> = response.data.result?.keywords ?? [];
      const result = keylist.map((key) => {
        return key.keyword;
      });
      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getKeywordIdList() {
    try {
      const response: Response<{ keywords: Array<{ _id: string; keyword: string }> }> =
        await axios.get(`${HOST_URL}/keywords/keyword`);
      const keylist = response.data.result?.keywords ?? [];
      const result = keylist.map((key) => {
        return key._id;
      });
      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getIdByKeyword(key: string) {
    try {
      const getlist: Response<{ keywords: Array<{ _id: string; keyword: string }> }> =
        await axios.get(`${HOST_URL}/keywords/keyword`);
      const keylist: Array<{ _id: string; keyword: string }> = getlist.data.result?.keywords ?? [];
      const keyword = keylist.find((uhm) => uhm.keyword === key);
      const _id = keyword?._id;
      return _id;
    } catch (e) {
      console.log(e);
    }
  }

  // async getKeywordByKey(key: string) {
  //   try {
  //     const response: Response<{ keyword: Keyword }> = await axios.get(
  //       `${HOST_URL}/keywords/${key}`,
  //     );
  //     return response.data.result.keyword;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async getKeywordsByCategory(category: category, page: number) {
    try {
      const response: Response<getKeywordsByCategoryResponse> = await axios.get(
        `${HOST_URL}/keywords/category/${category}?page=${page}`,
      );

      return response.data?.result?.keywords ?? [];
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getKeywordDetail(id: string, curNum: number) {
    try {
      const response: Response<getKeywordDetailResponse> = await axios.get(
        `${HOST_URL}/keywords/detail?id=${id}&page=${curNum}`,
      );
      const keywordDetail = response.data.result;
      return (
        keywordDetail ??
        ({
          keyword: {
            _id: '',
            keyword: '',
            category: 'etc',
            recent: false,
            news: [],
          },
          previews: [] as Preview[],
        } as getKeywordDetailResponse)
      );
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
