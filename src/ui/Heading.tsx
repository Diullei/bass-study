import type { ReactNode } from 'react'
import styles from './Heading.module.css'

/** Small pencil heading above a title, e.g. the unit name. */
export const UnitLabel = ({ children }: { children: ReactNode }) => <div className={styles.unit}>{children}</div>

/** The page title. `number` is written in red pen. */
export function PageTitle({ number, children, tags }: { number?: ReactNode; children: ReactNode; tags?: ReactNode }) {
  return (
    <h2 className={styles.title}>
      {number != null && <span className={styles.num}>{number}</span>}
      {children}
      {tags && <span className={styles.tags}>{tags}</span>}
    </h2>
  )
}

/** A section heading, underlined by hand. */
export const SectionTitle = ({ children }: { children: ReactNode }) => <h3 className={styles.section}>{children}</h3>
