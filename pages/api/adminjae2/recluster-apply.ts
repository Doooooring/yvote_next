import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync } from 'child_process';

import { automationDir, automationPython } from '@/utils/server/automationRuntime';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'method not allowed' });
    return;
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const decisions = (body as { decisions?: unknown }).decisions;
  if (!Array.isArray(decisions) || !decisions.length) {
    res.status(400).json({ success: false, error: 'decisions must be a non-empty list' });
    return;
  }
  const python = automationPython();
  try {
    const stdout = execFileSync(python, ['-m', 'company.ceo.recluster_apply'], {
      cwd: automationDir(),
      env: process.env,
      maxBuffer: 10 * 1024 * 1024,
      encoding: 'utf8',
      input: JSON.stringify({ decisions }),
      timeout: 5 * 60 * 1000,
    });
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
