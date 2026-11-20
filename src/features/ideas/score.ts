import { splitSpan } from '../../engine/sixteenths'
import type { Label, MusicEvent, Score } from '../../engine/types'
import type { StringName } from '../../theory/keys'
import { octOf } from '../../theory/notes'
import { spellIn } from './harmony'
import { ROLES, type Idea } from './model'

export interface IdeaScore {
  score: Score
  /** For each idea note, the score events it is written as (several when tied). */
  eventsOf: number[][]
  /** For each score event, the idea note it belongs to (-1 for rests). */
  noteOf: number[]
}

const STRINGS_4: StringName[] = ['E', 'A', 'D', 'G']
const STRINGS_5: StringName[] = ['B', 'E', 'A', 'D', 'G']

/** Write an idea as a Score for the shared staff renderer (notation + tab + interval labels). */
export function ideaToScore(idea: Idea, five: boolean, swing: boolean): IdeaScore {
  const { K, chords, notes, bars, T } = idea
  const strs = five ? STRINGS_5 : STRINGS_4
  const events: MusicEvent[] = []
  const labels: Label[] = []
  const eventsOf: number[][] = notes.map(() => [])
  const noteOf: number[] = []

  // spans covering the whole piece: notes, and rests in the gaps
  const spans: { t: number; len: number; ni: number }[] = []
  let cur = 0
  notes.forEach((n, ni) => {
    if (n.t > cur) spans.push({ t: cur, len: n.t - cur, ni: -1 })
    const end = Math.min(T, n.t + n.dur, notes[ni + 1]?.t ?? T)
    if (end > n.t) spans.push({ t: n.t, len: end - n.t, ni })
    cur = Math.max(cur, end)
  })
  if (cur < T) spans.push({ t: cur, len: T - cur, ni: -1 })

  spans.forEach(({ t, len, ni }) => {
    const n = ni >= 0 ? notes[ni] : null
    const parts: { b: number; p: number; d: number }[] = []
    // split at barlines, then into writable values
    let at = t
    let left = len
    while (left > 0) {
      const b = Math.floor(at / 16)
      const inBar = Math.min(left, (b + 1) * 16 - at)
      let p = at - b * 16
      for (const d of splitSpan(p, inBar, !n)) {
        parts.push({ b, p, d })
        p += d
      }
      at += inBar
      left -= inBar
    }
    parts.forEach((pt, k) => {
      const ev: MusicEvent = { b: pt.b, p: pt.p / 4, d: pt.d / 4, cell: pt.b * 4 + Math.floor(pt.p / 4), ci: pt.b }
      if (!n) ev.rest = true
      else {
        const written = n.midi + 12
        const name = spellIn(n.midi, chords[n.ci], K, n.pref)
        ev.n = name
        ev.o = octOf(name, written)
        ev.m = written
        ev.s = strs[n.str]
        ev.f = n.fret
        if (k < parts.length - 1) ev.tie = true
        ev.cls = [ROLES[n.role].pen, n.seed ? 'pen-marker' : ''].filter(Boolean).join(' ')
        eventsOf[ni].push(events.length)
        if (k === 0 && n.label) labels.push({ b: pt.b, p: pt.p / 4, text: n.label })
      }
      noteOf.push(ni)
      events.push(ev)
    })
  })

  const score: Score = {
    K,
    beats: 4,
    ts: [4, 4],
    bars,
    events,
    // the label row under the tab holds the interval labels, so no roman numerals there
    chords: chords.map((c) => ({ ...c.chord, rn: undefined })),
    labels,
    swing,
  }
  return { score, eventsOf, noteOf }
}
