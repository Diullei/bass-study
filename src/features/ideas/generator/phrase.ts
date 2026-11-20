import type { IdeaNote } from '../model'
import { applyApproach } from './approach'
import { blank, type Ctx, type Phrase } from './context'
import { applyMotifPitches, chooseTransform, extractMotif, motifOnsets, TF_DESC } from './motif'
import { beatName } from './pitch'
import { baseRhythm, planPhrases } from './rhythm'
import { assignPhrasePitches } from './targets'

/** A solo line: plan the phrases, then write each one. */
export function genSolo(ctx: Ctx): IdeaNote[] {
  const all: IdeaNote[] = []
  const phrases = planPhrases(ctx)
  let prev: number | null = null
  phrases.forEach((ph, k) => {
    const nextStart = phrases[k + 1] ? phrases[k + 1].start : ctx.T
    const ns = genPhrase(ph, k, ctx, prev, nextStart)
    if (ns.length) prev = ns[ns.length - 1].midi
    all.push(...ns)
    if (ctx.L.rhythm && phrases[k + 1]) {
      const br = phrases[k + 1].start - ph.end
      if (br > 0) ctx.addLog(ph.end, `Breathe: ${br / 4} beat${br === 4 ? '' : 's'} of space before the next phrase.`)
    }
  })
  return all
}

/** One phrase (or fill): rhythm → motif → pitches → approach notes → lengths. */
export function genPhrase(ph: Phrase, k: number, ctx: Ctx, prev: number | null, nextStart: number): IdeaNote[] {
  const { L, bars } = ctx
  let tf = L.motif && ctx.motif && k % 4 !== 0 ? chooseTransform(k, ctx) : null
  let ons = baseRhythm(ph, ctx)
  let mot: { t: number; step: number }[] | null = null
  if (tf) {
    mot = motifOnsets(ph, tf, ctx)
    if (mot.length >= 2) {
      const lastM = mot[mot.length - 1].t
      ons = [...new Set(mot.map((m) => m.t).concat(ons.filter((t) => t > lastM)))].sort((a, b) => a - b)
    } else {
      tf = null
      mot = null
    }
  }
  const ns: IdeaNote[] = ons.map((t) => {
    const n = blank(t, Math.min(bars - 1, Math.floor(t / 16)))
    n.strong = t % 8 === 0 || t === ph.start || t === ph.landing
    if (t === ph.landing) {
      n.landing = true
      if (ph.final) n.final = true
      if (ph.anticip) {
        n.anticip = true
        n.ci = Math.min(bars - 1, n.ci + 1)
      }
    }
    return n
  })
  if (tf && mot) {
    applyMotifPitches(ns, mot, tf, prev, ctx)
    ctx.addLog(ph.start, `Phrase ${k + 1}: ${TF_DESC[tf.type]}.`)
  } else if (!ph.isFill) {
    const idea = L.motif && k % 4 === 0 ? (k === 0 ? ' (the seed idea)' : ' (a new idea: the old one has been developed enough)') : ''
    ctx.addLog(ph.start, `Phrase ${k + 1}${idea}: ${ns.length} notes, from ${beatName(ph.start)}.`)
  }
  if (ph.target) ns.push({ ...blank(ph.target.t, ph.target.ci), midi: ph.target.midi, fixed: true, strong: true, virtual: true })
  assignPhrasePitches(ns, prev, ctx, ph)
  if (L.approach) applyApproach(ns, ctx)
  const real = ns.filter((n) => !n.virtual)
  real.forEach((n, i) => {
    if (i < real.length - 1) n.dur = Math.min(real[i + 1].t - n.t, 4)
    else if (ph.isFill) n.dur = Math.max(1, ph.end - n.t)
    else if (ph.final) n.dur = ctx.T - n.t
    else n.dur = Math.max(1, Math.min(nextStart - n.t, L.rhythm ? 4 + ctx.R.rh.int(0, 4) : 2))
  })
  if (L.motif && k % 4 === 0 && !tf) extractMotif(real, ph, ctx)
  const an = real.find((x) => x.anticip)
  if (an) an.why += ` Anticipation: it lands on ${ctx.chords[an.ci].sym} an 8th note early, which pushes the groove forward.`
  if (ph.final && L.arc) {
    const f = real[real.length - 1]
    if (f) {
      f.why += ' Final resolution: low root, held. The story ends.'
      ctx.addLog(f.t, `Resolution: the line comes back down and ends on ${ctx.name(f.midi, f.ci)}, the root, held.`)
    }
  }
  return real
}
