import { assignFrets } from '../../engine/fretPath'
import { iv, mod, pc, type Note } from '../../theory/notes'
import { intervalOver, PENT } from '../../theory/pentatonic'
import type { Rng } from '../../theory/random'
import { OUTSIDE_PEN, type DrillChord, type PNote } from './model'

/**
 * Line builders for the drills. Everything is on a 16th grid; no note crosses a beat,
 * so every line can be written without ties.
 */

export interface Range {
  lo: number
  hi: number
}
export const rangeFor = (five: boolean): Range => ({ lo: five ? 23 : 28, hi: 57 })

/** All pitches of a pitch-class set inside the range, low to high. */
export function ladder(pcs: number[], r: Range): number[] {
  const out: number[] = []
  for (let m = r.lo; m <= r.hi; m++) if (pcs.includes(mod(m, 12))) out.push(m)
  return out
}

const nearestIdx = (l: number[], x: number) => l.reduce((b, m, i) => (Math.abs(m - x) < Math.abs(l[b] - x) ? i : b), 0)

export type Slot = { t: number; dur: number; rest?: boolean }

/** Beat patterns (16ths; negative = rest) per level. */
const BEATS: { p: number[]; w: [number, number, number] }[] = [
  { p: [2, 2], w: [1, 0.45, 0.3] },
  { p: [4], w: [0.1, 0.15, 0.08] },
  { p: [-2, 2], w: [0, 0.14, 0.1] },
  { p: [2, -2], w: [0, 0.08, 0.05] },
  { p: [1, 1, 2], w: [0, 0.08, 0.14] },
  { p: [2, 1, 1], w: [0, 0.08, 0.14] },
  { p: [1, 1, 1, 1], w: [0, 0.02, 0.2] },
  { p: [3, 1], w: [0, 0.05, 0.06] },
]

/**
 * Rhythm for `bars` bars. level 0 = straight 8ths, 1 = mixed, 2 = with 16ths.
 * Phrases are two bars; the last beat of a phrase is usually a breath.
 */
export function rhythm(bars: number, level: 0 | 1 | 2, R: Rng, breath = true): Slot[] {
  const out: Slot[] = []
  for (let beat = 0; beat < bars * 4; beat++) {
    const t0 = beat * 4
    if (breath && beat % 8 === 7 && (level > 0 || R.chance(0.6))) {
      out.push({ t: t0, dur: 4, rest: true })
      continue
    }
    const b = R.wpick(BEATS, (x) => x.w[level])
    let t = t0
    for (const d of b.p) {
      out.push(d < 0 ? { t, dur: -d, rest: true } : { t, dur: d })
      t += Math.abs(d)
    }
  }
  return out
}

export interface WalkOpts {
  /** Weave: switch pentatonic after at most this many notes (the 4-note limit). 0 = stay. */
  maxRun: number
  /** Which pentatonic to use when not weaving. */
  only?: number
  /** Force a set at a time (side-slipping). */
  setAt?: (t: number) => number | null
  start?: number
}

/**
 * A melodic line through pentatonics. Mostly steps, some skips, changes direction now and then.
 * Weaving: after 2…maxRun notes it moves to an adjacent pentatonic, to the nearest note in the
 * direction it is going — which is often the same pitch (a repeated note) or a wider interval.
 */
export function walk(slots: Slot[], chords: DrillChord[], r: Range, R: Rng, o: WalkOpts): PNote[] {
  const out: PNote[] = []
  let s = o.only ?? 0
  let cur = o.start ?? Math.round((r.lo + 12 + r.hi) / 2) - 4
  let dir = R.chance(0.5) ? 1 : -1
  let run = 0
  let limit = o.maxRun ? R.int(2, o.maxRun) : 1e9
  let lastCi = -1
  const restAt = new Set(slots.filter((x) => x.rest).map((x) => x.t))
  slots.forEach((slot, k) => {
    const ci = Math.min(chords.length - 1, Math.floor(slot.t / 16))
    const ch = chords[ci]
    if (slot.rest) {
      out.push({ ...slot, midi: 0, set: -1, ci, str: 0, fret: 0, label: '', pen: '' })
      return
    }
    let jump = false
    const forced = o.setAt?.(slot.t)
    if (forced != null) {
      jump = forced !== s
      s = forced
    } else if (ci !== lastCi) {
      s = o.maxRun ? R.int(0, ch.sets.length - 1) : Math.min(o.only ?? 0, ch.sets.length - 1)
      jump = true
      run = 0
    } else if (o.maxRun && run >= limit && ch.sets.length > 1) {
      const n = ch.sets.length
      s = s === 0 ? 1 : s === n - 1 ? n - 2 : R.chance(0.5) ? s - 1 : s + 1
      limit = R.int(2, o.maxRun)
      run = 0
      jump = true
    }
    lastCi = ci
    const set = ch.sets[s]
    const lad = ladder(set.pcs, r)
    let midi: number
    if (!out.some((n) => !n.rest)) midi = lad[nearestIdx(lad, cur)]
    else if (jump) {
      // the nearest note of the new pentatonic, going the same way (the same pitch counts: a repeated note)
      const same = lad.includes(cur) && R.chance(0.5)
      const ahead = lad.filter((m) => (dir > 0 ? m > cur : m < cur))
      midi = same ? cur : ahead.length ? (dir > 0 ? ahead[0] : ahead[ahead.length - 1]) : lad[nearestIdx(lad, cur)]
    } else {
      const i = lad.indexOf(cur) >= 0 ? lad.indexOf(cur) : nearestIdx(lad, cur)
      const mv = R.chance(0.78) ? 1 : 2
      let ni = i + dir * mv
      if (ni < 0 || ni >= lad.length || Math.abs(lad[ni] - cur) > 7) {
        dir = -dir
        ni = i + dir * mv
      }
      ni = Math.max(0, Math.min(lad.length - 1, ni))
      midi = lad[ni]
      if (R.chance(0.18)) dir = -dir
    }
    // the note before a breath lands on a chord tone if this pentatonic has one nearby
    const nxt = slots[k + 1]
    if (!nxt || restAt.has(nxt.t)) {
      const ct = lad.filter((m) => ch.tones.includes(mod(m - ch.rootPc, 12)) && Math.abs(m - midi) <= 3)
      if (ct.length) midi = ct[nearestIdx(ct, midi)]
    }
    // keep the line moving across the range
    if (midi >= r.hi - 2) dir = -1
    if (midi <= r.lo + 3) dir = 1
    cur = midi
    run++
    out.push({ ...slot, midi, set: s, ci, str: 0, fret: 0, label: '', pen: set.pen, note: spell(midi, set.notes) })
  })
  return out
}

export const spell = (midi: number, notes: Note[]) => notes.find((n) => pc(n) === mod(midi, 12))

/** Fill in strings/frets and interval labels. */
export function finishLine(notes: PNote[], chords: DrillChord[], five: boolean): PNote[] {
  const sounding = notes.filter((n) => !n.rest)
  assignFrets(sounding, five)
  sounding.forEach((n) => {
    if (!n.label) n.label = intervalOver(n.midi, chords[n.ci].rootPc, chords[n.ci].tones)
  })
  return notes
}

/** Up and down a pentatonic in 8ths, from its lowest root, over `octaves`. */
export function scaleRun(ch: DrillChord, setIdx: number, octaves: number, r: Range): PNote[] {
  const set = ch.sets[setIdx]
  const lad = ladder(set.pcs, { lo: r.lo, hi: r.hi + 6 })
  const rootPc = pc(set.root)
  const start = lad.findIndex((m) => mod(m, 12) === rootPc)
  const top = lad.indexOf(lad[start] + 12 * octaves)
  const up = lad.slice(start, top + 1)
  const seq = [...up, ...up.slice(0, -1).reverse()]
  return toEighths(seq, ch, setIdx)
}

/** Sequences through one octave and back: groups of 3, groups of 4, or in 4ths (every other note). */
export function sequenceRun(ch: DrillChord, setIdx: number, pattern: '3s' | '4s' | '4ths', r: Range): PNote[] {
  const set = ch.sets[setIdx]
  const lad = ladder(set.pcs, { lo: r.lo, hi: r.hi + 6 })
  const start = lad.findIndex((m) => mod(m, 12) === pc(set.root))
  const n = PENT[set.ref.kind].steps.length
  const up: number[] = []
  const down: number[] = []
  const g = pattern === '3s' ? 3 : 4
  for (let i = 0; i < n; i++) {
    if (pattern === '4ths') {
      up.push(lad[start + i], lad[start + i + 2])
      down.push(lad[start + n - i + 2], lad[start + n - i])
    } else {
      for (let j = 0; j < g; j++) up.push(lad[start + i + j])
      for (let j = 0; j < g; j++) down.push(lad[start + n + 2 - i - j])
    }
  }
  return toEighths([...up, ...down, lad[start]].filter((m) => m != null), ch, setIdx)
}

function toEighths(seq: number[], ch: DrillChord, setIdx: number): PNote[] {
  const set = ch.sets[setIdx]
  const out: PNote[] = seq.map((midi, i) => ({
    t: i * 2,
    dur: 2,
    midi,
    note: spell(midi, set.notes),
    set: setIdx,
    ci: 0,
    str: 0,
    fret: 0,
    label: '',
    pen: set.pen,
  }))
  // hold the last note to the end of its beat
  const last = out[out.length - 1]
  last.dur = 4 - (last.t % 4)
  return out
}

/** Riff templates on a minor pentatonic: [16th, step from the root (−1 = ♭7 below, 5 = octave), length]. */
const RIFFS: [number, number, number][][] = [
  [[0, 0, 3], [3, 0, 1], [6, 4, 2], [8, 5, 2], [10, 4, 2], [12, 3, 2], [14, 2, 2]],
  [[0, 0, 2], [2, 0, 2], [4, -1, 2], [6, 0, 2], [8, 1, 2], [10, 2, 2], [12, 3, 4]],
  [[0, 0, 1], [2, 5, 1], [3, 0, 1], [6, 4, 2], [8, 0, 2], [11, 0, 1], [12, 3, 2], [14, 4, 2]],
  [[0, 0, 4], [4, 3, 2], [6, 4, 2], [8, 5, 4], [12, 4, 2], [14, 3, 2]],
  [[0, 0, 2], [2, 1, 2], [4, 2, 2], [6, 3, 2], [8, 4, 4], [12, 3, 4]],
  [[0, 0, 2], [3, 0, 1], [4, 3, 2], [6, 0, 2], [10, 4, 2], [12, 5, 1], [13, 4, 1], [14, 3, 2]],
]

/** A one-bar riff, played three times and answered with a fill in bar 4. */
export function riffLine(ch: DrillChord, r: Range, R: Rng): PNote[] {
  const set = ch.sets[0]
  const lad = ladder(set.pcs, { lo: r.lo, hi: r.hi + 8 })
  // a root with the ♭7 below it and an octave and a 5th above it
  const ri = lad.findIndex((m, i) => mod(m, 12) === pc(set.root) && i >= 1 && i + 7 < lad.length)
  const T = R.pick(RIFFS)
  const out: PNote[] = []
  for (let b = 0; b < 4; b++) {
    const body = b < 3 ? T : T.filter(([t]) => t < 8)
    body.forEach(([t, st, d]) => {
      const midi = lad[ri + st]
      out.push({ t: b * 16 + t, dur: d, midi, note: spell(midi, set.notes), set: 0, ci: b, str: 0, fret: 0, label: '', pen: set.pen })
    })
    if (b === 3) {
      // fill: walk down the pentatonic into the root
      let i = ri + R.int(3, 5)
      for (let t = 8; t < 16; t += 2) {
        const midi = lad[Math.max(ri, i--)]
        out.push({ t: 48 + t, dur: 2, midi, note: spell(midi, set.notes), set: 0, ci: 3, str: 0, fret: 0, label: '', pen: set.pen })
      }
    }
  }
  // gaps become rests
  const filled: PNote[] = []
  let cur = 0
  out.forEach((n) => {
    if (n.t > cur) for (let t = cur; t < n.t; ) {
      const d = Math.min(n.t - t, 4 - (t % 4))
      filled.push({ t, dur: d, rest: true, midi: 0, set: -1, ci: Math.floor(t / 16), str: 0, fret: 0, label: '', pen: '' })
      t += d
    }
    filled.push(n)
    cur = n.t + n.dur
  })
  return filled
}

/**
 * Blue notes: between the 4th and 5th of the minor pentatonic (or the 2nd and 3rd of the major),
 * split the first 8th and pass through the note in between — ♯4 going up, ♭5 coming down.
 */
export function addBlueNotes(notes: PNote[], ch: DrillChord, R: Rng, major = false): PNote[] {
  const root = ch.sets[0].root
  const [a, b] = major ? [2, 4] : [5, 7]
  const out: PNote[] = []
  notes.forEach((n, i) => {
    const nx = notes[i + 1]
    const x = mod(n.midi - pc(root), 12)
    const y = nx ? mod(nx.midi - pc(root), 12) : -1
    const up = x === a && y === b && nx.midi > n.midi
    const down = !major && x === b && y === a && nx.midi < n.midi
    if (!n.rest && nx && !nx.rest && n.dur === 2 && (n.t % 4) + 2 <= 4 && (up || down) && R.chance(0.75)) {
      out.push({ ...n, dur: 1 })
      const blue = major ? iv(root, 3, 3) : up ? iv(root, 4, 6) : iv(root, 5, 6)
      out.push({ ...n, t: n.t + 1, dur: 1, midi: n.midi + (up ? 1 : -1), note: { l: blue.l, a: blue.a }, set: -1, pen: OUTSIDE_PEN, label: major ? '♭3' : up ? '♯4' : '♭5' })
    } else out.push(n)
  })
  return out
}
