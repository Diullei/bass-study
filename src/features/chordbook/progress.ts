import { useCallback, useEffect, useState } from 'react'
import { KEYS, load, store } from '../../state/storage'
import { EXERCISES, keysOf, type Exercise } from './exercises'

export interface ExProgress {
  /** The keys played to the standard of the exercise. */
  keys?: string[]
  done?: boolean
}

const read = () => load<Record<string, ExProgress>>(KEYS.bookProgress, {})

/** Progress through the exercise book, saved in this browser. */
export function useBookProgress() {
  const [all, setAll] = useState(read)
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === KEYS.bookProgress && setAll(read())
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])
  const update = useCallback((id: string, patch: ExProgress) => {
    setAll((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      store(KEYS.bookProgress, next)
      return next
    })
  }, [])
  const done = (e: Exercise) => !!all[e.id]?.done
  /** "3/12": keys played of the keys asked. */
  const keysPlayed = (e: Exercise) => keysOf(e).filter((k) => all[e.id]?.keys?.includes(k)).length
  /** The first exercise not done yet. */
  const next = EXERCISES.find((e) => !done(e)) ?? EXERCISES[0]
  return { all, update, done, keysPlayed, next, count: EXERCISES.filter(done).length }
}
