import { DOM, Q, sym } from '../../theory/chords'
import { MAJ_BY_PC, MIN_BY_PC, makeKey, spellPc, type Key } from '../../theory/keys'
import { chordFrom } from '../../theory/roman'
import { chordScaleOf, SCALES, scaleNotes, type ScaleName } from '../../theory/scales'
import { mod, pc } from '../../theory/notes'
import type { IdeaChord, IdeaSettings } from './model'

export interface Progression {
  id: string
  name: string
  minor?: boolean
  /** One chord per bar, as roman numerals. */
  rn: string[]
  /** Override the default chord scale, per bar. */
  scales?: (ScaleName | undefined)[]
}

const MIX: ScaleName = 'mixolydian'

export const PROGRESSIONS: Progression[] = [
  { id: 'ii-V-I', name: 'ii–V–I (major)', rn: ['ii7', 'V7', 'Imaj7', 'Imaj7'] },
  { id: 'I-vi-ii-V', name: 'I–vi–ii–V', rn: ['Imaj7', 'vi7', 'ii7', 'V7'] },
  { id: 'minor-ii-V-i', name: 'Minor ii–V–i', minor: true, rn: ['iiø7', 'V7♭9', 'i6', 'i6'], scales: [undefined, undefined, 'melodic', 'melodic'] },
  { id: 'funk', name: 'Funk vamp (i7–IV7)', minor: true, rn: ['i7', 'i7', 'IV7', 'IV7'], scales: ['dorian', 'dorian', MIX, MIX] },
  { id: 'dorian', name: 'Modal vamp (Dorian)', minor: true, rn: ['i7', 'i7', 'i7', 'i7'], scales: ['dorian', 'dorian', 'dorian', 'dorian'] },
  { id: 'pop', name: 'Pop I–V–vi–IV', rn: ['I', 'V', 'vi', 'IV'] },
  {
    id: 'blues',
    name: '12-bar blues',
    rn: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    scales: Array(12).fill(MIX),
  },
]

export const progressionById = (id: string) => PROGRESSIONS.find((p) => p.id === id) ?? PROGRESSIONS[0]

/** Key name for a tonic, e.g. 1 → "Db" (major) or "C#m" (minor). */
export const keyName = (tonic: number, minor?: boolean) => (minor ? MIN_BY_PC : MAJ_BY_PC)[mod(tonic, 12)]

/** Degrees that make the chord itself (the rest are extensions). */
const CORE = new Set([1, 3, 4, 5, 6, 7])

export function ideaChord(rn: string, K: Key, scaleOverride?: ScaleName): IdeaChord {
  const chord = chordFrom(rn, K, { kind: 'dia' })
  chord.sym = sym(chord)
  const scaleName = scaleOverride ?? chordScaleOf(chord, K)
  const scale = [...SCALES[scaleName]]
  const tones = Q[chord.q].filter(([d]) => CORE.has(d)).map(([, s]) => mod(s, 12))
  const ext = Q[chord.q].filter(([d]) => !CORE.has(d)).map(([, s]) => mod(s, 12))
  const dom = DOM.has(chord.q)
  // colour tones: extensions, plus scale notes that are not a half step above a chord tone
  // (on a dominant, ♭9 and ♭13 are fine)
  const tens = [
    ...new Set([
      ...ext,
      ...scale.filter((x) => !tones.includes(x) && (!tones.includes(mod(x - 1, 12)) || (dom && (x === 1 || x === 8)))),
    ]),
  ]
  return {
    chord,
    root: pc(chord.root),
    sym: chord.sym,
    tones,
    tens,
    scale,
    scaleName,
    spelled: scaleNotes(chord.root, scaleName),
  }
}

export function buildChords(S: Pick<IdeaSettings, 'key' | 'prog' | 'times'>): { K: Key; chords: IdeaChord[] } {
  const P = progressionById(S.prog)
  const K = makeKey(keyName(S.key, P.minor))
  const once = P.rn.map((rn, i) => ideaChord(rn, K, P.scales?.[i]))
  const chords: IdeaChord[] = []
  for (let k = 0; k < S.times; k++) once.forEach((c) => chords.push({ ...c, chord: { ...c.chord } }))
  chords.forEach((c, b) => {
    c.chord.start = b * 4
    c.chord.dur = 4
  })
  return { K, chords }
}

/** Spell a pitch class against a chord: its scale first, then the key. */
export function spellIn(p: number, ch: IdeaChord, K: Key, pref?: 'flat' | 'sharp') {
  return ch.spelled.find((n) => pc(n) === mod(p, 12)) ?? spellPc(mod(p, 12), { scale: K.scale, flat: K.flat }, pref)
}
