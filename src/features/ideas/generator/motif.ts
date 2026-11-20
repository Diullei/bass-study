import type { IdeaNote } from '../model'
import type { Ctx, Phrase } from './context'
import { circ, fitRange, idxNearest, nearest, notesIn, pcOf, snapScale } from './pitch'

/** Layer 6: the first phrase is the seed; later phrases develop it. */

export type TransformType = 'sequence' | 'displace' | 'invert' | 'alter-end' | 'fragment' | 'sequence-up'
export interface Transform {
  type: TransformType
  /** Shift in 16ths (displacement). */
  disp: number
  /** Fragment: scale steps between repeats. */
  shift?: number
}

export const TF_DESC: Record<TransformType, string> = {
  sequence: 'the seed motif moved onto this chord (same shape and rhythm, starting on the matching chord tone)',
  displace: 'the motif displaced: same notes, shifted later so it lands differently',
  invert: 'the motif upside down: same rhythm, contour flipped',
  'alter-end': 'the motif with a new ending: the ear expects the old ending and gets a twist',
  fragment: 'a fragment of the motif, repeated a step higher or lower',
  'sequence-up': 'the motif moved higher, raising the energy',
}

/** Phrases 2, 3, 4 of every group of four develop the idea in turn. */
export function chooseTransform(k: number, ctx: Ctx): Transform {
  const R = ctx.R.mo
  const m = k % 4
  if (m === 1) return { type: 'sequence', disp: 0 }
  if (m === 2)
    return R.pick<Transform>([
      { type: 'displace', disp: R.pick([2, 4]) },
      { type: 'invert', disp: 0 },
      { type: 'alter-end', disp: 0 },
    ])
  return R.pick<Transform>([{ type: 'fragment', disp: 0, shift: R.pick([1, -1, 2]) }, { type: 'sequence-up', disp: 0 }])
}

export function motifOnsets(ph: Phrase, tf: Transform, ctx: Ctx): { t: number; step: number }[] {
  const M = ctx.motif
  if (!M) return []
  let rel = M.rel.slice()
  let steps = M.steps.slice()
  if (tf.type === 'fragment') {
    const n = Math.min(3, rel.length)
    const r0 = rel.slice(0, n)
    const s0 = steps.slice(0, n)
    const sp = r0[n - 1] + 2
    rel = r0.concat(r0.map((r) => r + sp))
    steps = s0.concat(s0.map((s) => s + (tf.shift ?? 1)))
  }
  const lim = ph.landing != null ? ph.landing : ph.end - 2
  const out: { t: number; step: number }[] = []
  for (let i = 0; i < rel.length; i++) {
    const t = ph.start + tf.disp + rel[i]
    if (t >= lim) break
    out.push({ t, step: steps[i] })
  }
  return out
}

/** Remember the first notes of a phrase as the seed motif. */
export function extractMotif(real: IdeaNote[], ph: Phrase, ctx: Ctx) {
  const base = ph.isFill ? real.slice(0, -1) : real.filter((n) => !n.landing)
  const cand = base.slice(0, 5)
  if (cand.length < 2) return
  const ch = ctx.chords[cand[0].ci]
  const SL = notesIn(ch, ch.scale, ctx.lo - 24, ctx.hi + 24)
  const i0 = idxNearest(SL, cand[0].midi)
  ctx.motif = {
    rel: cand.map((n) => n.t - ph.start),
    steps: cand.map((n) => idxNearest(SL, n.midi) - i0),
    startIv: pcOf(cand[0].midi - ch.root),
  }
  cand.forEach((n) => {
    n.seed = true
    n.why += ' Part of the seed motif.'
  })
  ctx.addLog(cand[0].t, `Seed motif: ${cand.map((n) => ctx.name(n.midi, n.ci)).join(' ')}. Its shape and rhythm get developed in later phrases.`)
}

/** Pitch the motif's notes in this phrase: same scale-step shape, starting on the matching chord tone. */
export function applyMotifPitches(ns: IdeaNote[], mot: { t: number; step: number }[], tf: Transform, prev: number | null, ctx: Ctx) {
  const M = ctx.motif
  const first = ns.find((n) => n.t === mot[0].t)
  if (!M || !first) return
  const R = ctx.R.mo
  const ch = ctx.chords[first.ci]
  let iv = M.startIv
  if (!ch.tones.includes(iv)) iv = ch.tones.reduce((b, x) => (circ(x, M.startIv) < circ(b, M.startIv) ? x : b), ch.tones[0])
  let ref = prev ?? ctx.center(first.t)
  if (ctx.L.arc) ref = Math.round((ref + ctx.center(first.t)) / 2)
  if (tf.type === 'sequence-up') ref += 5
  const sp = nearest(notesIn(ch, [iv], ctx.lo, ctx.hi), ref)
  const SL = notesIn(ch, ch.scale, ctx.lo - 24, ctx.hi + 24)
  const i0 = idxNearest(SL, sp)
  let lastN: IdeaNote | null = null
  mot.forEach((m) => {
    const n = ns.find((x) => x.t === m.t)
    if (!n) return
    const s = tf.type === 'invert' ? -m.step : m.step
    const p = SL[Math.max(0, Math.min(SL.length - 1, i0 + s))]
    n.midi = fitRange(snapScale(p, ctx.chords[n.ci]), ctx)
    n.fixed = true
    n.role = 'motif'
    n.why = `Motif: ${TF_DESC[tf.type]}.`
    lastN = n
  })
  const last = lastN as IdeaNote | null
  if (tf.type === 'alter-end' && last) {
    const own = ctx.chords[last.ci]
    const ct = notesIn(own, own.tones, ctx.lo, ctx.hi).filter((x) => x !== last.midi)
    if (ct.length) {
      last.midi = nearest(ct, last.midi + R.pick([-4, -3, 3, 4]))
      last.why += ' This is the changed ending.'
    }
  }
}
