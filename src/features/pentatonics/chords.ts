import { isMinorQ, Q, sym } from '../../theory/chords'
import { MAJ_BY_PC, MIN_BY_PC, makeKey, type Key } from '../../theory/keys'
import { iv, mod, parseName, pc, type Note } from '../../theory/notes'
import { pentNotes, pentPcs } from '../../theory/pentatonic'
import { chordFrom } from '../../theory/roman'
import { OUTSIDE_PEN, SET_PENS, type DrillChord, type PentRef, type PentSet } from './model'

/** Degrees that make the chord itself; 9/11/13 are colour. */
const CORE = new Set([1, 3, 4, 5, 6, 7])

export const chordTones = (q: string) => Q[q].filter(([d]) => CORE.has(d)).map(([, s]) => mod(s, 12))

/** A spelled root for a pitch class: minor-type chords use minor-key spellings (C♯m, not D♭m). */
export function rootOf(p: number, q: string): Note {
  const name = (isMinorQ(q) ? MIN_BY_PC : MAJ_BY_PC)[mod(p, 12)].replace(/m$/, '')
  return parseName(name)
}

export function placeSet(root: Note, ref: PentRef, i: number): PentSet {
  const r = iv(root, ref.deg, ref.semis)
  const pr: Note = { l: r.l, a: r.a }
  return {
    ref,
    root: pr,
    notes: pentNotes(pr, ref.kind),
    pcs: pentPcs(pr, ref.kind),
    pen: ref.role.includes('outside') ? OUTSIDE_PEN : SET_PENS[i] ?? '',
  }
}

/** A chord with its pentatonics, from a root and a quality ("m7", "maj7", "7", "7alt", "m7♭5", "m6"). */
export function drillChord(root: Note, q: string, refs: PentRef[], start = 0, dur = 4): DrillChord {
  const chord = { root, q, start, dur, sym: '' }
  chord.sym = sym(chord)
  return { chord, rootPc: pc(root), tones: chordTones(q), sets: refs.map((r, i) => placeSet(root, r, i)) }
}

/** The key signature to write a single chord in. */
export function keyForChord(root: Note, q: string): Key {
  const name = `${'CDEFGAB'[root.l]}${root.a < 0 ? 'b' : root.a > 0 ? '#' : ''}`
  const minor = isMinorQ(q)
  try {
    return makeKey(minor ? `${name}m` : name)
  } catch {
    return makeKey('C')
  }
}

/** Chords of a progression (roman numerals) in a key, each with its pentatonics. */
export function progressionChords(tonic: number, minor: boolean, bars: { rn: string; pents: PentRef[] }[]) {
  const K = makeKey((minor ? MIN_BY_PC : MAJ_BY_PC)[mod(tonic, 12)])
  const chords = bars.map((b, i) => {
    const c = chordFrom(b.rn, K, { kind: 'dia' })
    return drillChord(c.root, c.q, b.pents, i * 4, 4)
  })
  return { K, chords }
}
