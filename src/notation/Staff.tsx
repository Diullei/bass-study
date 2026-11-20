import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import type { Highlight } from '../audio/player'
import type { Score } from '../engine/types'
import { renderScore, type RenderFlags } from './renderScore'

export interface StaffProps {
  score: Score
  flags?: RenderFlags
  /** Notes/chords to colour in red pen (playback position). */
  highlight?: Highlight
  className?: string
  /** score.events indices drawn as "picked" (circled in red pen). */
  picked?: number[]
  /** Called with the score.events index of a clicked note. */
  onNoteClick?: (eventIndex: number) => void
}

/** Width of an element, updated on resize. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.clientWidth)
    let t = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(t)
      t = window.setTimeout(() => setW(el.clientWidth), 120)
    })
    ro.observe(el)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [])
  return [ref, w] as const
}

/** Hand-drawn bass-clef staff for a score. Re-lays itself out to fit its container. */
export function Staff({ score, flags = {}, highlight, picked, className, onNoteClick }: StaffProps) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const flagKey = JSON.stringify(flags)
  const svg = useMemo(
    () => (width ? renderScore(score, flags, width).svg : ''),
    // flags compared by value (flagKey)
    [score, flagKey, width],
  )

  // the red pen follows playback; done imperatively to avoid re-rendering the SVG every frame
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('.hl').forEach((n) => n.classList.remove('hl'))
    highlight?.events.forEach((i) => el.querySelector(`[data-e="${i}"]`)?.classList.add('hl'))
    highlight?.chords.forEach((i) => el.querySelectorAll(`[data-c="${i}"]`).forEach((n) => n.classList.add('hl')))
  }, [highlight, svg, ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('.picked').forEach((n) => n.classList.remove('picked'))
    picked?.forEach((i) => el.querySelector(`[data-e="${i}"]`)?.classList.add('picked'))
  }, [picked, svg, ref])

  const onClick = onNoteClick
    ? (ev: MouseEvent) => {
        const g = (ev.target as Element).closest('[data-e]')
        if (g) onNoteClick(+(g.getAttribute('data-e') as string))
      }
    : undefined

  return (
    <div
      ref={ref}
      className={className}
      data-clickable={onNoteClick ? '' : undefined}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
