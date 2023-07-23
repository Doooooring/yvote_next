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
  comments: Array<string>;
}

interface getNewsContentResponse {
  response: AnswerState;
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
  async getPreviews(curNum: number, keyword: string | null = null) {
    const response = await axios.get(`${HOST_URL}/news/preview?page=${curNum}&keyword=${keyword}`);
    const data: Array<Preview> = response.data;
    return data;

    // return [
    //   {
    //     _id: '1',
    //     order: 1,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    //   {
    //     _id: '2',
    //     order: 2,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    //   {
    //     _id: '2',
    //     order: 3,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    // ];
  }

  async getNewsContent(id: Preview['_id']): Promise<getNewsContentResponse> {
    const token = localStorage.getItem('yVote');
    const response = await axios.get(`${HOST_URL}/news/detail?id=${id}`, {
      headers: {
        authorization: token,
      },
    });
    const data: getNewsContentResponse = response.data;
    console.log(data);
    return data;
    // return {
    //   response: 'none',
    //   news: {
    //     _id: '1',
    //     order: 1,
    //     title: '더미데이터 제목입니다',
    //     summary:
    //       '더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.$ 더미데이터 내용입니다. 더미데이터 내용입니다. 더미데이터 내용입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //     timeline: [
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //     ],
    //     opinions: {
    //       left: '왼쪽 의견 입니다.',
    //       right: '오른쪽 의견입니다.',
    //     },
    //     comments: [],
    //     votes: {
    //       left: 1,
    //       right: 1,
    //       none: 1,
    //     },
    //   },
    // };
  }

  async getNewsComment(
    id: News['_id'],
    type: commentType,
    page: number,
  ): Promise<NewsCommentResponse> {
    try {
      const response: Response<NewsCommentResponse> = await axios.get(
        `${HOST_URL}/news/comment?id=${id}&type=${type}&page=${page}`,
      );
      if (response.data.success) {
        return response.data.result;
      } else {
        Error('not success');
      }
    } catch (e) {
      console.log(e);
    } finally {
      return { comments: [] };
    }
  }

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
