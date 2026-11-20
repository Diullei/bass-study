import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'
import { cx } from './cx'

export type ButtonVariant = 'default' | 'ink' | 'pencil' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** default = pen outline · ink = filled, the main action · pencil = secondary · ghost = text link */
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  /** Square button for a single symbol (◀ ▶ ×). */
  icon?: boolean
}

export function Button({ variant = 'default', size = 'md', icon, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        styles.button,
        variant !== 'default' && styles[variant],
        size === 'sm' && styles.small,
        icon && styles.icon,
        className,
      )}
      {...rest}
    />
  )
}
