import { spawn } from 'child_process';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

const AUTOMATION_CWD =
  process.env.YVOTE_AUTOMATION_CWD ?? path.resolve(process.cwd(), '..', 'yvote_automation');
const PYTHON_BIN = process.env.YVOTE_PYTHON_BIN ?? 'python3';
const APPLY_MODULE =
  'workflow.s06_apply_recovery_stage.p03_apply_approved_actions.apply_approved_many_now';

function parseIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) =>
          typeof item === 'number' ? item : typeof item === 'string' ? Number(item) : NaN,
        )
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ids = parseIds(req.body?.ids);
  if (!ids.length) {
    return res.status(400).json({ success: false, error: 'ids must contain positive integers' });
  }

  const child = spawn(
    PYTHON_BIN,
    ['-B', '-m', APPLY_MODULE, ...ids.map(String)],
    {
      cwd: AUTOMATION_CWD,
      detached: true,
      stdio: 'ignore',
    },
  );
  child.unref();

  return res.status(202).json({
    success: true,
    result: {
      started: true,
      ids,
      pid: child.pid,
    },
  });
}
