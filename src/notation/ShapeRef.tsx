import { useShapeStyle } from '../state/prefs'
import s from './ShapeRef.module.css'

const NAMES = ['B', 'E', 'A', 'D', 'G']

export interface ShapeRefProps {
  /** Frets low string to high, e.g. "x-8-7-x-x"; "0" open, "h7" a harmonic. */
  shape: string
  /** The look: a = five cells, b = one line, c = a tiny neck and the frets. Default: the notebook's setting (a). */
  variant?: 'a' | 'b' | 'c'
}

const say = (toks: string[]) =>
  toks
    .map((t, i) => (t === 'x' ? '' : `${NAMES[i]} ${t.startsWith('h') ? `harmonic ${t.slice(1)}` : t === '0' ? 'open' : `fret ${t}`}`))
    .filter(Boolean)
    .join(', ')

/** A tiny neck: G on top, the frets the shape covers, a dot per note. */
function Glyph({ toks }: { toks: string[] }) {
  const frets = toks.filter((t) => t !== 'x' && t !== '0').map((t) => +t.replace('h', ''))
  const lo = frets.length ? Math.min(...frets) : 1
  const hi = frets.length ? Math.max(...frets) : 1
  const from = lo <= 2 ? 1 : lo
  const n = Math.max(3, hi - from + 1)
  const fw = 9
  const sp = 5
  const left = 5
  const W = left + n * fw + 2
  const H = 4 * sp + 6
  const y = (str: number) => 3 + (4 - str) * sp
  return (
    <svg className={s.glyph} viewBox={`0 0 ${W} ${H}`} style={{ width: `${W / 15}em` }} aria-hidden>
      {toks.map((t, i) => (
        <line key={i} className={t === 'x' ? s.gMute : s.gString} x1={left} y1={y(i)} x2={W - 1} y2={y(i)} />
      ))}
      {Array.from({ length: n + 1 }, (_, k) => (
        <line key={k} className={k === 0 && from === 1 ? s.gNut : s.gWire} x1={left + k * fw} y1={y(4)} x2={left + k * fw} y2={y(0)} />
      ))}
      {toks.map((t, i) => {
        if (t === 'x') return null
        if (t === '0') return <circle key={i} className={s.gOpen} cx={2} cy={y(i)} r={1.6} />
        const harm = t.startsWith('h')
        const f = +t.replace('h', '')
        const x = left + (f - from + (harm ? 1 : 0.5)) * fw
        return harm ? <path key={i} className={s.gOpen} d={`M${x} ${y(i) - 2.3} l2.3 2.3 l-2.3 2.3 l-2.3 -2.3 Z`} /> : <circle key={i} className={s.gDot} cx={x} cy={y(i)} r={2.1} />
      })}
    </svg>
  )
}

/** Text that is a chord shape: four or five fret tokens joined by hyphens. */
export const IS_SHAPE = /^(?:x|h?\d{1,2})(?:-(?:x|h?\d{1,2})){4}$/

/**
 * A chord shape named inside a sentence or under a diagram. One look for the whole notebook,
 * chosen in Settings: five cells (default), one line, or a tiny neck and the frets.
 */
export function ShapeRef({ shape, variant: given }: ShapeRefProps) {
  const [setting] = useShapeStyle()
  const variant = given ?? setting
  const toks = shape.split('-')
  const title = say(toks)
  const fret = (t: string) => (t === 'x' ? '×' : t.startsWith('h') ? `◇${t.slice(1)}` : t)
  if (variant === 'a')
    return (
      <span className={s.a} title={title}>
        {toks.map((t, i) => (
          <span key={i} className={t === 'x' ? s.aOff : s.aOn}>
            <i>{NAMES[i]}</i>
            <b>{fret(t)}</b>
          </span>
        ))}
      </span>
    )
  if (variant === 'b')
    return (
      <span className={s.b} title={title}>
        {toks.map((t, i) =>
          t === 'x' ? (
            <span key={i} className={s.bOff} />
          ) : (
            <span key={i} className={s.bOn}>
              <i>{NAMES[i]}</i>
              <b>{fret(t)}</b>
            </span>
          ),
        )}
      </span>
    )
  return (
    <span className={s.c} title={title}>
      <Glyph toks={toks} />
      <code>{shape}</code>
    </span>
  )
}
