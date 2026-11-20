import { splitSpan } from '../../engine/sixteenths'
import type { Label, MusicEvent, Score } from '../../engine/types'
import type { StringName } from '../../theory/keys'
import { octOf } from '../../theory/notes'
import type { Line } from './model'

const STR4: StringName[] = ['E', 'A', 'D', 'G']
const STR5: StringName[] = ['B', 'E', 'A', 'D', 'G']

/** Write a line as a Score: notation, tab, chord symbols, interval labels, pens. */
export function lineToScore(line: Line, five: boolean): Score {
  const strs = five ? STR5 : STR4
  const events: MusicEvent[] = []
  const labels: Label[] = []
  line.notes.forEach((n) => {
    let at = n.t
    let left = n.dur
    const parts: { b: number; p: number; d: number }[] = []
    while (left > 0) {
      const b = Math.floor(at / 16)
      const inBar = Math.min(left, (b + 1) * 16 - at)
      let p = at - b * 16
      for (const d of splitSpan(p, inBar, !!n.rest)) {
        parts.push({ b, p, d })
        p += d
      }
      at += inBar
      left -= inBar
    }
    parts.forEach((pt, k) => {
      const ev: MusicEvent = { b: pt.b, p: pt.p / 4, d: pt.d / 4, cell: pt.b * 4 + Math.floor(pt.p / 4), ci: pt.b }
      if (n.rest || !n.note) ev.rest = true
      else {
        const written = n.midi + 12
        ev.n = n.note
        ev.o = octOf(n.note, written)
        ev.m = written
        ev.s = strs[n.str]
        ev.f = n.fret
        if (k < parts.length - 1) ev.tie = true
        if (n.pen) ev.cls = n.pen
        if (k === 0 && n.label) labels.push({ b: pt.b, p: pt.p / 4, text: n.label })
      }
      events.push(ev)
    })
  })
  return {
    K: line.K,
    beats: 4,
    ts: [4, 4],
    bars: line.bars,
    events,
    chords: line.chords.map((c, b) => ({ ...c.chord, start: b * 4, dur: 4, rn: undefined })),
    labels,
  }
}
