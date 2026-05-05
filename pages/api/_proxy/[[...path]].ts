/**
 * Dev-only auto-auth proxy for `/proxy-api/*`.
 *
 * In production this passes through verbatim. In dev, if YVOTE_ADMIN_TOKEN
 * is set in `.env.development`, every forwarded request gets an
 * `Authorization: Bearer <token>` header so AdminGuard.checkAuthToken
 * passes without a JWT cookie. The /adminjae2 endpoints are excluded:
 * they use the page-local password gate instead of the old auth system.
 *
 * Wired in via `next.config.js`: the public path stays `/proxy-api/:path*`
 * (so HOST_URL config doesn't change) and the rewrite forwards to
 * `/api/_proxy/:path*`, which is this handler.
 *
 * Hard requirement: do NOT inject the admin token in production. Anyone
 * hitting yvoting.com/proxy-api/* would otherwise get free admin access.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import { apiBaseUrl } from '@/utils/server/apiBaseUrl';

export const config = { api: { bodyParser: false } };

const INTERNAL_API_URL = apiBaseUrl();
const ADMIN_TOKEN = process.env.YVOTE_ADMIN_TOKEN;
const IS_DEV = process.env.NODE_ENV !== 'production';
const SHOULD_INJECT = IS_DEV && !!ADMIN_TOKEN;
const ADMINJAE2_OPEN_PATHS = ['proposed-action', 'incident'];

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

function readBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function isAdminJae2OpenPath(path: string) {
  const firstSegment = path.split('/')[0];
  return ADMINJAE2_OPEN_PATHS.includes(firstSegment);
}

export function shouldInjectAdminToken(
  path: string,
  headers: Record<string, string>,
) {
  return (
    SHOULD_INJECT &&
    !isAdminJae2OpenPath(path) &&
    !headers.authorization &&
    !headers.Authorization
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // [[...path]] gives us req.query.path as string[] | undefined.
  const segments = ([] as string[]).concat(
    (req.query.path as string[] | string | undefined) || [],
  );
  const path = segments.join('/');
  // Preserve query string (Next strips it from req.query when there's a
  // catch-all match overlap; safer to read off req.url).
  const qIdx = (req.url || '').indexOf('?');
  const search = qIdx >= 0 ? (req.url as string).slice(qIdx) : '';
  const target = `${INTERNAL_API_URL}/${path}${search}`;

  const method = (req.method || 'GET').toUpperCase();
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : await readBody(req);

  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (HOP_BY_HOP.has(k.toLowerCase())) continue;
    if (typeof v === 'string') headers[k] = v;
    else if (Array.isArray(v)) headers[k] = v.join(', ');
  }
  if (isAdminJae2OpenPath(path)) {
    delete headers.authorization;
    delete headers.Authorization;
    delete headers.cookie;
    delete headers.Cookie;
  }
  if (shouldInjectAdminToken(path, headers)) {
    headers.authorization = `Bearer ${ADMIN_TOKEN}`;
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: body && body.length ? body : undefined,
      redirect: 'manual',
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (HOP_BY_HOP.has(key.toLowerCase())) return;
      // content-encoding gets handled by fetch (already decompressed),
      // forwarding it would mis-frame the body for the browser.
      if (key.toLowerCase() === 'content-encoding') return;
      res.setHeader(key, value);
    });
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.end(buf);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // eslint-disable-next-line no-console
    console.error('[/api/_proxy] upstream error:', target, msg);
    res.status(502).json({ error: 'proxy error', target, message: msg });
  }
}
