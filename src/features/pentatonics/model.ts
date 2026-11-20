import type { Chord } from '../../theory/chords'
import type { Key } from '../../theory/keys'
import type { Note } from '../../theory/notes'
import type { PentKind } from '../../theory/pentatonic'

/** A pentatonic built on a degree of a chord: deg/semis above the chord root, e.g. { deg: 5, semis: 7, kind: 'minor' }. */
export interface PentRef {
  deg: number
  semis: number
  kind: PentKind
  /** Short role, e.g. "from the 5th". */
  role: string
  /** What it sounds like. */
  say?: string
}

/** A pentatonic placed on a real chord. */
export interface PentSet {
  ref: PentRef
  root: Note
  notes: Note[]
  pcs: number[]
  /** notation.css pen class used to write its notes. */
  pen: string
}

export interface DrillChord {
  chord: Chord
  rootPc: number
  /** Chord tones, semitones above the root. */
  tones: number[]
  sets: PentSet[]
}

/** One note (or rest) of a generated line. Times in 16ths. */
export interface PNote {
  t: number
  dur: number
  rest?: boolean
  /** Sounding MIDI pitch (E1 = 28). */
  midi: number
  note?: Note
  /** Index into its chord's sets; -1 for blue notes. */
  set: number
  ci: number
  str: number
  fret: number
  label: string
  pen: string
}

export interface Line {
  K: Key
  chords: DrillChord[]
  notes: PNote[]
  bars: number
  /** Which pen is which pentatonic (for the legend). */
  legend: { pen: string; text: string }[]
}

/** Pens for the 1st, 2nd, 3rd pentatonic of a chord. Purple is kept for blue notes and "outside"; red is the playback cursor. */
export const SET_PENS = ['', 'pen-green', 'pen-blue', 'pen-pencil']
export const OUTSIDE_PEN = 'pen-purple'

// the pentatonics used throughout the class
export const R_MIN: PentRef = { deg: 1, semis: 0, kind: 'minor', role: 'from the root', say: 'Inside and grounded. Every note belongs, but it sounds like the textbook.' }
export const FIFTH_MIN: PentRef = { deg: 5, semis: 7, kind: 'minor', role: 'from the 5th', say: 'Modern, floats above the chord: no ♭3, the root hidden in the middle, the 9 and 11 up front.' }
export const NINTH_MIN: PentRef = { deg: 2, semis: 2, kind: 'minor', role: 'from the 9th', say: 'High altitude: 9, 11 and 13 (the Dorian 6th). The most tension that is still “in”.' }
export const R_MAJ: PentRef = { deg: 1, semis: 0, kind: 'major', role: 'from the root', say: 'Bright and inside: R 9 3 5 13, no 4th to clash with the 3rd.' }
export const FIFTH_MAJ: PentRef = { deg: 5, semis: 7, kind: 'major', role: 'from the 5th', say: 'Lifts the line: 5 13 7 9 3 — the maj7 and the 9 without the root.' }
export const NINTH_MAJ: PentRef = { deg: 2, semis: 2, kind: 'major', role: 'from the 9th', say: 'Lydian: 9 3 ♯11 13 7. The brightest, most open sound on a major chord.' }
export const FIFTH_MIN_DOM: PentRef = { deg: 5, semis: 7, kind: 'minor', role: 'from the 5th', say: 'Sus sound: 5 ♭7 R 9 11. The 11 hangs over the 3rd — great before the resolution.' }
export const B3_MIN_ALT: PentRef = { deg: 3, semis: 3, kind: 'minor', role: 'from the ♭3', say: 'Altered: ♯9 ♯11 ♭13 ♭7 ♭9. Maximum pull towards the next chord.' }
export const B3_MIN_HALFDIM: PentRef = { deg: 3, semis: 3, kind: 'minor', role: 'from the ♭3', say: 'Locrian colours: ♭3 ♭5 ♭13 ♭7 ♭9 — the whole half-diminished sound in five notes.' }
export const R_MIN6: PentRef = { deg: 1, semis: 0, kind: 'minor6', role: 'from the root (m6)', say: 'Swap the ♭7 for the 6: the tonic-minor, melodic-minor sound.' }
export const R_BLUES: PentRef = { deg: 1, semis: 0, kind: 'blues', role: 'blues scale', say: 'The minor pentatonic plus the blue note (♯4 / ♭5).' }
export const SLIP_MIN: PentRef = { deg: 2, semis: 1, kind: 'minor', role: 'a half step up (outside)', say: 'None of its notes is a chord tone, and the major 3rd and 7th clash hard against a minor chord. Tension you must resolve.' }
