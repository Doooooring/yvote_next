import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { automationDir, automationPython } from '@/utils/server/automationRuntime';

function parseActionIds(body: unknown): number[] {
  const raw =
    body && typeof body === 'object' && 'ids' in body ? (body as { ids?: unknown }).ids : null;
  if (!Array.isArray(raw)) return [];
  const ids = raw
    .map((value) => (typeof value === 'number' ? value : Number(value)))
    .filter((value) => Number.isInteger(value) && value > 0);
  return Array.from(new Set(ids));
}

function logPath() {
  const dir = path.join(automationDir(), 'state', 'adminjae2_apply_logs');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
}

function runBackgroundApply(actionIds: number[]) {
  const python = automationPython();
  const out = fs.openSync(logPath(), 'a');
  const child = spawn(
    python,
    ['-m', 'company.ceo.apply_approved_many_now', ...actionIds.map(String)],
    {
      cwd: automationDir(),
      env: process.env,
      detached: true,
      stdio: ['ignore', out, out],
    },
  );
  child.unref();
  fs.closeSync(out);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'method not allowed' });
    return;
  }

  const ids = parseActionIds(req.body);
  if (!ids.length) {
    res.status(400).json({ success: false, error: 'ids must include positive integers' });
    return;
  }

  try {
    runBackgroundApply(ids);
    res.status(202).json({ success: true, result: { started: true, ids } });
  } catch (e: unknown) {
    res.status(500).json({
      success: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
