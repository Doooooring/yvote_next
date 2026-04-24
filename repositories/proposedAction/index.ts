import axios from 'axios';
import { HOST_URL } from '@url';
import {
  ProposedAction,
  ProposedActionStatus,
} from '@utils/interface/proposedAction';

const BASE = `${HOST_URL}/proposed-action`;

interface ListOptions {
  status?: ProposedActionStatus;
  newsId?: number;
  offset?: number;
  limit?: number;
}

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

class ProposedActionRepository {
  async list(opts: ListOptions = {}): Promise<ProposedAction[]> {
    const params: Record<string, string | number> = {};
    if (opts.status) params.status = opts.status;
    if (opts.newsId !== undefined) params.newsId = opts.newsId;
    if (opts.offset !== undefined) params.offset = opts.offset;
    if (opts.limit !== undefined) params.limit = opts.limit;
    const res = await axios.get<
      { success: boolean; result: ProposedAction[] } | ProposedAction[]
    >(BASE, { params, withCredentials: true });
    const data = res.data as
      | { success: boolean; result: ProposedAction[] }
      | ProposedAction[];
    if (Array.isArray(data)) return data;
    return data.result ?? [];
  }

  async getById(id: number): Promise<ProposedAction | null> {
    const res: Response<ProposedAction | null> = await axios.get(
      `${BASE}/${id}`,
      { withCredentials: true },
    );
    return res.data.result ?? null;
  }

  async approve(id: number): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(
      `${BASE}/${id}/approve`,
      {},
      { withCredentials: true },
    );
    return res.data.result;
  }

  async reject(id: number): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(
      `${BASE}/${id}/reject`,
      {},
      { withCredentials: true },
    );
    return res.data.result;
  }

  async markApplied(id: number): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(
      `${BASE}/${id}/applied`,
      {},
      { withCredentials: true },
    );
    return res.data.result;
  }

  async update(
    id: number,
    patch: Partial<ProposedAction>,
  ): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(
      `${BASE}/${id}`,
      patch,
      { withCredentials: true },
    );
    return res.data.result;
  }
}

export const proposedActionRepository = new ProposedActionRepository();
