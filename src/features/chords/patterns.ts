/**
 * Plucking-hand patterns (Chapters 2 and 20), in eighth notes.
 * T = thumb (the root, the pianist's left hand); fingers = the upper notes (the right hand).
 */

export type PatternId = 'block' | 'roll' | 'split' | 'broken' | 'four' | 'charleston' | 'bossa' | 'ballad' | 'stab'

export type Feel = 'swing' | 'bossa' | 'ballad'

/**
 * Who plays: 'T' the root (thumb), 'T5' the 5th below the root (thumb, one string lower, same fret),
 * 'F' all the upper notes together, 'all' everything at once, 'roll' everything low to high,
 * 0/1/2 a single upper note (i, m, r).
 */
export type Who = 'T' | 'T5' | 'F' | 'all' | 'roll' | 0 | 1 | 2

export interface Hit {
  /** Eighth-note slot from the start of the pattern. */
  at: number
  who: Who
  /** Length in eighths. */
  len: number
  /** Accent (louder). */
  acc?: boolean
}

export interface Pattern {
  id: PatternId
  name: string
  /** Bars the pattern lasts (1 or 2). */
  bars: 1 | 2
  feel: Feel
  hits: Hit[]
  how: string
  piano: string
}

export const PATTERNS: Record<PatternId, Pattern> = {
  block: {
    id: 'block',
    name: 'Block',
    bars: 1,
    feel: 'swing',
    hits: [0, 2, 4, 6].map((at) => ({ at, who: 'all' as const, len: 1.6 })),
    how: 'All fingers pluck together, four times a bar.',
    piano: 'A chord struck at once',
  },
  roll: {
    id: 'roll',
    name: 'Roll',
    bars: 1,
    feel: 'ballad',
    hits: [{ at: 0, who: 'roll', len: 8 }],
    how: 'T, i, m, r in a quick sweep, low to high, once a bar. Let it ring.',
    piano: 'A rolled chord',
  },
  split: {
    id: 'split',
    name: 'Split',
    bars: 1,
    feel: 'swing',
    hits: [
      { at: 0, who: 'T', len: 2 },
      { at: 2, who: 'F', len: 1, acc: true },
      { at: 4, who: 'T', len: 2 },
      { at: 6, who: 'F', len: 1, acc: true },
    ],
    how: 'Thumb on 1 and 3, fingers together on 2 and 4.',
    piano: 'Stride: bass note, then chord',
  },
  broken: {
    id: 'broken',
    name: 'Broken',
    bars: 1,
    feel: 'ballad',
    hits: (['T', 0, 1, 0, 'T', 0, 1, 0] as Who[]).map((who, at) => ({ at, who, len: 8 - at })),
    how: 'T‑i‑m‑i in eighth notes, every note left ringing.',
    piano: 'An arpeggio with the pedal down',
  },
  four: {
    id: 'four',
    name: 'Four to the bar',
    bars: 1,
    feel: 'swing',
    hits: [0, 2, 4, 6].map((at) => ({ at, who: 'F' as const, len: 1, acc: at === 2 || at === 6 })),
    how: 'Fingers on 1, 2, 3, 4, short, a little louder on 2 and 4. Best with guide-tone pairs.',
    piano: 'Swing rhythm guitar',
  },
  charleston: {
    id: 'charleston',
    name: 'Charleston',
    bars: 1,
    feel: 'swing',
    hits: [
      { at: 0, who: 'T', len: 3 },
      { at: 0, who: 'F', len: 1.5, acc: true },
      { at: 3, who: 'F', len: 1, acc: true },
    ],
    how: 'Thumb on 1; fingers on 1 and on the & of 2.',
    piano: 'The classic swing comp',
  },
  bossa: {
    id: 'bossa',
    name: 'Bossa',
    bars: 2,
    feel: 'bossa',
    hits: [
      { at: 0, who: 'T', len: 3 },
      { at: 4, who: 'T5', len: 3 },
      { at: 8, who: 'T', len: 3 },
      { at: 12, who: 'T5', len: 3 },
      { at: 0, who: 'F', len: 1.5 },
      { at: 3, who: 'F', len: 1.5 },
      { at: 6, who: 'F', len: 1.5 },
      { at: 10, who: 'F', len: 1.5 },
      { at: 13, who: 'F', len: 2 },
    ],
    how: 'Thumb steady on 1 and 3 (root, then the low 5th). Fingers: bar 1 on 1, & of 2 and 4; bar 2 on 2 and & of 3.',
    piano: 'Left hand steady, right hand syncopated',
  },
  ballad: {
    id: 'ballad',
    name: 'Ballad',
    bars: 1,
    feel: 'ballad',
    hits: [
      { at: 0, who: 'roll', len: 8 },
      { at: 4, who: 1, len: 4 },
      { at: 6, who: 0, len: 2 },
    ],
    how: 'Roll on 1, then single chord tones, everything ringing.',
    piano: 'Rolled chord and a little melody, pedal down',
  },
  stab: {
    id: 'stab',
    name: 'Stab and walk',
    bars: 1,
    feel: 'swing',
    hits: [{ at: 0, who: 'all', len: 1 }],
    how: 'The chord sounds short on beat 1, like a snare hit; the line walks on 2, 3 and 4.',
    piano: 'Solo piano: walking left hand, chords dropped in',
  },
}

export const PATTERN_LIST = Object.values(PATTERNS)
