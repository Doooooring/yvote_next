import type { NextApiRequest, NextApiResponse } from 'next';
import { execFile, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { automationDir, automationPython } from '@/utils/server/automationRuntime';

type TrackedAction = 'fill' | 'publish' | 'unpublish' | 'untrack';

type OwnerCommandResult = {
  ok?: boolean;
  pa_id?: number | null;
  detail?: string;
  applied_id?: number | null;
};

const ACTIONS: TrackedAction[] = ['fill', 'publish', 'unpublish', 'untrack'];

function parseBody(
  body: unknown,
): { action: TrackedAction; newsId: number; background: boolean } | { error: string } {
  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const action = record.action;
  if (typeof action !== 'string' || !ACTIONS.includes(action as TrackedAction)) {
    return { error: `action must be one of ${ACTIONS.join(', ')}` };
  }

  const rawNewsId = record.news_id ?? record.newsId;
  const newsId = typeof rawNewsId === 'number' ? rawNewsId : Number(rawNewsId);
  if (!Number.isInteger(newsId) || newsId <= 0) {
    return { error: 'news_id must be a positive integer' };
  }

  return {
    action: action as TrackedAction,
    newsId,
    background: record.background === true,
  };
}

function logPath(action: TrackedAction, newsId: number) {
  const dir = path.join(automationDir(), 'state', 'adminjae2_apply_logs');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(dir, `${stamp}-${action}-${newsId}.log`);
}

function runBackground(action: TrackedAction, newsId: number) {
  const python = automationPython();
  const out = fs.openSync(logPath(action, newsId), 'a');
  const child = spawn(
    python,
    ['-m', 'company.ceo.adminjae2_direct_action', action, String(newsId)],
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

function runNow(action: TrackedAction, newsId: number): Promise<OwnerCommandResult> {
  const python = automationPython();
  return new Promise((resolve, reject) => {
    execFile(
      python,
      ['-m', 'company.ceo.adminjae2_direct_action', action, String(newsId)],
      {
        cwd: automationDir(),
        env: process.env,
        maxBuffer: 20 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        let parsed: OwnerCommandResult | null = null;
        try {
          parsed = JSON.parse(stdout.trim() || '{}') as OwnerCommandResult;
        } catch (parseError) {
          reject({
            message: parseError instanceof Error ? parseError.message : String(parseError),
            stderr,
            stdout,
          });
          return;
        }

        if (error && !parsed) {
          reject({ message: error.message, stderr, stdout });
          return;
        }
        resolve(parsed);
      },
    );
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  try {
    if (parsed.background) {
      runBackground(parsed.action, parsed.newsId);
      res.status(202).json({
        success: true,
        result: {
          started: true,
          action: parsed.action,
          news_id: parsed.newsId,
        },
      });
      return;
    }

    const result = await runNow(parsed.action, parsed.newsId);
    if (!result.ok) {
      res.status(500).json({ success: false, result });
      return;
    }
    res.status(200).json({ success: true, result });
  } catch (e: unknown) {
    res.status(500).json({
      success: false,
      error: e && typeof e === 'object' && 'message' in e ? e.message : String(e),
      detail: e,
    });
  }
}
