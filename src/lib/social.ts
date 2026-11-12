export function upPercent(up: number, down: number) {
  const t = up + down;
  return t === 0 ? 0 : Math.round((up / t) * 100);
}
export function topRated<T extends { votesUp: number; votesDown: number }>(posts: T[], n = 6) {
  return [...posts].sort((a, b) => upPercent(b.votesUp, b.votesDown) - upPercent(a.votesUp, a.votesDown)).slice(0, n);
}
