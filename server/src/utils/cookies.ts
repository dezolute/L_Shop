import { Request } from 'express';

export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }
  return header.split(';').reduce<Record<string, string>>((acc, pair) => {
    const [rawKey, ...rawValue] = pair.trim().split('=');
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue.join('='));
    acc[key] = value;
    return acc;
  }, {});
}
