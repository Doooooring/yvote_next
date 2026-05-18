import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync } from 'child_process';

import { automationDir, automationPython } from '@/utils/server/automationRuntime';

const UPDATE_NEWS_TITLE_SCRIPT = `
import json
import sys
import traceback


def main():
    from company.infra.db import yvote_elementary as Y

    news_id = int(sys.argv[1])
    new_title = sys.argv[2].strip()
    if not new_title:
        return {"ok": False, "error": "title must be non-empty"}

    res = Y.read_news(news_id)
    cur = res.get("result") if isinstance(res, dict) else res
    if not isinstance(cur, dict):
        return {"ok": False, "error": f"news {news_id} not found"}

    old_title = cur.get("title") or ""
    if old_title.strip() == new_title:
        return {
            "ok": True,
            "news_id": news_id,
            "old_title": old_title,
            "new_title": new_title,
            "no_op": True,
        }

    patched = Y.update_news_full(news_id, {"title": new_title})
    return {
        "ok": True,
        "news_id": news_id,
        "old_title": old_title,
        "new_title": new_title,
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

function readReport(stdout: string) {
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
  const lastLine = lines[lines.length - 1] || '{}';
  return JSON.parse(lastLine) as { ok?: boolean; [key: string]: unknown };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'method not allowed' });
    return;
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const newsId = Number((body as { news_id?: unknown }).news_id);
  const newTitle = String((body as { title?: unknown }).title || '').trim();
  if (!Number.isInteger(newsId) || newsId <= 0) {
    res.status(400).json({ success: false, error: 'news_id must be a positive integer' });
    return;
  }
  if (!newTitle) {
    res.status(400).json({ success: false, error: 'title must be non-empty' });
    return;
  }
  const python = automationPython();
  try {
    const stdout = execFileSync(
      python,
      ['-c', UPDATE_NEWS_TITLE_SCRIPT, String(newsId), newTitle],
      {
        cwd: automationDir(),
        env: process.env,
        maxBuffer: 2 * 1024 * 1024,
        encoding: 'utf8',
        timeout: 60 * 1000,
      },
    );
    const report = readReport(stdout);
    if (!report.ok) {
      res.status(500).json({ success: false, report });
      return;
    }
    res.status(200).json({ success: true, report });
  } catch (e: unknown) {
    res.status(500).json({
      success: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
