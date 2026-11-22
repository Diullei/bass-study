import { useCallback, useEffect, useState } from 'react'
import type { HandSize } from '../theory/fingering'
import { KEYS, load, store } from './storage'

/**
 * App-wide preferences, saved in this browser. Every component that reads one re-renders when it changes,
 * on this page (listeners) and in other tabs (the storage event).
 */

const listeners = new Map<string, Set<(v: never) => void>>()

function usePref<T>(key: string, read: () => T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(read)
  useEffect(() => {
    let set = listeners.get(key)
    if (!set) listeners.set(key, (set = new Set()))
    set.add(setV as (v: never) => void)
    const on = (e: StorageEvent) => {
      if (e.key === key) setV(read())
    }
    window.addEventListener('storage', on)
    return () => {
      set.delete(setV as (v: never) => void)
      window.removeEventListener('storage', on)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const set = useCallback(
    (x: T) => {
      store(key, x)
      listeners.get(key)?.forEach((f) => (f as (v: T) => void)(x))
    },
    [key],
  )
  return [v, set]
}

/** The left-handed view: every neck mirrored, nut on the right, as a left-handed player sees it. */
export const useLefty = () => usePref<boolean>(KEYS.lefty, () => load<boolean>(KEYS.lefty, load<boolean>('bs.chords.lefty', false)))

/** Show fretting-hand fingers (and barres) on chord diagrams. */
export const useShowFingers = () => usePref<boolean>(KEYS.fingers, () => load<boolean>(KEYS.fingers, true))

/** The size of the fretting hand: it sets how far the fingering engine lets the fingers reach. */
export const useHandSize = () => usePref<HandSize>(KEYS.hand, () => (load<string>(KEYS.hand, 'average') === 'large' ? 'large' : 'average'))

export type ShapeStyle = 'a' | 'b' | 'c'

/** How a chord shape is written inside text (see notation/ShapeRef): five cells by default. */
export const useShapeStyle = () =>
  usePref<ShapeStyle>(KEYS.shapeStyle, () => {
    const v = load<string>(KEYS.shapeStyle, 'a')
    return v === 'b' || v === 'c' ? v : 'a'
  })

/** Show the chord scale around every chord shape, and the scale map under progressions. */
export const useShowScales = () => usePref<boolean>(KEYS.scales, () => load<boolean>(KEYS.scales, false))
