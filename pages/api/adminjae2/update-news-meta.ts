import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync } from 'child_process';

import { automationDir, automationPython } from '@/utils/server/automationRuntime';
import { NewsType } from '@utils/interface/news';

type PythonReport = {
  ok?: boolean;
  error?: unknown;
  [key: string]: unknown;
};

const NEWS_TYPES = new Set<string>(Object.values(NewsType));

const UPDATE_NEWS_META_SCRIPT = `
import json
import sys
import traceback


def main():
    from company.infra.db import yvote_elementary as Y

    news_id = int(sys.argv[1])
    update_fields = json.loads(sys.argv[2])
    update_fields = {
        k: v for k, v in update_fields.items()
        if k in {"title", "newsType"}
    }
    if not update_fields:
        return {"ok": False, "error": "no supported fields provided"}

    res = Y.read_news(news_id)
    cur = res.get("result") if isinstance(res, dict) else res
    if not isinstance(cur, dict):
        return {"ok": False, "error": f"news {news_id} not found"}

    changed = {
        k: v for k, v in update_fields.items()
        if cur.get(k) != v
    }
    old_values = {k: cur.get(k) for k in update_fields}
    if not changed:
        return {
            "ok": True,
            "news_id": news_id,
            "old": old_values,
            "new": update_fields,
            "no_op": True,
        }

    patched = Y.update_news_full(news_id, changed)
    return {
        "ok": True,
        "news_id": news_id,
        "old": old_values,
        "new": update_fields,
        "patch_result": patched,
    }


try:
    print(json.dumps(main(), ensure_ascii=False))
except Exception as e:
    print(json.dumps({
        "ok": False,
        "error": f"{type(e).__name__}: {e}",
        "traceback": traceback.format_exc(),
    }, ensure_ascii=False))
`;

function readReport(stdout: string): PythonReport {
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
  const lastLine = lines[lines.length - 1] || '{}';
  return JSON.parse(lastLine) as PythonReport;
}

function runPythonJson(args: string[]) {
  const stdout = execFileSync(automationPython(), args, {
    cwd: automationDir(),
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8',
    timeout: 60 * 1000,
  });
  return readReport(stdout);
}

function parseBody(body: unknown):
  | {
      newsId: number;
      title?: string;
      newsType?: NewsType;
    }
  | { error: string } {
  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const rawNewsId = record.news_id ?? record.newsId;
  const newsId = typeof rawNewsId === 'number' ? rawNewsId : Number(rawNewsId);
  if (!Number.isInteger(newsId) || newsId <= 0) {
    return { error: 'news_id must be a positive integer' };
  }

  const hasTitle = Object.prototype.hasOwnProperty.call(record, 'title');
  const hasNewsType =
    Object.prototype.hasOwnProperty.call(record, 'newsType') ||
    Object.prototype.hasOwnProperty.call(record, 'news_type');

  if (!hasTitle && !hasNewsType) {
    return { error: 'title or newsType is required' };
  }

  const parsed: { newsId: number; title?: string; newsType?: NewsType } = { newsId };
  if (hasTitle) {
    const title = String(record.title ?? '').trim();
    if (!title) {
      return { error: 'title must be non-empty' };
    }
    parsed.title = title;
  }

  if (hasNewsType) {
    const rawNewsType = record.newsType ?? record.news_type;
    const newsType = String(rawNewsType ?? '');
    if (!NEWS_TYPES.has(newsType)) {
      return { error: `newsType must be one of ${Array.from(NEWS_TYPES).join(', ')}` };
    }
    parsed.newsType = newsType as NewsType;
  }

  return parsed;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'method not allowed' });
    return;
  }

  const parsed = parseBody(req.body);
  if ('error' in parsed) {
    res.status(400).json({ success: false, error: parsed.error });
    return;
  }

  const report: { metadata?: PythonReport } = {};

  try {
    const updateFields: { title?: string; newsType?: NewsType } = {};
    if (parsed.title !== undefined) {
      updateFields.title = parsed.title;
    }
    if (parsed.newsType !== undefined) {
      updateFields.newsType = parsed.newsType;
    }

    report.metadata = runPythonJson([
      '-c',
      UPDATE_NEWS_META_SCRIPT,
      String(parsed.newsId),
      JSON.stringify(updateFields),
    ]);
    if (!report.metadata.ok) {
      res.status(500).json({ success: false, report });
      return;
    }

    res.status(200).json({ success: true, report });
  } catch (e: unknown) {
    res.status(500).json({
      success: false,
      error: e instanceof Error ? e.message : String(e),
      report,
    });
  }
}
