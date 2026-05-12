import axios from 'axios';

import { HOST_URL } from '@url';
import {
  Incident,
  IncidentSource,
  IncidentStatus,
  IncidentUpdate,
} from '@utils/interface/incident';

const BASE = `${HOST_URL}/incident`;

interface ListOptions {
  status?: IncidentStatus;
  source?: IncidentSource;
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

class IncidentRepository {
  async list(opts: ListOptions = {}): Promise<Incident[]> {
    const params: Record<string, string | number> = {};
    if (opts.status) params.status = opts.status;
    if (opts.source) params.source = opts.source;
    if (opts.newsId !== undefined) params.newsId = opts.newsId;
    if (opts.offset !== undefined) params.offset = opts.offset;
    if (opts.limit !== undefined) params.limit = opts.limit;
    const res = await axios.get<{ success: boolean; result: Incident[] } | Incident[]>(BASE, {
      params,
    });
    const data = res.data as { success: boolean; result: unknown } | Incident[];
    if (Array.isArray(data)) return data;
    // RespInterceptor wraps thrown server errors as
    // {success:false, result:<error>} — guard against that shape so a
    // broken endpoint doesn't crash the lane with `.map is not a fn`.
    const r = data?.result;
    if (Array.isArray(r)) return r as Incident[];
    if (data && data.success === false) {
      // eslint-disable-next-line no-console
      console.warn('[incidentRepository.list] server error:', r);
    }
    return [];
  }

  async getById(id: number): Promise<Incident | null> {
    const res: Response<Incident | null> = await axios.get(`${BASE}/${id}`);
    return res.data.result ?? null;
  }

  async dismiss(id: number): Promise<Incident> {
    const res: Response<Incident> = await axios.patch(`${BASE}/${id}/dismiss`, {});
    return res.data.result;
  }

  async resolve(id: number): Promise<Incident> {
    const res: Response<Incident> = await axios.patch(`${BASE}/${id}/resolve`, {});
    return res.data.result;
  }

  async update(id: number, patch: IncidentUpdate): Promise<Incident> {
    const res: Response<Incident> = await axios.patch(`${BASE}/${id}`, patch);
    return res.data.result;
  }
}

export const incidentRepository = new IncidentRepository();
