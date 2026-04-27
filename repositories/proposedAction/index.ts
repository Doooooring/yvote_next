import axios from 'axios';
import { HOST_URL } from '@url';
import {
  ProposedAction,
  ProposedActionSource,
  ProposedActionStatus,
  ProposedActionType,
} from '@utils/interface/proposedAction';

const BASE = `${HOST_URL}/proposed-action`;

interface ListOptions {
  status?: ProposedActionStatus;
  newsId?: number;
  offset?: number;
  limit?: number;
}

export interface ProposedActionCreate {
  actionType: ProposedActionType;
  newsId?: number | null;
  payload: Record<string, unknown>;
  source: ProposedActionSource;
  note?: string;
}

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

class ProposedActionRepository {
  async create(body: ProposedActionCreate): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.post(
      BASE,
      body,
      { withCredentials: true },
    );
    return res.data.result;
  }

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
      | { success: boolean; result: unknown }
      | ProposedAction[];
    if (Array.isArray(data)) return data;
    // RespInterceptor wraps thrown server errors as
    // {success:false, result:<error>} — guard against that shape so a
    // broken endpoint doesn't crash the lane with `.map is not a fn`.
    const r = data?.result;
    if (Array.isArray(r)) return r as ProposedAction[];
    if (data && data.success === false) {
      // eslint-disable-next-line no-console
      console.warn('[proposedActionRepository.list] server error:', r);
    }
    return [];
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
