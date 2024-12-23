import axios from 'axios';

import { HOST_URL } from '@url';
import { KeywordCategory, KeywordOnDetail, KeywordToView } from '@utils/interface/keywords';
import { INF } from '@public/assets/resource';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

export interface getKeywordsByCategoryResponse {
  keywords: KeywordToView[];
}

export interface getKeywordDetailResponse {
  keyword: KeywordOnDetail;
}

class KeywordsRepository {
  async getKeywordsKeyList(offset: number = 0, limit: number = INF) {
    const response: Response<Array<{ id: number; keyword: string }>> = await axios.get(
      `${HOST_URL}/keyword/key-list`,
    );
    return response.data.result;
  }

  async getKeywordsShort(
    offset: number,
    limit: number,
    option: { search?: string; category?: KeywordCategory; isRecent?: boolean } = {},
  ) {
    const response: Response<KeywordToView[]> = await axios.get(`${HOST_URL}/keyword`, {
      params: { ...option, offset, limit },
    });
    return response.data.result;
  }
  async getKeywordByKey(key: string) {
    const response: Response<KeywordOnDetail> = await axios.get(`${HOST_URL}/keyword?key=${key}`);
    return response.data.result;
  }

  async getKeywordById(id: number) {
    const response: Response<KeywordOnDetail> = await axios.get(`${HOST_URL}/keyword?id=${id}`);
    return response.data.result;
  }

  async getKeywordsByCategory(category: KeywordCategory, page: number) {
    const response: Response<getKeywordsByCategoryResponse> = await axios.get(
      `${HOST_URL}/keywords/category/${category}?page=${page}`,
    );
  }

  // async getKeywordList() {
  //   try {
  //     const response: Response<{ keywords: Array<{ _id: string; keyword: string }> }> =
  //       await axios.get(`${HOST_URL}/keywords/keyword`);
  //     const keylist: Array<{ _id: string; keyword: string }> = response.data.result?.keywords ?? [];
  //     const result = keylist.map((key) => {
  //       return key.keyword;
  //     });
  //     return result;
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // }

  // async getKeywordIdList() {
  //   try {
  //     const response: Response<{ keywords: Array<{ id: number; keyword: string }> }> =
  //       await axios.get(`${HOST_URL}/keywords/keyword`);
  //     const keylist = response.data.result?.keywords ?? [];

  //     return keylist;
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // }

  // async getIdByKeyword(key: string) {
  //   try {
  //     const getlist: Response<{ keywords: Array<{ _id: string; keyword: string }> }> =
  //       await axios.get(`${HOST_URL}/keywords/keyword`);
  //     const keylist: Array<{ _id: string; keyword: string }> = getlist.data.result?.keywords ?? [];
  //     const keyword = keylist.find((uhm) => uhm.keyword === key);
  //     const _id = keyword?._id;
  //     return _id;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}

export default new KeywordsRepository();
