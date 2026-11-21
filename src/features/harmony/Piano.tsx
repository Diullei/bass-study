import { cx } from '../../ui'
import s from './Harmony.module.css'

export interface KeyMark {
  midi: number
  label: string
  /** Pen class: '', pen-green, pen-purple, pen-blue. */
  pen?: string
  /** Drawn filled: the root. */
  root?: boolean
}

const WHITE = [0, 2, 4, 5, 7, 9, 11]
const isBlack = (m: number) => !WHITE.includes(((m % 12) + 12) % 12)

/** A hand-drawn keyboard with labelled notes. `active` marks (indexes) get the red playback pen. */
export function Piano({ from, octaves = 2, marks, active = [] }: { from: number; octaves?: number; marks: KeyMark[]; active?: number[] }) {
  const ww = 24
  const wh = 96
  const bw = 15
  const bh = 58
  const whites: number[] = []
  for (let m = from; m < from + octaves * 12 + 1; m++) if (!isBlack(m)) whites.push(m)
  const xOf = (m: number) => {
    if (!isBlack(m)) return whites.indexOf(m) * ww
    return whites.indexOf(m - 1) * ww + ww - bw / 2
  }
  const W = whites.length * ww + 2
  return (
    <svg className={s.piano} viewBox={`-1 -1 ${W} ${wh + 4}`} role="img" aria-label={`Keyboard: ${marks.map((k) => k.label).join(', ')}`}>
      {whites.map((m) => (
        <rect key={m} className={s.white} x={xOf(m)} y={0} width={ww} height={wh} rx={3} />
      ))}
      {Array.from({ length: octaves * 12 + 1 }, (_, i) => from + i)
        .filter(isBlack)
        .map((m) => (
          <rect key={m} className={s.black} x={xOf(m)} y={0} width={bw} height={bh} rx={2} />
        ))}
      {marks.map((k, i) => {
        const b = isBlack(k.midi)
        const cxp = xOf(k.midi) + (b ? bw : ww) / 2
        const cy = b ? bh - 13 : wh - 15
        return (
          <g key={i} className={cx(k.pen, k.root && s.keyRoot, active.includes(i) && s.keyOn)}>
            <circle className={s.keyDot} cx={cxp} cy={cy} r={10} />
            <text className={s.keyLab} x={cxp} y={cy + 4} textAnchor="middle">
              {k.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
