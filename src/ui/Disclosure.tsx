import type { ReactNode } from 'react'
import styles from './Disclosure.module.css'

/** A fold-out section, framed in dashed pencil. */
export const Disclosure = ({ summary, children, open }: { summary: ReactNode; children: ReactNode; open?: boolean }) => (
  <details className={styles.details} open={open}>
    <summary className={styles.summary}>{summary}</summary>
    <div className={styles.body}>{children}</div>
  </details>
)
