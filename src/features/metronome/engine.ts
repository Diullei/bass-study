import { audioContext } from '../../audio/synth'

/**
 * The metronome engine: settings, sounds and a look-ahead scheduler on the Web Audio clock.
 * No UI here. One instance (`metronome`) serves the whole app; React reads it through useMetronome().
 * Ported from the original standalone metronome; settings keep its storage key, so saved setlists carry over.
 */

export type Accent = 0 | 1 | 2 | 3 // mute, normal, sub-accent, accent
export type Mode = 'off' | 'automator' | 'warmup'
export type Visual = 'both' | 'blocks' | 'pendulum' | 'off'

export interface Preset {
  name: string
  bpm: number
  beats: number
  note: number
  accents: Accent[]
  sub: number
  poly: boolean
  polyN: number
  drums?: boolean
  drumPat?: number
}

export interface MetroSettings {
  bpm: number
  beats: number
  note: number
  accents: Accent[]
  sub: number
  poly: boolean
  polyN: number
  tone: number
  vol: number
  subVol: number
  polyVol: number
  countIn: number
  mode: Mode
  autoBy: 'bar' | 'time'
  every: number
  everySec: number
  inc: number
  start: number
  target: number
  flashTempo: boolean
  gap: boolean
  gapPlay: number
  gapMute: number
  vibrate: boolean
  flash: boolean
  wake: boolean
  visual: Visual
  barCounter: boolean
  tempoCalc: 'bpm' | 'qpm'
  setlist: Preset[]
  drums: boolean
  drumPat: number
  drumVol: number
  clickWithDrums: boolean
  fill: number
}

export const DEFAULTS: MetroSettings = {
  bpm: 90, beats: 4, note: 4, accents: [3, 1, 1, 1], sub: 0, poly: false, polyN: 3,
  tone: 0, vol: 0.85, subVol: 0.5, polyVol: 0.6, countIn: 0,
  mode: 'off', autoBy: 'bar', every: 4, everySec: 60, inc: 5, start: 60, target: 120, flashTempo: true,
  gap: false, gapPlay: 2, gapMute: 2,
  vibrate: false, flash: false, wake: true, visual: 'both', barCounter: true, tempoCalc: 'bpm', setlist: [],
  drums: false, drumPat: 0, drumVol: 0.8, clickWithDrums: true, fill: 0,
}

/** Number settings changed with ‹ › steppers: [min, max, step]. */
export const LIMITS = {
  bpm: [10, 400, 1], beats: [1, 16, 1], every: [1, 64, 1], everySec: [5, 900, 5], inc: [1, 50, 1],
  start: [10, 400, 1], target: [10, 400, 1], countIn: [0, 8, 1], gapPlay: [1, 16, 1], gapMute: [1, 16, 1],
  polyN: [2, 16, 1], tone: [0, 6, 1],
} as const
export type StepKey = keyof typeof LIMITS | 'note'

export const NOTES = [1, 2, 4, 8, 16]
export const TONES = ['Click', 'Beep', 'Wood', 'Cowbell', 'Hi-hat', 'Rim', 'Digital']

/** Subdivisions: where the extra clicks fall inside a beat. */
export const SUBS = [
  { s: '♩', n: 'Quarter', p: [0] },
  { s: '♫', n: 'Eighths', p: [0, 0.5] },
  { s: '♪.♬', n: 'Dotted 8th + 16th', p: [0, 0.75] },
  { s: '♪♪♪', n: 'Triplets', p: [0, 1 / 3, 2 / 3] },
  { s: '·♪♪', n: 'Triplet, rest first', p: [1 / 3, 2 / 3] },
  { s: '♪·♪', n: 'Shuffle', p: [0, 2 / 3] },
  { s: '♪♪·', n: 'Triplet, rest last', p: [0, 1 / 3] },
  { s: '♬♬', n: 'Sixteenths', p: [0, 0.25, 0.5, 0.75] },
]

/**
 * Drum grooves: g = steps per 4 beats (16 = 16ths, 12 = triplets). X accent, x normal, o ghost.
 * k kick, s snare, h closed hat, o open hat, r ride, c crash, x side-stick, t tom.
 */
export const GROOVES: { n: string; g: number; t: Record<string, string> }[] = [
  { n: 'Rock', g: 16, t: { k: 'X.......X.x.....', s: '....X.......X...', h: 'X.x.x.x.X.x.x.x.' } },
  { n: 'Rock 16ths', g: 16, t: { k: 'X.....x.X.x.....', s: '....X.......X...', h: 'XoxoXoxoXoxoXoxo' } },
  { n: 'Funk', g: 16, t: { k: 'X.....x...x..x..', s: '....X..o.o..X..o', h: 'xoxoxoxoxoxoxoxo' } },
  { n: 'Half-time', g: 16, t: { k: 'X.....x...x.....', s: '........X.......', h: 'x.x.x.x.x.x.x.x.' } },
  { n: 'Four on the floor', g: 16, t: { k: 'X...X...X...X...', s: '....X.......X...', h: 'x...x...x...x...', o: '..x...x...x...x.' } },
  { n: 'Shuffle', g: 12, t: { k: 'X.....x.x...', s: '...X.....X..', h: 'x.xx.xx.xx.x' } },
  { n: 'Jazz swing', g: 12, t: { r: 'x..x.xx..x.x', h: '...x.....x..', k: 'o..o..o..o..' } },
  { n: 'Bossa nova', g: 16, t: { k: 'X..xX..xX..xX..x', x: 'x..x..x...x..x..', h: 'x.x.x.x.x.x.x.x.' } },
  { n: 'Reggae one-drop', g: 16, t: { k: '........X.......', x: '........X.......', h: '..x...x...x...x.' } },
  { n: 'Double kick', g: 16, t: { k: 'xxxxxxxxxxxxxxxx', s: '....X.......X...', r: 'x.x.x.x.x.x.x.x.' } },
  { n: 'Hi-hat 8ths', g: 16, t: { h: 'X.x.x.x.X.x.x.x.' } },
  { n: 'Hi-hat 16ths', g: 16, t: { h: 'XoxoXoxoXoxoXoxo' } },
]
const VEL: Record<string, number> = { X: 1, x: 0.75, o: 0.3 }

export const fmtTime = (s: number) => `${Math.floor(s / 60)}'${String(Math.round(s % 60)).padStart(2, '0')}"`
const fmtClock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function tempoName(b: number) {
  return b < 25 ? 'Larghissimo' : b < 40 ? 'Grave' : b < 60 ? 'Largo' : b < 66 ? 'Larghetto' : b < 76 ? 'Adagio'
    : b < 108 ? 'Andante' : b < 120 ? 'Moderato' : b < 156 ? 'Allegro' : b < 176 ? 'Vivace' : b < 200 ? 'Presto' : 'Prestissimo'
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const STORAGE = 'metro_state'

/** What is happening right now, for the display. */
export interface Live {
  playing: boolean
  /** Current beat (0-based), or null when stopped. */
  beat: number | null
  lvl: Accent
  counting: boolean
  countLeft: number
  muted: boolean
  bar: number
  polyIdx: number | null
  /** "+5 in 3 bars · 1:24" etc. */
  status: string
  /** Changes on every beat, so the display can animate it. */
  tick: number
}

interface BeatEv {
  t: number
  type: 'beat'
  beat: number
  counting: boolean
  countLeft: number
  muted: boolean
  lvl: Accent
  spb: number
  bar: number
}
type Ev = BeatEv | { t: number; type: 'poly'; i: number } | { t: number; type: 'tempo' }

export interface Snapshot {
  S: MetroSettings
  live: Live
}

const IDLE: Live = { playing: false, beat: null, lvl: 1, counting: false, countLeft: 0, muted: false, bar: 0, polyIdx: null, status: '', tick: 0 }

export class MetronomeEngine {
  private S: MetroSettings
  private live: Live = IDLE
  private snap: Snapshot
  private listeners = new Set<() => void>()
  private flashListeners = new Set<(color: 'accent' | 'beat' | 'tempo') => void>()

  private ac: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private timer: { start: () => void; stop: () => void } | null = null

  // scheduler state
  private nextTime = 0
  private beatIdx = 0
  private barNum = 0
  private countLeft = 0
  private barMuted = false
  private events: Ev[] = []
  private crashNext = false
  private barsSince = 0
  private nextChange = 0
  private warmDir = 1
  private startAt = 0
  private practiceOn = false
  private reached = false
  private lastBeat: BeatEv | null = null
  private raf = 0
  private lastStat = 0
  private taps: number[] = []
  private wake: WakeLockSentinel | null = null

  constructor() {
    let s = { ...DEFAULTS, accents: DEFAULTS.accents.slice() }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null')
      if (saved) s = { ...s, ...saved }
    } catch {
      /* storage unavailable */
    }
    this.S = s
    this.fixAccents()
    this.snap = { S: this.S, live: this.live }
    if (typeof document !== 'undefined')
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.live.playing) void this.lockWake()
      })
  }

  // ───────── store ─────────
  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
  getSnapshot = () => this.snap
  onFlash(fn: (c: 'accent' | 'beat' | 'tempo') => void) {
    this.flashListeners.add(fn)
    return () => {
      this.flashListeners.delete(fn)
    }
  }
  private emit() {
    this.snap = { S: { ...this.S }, live: this.live }
    this.listeners.forEach((f) => f())
  }
  private setLive(p: Partial<Live>) {
    this.live = { ...this.live, ...p }
    this.emit()
  }
  private save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(this.S))
    } catch {
      /* storage unavailable */
    }
  }
  private fixAccents() {
    const a = this.S.accents.slice(0, this.S.beats)
    while (a.length < this.S.beats) a.push(1)
    this.S.accents = a
  }
  private commit() {
    if (this.master) this.master.gain.value = this.S.vol
    this.save()
    this.emit()
  }

  // ───────── settings ─────────
  set<K extends keyof MetroSettings>(k: K, v: MetroSettings[K]) {
    this.S[k] = v
    if (k === 'beats') this.fixAccents()
    if (k === 'mode' && this.live.playing) this.stop()
    if (k === 'wake') v ? this.live.playing && void this.lockWake() : this.releaseWake()
    this.commit()
  }
  step(k: StepKey, d: number) {
    if (k === 'note') this.S.note = NOTES[clamp(NOTES.indexOf(this.S.note) + d, 0, NOTES.length - 1)]
    else {
      const [mn, mx, st] = LIMITS[k]
      this.S[k] = clamp(this.S[k] + d * st, mn, mx)
    }
    if (k === 'beats') this.fixAccents()
    if (k === 'tone') this.preview(false)
    this.commit()
  }
  /** accent → sub-accent → normal → mute → accent */
  cycleAccent(i: number) {
    const c = this.S.accents[i]
    this.S.accents[i] = (c === 3 ? 2 : c === 2 ? 1 : c === 1 ? 0 : 3) as Accent
    this.commit()
  }
  pickGroove(i: number) {
    this.S.drumPat = i
    this.S.drums = true
    this.commit()
  }
  /** Tap tempo into bpm (or the practice start/target). */
  tap(k: 'bpm' | 'start' | 'target' = 'bpm') {
    const n = performance.now()
    if (this.taps.length && n - this.taps[this.taps.length - 1] > 2000) this.taps = []
    this.taps.push(n)
    if (this.taps.length > 6) this.taps.shift()
    if (this.taps.length >= 2) {
      const iv = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1)
      this.S[k] = clamp(Math.round(60000 / iv), 10, 400)
      this.commit()
    }
  }
  savePreset(name: string) {
    const S = this.S
    S.setlist = [...S.setlist, { name: name.trim() || `${S.bpm} BPM ${S.beats}/${S.note}`, bpm: S.bpm, beats: S.beats, note: S.note, accents: S.accents.slice(), sub: S.sub, poly: S.poly, polyN: S.polyN, drums: S.drums, drumPat: S.drumPat }]
    this.commit()
  }
  loadPreset(i: number) {
    const p = this.S.setlist[i]
    if (!p) return
    Object.assign(this.S, { bpm: p.bpm, beats: p.beats, note: p.note, accents: p.accents.slice(), sub: p.sub, poly: p.poly, polyN: p.polyN, drums: !!p.drums, drumPat: p.drumPat || 0 })
    this.fixAccents()
    this.commit()
  }
  deletePreset(i: number) {
    this.S.setlist = this.S.setlist.filter((_, k) => k !== i)
    this.commit()
  }
  reset() {
    if (this.live.playing) this.stop()
    this.S = { ...DEFAULTS, accents: DEFAULTS.accents.slice(), setlist: this.S.setlist }
    this.commit()
  }
  /** Approximate time for the tempo trainer to reach the target, in seconds. */
  approxSec() {
    const S = this.S
    const dir = Math.sign(S.target - S.start)
    if (!dir) return 0
    const steps = Math.ceil(Math.abs(S.target - S.start) / S.inc)
    if (S.autoBy === 'time') return steps * S.everySec
    let sec = 0
    let b = S.start
    for (let i = 0; i < steps; i++) {
      sec += S.every * S.beats * this.spbOf(b)
      b += dir * S.inc
    }
    return sec
  }
  private spbOf(b: number) {
    return this.S.tempoCalc === 'qpm' ? ((60 / b) * 4) / this.S.note : 60 / b
  }

  // ───────── audio ─────────
  /** Call from a user gesture. */
  unlock() {
    const ac = audioContext()
    if (!ac) return false
    if (this.ac !== ac) {
      this.ac = ac
      this.master = ac.createGain()
      this.master.gain.value = this.S.vol
      this.master.connect(ac.destination)
      this.noise = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate)
      const d = this.noise.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    }
    return true
  }
  private env(g: GainNode, t: number, peak: number, dur: number) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  }
  private osc(type: OscillatorType, f: number, t: number, dur: number, dest: AudioNode, peak: number) {
    const ac = this.ac as AudioContext
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    this.env(g, t, peak, dur)
    o.connect(g)
    g.connect(dest)
    o.start(t)
    o.stop(t + dur + 0.03)
    return o
  }
  private nz(t: number, dur: number, dest: AudioNode, ft: BiquadFilterType, f: number, q: number, peak: number) {
    const ac = this.ac as AudioContext
    const s = ac.createBufferSource()
    s.buffer = this.noise
    const fl = ac.createBiquadFilter()
    fl.type = ft
    fl.frequency.value = f
    fl.Q.value = q
    const g = ac.createGain()
    this.env(g, t, peak, dur)
    s.connect(fl)
    fl.connect(g)
    g.connect(dest)
    s.start(t)
    s.stop(t + dur + 0.03)
  }
  private metal(t: number, dur: number, dest: AudioNode, peak: number, hp: number) {
    const ac = this.ac as AudioContext
    const f = ac.createBiquadFilter()
    f.type = 'highpass'
    f.frequency.value = hp
    const e = ac.createGain()
    this.env(e, t, peak, dur)
    f.connect(e)
    e.connect(dest)
    ;[205.3, 304.4, 369.6, 522.7, 540, 800].forEach((x) => {
      const o = ac.createOscillator()
      o.type = 'square'
      o.frequency.value = x * 1.7
      o.connect(f)
      o.start(t)
      o.stop(t + dur + 0.05)
    })
  }
  private drum(name: string, t: number, vel: number) {
    const ac = this.ac as AudioContext
    const g = ac.createGain()
    g.gain.value = vel * this.S.drumVol
    g.connect(this.master as GainNode)
    switch (name) {
      case 'k': {
        const o = ac.createOscillator()
        const e = ac.createGain()
        o.frequency.setValueAtTime(160, t)
        o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
        e.gain.setValueAtTime(1.5, t)
        e.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
        o.connect(e)
        e.connect(g)
        o.start(t)
        o.stop(t + 0.5)
        this.osc('triangle', 1100, t, 0.008, g, 0.35)
        break
      }
      case 's':
        this.nz(t, 0.2, g, 'bandpass', 1900, 0.8, 1.4)
        this.nz(t, 0.13, g, 'highpass', 5000, 0.7, 0.5)
        this.osc('triangle', 190, t, 0.1, g, 0.8)
        break
      case 'h':
        this.nz(t, 0.045, g, 'highpass', 8000, 0.8, 0.7)
        break
      case 'o':
        this.nz(t, 0.32, g, 'highpass', 7500, 0.8, 0.6)
        break
      case 'r':
        this.metal(t, 0.8, g, 0.25, 8000)
        this.osc('sine', 2900, t, 0.4, g, 0.08)
        break
      case 'c':
        this.metal(t, 1.4, g, 0.35, 6000)
        this.nz(t, 1.3, g, 'highpass', 5500, 0.5, 0.55)
        break
      case 'x':
        this.osc('triangle', 1700, t, 0.03, g, 0.7)
        this.nz(t, 0.03, g, 'bandpass', 3200, 2, 0.7)
        break
      case 't': {
        const o = ac.createOscillator()
        const e = ac.createGain()
        o.frequency.setValueAtTime(150, t)
        o.frequency.exponentialRampToValueAtTime(95, t + 0.25)
        e.gain.setValueAtTime(1.1, t)
        e.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
        o.connect(e)
        e.connect(g)
        o.start(t)
        o.stop(t + 0.4)
        break
      }
    }
  }
  private synth(k: number, t: number, pm: number, d: AudioNode) {
    switch (k) {
      case 0:
        this.nz(t, 0.035, d, 'bandpass', 2600 * pm, 1.2, 1.6)
        this.osc('sine', 1800 * pm, t, 0.02, d, 0.4)
        break
      case 1:
        this.osc('sine', 880 * pm, t, 0.07, d, 0.9)
        break
      case 2: {
        const o = this.osc('sine', 1100 * pm, t, 0.06, d, 1)
        o.frequency.exponentialRampToValueAtTime(780 * pm, t + 0.05)
        this.osc('triangle', 2300 * pm, t, 0.012, d, 0.3)
        break
      }
      case 3:
        this.osc('square', 540 * pm, t, 0.16, d, 0.22)
        this.osc('square', 800 * pm, t, 0.16, d, 0.22)
        break
      case 4:
        this.nz(t, 0.05, d, 'highpass', 5500 * Math.min(pm, 1.5), 0.7, 1.2)
        break
      case 5:
        this.osc('triangle', 1700 * pm, t, 0.025, d, 0.8)
        this.nz(t, 0.02, d, 'bandpass', 3000 * pm, 2, 0.9)
        break
      case 6:
        this.osc('square', 1000 * pm, t, 0.035, d, 0.3)
        break
    }
  }
  /** kind: 3 accent, 2 sub-accent, 1 normal, 's' subdivision, 'p' polyrhythm */
  private voice(t: number, kind: Accent | 's' | 'p') {
    const S = this.S
    let pm: number
    let amp: number
    let tone = S.tone
    if (kind === 's') {
      pm = 0.8
      amp = 0.6 * S.subVol
    } else if (kind === 'p') {
      pm = 1.9
      amp = 0.85 * S.polyVol
      tone = S.tone === 2 ? 5 : 2
    } else {
      pm = ({ 3: 1.5, 2: 1.22, 1: 1, 0: 1 } as const)[kind]
      amp = ({ 3: 1, 2: 0.85, 1: 0.7, 0: 0 } as const)[kind]
    }
    if (amp <= 0 || !this.ac) return
    const g = this.ac.createGain()
    g.gain.value = amp
    g.connect(this.master as GainNode)
    this.synth(tone, t, pm, g)
  }
  /** Hear the current tone (accent, then a normal beat). */
  preview(both = true) {
    if (!this.unlock() || !this.ac) return
    this.voice(this.ac.currentTime + 0.02, 3)
    if (both) this.voice(this.ac.currentTime + 0.4, 1)
  }

  // ───────── transport ─────────
  toggle() {
    if (this.live.playing) this.stop()
    else this.start()
  }
  start() {
    if (!this.unlock() || !this.ac) return
    const S = this.S
    this.practiceOn = S.mode !== 'off'
    if (this.practiceOn) {
      S.bpm = S.start
      this.warmDir = Math.sign(S.target - S.start) || 1
      this.reached = false
    }
    this.countLeft = S.countIn
    this.beatIdx = 0
    this.barNum = 0
    this.barsSince = 0
    this.events = []
    this.crashNext = false
    this.nextTime = this.ac.currentTime + 0.12
    this.startAt = this.nextTime
    this.lastBeat = null
    this.ensureTimer().start()
    void this.lockWake()
    this.live = { ...IDLE, playing: true, status: S.countIn ? `Count-in ${S.countIn}` : '' }
    this.commit()
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(this.frame)
  }
  stop() {
    this.timer?.stop()
    this.events = []
    this.lastBeat = null
    this.releaseWake()
    cancelAnimationFrame(this.raf)
    this.live = IDLE
    this.emit()
  }
  private ensureTimer() {
    if (this.timer) return this.timer
    try {
      const w = new Worker(
        URL.createObjectURL(new Blob(['let id;onmessage=e=>{clearInterval(id);if(e.data)id=setInterval(()=>postMessage(0),25)}'], { type: 'text/javascript' })),
      )
      w.onmessage = () => this.schedule()
      this.timer = { start: () => w.postMessage(1), stop: () => w.postMessage(0) }
    } catch {
      let id = 0
      this.timer = {
        start: () => {
          clearInterval(id)
          id = window.setInterval(() => this.schedule(), 25)
        },
        stop: () => clearInterval(id),
      }
    }
    return this.timer
  }
  private stepTempo(t: number) {
    const S = this.S
    const dir = Math.sign(S.target - S.start) || 1
    let nb: number
    if (S.mode === 'automator') {
      nb = S.bpm + dir * S.inc
      if (dir > 0 ? nb >= S.target : nb <= S.target) {
        nb = S.target
        this.reached = true
      }
    } else {
      nb = S.bpm + this.warmDir * S.inc
      const hi = Math.max(S.start, S.target)
      const lo = Math.min(S.start, S.target)
      if (nb >= hi) {
        nb = hi
        this.warmDir = -1
      } else if (nb <= lo) {
        nb = lo
        this.warmDir = 1
      }
    }
    if (nb !== S.bpm) {
      S.bpm = nb
      this.events.push({ t, type: 'tempo' })
    }
  }
  private barStart(t: number) {
    const S = this.S
    if (this.countLeft > 0) {
      this.barMuted = false
      return
    }
    if (this.barNum === 0) {
      this.nextChange = t + S.everySec
      this.barsSince = 0
    } else if (this.practiceOn && S.mode !== 'off' && !(S.mode === 'automator' && this.reached)) {
      let due = false
      if (S.autoBy === 'bar') {
        if (++this.barsSince >= S.every) {
          due = true
          this.barsSince = 0
        }
      } else if (t >= this.nextChange - 0.001) {
        due = true
        this.nextChange += S.everySec
      }
      if (due) this.stepTempo(t)
    }
    this.barMuted = S.gap ? this.barNum % (S.gapPlay + S.gapMute) >= S.gapPlay : false
  }
  private schedule() {
    const ac = this.ac
    if (!this.live.playing || !ac) return
    const S = this.S
    while (this.nextTime < ac.currentTime + 0.12) {
      if (this.beatIdx >= S.beats) this.beatIdx = 0
      if (this.beatIdx === 0) this.barStart(this.nextTime)
      const spb = this.spbOf(S.bpm)
      const counting = this.countLeft > 0
      const muted = !counting && this.barMuted
      const lvl = (counting ? (this.beatIdx === 0 ? 3 : 1) : (S.accents[this.beatIdx] ?? 1)) as Accent
      if (!muted) {
        if (counting) this.voice(this.nextTime, lvl)
        else {
          const p = SUBS[S.sub].p
          const click = !S.drums || S.clickWithDrums
          if (click) {
            if (lvl > 0 && (p.includes(0) || lvl === 3)) this.voice(this.nextTime, lvl)
            for (const f of p) if (f > 0) this.voice(this.nextTime + f * spb, 's')
          }
          if (S.drums) {
            const P = GROOVES[S.drumPat] ?? GROOVES[0]
            const n = P.g / 4
            const pb = this.beatIdx % 4
            const fillBar = S.fill > 0 && (this.barNum + 1) % S.fill === 0 && this.beatIdx === S.beats - 1
            if (this.beatIdx === 0 && this.crashNext) {
              this.drum('c', this.nextTime, 0.9)
              this.crashNext = false
            }
            for (let j = 0; j < n; j++) {
              const t = this.nextTime + (j * spb) / n
              if (fillBar) {
                this.drum(j % 2 ? 't' : 's', t, 0.5 + (0.5 * j) / (n - 1))
                if (j === 0) this.drum('k', t, 0.8)
                continue
              }
              for (const k in P.t) {
                const v = VEL[P.t[k][pb * n + j]]
                if (v) this.drum(k, t, v)
              }
            }
            if (fillBar) this.crashNext = true
          }
          if (this.beatIdx === 0 && S.poly) {
            const bd = spb * S.beats
            for (let i = 0; i < S.polyN; i++) {
              this.voice(this.nextTime + (i * bd) / S.polyN, 'p')
              this.events.push({ t: this.nextTime + (i * bd) / S.polyN, type: 'poly', i })
            }
          }
        }
      }
      this.events.push({ t: this.nextTime, type: 'beat', beat: this.beatIdx, counting, countLeft: this.countLeft, muted, lvl, spb, bar: this.barNum })
      this.nextTime += spb
      this.beatIdx++
      if (this.beatIdx >= S.beats) {
        this.beatIdx = 0
        if (this.countLeft > 0) this.countLeft--
        else this.barNum++
      }
    }
    this.events.sort((a, b) => a.t - b.t)
  }

  // ───────── display loop ─────────
  private frame = () => {
    const ac = this.ac
    if (!ac || !this.live.playing) return
    this.raf = requestAnimationFrame(this.frame)
    const now = ac.currentTime
    let changed: Partial<Live> | null = null
    while (this.events.length && this.events[0].t <= now) {
      const e = this.events.shift() as Ev
      if (e.type === 'beat') {
        this.lastBeat = e
        changed = { ...(changed ?? {}), beat: e.beat, lvl: e.lvl, counting: e.counting, countLeft: e.countLeft, muted: e.muted, bar: e.bar, tick: this.live.tick + 1, ...(e.beat === 0 ? { polyIdx: null } : {}) }
        if (!e.muted) {
          if (this.S.vibrate && navigator.vibrate) {
            try {
              navigator.vibrate(e.lvl === 3 ? 45 : 20)
            } catch {
              /* not supported */
            }
          }
          if (this.S.flash && e.lvl > 0) this.flashListeners.forEach((f) => f(e.lvl === 3 ? 'accent' : 'beat'))
        }
      } else if (e.type === 'poly') changed = { ...(changed ?? {}), polyIdx: e.i }
      else {
        if (this.S.flashTempo) this.flashListeners.forEach((f) => f('tempo'))
        this.save()
        changed = { ...(changed ?? {}) }
      }
    }
    if (now - this.lastStat > 0.25) {
      this.lastStat = now
      changed = { ...(changed ?? {}), status: this.statusText(now) }
    }
    if (changed) this.setLive(changed)
  }
  private statusText(now: number) {
    const S = this.S
    let st = fmtClock(Math.max(0, now - this.startAt))
    if (this.lastBeat?.muted) st = `silent bar · ${st}`
    else if (this.practiceOn && S.mode !== 'off' && this.countLeft === 0) {
      const sign = this.warmDir < 0 && S.mode === 'warmup' ? '−' : '+'
      if (S.mode === 'automator' && this.reached) st = `target ✓ · ${st}`
      else if (S.autoBy === 'bar') st = `${sign}${S.inc} in ${S.every - this.barsSince} bars · ${st}`
      else st = `${sign}${S.inc} in ${Math.max(0, Math.ceil(this.nextChange - now))}s · ${st}`
    }
    return st
  }
  /** Pendulum position 0…1 (for an animation frame). */
  pendulum(): number {
    const b = this.lastBeat
    if (!b || !this.ac) return 0
    const ph = clamp((this.ac.currentTime - b.t) / b.spb, 0, 1)
    const x = b.beat % 2 === 0 ? ph : 1 - ph
    return (1 - Math.cos(x * Math.PI)) / 2
  }

  // ───────── wake lock ─────────
  private async lockWake() {
    if (!this.S.wake || !('wakeLock' in navigator)) return
    try {
      this.wake = await navigator.wakeLock.request('screen')
    } catch {
      /* not allowed */
    }
  }
  private releaseWake() {
    try {
      void this.wake?.release()
    } catch {
      /* already released */
    }
    this.wake = null
  }
}

/** The one metronome of the app. */
export const metronome = new MetronomeEngine()
