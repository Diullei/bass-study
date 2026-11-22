import { useCallback, useEffect, useState } from 'react'
import { KEYS, load, store } from '../../state/storage'

export interface CProgress {
  done?: boolean
  /** Best quiz score, %. */
  quiz?: number
}

export const PASS = 80

const read = () => load<Record<string, CProgress>>(KEYS.chordsProgress, {})

/** Progress through the chord method, saved in this browser. */
export function useChordsProgress() {
  const [all, setAll] = useState(read)
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === KEYS.chordsProgress && setAll(read())
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])
  const update = useCallback((id: string, patch: CProgress) => {
    setAll((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      store(KEYS.chordsProgress, next)
      return next
    })
  }, [])
  return { all, update, learned: (id: string) => !!all[id]?.done }
}

/** The left-handed view is a notebook-wide setting. */
export { useLefty } from '../../state/prefs'
