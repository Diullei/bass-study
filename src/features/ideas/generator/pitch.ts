import type { IdeaChord } from '../model'
import type { Ctx } from './context'

/** Pitch helpers. Pitches are sounding MIDI numbers; sets are semitones above the chord root. */

export const pcOf = (m: number) => ((m % 12) + 12) % 12
export const inSet = (m: number, ch: IdeaChord, ivs: number[]) => ivs.includes(pcOf(m - ch.root))

export function notesIn(ch: IdeaChord, ivs: number[], lo: number, hi: number): number[] {
  const r: number[] = []
  for (let m = lo; m <= hi; m++) if (inSet(m, ch, ivs)) r.push(m)
  return r
}

export function idxNearest(list: number[], x: number): number {
  let bi = 0
  for (let i = 1; i < list.length; i++) if (Math.abs(list[i] - x) < Math.abs(list[bi] - x)) bi = i
  return bi
}
export const nearest = (list: number[], x: number) => list[idxNearest(list, x)]

/** The closest scale note (searching down first). */
export function snapScale(m: number, ch: IdeaChord): number {
  for (let d = 0; d < 7; d++) {
    if (inSet(m - d, ch, ch.scale)) return m - d
    if (inSet(m + d, ch, ch.scale)) return m + d
  }
  return m
}

/** Distance between two pitch classes around the circle. */
export const circ = (a: number, b: number) => {
  const d = Math.abs(a - b) % 12
  return Math.min(d, 12 - d)
}

/** Move by octaves into the bass's range. */
export function fitRange(m: number, ctx: Pick<Ctx, 'lo' | 'hi'>): number {
  while (m < ctx.lo) m += 12
  while (m > ctx.hi) m -= 12
  return m
}

/** Into range, in the octave closest to `ref` (no sudden octave jumps inside a run). */
export function fitNear(m: number, ref: number, ctx: Pick<Ctx, 'lo' | 'hi'>): number {
  let best = fitRange(m, ctx)
  for (const c of [best - 12, best + 12]) if (c >= ctx.lo && c <= ctx.hi && Math.abs(c - ref) < Math.abs(best - ref)) best = c
  return best
}

const CT_LABEL: Record<number, string> = { 0: 'R', 3: '♭3', 4: '3', 6: '♭5', 7: '5', 9: '6', 10: '♭7', 11: '7' }
const NCT_LABEL: Record<number, string> = { 0: 'R', 1: '♭9', 2: '9', 3: '♯9', 4: '3', 5: '11', 6: '♯11', 7: '5', 8: '♭13', 9: '13', 10: '♭7', 11: '7' }

/** The note's job against the chord: R, 3, ♭7, 9 … */
export function ivLabel(m: number, ch: IdeaChord): string {
  const iv = pcOf(m - ch.root)
  return ch.tones.includes(iv) ? CT_LABEL[iv] : NCT_LABEL[iv]
}

/** "bar 2, beat 3 &" */
export function beatName(t: number): string {
  const s = ['', 'e', '&', 'a'][t % 4]
  return `bar ${Math.floor(t / 16) + 1}, beat ${Math.floor((t % 16) / 4) + 1}${s ? ' ' + s : ''}`
}
