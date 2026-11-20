import { seeded } from '../../theory/random'
import { nm } from '../../theory/notes'
import { PENT, pentShort } from '../../theory/pentatonic'
import { drillChord, keyForChord, progressionChords, rootOf } from './chords'
import { addBlueNotes, finishLine, rangeFor, rhythm, riffLine, scaleRun, sequenceRun, walk } from './lines'
import { OUTSIDE_PEN, R_MIN, SLIP_MIN, type DrillChord, type Line, type PNote, type PentRef } from './model'

/** What a lesson's practice generates. Chord-based drills work on any root; "changes" on any key. */
export type DrillSpec =
  | { type: 'scale'; q: string; pents: PentRef[]; octaves: 1 | 2 }
  | { type: 'sequence'; q: string; pents: PentRef[]; pattern: '3s' | '4s' | '4ths' }
  | { type: 'riff'; q: string }
  | { type: 'blues'; q: string; major?: boolean; level: 0 | 1 | 2 }
  | { type: 'over'; q: string; pents: PentRef[]; level: 0 | 1 | 2 }
  | { type: 'weave'; q: string; pents: PentRef[]; maxRun: number; level: 0 | 1 | 2 }
  | { type: 'changes'; minor?: boolean; bars: { rn: string; pents: PentRef[] }[]; maxRun: number; level: 0 | 1 | 2 }
  | { type: 'sideslip'; q: string; level: 0 | 1 | 2 }
  | { type: 'callResponse'; q: string; pents: PentRef[]; maxRun: number }

export interface DrillParams {
  /** Chord root (or key tonic) pitch class. */
  root: number
  five: boolean
  seed: number
  /** Which pentatonic, for drills that use one at a time. */
  choice: number
}

/** The pentatonics a drill lets you choose between (one at a time). */
export const choicesOf = (spec: DrillSpec): PentRef[] =>
  spec.type === 'scale' || spec.type === 'sequence' || spec.type === 'over' ? spec.pents : []

/** Does the drill follow a progression (root = key) rather than one chord (root = chord root)? */
export const isProgression = (spec: DrillSpec) => spec.type === 'changes'

const repeat = (root: ReturnType<typeof rootOf>, q: string, refs: PentRef[], bars: number): DrillChord[] =>
  Array.from({ length: bars }, (_, b) => drillChord(root, q, refs, b * 4, 4))

const BARS = 4

export function buildDrill(spec: DrillSpec, p: DrillParams): Line {
  const R = seeded(p.seed, 11)
  const r = rangeFor(p.five)
  let chords: DrillChord[]
  let notes: PNote[]
  let K
  if (spec.type === 'changes') {
    const pc = progressionChords(p.root, !!spec.minor, spec.bars)
    K = pc.K
    chords = pc.chords
    notes = walk(rhythm(chords.length, spec.level, R), chords, r, R, { maxRun: spec.maxRun })
  } else {
    const root = rootOf(p.root, spec.q)
    K = keyForChord(root, spec.q)
    const refs =
      spec.type === 'riff' || spec.type === 'blues'
        ? [spec.type === 'blues' && spec.major ? { ...R_MIN, kind: 'major' as const, role: 'major pentatonic' } : R_MIN]
        : spec.type === 'sideslip'
          ? [R_MIN, SLIP_MIN]
          : spec.pents
    const one = drillChord(root, spec.q, refs)
    const choice = Math.min(p.choice, refs.length - 1)
    switch (spec.type) {
      case 'scale':
        notes = scaleRun(one, choice, spec.octaves, r)
        break
      case 'sequence':
        notes = sequenceRun(one, choice, spec.pattern, r)
        break
      case 'riff':
        notes = riffLine(one, r, R)
        break
      case 'blues': {
        const n = Math.max(1, BARS)
        chords = repeat(root, spec.q, refs, n)
        notes = addBlueNotes(walk(rhythm(n, spec.level, R), chords, r, R, { maxRun: 0, only: 0 }), one, R, spec.major)
        break
      }
      case 'over':
        chords = repeat(root, spec.q, refs, BARS)
        notes = walk(rhythm(BARS, spec.level, R), chords, r, R, { maxRun: 0, only: choice })
        break
      case 'weave':
        chords = repeat(root, spec.q, refs, BARS)
        notes = walk(rhythm(BARS, spec.level, R), chords, r, R, { maxRun: spec.maxRun })
        break
      case 'sideslip': {
        chords = repeat(root, spec.q, refs, BARS)
        // bar 2: first half outside; bar 4: three beats outside, resolve on beat 4
        const setAt = (t: number) => ((t >= 16 && t < 24) || (t >= 48 && t < 60) ? 1 : 0)
        notes = walk(rhythm(BARS, spec.level, R, false), chords, r, R, { maxRun: 0, setAt })
        break
      }
      case 'callResponse': {
        chords = repeat(root, spec.q, refs, BARS)
        const slots = rhythm(BARS, 1, R, false).filter((x) => Math.floor(x.t / 16) % 2 === 0)
        for (const b of [1, 3]) slots.push({ t: b * 16, dur: 16, rest: true })
        slots.sort((a, b) => a.t - b.t)
        notes = walk(slots, chords, r, R, { maxRun: spec.maxRun })
        break
      }
    }
    chords ??= notes.length && Math.max(...notes.map((n) => n.t + n.dur)) > 16
      ? repeat(root, spec.q, refs, Math.ceil(Math.max(...notes.map((n) => n.t + n.dur)) / 16))
      : [one]
  }
  // lines that do not fill the last bar get a rest to the end
  const end = Math.max(...notes.map((n) => n.t + n.dur))
  const bars = Math.max(chords.length, Math.ceil(end / 16))
  while (chords.length < bars) chords.push({ ...chords[chords.length - 1], chord: { ...chords[chords.length - 1].chord, start: chords.length * 4 } })
  notes.forEach((n) => (n.ci = Math.min(chords.length - 1, Math.floor(n.t / 16))))
  if (end < bars * 16) notes.push({ t: end, dur: bars * 16 - end, rest: true, midi: 0, set: -1, ci: bars - 1, str: 0, fret: 0, label: '', pen: '' })
  finishLine(notes, chords, p.five)
  return { K, chords, notes, bars, legend: legendOf(spec, chords, notes) }
}

function legendOf(spec: DrillSpec, chords: DrillChord[], notes: PNote[]) {
  const used = new Set(notes.filter((n) => !n.rest).map((n) => `${n.ci}:${n.set}`))
  const out: { pen: string; text: string }[] = []
  const seen = new Set<string>()
  chords.forEach((c, ci) =>
    c.sets.forEach((s, si) => {
      if (!used.has(`${ci}:${si}`)) return
      const text =
        spec.type === 'changes' ? `${s.ref.role}` : `${pentShort(s.root, s.ref.kind)} (${s.ref.role})`
      const key = `${s.pen}|${text}`
      if (seen.has(key)) return
      seen.add(key)
      out.push({ pen: s.pen, text })
    }),
  )
  if (notes.some((n) => n.set === -1 && !n.rest)) out.push({ pen: OUTSIDE_PEN, text: spec.type === 'blues' && spec.major ? 'the ♭3 (major blues)' : 'blue note (♯4 / ♭5)' })
  return out
}

/** Label for the root/key selector of a drill. */
export const rootLabel = (spec: DrillSpec, root: number) => {
  if (spec.type === 'changes') return progressionChords(root, !!spec.minor, spec.bars).K.label
  const q = spec.q
  return `${nm(rootOf(root, q))}${q}`
}

export const pentLabel = (spec: DrillSpec, root: number, ref: PentRef) => {
  if (spec.type === 'changes') return ref.role
  const c = drillChord(rootOf(root, spec.q), spec.q, [ref])
  return `${pentShort(c.sets[0].root, ref.kind)} · ${ref.role}`
}

export { PENT }
