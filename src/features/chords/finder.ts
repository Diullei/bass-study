/**
 * Searching the neck. `find` lists every playable way to put a set of degrees under one hand,
 * ranked by clarity (Law 2). `voiceLead` picks one shape per chord of a progression so the hand
 * moves as little as possible and the voices move by small steps (Law 4).
 */
import { DEG, FAM, LIMITS, OPEN, parseSym, shapeOf, type ChordSym } from './voicing'

export type Layer = 'root2' | 'pair' | 'shell' | 'grand' | 'rootless' | 'grid'

export const LAYERS: { value: Layer; label: string; what: string; ch: number }[] = [
  { value: 'root2', label: 'Root shells (2 notes)', what: 'root + 7th or root + 10th', ch: 4 },
  { value: 'pair', label: 'Guide-tone pairs', what: '3rd and 7th on the D and G strings', ch: 5 },
  { value: 'shell', label: 'Shells (3 notes)', what: 'root, 3rd, 7th: forms A, B and C', ch: 6 },
  { value: 'grand', label: 'Grand (4 notes)', what: 'a shell plus one colour on top', ch: 11 },
  { value: 'rootless', label: 'Rootless (3 notes)', what: '3rd, 7th and a colour; the root comes first or from the loop', ch: 12 },
  { value: 'grid', label: 'Four-string grid', what: '3rd and 7th on E and A, two colours on D and G', ch: 14 },
]

export type DomColour = 'auto' | 'plain' | 'altered'

type Kind = 'maj7' | '6' | 'm7' | 'm6' | 'mmaj' | '7' | 'sus' | 'hdim' | 'dim'

const KIND: Record<string, Kind> = { maj: 'maj7', tri: 'maj7', six: '6', min: 'm7', mtri: 'm7', m6: 'm6', mmaj: 'mmaj', dom: '7', sus: 'sus', hdim: 'hdim', dim: 'dim', dtri: 'dim' }
export const kindOf = (c: ChordSym): Kind => KIND[c.fam]

const PAIR: Record<Kind, string[]> = {
  maj7: ['3', '7'], '6': ['3', '6'], m7: ['♭3', '♭7'], m6: ['♭3', '6'], mmaj: ['♭3', '7'], '7': ['3', '♭7'], sus: ['4', '♭7'], hdim: ['♭3', '♭7'], dim: ['♭3', '°7'],
}

/** Colours a chord can take: single (for grand/rootless) and pairs (for the grid). Dominants depend on where they go. */
function colours(k: Kind, dom: string[]): { one: string[]; two: string[][] } {
  switch (k) {
    case 'maj7':
      return { one: ['9', '13', '5'], two: [['9', '13'], ['9', '5']] }
    case '6':
      return { one: ['9', '5'], two: [['9', '5']] }
    case 'm7':
      return { one: ['9', '5', '11'], two: [['9', '11'], ['9', '5']] }
    case 'm6':
    case 'mmaj':
      return { one: ['9', '5'], two: [['9', '5']] }
    case '7':
      return { one: [...dom, '5'], two: [dom] }
    case 'sus':
      return { one: ['9', '13'], two: [['9', '13']] }
    case 'hdim':
      return { one: ['♭5', '11'], two: [['♭5', '9'], ['♭5', 'R']] }
    case 'dim':
      return { one: ['♭5', 'R'], two: [['♭5', 'R']] }
  }
}

/**
 * The colours of a dominant from its destination (Rule 5): to minor ♭9 ♭13, to major 9 13,
 * and a dominant that does not fall a fifth floats: 9 ♯11.
 */
export function domColours(c: ChordSym, next: ChordSym | null, pref: DomColour): { degs: string[]; why: string } {
  if (pref === 'plain') return { degs: ['9', '13'], why: 'plain colours' }
  if (pref === 'altered') return { degs: ['♯9', '♭13'], why: 'altered: the strongest pull' }
  if (!next) return { degs: ['9', '13'], why: 'no destination: plain' }
  const down5 = (c.root - next.root + 12) % 12 === 7
  const minor = ['min', 'm6', 'mmaj', 'mtri', 'hdim'].includes(next.fam)
  if (!down5) return { degs: ['9', '♯11'], why: 'does not fall a fifth: Lydian dominant' }
  return minor ? { degs: ['♭9', '♭13'], why: 'goes to minor: colours from the minor key' } : { degs: ['9', '13'], why: 'goes to major: colours from the major key' }
}

/** The degree sets to search for a chord in a layer (alternatives). */
export function degreeSets(c: ChordSym, layer: Layer, dom: string[]): string[][] {
  const k = kindOf(c)
  const P = PAIR[k]
  const C = colours(k, dom)
  switch (layer) {
    case 'root2':
      return [['R', P[1]], ['R', P[0]]]
    case 'pair':
      return [P]
    case 'shell':
      return k === 'hdim' ? [['R', '♭3', '♭7'], ['R', '♭5', '♭7', '♭3']] : [['R', ...P]]
    case 'grand':
      return C.one.map((x) => ['R', ...P, x])
    case 'rootless':
      return C.one.filter((x) => x !== 'R').map((x) => [...P, x])
    case 'grid':
      return C.two.map((t) => [...P, ...t])
  }
}

/** Which strings a layer may use (low to high indexes). Null = any. */
const STRINGS: Record<Layer, number[] | null> = { root2: null, pair: [3, 4], shell: null, grand: null, rootless: [1, 2, 3, 4], grid: [1, 2, 3, 4] }

export interface Found {
  shape: string
  /** Degrees low to high. */
  degs: string[]
  midis: number[]
  /** Clarity cost: how far neighbours sit below their clear floors (Law 2), plus span. Lower is better. */
  score: number
  mud: number
  lo: number
  hi: number
}

function* combos(n: number, k: number, start = 0, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) return yield acc
  for (let i = start; i < n; i++) yield* combos(n, k, i + 1, [...acc, i])
}
function* perms<T>(xs: T[]): Generator<T[]> {
  if (xs.length <= 1) return yield xs
  for (let i = 0; i < xs.length; i++) for (const p of perms([...xs.slice(0, i), ...xs.slice(i + 1)])) yield [xs[i], ...p]
}

/** Every playable placement of `degs` over `root` (pitch class), within frets lo–hi. */
export function find(root: number, degs: string[], layer: Layer | null = null, lo = 1, hi = 15): Found[] {
  const pcs = degs.map((d) => (root + DEG[d]) % 12)
  const n = degs.length
  const out: Found[] = []
  const allowed = (layer && STRINGS[layer]) || [0, 1, 2, 3, 4]
  const hasRoot = degs.includes('R')
  for (const strs of combos(allowed.length, n)) {
    const S = strs.map((i) => allowed[i])
    if (layer === 'grid' && S.join() !== '1,2,3,4') continue
    for (const order of perms([...Array(n).keys()])) {
      if (hasRoot && degs[order[0]] !== 'R') continue
      const opts = S.map((s, j) => {
        const r: number[] = []
        for (let f = lo; f <= hi; f++) if ((OPEN[s] + f) % 12 === pcs[order[j]]) r.push(f)
        return r
      })
      const walk = (j: number, fs: number[]) => {
        if (j === n) {
          const span = Math.max(...fs) - Math.min(...fs)
          if (span > 4 || (span === 4 && Math.min(...fs) < 5)) return
          const ps = S.map((s, k) => OPEN[s] + fs[k])
          for (let k = 1; k < n; k++) if (ps[k] <= ps[k - 1]) return
          if (ps[n - 1] - ps[0] > 28) return
          if (hasRoot && ps[0] > 43) return
          let mud = 0
          for (let k = 1; k < n; k++) {
            const iv = ps[k] - ps[k - 1]
            const rootLow = hasRoot && k === 1
            if (rootLow && iv >= 8) continue
            if (LIMITS[iv] != null && ps[k - 1] < LIMITS[iv]) mud += LIMITS[iv] - ps[k - 1]
          }
          const frets: (number | null)[] = [null, null, null, null, null]
          S.forEach((s, k) => (frets[s] = fs[k]))
          const gaps = S[n - 1] - S[0] + 1 - n
          out.push({
            shape: shapeOf(frets),
            degs: order.map((o) => degs[o]),
            midis: ps,
            score: mud + span * 0.6 + (hasRoot ? 0 : gaps * 2) + (span === 4 ? 2 : 0),
            mud,
            lo: Math.min(...fs),
            hi: Math.max(...fs),
          })
          return
        }
        for (const f of opts[j]) walk(j + 1, [...fs, f])
      }
      walk(0, [])
    }
  }
  return out.sort((a, b) => a.score - b.score)
}

export interface Voiced {
  sym: string
  shape: string
  degs: string[]
  /** Why these colours (dominants). */
  why?: string
}

/** Cost of moving the hand and the voices from one shape to the next (Law 4). */
function moveCost(a: Found, b: Found) {
  const ca = (a.lo + a.hi) / 2
  const cb = (b.lo + b.hi) / 2
  const k = Math.min(a.midis.length, b.midis.length)
  let voices = 0
  for (let i = 1; i <= k; i++) voices += Math.abs(a.midis[a.midis.length - i] - b.midis[b.midis.length - i])
  const top = Math.abs(a.midis[a.midis.length - 1] - b.midis[b.midis.length - 1])
  return Math.abs(ca - cb) * 1.2 + voices * 0.35 + (top > 7 ? 4 : 0)
}

/**
 * One shape per chord, chosen together: each chord's own clarity plus the cost of every move.
 * Repeated chords keep their shape. `around` (a fret) pulls the whole progression towards a hand position.
 */
export function voiceLead(syms: string[], layer: Layer, pref: DomColour = 'auto', around = 9): Voiced[] {
  const C = syms.map(parseSym)
  const cands = C.map((c, i) => {
    const next = C.slice(i + 1).find((x) => x.sym !== c.sym) ?? C[0]
    const dc = kindOf(c) === '7' ? domColours(c, next === c ? null : next, pref) : null
    const sets = degreeSets(c, layer, dc?.degs ?? ['9', '13'])
    const all = sets.flatMap((d) => find(c.root, d.filter((x) => FAM[c.fam][DEG[x]] != null || x === '6' || x === '°7'), layer))
    const best = all
      .map((f) => ({ f, own: f.score + Math.abs((f.lo + f.hi) / 2 - around) * 0.25 }))
      .sort((a, b) => a.own - b.own)
      .slice(0, 40)
    return { best, why: dc?.why }
  })
  if (cands.some((x) => !x.best.length)) {
    return C.map((c, i) => ({ sym: c.sym, shape: cands[i].best[0]?.f.shape ?? 'x-x-x-x-x', degs: cands[i].best[0]?.f.degs ?? [], why: cands[i].why }))
  }
  // Viterbi over the candidates
  let cost = cands[0].best.map((x) => x.own)
  const back: number[][] = []
  for (let i = 1; i < C.length; i++) {
    const same = C[i].sym === C[i - 1].sym
    const row: number[] = []
    const next = cands[i].best.map((b) => {
      let m = Infinity
      let arg = 0
      cands[i - 1].best.forEach((a, j) => {
        const c = cost[j] + (same ? (a.f.shape === b.f.shape ? 0 : 50) : moveCost(a.f, b.f)) + b.own
        if (c < m) (m = c), (arg = j)
      })
      row.push(arg)
      return m
    })
    back.push(row)
    cost = next
  }
  let j = cost.indexOf(Math.min(...cost))
  const pickIdx = [j]
  for (let i = back.length - 1; i >= 0; i--) {
    j = back[i][j]
    pickIdx.unshift(j)
  }
  return C.map((c, i) => {
    const f = cands[i].best[pickIdx[i]].f
    return { sym: c.sym, shape: f.shape, degs: f.degs, why: cands[i].why }
  })
}
