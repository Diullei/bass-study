import type { IdeaNote } from '../model'
import type { Ctx } from './context'
import { beatName, inSet } from './pitch'

/**
 * Layer 5: decorate the arrival on a target with the one or two notes before it —
 * a chromatic approach, a double-chromatic approach, or an enclosure.
 */
export function applyApproach(ns: IdeaNote[], ctx: Ctx) {
  const R = ctx.R.ap
  const ok = (m: number) => m >= ctx.lo && m <= ctx.hi
  for (let i = 1; i < ns.length; i++) {
    const tg = ns[i]
    if (!(tg.strong || tg.fixed)) continue
    const p1 = ns[i - 1]
    if (p1.strong || p1.fixed || tg.t - p1.t > 4) continue
    const b = tg.midi
    const ch = ctx.chords[tg.ci]
    const p2 = i >= 2 ? ns[i - 2] : null
    const p2ok = !!p2 && !p2.strong && !p2.fixed && tg.t - p2.t <= 6
    const r = R.f()
    const nb = ctx.name(b, tg.ci)
    if (p2 && p2ok && r < 0.3 && ok(b - 1)) {
      let up = b + 1
      while (!inSet(up, ch, ch.scale)) up++
      if (!ok(up)) continue
      p2.midi = up
      p1.midi = b - 1
      p1.pref = 'sharp'
      p2.role = p1.role = 'enclosure'
      p2.why = `Enclosure, step 1: the scale note above the target ${nb}.`
      p1.why = `Enclosure, step 2: a half step below ${nb}. The target is surrounded, then hit.`
      ctx.addLog(p2.t, `${beatName(tg.t)}: enclosed ${nb} (${ctx.name(up, tg.ci)} → ${ctx.name(b - 1, tg.ci, 'sharp')} → ${nb}).`)
    } else if (p2 && p2ok && r < 0.42 && p2.midi < b && ok(b - 2)) {
      p2.midi = b - 2
      p1.midi = b - 1
      p2.pref = p1.pref = 'sharp'
      p2.role = p1.role = 'approach'
      p2.why = p1.why = `Double chromatic approach: walking up by half steps into ${nb}.`
      ctx.addLog(p2.t, `${beatName(tg.t)}: double-chromatic approach into ${nb}.`)
    } else if (r < 0.8) {
      const below = p1.midi <= b
      const m = below ? b - 1 : b + 1
      if (!ok(m)) continue
      p1.midi = m
      p1.pref = below ? 'sharp' : 'flat'
      p1.role = 'approach'
      p1.why = `Chromatic approach: a half step ${below ? 'below' : 'above'} ${nb}. It sounds “outside” for a moment, then resolves.`
      ctx.addLog(p1.t, `${beatName(tg.t)}: approached ${nb} from a half step ${below ? 'below' : 'above'} (${ctx.name(m, tg.ci, p1.pref)}).`)
    }
  }
}
