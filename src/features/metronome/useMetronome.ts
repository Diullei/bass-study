import { useSyncExternalStore } from 'react'
import { metronome } from './engine'

/** Settings and live state of the app's metronome, and the engine to act on it. */
export function useMetronome() {
  const snap = useSyncExternalStore(metronome.subscribe, metronome.getSnapshot)
  return { ...snap, m: metronome }
}
