import type { ReactNode } from 'react'
import { Link } from 'react-router'
import styles from './NotebookHeader.module.css'

/**
 * The sticky bar at the top of every section page: "𝄢 Bass Study / Section", the section's own
 * controls, and the way back to the contents. Sits inside a <Notebook>.
 */
export function NotebookHeader({ section, children, aside }: { section?: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} title="Back to the contents">
        <span className={styles.clef} aria-hidden>
          𝄢
        </span>
        <span className={styles.book}>Bass Study</span>
      </Link>
      {section && (
        <span className={styles.section}>
          <span className={styles.slash}>/</span>
          {section}
        </span>
      )}
      {children}
      <span className={styles.spacer} />
      {aside}
      <Link to="/" className={styles.link}>
        contents
      </Link>
    </header>
  )
}
