/**
 * Fretting-hand fingering, from the real size of the neck.
 *
 * Frets are not equally wide: the 1st is about 48 mm, the 12th about 24 mm. So "a four-fret span" means
 * different things in different places, and counting frets is the wrong model. This one measures the hand:
 *
 *   1. Every fingertip gets a position in millimetres: along the string from the fret formula of a 34" scale,
 *      across the neck from the string spacing.
 *   2. Every pair of fingers has a largest comfortable distance (index to little finger the largest),
 *      scaled by the hand size.
 *   3. Every way to give fingers 1–4 to the notes is tried (a finger may press several strings at one fret:
 *      a barre). Assignments that cross fingers, exceed a reach, or barre over an open string are thrown away.
 *   4. The rest are ranked: little stretch, few barres, strong fingers.
 *   5. For a progression the fingerings are chosen together (shortest path): a finger that can stay down
 *      (pivot) or slide along its string (guide finger) is worth more than the best fingering of one chord alone.
 */

/** 34" scale, in millimetres. */
const SCALE = 864
/**
 * What one string costs the reach. The strings are about 18 mm apart, but the hand turns and the fingers arch
 * to cross them, so a string costs far less reach than the same distance along the neck.
 */
const STRING_GAP = 5

/** Distance of fret wire n from the nut. */
export const fretX = (n: number) => SCALE * (1 - Math.pow(2, -n / 12))
/** Where a fingertip sits for fret n: just behind the wire. */
export const tipX = (n: number) => fretX(n) - 0.28 * (fretX(n) - fretX(n - 1))

export type HandSize = 'average' | 'large'

/**
 * Largest comfortable distance between two fingertips, in mm, for an average hand.
 * Index 0 = finger 1 (index). Measured generously for a relaxed thumb-behind-the-neck position.
 */
/*
 * Calibrated on what bass teaching takes for granted on a 34" neck:
 *   - one finger per fret is comfortable from about the 5th fret up (frets 5–8 are 105 mm from tip to tip);
 *   - at the nut it is too wide for an average hand (frets 1–4 are 132 mm), which is why the 1‑2‑4 fingering exists;
 *   - a five-fret reach is a stretch around frets 6–10 (128 mm) and easy above the 12th.
 */
const REACH: Record<string, number> = { '1-2': 70, '1-3': 98, '1-4': 130, '2-3': 50, '2-4': 92, '3-4': 54 }
const SIZE: Record<HandSize, number> = { average: 1, large: 1.15 }

/** Millimetres between the fingertips at two frets (along the neck). */
export const tipGap = (a: number, b: number) => Math.abs(tipX(b) - tipX(a))
/** The widest this hand opens along the neck, index to little finger, in mm. */
export const handReach = (hand: HandSize) => REACH['1-4'] * SIZE[hand]
/**
 * How many frets the hand covers beyond the index finger at fret `lo`. The hand opens the same distance everywhere;
 * the frets get narrower up the neck, so the same hand covers more of them: the count grows gradually with `lo`.
 * `easy` is without effort (85% of the reach), `max` the limit.
 */
export function reachAt(lo: number, hand: HandSize = 'average'): { easy: number; max: number } {
  const count = (mm: number) => {
    let s = 0
    while (s < 12 && tipGap(lo, lo + s + 1) <= mm) s++
    return s
  }
  return { easy: count(handReach(hand) * 0.85), max: count(handReach(hand)) }
}

/** One note the fretting hand has to deal with. */
export interface FNote {
  /** String index, 0 = lowest. */
  str: number
  /** Fret (the harmonic's fret for a harmonic); 0 = open string, needs no finger. */
  fret: number
  /**
   * A natural harmonic: the finger does not press, it touches the string lightly, exactly over the fret wire.
   * So it sits half a fret further along than a pressing finger, and one finger cannot press and touch at once.
   */
  harm?: boolean
}

export interface Barre {
  finger: number
  fret: number
  /** The finger must bend back at its last joint to clear a higher string that sounds a lower fret. Hard. */
  bent?: boolean
  /** Lowest and highest string the finger lies across. */
  from: number
  to: number
}

export interface Fingering {
  /** Finger 1–4 per note, in the order given; 0 for an open string. */
  fingers: number[]
  barres: Barre[]
  /** The hand position: the fret under the index finger with one finger per fret. */
  pos: number
  /** Highest fret a finger reaches (for drawing the hand). */
  top: number
  /** How comfortable it is: 0 is effortless; above about 3 it is a real stretch. */
  cost: number
  /** The widest reach as a share of the limit (1 = at the limit). */
  stretch: number
}

function* assignments(n: number, acc: number[] = []): Generator<number[]> {
  if (acc.length === n) return yield acc
  for (let f = 1; f <= 4; f++) yield* assignments(n, [...acc, f])
}

/**
 * Every physically possible fingering of the notes, best first.
 * Open strings (fret 0) need no finger, but a barre cannot lie across them.
 */
export function fingerings(notes: FNote[], hand: HandSize = 'average'): Fingering[] {
  const idx = notes.map((n, i) => ({ ...n, i })).filter((n) => n.fret > 0)
  const openStrings = notes.filter((n) => n.fret === 0).map((n) => n.str)
  const k = SIZE[hand]
  const out: Fingering[] = []
  if (!idx.length) return [{ fingers: notes.map(() => 0), barres: [], pos: 0, top: 0, cost: 0, stretch: 0 }]
  for (const fs of assignments(idx.length)) {
    let ok = true
    let cost = 0
    let stretch = 0
    // group the notes of each finger
    const by: Record<number, typeof idx> = { 1: [], 2: [], 3: [], 4: [] }
    idx.forEach((n, j) => by[fs[j]].push(n))
    const barres: Barre[] = []
    for (let f = 1; f <= 4 && ok; f++) {
      const g = by[f]
      if (g.length < 2) continue
      // one finger, several notes: all at one fret (a barre), and all pressed or all touched: never both
      if (g.some((n) => n.fret !== g[0].fret || !!n.harm !== !!g[0].harm)) ok = false
      const touch = !!g[0].harm
      const from = Math.min(...g.map((n) => n.str))
      const to = Math.max(...g.map((n) => n.str))
      // nothing under the barre may need a lower fret, or ring open
      if (idx.some((n) => n.str > from && n.str < to && n.fret < g[0].fret)) ok = false
      // a finger that only touches would damp any other note under it
      if (touch && idx.some((n) => n.str > from && n.str < to && !g.includes(n))) ok = false
      if (openStrings.some((s) => s > from && s < to)) ok = false
      // a flat finger 2, 3 or 4 holds up to four strings; only the index makes a full barre
      if (!touch && f > 1 && to - from > 3) ok = false
      // a flat finger lies over every string from its tip to the G string. A higher string that must sound
      // a lower fret (or ring open) is only possible if the finger bends back to clear it: hard, and rare.
      // The same holds for a harmonic on a higher string: it needs its string free of any finger. And a finger that
      // only touches would damp every other note it lies over.
      const over = notes.some((n) => n.str > to && (n.fret < g[0].fret || n.harm || (touch && n.fret > 0)))
      if (over) cost += 1.3
      barres.push({ finger: f, fret: g[0].fret, from, to, ...(over ? { bent: true } : {}) })
      // the index is the natural barre; the ring finger the natural flat finger; middle and little are weaker flat
      // a finger that lies flat to touch: the natural ones are the index (the usual barre posture, the other fingers
      // arch over it) and the little finger (the outside of the hand lies flat while the others press). A flat middle
      // or ring finger beside an arched, pressing neighbour is the hard case: the two postures fight each other.
      cost += touch ? [0, 0.3, 1.1, 0.9, 0.35][f] + 0.1 * (to - from - 1) : [0, 0.35, 0.8, 0.5, 0.95][f] + 0.2 * (to - from - 1)
    }
    if (!ok) continue
    // one fingertip per finger: for a barre, both ends count for reach
    // `fret` here is the place along the neck in frets: a touched harmonic is over the wire, half a fret past the fingertip of that fret
    const tips: { f: number; x: number; y: number; fret: number; str: number; harm: boolean; flat: boolean }[] = []
    for (let f = 1; f <= 4; f++)
      for (const n of by[f]) tips.push({ f, x: n.harm ? fretX(n.fret) : tipX(n.fret), y: n.str * STRING_GAP, fret: n.fret + (n.harm ? 0.5 : 0), str: n.str, harm: !!n.harm, flat: by[f].length > 1 })
    for (let a = 0; a < tips.length && ok; a++)
      for (let b = a + 1; b < tips.length && ok; b++) {
        const A = tips[a]
        const B = tips[b]
        if (A.f === B.f) continue
        const [lo, hi] = A.f < B.f ? [A, B] : [B, A]
        // fingers do not cross: a higher finger is never on a lower fret
        if (hi.fret < lo.fret) ok = false
        const d = Math.hypot(hi.x - lo.x, hi.y - lo.y)
        const limit = REACH[`${lo.f}-${hi.f}`] * k
        const r = d / limit
        if (r > 1) ok = false
        stretch = Math.max(stretch, r)
        // free up to 80% of the reach, then it climbs fast
        cost += r > 0.8 ? 60 * (r - 0.8) * (r - 0.8) : 0
        if (hi.fret === lo.fret) {
          // fingers lined up in one fret: each neighbouring pair costs a little (not every pair: three in a row is two squeezes)
          const between = tips.some((t) => t.fret === lo.fret && t.f > lo.f && t.f < hi.f)
          if (!between) cost += Math.abs(hi.str - lo.str) === 1 ? 0.45 : 0.7
          // and they stack one way: the lower-numbered finger on the lower string. The other way round twists the hand.
          if (hi.str < lo.str) cost += 1.5
        }
        // ring and little finger share a tendon: one pressing hard while the other lies flat and light is unreliable
        if (hi.harm !== lo.harm && lo.f === 3 && hi.f === 4 && (lo.flat || hi.flat)) cost += 0.3
        // skipping a finger between neighbouring frets wastes the hand (1 then 3 on frets n, n+1)
        const gap = hi.fret - lo.fret
        if (gap > 0 && hi.f - lo.f > gap + 1) cost += 0.3
      }
    if (!ok) continue
    cost += by[4].length ? 0.15 : 0
    cost += by[3].length ? 0.05 : 0
    // a lone note or a spread shape: prefer the index on the lowest fret (it sets the position)
    const lowest = Math.min(...idx.map((n) => n.fret))
    const lowFinger = Math.min(...idx.map((n, j) => (n.fret === lowest ? fs[j] : 4)))
    cost += (lowFinger - 1) * 0.12
    const pos = Math.max(1, Math.min(...idx.map((n, j) => n.fret - (fs[j] - 1))))
    const fingers = notes.map(() => 0)
    idx.forEach((n, j) => (fingers[n.i] = fs[j]))
    out.push({ fingers, barres, pos, top: Math.max(...idx.map((n) => n.fret)), cost: Math.round(cost * 100) / 100, stretch: Math.round(stretch * 100) / 100 })
  }
  return out.sort((a, b) => a.cost - b.cost)
}

/** The most comfortable fingering, or null when the hand cannot hold the notes. */
export const bestFingering = (notes: FNote[], hand: HandSize = 'average'): Fingering | null => fingerings(notes, hand)[0] ?? null

export interface FingerMove {
  finger: number
  kind: 'stays' | 'slides' | 'lifts' | 'lands'
  /** For stays and slides: the string; for slides the frets it travels between. */
  str?: number
  from?: number
  to?: number
}

/** What each finger does between two fingerings of two note sets. */
export function fingerMoves(a: { notes: FNote[]; f: Fingering }, b: { notes: FNote[]; f: Fingering }): FingerMove[] {
  const out: FingerMove[] = []
  for (let f = 1; f <= 4; f++) {
    const A = a.notes.filter((_, i) => a.f.fingers[i] === f)
    const B = b.notes.filter((_, i) => b.f.fingers[i] === f)
    if (!A.length && !B.length) continue
    if (!A.length) out.push({ finger: f, kind: 'lands' })
    else if (!B.length) out.push({ finger: f, kind: 'lifts' })
    else {
      const same = B.find((n) => A.some((m) => m.str === n.str && m.fret === n.fret))
      const slide = B.find((n) => A.some((m) => m.str === n.str))
      if (same) out.push({ finger: f, kind: 'stays', str: same.str, from: same.fret, to: same.fret })
      else if (slide) out.push({ finger: f, kind: 'slides', str: slide.str, from: A.find((m) => m.str === slide.str)!.fret, to: slide.fret })
      else out.push({ finger: f, kind: 'lands' })
    }
  }
  return out
}

/** Cost of going from one fingering to the next: hand travel, minus what pivots and guide fingers save. */
function shiftCost(a: { notes: FNote[]; f: Fingering }, b: { notes: FNote[]; f: Fingering }): number {
  let c = Math.abs(tipX(Math.max(1, a.f.pos)) - tipX(Math.max(1, b.f.pos))) / 28
  for (const m of fingerMoves(a, b)) {
    if (m.kind === 'stays') c -= 0.7
    else if (m.kind === 'slides') c -= Math.abs(m.to! - m.from!) <= 2 ? 0.5 : 0.2
  }
  // a note that stays must keep its finger: re-fingering a held note means lifting it
  for (let i = 0; i < a.notes.length; i++) {
    const j = b.notes.findIndex((n) => n.str === a.notes[i].str && n.fret === a.notes[i].fret && n.fret > 0)
    if (j >= 0 && a.f.fingers[i] !== b.f.fingers[j]) c += 1.2
  }
  return c
}

/**
 * Fingerings for a progression, chosen together: each chord's own comfort plus every move between chords.
 * Returns one fingering per shape (null where the hand cannot hold it).
 */
export function fingerSequence(shapes: FNote[][], hand: HandSize = 'average', loop = false): (Fingering | null)[] {
  const C = shapes.map((notes) => fingerings(notes, hand).slice(0, 12))
  if (C.some((c) => !c.length)) return C.map((c) => c[0] ?? null)
  const solve = (first: number | null) => {
    let cost = C[0].map((f, j) => (first == null || first === j ? f.cost : Infinity))
    const back: number[][] = []
    for (let i = 1; i < C.length; i++) {
      const row: number[] = []
      cost = C[i].map((f) => {
        let m = Infinity
        let arg = 0
        C[i - 1].forEach((p, j) => {
          const c = cost[j] + shiftCost({ notes: shapes[i - 1], f: p }, { notes: shapes[i], f }) + f.cost
          if (c < m) (m = c), (arg = j)
        })
        row.push(arg)
        return m
      })
      back.push(row)
    }
    if (loop && first != null) cost = cost.map((c, j) => c + shiftCost({ notes: shapes[C.length - 1], f: C[C.length - 1][j] }, { notes: shapes[0], f: C[0][first] }))
    let j = cost.indexOf(Math.min(...cost))
    const total = cost[j]
    const pick = [j]
    for (let i = back.length - 1; i >= 0; i--) pick.unshift((j = back[i][j]))
    return { total, pick }
  }
  let best = solve(null)
  if (loop && C.length > 1) {
    // a loop comes back to its first chord: fix each likely fingering of the first chord in turn, keep the cheapest round trip
    best = solve(0)
    for (let j = 1; j < Math.min(4, C[0].length); j++) {
      const r = solve(j)
      if (r.total < best.total) best = r
    }
  }
  return best.pick.map((j, i) => C[i][j])
}

/** "1 on E‑8 · 3 across D and G at 9 (barre)": a fingering in words. `names` = string names, low to high. */
export function fingeringWords(notes: FNote[], f: Fingering, names: string[]): string {
  const parts: string[] = []
  for (let k = 1; k <= 4; k++) {
    const mine = notes.filter((_, i) => f.fingers[i] === k)
    if (!mine.length) continue
    const strs = mine.map((n) => names[n.str]).join(', ').replace(/, ([^,]*)$/, ' and $1')
    if (mine[0].harm) parts.push(mine.length > 1 ? `${k} touches ${strs} flat over fret ${mine[0].fret}` : `${k} touches ${strs} over fret ${mine[0].fret}`)
    else if (mine.length > 1)
      parts.push(
        `${k} flat across ${strs} at fret ${mine[0].fret}${k === 1 ? ' (barre)' : ''}${f.barres.find((b) => b.finger === k)?.bent ? ', bent back to clear the higher string' : ''}`,
      )
    else parts.push(`${k} on ${names[mine[0].str]}‑${mine[0].fret}`)
  }
  return parts.join(' · ')
}
