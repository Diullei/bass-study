import { useLefty } from '../state/prefs'
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
  /** A natural harmonic touched over this fret: drawn as a diamond. */
  harmonic?: boolean
  /** An artificial harmonic: fretted here, touched twelve frets higher by the plucking hand. A diamond in the fret space, with "+12". */
  artificial?: boolean
  /** Sounding now: the red playback pen. */
  active?: boolean
  /** Fretting-hand finger, 1–4: a small pencil tag on the dot. */
  finger?: number
  /** A helper note around the shape (e.g. a scale note): smaller and lighter. `dashed` = a passing note. */
  ghost?: boolean
  dashed?: boolean
  /** Selected: a dashed halo around the dot. */
  picked?: boolean
  /** In a wrong place (e.g. mud with another note): a red ring and a "!" tag. */
  warn?: boolean
}

/** One finger laid flat across several strings at one fret (a barre). */
export interface FretBarre {
  fret: number
  /** Lowest and highest string it lies across. */
  from: number
  to: number
  finger?: number
  /** Lying over the fret wire (a row of harmonics touched by one finger). */
  harmonic?: boolean
}

/** The fretting hand under the neck: a bracket over the frets it covers, with the fingers that sit at each fret. */
export interface FretHand {
  /** Lowest and highest fret under a finger. */
  from: number
  to: number
  /** Fret → the fingers there, e.g. { 8: '1', 9: '2·3' }. */
  at: Record<number, string>
  /** Near the limit of the hand: the bracket is dashed. */
  stretch?: boolean
}

/** A shaded stretch of one string, e.g. a register band. */
export interface FretBand {
  str: number
  /** First and last fret of the stretch (inclusive). */
  from: number
  to: number
  /** A class for the fill, e.g. "band-bass". */
  cls: string
}

export interface FretboardProps {
  strings: 4 | 5
  from?: number
  to?: number
  dots: FretDot[]
  /** Strings that must not sound: an × left of the window. */
  muted?: number[]
  /** Shaded stretches behind the dots. */
  bands?: FretBand[]
  /** Flat fingers: a bar across the strings, behind the dots. */
  barres?: FretBarre[]
  /** Mark the hand under the neck: the frets it covers and the fingers at each one. */
  hand?: FretHand
  /** Mirror the neck (nut on the right), as a left-handed player sees it. Default: the notebook's left-handed setting. */
  lefty?: boolean
  /** Make the neck answerable: called with the string and fret of the place that was clicked. */
  onPick?: (str: number, fret: number) => void
  /** Make the dots clickable: called with the index of the dot in `dots`. */
  onDot?: (i: number) => void
  /** Number every fret, not only the inlay frets. */
  allNumbers?: boolean
  className?: string
}

const NAMES = { 4: ['E', 'A', 'D', 'G'], 5: ['B', 'E', 'A', 'D', 'G'] }
const INLAY = [3, 5, 7, 9, 15, 17, 19, 21]

/** A hand-drawn bass neck, G string on top (as in tab), with labelled dots. */
export function Fretboard({ strings, from = 0, to = 12, dots, muted = [], bands = [], barres = [], hand, lefty: leftyProp, allNumbers = false, onPick, onDot, className }: FretboardProps) {
  const [leftySetting] = useLefty()
  const lefty = leftyProp ?? leftySetting
  const n = to - (from === 0 ? 1 : from) + 1
  const fw = 46
  const sp = 24
  const marks = muted.length > 0 || (from === 0 && dots.some((d) => d.fret === 0))
  const left = marks ? 46 : 30
  const top = 14
  const W = left + n * fw + 8
  // room for the hand marker between the strings and the fret numbers
  const handH = hand ? 20 : 0
  const H = top + (strings - 1) * sp + 34 + handH
  const X = (x: number) => (lefty ? W - x : x)
  const yOf = (s: number) => top + (strings - 1 - s) * sp
  // the space for fret f lies between wire f-1 and wire f; the first space is fret `from` (or 1 after the nut)
  const first = from === 0 ? 1 : from
  const cx = (f: number) => (f === 0 ? left - 14 : left + (f - first + 0.5) * fw)
  const wireX = (f: number) => left + (f - first + 1) * fw
  const jit = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1 * 0.8
  const wires: number[] = []
  for (let f = first; f <= to; f++) wires.push(f)
  const inWindow = (f: number) => f === 0 ? from === 0 : f >= first && f <= to
  return (
    <svg className={`${styles.board} score ${className ?? ''}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Fretboard">
      {bands
        .filter((b) => b.str < strings && b.to >= first && b.from <= to)
        .map((b, i) => {
          const a = Math.max(b.from, first)
          const z = Math.min(b.to, to)
          const x0 = left + (a - first) * fw + 2
          const x1 = left + (z - first + 1) * fw - 2
          return <rect key={i} className={b.cls} x={Math.min(X(x0), X(x1))} y={yOf(b.str) - 8} width={x1 - x0} height={16} rx={6} />
        })}
      {/* nut or first wire */}
      <path className={from === 0 ? styles.nut : styles.wire} d={`M${X(left)} ${top - 4} L${X(left + jit(1))} ${yOf(0) + 4}`} />
      {wires.map((f) => (
        <path key={f} className={styles.wire} d={`M${X(wireX(f))} ${top - 4} Q${X(wireX(f) + jit(f))} ${(top + yOf(0)) / 2} ${X(wireX(f) - jit(f + 3))} ${yOf(0) + 4}`} />
      ))}
      {Array.from({ length: strings }, (_, s) => (
        <g key={s}>
          <path
            className={styles.string}
            style={{ strokeWidth: 1 + (strings - 1 - s) * 0.35 }}
            d={`M${X(left - 4)} ${yOf(s)} Q${W / 2} ${yOf(s) + jit(s + 7)} ${X(W - 6)} ${yOf(s)}`}
          />
          <text className={styles.sname} x={X(8)} y={yOf(s) + 4} textAnchor={lefty ? 'end' : 'start'}>
            {NAMES[strings][s]}
          </text>
          {muted.includes(s) && (
            <text className={styles.mute} x={X(left - 14)} y={yOf(s) + 5} textAnchor="middle">
              ×
            </text>
          )}
        </g>
      ))}
      {Array.from({ length: n }, (_, k) => first + k).map((f) => (
        <g key={f}>
          {(allNumbers || INLAY.includes(f) || f === 12) && (
            <text className={styles.fnum} x={X(cx(f))} y={H - 6} textAnchor="middle">
              {f}
            </text>
          )}
          {f === 12 && !allNumbers && (
            <text className={styles.inlay} x={X(cx(f))} y={H - 18} textAnchor="middle">
              ••
            </text>
          )}
        </g>
      ))}
      {barres
        .filter((b) => b.fret >= first && b.fret <= to)
        .map((b, i) => (
          <line key={i} className={styles.barre} x1={X(b.harmonic ? wireX(b.fret) : cx(b.fret))} y1={yOf(b.from)} x2={X(b.harmonic ? wireX(b.fret) : cx(b.fret))} y2={yOf(b.to)} />
        ))}
      {hand && hand.to >= first && hand.from <= to && (
        <g className={`${styles.hand} ${hand.stretch ? styles.handStretch : ''}`}>
          {(() => {
            const y = yOf(0) + 21
            const a = X(cx(Math.max(hand.from, first)) - fw / 2 + 6)
            const b = X(cx(Math.min(hand.to, to)) + fw / 2 - 6)
            return <path d={`M${a} ${y - 5} L${a} ${y} L${b} ${y} L${b} ${y - 5}`} />
          })()}
          {Object.entries(hand.at)
            .filter(([f]) => +f >= first && +f <= to)
            .map(([f, who]) => (
              <text key={f} x={X(cx(+f))} y={yOf(0) + 32} textAnchor="middle">
                {who}
              </text>
            ))}
        </g>
      )}
      {dots
        .map((d, i) => [d, i] as const)
        .filter(([d]) => inWindow(d.fret) && d.str < strings)
        .sort((a, b) => +!!b[0].ghost - +!!a[0].ghost)
        .map(([d, i]) => {
          const x = X(d.harmonic ? wireX(d.fret) : cx(d.fret))
          const y = yOf(d.str)
          return (
            <g
              key={i}
              className={`${d.pen ?? ''} ${d.root ? styles.root : ''} ${d.active ? styles.active : ''} ${d.ghost ? styles.aux : onDot ? styles.tap : ''} ${d.dashed ? styles.dashed : ''}`}
              {...(onDot && !d.ghost
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-pressed': !!d.picked,
                    'aria-label': `${NAMES[strings][d.str]} string, fret ${d.fret}: show what is clear with it`,
                    onClick: () => onDot(i),
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onDot(i)
                      }
                    },
                  }
                : {})}
            >
              {d.picked && <circle className={styles.halo} cx={x} cy={y} r={15} />}
              {d.warn && <circle className={styles.warnRing} cx={x} cy={y} r={14} />}
              {d.artificial ? (
                <>
                  <path className={styles.dot} d={`M${x} ${y - 12} L${x + 12} ${y} L${x} ${y + 12} L${x - 12} ${y} Z`} />
                  <text className={styles.art} x={x + (lefty ? 13 : -13)} y={y - 8} textAnchor="middle">
                    +12
                  </text>
                </>
              ) : d.harmonic ? (
                <path className={styles.dot} d={`M${x} ${y - 12} L${x + 12} ${y} L${x} ${y + 12} L${x - 12} ${y} Z`} />
              ) : d.ghost ? (
                // a helper note is a small square: never mistaken for a note of the shape
                <rect className={styles.dot} x={x - 7.8} y={y - 7.8} width={15.6} height={15.6} rx={3.2} />
              ) : (
                <circle className={styles.dot} cx={x} cy={y} r={10.5} />
              )}
              <text className={styles.dlab} x={x} y={y + (d.ghost ? 3 : 4)} textAnchor="middle">
                {d.label}
              </text>
              {d.warn && (
                <g className={styles.warnTag}>
                  <circle cx={x + (lefty ? 11 : -11)} cy={y - 9} r={5.6} />
                  <text x={x + (lefty ? 11 : -11)} y={y - 5.8} textAnchor="middle">
                    !
                  </text>
                </g>
              )}
              {d.finger ? (
                <g className={styles.finger}>
                  <circle cx={x + (lefty ? -11 : 11)} cy={y + 9} r={6.2} />
                  <text x={x + (lefty ? -11 : 11)} y={y + 12.4} textAnchor="middle">
                    {d.finger}
                  </text>
                </g>
              ) : null}
            </g>
          )
        })}
      {onPick &&
        Array.from({ length: strings }, (_, str) =>
          wires.map((f) => (
            <rect
              key={`${str}-${f}`}
              className={styles.pick}
              x={Math.min(X(cx(f) - fw / 2 + 1), X(cx(f) + fw / 2 - 1))}
              y={yOf(str) - sp / 2 + 1}
              width={fw - 2}
              height={sp - 2}
              rx={6}
              role="button"
              tabIndex={0}
              aria-label={`${NAMES[strings][str]} string, fret ${f}`}
              onClick={() => onPick(str, f)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPick(str, f)
                }
              }}
            />
          )),
        )}
    </svg>
  )
}
