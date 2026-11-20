import type { IdeaNote } from '../model'
import type { Ctx, Phrase } from './context'
import { beatName, fitNear, idxNearest, ivLabel, nearest, notesIn, pcOf, snapScale } from './pitch'

const GUIDE = [3, 4, 10, 11]

/**
 * Layers 1, 2, 4, 7: pick the pitches of a phrase.
 * Without targets every note is a random scale note. With them, strong notes land on chord tones
 * (guide tones at chord changes, colour tones at the peak) and the notes between walk there.
 */
export function assignPhrasePitches(ns: IdeaNote[], prev: number | null, ctx: Ctx, ph: Phrase) {
  const { L, chords } = ctx
  const R = ctx.R.pi
  if (!L.targets) {
    let p = prev ?? ctx.center(ns[0].t)
    for (const n of ns) {
      if (n.fixed) {
        p = n.midi
        continue
      }
      const ch = chords[n.ci]
      const [wl, wh] = ctx.win(n.t)
      const list = notesIn(ch, ch.scale, wl, wh)
      let i = idxNearest(list, p) + R.pick([-5, -4, -3, -2, -2, -1, 1, 2, 2, 3, 4, 5])
      i = Math.max(0, Math.min(list.length - 1, i))
      n.midi = list[i]
      n.role = 'scale'
      n.why = `A random note from ${ch.sym} ${ch.scaleName}. Right notes, no plan.`
      p = n.midi
    }
    return
  }
  const anchors = ns.map((n, i) => (n.fixed || n.strong ? i : -1)).filter((i) => i >= 0)
  // in a fill, the last free anchor may climb so the fill can run back down into the next chord
  let climbI = -1
  if (ph.isFill) {
    const c = anchors.filter((i) => !ns[i].virtual && !ns[i].fixed)
    if (c.length) climbI = c[c.length - 1]
  }
  let lastI = -1
  let lastP = prev
  for (const i of anchors) {
    const n = ns[i]
    if (!n.fixed) {
      const ch = chords[n.ci]
      n.chordChange = ctx.lastSym != null && ch.sym !== ctx.lastSym
      const climb = i === climbI && R.chance(0.65) ? R.pick([5, 7, 9, 12]) : 0
      n.midi = chooseTarget(n, lastP, ctx, climb)
      ctx.lastSym = ch.sym
    } else if (!n.virtual) ctx.lastSym = chords[n.ci].sym
    fillPath(ns, lastI, i, lastP, n.midi, ctx)
    lastI = i
    lastP = n.midi
  }
  for (let i = lastI + 1; i < ns.length; i++) {
    const n = ns[i]
    const ch = chords[n.ci]
    const ref = lastP ?? ctx.center(n.t)
    n.midi = fitNear(snapScale(ref + (R.chance(0.5) ? 2 : -2), ch), ref, ctx)
    n.role = 'pass'
    n.why = `Passing note in ${ch.scaleName}.`
    lastP = n.midi
  }
}

function chooseTarget(n: IdeaNote, prevP: number | null, ctx: Ctx, climb: number): number {
  const { L, chords } = ctx
  const R = ctx.R.pi
  const ch = chords[n.ci]
  let [wl, wh] = ctx.win(n.t)
  let ref = prevP ?? ctx.center(n.t)
  if (L.arc) ref = Math.round(ref * 0.6 + ctx.center(n.t) * 0.4)
  if (climb) {
    ref += climb
    wh = Math.min(ctx.hi, wh + 7)
  }
  // colour tone near the peak of the solo
  if (L.arc && !n.chordChange && !n.landing && !climb && ctx.peak(n.t) && R.chance(0.3)) {
    const tc = notesIn(ch, ch.tens, wl, wh)
    if (tc.length) {
      const m = nearest(tc, ref + R.pick([-2, 2, 1, -1]))
      n.role = 'tension'
      n.why = `Colour tone: the ${ivLabel(m, ch)} of ${ch.sym}, for tension near the peak of the solo. The next notes resolve it.`
      ctx.addLog(n.t, `${beatName(n.t)}: colour tone ${ctx.name(m, n.ci)} (${ivLabel(m, ch)} of ${ch.sym}) for tension at the peak.`)
      return m
    }
  }
  let cands = notesIn(ch, ch.tones, wl, wh)
  if (!cands.length) cands = notesIn(ch, ch.tones, ctx.lo, ctx.hi)
  let best = cands[0]
  let bs = 1e9
  for (const m of cands) {
    const iv = pcOf(m - ch.root)
    const d = Math.abs(m - ref)
    let s = d * 0.6 + (d === 0 ? 2.5 : 0) + (d > 7 ? (d - 7) * 0.8 : 0)
    const g = GUIDE.includes(iv)
    if (L.guide && n.chordChange) s += g ? -5 : 2.5
    else if (L.guide && g) s -= 0.8
    if (!L.guide && iv === 0) s -= 1
    if (n.final && L.arc) {
      s += iv === 0 ? -20 : 5
      s += (m - ctx.lo) * 0.15
    }
    s += R.f() * 2.2
    if (s < bs) {
      bs = s
      best = m
    }
  }
  const iv = pcOf(best - ch.root)
  const lab = ivLabel(best, ch)
  const where = beatName(n.t)
  if (L.guide && n.chordChange && GUIDE.includes(iv)) {
    n.role = 'guide'
    const d = prevP != null ? Math.abs(best - prevP) : null
    const away = d != null ? `${d} semitone${d === 1 ? '' : 's'}` : null
    n.why = `Guide tone: the chord changes to ${ch.sym}, so the player aims for its ${lab}, the closest 3rd or 7th${away ? ` (${away} from the previous note)` : ''}. That makes the change audible.`
    ctx.addLog(n.t, `${where}: chord changes to ${ch.sym}. Aimed for ${ctx.name(best, n.ci)} (${lab})${away ? `, ${away} away` : ''}.`)
  } else {
    n.role = 'target'
    const spot = n.landing ? 'the phrase ending' : n.t % 16 === 0 ? 'the downbeat' : n.t % 8 === 0 ? 'beat 3' : 'the phrase start'
    n.why =
      `Target: the ${lab} of ${ch.sym} on ${spot}. Strong spots land on chord tones.` +
      (climb ? ' It climbs up so the fill can run back down into the next chord.' : '')
  }
  return best
}

/** Notes between two targets: a scale walk, with a turn if there is room, or arpeggio skips if the gap is big. */
function fillPath(ns: IdeaNote[], i0: number, i1: number, a: number | null, b: number, ctx: Ctx) {
  const n = i1 - i0 - 1
  if (n <= 0) return
  const R = ctx.R.pi
  const tch = ctx.chords[ns[i1].ci]
  const from = a ?? b + R.pick([-5, 5, 7, -7])
  const SL = notesIn(tch, tch.scale, ctx.lo - 12, ctx.hi + 12)
  const ia = idxNearest(SL, from)
  const ib = idxNearest(SL, b)
  const total = n + 1
  const dist = ib - ia
  const ad = Math.abs(dist)
  const idxs: number[] = []
  let arp = false
  if (ad >= total) {
    for (let j = 1; j <= n; j++) idxs.push(Math.round(ia + (dist * j) / total))
    arp = ad / total >= 1.8
  } else {
    const extra = total - ad
    const back = Math.floor(extra / 2)
    const odd = extra % 2
    const dir = dist !== 0 ? Math.sign(dist) : R.chance(0.5) ? 1 : -1
    const moves: number[] = []
    if (R.pick(['away', 'over']) === 'away') {
      for (let i = 0; i < back; i++) moves.push(-dir)
      for (let i = 0; i < ad + back; i++) moves.push(dir)
    } else {
      for (let i = 0; i < ad + back; i++) moves.push(dir)
      for (let i = 0; i < back; i++) moves.push(-dir)
    }
    if (odd) moves.splice(R.int(0, moves.length), 0, 0)
    let c = ia
    for (let j = 0; j < n; j++) {
      c += moves[j]
      idxs.push(c)
    }
  }
  const tgtName = ctx.name(b, ns[i1].ci)
  let ref = from
  for (let j = 0; j < n; j++) {
    const note = ns[i0 + 1 + j]
    const own = ctx.chords[note.ci]
    let m = SL[Math.max(0, Math.min(SL.length - 1, idxs[j]))]
    if (arp) {
      const ct = notesIn(own, own.tones, m - 6, m + 6)
      m = ct.length ? nearest(ct, m) : snapScale(m, own)
    } else m = snapScale(m, own)
    note.midi = fitNear(m, ref, ctx)
    ref = note.midi
    note.role = arp ? 'arp' : 'pass'
    note.why = arp
      ? `Arpeggio skip: covering a big distance to the next target (${tgtName}) by jumping through chord tones of ${own.sym}.`
      : `Passing note from ${own.sym} ${own.scaleName}, on the way to the next target (${tgtName}).`
  }
}
