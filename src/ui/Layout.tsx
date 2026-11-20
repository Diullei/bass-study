import type { HTMLAttributes } from 'react'
import styles from './Layout.module.css'
import { cx } from './cx'

/** Horizontal group of controls that wraps on small screens. */
export const Row = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(styles.row, className)} {...rest} />
)

/** Responsive grid of form fields. */
export const FieldGrid = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(styles.grid, className)} {...rest} />
)

/** A block of the page with consistent spacing below. */
export const Section = ({ className, ...rest }: HTMLAttributes<HTMLElement>) => (
  <section className={cx(styles.section, className)} {...rest} />
)
