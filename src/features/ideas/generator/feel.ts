import type { IdeaNote } from '../model'
import { blank, type Ctx } from './context'

/**
 * Layer 8: how the hands play it — accents, laid-back passing notes, ghost notes,
 * slides into phrase starts, hammer-ons on small fast steps. Without it every note is the same.
 */
export function applyFeel(notes: IdeaNote[], ctx: Ctx) {
  const { L, S } = ctx
  const R = ctx.R.fe
  const extra: IdeaNote[] = []
  let slides = 0
  notes.forEach((n, i) => {
    n.vel = 0.8
    n.off = 0
    n.gate = 0.95
    if (!L.feel) return
    const strong = ['target', 'guide', 'tension', 'motif'].includes(n.role) || n.landing
    const soft = n.role === 'pass' || n.role === 'arp'
    n.vel = n.role === 'groove' ? (n.t % 16 === 0 ? 0.95 : 0.78) : strong ? 0.92 : soft ? 0.64 : 0.78
    if (n.t % 4 === 0) n.vel += 0.04
    n.vel += (R.f() - 0.5) * 0.08
    n.off = (R.f() - 0.5) * 0.012 + (soft ? 0.006 : 0)
    n.gate = n.dur <= 1 ? 0.7 : strong || n.role === 'groove' ? 1 : 0.85
    const prev = notes[i - 1]
    if (!prev || n.role === 'groove') return
    if (n.t - prev.t <= 1 && Math.abs(n.midi - prev.midi) <= 2 && prev.role !== 'groove') {
      n.legato = true
      n.why += ' Played as a hammer-on / pull-off (no new pluck).'
    }
    if (n.t - (prev.t + prev.dur) >= 3 && R.chance(0.35)) {
      n.slide = true
      slides++
      n.why += ' Slides in from a whole step below.'
    }
    if (n.strong && n.t - prev.t >= 3 && R.chance(0.3))
      extra.push(ghost(n.t - 1, Math.floor((n.t - 1) / 16), n.midi, 0.4, 'Ghost note: a muted, percussive pluck right before the target. Rhythm without pitch.'))
  })
  if (L.feel && S.mode === 'fills' && S.feel === 'funk') {
    const taken = new Set([...notes, ...extra].map((n) => n.t))
    for (let b = 0; b < ctx.bars; b++)
      for (const p of [2, 5, 13]) {
        const t = b * 16 + p
        const before = notes.filter((n) => n.t < t)
        const pv = before[before.length - 1]
        if (pv && pv.role === 'groove' && !taken.has(t) && R.chance(0.6))
          extra.push(ghost(t, b, pv.midi, 0.35, 'Ghost note in the groove: keeps the 16th-note motor going.'))
      }
  }
  notes.push(...extra)
  notes.sort((a, b) => a.t - b.t)
  if (L.feel)
    ctx.addLog(0, `Feel: accents on targets, softer passing notes laid back a few ms, ${extra.length} ghost notes, ${slides} slides, hammer-ons on small fast steps.`)
}

function ghost(t: number, ci: number, midi: number, vel: number, why: string): IdeaNote {
  return { ...blank(t, ci), midi, ghost: true, role: 'ghost', dur: 1, vel, gate: 0.5, why }
}
