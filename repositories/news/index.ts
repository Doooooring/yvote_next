import axios from "axios";

import { HOST_URL } from "@url";
import { News, Preview } from "@utils/interface/news";

type AnswerState = "left" | "right" | "none";

interface getNewsContentResponse {
  response: AnswerState;
  news: News;
}

interface VoteResponse {
  token: string;
  state: boolean;
}

class NewsRepository {
  async getPreviews(curNum: number, keyword: string | null = null) {
    const response = await axios.get(
      `${HOST_URL}/news/preview?curNum=${curNum}&keyword=${keyword}`
    );
    const data: Array<Preview> = response.data;
    return data;
  }

  async getNewsContent(id: Preview["_id"]) {
    const token = localStorage.getItem("yVote");
    const response = await axios.get(`${HOST_URL}/news/detail?id=${id}`, {
      headers: {
        authorization: token,
      },
    });
    const data: getNewsContentResponse = response.data;
    console.log(data);
    return data;
  }

  async vote(
    id: News["_id"],
    answer: AnswerState,
    token: string | null
  ): Promise<VoteResponse> {
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
      }
    );
    const data: {
      token: string;
      state: boolean;
    } = response.data;
    return data;
  }
}

export default new NewsRepository();
