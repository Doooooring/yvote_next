import type { NextApiRequest, NextApiResponse } from 'next';

import { apiBaseUrl } from '@/utils/server/apiBaseUrl';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: { sizeLimit: '10mb' },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiUrl = apiBaseUrl();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e: any) {
    if (e.name === 'AbortError') {
      res.status(504).json({ error: 'Request timed out' });
    } else {
      res.status(502).json({ error: 'Backend connection failed' });
    }
  }
}
