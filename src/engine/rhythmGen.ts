import type { Lesson } from '../curriculum/types'
import { CELLS, CELLW, cellsFor } from '../theory/rhythm'
import { wpick } from '../theory/random'
import type { MusicEvent } from './types'

const near = (a: number, b: number) => Math.abs(a - b) < 1e-6

interface BarOpts {
  first?: boolean
  final?: boolean
  /** End on a long note (phrase cadence). */
  endLong?: boolean
}

/** One bar of rhythm built from the allowed cells. */
export function oneBar(cells: string[], beats: number, compound: boolean, o: BarOpts): MusicEvent[] {
  const W: Record<string, number> = {}
  cells.forEach((c) => (W[c] = CELLW[c] || 1))
  const mk = (c: string): MusicEvent[] => {
    let p = 0
    return CELLS[c].ev.map(([d, f]) => {
      const e: MusicEvent = { d, p, cell: 0, b: 0, rest: f === 'r', tie: f === 't', trip: f === '3' }
      p += d
      return e
    })
  }
  if (o.final) {
    const fin = compound ? 'dh' : beats === 4 ? 'w' : beats === 3 ? 'hd' : 'h'
    if (W[fin]) return mk(fin)
  }
  let reserve = 0
  let longC: string | null = null
  if (o.endLong && !o.final) {
    longC = compound ? 'dq' : beats === 2 ? null : 'h'
    if (longC && W[longC]) reserve = CELLS[longC].b
    else longC = null
  }
  const out: MusicEvent[] = []
  let p = 0
  let rests = 0
  let cid = 0
  const room = () => beats - reserve - p
  while (room() > 1e-6) {
    const cand: Record<string, number> = {}
    for (const c in W) {
      const C = CELLS[c]
      if (!!C.c68 !== !!compound) continue
      if (C.b > room() + 1e-6) continue
      if (compound) {
        if (!near(p % 1.5, 0) && !near(p % 1.5, 1.5)) continue
        if (C.b === 3 && p > 0) continue
      } else {
        if (C.b >= 3 && p > 0) continue
        if (C.b === 2 && beats === 4 && !near(p % 2, 0)) continue
      }
      const hasRest = C.ev.some((e) => e[1] === 'r')
      if (hasRest && (rests >= 1 || (o.first && p === 0) || o.final)) continue
      if (hasRest && C.ev.every((e) => e[1] === 'r') && C.b >= beats) continue
      cand[c] = W[c]
    }
    const c = Object.keys(cand).length ? wpick(cand) : null
    if (!c) {
      const r = room()
      out.push({ d: r, cell: cid++, p, b: 0 })
      p += r
      continue
    }
    if (CELLS[c].ev.some((e) => e[1] === 'r')) rests++
    CELLS[c].ev.forEach(([d, f]) => {
      out.push({ d, p, b: 0, rest: f === 'r', tie: f === 't', trip: f === '3', cell: cid })
      p += d
    })
    p = Math.round(p * 1e6) / 1e6
    cid++
  }
  if (longC) out.push({ d: CELLS[longC].b, p, b: 0, cell: cid++ })
  const last = out[out.length - 1]
  if ((o.final || o.endLong) && last.rest) last.rest = false
  if (last.tie) last.tie = false
  return out
}

/** Bars of rhythm in 4-bar phrases; bar 3 of a phrase often repeats bar 1. */
export function phraseRhythm(L: Lesson, bars: number): MusicEvent[][] {
  const beats = L.time === 6 ? 3 : L.time
  const comp = L.time === 6
  const cells = cellsFor(L)
  const rb: MusicEvent[][] = []
  for (let b = 0; b < bars; b++) {
    const ph = b % 4
    const final = b === bars - 1
    const cad = ph === 3
    let bar: MusicEvent[]
    if (ph === 2 && !final && Math.random() < 0.6) bar = rb[b - 2].map((e) => ({ ...e }))
    else bar = oneBar(cells, beats, comp, { first: b === 0, final, endLong: cad })
    bar.forEach((e) => {
      e.b = b
      e.cell = b * 100 + ((e.cell as number) % 100 || 0)
    })
    rb.push(bar)
  }
  return rb
}
