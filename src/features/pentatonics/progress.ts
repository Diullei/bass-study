import { useCallback, useEffect, useState } from 'react'
import { KEYS, load, store } from '../../state/storage'

export interface PentProgress {
  done?: boolean
  /** Best quiz score, %. */
  quiz?: number
}

export const PASS = 80

const read = () => load<Record<string, PentProgress>>(KEYS.pentProgress, {})

/** Progress through the class, saved in this browser. */
export function usePentProgress() {
  const [all, setAll] = useState(read)
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === KEYS.pentProgress && setAll(read())
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])
  const update = useCallback((id: string, patch: PentProgress) => {
    setAll((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      store(KEYS.pentProgress, next)
      return next
    })
  }, [])
  return { all, update, learned: (id: string) => !!all[id]?.done }
}
