import { useCallback, useEffect, useState } from 'react'
import { KEYS, load, store } from './storage'

/**
 * App-wide preferences, saved in this browser. Every component that reads one re-renders when it changes,
 * on this page (listeners) and in other tabs (the storage event).
 */

const listeners = new Set<(v: boolean) => void>()

const readLefty = () => load<boolean>(KEYS.lefty, load<boolean>('bs.chords.lefty', false))

/** The left-handed view: every neck mirrored, nut on the right, as a left-handed player sees it. */
export function useLefty(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(readLefty)
  useEffect(() => {
    listeners.add(setV)
    const on = (e: StorageEvent) => {
      if (e.key === KEYS.lefty) setV(readLefty())
    }
    window.addEventListener('storage', on)
    return () => {
      listeners.delete(setV)
      window.removeEventListener('storage', on)
    }
  }, [])
  const set = useCallback((x: boolean) => {
    store(KEYS.lefty, x)
    listeners.forEach((f) => f(x))
  }, [])
  return [v, set]
}
