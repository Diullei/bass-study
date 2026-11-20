import { nm } from '../../../theory/notes'
import { seeded, type Rng } from '../../../theory/random'
import { spellIn } from '../harmony'
import type { IdeaChord, IdeaNote, IdeaSettings, Layers, LogLine } from '../model'
import type { Key } from '../../../theory/keys'

export interface Phrase {
  start: number
  end: number
  /** Where the phrase lands (a chord tone, held), or null for a fill that aims at `target`. */
  landing: number | null
  anticip?: boolean
  final?: boolean
  isFill?: boolean
  target?: { t: number; midi: number; ci: number }
}

export interface Motif {
  /** Onsets relative to the phrase start. */
  rel: number[]
  /** Scale steps relative to the first note. */
  steps: number[]
  /** First note's interval above its chord root. */
  startIv: number
}

/** Everything the layers share while one idea is generated. */
export interface Ctx {
  S: IdeaSettings
  L: Layers
  K: Key
  chords: IdeaChord[]
  bars: number
  /** Length in 16ths. */
  T: number
  lo: number
  hi: number
  log: LogLine[]
  lastSym: string | null
  motif: Motif | null
  /** One random stream per concern: switching a layer on does not reshuffle the others. */
  R: { rh: Rng; pi: Rng; mo: Rng; ap: Rng; fe: Rng }
  /** Register the line hovers around at time t. */
  center: (t: number) => number
  win: (t: number) => [number, number]
  /** Note density at time t, 0–1. */
  dens: (t: number) => number
  /** Near the top of the solo's arc. */
  peak: (t: number) => boolean
  addLog: (t: number, text: string) => void
  /** Note name, spelled against the chord at that time. */
  name: (m: number, ci: number, pref?: 'flat' | 'sharp') => string
}

/** A fresh note at time t; pitch and role are filled in by the layers. */
export const blank = (t: number, ci: number): IdeaNote => ({
  t, ci, midi: NaN, dur: 1, role: 'scale', why: '', vel: 0.8, off: 0, gate: 0.95, str: 0, fret: 0, label: '',
})

export function makeCtx(S: IdeaSettings, K: Key, chords: IdeaChord[]): Ctx {
  const L = S.layers
  const bars = chords.length
  const T = bars * 16
  const ctx: Ctx = {
    S,
    L,
    K,
    chords,
    bars,
    T,
    lo: S.five ? 23 : 28,
    hi: 60,
    log: [],
    lastSym: null,
    motif: null,
    R: { rh: seeded(S.seed, 1), pi: seeded(S.seed, 2), mo: seeded(S.seed, 3), ap: seeded(S.seed, 4), fe: seeded(S.seed, 5) },
    center: (t) => {
      if (!L.arc) return S.mode === 'fills' ? 45 : 46
      const p = t / T
      return Math.round(p < 0.75 ? 39 + 17 * (p / 0.75) : 56 - 15 * ((p - 0.75) / 0.25))
    },
    win: (t) => {
      const c = ctx.center(t)
      return [Math.max(ctx.lo, c - 8), Math.min(ctx.hi, c + 9)]
    },
    dens: (t) => {
      let d = S.busy
      if (L.arc) {
        const p = t / T
        const s = p < 0.75 ? p / 0.75 : 1 - ((p - 0.75) / 0.25) * 0.7
        d = d * (0.45 + 0.85 * s)
      }
      return Math.max(0.05, Math.min(0.95, d))
    },
    peak: (t) => {
      const p = t / T
      return L.arc && p > 0.45 && p < 0.92
    },
    addLog: (t, text) => ctx.log.push({ t, text }),
    name: (m, ci, pref) => nm(spellIn(m, chords[Math.max(0, Math.min(bars - 1, ci))], K, pref)),
  }
  return ctx
}
