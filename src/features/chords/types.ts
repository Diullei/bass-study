import type { Check } from '../harmony/types'
import type { PatternId } from './patterns'
import type { QType } from './quiz'

export type { Check }

/**
 * Text in this method supports:
 *   **bold**, *italic*, `code`
 *   [[Law1]] … [[Law5]]   a law of this method (hover shows it, click opens it)
 *   [[Ch4]]               a chapter of this method
 *   [[R1]] … [[R7]]       a rule of the harmony course
 *   [[HL2]]               a lesson of the harmony course
 *   [[TP]]                the four test progressions page · [[GEN]] the progression generator
 *   [[FIND]]              the voicing finder · [[CHECK]] the shape checker
 *   {Cmaj7:x-8-x-9-9}     an inline shape: hover shows the diagram, click plays it. Checked like every other shape.
 */
export type CBlock =
  | { t: 'p'; text: string }
  /** A small heading inside the chapter. */
  | { t: 'h'; text: string }
  | { t: 'list'; items: string[] }
  /** A numbered list (steps of a procedure). */
  | { t: 'steps'; items: string[] }
  | { t: 'tip'; title: string; text: string }
  /** The one idea of a passage, written large (a formula, a translation). */
  | { t: 'big'; text: string }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  /**
   * Shapes with diagrams. Each row: "Chord | frets | optional note", e.g. "Cmaj7 | x-8-x-9-9 | form A".
   * Notes and degrees are computed. `seq` = a progression: played in order, with its top line shown.
   * Rootless shapes get their root added by the "thumb" on playback (it can be switched off).
   */
  | { t: 'shapes'; title?: string; rows: string[]; caption?: string; seq?: boolean; tempo?: number }
  /** Chapter 1: the interval map, computed from Law 1. Click a cell to hear it. `down`: the map backwards, from a note to the notes below it. */
  | { t: 'map'; down?: boolean }
  /** Law 1: the reach solver. A root, its string and a degree → every placement the hand can hold, and how to get there when the first answer is out of reach. */
  | { t: 'reach'; root?: string; string?: number; degree?: string }
  /** Law 1 trainer: a starting note on the neck, you click the answer, the feedback gives the reasoning. */
  | { t: 'drill' }
  /** Law 2: one line per interval family with a small neck; the shaded part is where its lower note sounds clear (`ivs` in half steps; none = anywhere). */
  | { t: 'floors'; rows: { text: string; ivs?: number[] }[] }
  /** Chapter 1: the clear zones, computed from the low interval limits. */
  | { t: 'zones' }
  /** Chapter 1: the neck shaded by register (bass, chord, melody bands). */
  | { t: 'registers' }
  /** Chapter 22: what each harmonic sounds on each string, computed. */
  | { t: 'harmonics' }
  /** One shape in comping textures or patterns, with a beat grid and playback. */
  | { t: 'patterns'; chord: string; shape: string; ids: PatternId[]; caption?: string }
  /**
   * Play-along: a loop with drums, the roots (the looper) and the shapes in a comping pattern.
   * `bars`: bars split by "|", chords in a bar by spaces, each "Sym:frets", e.g. "Dm7:x-10-x-10-10 G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9".
   * `walk`: optional walking line, notes per bar split by "|", e.g. "D2 F2 A2 Ab2 | …" (beat 1 can be the root).
   */
  | { t: 'along'; title: string; bars: string; pattern?: PatternId; tempo?: number; walk?: string; caption?: string }

export interface Chapter {
  id: string
  /** Index into PARTS. */
  part: number
  title: string
  /** What pianists do (one or two paragraphs, rich text). */
  piano: string
  /** Bass logic: how the laws turn it into something playable. */
  blocks: CBlock[]
  drills: string[]
  /** The test for moving on. */
  ready: string
  checks: Check[]
  quiz: QType[]
  /** A tone note for the chapter (Chapter 24 patches). */
  tone?: string
}

export interface Law {
  n: number
  title: string
  short: string
  blocks: CBlock[]
  tries: Check[]
}
