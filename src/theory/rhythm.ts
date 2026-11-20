/** Rhythm cells, measured in beats (quarter note = 1). */

/** Event flag: r = rest, t = tied to next, 3 = triplet. */
export type CellFlag = 'r' | 't' | '3'
export interface Cell {
  b: number
  c68?: boolean
  ev: [number, CellFlag?][]
}

export const CELLS: Record<string, Cell> = {
  w: { b: 4, ev: [[4]] },
  h: { b: 2, ev: [[2]] },
  hd: { b: 3, ev: [[3]] },
  q: { b: 1, ev: [[1]] },
  wr: { b: 4, ev: [[4, 'r']] },
  hr: { b: 2, ev: [[2, 'r']] },
  qr: { b: 1, ev: [[1, 'r']] },
  ee: { b: 1, ev: [[0.5], [0.5]] },
  ere: { b: 1, ev: [[0.5, 'r'], [0.5]] },
  eer: { b: 1, ev: [[0.5], [0.5, 'r']] },
  qde: { b: 2, ev: [[1.5], [0.5]] },
  tie: { b: 2, ev: [[1, 't'], [0.5], [0.5]] },
  syn: { b: 2, ev: [[0.5], [1], [0.5]] },
  ssss: { b: 1, ev: [[0.25], [0.25], [0.25], [0.25]] },
  ess: { b: 1, ev: [[0.5], [0.25], [0.25]] },
  sse: { b: 1, ev: [[0.25], [0.25], [0.5]] },
  trip: { b: 1, ev: [[1 / 3, '3'], [1 / 3, '3'], [1 / 3, '3']] },
  des: { b: 1, ev: [[0.75], [0.25]] },
  srse: { b: 1, ev: [[0.25, 'r'], [0.25], [0.5]] },
  dq: { b: 1.5, c68: true, ev: [[1.5]] },
  eee: { b: 1.5, c68: true, ev: [[0.5], [0.5], [0.5]] },
  qe8: { b: 1.5, c68: true, ev: [[1], [0.5]] },
  eq8: { b: 1.5, c68: true, ev: [[0.5], [1]] },
  dqr: { b: 1.5, c68: true, ev: [[1.5, 'r']] },
  dh: { b: 3, c68: true, ev: [[3]] },
}

/** How often each cell is chosen by the generator. */
export const CELLW: Record<string, number> = {
  w: 1, h: 2, hd: 1.5, q: 3, wr: 0.3, hr: 0.5, qr: 0.7, ee: 2, ere: 0.7, eer: 0.7, qde: 1.2, tie: 0.8,
  syn: 1, ssss: 1, ess: 0.8, sse: 0.8, trip: 1.2, des: 1.1, srse: 0.9, dq: 2, eee: 2, qe8: 1.6, eq8: 0.8,
  dqr: 0.5, dh: 1,
}

/** Rhythm levels: lesson.R = n unlocks the cells of levels 1…n. */
export const RL: string[][] = [
  [], ['w', 'h'], ['q'], ['qr'], ['hr', 'wr'], ['hd'], ['ee'], ['ere', 'eer'], ['qde'], ['tie'], ['syn'],
  ['ssss'], ['ess', 'sse'], ['trip'], ['des', 'srse'],
]

const CELLS68 = ['dq', 'eee', 'qe8', 'eq8', 'dqr', 'dh']

export const cellsFor = (L: { time: number; R?: number }) =>
  L.time === 6
    ? CELLS68
    : RL.slice(1, (L.R || 2) + 1)
        .flat()
        .filter((c) => L.time === 4 || !['w', 'wr'].includes(c))

/** Explanations shown when a lesson introduces a rhythm. */
export const RTXT: Record<string, string> = {
  w: 'Whole note — 4 beats. Count "1 2 3 4" and let it ring.',
  h: 'Half note — 2 beats.',
  q: 'Quarter note — 1 beat.',
  qr: 'Quarter rest — 1 beat of silence: stop the string.',
  hr: 'Half rest (sits on the middle line) — 2 beats of silence.',
  wr: 'Whole rest (hangs from the 4th line) — a whole bar of silence.',
  hd: 'Dotted half note — 3 beats (a dot adds half the value).',
  ee: 'Eighth notes — two per beat, counted "1 +".',
  ere: 'Eighth rest — half a beat of silence, e.g. "(1) +" for an off-beat note.',
  qde: 'Dotted quarter + eighth — 1½ beats then ½: "1 (2) +".',
  tie: 'Ties join two notes of the same pitch: pluck once and hold for both values.',
  syn: 'Syncopation — eighth, quarter, eighth: "1 + (2) +". The long note starts off the beat.',
  ssss: 'Sixteenth notes — four per beat, counted "1 e + a".',
  ess: 'Eighth + two sixteenths ("1 + a") and two sixteenths + eighth ("1 e +").',
  trip: 'Eighth-note triplets — three even notes in one beat, counted "1 trip-let", marked with a 3.',
  des: 'Dotted eighth + sixteenth — "1 (e +) a": long-short, the classic funk/shuffle figure.',
  srse: 'Sixteenth rest — a quarter of a beat of silence: "(1) e +".',
}

/** Note-value letters used in song notation ("D3:h"). */
export const DUR: Record<string, number> = { w: 4, hd: 3, h: 2, qd: 1.5, q: 1, ed: 0.75, e: 0.5, s: 0.25, t: 1 / 3 }
