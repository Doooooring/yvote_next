import axios from 'axios';

import { HOST_URL } from '@public/assets/url';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

class OpenAIRepository {
  async getAIResult(message: any) {
    const response: Response<string> = await axios.post(`${HOST_URL}/llm`, {
      message,
      model: 'grok-4-1-fast-reasoning',
    });
    if (response.data.success === false) {
      throw new Error('Failed to fetch AI result');
    }
    return response.data.result;
  }

  async summarize(text: string) {
    const response: Response<string> = await axios.post(`${HOST_URL}/summarize`, { text });
    if (response.data.success === false) {
      throw new Error('Failed to summarize');
    }
    return response.data.result;
  }
}

export default new OpenAIRepository();
