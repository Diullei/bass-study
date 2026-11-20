import type { Chord } from '../../theory/chords'
import type { Key } from '../../theory/keys'
import type { Note } from '../../theory/notes'
import type { ScaleName } from '../../theory/scales'

/** The eight ways of thinking, switched on one at a time. */
export type LayerId = 'scale' | 'targets' | 'rhythm' | 'guide' | 'approach' | 'motif' | 'arc' | 'feel'
export type Layers = Record<LayerId, boolean>
export type Mode = 'solo' | 'fills'
export type Feel = 'straight' | 'funk' | 'swing'

export interface IdeaSettings {
  /** Tonic pitch class, 0 = C. */
  key: number
  /** Progression id (see harmony.ts). */
  prog: string
  /** Times through the progression. */
  times: number
  mode: Mode
  feel: Feel
  /** 0.1–0.9: how many notes. */
  busy: number
  /** Fills mode: a fill every n bars, n beats long. */
  fillEvery: number
  fillBeats: number
  five: boolean
  seed: number
  layers: Layers
}

/** A chord of the progression, with its pitch sets relative to the root. */
export interface IdeaChord {
  chord: Chord
  /** Root pitch class. */
  root: number
  sym: string
  /** Chord tones (R 3 5 6/7), semitones above the root. */
  tones: number[]
  /** Colour tones that work over it (9, 11, 13 …). */
  tens: number[]
  scale: number[]
  scaleName: ScaleName
  /** The chord scale spelled out, for naming notes. */
  spelled: Note[]
}

/** What a note is doing — decides its explanation and its pen. */
export type Role =
  | 'scale'
  | 'target'
  | 'guide'
  | 'pass'
  | 'arp'
  | 'approach'
  | 'enclosure'
  | 'motif'
  | 'tension'
  | 'groove'
  | 'ghost'

export interface IdeaNote {
  /** Start, in 16ths from the top. */
  t: number
  /** Index of the chord it is heard against. */
  ci: number
  /** Sounding MIDI pitch (E1 = 28). */
  midi: number
  /** Length in 16ths. */
  dur: number
  role: Role
  why: string
  /** Spelling preference for chromatic notes. */
  pref?: 'flat' | 'sharp'
  strong?: boolean
  landing?: boolean
  final?: boolean
  anticip?: boolean
  fixed?: boolean
  /** A target in the next bar that a fill aims at; not played. */
  virtual?: boolean
  chordChange?: boolean
  /** Part of the seed motif. */
  seed?: boolean
  ghost?: boolean
  legato?: boolean
  slide?: boolean
  vel: number
  /** Timing offset in seconds (laid back). */
  off: number
  /** Fraction of the length actually held. */
  gate: number
  /** String index, 0 = lowest. */
  str: number
  fret: number
  /** Interval against the chord: R, 3, ♭7, 9 … */
  label: string
}

export interface LogLine {
  t: number
  text: string
}

export interface Idea {
  K: Key
  chords: IdeaChord[]
  notes: IdeaNote[]
  log: LogLine[]
  bars: number
  /** Length in 16ths. */
  T: number
}

export const LAYERS: { id: LayerId; name: string; think: string }[] = [
  {
    id: 'scale',
    name: 'Scale / mode',
    think: '“Which notes are safe here?” The mode of each chord is the palette. On its own it sounds like noodling: right notes, no plan, no sentence.',
  },
  {
    id: 'targets',
    name: 'Chord-tone targets',
    think: '“Where am I landing?” Strong beats, phrase starts and endings land on R–3–5–7. The scale is the road: passing notes walk to the next target, with turns or arpeggio skips when needed.',
  },
  {
    id: 'rhythm',
    name: 'Rhythm & space',
    think: '“Say it like a sentence.” Phrases of 3–7 beats, then breathe. Mix rhythm cells, end on a held note, and sometimes anticipate the next chord an eighth early.',
  },
  {
    id: 'guide',
    name: 'Guide tones',
    think: '“Make the changes audible.” At every chord change, aim for the closest 3rd or 7th. The 7th of one chord falls a half or whole step into the 3rd of the next.',
  },
  {
    id: 'approach',
    name: 'Approach notes & enclosures',
    think: '“Decorate the arrival.” Slide into a target from a half step below or above, walk up two half steps, or surround it: scale note above, half step below, target.',
  },
  {
    id: 'motif',
    name: 'Motif development',
    think: '“Develop one idea.” The first phrase is the seed. Then move it to the new chord, displace it, invert it, change its ending, fragment it. Every 4th phrase starts a new idea.',
  },
  {
    id: 'arc',
    name: 'Shape & tension',
    think: '“Tell a story.” Start low and sparse, climb in register and density to about ¾ of the way, use colour tones (9, 11, 13, ♭9) at the peak, then come down and end on a low root.',
  },
  {
    id: 'feel',
    name: 'Feel & articulation',
    think: '“Hands, not a sequencer.” Accent targets, play passing notes softer and a touch behind, add ghost notes, slide into phrase starts, hammer-on small steps.',
  },
]

export const NO_LAYERS: Layers = { scale: true, targets: false, rhythm: false, guide: false, approach: false, motif: false, arc: false, feel: false }
export const ALL_LAYERS: Layers = { scale: true, targets: true, rhythm: true, guide: true, approach: true, motif: true, arc: true, feel: true }

/** How each role is written: the pen (a notation.css class) and its name. */
export const ROLES: Record<Role, { name: string; pen: string }> = {
  target: { name: 'chord-tone target', pen: '' },
  groove: { name: 'groove', pen: '' },
  guide: { name: 'guide tone (3rd / 7th)', pen: 'pen-green' },
  scale: { name: 'scale note (no plan)', pen: 'pen-pencil' },
  pass: { name: 'passing note', pen: 'pen-pencil' },
  arp: { name: 'arpeggio skip', pen: 'pen-pencil' },
  approach: { name: 'chromatic approach', pen: 'pen-purple' },
  enclosure: { name: 'enclosure', pen: 'pen-purple' },
  motif: { name: 'motif, developed', pen: 'pen-marker' },
  tension: { name: 'colour tone', pen: 'pen-tension' },
  ghost: { name: 'ghost note', pen: 'pen-ghost' },
}
