import axios from 'axios';

export type TrackedLaneAction = 'fill' | 'publish' | 'unpublish' | 'untrack';

export type TrackedLaneActionResult = {
  ok?: boolean;
  pa_id?: number | null;
  detail?: string;
  applied_id?: number | null;
  started?: boolean;
  action?: TrackedLaneAction;
  news_id?: number;
};

export async function runTrackedAction(
  action: TrackedLaneAction,
  newsId: number,
  opts: { background?: boolean } = {},
): Promise<TrackedLaneActionResult> {
  const res = await axios.post('/api/adminjae2/tracked-action', {
    action,
    news_id: newsId,
    background: opts.background === true,
  });
  return res.data.result;
}
