import { iv, mod, nm, pc, type Note } from './notes'

/**
 * Pentatonic scales (and their blues relatives), spelled from a root.
 * Each step is [degree, semitones above the root] so spelling follows the degree:
 * A minor pentatonic is A C D E G, E♭ minor pentatonic is E♭ G♭ A♭ B♭ D♭.
 */
export type PentKind = 'minor' | 'major' | 'blues' | 'majorBlues' | 'minor6'

export const PENT: Record<PentKind, { name: string; short: string; steps: [number, number][]; formula: string }> = {
  minor: { name: 'minor pentatonic', short: 'm pent', steps: [[1, 0], [3, 3], [4, 5], [5, 7], [7, 10]], formula: '1 ♭3 4 5 ♭7' },
  major: { name: 'major pentatonic', short: 'pent', steps: [[1, 0], [2, 2], [3, 4], [5, 7], [6, 9]], formula: '1 2 3 5 6' },
  blues: { name: 'blues scale', short: 'blues', steps: [[1, 0], [3, 3], [4, 5], [5, 6], [5, 7], [7, 10]], formula: '1 ♭3 4 ♭5 5 ♭7' },
  majorBlues: { name: 'major blues scale', short: 'maj blues', steps: [[1, 0], [2, 2], [3, 3], [3, 4], [5, 7], [6, 9]], formula: '1 2 ♭3 3 5 6' },
  minor6: { name: 'minor 6 pentatonic', short: 'm6 pent', steps: [[1, 0], [3, 3], [4, 5], [5, 7], [6, 9]], formula: '1 ♭3 4 5 6' },
}

/** The notes of a pentatonic on `root`. */
export function pentNotes(root: Note, kind: PentKind): Note[] {
  return PENT[kind].steps.map(([d, s]) => {
    const n = iv(root, d, s)
    return { l: n.l, a: n.a }
  })
}

/** Pitch classes of a pentatonic on `root`. */
export const pentPcs = (root: Note, kind: PentKind) => PENT[kind].steps.map(([, s]) => mod(pc(root) + s, 12))

/** "A minor pentatonic" */
export const pentName = (root: Note, kind: PentKind) => `${nm(root)} ${PENT[kind].name}`

/** "Am pent" */
export const pentShort = (root: Note, kind: PentKind) =>
  kind === 'minor' ? `${nm(root)}m pent` : kind === 'major' ? `${nm(root)} pent` : `${nm(root)} ${PENT[kind].short}`

/**
 * The job of a pitch over a chord, as a chord-chart number: R, ♭3, 5, ♭7, 9, 11, 13 …
 * `tones` are the chord's own tones (semitones above its root); everything else is a tension.
 */
export function intervalOver(p: number, chordRoot: number, tones: number[]): string {
  const x = mod(p - chordRoot, 12)
  const has = (s: number) => tones.includes(s)
  switch (x) {
    case 0:
      return 'R'
    case 1:
      return '♭9'
    case 2:
      return '9'
    case 3:
      return has(4) ? '♯9' : '♭3'
    case 4:
      return '3'
    case 5:
      return '11'
    case 6:
      return has(6) ? '♭5' : '♯11'
    case 7:
      return '5'
    case 8:
      return has(8) ? '♯5' : '♭13'
    case 9:
      return has(9) && !has(10) && !has(11) ? '6' : '13'
    case 10:
      return '♭7'
    default:
      return '7'
  }
}
