import { useEffect, useState } from 'react'
import { IntervalRuler } from './IntervalRuler'
import s from './IntervalRuler.module.css'

/** The interval ruler, one click away on every page: a sticky note in the corner that opens a small card. Esc closes it. */
export function IntervalWidget() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open])
  return (
    <>
      <button type="button" className={s.fab} onClick={() => setOpen((o) => !o)} title="Interval ruler: degrees and half steps" aria-expanded={open}>
        <span aria-hidden>↔</span> Intervals
      </button>
      {open && (
        <aside className={s.panel} aria-label="Interval ruler">
          <div className={s.panelHead}>
            <span>↔ Interval ruler</span>
            <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <IntervalRuler />
        </aside>
      )}
    </>
  )
}
