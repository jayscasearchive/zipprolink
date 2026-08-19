/**
 * Deterministic ZIP hash. Same input always yields the same unsigned 32-bit
 * value so a page is stable across refreshes but distinct across ZIP codes.
 */
export function hashZipCode(zipCode: string, salt = ""): number {
  const digits = zipCode.replace(/\D/g, "") || "0";
  const numeric = Number.parseInt(digits, 10) || 0;
  const input = `${digits}:${salt}`;

  let hash = 2166136261 ^ numeric;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
  hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
  return (hash ^ (hash >>> 16)) >>> 0;
}

export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(hash: number, length: number, slot = 0): number {
  if (length <= 0) return 0;
  const mixed = Math.imul(hash ^ (slot * 2654435761), 1597334677) >>> 0;
  return mixed % length;
}

export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickUnique<T>(
  items: readonly T[],
  seed: number,
  count: number,
): T[] {
  const size = Math.min(Math.max(count, 0), items.length);
  return seededShuffle(items, seed).slice(0, size);
}
