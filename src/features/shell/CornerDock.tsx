import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './CornerDock.module.css'

/**
 * The corner of the notebook where the tools live (intervals, metronome, settings).
 * Minimized, their sticky notes are a small pile of icon tabs. Hovering the pile, tapping it, or tabbing into it
 * fans the notes out with their names; they fold back a moment after the pointer leaves, a few seconds after a tap,
 * and right after one is chosen.
 *
 * Children are the tools themselves: each renders its note (a <button>) first, which the dock lays out, and its
 * own floating window, which stays positioned by itself.
 */
export function CornerDock({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const timer = useRef(0)
  const hold = () => window.clearTimeout(timer.current)
  const foldIn = (ms: number) => {
    hold()
    timer.current = window.setTimeout(() => setOpen(false), ms)
  }
  useEffect(() => hold, [])
  // the tools' windows are children of the dock too: only the notes themselves count
  const onNote = (e: { target: EventTarget; currentTarget: EventTarget }) => {
    const b = (e.target as HTMLElement).closest?.('button')
    return !!b && b.parentElement === e.currentTarget
  }
  return (
    <div
      className={`${styles.dock} ${open ? styles.open : ''}`}
      // a mouse: open while it is over the notes, fold soon after it leaves them
      onPointerOver={(e) => {
        if (e.pointerType !== 'mouse') return
        if (onNote(e)) {
          hold()
          setOpen(true)
        } else foldIn(900)
      }}
      onPointerLeave={(e) => e.pointerType === 'mouse' && foldIn(900)}
      // the keyboard: open while focus is on a note
      onFocus={(e) => {
        if (!onNote(e)) return
        hold()
        setOpen(true)
      }}
      onBlur={(e) => onNote(e) && foldIn(2500)}
      // a note was chosen: fold away shortly
      onClick={(e) => onNote(e) && foldIn(700)}
    >
      {children}
      {!open && (
        // a finger first opens the stack; the second tap picks a note (the icon tabs are too small to aim at)
        <button
          type="button"
          className={styles.cover}
          tabIndex={-1}
          aria-label="Show the tools: intervals, metronome, settings"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
            foldIn(5000)
          }}
        />
      )}
    </div>
  )
}
