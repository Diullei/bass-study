import { Q, tones, type Chord } from '../theory/chords'
import { midiOf } from '../theory/notes'

/** Simple synthesized voices for playback. */

let shared: AudioContext | null = null

/** One AudioContext for the whole app (browsers limit how many we may create). */
export function audioContext(): AudioContext | null {
  try {
    if (!shared) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      shared = new Ctor({ latencyHint: 'interactive' })
    }
    void shared.resume()
    return shared
  } catch {
    return null
  }
}

export const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

/** How a bass note is played. All optional: the default is a plain pluck. */
export interface Articulation {
  /** 0–1, default 0.8. */
  vel?: number
  /** Slide in from a whole step below. */
  slide?: boolean
  /** Hammer-on / pull-off: softer attack, no new pluck. */
  legato?: boolean
  /** Muted, percussive pluck with no pitch to speak of. */
  ghost?: boolean
}

/** Plucked bass: saw + sine through a closing low-pass filter. */
export function bassTone(AC: AudioContext, out: AudioNode, t: number, m: number, dur: number, art: Articulation = {}) {
  const o = AC.createOscillator()
  const o2 = AC.createOscillator()
  const f = AC.createBiquadFilter()
  const g = AC.createGain()
  const og = AC.createGain()
  const vel = art.vel ?? 0.8
  const lvl = (vel / 0.8) * (art.legato ? 0.5 : 0.7)
  o.type = 'sawtooth'
  o2.type = 'sine'
  ;[o, o2].forEach((x) => {
    if (art.slide) {
      x.frequency.setValueAtTime(hz(m - 2), t)
      x.frequency.exponentialRampToValueAtTime(hz(m), t + 0.07)
    } else x.frequency.value = hz(m)
  })
  og.gain.value = 0.3
  f.type = 'lowpass'
  f.Q.value = 2
  o.connect(og)
  og.connect(f)
  o2.connect(f)
  f.connect(g)
  g.connect(out)
  if (art.ghost) {
    f.frequency.setValueAtTime(600, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(lvl * 0.6, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    o.start(t)
    o2.start(t)
    o.stop(t + 0.12)
    o2.stop(t + 0.12)
    return
  }
  f.frequency.setValueAtTime(art.legato ? 650 : 500 + 750 * vel, t)
  f.frequency.exponentialRampToValueAtTime(280, t + 0.35)
  const sus = Math.max(0.1, dur - 0.05)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(lvl, t + (art.legato ? 0.02 : 0.01))
  g.gain.exponentialRampToValueAtTime(lvl / 2, t + Math.min(0.28, sus))
  g.gain.setValueAtTime(lvl / 2, t + sus)
  g.gain.exponentialRampToValueAtTime(0.0001, t + sus + 0.07)
  o.start(t)
  o2.start(t)
  o.stop(t + sus + 0.1)
  o2.stop(t + sus + 0.1)
}

/** Soft electric-piano-ish tone for chords and melodies. */
export function keyTone(AC: AudioContext, out: AudioNode, t: number, m: number, dur: number, vol: number) {
  const o = AC.createOscillator()
  const o2 = AC.createOscillator()
  const g = AC.createGain()
  const g2 = AC.createGain()
  o.type = 'triangle'
  o2.type = 'sine'
  o.frequency.value = hz(m)
  o2.frequency.value = hz(m) * 2
  g2.gain.value = 0.15
  o.connect(g)
  o2.connect(g2)
  g2.connect(g)
  g.connect(out)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(vol * 0.35, t + Math.min(dur, 0.8))
  g.gain.setValueAtTime(vol * 0.35, t + Math.max(0.02, dur - 0.04))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.03)
  o.start(t)
  o2.start(t)
  o.stop(t + dur + 0.05)
  o2.stop(t + dur + 0.05)
}

/** The chord without its root, voiced in the middle register. */
export function pad(AC: AudioContext, out: AudioNode, t: number, c: Chord, dur: number) {
  if (c.noPlay || !c.root || !Q[c.q]) return
  tones(c)
    .filter((x) => x.d !== 1)
    .forEach((x) => {
      let m = midiOf(x.n, 4)
      while (m > 70) m -= 12
      while (m < 52) m += 12
      keyTone(AC, out, t, m, dur, 0.045)
    })
}

export function click(AC: AudioContext, out: AudioNode, t: number, acc: boolean) {
  const o = AC.createOscillator()
  const g = AC.createGain()
  o.type = 'square'
  o.frequency.value = acc ? 1800 : 1200
  o.connect(g)
  g.connect(out)
  g.gain.setValueAtTime(acc ? 0.12 : 0.07, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
  o.start(t)
  o.stop(t + 0.05)
}
