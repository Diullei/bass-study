import type { ReactNode } from 'react'
import styles from './IndexEntry.module.css'
import { cx } from './cx'

export interface IndexEntryProps {
  /** Written in red pen, e.g. "I." */
  number: ReactNode
  /** The entry name — pass a router <Link> to make it clickable. */
  title: ReactNode
  /** Right side of the dotted leader, e.g. "18 units". */
  meta?: ReactNode
  /** Not written yet: drawn faintly in pencil. */
  muted?: boolean
  /** Description and live status, on the ruled lines below. */
  children?: ReactNode
}

/** One line of a table of contents: number, title, dotted leader, page. */
export function IndexEntry({ number, title, meta, muted, children }: IndexEntryProps) {
  return (
    <li className={cx(styles.entry, muted && styles.muted)}>
      <div className={styles.line}>
        <span className={styles.num}>{number}</span>
        {/* the title fills the line; its dotted leader runs from the end of its last line to the meta */}
        <span className={styles.title}>
          <span className={styles.text}>{title}</span>
        </span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>
      {children && <div className={styles.body}>{children}</div>}
    </li>
  )
}

/** The list that holds IndexEntry lines. */
export const IndexList = ({ children }: { children: ReactNode }) => <ol className={styles.list}>{children}</ol>
