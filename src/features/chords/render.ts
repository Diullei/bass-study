import { PATTERNS, type Pattern, type PatternId, type Who } from './patterns'
import { swing8, type Bar, type CNote } from './sound'
import { analyse, parseSym, type Analysis } from './voicing'

// ───────────── what a shape is, for drawing and playing ─────────────

const GUIDE = new Set(['3', '♭3', '7', '♭7', '6', '°7', '4'])
const TENSION = new Set(['9', '♭9', '♯9', '11', '♯11', '13', '♭13'])

/** The pen of a degree: root filled, 3rd/7th (the guide tones) green, colours blue, the 5th plain ink. */
export const penOf = (deg: string) => (GUIDE.has(deg) ? 'pen-green' : TENSION.has(deg) ? 'pen-blue' : undefined)

export interface ShapeInfo {
  sym: string
  shape: string
  a: Analysis
  /** Sounding notes, low to high. */
  midis: number[]
  /** The thumb's note: the shape's own root when it is at the bottom, else null (the root is left to the thumb or the loop). */
  thumb: number | null
  /** The fingers' notes, low to high. */
  fingers: number[]
  /** The chord's root in the bass register (E1–D♯2), for the loop and for rootless shapes. */
  root: number
  rootless: boolean
}

const cache = new Map<string, ShapeInfo>()

export function info(sym: string, shape: string): ShapeInfo {
  const k = sym + '|' + shape
  const hit = cache.get(k)
  if (hit) return hit
  const a = analyse(sym, shape)
  const midis = a.notes.map((n) => n.midi)
  const low = a.notes[0]
  const hasThumb = !!low && low.deg === 'R' && !low.harmonic && a.notes.length > 1
  const pc = parseSym(sym).root
  const root = 28 + ((pc - 4 + 12) % 12)
  const out: ShapeInfo = {
    sym,
    shape,
    a,
    midis,
    thumb: hasThumb ? low.midi : null,
    fingers: hasThumb ? midis.slice(1) : midis,
    root,
    rootless: !a.notes.some((n) => n.deg === 'R'),
  }
  cache.set(k, out)
  return out
}

/** "Cmaj7 | x-8-x-9-9 | form A" → its parts. */
export function parseRow(row: string) {
  const [sym, shape, ...rest] = row.split('|').map((x) => x.trim())
  return { sym, shape, note: rest.join(' | ') }
}

/** "Dm7:x-10-x-10-10 G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9" → bars of chords. */
export function parseBars(bars: string): { sym: string; shape: string }[][] {
  return bars.split('|').map((b) =>
    b
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((tok) => {
        const i = tok.indexOf(':')
        return { sym: tok.slice(0, i), shape: tok.slice(i + 1) }
      }),
  )
}

// ───────────── one shape, one texture ─────────────

export type Texture = 'block' | 'roll'

/** A shape sounding once: block (together) or roll (low to high). Rootless shapes get the root from the thumb when `addRoot`. */
export function shapeBar<C>(s: ShapeInfo, texture: Texture, beats: number, cue: C, addRoot: boolean): Bar<C> {
  const notes: CNote[] = []
  const all = [...(s.thumb == null && addRoot ? [s.root] : []), ...s.midis]
  const harm = new Set(s.a.notes.filter((n) => n.harmonic || n.artificial).map((n) => n.midi))
  all.forEach((m, i) => notes.push({ t: texture === 'roll' ? i * 0.12 : 0, midi: m, dur: beats - 0.1, vel: 0.8, harm: harm.has(m) }))
  return { notes, cues: [{ t: 0, v: cue }], beats }
}

// ───────────── patterns ─────────────

/** The notes one hit plays. */
function hitNotes(s: ShapeInfo, who: Who, withThumb: boolean): number[][] {
  const thumb = s.thumb ?? (withThumb ? s.root : null)
  const F = s.fingers
  switch (who) {
    case 'T':
      return thumb == null ? [] : [[thumb]]
    case 'T5':
      return thumb == null ? [] : [[thumb - 5 >= 23 ? thumb - 5 : thumb + 7]]
    case 'F':
      return [F]
    case 'all':
      return [[...(thumb != null ? [thumb] : []), ...F]]
    case 'roll':
      return [...(thumb != null ? [thumb] : []), ...F].map((m) => [m])
    default:
      return F[who] != null ? [[F[who]]] : []
  }
}

export interface PatCue {
  /** Chord index in the progression. */
  chord: number
  /** Eighth-note step in the pattern. */
  step: number
  /** Bar index in the loop. */
  bar: number
}

/**
 * The player's part for one bar: `chords` are the chords of this bar (one or two), each taking an equal share.
 * `barInPattern` picks the half of a two-bar pattern. `withThumb` lets the thumb add the root to rootless shapes.
 */
export function patternNotes(chords: { s: ShapeInfo; index: number }[], p: Pattern, barInPattern: number, withThumb: boolean): { notes: CNote[]; at: (slot: number) => number } {
  const notes: CNote[] = []
  const per = 8 / chords.length
  const harmOf = (s: ShapeInfo) => new Set(s.a.notes.filter((n) => n.harmonic || n.artificial).map((n) => n.midi))
  for (const h of p.hits) {
    const slot = h.at - barInPattern * 8
    if (slot < 0 || slot >= 8) continue
    const k = Math.min(chords.length - 1, Math.floor(slot / per))
    const s = chords[k].s
    const groups = hitNotes(s, h.who, withThumb)
    const harm = harmOf(s)
    const t = swing8(slot, p.feel)
    const until = Math.min((k + 1) * per, slot + h.len)
    const dur = Math.max(0.3, swing8(until, p.feel) - t - 0.05)
    groups.forEach((g, gi) =>
      g.forEach((m) => notes.push({ t: t + (h.who === 'roll' ? gi * 0.14 : 0), midi: m, dur, vel: h.acc ? 0.95 : 0.75, harm: harm.has(m) })),
    )
  }
  return { notes, at: (slot) => swing8(slot, p.feel) }
}

export interface AlongOpts {
  pattern: PatternId
  drums: boolean
  /** The loop plays the roots (the looper of Chapter 12). */
  roots: boolean
  /** The demo plays the shapes (switch it off to play them yourself). */
  part: boolean
  /** Walking line, one array of midi notes per bar. */
  walk?: number[][]
}

/** Bar i of a play-along loop over `bars` (it wraps around). */
export function alongBar(bars: { sym: string; shape: string }[][], i: number, o: AlongOpts): Bar<PatCue> {
  const p = PATTERNS[o.pattern]
  const bi = i % bars.length
  let idx = 0
  for (let k = 0; k < bi; k++) idx += bars[k].length
  const chords = bars[bi].map((c, k) => ({ s: info(c.sym, c.shape), index: idx + k }))
  const notes: CNote[] = []
  if (o.part) notes.push(...patternNotes(chords, p, i % p.bars, !o.roots).notes)
  if (o.roots) {
    const W = o.walk?.[bi]
    if (W && W.length) W.forEach((m, k) => notes.push({ t: k * (4 / W.length), midi: m, dur: 4 / W.length - 0.08, vel: k ? 0.7 : 0.85 }))
    else if (chords.length === 1) {
      const r = chords[0].s.root
      notes.push({ t: 0, midi: r, dur: 1.9, vel: 0.85 }, { t: 2, midi: r - 5 >= 23 ? r - 5 : r + 7, dur: 1.9, vel: 0.7 })
    } else chords.forEach((c, k) => notes.push({ t: (k * 4) / chords.length, midi: c.s.root, dur: 4 / chords.length - 0.1, vel: 0.85 }))
  }
  const cues = []
  for (let step = 0; step < 8; step++) {
    const k = Math.min(chords.length - 1, Math.floor(step / (8 / chords.length)))
    cues.push({ t: swing8(step, p.feel), v: { chord: chords[k].index, step: (i % p.bars) * 8 + step, bar: bi } })
  }
  return { notes, cues, beats: 4, drums: o.drums ? p.feel : null }
}

/** Note names with octave ("Ab2", "C#2", "B♭1") → midi. */
export function midiOfName(n: string): number {
  const m = n.replace('♭', 'b').replace('♯', '#').match(/^([A-G])(b|#)?(-?\d)$/)
  if (!m) throw new Error('bad note ' + n)
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]]!
  return 12 * (+m[3] + 1) + base + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0)
}
