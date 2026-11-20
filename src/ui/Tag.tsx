import type { ReactNode } from 'react'
import styles from './Tag.module.css'
import { cx } from './cx'

export type TagTone = 'pencil' | 'red' | 'blue' | 'green'

/** A small rubber stamp: "theory", "song", "chart". */
export const Tag = ({ tone = 'pencil', children }: { tone?: TagTone; children: ReactNode }) => (
  <span className={cx(styles.tag, tone !== 'pencil' && styles[tone])}>{children}</span>
)
