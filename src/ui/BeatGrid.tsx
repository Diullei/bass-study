import { cx } from './cx'
import styles from './BeatGrid.module.css'

export interface BeatGridRow {
  /** Who plays the row, e.g. "T" or "fingers". */
  label: string
  /** One cell per step: text for a hit ("●", "R", "roll"), null for silence. */
  cells: (string | null)[]
  /** Accented steps (drawn in ink, bold). */
  accents?: number[]
}

export interface BeatGridProps {
  rows: BeatGridRow[]
  /** Steps per beat (2 = eighths). */
  perBeat?: number
  /** Beats per bar, for the bar lines. */
  beatsPerBar?: number
  /** The step sounding now (red pen). */
  at?: number | null
  className?: string
}

/**
 * A rhythm written on squared paper: one row per hand or finger, one column per step,
 * counted "1 & 2 & …". The step that sounds is circled in red during playback.
 */
export function BeatGrid({ rows, perBeat = 2, beatsPerBar = 4, at = null, className }: BeatGridProps) {
  const steps = Math.max(...rows.map((r) => r.cells.length))
  const count = (i: number) => {
    const k = i % perBeat
    const beat = Math.floor(i / perBeat) % beatsPerBar
    return k === 0 ? String(beat + 1) : perBeat === 2 ? '&' : ['', 'e', '&', 'a'][k]
  }
  const barStart = (i: number) => i > 0 && i % (perBeat * beatsPerBar) === 0
  return (
    <div className={cx(styles.wrap, className)}>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th />
            {Array.from({ length: steps }, (_, i) => (
              <th key={i} className={cx(i % perBeat === 0 && styles.onBeat, barStart(i) && styles.bar, at === i && styles.now)}>
                {count(i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {Array.from({ length: steps }, (_, i) => (
                <td key={i} className={cx(barStart(i) && styles.bar, at === i && styles.now, r.accents?.includes(i) && styles.acc)}>
                  {r.cells[i] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
