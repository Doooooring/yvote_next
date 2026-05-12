import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync } from 'child_process';
import path from 'path';

function parseNewsIds(body: unknown): number[] {
  const raw =
    body && typeof body === 'object' && 'news_ids' in body
      ? (body as { news_ids?: unknown }).news_ids
      : null;
  if (!Array.isArray(raw)) return [];
  const ids = raw
    .map((value) => (typeof value === 'number' ? value : Number(value)))
    .filter((value) => Number.isInteger(value) && value > 0);
  return Array.from(new Set(ids));
}

function automationDir() {
  return process.env.YVOTE_AUTOMATION_DIR || path.resolve(process.cwd(), '../yvote_automation');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'method not allowed' });
    return;
  }
  const ids = parseNewsIds(req.body);
  if (!ids.length) {
    res.status(400).json({ success: false, error: 'news_ids must include positive integers' });
    return;
  }
  const python = process.env.YVOTE_AUTOMATION_PYTHON || 'python3';
  try {
    const stdout = execFileSync(
      python,
      ['-m', 'company.ceo.recluster_tracked', '--news-ids', ids.join(',')],
      {
        cwd: automationDir(),
        env: process.env,
        maxBuffer: 50 * 1024 * 1024,
        encoding: 'utf8',
        // The LLM call can take a while on large comment sets — match
        // the worker's _TIMEOUT default (600s) plus a generous buffer.
        timeout: 12 * 60 * 1000,
      },
    );
    const report = JSON.parse(stdout.trim() || '{}');
    if (!report.ok) {
      res.status(500).json({ success: false, error: report.error || 'recluster failed', report });
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
