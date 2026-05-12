import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync } from 'child_process';
import path from 'path';

function automationDir() {
  return process.env.YVOTE_AUTOMATION_DIR || path.resolve(process.cwd(), '../yvote_automation');
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
  const python = process.env.YVOTE_AUTOMATION_PYTHON || 'python3';
  try {
    const stdout = execFileSync(
      python,
      ['-m', 'company.ceo.update_news_title', String(newsId), newTitle],
      {
        cwd: automationDir(),
        env: process.env,
        maxBuffer: 2 * 1024 * 1024,
        encoding: 'utf8',
        timeout: 60 * 1000,
      },
    );
    const report = JSON.parse(stdout.trim() || '{}');
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
