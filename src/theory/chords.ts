import type { Key } from './keys'
import { iv, nm, type Note } from './notes'

/** Chord qualities as [generic degree, semitones above the root]. */
const T3: [number, number][] = [
  [1, 0],
  [3, 4],
  [5, 7],
]
const t3: [number, number][] = [
  [1, 0],
  [3, 3],
  [5, 7],
]

export const Q: Record<string, [number, number][]> = {
  '': T3,
  m: t3,
  '°': [[1, 0], [3, 3], [5, 6]],
  '+': [[1, 0], [3, 4], [5, 8]],
  maj7: [...T3, [7, 11]],
  '7': [...T3, [7, 10]],
  m7: [...t3, [7, 10]],
  'm7♭5': [[1, 0], [3, 3], [5, 6], [7, 10]],
  '°7': [[1, 0], [3, 3], [5, 6], [7, 9]],
  'm(maj7)': [...t3, [7, 11]],
  '6': [...T3, [6, 9]],
  m6: [...t3, [6, 9]],
  '7♯5': [[1, 0], [3, 4], [5, 8], [7, 10]],
  maj9: [...T3, [7, 11], [9, 14]],
  m9: [...t3, [7, 10], [9, 14]],
  m11: [...t3, [7, 10], [9, 14], [11, 17]],
  '9': [...T3, [7, 10], [9, 14]],
  '13': [...T3, [7, 10], [9, 14], [13, 21]],
  '7♭9': [...T3, [7, 10], [9, 13]],
  '7♯9': [...T3, [7, 10], [9, 15]],
  '7♯11': [...T3, [7, 10], [9, 14], [11, 18]],
  'maj7♯11': [...T3, [7, 11], [9, 14], [11, 18]],
  '7alt': [[1, 0], [3, 4], [7, 10], [9, 13], [9, 15], [13, 20]],
  '7sus4': [[1, 0], [4, 5], [5, 7], [7, 10]],
  '13♭9': [...T3, [7, 10], [9, 13], [13, 21]],
}

export const DOM = new Set(['7', '9', '13', '7♭9', '7♯9', '7♯11', '7alt', '7♯5', '13♭9', '7sus4'])

export const QNAME: Record<string, string> = {
  '': 'Major',
  m: 'Minor',
  '°': 'Diminished',
  '+': 'Augmented',
  maj7: 'Major 7th',
  '7': 'Dominant 7th',
  m7: 'Minor 7th',
  'm7♭5': 'Half-diminished',
  '°7': 'Diminished 7th',
  'm(maj7)': 'Minor-major 7th',
}

export type ChordKind = 'dia' | 'bor' | 'sec' | 'ii' | 'pass' | 'sub' | 'form'

/** A chord in a progression. Times are in beats (quarter = 1). */
export interface Chord {
  root: Note
  q: string
  bass?: Note
  label?: string
  rn?: string
  sym?: string
  kind?: ChordKind
  deg?: number
  chain?: number
  start: number
  dur: number
  key?: Key
  ck?: Key
  toMinor?: boolean
  noPlay?: boolean
}

export const isMinorQ = (q: string) => /^(m(?!aj)|°)/.test(q)

export interface ChordTone {
  d: number
  s: number
  n: Note
}

export const tones = (c: Pick<Chord, 'root' | 'q'>): ChordTone[] =>
  Q[c.q].map(([d, s]) => ({ d, s, n: iv(c.root, d, s) }))

export const tone = (c: Pick<Chord, 'root' | 'q'>, d: number): Note | null => {
  const t = tones(c).find((x) => x.d === d)
  return t ? t.n : null
}

/** Chord symbol, e.g. "Dm7" or "C/E". */
export const sym = (c: Pick<Chord, 'root' | 'q' | 'label' | 'bass'>) =>
  c.label || nm(c.root) + c.q + (c.bass ? '/' + nm(c.bass) : '')
