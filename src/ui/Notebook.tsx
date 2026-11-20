import type { HTMLAttributes } from 'react'
import styles from './Notebook.module.css'
import { cx } from './cx'

/** The ruled notebook page every screen is written on. */
export function Notebook({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.page, className)} {...rest} />
}
