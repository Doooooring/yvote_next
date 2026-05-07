import type { NextApiRequest, NextApiResponse } from 'next';
import { execFileSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function parseActionIds(body: unknown): number[] {
  const raw =
    body && typeof body === 'object' && 'ids' in body ? (body as { ids?: unknown }).ids : null;
  if (!Array.isArray(raw)) return [];
  const ids = raw
    .map((value) => (typeof value === 'number' ? value : Number(value)))
    .filter((value) => Number.isInteger(value) && value > 0);
  return Array.from(new Set(ids));
}

function automationDir() {
  return process.env.YVOTE_AUTOMATION_DIR || path.resolve(process.cwd(), '../yvote_automation');
}

function logPath() {
  const dir = path.join(automationDir(), 'state', 'adminjae2_apply_logs');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
}

function runBackgroundApply(actionIds: number[]) {
  const python = process.env.YVOTE_AUTOMATION_PYTHON || 'python3';
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

function approveForApplyQueue(actionIds: number[]) {
  const python = process.env.YVOTE_AUTOMATION_PYTHON || 'python3';
  const stdout = execFileSync(
    python,
    ['-m', 'company.ceo.apply_approved_many_now', '--approve-only', ...actionIds.map(String)],
    {
      cwd: automationDir(),
      env: process.env,
      maxBuffer: 10 * 1024 * 1024,
      encoding: 'utf8',
    },
  );
  return JSON.parse(stdout.trim() || '{}') as { ok?: boolean; results?: unknown[] };
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
    const approved = approveForApplyQueue(ids);
    if (!approved.ok) {
      res.status(500).json({ success: false, result: approved });
      return;
    }
    runBackgroundApply(ids);
    res.status(202).json({ success: true, result: { started: true, ids, approved } });
  } catch (e: unknown) {
    res.status(500).json({
      success: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
