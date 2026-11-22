import { Fretboard, type FretDot } from './Fretboard'
import { shapeDots } from './ChordShape'
import { useLefty } from '../state/prefs'
import styles from './Fretboard.module.css'

export interface MoveShape {
  shape: string
  /** One label per sounding note, low to high. */
  labels?: string[]
  pens?: (string | undefined)[]
  roots?: boolean[]
}

export interface ShapeMoveProps {
  from: MoveShape
  to: MoveShape
  lefty?: boolean
  className?: string
}

const OPEN = [23, 28, 33, 38, 43]

export interface Move {
  /** Sounding-note index in `from` and in `to`. */
  a: number
  b: number
  /** Semitones the voice moves (0 = held). */
  semis: number
  /** Same string and fret: the finger stays down. */
  held: boolean
}

/**
 * Pair the voices of two shapes, low to high (the bottom voice goes to the bottom voice …).
 * Extra notes in the longer shape have no partner.
 */
export function pairVoices(from: string, to: string): Move[] {
  const A = shapeDots(from)
  const B = shapeDots(to)
  const pitch = (n: { str: number; fret: number }) => OPEN[n.str] + n.fret
  const out: Move[] = []
  const k = Math.min(A.length, B.length)
  // when the counts differ, keep the top voices paired: they are the ones the ear follows
  const offA = A.length - k
  const offB = B.length - k
  for (let i = 0; i < k; i++) {
    const a = A[i + offA]
    const b = B[i + offB]
    out.push({ a: i + offA, b: i + offB, semis: pitch(b) - pitch(a), held: a.str === b.str && a.fret === b.fret })
  }
  return out
}

/**
 * Two consecutive shapes on one neck: the first in pencil, the second in ink, an arrow for every finger that moves.
 * A ring marks a finger that stays down (a common tone, Law 4); half-step moves are labelled.
 */
export function ShapeMove({ from, to, lefty: leftyProp, className }: ShapeMoveProps) {
  const [leftySetting] = useLefty()
  const lefty = leftyProp ?? leftySetting
  const A = shapeDots(from.shape)
  const B = shapeDots(to.shape)
  const all = [...A, ...B].filter((n) => n.fret > 0).map((n) => n.fret)
  const lo = all.length ? Math.min(...all) : 1
  const hi = all.length ? Math.max(...all) : 4
  const open = [...A, ...B].some((n) => n.fret === 0 && !n.harmonic)
  const start = open || lo <= 2 ? 0 : lo - 1
  const end = Math.max(hi + 1, (start || 1) + 3)
  const moves = pairVoices(from.shape, to.shape)
  const heldB = new Set(moves.filter((m) => m.held).map((m) => m.b))
  const heldA = new Set(moves.filter((m) => m.held).map((m) => m.a))
  const ghost: FretDot[] = A.map((n) => ({ str: n.str, fret: n.fret, harmonic: n.harmonic, label: '', pen: styles.ghost })).filter((_, i) => !heldA.has(i))
  const solid: FretDot[] = B.map((n, i) => ({
    str: n.str,
    fret: n.fret,
    harmonic: n.harmonic,
    label: to.labels?.[i] ?? '',
    pen: `${to.pens?.[i] ?? ''} ${heldB.has(i) ? styles.held : ''}`,
    root: to.roots?.[i],
  }))
  const muted = to.shape.split('-').map((t, i) => (t === 'x' ? i : -1)).filter((i) => i >= 0)
  // geometry, mirrored from Fretboard: kept in sync on purpose
  const fw = 46
  const sp = 24
  const left = muted.length || (start === 0 && [...A, ...B].some((d) => d.fret === 0)) ? 46 : 30
  const first = start === 0 ? 1 : start
  const n = end - first + 1
  const W = left + n * fw + 8
  const X = (x: number) => (lefty ? W - x : x)
  const cx = (f: number) => (f === 0 ? left - 14 : left + (f - first + 0.5) * fw)
  const yOf = (s: number) => 14 + (4 - s) * sp
  const arrows = moves.filter((m) => !m.held)
  return (
    <div className={`${styles.moveWrap} ${className ?? ''}`}>
      <Fretboard strings={5} from={start} to={end} dots={[...ghost, ...solid]} muted={muted} lefty={lefty} allNumbers />
      <svg className={styles.moveLayer} viewBox={`0 0 ${W} ${14 + 4 * sp + 34}`} aria-hidden>
        <defs>
          <marker id="mv-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
          </marker>
        </defs>
        {arrows.map((m, i) => {
          const a = A[m.a]
          const b = B[m.b]
          let x1 = X(cx(a.fret))
          let y1 = yOf(a.str)
          let x2 = X(cx(b.fret))
          let y2 = yOf(b.str)
          const d = Math.hypot(x2 - x1, y2 - y1)
          if (d < 1) return null
          // stop at the dot edges
          const ux = (x2 - x1) / d
          const uy = (y2 - y1) / d
          x1 += ux * 11
          y1 += uy * 11
          x2 -= ux * 12
          y2 -= uy * 12
          const bend = a.str === b.str ? -9 : 0
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 + bend
          const half = Math.abs(m.semis) === 1
          return (
            <g key={i} className={half ? styles.moveHalf : styles.move}>
              <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} markerEnd="url(#mv-head)" />
              {half && (
                <text x={mx} y={my - 4} textAnchor="middle">
                  ½
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
