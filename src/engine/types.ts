import type { Chord } from '../theory/chords'
import type { Key, StringName } from '../theory/keys'
import type { Note } from '../theory/notes'

/** A fret position: string, fret, written MIDI pitch. */
export interface Pos {
  s: StringName
  f: number
  m: number
}

/** One note or rest in a piece. Times are in beats (quarter = 1). */
export interface MusicEvent {
  /** Bar index. */
  b: number
  /** Position inside the bar, in beats. */
  p: number
  /** Duration in beats. */
  d: number
  /** Beam group id. */
  cell: number | string
  rest?: boolean
  tie?: boolean
  trip?: boolean
  n?: Note
  o?: number
  m?: number
  s?: StringName
  f?: number
  finger?: number
  cands?: Pos[]
  ci?: number
  /** Extra CSS class on the note's <g>, e.g. a pen colour. */
  cls?: string
}

export interface BarMark {
  start?: boolean
  end?: boolean
  volta?: number
}

export interface Label {
  b: number
  p: number
  text: string
}

/** Everything the notation renderer and the player need. */
export interface Score {
  K: Key
  beats: number
  ts: [number, number]
  bars: number
  events: MusicEvent[]
  chords: Chord[]
  marks?: BarMark[]
  guide?: MusicEvent[] | null
  title?: string
  credit?: string
  slash?: boolean
  analysis?: boolean
  swing?: boolean
  labels?: Label[] | null
}

/** User settings that affect generation and display. */
export interface GenSettings {
  strings: '4' | '5'
  bars: 'auto' | '4' | '8' | '12' | '16'
}
