import { useEffect, useRef, useState } from 'react'
import { audioContext, bassTone, keyTone } from '../../audio/synth'

/** One moment of a listening example: notes held together, an optional bass note, a length in beats. */
export interface Step {
  notes: number[]
  bass?: number
  /** Extra bass notes, one per beat (a walking line); replaces `bass`. */
  walk?: number[]
  beats: number
  /** How long the bass note lasts, when it is held over several steps. */
  bassBeats?: number
}

/** Plays a list of steps, reports which one sounds. Only one plays at a time on the page. */
class StepPlayer {
  private timers: number[] = []
  private gain: GainNode | null = null
  private onStep: (i: number | null) => void
  constructor(onStep: (i: number | null) => void) {
    this.onStep = onStep
  }

  play(steps: Step[], tempo: number) {
    active?.stop()
    active = this
    const AC = audioContext()
    if (!AC) return
    this.gain = AC.createGain()
    this.gain.gain.value = 0.9
    this.gain.connect(AC.destination)
    const beat = 60 / tempo
    let t = AC.currentTime + 0.08
    let ms = 80
    steps.forEach((st, i) => {
      const dur = st.beats * beat
      st.notes.forEach((m) => keyTone(AC, this.gain!, t, m, dur * 0.96, 0.07))
      if (st.walk) st.walk.forEach((m, k) => bassTone(AC, this.gain!, t + k * beat, m, beat * 0.92, { vel: k ? 0.7 : 0.85 }))
      else if (st.bass != null) bassTone(AC, this.gain!, t, st.bass, (st.bassBeats ?? st.beats) * beat * 0.95)
      this.timers.push(window.setTimeout(() => this.onStep(i), ms))
      t += dur
      ms += dur * 1000
    })
    this.timers.push(window.setTimeout(() => this.stop(), ms + 150))
  }

  stop() {
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
    this.onStep(null)
  }
}

let active: StepPlayer | null = null

/** Play steps; `at` is the index sounding now (null = stopped). */
export function useSteps() {
  const [at, setAt] = useState<number | null>(null)
  const ref = useRef<StepPlayer | null>(null)
  if (!ref.current) ref.current = new StepPlayer(setAt)
  useEffect(() => () => ref.current?.stop(), [])
  return {
    at,
    playing: at != null,
    play: (steps: Step[], tempo = 80) => ref.current!.play(steps, tempo),
    stop: () => ref.current!.stop(),
  }
}
