import { HOST_URL } from '@url';
import { Article, News, NewsInView, Preview, commentType } from '@utils/interface/news';

import { clone, getTextContentFromHtmlText } from '@utils/tools';
import axios from 'axios';

type AnswerState = 'left' | 'right' | 'none';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

interface NewsCommentResponse {
  comments: Array<{
    title: string;
    comment: string;
  }>;
}

interface VoteResponse {
  token: string;
  state: boolean;
}

class NewsRepository {
  /**
   * 뉴스 아이디 전체 목록 조회
   */
  async getNewsIds() {
    const response = await axios.get(`${HOST_URL}/news/ids`);
    const data: Array<{ id: number }> = response.data.result;
    return data;
  }

  /**
   * 뉴스 블록들 조회 API
   * @param curNum 현재 페이지 (보여지고 있는 뉴스 개수)
   * @param keyword 검색 키워드 (전체 검색시 null)
   */
  async getPreviews(
    curNum: number,
    limit: number,
    keyword: string | null = null,
  ): Promise<Array<Preview>> {
    const response: Response<Array<Preview>> = await axios.get(
      `${HOST_URL}/news/previews?offset=${curNum}&limit=${limit}&keyword=${''}`,
    );
    const data = response.data;
    return data.result.map((news) => {
      const preview = clone(news);
      preview.summary = getTextContentFromHtmlText(news.summary)?.slice(0, 100) ?? '';
      return preview;
    });
  }

  /**
   * (@FIXME) 뉴스 블록들 조회 API (ADMIN)
   * @param curNum offset (보여지고 있는 뉴스 개수)
   * @param limit  limit (보여지고 있는 뉴스 개수)
   * @param keyword 검색 키워드 (전체 검색시 null)
   */
  async getPreviewsAdmin(
    curNum: number,
    limit: number = 20,
    keyword: string | null = null,
  ): Promise<Array<Preview>> {
    const response: Response<Array<Preview>> = await axios.get(
      `${HOST_URL}/news/preview?offset=${curNum}&limit=${limit}&keyword=${keyword}&isAdmin=${true}`,
    );
    const data = response.data;
    return data.result.map((news) => {
      const preview = clone(news);
      preview.summary = getTextContentFromHtmlText(news.summary)?.slice(0, 100) ?? '';
      return preview;
    });
  }

  /**
   * 최신 업데이트 평론 조회 API
   */
  async getRecentUpdatedComments(offset: number, limit: number) {
    const response: Response<Array<Article>> = await axios.get(
      `${HOST_URL}/news/comment-updated?offset=${offset}&limit=${limit}`,
    );
    const data = response.data;
    return data;
  }

  /**
   * 뉴스 세부 컨텐츠 조회 API
   * @param id 뉴스 아이디
   */
  async getNewsContent(id: Preview['id'], token: string | null) {
    // 투표 정보 토큰
    const response: Response<NewsInView> = await axios.get(`${HOST_URL}/news/${id}`, {
      headers: {
        authorization: token,
      },
    });
    const data = response.data;
    return data.result;
  }

  /**
   * 해당 뉴스의 평론 정보 조회 API
   * @param id 뉴스 아이디
   * @param type 평론 타입
   * @param page 불러온 평론 페이지 (현재 보여진 평론 개수)
   */
  async getNewsComment(
    id: News['id'],
    type: commentType,
    page: number,
    limit: number = 20,
  ): Promise<NewsCommentResponse> {
    const response: Response<NewsCommentResponse> = await axios.get(
      `${HOST_URL}/news/${id}/comment?type=${type}&offset=${page}&limit=${limit}`,
    );
    if (response.data.success) {
      return response.data.result;
    } else {
      return {
        comments: [],
      };
    }
  }

  /**
   * 해당 뉴스에 투표 API
   * @param id 뉴스 아이디
   * @param answer 투표 응답
   * @param token 기존 투표 정보
   * @returns
   */
  async vote(id: News['id'], answer: AnswerState, token: string | null): Promise<VoteResponse> {
    const response = await axios.post(
      `${HOST_URL}/news/vote`,
      {
        news: id,
        response: answer,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    const data: {
      token: string;
      state: boolean;
    } = response.data;
    return data;
  }
}

export default new NewsRepository();
