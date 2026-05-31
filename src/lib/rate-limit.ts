type Entry = { count: number; reset: number };
const buckets = new Map<string, Entry>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const e = buckets.get(key);
  if (!e || e.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (e.count >= limit) return { ok: false, remaining: 0, reset: e.reset };
  e.count += 1;
  return { ok: true, remaining: limit - e.count, reset: e.reset };
}

export function hashIp(ip: string) {
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) | 0;
  return h.toString(36);
}
