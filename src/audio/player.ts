import type { Score } from '../engine/types'
import { bandBar, type BandFeel } from './band'
import { audioContext, bassTone, click, keyTone, pad } from './synth'

export interface PlayOptions {
  tempo: number
  bass: boolean
  chords: boolean
  guide: boolean
  click: boolean
  countIn: boolean
  loop: boolean
  /** Play with a band (drums + chord stabs) in this feel, instead of held chords. */
  band?: BandFeel
}

/** What is sounding right now: indices into score.events and score.chords. */
export interface Highlight {
  events: number[]
  chords: number[]
}

interface Span {
  s: number
  e: number
  i?: number
  c?: number
}

/** Bar order with repeats and 1st/2nd endings expanded. */
export function playOrder(D: Score): number[] {
  const n = D.bars
  const M = D.marks || []
  const out: number[] = []
  let start = 0
  let pass = 1
  let i = 0
  let s = 0
  while (i < n && s++ < 1000) {
    const m = M[i] || {}
    if (m.start && i !== start) {
      start = i
      pass = 1
    }
    if (m.volta && m.volta !== pass) {
      i++
      continue
    }
    out.push(i)
    if (m.end && pass === 1) {
      pass = 2
      i = start
      continue
    }
    if (m.end && pass === 2) {
      pass = 1
      start = i + 1
    }
    i++
  }
  return out
}

/** Swing: the off-beat eighth is delayed to the last triplet. */
const warp = (p: number, sw?: boolean) => {
  if (!sw) return p
  const f = Math.floor(p)
  const fr = p - f
  return f + (fr < 0.5 ? (fr * 4) / 3 : 2 / 3 + ((fr - 0.5) * 2) / 3)
}

/**
 * Schedules a score on the Web Audio clock and reports which notes are sounding.
 * One player per exercise view; call stop() before discarding it.
 */
export class ScorePlayer {
  private AC: AudioContext | null = null
  private master: GainNode | null = null
  private timers: number[] = []
  private raf = 0
  private TL: Span[] = []
  private lastKey = ''
  playing = false

  private onHighlight: (h: Highlight) => void
  private onState: (playing: boolean) => void

  constructor(onHighlight: (h: Highlight) => void, onState: (playing: boolean) => void) {
    this.onHighlight = onHighlight
    this.onState = onState
  }

  play(score: Score, o: PlayOptions) {
    this.stop()
    const AC = audioContext()
    if (!AC) return
    this.AC = AC
    this.playing = true
    this.onState(true)
    const master = AC.createGain()
    master.gain.value = 0.8
    master.connect(AC.destination)
    this.master = master
    const comp = score.ts[1] === 8
    let t0 = AC.currentTime + 0.12
    this.TL = []
    if (o.countIn) {
      const n = comp ? 2 : score.beats
      const sp = comp ? (60 / o.tempo) * 1.5 : 60 / o.tempo
      for (let k = 0; k < n; k++) click(AC, master, t0 + k * sp, k === 0)
      t0 += n * sp
    }
    this.schedule(score, o, t0)
    this.raf = requestAnimationFrame(this.tick)
  }

  private schedule(ex: Score, o: PlayOptions, t0: number) {
    const AC = this.AC
    const master = this.master
    if (!this.playing || !AC || !master) return
    const comp = ex.ts[1] === 8
    // in 6/8 the tempo is the dotted quarter
    const qs = comp ? 60 / o.tempo / 1.5 : 60 / o.tempo
    const sw = ex.swing
    const ord = playOrder(ex)
    const bb = ex.beats
    ord.forEach((b, k) => {
      const base = t0 + k * bb * qs
      ex.events.forEach((e, gi) => {
        if (e.b !== b) return
        const st = base + warp(e.p, sw) * qs
        const en = base + warp(e.p + e.d, sw) * qs
        this.TL.push({ s: st, e: en, i: gi })
        if (!o.bass || e.rest || e.m == null) return
        const prev = ex.events[gi - 1]
        if (prev && prev.tie && !prev.rest) return
        let d = en - st
        if (e.tie && ex.events[gi + 1]) d += ex.events[gi + 1].d * qs
        bassTone(AC, master, st, e.m - 12, d * 0.92)
      })
      if (o.band && bb === 4) {
        const c = ex.chords.find((x) => x.start <= b * bb + 1e-6 && x.start + x.dur > b * bb + 1e-6) ?? null
        bandBar(AC, master, base, qs, o.band, { drums: true, chord: o.chords ? c : null })
      }
      ex.chords.forEach((c, ci) => {
        const bs = b * bb
        const s = Math.max(c.start, bs)
        const e = Math.min(c.start + c.dur, bs + bb)
        if (e > s + 1e-6) {
          if (o.chords && !(o.band && bb === 4)) pad(AC, master, base + (s - bs) * qs, c, (e - s) * qs)
          this.TL.push({ s: base + (s - bs) * qs, e: base + (e - bs) * qs, c: ci })
        }
      })
      if (o.guide && ex.guide)
        ex.guide
          .filter((e) => e.b === b && !e.rest && e.m != null)
          .forEach((e) => keyTone(AC, master, base + e.p * qs, e.m as number, e.d * qs * 0.95, 0.11))
      if (o.click) {
        const n = comp ? 2 : bb
        const sp = comp ? qs * 1.5 : qs
        for (let j = 0; j < n; j++) click(AC, master, base + j * sp, j === 0)
      }
    })
    const end = t0 + ord.length * bb * qs
    this.timers.push(
      window.setTimeout(
        () => {
          if (o.loop) this.schedule(ex, o, end)
          else this.timers.push(window.setTimeout(() => this.stop(), 600))
        },
        Math.max(0, (end - AC.currentTime - 0.5) * 1000),
      ),
    )
  }

  private tick = () => {
    if (!this.playing || !this.AC) return
    const now = this.AC.currentTime
    const events: number[] = []
    const chords: number[] = []
    this.TL.forEach((x) => {
      if (now >= x.s && now < x.e) {
        if (x.i != null) events.push(x.i)
        else if (x.c != null) chords.push(x.c)
      }
    })
    const key = events.join(',') + '|' + chords.join(',')
    if (key !== this.lastKey) {
      this.lastKey = key
      this.onHighlight({ events, chords })
    }
    if (this.TL.length > 4000) this.TL = this.TL.filter((x) => x.e > now)
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    if (!this.playing) return
    this.playing = false
    this.timers.forEach(clearTimeout)
    this.timers = []
    cancelAnimationFrame(this.raf)
    this.lastKey = ''
    this.onHighlight({ events: [], chords: [] })
    const m = this.master
    if (m && this.AC) {
      try {
        m.gain.setTargetAtTime(0, this.AC.currentTime, 0.02)
      } catch {
        /* already disconnected */
      }
      setTimeout(() => m.disconnect(), 200)
    }
    this.master = null
    this.onState(false)
  }
}
