import path from 'path';

export function automationDir() {
  return process.env.YVOTE_AUTOMATION_DIR || path.resolve(process.cwd(), '../yvote_automation');
}

export function automationPython() {
  const configured = process.env.YVOTE_AUTOMATION_PYTHON?.trim();
  if (configured) return configured;
  return process.platform === 'win32' ? 'python' : 'python3';
}
