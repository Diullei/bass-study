import type { ReactNode } from 'react'
import styles from './Text.module.css'

/** The opening paragraph of a page. */
export const Lead = ({ children }: { children: ReactNode }) => <p className={styles.lead}>{children}</p>

/** A bulleted list of facts, each marked with a little ♪. */
export const FactList = ({ items }: { items: ReactNode[] }) =>
  items.length ? (
    <ul className={styles.facts}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  ) : null

/** Secondary text written in pencil (status lines, hints). */
export const PencilNote = ({ children }: { children: ReactNode }) => <div className={styles.pencil}>{children}</div>

/** A correction or encouragement in red pen. Keeps its height when empty. */
export const PenMessage = ({ children }: { children?: ReactNode }) => (
  <div className={styles.pen} aria-live="polite">
    {children}
  </div>
)

/** Yellow highlighter over important words. */
export const Marker = ({ children }: { children: ReactNode }) => <mark className={styles.marker}>{children}</mark>

export const Kbd = ({ children }: { children: ReactNode }) => <kbd className={styles.kbd}>{children}</kbd>
