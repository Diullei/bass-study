import type { Ctx, Phrase } from './context'

/** One-beat rhythm cells (which 16ths are played) and how dense they feel. */
const CELLS = [
  { p: [1, 0, 0, 0], d: 0.1 },
  { p: [0, 0, 1, 0], d: 0.2 },
  { p: [1, 0, 1, 0], d: 0.4 },
  { p: [1, 0, 0, 1], d: 0.45 },
  { p: [0, 0, 1, 1], d: 0.5 },
  { p: [0, 1, 1, 0], d: 0.55 },
  { p: [1, 1, 1, 0], d: 0.65 },
  { p: [1, 0, 1, 1], d: 0.65 },
  { p: [0, 1, 1, 1], d: 0.75 },
  { p: [1, 1, 1, 1], d: 0.85 },
]
/** Swing has no 16ths: only cells on the 8th-note grid. */
const SWING_CELLS = CELLS.filter((c) => !c.p[1] && !c.p[3])

/**
 * Layer 3 (rhythm & space) decides where phrases start and land.
 * Without it: one long run every two bars. Layer 7 (arc) adds a final phrase that resolves.
 */
export function planPhrases(ctx: Ctx): Phrase[] {
  const { L, T } = ctx
  const R = ctx.R.rh
  let ph: Phrase[] = []
  if (!L.rhythm) {
    for (let t = 0; t < T; t += 32) {
      const end = Math.min(t + 32, T)
      ph.push({ start: t, end, landing: end - 2 })
    }
  } else {
    let t = R.pick([0, 0, 2, 4])
    while (t <= T - 12) {
      const d = ctx.dens(t)
      const beats = R.pick(d > 0.6 ? [4, 5, 6, 7] : d > 0.35 ? [3, 4, 5, 6] : [3, 3, 4, 5])
      const end = Math.min(T, Math.ceil((t + beats * 4) / 4) * 4)
      ph.push({ start: t, end, landing: Math.max(t, end - 4) })
      t = end + R.pick(d > 0.6 ? [2, 4, 4, 6] : [4, 6, 8, 8])
    }
    // sometimes land an 8th early, anticipating the next chord
    ph.forEach((p) => {
      if (p.landing != null && p.landing > p.start + 2 && p.landing % 16 === 0 && p.landing > 0 && R.chance(0.35)) {
        p.landing -= 2
        p.anticip = true
      }
    })
  }
  if (L.arc) {
    const finalT = T - 16
    const keep = ph.filter((p) => p.end <= finalT - 12)
    const lastEnd = keep.length ? keep[keep.length - 1].end : 0
    const start = Math.max(lastEnd + 4, finalT - 16 + (L.rhythm ? R.pick([0, 2, 4, 8]) : 0))
    // the closing phrase always starts before the note it lands on
    keep.push({ start: Math.min(start, finalT - 4), end: finalT + 4, landing: finalT, final: true })
    ph = keep
  }
  return ph
}

/** Onsets (in 16ths) for one phrase. */
export function baseRhythm(ph: Phrase, ctx: Ctx): number[] {
  const { L, S } = ctx
  const R = ctx.R.rh
  const lim = ph.landing != null ? ph.landing : ph.end
  const ons: number[] = []
  if (!L.rhythm) {
    for (let t = ph.start; t < lim; t += 2) ons.push(t)
  } else {
    const cells = S.feel === 'swing' ? SWING_CELLS : CELLS
    for (let b = Math.floor(ph.start / 4) * 4; b < lim; b += 4) {
      let d = ctx.dens(b)
      if (ph.isFill) d = Math.min(0.95, d + 0.25)
      const c = R.wpick(cells, (c) => Math.exp(-((c.d - d) ** 2) / 0.03) + 0.02)
      c.p.forEach((v, i) => {
        const t = b + i
        if (v && t >= ph.start && t < lim) ons.push(t)
      })
    }
    if (!ons.includes(ph.start) && !(ph.isFill && R.chance(0.3))) ons.push(ph.start)
    if (ph.isFill && !ons.some((t) => t >= lim - 2)) ons.push(S.feel === 'swing' ? lim - 2 : R.chance(0.5) ? lim - 1 : lim - 2)
  }
  if (ph.landing != null) ons.push(ph.landing)
  if (!ons.length) ons.push(ph.start)
  return [...new Set(ons)].sort((a, b) => a - b)
}
