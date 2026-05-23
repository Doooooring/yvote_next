import axios from 'axios';

import { HOST_URL } from '@url';
import {
  ProposedAction,
  ProposedActionSource,
  ProposedActionStatus,
  ProposedActionType,
} from '@utils/interface/proposedAction';

import { parseProposedActionListResponse } from './parseListResponse';

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

interface ApplyApprovedBatchResult {
  started: boolean;
  ids: number[];
  pid?: number;
}

interface ApplyApprovedResult {
  ok: boolean;
  pa_id?: number | null;
  detail?: string;
  applied_id?: number | null;
}

class ProposedActionRepository {
  async create(body: ProposedActionCreate): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.post(BASE, body);
    return res.data.result;
  }

  async list(opts: ListOptions = {}): Promise<ProposedAction[]> {
    const params: Record<string, string | number> = {};
    if (opts.status) params.status = opts.status;
    if (opts.newsId !== undefined) params.newsId = opts.newsId;
    if (opts.offset !== undefined) params.offset = opts.offset;
    if (opts.limit !== undefined) params.limit = opts.limit;
    const res = await axios.get<{ success: boolean; result: ProposedAction[] } | ProposedAction[]>(
      BASE,
      { params },
    );
    return parseProposedActionListResponse(res.data) as ProposedAction[];
  }

  async getById(id: number): Promise<ProposedAction | null> {
    const res: Response<ProposedAction | null> = await axios.get(`${BASE}/${id}`);
    return res.data.result ?? null;
  }

  async approveAndApply(id: number): Promise<ApplyApprovedResult> {
    const res = await axios.post<{ success: boolean; result: ApplyApprovedResult }>(
      '/api/adminjae2/apply-approved',
      { id },
    );
    return res.data.result;
  }

  async approveAndApplyManyInBackground(ids: number[]): Promise<ApplyApprovedBatchResult> {
    const uniqueIds = Array.from(new Set(ids.filter((id) => Number.isInteger(id) && id > 0)));
    const res = await axios.post<{ success: boolean; result: ApplyApprovedBatchResult }>(
      '/api/adminjae2/apply-approved-many',
      { ids: uniqueIds },
    );
    return res.data.result;
  }

  async reject(id: number): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(`${BASE}/${id}/reject`, {});
    return res.data.result;
  }

  async markApplied(id: number): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(`${BASE}/${id}/applied`, {});
    return res.data.result;
  }

  async update(id: number, patch: Partial<ProposedAction>): Promise<ProposedAction> {
    const res: Response<ProposedAction> = await axios.patch(`${BASE}/${id}`, patch);
    return res.data.result;
  }
}

export const proposedActionRepository = new ProposedActionRepository();
