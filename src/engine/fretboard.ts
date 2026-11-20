import type { Lesson } from '../curriculum/types'
import { makeKey, OPEN, spellPc, type Key, type StringName } from '../theory/keys'
import { mod, octOf, pc } from '../theory/notes'
import { pick } from '../theory/random'
import type { GenSettings, MusicEvent, Pos } from './types'

export const strsOf = (S: Pick<GenSettings, 'strings'>): StringName[] =>
  S.strings === '4' ? ['E', 'A', 'D', 'G'] : ['B', 'E', 'A', 'D', 'G']

export const lessonKey = (L: Lesson): Key => makeKey(L.keys ? pick(L.keys) : L.key || 'C')

/** Parse a pool token like "G2" (string + fret). */
const tokPos = (t: string): Pos => {
  const s = t[0] as StringName
  const f = +t.slice(1)
  return { s, f, m: OPEN[s] + f }
}

/** All fret positions a reading lesson may use. */
export function positions(L: Lesson, K: Key, strs: StringName[]): Pos[] {
  let ps: Pos[] = []
  if (L.pool) ps = L.pool.map(tokPos)
  else if (L.win) {
    const [a, b] = L.win
    strs.forEach((s) => {
      const fr: number[] = []
      if (L.open && a > 0) fr.push(0)
      for (let f = a; f <= b; f++) fr.push(f)
      fr.forEach((f) => {
        const m = OPEN[s] + f
        if (L.chrom || K.scale.some((n) => pc(n) === mod(m, 12))) ps.push({ s, f, m })
      })
    })
  }
  return ps.filter((p) => strs.includes(p.s))
}

/** MIDI pitches this lesson introduces. */
export function newSetOf(L: Lesson, ps: Pos[]): Set<number> {
  const s = new Set<number>()
  if (L.nw) L.nw.forEach((t) => s.add(tokPos(t).m))
  if (L.nwAbove) {
    const above = L.nwAbove
    ps.forEach((p) => {
      if (p.m > above) s.add(p.m)
    })
  }
  return s
}

/** Choose string/fret for each note, keeping the hand in one position as long as possible. */
export function handFinger(evs: MusicEvent[]) {
  let pos = 1
  evs.forEach((e) => {
    if (e.rest || !e.cands || !e.cands.length) return
    let best: Pos | null = null
    let bc = 1e9
    e.cands.forEach((c) => {
      const f = c.f
      const cost =
        f === 0 ? 0.4 : (f < pos ? (pos - f) * 2 : f > pos + 3 ? (f - pos - 3) * 2 : 0) + f * 0.02
      if (cost < bc) {
        bc = cost
        best = c
      }
    })
    const b = best as Pos | null
    if (!b) return
    e.s = b.s
    e.f = b.f
    if (e.f > 0) {
      if (e.f < pos) pos = e.f
      else if (e.f > pos + 3) pos = e.f - 3
      e.finger = e.f - pos + 1
    } else e.finger = 0
  })
}

/** Spell, octave and finger the generated pitches. */
export function finish(evs: MusicEvent[], K: Key, ps: Pos[], chrom?: boolean) {
  const notes = evs.filter((e) => !e.rest)
  notes.forEach((e, k) => {
    const nx = notes[k + 1]
    const m = e.m as number
    if (!e.n) {
      const pref = chrom ? (nx && (nx.m as number) < m ? 'flat' : 'sharp') : undefined
      e.n = spellPc(mod(m, 12), K, pref)
    }
    e.o = octOf(e.n, m)
    e.cands = ps.filter((p) => p.m === m)
  })
  handFinger(evs)
}

/** Fallback candidates when a pitch lies outside the lesson window. */
export const anyCands = (m: number, strs: StringName[]): Pos[] =>
  strs.map((s) => ({ s, f: m - OPEN[s], m })).filter((c) => c.f >= 0 && c.f <= 20)
