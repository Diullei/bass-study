/** Small randomness helpers used by the exercise and quiz generators. */

export const pick = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]

export const shuffle = <T>(input: readonly T[]): T[] => {
  const a = input.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Weighted pick: returns one key of `w`, with probability proportional to its weight. */
export function wpick(w: Record<string | number, number>): string {
  const ks = Object.keys(w)
  let t = 0
  ks.forEach((k) => (t += w[k]))
  let r = Math.random() * t
  for (const k of ks) {
    r -= w[k]
    if (r <= 0) return k
  }
  return ks[ks.length - 1]
}

/** A repeatable random source. Same seed + salt → same sequence (mulberry32). */
export interface Rng {
  f: () => number
  int: (a: number, b: number) => number
  pick: <T>(a: readonly T[]) => T
  chance: (p: number) => boolean
  wpick: <T>(items: readonly T[], weight: (x: T) => number) => T
}

export function seeded(seed: number, salt = 0): Rng {
  let a = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0
  const f = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  f()
  f()
  return {
    f,
    int: (lo, hi) => lo + Math.floor(f() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(f() * arr.length)],
    chance: (p) => f() < p,
    wpick: (items, weight) => {
      const ws = items.map(weight)
      let r = f() * ws.reduce((x, y) => x + y, 0)
      for (let i = 0; i < items.length; i++) {
        r -= ws[i]
        if (r <= 0) return items[i]
      }
      return items[items.length - 1]
    },
  }
}
