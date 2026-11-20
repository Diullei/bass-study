import type { HTMLAttributes } from 'react'
import styles from './Paper.module.css'
import { cx } from './cx'

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  /** Two strips of tape holding the sheet down. */
  tape?: boolean
  tilt?: 'none' | 'left' | 'right'
  /** Small pencil note in the corner. */
  label?: string
}

/** A sheet of manuscript paper — holds notation. */
export function Paper({ tape, tilt = 'none', label, className, children, ...rest }: PaperProps) {
  return (
    <div
      className={cx(styles.paper, tape && styles.tape, tilt !== 'none' && styles[`tilt-${tilt}`], className)}
      {...rest}
    >
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </div>
  )
}
