import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import styles from './Form.module.css'
import { cx } from './cx'

/** A labelled form field: pencil label above, the control written on a line. */
export const Field = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <label className={styles.field}>
    {label}
    {children}
  </label>
)

export interface Option {
  value: string
  label: string
}
export interface OptionGroup {
  label: string
  options: Option[]
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: Option[]
  groups?: OptionGroup[]
  onChange?: (value: string) => void
}

export function Select({ options, groups, onChange, className, ...rest }: SelectProps) {
  return (
    <select className={cx(styles.select, className)} onChange={(e) => onChange?.(e.target.value)} {...rest}>
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {groups?.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange?: (value: number) => void
}

export const NumberInput = ({ onChange, className, ...rest }: NumberInputProps) => (
  <input
    type="number"
    className={cx(styles.number, className)}
    onChange={(e) => onChange?.(+e.target.value)}
    {...rest}
  />
)

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: ReactNode
  onChange?: (checked: boolean) => void
}

/** A hand-drawn box, ticked in red pen. */
export const Checkbox = ({ label, onChange, ...rest }: CheckboxProps) => (
  <label className={styles.check}>
    <input type="checkbox" onChange={(e) => onChange?.(e.target.checked)} {...rest} />
    <span className={styles.box} aria-hidden />
    {label}
  </label>
)

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange?: (value: number) => void
}

export const Slider = ({ onChange, className, ...rest }: SliderProps) => (
  <input type="range" className={cx(styles.slider, className)} onChange={(e) => onChange?.(+e.target.value)} {...rest} />
)
