import type { ReactNode } from 'react'
import styles from './StickyNote.module.css'
import { cx } from './cx'

export interface StickyNoteProps {
  title: ReactNode
  children?: ReactNode
  /** Usually a button. */
  action?: ReactNode
  tone?: 'yellow' | 'success'
}

/** A sticky note stuck on the page — goals, reminders, "well done". */
export function StickyNote({ title, children, action, tone = 'yellow' }: StickyNoteProps) {
  return (
    <div className={cx(styles.note, tone === 'success' && styles.success)} role="status">
      <span className={styles.title}>{title}</span>
      {children && <span className={styles.body}>{children}</span>}
      {action}
    </div>
  )
}
