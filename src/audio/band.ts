import type { Chord } from '../theory/chords'
import { hat, kick, pedalHat, ride, snare } from './drums'
import { pad } from './synth'

/** A backing band: a drum groove and chord stabs, one bar at a time. */
export type BandFeel = 'straight' | 'funk' | 'swing'

export const BAND_FEELS: { value: BandFeel; label: string }[] = [
  { value: 'straight', label: 'Straight 8ths (rock / pop)' },
  { value: 'funk', label: 'Funk 16ths' },
  { value: 'swing', label: 'Swing (jazz)' },
]

/** Where each 16th of a beat falls, as a fraction of the beat (swing and funk push the off-beats). */
export const GRID: Record<BandFeel, number[]> = {
  straight: [0, 0.25, 0.5, 0.75],
  swing: [0, 0.22, 0.66, 0.83],
  funk: [0, 0.28, 0.5, 0.78],
}

/** Time in beats of 16th number t, with the feel applied. */
export const feelTime = (t: number, feel: BandFeel) => Math.floor(t / 4) + GRID[feel][((t % 4) + 4) % 4]

/** Drum pattern per feel, in 16ths of a 4/4 bar. */
const DRUMS: Record<BandFeel, { k: number[]; kv?: number; s: number[]; gs?: number[]; h?: number[]; hh?: number[]; ride?: number[] }> = {
  straight: { k: [0, 8, 10], s: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14] },
  funk: { k: [0, 6, 10], s: [4, 12], gs: [7, 15], h: [...Array(16).keys()] },
  swing: { k: [0, 4, 8, 12], kv: 0.18, s: [], hh: [4, 12], ride: [0, 4, 6, 8, 12, 14] },
}
/** Chord stabs per feel: [16th, length in 16ths]. */
const COMP: Record<BandFeel, [number, number][]> = {
  straight: [[0, 14]],
  funk: [[0, 2], [7, 1], [10, 2]],
  swing: [[0, 2], [6, 2]],
}

/**
 * Schedule one bar of the band. `t0` is the start of the bar, `beat` the length of a beat in seconds.
 * `chord` null = drums only.
 */
export function bandBar(AC: AudioContext, out: AudioNode, t0: number, beat: number, feel: BandFeel, o: { drums: boolean; chord: Chord | null }) {
  const at = (t: number) => t0 + feelTime(t, feel) * beat
  if (o.drums) {
    const P = DRUMS[feel]
    P.k.forEach((p) => kick(AC, out, at(p), P.kv ?? 0.9))
    P.s.forEach((p) => snare(AC, out, at(p), 0.9))
    P.gs?.forEach((p) => snare(AC, out, at(p), 0.18))
    P.h?.forEach((p) => hat(AC, out, at(p), p % 4 === 0 ? 0.16 : 0.08))
    P.hh?.forEach((p) => pedalHat(AC, out, at(p), 0.1))
    P.ride?.forEach((p) => ride(AC, out, at(p), p % 8 === 0 ? 0.11 : 0.07))
  }
  if (o.chord) {
    const c = o.chord
    COMP[feel].forEach(([p, len]) => pad(AC, out, at(p), c, (len * beat) / 4))
  }
}
