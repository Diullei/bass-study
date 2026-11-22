import { Fretboard, type FretDot } from './Fretboard'

export interface ChordShapeProps {
  /** Frets low string to high, e.g. "x-8-x-9-9"; "0" open, "h7" a harmonic over fret 7. */
  shape: string
  /** One label per sounding note, low to high (a degree like "3" or "♭7"). */
  labels?: string[]
  /** One pen class per sounding note (see notation.css). */
  pens?: (string | undefined)[]
  /** Which sounding notes are roots (drawn filled). */
  roots?: boolean[]
  /** Indexes of the sounding notes playing now (red pen). */
  active?: number[]
  /** Mirror for a left-handed player. */
  lefty?: boolean
  /** At least this many frets in the window (default 4). */
  minFrets?: number
  className?: string
}

/** Fret tokens → sounding notes: { str, fret, harmonic }. */
export function shapeDots(shape: string) {
  const out: { str: number; fret: number; harmonic: boolean }[] = []
  shape.split('-').forEach((t, str) => {
    if (t === 'x' || t === '') return
    if (t.startsWith('h')) out.push({ str, fret: +t.slice(1), harmonic: true })
    else out.push({ str, fret: +t, harmonic: false })
  })
  return out
}

/**
 * A chord shape on a short piece of the neck: the window fits the shape, muted strings get an ×,
 * harmonics are diamonds over the fret wire. Every fret of the window is numbered, so a shape can be found at once.
 */
export function ChordShape({ shape, labels, pens, roots, active = [], lefty, minFrets = 4, className }: ChordShapeProps) {
  const toks = shape.split('-')
  const strings = toks.length === 4 ? 4 : 5
  const notes = shapeDots(shape)
  const frets = notes.filter((n) => n.fret > 0).map((n) => n.fret)
  const hasOpen = notes.some((n) => !n.harmonic && n.fret === 0)
  const lo = frets.length ? Math.min(...frets) : 1
  const hi = frets.length ? Math.max(...frets) : 4
  const from = hasOpen || lo <= 2 ? 0 : lo - 1
  const to = Math.max(hi + 1, (from || 1) + minFrets - 1)
  const muted = toks.map((t, i) => (t === 'x' ? i : -1)).filter((i) => i >= 0)
  const dots: FretDot[] = notes.map((n, i) => ({
    str: n.str,
    fret: n.fret,
    harmonic: n.harmonic,
    label: labels?.[i] ?? '',
    pen: pens?.[i],
    root: roots?.[i],
    active: active.includes(i),
  }))
  return <Fretboard strings={strings} from={from} to={to} dots={dots} muted={muted} lefty={lefty} allNumbers className={className} />
}
