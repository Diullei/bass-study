import { useLefty } from '../state/prefs'
import styles from './Fretboard.module.css'

/** Finger number, name, and the centre of its fingertip in the drawing. */
const FINGERS: [number, string, number, number][] = [
  [1, 'index', 30.5, 27],
  [2, 'middle', 46.5, 19],
  [3, 'ring', 62.5, 25],
  [4, 'little finger', 78, 39],
]

/** One outline for the whole hand (a left hand, palm towards you: thumb on the left). */
const HAND = [
  'M34 93',
  'Q24 93 24 81', // heel of the hand
  'L24 71',
  'Q13 66 6 51', // thumb, outer side
  'Q3 40 10 39', // thumb tip
  'Q16 39 19 49', // thumb, inner side
  'L24 57',
  'L24 23 Q24 16 30.5 16 Q37 16 37 23', // index
  'L37 47 Q38.5 50 40 47',
  'L40 15 Q40 8 46.5 8 Q53 8 53 15', // middle
  'L53 47 Q54.5 50 56 47',
  'L56 21 Q56 14 62.5 14 Q69 14 69 21', // ring
  'L69 49 Q70.5 52 72 49',
  'L72 35 Q72 28 78 28 Q84 28 84 35', // little finger
  'L84 81 Q84 93 74 93',
  'Z',
].join(' ')

/**
 * Which finger is which number: the fretting hand, palm towards you, with the numbers on the fingertips.
 * The fretting hand is the left hand for a right-handed player and the right hand in the left-handed view.
 */
export function FingerKey({ lefty: leftyProp, className }: { lefty?: boolean; className?: string }) {
  const [setting] = useLefty()
  const lefty = leftyProp ?? setting
  const W = 90
  const X = (x: number) => (lefty ? W - x : x)
  return (
    <span className={`${styles.fingerKey} ${className ?? ''}`}>
      <svg viewBox={`0 0 ${W} 98`} width={88} height={96} role="img" aria-label="The fretting hand: 1 index, 2 middle, 3 ring, 4 little finger">
        <path className={styles.palm} d={HAND} transform={lefty ? `translate(${W} 0) scale(-1 1)` : undefined} />
        {FINGERS.map(([n, , x, y]) => (
          <g key={n}>
            <circle className={styles.tip} cx={X(x)} cy={y} r={6} />
            <text className={styles.tipNum} x={X(x)} y={y + 3.5} textAnchor="middle">
              {n}
            </text>
          </g>
        ))}
        <text className={styles.thumbT} x={X(11.5)} y={51} textAnchor="middle">
          T
        </text>
      </svg>
      <span className={styles.fingerNames}>
        <b>fretting hand</b>
        {FINGERS.map(([n, name]) => (
          <span key={n}>
            <i>{n}</i> {name}
          </span>
        ))}
        <span className={styles.fingerWide}>
          <i>T</i> thumb, behind the neck
        </span>
      </span>
    </span>
  )
}
