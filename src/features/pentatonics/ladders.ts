import {
  B3_MIN_ALT,
  B3_MIN_HALFDIM,
  FIFTH_MAJ,
  FIFTH_MIN,
  FIFTH_MIN_DOM,
  NINTH_MAJ,
  NINTH_MIN,
  R_BLUES,
  R_MAJ,
  R_MIN,
  R_MIN6,
  SLIP_MIN,
  type PentRef,
} from './model'

/**
 * The altitude ladder of every chord type: the pentatonics that work over it, from the ground
 * (inside, root-heavy) up to the most colourful that is still "in" — and one rung outside.
 * The same idea as the minor-chord example, applied to every chord you will meet.
 */
export interface ChordLadder {
  q: string
  name: string
  /** Default root for examples (pitch class). */
  root: number
  rungs: PentRef[]
  /** Same notes, other name — to save learning twice. */
  alias: string
  note?: string
}

export const FOURTH_MAJ_M6: PentRef = { deg: 4, semis: 5, kind: 'major', role: 'from the 4th', say: 'Melodic-minor colour: 11 5 6 R 9 — bright, but no ♭7.' }
export const NINTH_MIN_M6: PentRef = { ...NINTH_MIN, say: '9 11 5 6 R: works on m6 too, because it has no ♭7.' }
const B5_MAJ_ALT: PentRef = { deg: 5, semis: 6, kind: 'major', role: 'from the ♭5 (tritone)', say: 'The tritone substitute’s own pentatonic: ♭5 ♭13 ♭7 ♭9 ♯9 — the same notes as the ♭3 minor.' }

export const LADDERS: ChordLadder[] = [
  {
    q: 'm7',
    name: 'Minor 7th (m7)',
    root: 2,
    rungs: [R_MIN, FIFTH_MIN, NINTH_MIN, SLIP_MIN],
    alias: 'Each minor pentatonic is also the major pentatonic a minor 3rd up: Dm = F, Am = C, Em = G.',
    note: 'Root → 5th → 9th climbs: each rung swaps a grounded note for a colour (♭3 → 9, then ♭7 → 13).',
  },
  {
    q: 'maj7',
    name: 'Major 7th (maj7)',
    root: 0,
    rungs: [R_MAJ, FIFTH_MAJ, NINTH_MAJ, { ...SLIP_MIN, kind: 'major' }],
    alias: 'As minor pentatonics: C pent = Am, G pent = Em, D pent = Bm — the 6th, 3rd and 7th of the chord.',
    note: 'Avoid the pentatonic from the 4th (F over C): it brings the 4th, the note that clashes with the 3rd.',
  },
  {
    q: '7',
    name: 'Dominant 7th (7)',
    root: 7,
    rungs: [R_MAJ, R_BLUES, FIFTH_MIN_DOM, B3_MIN_ALT],
    alias: 'Mix the major pentatonic (sweet) and the blues scale (gritty) over the same dominant — the sound of the blues.',
    note: 'The higher rungs want to resolve: play them just before the next chord, then land on its 3rd.',
  },
  {
    q: '7alt',
    name: 'Altered dominant (7alt)',
    root: 7,
    rungs: [B3_MIN_ALT, B5_MAJ_ALT],
    alias: 'B♭ minor pentatonic over G7alt = D♭ major pentatonic: the same five altered notes.',
    note: 'Only for dominants that resolve. Hold the tension one bar at most and resolve to the tonic.',
  },
  {
    q: 'm7♭5',
    name: 'Half-diminished (m7♭5)',
    root: 4,
    rungs: [B3_MIN_HALFDIM],
    alias: 'G minor pentatonic over Em7♭5 = B♭ major pentatonic (from the ♭5).',
    note: 'One pentatonic covers the whole chord: start it from the ♭3 of the chord.',
  },
  {
    q: 'm6',
    name: 'Minor 6th (m6 / tonic minor)',
    root: 2,
    rungs: [R_MIN6, FOURTH_MAJ_M6, NINTH_MIN_M6],
    alias: 'D minor 6 pentatonic = D F G A B: the minor pentatonic with the 6 in place of the ♭7.',
    note: 'On a tonic minor chord the ♭7 can sound wrong; these three avoid it.',
  },
]

export const ladderOf = (q: string) => LADDERS.find((l) => l.q === q) ?? LADDERS[0]
