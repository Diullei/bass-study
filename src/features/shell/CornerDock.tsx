import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useMetronome } from '../metronome/useMetronome'
import styles from './CornerDock.module.css'

/**
 * The tools of the notebook (intervals, metronome, settings) behind one launcher in the bottom-right corner.
 * The launcher is a small pile of sticky notes; it opens a menu card with one row per tool.
 *
 * It opens on a click or tap, and when a mouse rests on it. It closes when a tool is chosen, on a click
 * elsewhere, on Esc, a moment after the mouse leaves, and after a few idle seconds.
 *
 * Children are the tools themselves: each renders its menu row first (a <button>, with a `data-hint` line),
 * which the dock lays out, and its own floating window, which stays positioned by itself.
 */
export function CornerDock({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { S, live } = useMetronome()
  const box = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  const hold = () => window.clearTimeout(timer.current)
  const closeIn = (ms: number) => {
    hold()
    timer.current = window.setTimeout(() => setOpen(false), ms)
  }
  const show = (idle: number) => {
    setOpen(true)
    closeIn(idle)
  }
  useEffect(() => hold, [])
  // while it is open: Esc and a click anywhere else close it
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const away = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      // only the menu itself counts as "inside": the tools' windows are children of the dock too
      const row = t.closest?.('button')
      if (!(row && row.parentElement === box.current)) setOpen(false)
    }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', away)
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('pointerdown', away)
    }
  }, [open])
  const onRow = (e: { target: EventTarget; currentTarget: EventTarget }) => {
    const b = (e.target as HTMLElement).closest?.('button')
    return !!b && b.parentElement === e.currentTarget
  }
  return (
    <div
      ref={box}
      className={`${styles.dock} ${open ? styles.open : ''}`}
      onPointerOver={(e) => {
        if (e.pointerType !== 'mouse' || !open) return
        // resting on the menu keeps it open; drifting onto a tool's window lets it close
        if (onRow(e)) hold()
        else closeIn(700)
      }}
      onPointerLeave={(e) => e.pointerType === 'mouse' && open && closeIn(700)}
      onClick={(e) => {
        // a tool was chosen: get out of its way
        if (onRow(e) && !(e.target as HTMLElement).closest(`.${styles.launcher}`)) (hold(), setOpen(false))
      }}
    >
      {children}
      <button
        type="button"
        className={`${styles.launcher} ${live.playing ? styles.playing : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Close the tools' : `Tools: intervals, metronome, settings${live.playing ? `. Metronome playing at ${S.bpm}` : ''}`}
        title="Tools"
        // a mouse arriving on the launcher opens the menu. Only arriving: after a click or Esc closed it,
        // the mouse still resting here must not open it again
        onPointerEnter={(e) => e.pointerType === 'mouse' && !open && show(6000)}
        onClick={() => (open ? (hold(), setOpen(false)) : show(6000))}
      >
        {open ? (
          <span className={styles.x} aria-hidden>
            ×
          </span>
        ) : live.playing ? (
          <span className={styles.bpm}>
            <i aria-hidden />
            {S.bpm}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            <path d="M5 7h14M5 12h14M5 17h9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
