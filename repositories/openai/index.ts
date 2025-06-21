import { HOST_URL } from '@public/assets/url';
import axios from 'axios';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

class OpenAIRepository {
  async getAIResult(message: any) {
    const response: Response<string> = await axios.post(`${HOST_URL}/openai`, {
      message,
      model : 'grok-3'
    });
    return response.data.result;
  }
}

export default new OpenAIRepository();
