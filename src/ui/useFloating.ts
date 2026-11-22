import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react'
import { load, store } from '../state/storage'

interface Pos {
  x: number
  y: number
}

/**
 * A floating card that can be dragged by a handle and remembers where it was left (in this browser).
 *
 * - `ref` goes on the card, `handle` props on the part that is grabbed (its title bar).
 * - Until it has been moved, the card stays where its CSS puts it; `style` is then undefined.
 * - It can never end up off screen: the position is clamped to what is visible, again after a resize or a rotation.
 * - On a narrow screen (a phone) cards are docked by their CSS and dragging is off.
 *
 * `shown`: pass whether the card is on screen, so it is measured and placed when it appears.
 */
export function useFloating<E extends HTMLElement = HTMLDivElement>(key: string, shown = true) {
  const [pos, setPos] = useState<Pos | null>(() => load<Pos | null>(key, null))
  const ref = useRef<E>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const latest = useRef(pos)
  latest.current = pos
  const [, force] = useState(0)

  useEffect(() => {
    const again = () => force((n) => n + 1)
    window.addEventListener('resize', again)
    window.visualViewport?.addEventListener('resize', again)
    return () => {
      window.removeEventListener('resize', again)
      window.visualViewport?.removeEventListener('resize', again)
    }
  }, [])
  // the card has a size only once it is on screen: place it again then
  useLayoutEffect(() => {
    force((n) => n + 1)
  }, [shown])

  const docked = typeof window !== 'undefined' && window.innerWidth < 560
  let style: CSSProperties | undefined
  if (pos && !docked && ref.current) {
    // what is really visible: on a phone or tablet the address bar makes innerHeight too tall
    const vw = window.visualViewport?.width ?? window.innerWidth
    const vh = window.visualViewport?.height ?? window.innerHeight
    const w = ref.current.offsetWidth
    const h = Math.min(ref.current.offsetHeight, vh - 8)
    style = { left: Math.max(0, Math.min(pos.x, vw - w)), top: Math.max(0, Math.min(pos.y, vh - h)), right: 'auto', bottom: 'auto', maxHeight: vh - 8 }
  }

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    if (docked || (e.target as HTMLElement).closest('button, input, select, a') || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: RPointerEvent<HTMLElement>) => {
    if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy })
  }
  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    store(key, latest.current)
  }
  /** Back to where the CSS puts it. */
  const reset = () => {
    setPos(null)
    store(key, null)
  }
  return {
    ref,
    style,
    /** Spread on the handle. touch-action: none lets a finger drag it instead of scrolling the page. */
    handle: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, style: docked ? undefined : ({ cursor: 'grab', touchAction: 'none' } as CSSProperties) },
    moved: !!pos && !docked,
    reset,
  }
}
