import axios from 'axios';
import { HOST_URL } from '@url';
import { News, Preview, commentType } from '@utils/interface/news';

type AnswerState = 'left' | 'right' | 'none';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

export interface NewsDetail
  extends Pick<
    News,
    | '_id'
    | 'title'
    | 'order'
    | 'title'
    | 'summary'
    | 'keywords'
    | 'state'
    | 'timeline'
    | 'opinions'
    | 'votes'
  > {
  comments: Array<commentType>;
}

interface getNewsContentResponse {
  news: NewsDetail;
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
  async getNewsIds(): Promise<Array<{ _id: string }>> {
    try {
      const response = await axios.get(`${HOST_URL}/news/id`);
      const data = response.data.result.data as Array<{ _id: string }>;
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /**
   * 뉴스 블록들 조회 API
   * @param curNum 현재 페이지 (보여지고 있는 뉴스 개수)
   * @param keyword 검색 키워드 (전체 검색시 null)
   */
  async getPreviews(curNum: number, keyword: string | null = null): Promise<Array<Preview>> {
    try {
      const response: Response<{ news: Array<Preview> }> = await axios.get(
        `${HOST_URL}/news/preview?page=${curNum}&keyword=${keyword ?? ""}`,
      );
      const data = response.data;
      return data.result.news;
    } catch (e) {
      return [];
    }
  }

  /**
   * (@FIXME) 뉴스 블록들 조회 API (ADMIN)
   * @param curNum 현재 페이지 (보여지고 있는 뉴스 개수)
   * @param keyword 검색 키워드 (전체 검색시 null)
   */
  async getPreviewsAdmin(curNum: number, keyword: string | null = null): Promise<Array<Preview>> {
    try {
      const response: Response<{ news: Array<Preview> }> = await axios.get(
        `${HOST_URL}/news/preview?page=${curNum}&keyword=${keyword}&isAdmin=${true}`,
      );
      const data = response.data;
      return data.result.news;
    } catch (e) {
      return [];
    }
  }

  /**
   * 뉴스 세부 컨텐츠 조회 API
   * @param id 뉴스 아이디
   */
  async getNewsContent(id: Preview['_id'], token: string | null): Promise<getNewsContentResponse> {
    try {
      // 투표 정보 토큰
      const response: Response<getNewsContentResponse> = await axios.get(`${HOST_URL}/news/${id}`, {
        headers: {
          authorization: token,
        },
      });
      const data = response.data;

      if (!data.success) Error('api error');

      return data.result;
    } catch (e) {
      console.log(e);
      // 더미 데이터
      return {
        news: {
          _id: '1',
          order: 1,
          title: '더미데이터 제목입니다',
          summary:
            '더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.$ 더미데이터 내용입니다. 더미데이터 내용입니다. 더미데이터 내용입니다.',
          keywords: ['키워드1', '키워드2', '키워드3'],
          state: true,
          timeline: [
            {
              date: '2024.08.12',
              title: '더미데이터 입니다.',
            },
            {
              date: '2024.08.13',
              title: '더미데이터 입니다.',
            },
            {
              date: '2024.08.14',
              title: '더미데이터 입니다.',
            },
          ],
          opinions: {
            left: '왼쪽 의견 입니다.',
            right: '오른쪽 의견입니다.',
          },
          comments: [
            commentType.국민의힘,
            commentType.민주당,
            commentType.기타,
            commentType.청와대,
            commentType.행정부,
          ],
          votes: {
            left: 1,
            right: 1,
            none: 1,
          },
        },
      };
    }
  }

  /**
   * 해당 뉴스의 평론 정보 조회 API
   * @param id 뉴스 아이디
   * @param type 평론 타입
   * @param page 불러온 평론 페이지 (현재 보여진 평론 개수)
   */
  async getNewsComment(
    id: News['_id'],
    type: commentType,
    page: number,
  ): Promise<NewsCommentResponse> {
    try {
      const response: Response<NewsCommentResponse> = await axios.get(
        `${HOST_URL}/news/${id}/comment?type=${type}&page=${page}`,
      );
      if (response.data.success) {
        return response.data.result;
      } else {
        Error('not success');
        return {
          comments: [],
        };
      }
    } catch (e) {
      console.log(e);
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
  async vote(id: News['_id'], answer: AnswerState, token: string | null): Promise<VoteResponse> {
    const response = await axios.post(
      `${HOST_URL}/vote`,
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
