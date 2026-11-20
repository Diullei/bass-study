import { DOM, isMinorQ, type Chord } from './chords'
import { spellPc, type Key } from './keys'
import { clean, iv, mod, pc, type Note } from './notes'
import { rnBase } from './roman'

export const SCALES = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  melodic: [0, 2, 3, 5, 7, 9, 11],
  lydDom: [0, 2, 4, 6, 7, 9, 10],
  altered: [0, 1, 3, 4, 6, 8, 10],
  locNat2: [0, 2, 3, 5, 6, 8, 10],
  phrygDom: [0, 1, 4, 5, 7, 8, 10],
  hwDim: [0, 1, 3, 4, 6, 7, 9, 10],
  whDim: [0, 2, 3, 5, 6, 8, 9, 11],
  wholeTone: [0, 2, 4, 6, 8, 10],
} as const

export type ScaleName = keyof typeof SCALES

export const SCNAME: Record<ScaleName, string> = {
  ionian: 'Ionian (major)',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  aeolian: 'Aeolian (natural minor)',
  locrian: 'Locrian',
  melodic: 'Melodic minor',
  lydDom: 'Lydian dominant',
  altered: 'Altered (super-Locrian)',
  locNat2: 'Locrian ♮2',
  phrygDom: 'Phrygian dominant',
  hwDim: 'Half–whole diminished',
  whDim: 'Whole–half diminished',
  wholeTone: 'Whole-tone',
}

export const MODE_NAMES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']

export function scaleNotes(root: Note, name: ScaleName): Note[] {
  const s = SCALES[name]
  if (s.length === 7) return s.map((x, i) => clean(iv(root, i + 1, x)))
  const flat = root.a < 0 || root.l === 3
  return s.map((x) => spellPc(mod(pc(root) + x, 12), { scale: [], flat }))
}

/** The default chord scale for a chord in context. */
export function chordScaleOf(c: Chord, K?: Key): ScaleName {
  const q = c.q
  const b = rnBase(c.rn)
  if (q === '7alt') return 'altered'
  if (q === '°7') return 'whDim'
  if (q === '7♯5') return 'wholeTone'
  if (q === '13♭9') return 'hwDim'
  if (DOM.has(q)) {
    if (c.kind === 'sub' || /^♭VII$|^♭II$|^IV$/.test(b)) return 'lydDom'
    if (c.toMinor || q === '7♭9') return 'phrygDom'
    return 'mixolydian'
  }
  if (q === 'm7♭5' || q === '°') return K && K.minor ? 'locNat2' : 'locrian'
  if (q === 'm(maj7)') return 'melodic'
  if (isMinorQ(q)) {
    if (!(K && K.minor) && c.kind === 'dia') {
      if (b === 'iii') return 'phrygian'
      if (b === 'vi') return 'aeolian'
    }
    return 'dorian'
  }
  if (/^(IV|♭VI|♭III)$/.test(b)) return 'lydian'
  // a plain major triad on V acts as the dominant
  if (b === 'V') return K && K.minor ? 'phrygDom' : 'mixolydian'
  return 'ionian'
}

export const INTV: Record<string, [number, number, string]> = {
  m2: [2, 1, 'minor 2nd'],
  M2: [2, 2, 'major 2nd'],
  m3: [3, 3, 'minor 3rd'],
  M3: [3, 4, 'major 3rd'],
  P4: [4, 5, 'perfect 4th'],
  TT: [4, 6, 'tritone'],
  P5: [5, 7, 'perfect 5th'],
  m6: [6, 8, 'minor 6th'],
  M6: [6, 9, 'major 6th'],
  m7: [7, 10, 'minor 7th'],
  M7: [7, 11, 'major 7th'],
  P8: [8, 12, 'octave'],
}
