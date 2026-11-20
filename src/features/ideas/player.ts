import { bandBar, feelTime } from '../../audio/band'
import type { Highlight } from '../../audio/player'
import { audioContext, bassTone } from '../../audio/synth'
import type { Feel, Idea } from './model'
import type { IdeaScore } from './score'

export interface IdeaPlayOptions {
  tempo: number
  feel: Feel
  drums: boolean
  chords: boolean
  loop: boolean
  /** Bass an octave up, for laptop speakers. */
  octUp: boolean
}

interface Span {
  s: number
  e: number
  events?: number[]
  chord?: number
}

/** Plays an idea with drums and chords, looping, and reports which notes are sounding. */
export class IdeaPlayer {
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

  play(idea: Idea, map: IdeaScore, o: IdeaPlayOptions) {
    this.stop()
    const AC = audioContext()
    if (!AC) return
    this.AC = AC
    const master = AC.createGain()
    const comp = AC.createDynamicsCompressor()
    master.gain.value = 0.8
    master.connect(comp).connect(AC.destination)
    this.master = master
    this.playing = true
    this.onState(true)
    this.TL = []
    const beat = 60 / o.tempo
    const loopDur = idea.bars * 4 * beat
    const origin = AC.currentTime + 0.15
    let k = 0
    const go = () => {
      if (!this.playing) return
      const t0 = origin + k * loopDur
      this.schedule(idea, map, o, t0)
      k++
      const left = (t0 + loopDur - AC.currentTime) * 1000
      if (o.loop) this.timers.push(window.setTimeout(go, Math.max(0, left - 400)))
      else this.timers.push(window.setTimeout(() => this.stop(), left + 300))
    }
    go()
    this.raf = requestAnimationFrame(this.tick)
  }

  private schedule(idea: Idea, map: IdeaScore, o: IdeaPlayOptions, t0: number) {
    const AC = this.AC
    const out = this.master
    if (!AC || !out) return
    const beat = 60 / o.tempo
    const at = (t: number) => t0 + feelTime(t, o.feel) * beat
    const now = AC.currentTime
    for (let b = 0; b < idea.bars; b++) {
      bandBar(AC, out, at(b * 16), beat, o.feel, { drums: o.drums, chord: o.chords ? idea.chords[b].chord : null })
      this.TL.push({ s: at(b * 16), e: at(b * 16 + 16), chord: b })
    }
    idea.notes.forEach((n, i) => {
      const st = at(n.t) + n.off
      const en = at(n.t + n.dur)
      bassTone(AC, out, Math.max(st, now + 0.01), n.midi + (o.octUp ? 12 : 0), Math.max(0.05, (en - st) * n.gate), {
        vel: n.vel,
        slide: n.slide,
        legato: n.legato,
        ghost: n.ghost,
      })
      this.TL.push({ s: st, e: en, events: map.eventsOf[i] })
    })
  }

  private tick = () => {
    if (!this.playing || !this.AC) return
    const now = this.AC.currentTime
    const events: number[] = []
    const chords: number[] = []
    this.TL.forEach((x) => {
      if (now < x.s || now >= x.e) return
      if (x.events) events.push(...x.events)
      else if (x.chord != null) chords.push(x.chord)
    })
    const key = events.join(',') + '|' + chords.join(',')
    if (key !== this.lastKey) {
      this.lastKey = key
      this.onHighlight({ events, chords })
    }
    if (this.TL.length > 3000) this.TL = this.TL.filter((x) => x.e > now)
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
      m.gain.setTargetAtTime(0, this.AC.currentTime, 0.03)
      setTimeout(() => m.disconnect(), 400)
    }
    this.master = null
    this.onState(false)
  }
}
