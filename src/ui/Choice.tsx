import type { ReactNode } from 'react'
import styles from './Choice.module.css'
import { cx } from './cx'

export type ChoiceState = 'idle' | 'right' | 'wrong'

export interface ChoiceProps {
  children: ReactNode
  state?: ChoiceState
  disabled?: boolean
  onClick?: () => void
}

/** A quiz answer. Right answers get circled in green, wrong ones crossed out in red. */
export const Choice = ({ children, state = 'idle', disabled, onClick }: ChoiceProps) => (
  <button
    type="button"
    className={cx(styles.choice, state !== 'idle' && styles[state])}
    disabled={disabled}
    onClick={onClick}
    aria-pressed={state !== 'idle'}
  >
    {children}
  </button>
)

export const ChoiceList = ({ children }: { children: ReactNode }) => <div className={styles.list}>{children}</div>
