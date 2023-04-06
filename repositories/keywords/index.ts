import axios from 'axios';

import { HOST_URL } from '@url';
import { category, KeywordOnDetail, KeywordToView } from '@utils/interface/keywords';
import { Preview } from '@utils/interface/news';

export interface otherObject {
  _id: category;
  keywords: Array<KeywordToView>;
}

export interface getKeywordsResponse {
  recent: Array<KeywordToView>;
  other: Array<otherObject>;
}

export interface getKeywordDetailResponse {
  keyword: KeywordOnDetail;
  previews: Array<Preview>;
}

class KeywordsRepository {
  async getKeywords() {
    const response = await axios.get(`${HOST_URL}/keywords`);
    const keywords: getKeywordsResponse = response.data;
    return keywords;
  }

  async getKeywordList() {
    const response = await axios.get(`${HOST_URL}/keywords/keyword`);
    const keylist: string[] = response.data;
    return keylist;
  }

  async getKeywordsWithCategory() {
    return 0;
  }

  async getKeywordDetail(keyword: string, curNum: number) {
    const response = await axios.get(
      `${HOST_URL}/keywords/detail?keyName=${keyword}&curNum=${curNum}`,
    );
    const keywordDetail: getKeywordDetailResponse = response.data;
    return keywordDetail;
  }
}

export default new KeywordsRepository();
