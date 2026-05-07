const isServer = typeof window === 'undefined';
const isLocal =
  !isServer &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.'));
export const HOST_URL = isServer
  ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000'
  : isLocal
  ? `http://${window.location.hostname}:3000`
  : '/proxy-api';
