import type { NextApiRequest, NextApiResponse } from 'next';
import { execFile } from 'child_process';
import path from 'path';

type ApplyApprovedResult = {
  ok?: boolean;
  pa_id?: number | null;
  detail?: string;
  applied_id?: number | null;
  title_review?: {
    reviewed: number;
    errors: Array<Record<string, unknown>>;
  };
};

function parseActionId(body: unknown): number | null {
  const raw =
    body && typeof body === 'object' && 'id' in body ? (body as { id?: unknown }).id : null;
  const id = typeof raw === 'number' ? raw : Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function automationDir() {
  return process.env.YVOTE_AUTOMATION_DIR || path.resolve(process.cwd(), '../yvote_automation');
}

function runImmediateApply(actionId: number): Promise<ApplyApprovedResult> {
  const python = process.env.YVOTE_AUTOMATION_PYTHON || 'python3';
  return new Promise((resolve, reject) => {
    execFile(
      python,
      ['-m', 'company.ceo.apply_approved_now', String(actionId)],
      {
        cwd: automationDir(),
        env: process.env,
        maxBuffer: 10 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        let parsed: ApplyApprovedResult | null = null;
        try {
          parsed = JSON.parse(stdout.trim() || '{}') as ApplyApprovedResult;
        } catch (parseError) {
          reject({
            message: parseError instanceof Error ? parseError.message : String(parseError),
            stderr,
            stdout,
          });
          return;
        }

        if (error) {
          reject({
            message: error.message,
            result: parsed,
            stderr,
          });
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

  const actionId = parseActionId(req.body);
  if (!actionId) {
    res.status(400).json({ success: false, error: 'id must be a positive integer' });
    return;
  }

  try {
    const result = await runImmediateApply(actionId);
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
