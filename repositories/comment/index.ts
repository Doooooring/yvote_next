import { HOST_URL } from '@public/assets/url';
import axios from 'axios';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

class CommentRepository {
  async getCommentSummary(id: number) {
    const response: Response<string> = await axios.get(`${HOST_URL}/comment/${id}/summary`);
    return response.data.result;
  }
}

export default new CommentRepository();
