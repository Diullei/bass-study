import { useCallback, useEffect, useState } from 'react'
import { KEYS, load, store } from '../../state/storage'

export interface HProgress {
  done?: boolean
  /** Best quiz score, %. */
  quiz?: number
}

export const PASS = 80

const read = () => load<Record<string, HProgress>>(KEYS.harmonyProgress, {})

/** Progress through the harmony course, saved in this browser. */
export function useHarmonyProgress() {
  const [all, setAll] = useState(read)
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === KEYS.harmonyProgress && setAll(read())
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])
  const update = useCallback((id: string, patch: HProgress) => {
    setAll((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      store(KEYS.harmonyProgress, next)
      return next
    })
  }, [])
  return { all, update, learned: (id: string) => !!all[id]?.done }
}
