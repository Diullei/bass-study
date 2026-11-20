import type { IdeaChord, IdeaNote } from '../model'
import { blank, type Ctx, type Phrase } from './context'
import { genPhrase } from './phrase'
import { pcOf } from './pitch'

/** Grooves per feel: [16th, degree, length in 16ths]. */
const GROOVES: Record<string, [number, 'R' | '5' | '7' | '8', number][]> = {
  straight: [[0, 'R', 3], [6, 'R', 2], [8, '5', 3], [12, 'R', 2], [14, '8', 2]],
  funk: [[0, 'R', 2], [3, 'R', 1], [6, '8', 1], [8, 'R', 1], [10, '7', 1], [11, '8', 1], [14, '5', 1]],
  swing: [[0, 'R', 7], [8, '5', 7]],
}
const DEG_NAME = { R: 'root', '5': '5th', '7': '7th', '8': 'octave' }

/** The root in the lowest octave of a 4-string (E1–D♯2). */
export const rootLow = (ch: IdeaChord) => 28 + pcOf(ch.root - 28)

/** The groove of one bar, up to (not including) 16th `ws`, where a fill starts. */
function grooveBar(b: number, ws: number, ctx: Ctx): IdeaNote[] {
  const ch = ctx.chords[b]
  const r = rootLow(ch)
  const out: IdeaNote[] = []
  for (const [p, deg, dur] of GROOVES[ctx.S.feel]) {
    if (p >= ws) continue
    let iv = 0
    if (deg === '5') iv = ch.tones.includes(7) ? 7 : 6
    else if (deg === '8') iv = 12
    else if (deg === '7') iv = ch.tones.includes(10) ? 10 : ch.tones.includes(11) ? 11 : 12
    out.push({ ...blank(b * 16 + p, b), midi: r + iv, dur, role: 'groove', why: `Groove: ${DEG_NAME[deg]} of ${ch.sym}. Holding the pocket.` })
  }
  return out
}

/** "Groove + fills": hold the groove, and every few bars play a fill that aims at the next chord's root. */
export function genFills(ctx: Ctx): IdeaNote[] {
  const { S, L, chords, bars } = ctx
  const all: IdeaNote[] = []
  let k = 0
  const fillBars: number[] = []
  for (let b = 0; b < bars; b++) if ((b + 1) % S.fillEvery === 0) fillBars.push(b)
  for (let b = 0; b < bars; b++) {
    const fi = fillBars.indexOf(b)
    let fb = S.fillBeats
    // with the arc, fills grow as the song goes on
    if (fi >= 0 && L.arc) {
      const p = fillBars.length > 1 ? fi / (fillBars.length - 1) : 1
      fb = Math.max(1, Math.min(4, Math.round(S.fillBeats - 1 + p * 2)))
    }
    const ws = fi >= 0 ? 16 - fb * 4 : 16
    all.push(...grooveBar(b, ws, ctx))
    if (fi >= 0) {
      const nb = (b + 1) % bars
      const tgt = rootLow(chords[nb])
      const ph: Phrase = { start: b * 16 + ws, end: (b + 1) * 16, landing: null, isFill: true, target: { t: (b + 1) * 16, midi: tgt, ci: nb } }
      ctx.addLog(
        ph.start,
        `Fill (${fb} beat${fb > 1 ? 's' : ''}) into ${chords[nb].sym}. Worked backwards from the target: ${ctx.name(tgt, nb)} (root) on the next downbeat.`,
      )
      const prev = all.length ? all[all.length - 1].midi : null
      all.push(...genPhrase(ph, k, ctx, prev, (b + 1) * 16))
      k++
    }
  }
  return all
}
