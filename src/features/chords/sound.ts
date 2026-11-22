import { useEffect, useRef, useState } from 'react'
import { hat, kick, pedalHat, ride, snare } from '../../audio/drums'
import { audioContext, hz } from '../../audio/synth'
import type { Feel } from './patterns'

/** A plucked bass string: bright attack, a long ring, more edge than the bass-line voice (the bridge pickup, Chapter 3). */
function pluck(AC: AudioContext, out: AudioNode, t: number, m: number, dur: number, vel: number) {
  const o = AC.createOscillator()
  const o2 = AC.createOscillator()
  const f = AC.createBiquadFilter()
  const g = AC.createGain()
  const og = AC.createGain()
  o.type = 'sawtooth'
  o2.type = 'triangle'
  o.frequency.value = hz(m)
  o2.frequency.value = hz(m)
  og.gain.value = 0.35
  f.type = 'lowpass'
  f.Q.value = 1.2
  const bright = 1400 + Math.max(0, m - 28) * 45
  f.frequency.setValueAtTime(bright, t)
  f.frequency.exponentialRampToValueAtTime(Math.max(350, bright * 0.35), t + 0.6)
  o.connect(og)
  og.connect(f)
  o2.connect(f)
  f.connect(g)
  g.connect(out)
  const lvl = 0.42 * vel
  const end = t + Math.max(0.12, dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(lvl, t + 0.006)
  g.gain.exponentialRampToValueAtTime(lvl * 0.3, t + 0.9)
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, lvl * 0.12), end)
  g.gain.exponentialRampToValueAtTime(0.0001, end + 0.08)
  o.start(t)
  o2.start(t)
  o.stop(end + 0.1)
  o2.stop(end + 0.1)
}

/** A natural harmonic: almost a sine, a glassy attack, a long ring. */
function bell(AC: AudioContext, out: AudioNode, t: number, m: number, dur: number, vel: number) {
  const o = AC.createOscillator()
  const o2 = AC.createOscillator()
  const g = AC.createGain()
  const g2 = AC.createGain()
  o.type = 'sine'
  o2.type = 'sine'
  o.frequency.value = hz(m)
  o2.frequency.value = hz(m) * 3
  g2.gain.value = 0.06
  o.connect(g)
  o2.connect(g2)
  g2.connect(g)
  g.connect(out)
  const lvl = 0.22 * vel
  const end = t + Math.max(0.4, dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(lvl, t + 0.004)
  g.gain.exponentialRampToValueAtTime(lvl * 0.35, t + 1.2)
  g.gain.exponentialRampToValueAtTime(0.0001, end + 0.3)
  o.start(t)
  o2.start(t)
  o.stop(end + 0.35)
  o2.stop(end + 0.35)
}

/** One note of a clip. Times and lengths are in beats from the start of the bar. */
export interface CNote {
  t: number
  midi: number
  dur: number
  vel?: number
  harm?: boolean
}

/** Something to show at a time: which chord, which step, which notes sound. */
export interface Cue<C = unknown> {
  t: number
  v: C
}

export interface Bar<C = unknown> {
  notes: CNote[]
  cues: Cue<C>[]
  beats: number
  /** Drums under this bar, or none. */
  drums?: Feel | null
}

/** Swing eighths: the off-beat falls two thirds into the beat. */
export const swing8 = (slot: number, feel: Feel) => {
  const beat = Math.floor(slot / 2)
  return slot % 2 === 0 ? beat : beat + (feel === 'swing' ? 2 / 3 : 0.5)
}

function drumBar(AC: AudioContext, out: AudioNode, t0: number, beat: number, feel: Feel, barIndex: number) {
  const at = (b: number) => t0 + b * beat
  if (feel === 'swing') {
    ;[0, 1, 1 + 2 / 3, 2, 3, 3 + 2 / 3].forEach((b) => ride(AC, out, at(b), Number.isInteger(b) ? 0.1 : 0.06))
    ;[1, 3].forEach((b) => pedalHat(AC, out, at(b), 0.1))
    ;[0, 1, 2, 3].forEach((b) => kick(AC, out, at(b), 0.14))
  } else if (feel === 'bossa') {
    for (let k = 0; k < 8; k++) hat(AC, out, at(k / 2), k % 2 ? 0.05 : 0.09)
    ;[0, 1.5, 2, 3.5].forEach((b) => kick(AC, out, at(b), b % 2 === 0 ? 0.5 : 0.3))
    const stick = barIndex % 2 === 0 ? [0, 1.5, 3] : [1, 2.5]
    stick.forEach((b) => snare(AC, out, at(b), 0.16))
  } else {
    ;[0, 1, 2, 3].forEach((b) => ride(AC, out, at(b), 0.05))
    ;[1, 3].forEach((b) => pedalHat(AC, out, at(b), 0.07))
  }
}

/** Plays bars (once or in a loop), scheduling a little ahead, and reports the cue sounding now. Only one plays at a time. */
class ClipPlayer<C> {
  private gain: GainNode | null = null
  private timers: number[] = []
  private tick = 0
  private onCue: (c: C | null) => void
  constructor(onCue: (c: C | null) => void) {
    this.onCue = onCue
  }

  /** `source(i)` gives bar i (null = the end). It is asked again for every bar, so changes apply from the next bar. */
  play(source: (i: number) => Bar<C> | null, tempo: () => number) {
    active?.stop()
    active = this
    const AC = audioContext()
    if (!AC) return
    const gain = AC.createGain()
    gain.gain.value = 0.85
    gain.connect(AC.destination)
    this.gain = gain
    let next = AC.currentTime + 0.1
    let i = 0
    const pump = () => {
      while (this.gain === gain && next < AC.currentTime + 0.35) {
        const bar = source(i)
        if (!bar) {
          this.timers.push(window.setTimeout(() => this.stop(), (next - AC.currentTime) * 1000 + 300))
          window.clearInterval(this.tick)
          return
        }
        const beat = 60 / tempo()
        for (const n of bar.notes) (n.harm ? bell : pluck)(AC, gain, next + n.t * beat, n.midi, n.dur * beat, n.vel ?? 0.8)
        if (bar.drums) drumBar(AC, gain, next, beat, bar.drums, i)
        for (const c of bar.cues) {
          const ms = (next + c.t * beat - AC.currentTime) * 1000
          this.timers.push(window.setTimeout(() => this.gain === gain && this.onCue(c.v), Math.max(0, ms)))
        }
        next += bar.beats * beat
        i++
      }
      this.timers = this.timers.slice(-200)
    }
    pump()
    this.tick = window.setInterval(pump, 60)
  }

  stop() {
    window.clearInterval(this.tick)
    this.timers.forEach(clearTimeout)
    this.timers = []
    if (this.gain) {
      const g = this.gain
      try {
        g.gain.setTargetAtTime(0, g.context.currentTime, 0.03)
        window.setTimeout(() => g.disconnect(), 300)
      } catch {
        /* context gone */
      }
      this.gain = null
    }
    if (active === this) active = null
    this.onCue(null)
  }
}

let active: { stop: () => void } | null = null

/** Stop whatever this method is playing. */
export const stopAll = () => active?.stop()

/** A player for one component: `cue` is what sounds now (null = stopped). */
export function useClip<C>() {
  const [cue, setCue] = useState<C | null>(null)
  const ref = useRef<ClipPlayer<C> | null>(null)
  if (!ref.current) ref.current = new ClipPlayer<C>(setCue)
  useEffect(() => () => ref.current?.stop(), [])
  return {
    cue,
    playing: cue != null,
    /** Play a fixed list of bars once. */
    once: (bars: Bar<C>[], tempo: number) => ref.current!.play((i) => bars[i] ?? null, () => tempo),
    /** Play from a live source (a loop): asked for every bar. */
    live: (source: (i: number) => Bar<C> | null, tempo: () => number) => ref.current!.play(source, tempo),
    stop: () => ref.current!.stop(),
  }
}
