import styles from './Fretboard.module.css'

export interface FretDot {
  /** String index, 0 = lowest (B on a 5-string, E on a 4-string). */
  str: number
  fret: number
  /** Text inside the dot, e.g. an interval. */
  label: string
  /** Pen class (see notation.css), e.g. "pen-green". */
  pen?: string
  /** Drawn filled: the root of the shape. */
  root?: boolean
}

export interface FretboardProps {
  strings: 4 | 5
  from?: number
  to?: number
  dots: FretDot[]
  className?: string
}

const NAMES = { 4: ['E', 'A', 'D', 'G'], 5: ['B', 'E', 'A', 'D', 'G'] }
const INLAY = [3, 5, 7, 9, 15, 17]

/** A hand-drawn bass neck, G string on top (as in tab), with labelled dots. */
export function Fretboard({ strings, from = 0, to = 12, dots, className }: FretboardProps) {
  const n = to - (from === 0 ? 1 : from) + 1
  const fw = 46
  const sp = 24
  const left = 30
  const top = 14
  const W = left + n * fw + 8
  const H = top + (strings - 1) * sp + 34
  const yOf = (s: number) => top + (strings - 1 - s) * sp
  // the space for fret f lies between wire f-1 and wire f; the first space is fret `from` (or 1 after the nut)
  const first = from === 0 ? 1 : from
  const cx = (f: number) => (f === 0 ? left - 13 : left + (f - first + 0.5) * fw)
  const wireX = (f: number) => left + (f - first + 1) * fw
  const jit = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1 * 0.8
  const wires: number[] = []
  for (let f = first; f <= to; f++) wires.push(f)
  return (
    <svg className={`${styles.board} score ${className ?? ''}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Fretboard">
      {/* nut or first wire */}
      <path className={from === 0 ? styles.nut : styles.wire} d={`M${left} ${top - 4} L${left + jit(1)} ${yOf(0) + 4}`} />
      {wires.map((f) => (
        <path key={f} className={styles.wire} d={`M${wireX(f)} ${top - 4} Q${wireX(f) + jit(f)} ${(top + yOf(0)) / 2} ${wireX(f) - jit(f + 3)} ${yOf(0) + 4}`} />
      ))}
      {Array.from({ length: strings }, (_, s) => (
        <g key={s}>
          <path className={styles.string} style={{ strokeWidth: 1 + (strings - 1 - s) * 0.35 }} d={`M${left - 4} ${yOf(s)} Q${W / 2} ${yOf(s) + jit(s + 7)} ${W - 6} ${yOf(s)}`} />
          <text className={styles.sname} x={8} y={yOf(s) + 4}>
            {NAMES[strings][s]}
          </text>
        </g>
      ))}
      {Array.from({ length: n }, (_, k) => from + k)
        .filter((f) => f > 0)
        .map((f) => (
          <g key={f}>
            {(INLAY.includes(f) || f === 12) && (
              <text className={styles.fnum} x={cx(f)} y={H - 6} textAnchor="middle">
                {f}
              </text>
            )}
            {f === 12 && <text className={styles.inlay} x={cx(f)} y={H - 18} textAnchor="middle">••</text>}
          </g>
        ))}
      {dots
        .filter((d) => d.fret >= from && d.fret <= to && d.str < strings)
        .map((d, i) => (
          <g key={i} className={`${d.pen ?? ''} ${d.root ? styles.root : ''}`}>
            <circle className={styles.dot} cx={cx(d.fret)} cy={yOf(d.str)} r={10.5} />
            <text className={styles.dlab} x={cx(d.fret)} y={yOf(d.str) + 4} textAnchor="middle">
              {d.label}
            </text>
          </g>
        ))}
    </svg>
  )
}
