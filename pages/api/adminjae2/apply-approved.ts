import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';

import type { NextApiRequest, NextApiResponse } from 'next';

const execFileAsync = promisify(execFile);

const AUTOMATION_CWD =
  process.env.YVOTE_AUTOMATION_CWD ?? path.resolve(process.cwd(), '..', 'yvote_automation');
const PYTHON_BIN = process.env.YVOTE_PYTHON_BIN ?? 'python3';
const APPLY_MODULE =
  'workflow.s06_apply_recovery_stage.p03_apply_approved_actions.apply_approved_now';

function parseActionId(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const id = parseActionId(req.body?.id ?? req.query?.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'id must be a positive integer' });
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      PYTHON_BIN,
      ['-B', '-m', APPLY_MODULE, String(id)],
      {
        cwd: AUTOMATION_CWD,
        maxBuffer: 50 * 1024 * 1024,
      },
    );
    const trimmed = stdout.trim();
    const result = trimmed ? JSON.parse(trimmed.split('\n').at(-1) as string) : null;
    if (!result?.ok) {
      return res.status(500).json({
        success: false,
        error: result?.detail ?? 'apply returned a non-ok result',
        result,
        stderr,
      });
    }
    return res.status(200).json({ success: true, result, stderr });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(500).json({
      success: false,
      error: `approved, but immediate apply failed: ${message}`,
    });
  }
}
