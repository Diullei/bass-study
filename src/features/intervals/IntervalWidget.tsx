import { useEffect, useState } from 'react'
import { KEYS, load, store } from '../../state/storage'
import { useFloating } from '../../ui'
import { IntervalRuler } from './IntervalRuler'
import s from './IntervalRuler.module.css'

interface Saved {
  open: boolean
  pick: number
}

/**
 * The interval ruler, one click away on every page: a sticky note in the corner that opens a small card.
 * The card can be dragged by its title bar; where it was left, whether it was open and the degree picked
 * are remembered in this browser. Esc closes it; double-click the title bar to send it back to its corner.
 */
export function IntervalWidget() {
  const [st, setSt] = useState<Saved>(() => ({ open: false, pick: 10, ...load<Partial<Saved>>(KEYS.intervals, {}) }))
  const F = useFloating<HTMLElement>(KEYS.intervalsPos, st.open)
  const set = (p: Partial<Saved>) =>
    setSt((cur) => {
      const next = { ...cur, ...p }
      store(KEYS.intervals, next)
      return next
    })
  useEffect(() => {
    if (!st.open) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') set({ open: false })
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [st.open])
  return (
    <>
      <button type="button" className={s.fab} onClick={() => set({ open: !st.open })} title="Interval ruler: degrees and half steps" data-hint="degrees and half steps" aria-expanded={st.open}>
        <span aria-hidden>↔</span>
        <span>Intervals</span>
      </button>
      {st.open && (
        <aside ref={F.ref} className={s.panel} style={F.style} aria-label="Interval ruler">
          <div className={s.panelHead} {...F.handle} onDoubleClick={F.reset} title="Drag to move · double-click to put it back">
            <span>
              <span className={s.grip} aria-hidden>
                ⠿
              </span>{' '}
              ↔ Interval ruler
            </span>
            <button type="button" className={s.close} onClick={() => set({ open: false })} aria-label="Close">
              ×
            </button>
          </div>
          <IntervalRuler value={st.pick} onChange={(pick) => set({ pick })} />
        </aside>
      )}
    </>
  )
}
