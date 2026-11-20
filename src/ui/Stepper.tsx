import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import styles from './Stepper.module.css'
import { cx } from './cx'

export interface StepperProps {
  value: ReactNode
  onStep: (d: -1 | 1) => void
  /** Accessible name of the value, e.g. "Tempo". */
  label: string
  size?: 'sm' | 'lg'
  className?: string
}

/** A value written between ‹ and ›. Press and hold to keep stepping. */
export function Stepper({ value, onStep, label, size = 'sm', className }: StepperProps) {
  const hold = useRef(0)
  const stepRef = useRef(onStep)
  stepRef.current = onStep
  useEffect(() => () => clearTimeout(hold.current), [])
  const down = (d: -1 | 1) => (e: PointerEvent) => {
    e.preventDefault()
    stepRef.current(d)
    clearTimeout(hold.current)
    const rep = () => {
      stepRef.current(d)
      hold.current = window.setTimeout(rep, 70)
    }
    hold.current = window.setTimeout(rep, 420)
  }
  const up = () => clearTimeout(hold.current)
  const btn = (d: -1 | 1) => (
    <button
      type="button"
      className={styles.arrow}
      aria-label={`${d < 0 ? 'Less' : 'More'} ${label}`}
      onPointerDown={down(d)}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onStep(d))}
    >
      {d < 0 ? '‹' : '›'}
    </button>
  )
  return (
    <span className={cx(styles.stepper, size === 'lg' && styles.lg, className)} role="group" aria-label={label}>
      {btn(-1)}
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      {btn(1)}
    </span>
  )
}
